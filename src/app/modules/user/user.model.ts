import { IUser, Role } from "./user.interface";
import { model, Schema } from "mongoose";

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password : { type: String ,required: true},
    role: {
      type: String,
      enum: Object.values(Role),
      default: Role.RIDER,
    },
    phone: { type: String },
    isActive: { type: Boolean, default: true },
    isApproved: { type: Boolean, default: false },
    isBlocked: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const User = model<IUser>("User", userSchema);
