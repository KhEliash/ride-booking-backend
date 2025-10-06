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

const acceptRide = async (payload: any) => {
  const { driverId, rideId } = payload;

  const driver = await Driver.findById(driverId);
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

const updateRideStatus = async (payload: any) => {
  const { rideId, driverId, status } = payload;
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

export const RideService = {
  rideCreate,
  acceptRide,
  updateRideStatus,
};
