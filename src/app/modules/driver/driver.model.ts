import mongoose, { Schema } from "mongoose";

const DriverSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    vehicleInfo: {
      model: { type: String, required: true },
      licensePlate: { type: String, required: true },
    },
    isOnline: {
      type: Boolean,
      default: false,
    },
    currentRideId: {
      type: Schema.Types.ObjectId,
      ref: "Ride",
      default: null,
    },
    earnings: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const Driver = mongoose.model("Driver", DriverSchema);
