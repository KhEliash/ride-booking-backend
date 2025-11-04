/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import httpStatus from "http-status-codes";
import { sendResponse } from "../../utils/sendResponse";
import { RideService } from "./ride.service";
import { JwtPayload } from "jsonwebtoken";

const rideCreate = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await RideService.rideCreate(req.body);

    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "Ride Created Successfully",
      data: result,
    });
  }
);
const acceptRide = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const decodeToken = req.user as JwtPayload;

    const result = await RideService.acceptRide(req.params, decodeToken.userId);

    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "Ride Accepted Successfully",
      data: result,
    });
  }
);

const getCurrentRide = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const decodeToken = req.user as JwtPayload;
    const result = await RideService.getCurrentRide(decodeToken.userId);

    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "Get Current Ride Successfully",
      data: result,
    });
  }
);
const updateStatus = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const decodeToken = req.user as JwtPayload;
    const result = await RideService.updateRideStatus(
      req.params,
      decodeToken.userId,
      req.body
    );

    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "Ride Status Updated Successfully",
      data: result,
    });
  }
);
const cancelRide = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const decodeToken = req.user as JwtPayload;
    const result = await RideService.cancelRide(req.params, decodeToken.userId);

    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "Ride Canceled Successfully",
      data: result,
    });
  }
);
const getRiderHistory = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const decodeToken = req.user as JwtPayload;
    const result = await RideService.getRiderHistory(decodeToken.userId);

    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "Ride History Get Successfully",
      data: result,
    });
  }
);
const getDriverHistory = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const decodeToken = req.user as JwtPayload;
    const result = await RideService.getDriverHistory(decodeToken.userId);

    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "Driver History Get Successfully",
      data: result,
    });
  }
);
const getAvailableRides = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await RideService.getAvailableRides();

    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "Available rides",
      data: result,
    });
  }
);

const getRideById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const ride = await RideService.getRideById(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Ride details get successfully",
    data: ride,
  });
});

const getAllRides = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await RideService.getAllRides();

    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "All rides",
      data: result,
    });
  }
);

export const RideController = {
  rideCreate,
  acceptRide,
  updateStatus,
  cancelRide,
  getRiderHistory,
  getDriverHistory,
  getAvailableRides,
  getRideById,
  getCurrentRide,
  getAllRides,
};
