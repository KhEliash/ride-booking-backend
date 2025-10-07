import { Router } from "express";
import { RideController } from "./ride.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";

const router = Router();

router.post("/ride-request",checkAuth(Role.RIDER), RideController.rideCreate);
router.patch("/cancel/:rideId",checkAuth(Role.RIDER), RideController.cancelRide);
router.post("/accept-ride/:rideId", checkAuth(Role.DRIVER),  RideController.acceptRide);
router.patch("/update-ride-status/:rideId", checkAuth(Role.DRIVER), RideController.updateStatus);

export const RideRoutes = router;
