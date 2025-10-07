import { Router } from "express";
import { UserController } from "./user.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "./user.interface";

const router = Router();

router.post("/register", UserController.createUser);
router.get("/all-users", checkAuth(Role.ADMIN), UserController.getAllUsers);
router.patch("/approve/:driverId", checkAuth(Role.ADMIN), UserController.approveDriver);
router.patch("/suspend/:driverId", checkAuth(Role.ADMIN), UserController.suspendDriver);
router.patch("/block/:userId", checkAuth(Role.ADMIN), UserController.blockUser);
router.patch("/unblock/:userId", checkAuth(Role.ADMIN), UserController.unBlockUser);

export const UserRoutes = router;
