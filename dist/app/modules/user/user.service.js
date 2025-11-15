"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const user_model_1 = require("./user.model");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const env_1 = require("../../config/env");
const driver_model_1 = require("../driver/driver.model");
const createUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password, role, vehicleInfo } = payload, rest = __rest(payload, ["email", "password", "role", "vehicleInfo"]);
    const isUserExist = yield user_model_1.User.findOne({ email });
    if (isUserExist) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "User Already Exists");
    }
    const existingDriver = yield driver_model_1.Driver.findOne({ email });
    if (existingDriver) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Driver with this email already exists");
    }
    if (role === "driver") {
        if (!vehicleInfo || !vehicleInfo.model || !vehicleInfo.licensePlate) {
            throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Vehicle information is required for drivers");
        }
    }
    const hashedPassword = yield bcryptjs_1.default.hash(password, Number(env_1.envVars.BCRYPT_SALT_ROUND));
    // Create user
    const user = yield user_model_1.User.create(Object.assign({ email, password: hashedPassword, role }, rest));
    // If the user is a driver
    if (role === "driver") {
        yield driver_model_1.Driver.create({
            _id: user._id,
            userId: user._id,
            vehicleInfo,
        });
    }
    return user;
});
const updateProfile = (userId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findById(userId);
    if (!user) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "User not found");
    }
    const { name, phone, vehicleInfo } = payload;
    if (name)
        user.name = name;
    if (phone)
        user.phone = phone;
    yield user.save();
    //   If  user is a driver
    if (user.role === "driver" && vehicleInfo) {
        yield driver_model_1.Driver.findOneAndUpdate({ userId: user._id }, {
            $set: {
                "vehicleInfo.model": vehicleInfo.model,
                "vehicleInfo.licensePlate": vehicleInfo.licensePlate,
            },
        }, { new: true });
    }
    return user;
});
const getMe = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findById(userId).select("-password");
    return {
        data: user,
    };
});
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
const getAllUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield user_model_1.User.aggregate([
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
    const totalUsers = yield user_model_1.User.countDocuments();
    return {
        data: users,
        meta: { total: totalUsers },
    };
});
const approveDriver = (params) => __awaiter(void 0, void 0, void 0, function* () {
    const { driverId } = params;
    const driver = yield driver_model_1.Driver.findOneAndUpdate({ userId: driverId }, {
        $set: {
            isApproved: true,
        },
    }, {
        new: true,
    });
    if (!driver) {
        throw new Error("Driver not found");
    }
    return driver;
});
const suspendDriver = (params) => __awaiter(void 0, void 0, void 0, function* () {
    const { driverId } = params;
    const driver = yield driver_model_1.Driver.findOneAndUpdate({ userId: driverId }, {
        $set: {
            isApproved: false,
        },
    }, {
        new: true,
    });
    if (!driver) {
        throw new Error("Driver not found");
    }
    return driver;
});
const blockUser = (params) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = params;
    const user = yield user_model_1.User.findByIdAndUpdate(userId, { isBlocked: true }, { new: true });
    if (!user) {
        throw new Error("User not found");
    }
    return user;
});
const unBlockUser = (params) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = params;
    const user = yield user_model_1.User.findByIdAndUpdate(userId, { isBlocked: false }, { new: true });
    if (!user) {
        throw new Error("User not found");
    }
    return user;
});
exports.UserService = {
    createUser,
    getMe,
    getAllUsers,
    approveDriver,
    suspendDriver,
    blockUser,
    unBlockUser,
    updateProfile,
};
