/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import httpStatus from "http-status-codes";
import { sendResponse } from "../../utils/sendResponse";
import { RideService } from "./ride.service";

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

export const RideController = {
  rideCreate
};