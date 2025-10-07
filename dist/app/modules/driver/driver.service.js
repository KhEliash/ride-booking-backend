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
Object.defineProperty(exports, "__esModule", { value: true });
exports.DriverService = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const driver_model_1 = require("./driver.model");
const setAvailability = (driverId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { isOnline } = payload;
    const driver = yield driver_model_1.Driver.findOne({ userId: driverId });
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
    yield driver.save();
    const driverData = driver.toObject();
    // delete driverData.password;
    return driverData;
});
const getEarnings = (driverId) => __awaiter(void 0, void 0, void 0, function* () {
    const driver = yield driver_model_1.Driver.findOne({ userId: driverId }).select("earnings ");
    if (!driver) {
        throw new Error("Driver not found");
    }
    return driver;
});
const getProfile = (driverId) => __awaiter(void 0, void 0, void 0, function* () {
    const driver = yield driver_model_1.Driver.findOne({ userId: driverId }).populate("userId");
    if (!driver) {
        throw new Error("Driver not found");
    }
    return driver;
});
const getAllDrivers = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield driver_model_1.Driver.find().sort({ createdAt: -1 }).populate("userId");
});
exports.DriverService = {
    setAvailability,
    getEarnings,
    getProfile,
    getAllDrivers,
};
