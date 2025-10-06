import AppError from "../../errorHelpers/AppError";
import { IUser } from "./user.interface";
import { User } from "./user.model";
import httpStatus from "http-status-codes";
import bcryptjs from "bcryptjs";
import { envVars } from "../../config/env";
import { Driver } from "../driver/driver.model";

const createUser = async (payload: IUser) => {
  const { email, password, role, vehicleInfo, ...rest } = payload;

  const isUserExist = await User.findOne({ email });
  if (isUserExist) {
    throw new AppError(httpStatus.BAD_REQUEST, "User Already Exists");
  }

  const existingDriver = await Driver.findOne({ email });
  if (existingDriver) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Driver with this email already exists"
    );
  }

  if (role === "driver") {
    if (!vehicleInfo || !vehicleInfo.model || !vehicleInfo.licensePlate) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "Vehicle information is required for drivers"
      );
    }
  }

  const hashedPassword = await bcryptjs.hash(
    password as string,
    Number(envVars.BCRYPT_SALT_ROUND)
  );

  // Create user
  const user = await User.create({
    email,
    password: hashedPassword,
    role,
    ...rest,
  });

  // If the user is a driver
  if (role === "driver") {
    await Driver.create({
      userId: user._id,
      vehicleInfo,
    });
  }

  return user;
};

const getAllUsers = async () => {
  const users = await User.find({});
  const totalUsers = await User.countDocuments();

  return {
    data: users,
    meta: {
      total: totalUsers,
    },
  };
};

export const UserService = {
  createUser,
  getAllUsers,
};
