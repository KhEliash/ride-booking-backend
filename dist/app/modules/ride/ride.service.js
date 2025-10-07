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
exports.RideService = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const ride_model_1 = require("./ride.model");
const fareCalculat_1 = require("../../utils/fareCalculat");
const driver_model_1 = require("../driver/driver.model");
const user_model_1 = require("../user/user.model");
const rideCreate = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { riderId, pickupLocation, destination } = payload, rest = __rest(payload, ["riderId", "pickupLocation", "destination"]);
    if (!payload.pickupLocation || !payload.destination) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Pickup location and destination are required");
    }
    const isRiderExist = yield user_model_1.User.findOne({ _id: riderId });
    if (!isRiderExist) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "rider does not exist");
    }
    const activeRide = yield ride_model_1.Ride.findOne({
        riderId,
        status: { $in: ["requested", "accepted", "picked_up", "in_transit"] },
    });
    if (activeRide) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "You already have an active ride. Complete or cancel it first.");
    }
    const fare = (0, fareCalculat_1.calculateFare)(pickupLocation === null || pickupLocation === void 0 ? void 0 : pickupLocation.coordinates, destination === null || destination === void 0 ? void 0 : destination.coordinates);
    const ride = yield ride_model_1.Ride.create(Object.assign(Object.assign({ riderId,
        pickupLocation,
        destination }, rest), { fare, requestedAt: new Date() }));
    return {
        data: ride,
    };
});
const acceptRide = (params, driverId) => __awaiter(void 0, void 0, void 0, function* () {
    const { rideId } = params;
    const driver = yield driver_model_1.Driver.findOne({ userId: driverId });
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
    const ride = yield ride_model_1.Ride.findById(rideId);
    if (!ride) {
        throw new Error("Ride not found");
    }
    if (ride.status !== "requested") {
        throw new Error(`Ride is not available. Current status: ${ride.status}`);
    }
    ride.driverId = driverId;
    ride.status = "accepted";
    ride.acceptedAt = new Date();
    yield ride.save();
    driver.currentRideId = rideId;
    yield driver.save();
    return yield ride.populate([
        { path: "riderId", select: "name phone" },
        { path: "driverId", select: "name phone vehicleInfo" },
    ]);
});
const updateRideStatus = (params, driverId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { rideId } = params;
    const { status } = payload;
    const ride = yield ride_model_1.Ride.findOne({ _id: rideId, driverId });
    if (!ride) {
        throw new Error("Ride not found or you are not assigned to this ride");
    }
    const validTransitions = {
        accepted: ["picked_up", "cancelled"],
        picked_up: ["in_transit"],
        in_transit: ["completed"],
    };
    if (!((_a = validTransitions[ride.status]) === null || _a === void 0 ? void 0 : _a.includes(status))) {
        throw new Error(`Cannot transition from ${ride.status} to ${status}`);
    }
    ride.status = status;
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
            const driver = yield driver_model_1.Driver.findById(driverId);
            if (driver && ride.fare) {
                driver.earnings += ride.fare;
                driver.currentRideId = "";
                yield driver.save();
            }
            break;
        }
    }
    yield ride.save();
    return yield ride.populate([
        { path: "riderId", select: "name phone" },
        { path: "driverId", select: "name phone vehicleInfo earnings" },
    ]);
});
const cancelRide = (params, driverId) => __awaiter(void 0, void 0, void 0, function* () {
    const { rideId } = params;
    const ride = yield ride_model_1.Ride.findOne({ _id: rideId, riderId: driverId });
    if (!ride) {
        throw new Error("Ride not found or you are not authorized to cancel this ride");
    }
    if (!["requested", "accepted"].includes(ride.status)) {
        throw new Error(`Cannot cancel ride at ${ride.status} stage`);
    }
    ride.status = "cancelled";
    ride.cancelledAt = new Date();
    yield ride.save();
    // If driver was assigned, clear their current ride
    if (ride.driverId) {
        yield driver_model_1.Driver.findOneAndUpdate({ userId: ride.driverId }, {
            $unset: { currentRideId: 1 },
        });
    }
    return ride;
});
const getRiderHistory = (riderId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield ride_model_1.Ride.find({ riderId })
        .populate("driverId", "name vehicleInfo")
        .sort({ createdAt: -1 });
});
const getDriverHistory = (driverId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield ride_model_1.Ride.find({ driverId, status: "completed" })
        .populate("riderId", "name phone")
        .sort({ createdAt: -1 });
});
const getAvailableRides = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield ride_model_1.Ride.find({ status: "requested" })
        .populate("riderId", "name phone")
        .sort({ requestedAt: 1 });
});
const getAllRides = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield ride_model_1.Ride.find()
        .populate("riderId", "name email phone")
        .populate("driverId", "name email phone vehicleInfo")
        .sort({ createdAt: -1 });
});
exports.RideService = {
    rideCreate,
    acceptRide,
    updateRideStatus,
    cancelRide,
    getRiderHistory,
    getDriverHistory,
    getAvailableRides,
    getAllRides,
};
