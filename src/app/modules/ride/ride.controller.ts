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

export const RideController = {
  rideCreate,
  acceptRide,
  updateStatus,
};
