import { Router } from "express";
import { RideController } from "./ride.controller";

const router = Router();

router.post("/ride-request", RideController.rideCreate);
// router.get("/all-users", checkAuth(Role.ADMIN), UserController.getAllUsers);

export const RideRoutes = router;