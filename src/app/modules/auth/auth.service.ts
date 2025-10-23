import AppError from "../../errorHelpers/AppError";
import { IUser } from "../user/user.interface";
import httpStatus from "http-status-codes";
import bcrypt from "bcryptjs";
import jwt, { SignOptions } from "jsonwebtoken";
import { User } from "../user/user.model";
import { envVars } from "../../config/env";
import { setCookie } from "../../utils/setCookie";
import { Response } from "express";

const credentialLogin = async (res: Response, payload: Partial<IUser>) => {
  const { email, password } = payload;
  const isUserExist = await User.findOne({ email });

  if (!isUserExist) {
    throw new AppError(httpStatus.BAD_REQUEST, "User Does Not Exist");
  }
  const isPasswordMatch = await bcrypt.compare(
    password as string,
    isUserExist.password
  );
  if (!isPasswordMatch) {
    throw new AppError(httpStatus.BAD_REQUEST, "Incorrect password");
  }

  const jwtPayload = {
    userId: isUserExist._id,
    email: isUserExist.email,
    role: isUserExist.role,
  };

  const accessToken = jwt.sign(jwtPayload, envVars.JWT_ACCESS_SECRET, {
    expiresIn: envVars.JWT_ACCESS_EXPIRES,
  } as SignOptions);

  setCookie(res, accessToken);

  return {
    accessToken,
  };
};

export const AuthServices = {
  credentialLogin,
};
