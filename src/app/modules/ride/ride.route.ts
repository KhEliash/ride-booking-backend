import { Router } from "express";
import { RideController } from "./ride.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";

const router = Router();

router.get("/all-rides",checkAuth(Role.ADMIN), RideController.getAllRides);
router.post("/ride-request",checkAuth(Role.RIDER), RideController.rideCreate);
router.get("/available-rides",checkAuth(Role.DRIVER) , RideController.getAvailableRides);
router.get("/rider-history",checkAuth(Role.RIDER), RideController.getRiderHistory);
router.get("/driver-history",checkAuth(Role.DRIVER), RideController.getDriverHistory);
router.patch("/cancel/:rideId",checkAuth(Role.RIDER), RideController.cancelRide);
router.get("/:id",checkAuth(Role.RIDER), RideController.getRideById);
router.post("/accept-ride/:rideId", checkAuth(Role.DRIVER),  RideController.acceptRide);
router.patch("/update-ride-status/:rideId", checkAuth(Role.DRIVER), RideController.updateStatus);

export const RideRoutes = router;
