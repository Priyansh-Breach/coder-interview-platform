require("dotenv").config();
import { Request, Response, NextFunction } from "express";
import { cactchAsyncError } from "./catchAsyncError";
import ErrorHandler from "../Utils/Error Handler/errorHandler";
import jwt, { JwtPayload } from "jsonwebtoken";
import { connectRedis } from "../Database/redisDb";
import { IUser } from "../entities/User";


declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}

/**
 * User Authentication function
 */
export const isUserAuthenticated = cactchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const access_token = req.cookies.access_token;

    if (!access_token) {
      return next(
        new ErrorHandler(
          "Access to this resource requires authentication. Please log in.",
          400
        )
      );
    }

    let decoded: JwtPayload | null = null;

    try {
      decoded = jwt.verify(access_token, process.env.ACCESS_TOKEN as string) as JwtPayload;
    } catch (err) {
      return next(
        new ErrorHandler(
          "Invalid token. Please log in again.",
          400
        )
      );
    }

    if (!decoded) {
      return next(
        new ErrorHandler(
          "Your login session has expired. Please log in again.",
          400
        )
      );
    }

    const user = await connectRedis.get(decoded.id);

    if (!user) {
      return next(new ErrorHandler("Please Log in to continue.", 400));
    }

    req.user = JSON.parse(user) as IUser;
    next();
  }
);

/**
 * User Validation based on Roles
 */
export const authorisedRoles = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role || "")) {
      return next(
        new ErrorHandler(
          `Role: ${req.user?.role} is not allowed to access this resource.`,
          403
        )
      );
    }
    next();
  };
};
