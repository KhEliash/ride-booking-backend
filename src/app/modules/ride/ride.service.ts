import AppError from "../../errorHelpers/AppError";
import { IRide } from "./ride.interface";
import httpStatus from "http-status-codes";
import { Ride } from "./ride.model";
import { calculateFare } from "../../utils/fareCalculat";

const rideCreate = async (payload: IRide) => {
  const { riderId, pickupLocation, destination, ...rest } = payload;
  if (!payload.pickupLocation || !payload.destination) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Pickup location and destination are required"
    );
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

export const RideService = {
  rideCreate,
};
