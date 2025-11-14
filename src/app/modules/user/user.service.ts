/* eslint-disable @typescript-eslint/no-explicit-any */
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
      _id: user._id,
      userId: user._id,
      vehicleInfo,
    });
  }

  return user;
};

const updateProfile = async (userId: string, payload: any) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  const { name, phone, vehicleInfo } = payload;

  if (name) user.name = name;
  if (phone) user.phone = phone;

  await user.save();

  //   If  user is a driver
  if (user.role === "driver" && vehicleInfo) {
    await Driver.findOneAndUpdate(
      { userId: user._id },
      {
        $set: {
          "vehicleInfo.model": vehicleInfo.model,
          "vehicleInfo.licensePlate": vehicleInfo.licensePlate,
        },
      },
      { new: true }
    );
  }

  return user;
};

const getMe = async (userId: string) => {
  const user = await User.findById(userId).select("-password");
  return {
    data: user,
  };
};

// const getAllUsers = async () => {
//   const users = await User.find({}).select("-password").populate("driver", "name vehicleInfo");
//   const totalUsers = await User.countDocuments();

//   return {
//     data: users,
//     meta: {
//       total: totalUsers,
//     },
//   };
// };

const getAllUsers = async () => {
  const users = await User.aggregate([
    {
      $lookup: {
        from: "drivers",
        localField: "_id",
        foreignField: "userId",
        as: "driverData",
      },
    },
    {
      $addFields: {
        isApproved: { $arrayElemAt: ["$driverData.isApproved", 0] },
      },
    },
    {
      $project: {
        password: 0,
        driverData: 0,
      },
    },
  ]);

  const totalUsers = await User.countDocuments();

  return {
    data: users,
    meta: { total: totalUsers },
  };
};

const approveDriver = async (params: any) => {
  const { driverId } = params;
  const driver = await Driver.findOneAndUpdate(
    { userId: driverId },
    {
      $set: {
        isApproved: true,
      },
    },
    {
      new: true,
    } as any
  );

  if (!driver) {
    throw new Error("Driver not found");
  }
  return driver;
};
const suspendDriver = async (params: any) => {
  const { driverId } = params;
  const driver = await Driver.findOneAndUpdate(
    { userId: driverId },
    {
      $set: {
        isApproved: false,
      },
    },
    {
      new: true,
    } as any
  );

  if (!driver) {
    throw new Error("Driver not found");
  }
  return driver;
};

const blockUser = async (params: any) => {
  const { userId } = params;
  const user = await User.findByIdAndUpdate(
    userId,
    { isBlocked: true },
    { new: true }
  );

  if (!user) {
    throw new Error("User not found");
  }
  return user;
};
const unBlockUser = async (params: any) => {
  const { userId } = params;
  const user = await User.findByIdAndUpdate(
    userId,
    { isBlocked: false },
    { new: true }
  );

  if (!user) {
    throw new Error("User not found");
  }
  return user;
};

export const UserService = {
  createUser,
  getMe,
  getAllUsers,
  approveDriver,
  suspendDriver,
  blockUser,
  unBlockUser,
  updateProfile,
};
