/* eslint-disable @typescript-eslint/no-explicit-any */
import AppError from "../../errorHelpers/AppError";
import { IRide } from "./ride.interface";
import httpStatus from "http-status-codes";
import { Ride } from "./ride.model";
import { calculateFare } from "../../utils/fareCalculat";
import { Driver } from "../driver/driver.model";
import { User } from "../user/user.model";

const rideCreate = async (payload: IRide) => {
  const { riderId, pickupLocation, destination, ...rest } = payload;
  if (!payload.pickupLocation || !payload.destination) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Pickup location and destination are required"
    );
  }
  const isRiderExist = await User.findOne({ _id: riderId });

  if (!isRiderExist) {
    throw new AppError(httpStatus.BAD_REQUEST, "rider does not exist");
  }
  const activeRide = await Ride.findOne({
    riderId,
    status: { $in: ["requested", "accepted", "picked_up", "in_transit"] },
  });

  if (activeRide) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "You already have an active ride. Complete or cancel it first."
    );
  }

  const fare = calculateFare(
    pickupLocation?.coordinates,
    destination?.coordinates
  );

  const ride = await Ride.create({
    riderId,
    pickupLocation,
    destination,
    ...rest,
    fare,
    requestedAt: new Date(),
  });

  return {
    data: ride,
  };
};

const acceptRide = async (params: any, driverId: string) => {
  const { rideId } = params;
  const driver = await Driver.findOne({ userId: driverId });

  if (!driver) {
    throw new Error("Driver not found");
  }

  if (!driver.isApproved) {
    throw new Error("Driver not approved. Contact admin for approval.");
  }

  if (!driver.isOnline) {
    throw new Error("Driver is offline. Set status to online first.");
  }

  if (driver.currentRideId) {
    throw new Error("Driver already has an active ride");
  }

  const ride = await Ride.findById(rideId);
  if (!ride) {
    throw new Error("Ride not found");
  }

  if (ride.status !== "requested") {
    throw new Error(`Ride is not available. Current status: ${ride.status}`);
  }

  ride.driverId = driverId;
  ride.status = "accepted";
  ride.acceptedAt = new Date();
  await ride.save();

  driver.currentRideId = rideId;
  await driver.save();

  return await ride.populate([
    { path: "riderId", select: "name phone" },
    { path: "driverId", select: "name phone vehicleInfo" },
  ]);
};
const getCurrentRide = async (driverId: string) => {
 
  const activeStatuses = ["accepted", "picked_up", "in_transit"];

  const ride = await Ride.findOne({
    driverId: driverId,
    status: { $in: activeStatuses },
  }).sort({ updatedAt: -1 }); 

  return ride;

};

const updateRideStatus = async (
  params: any,
  driverId: string,
  payload: any
) => {
  const { rideId } = params;
  const { status } = payload;

  const ride = await Ride.findOne({ _id: rideId, driverId });
  if (!ride) {
    throw new Error("Ride not found or you are not assigned to this ride");
  }

  const validTransitions: Record<string, string[]> = {
    accepted: ["picked_up", "cancelled"],
    picked_up: ["in_transit"],
    in_transit: ["completed"],
  };

  if (!validTransitions[ride.status]?.includes(status)) {
    throw new Error(`Cannot transition from ${ride.status} to ${status}`);
  }

  ride.status = status as any;

  switch (status) {
    case "picked_up": {
      ride.pickedUpAt = new Date();
      break;
    }
    case "in_transit": {
      ride.inTransitAt = new Date();
      break;
    }
    case "completed": {
      ride.completedAt = new Date();

      // Update driver earnings and clear current ride
      const driver = await Driver.findById(driverId);
      if (driver && ride.fare) {
        driver.earnings += ride.fare;
        driver.currentRideId = "";
        await driver.save();
      }
      break;
    }
  }

  await ride.save();
  return await ride.populate([
    { path: "riderId", select: "name phone" },
    { path: "driverId", select: "name phone vehicleInfo earnings" },
  ]);
};

const cancelRide = async (params: any, driverId: string) => {
  const { rideId } = params;

  const ride = await Ride.findOne({ _id: rideId, riderId: driverId });
  if (!ride) {
    throw new Error(
      "Ride not found or you are not authorized to cancel this ride"
    );
  }

  if (!["requested", "accepted"].includes(ride.status)) {
    throw new Error(`Cannot cancel ride at ${ride.status} stage`);
  }

  ride.status = "cancelled";
  ride.cancelledAt = new Date();
  await ride.save();

  // If driver was assigned, clear their current ride
  if (ride.driverId) {
    await Driver.findOneAndUpdate(
      { userId: ride.driverId },
      {
        $unset: { currentRideId: 1 },
      }
    );
  }

  return ride;
};

const getRiderHistory = async (riderId: string) => {
  return await Ride.find({ riderId })
    .populate("driverId", "name vehicleInfo")
    .sort({ createdAt: -1 });
};

const getDriverHistory = async (driverId: string) => {
  return await Ride.find({ driverId })
    .populate("riderId", "name phone")
    .sort({ createdAt: -1 });
};

const getAvailableRides = async () => {
  return await Ride.find({ status: "requested" })
    .populate("riderId", "name phone")
    .sort({ requestedAt: 1 });
};

const getAllRides = async () => {
  return await Ride.find()
    .populate("riderId", "name email phone")
    .populate("driverId", "name email phone vehicleInfo")
    .sort({ createdAt: -1 });
};

const getRideById = async (rideId: string) => {
  const rideDoc: any = await Ride.findById(rideId);
  if (!rideDoc) throw new AppError(httpStatus.NOT_FOUND, "Ride not found");

  const ride = rideDoc.toObject();

  // Get driver info
  const driver = await Driver.findOne({ userId: ride.driverId }).select(
    "vehicleInfo userId"
  );
  if (driver) {
    const user = await User.findById(driver.userId).select("name");
    ride.driverInfo = {
      ...driver.toObject(),
      name: user?.name || null,
    };
  }

  return ride;
};

export const RideService = {
  rideCreate,
  acceptRide,
  updateRideStatus,
  cancelRide,
  getRiderHistory,
  getDriverHistory,
  getRideById,
  getAvailableRides,
  getCurrentRide,
  getAllRides,
};
