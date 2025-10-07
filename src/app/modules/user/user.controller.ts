/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes";
import { UserService } from "./user.service";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { JwtPayload } from "jsonwebtoken";

const createUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await UserService.createUser(req.body);

    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "User Created Successfully",
      data: user,
    });
  }
);

const getAllUsers = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await UserService.getAllUsers();

    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "All Users Retrieved Successfully",
      data: result.data,
      meta: result.meta,
    });
  }
);
const approveDriver = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
  
    const result = await UserService.approveDriver(req.params);

    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "Approved Successfully",
      data: result,
       
    });
  }
);
const suspendDriver = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
  
    const result = await UserService.suspendDriver(req.params);

    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "Suspend Successfully",
      data: result,
       
    });
  }
);
const blockUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
  
    const result = await UserService.blockUser(req.params);

    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "Blocked Successfully",
      data: result,
       
    });
  }
);
const unBlockUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
  
    const result = await UserService.unBlockUser(req.params);

    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "UnBlocked Successfully",
      data: result,
       
    });
  }
);

export const UserController = {
  createUser,
  getAllUsers,
  approveDriver,
  suspendDriver,
  blockUser,
  unBlockUser
};
