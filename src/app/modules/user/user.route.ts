import { Router } from "express";
import { UserController } from "./user.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "./user.interface";

const router = Router();

router.post("/register", UserController.createUser);
router.get("/all-users", checkAuth(Role.ADMIN), UserController.getAllUsers);
router.get("/me",checkAuth(Role.DRIVER,Role.ADMIN,Role.RIDER),UserController.getMe);
router.patch("/approve/:driverId", checkAuth(Role.ADMIN), UserController.approveDriver);
router.patch("/suspend/:driverId", checkAuth(Role.ADMIN), UserController.suspendDriver);
router.patch("/block/:userId", checkAuth(Role.ADMIN), UserController.blockUser);
router.patch("/unblock/:userId", checkAuth(Role.ADMIN), UserController.unBlockUser);
router.put("/update-profile", checkAuth(Role.RIDER,Role.DRIVER,Role.ADMIN), UserController.updateProfile);


export const UserRoutes = router;
