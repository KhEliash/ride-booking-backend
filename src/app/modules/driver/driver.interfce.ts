import { Types } from "mongoose";
import { IUser } from "../user/user.interface";

export interface IDriver extends IUser {
  userId: Types.ObjectId;
  vehicleInfo: {
    model: string;
    licensePlate: string;
  };
  isOnline?: boolean;
  currentRideId?: string;
  earnings?: number;
}
