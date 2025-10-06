import { model, Schema } from "mongoose";
import { IRide } from "./ride.interface";

export const rideSchema = new Schema<IRide>(
  {
    riderId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    driverId: { type: Schema.Types.ObjectId, ref: "Driver" },
    pickupLocation: {
      address: { type: String, required: true },
      coordinates: {
        lat: { type: Number, required: true },
        lng: { type: Number, required: true },
      },
    },
    destination: {
      address: { type: String, required: true },
      coordinates: {
        lat: { type: Number, required: true },
        lng: { type: Number, required: true },
      },
    },
    status: {
      type: String,
      enum: [
        "requested",
        "accepted",
        "picked_up",
        "in_transit",
        "completed",
        "cancelled",
      ],
      default: "requested",
    },
    fare: { type: Number },
    requestedAt: { type: Date, default: Date.now },
    acceptedAt: { type: Date },
    pickedUpAt: { type: Date },
    inTransitAt: { type: Date },
    completedAt: { type: Date },
    cancelledAt: { type: Date },
  },
  { timestamps: true }
);

export const Ride = model<IRide>("Ride", rideSchema);

