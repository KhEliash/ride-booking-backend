import { IUser } from "../user/user.interface";

export interface IDriver extends IUser {
  vehicleInfo: {
    model: string;
    licensePlate: string;
  };
  isApproved?: boolean;
  isOnline?: boolean;
  currentRideId?: string;
  earnings?: number;
}
