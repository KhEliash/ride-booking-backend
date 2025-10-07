/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { DriverService } from "./driver.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";

const setAvailability = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const decodedToken = req.user as JwtPayload
    const result = await DriverService.setAvailability(decodedToken.userId,req.body);

    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: " Active Status Updated Successfully",
      data: result,
    });
  }
);
const getEarnings = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const decodedToken = req.user as JwtPayload
    const result = await DriverService.getEarnings(decodedToken.userId);

    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: " Earning gets Successfully",
      data: result,
    });
  }
);
const getProfile = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const decodedToken = req.user as JwtPayload
    const result = await DriverService.getProfile(decodedToken.userId);

    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: " Profile gets Successfully",
      data: result,
    });
  }
);
const getAllDrivers = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const decodedToken = req.user as JwtPayload
    const result = await DriverService.getAllDrivers( );

    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: " All drivers gets Successfully",
      data: result,
    });
  }
);



export const DriverControllers = {
  setAvailability,
  getEarnings,
  getProfile,
  getAllDrivers
};