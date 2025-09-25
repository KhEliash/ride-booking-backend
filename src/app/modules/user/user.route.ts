import { NextFunction, Request, Response, Router } from "express";
import { UserController } from "./user.controller";
import AppError from "../../errorHelpers/AppError";
import jwt, { JwtPayload } from "jsonwebtoken";
import { Role } from "./user.interface";

const router = Router();

router.post("/register", UserController.createUser);
router.get(
  "/all-users",
  (req: Request, res: Response, next: NextFunction) => {
    try {
      const accessToken = req.headers.authorization;
      if (!accessToken) {
        throw new AppError(403, "No token received");
      }
      const verifiedToken = jwt.verify(accessToken, "secretRide");
      console.log(verifiedToken);

      if ((verifiedToken as JwtPayload).role !== Role.ADMIN) {
        throw new AppError(403, "You are not permitted to view this route!!");
      }

      next();
    } catch (error) {
      next(error);
    }
  },
  UserController.getAllUsers
);

export const UserRoutes = router;
