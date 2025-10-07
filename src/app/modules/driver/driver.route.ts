import { Router } from "express";
import { DriverControllers } from "./driver.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
 
const router = Router();

router.patch("/availability",checkAuth(Role.DRIVER),DriverControllers.setAvailability);
router.get("/earnings",checkAuth(Role.DRIVER),DriverControllers.getEarnings);
router.get("/profile",checkAuth(Role.DRIVER),DriverControllers.getProfile);
router.get("/allDrivers",checkAuth(Role.ADMIN),DriverControllers.getAllDrivers);

export const DriverRoutes = router