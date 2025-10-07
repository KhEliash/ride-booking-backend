/* eslint-disable @typescript-eslint/no-explicit-any */
import { Driver } from "./driver.model";

const setAvailability = async (driverId: string, payload: any) => {
  const { isOnline } = payload;
  const driver = await Driver.findOne({ userId: driverId });
  if (!driver) {
    throw new Error("Driver not found");
  }

  if (!driver.isApproved) {
    throw new Error("Driver not approved. Cannot go online.");
  }

  if (driver.currentRideId && !isOnline) {
    throw new Error("Cannot go offline while on an active ride");
  }

  driver.isOnline = isOnline;
  await driver.save();

  const driverData = driver.toObject();
  // delete driverData.password;
  return driverData;
};

const getEarnings = async (driverId: string) => {
  const driver = await Driver.findOne({ userId: driverId }).select("earnings ");
  if (!driver) {
    throw new Error("Driver not found");
  }
  return driver;
};

const getProfile = async (driverId: string) => {
  const driver = await Driver.findOne({ userId: driverId }).populate("userId");
  if (!driver) {
    throw new Error("Driver not found");
  }
  return driver;
};
const getAllDrivers = async () => {
  return await Driver.find().sort({ createdAt: -1 }).populate("userId");
};

export const DriverService = {
  setAvailability,
  getEarnings,
  getProfile,
  getAllDrivers,
};
