import { NextFunction, Response, Request } from "express";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
dotenv.config();
import { IUser } from "../entities/User";

declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}

declare module "express-serve-static-core" {
  interface Request {
    interviewToken?: string;
  }
}

const INTERVIEW_JWT_SECRET = process.env.INTERVIEW_JWT_SECRET || "";

const interviewTokens = new Map<any, { token: string; expiresAt: number }>();

export const generateInterviewTokenMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { user } = req;

  // Check if a valid token already exists
  const existingToken = interviewTokens.get(user?._id);

  if (existingToken && existingToken.expiresAt > Date.now()) {
    req.interviewToken = existingToken.token;

    res.cookie("interviewToken", existingToken.token, {
      httpOnly: true,
      maxAge: 45 * 60 * 1000,
    });
    return next();
  }

  const interviewToken = jwt.sign({ userId: user?._id }, INTERVIEW_JWT_SECRET, {
    expiresIn: "45m",
  });

  interviewTokens.set(user?._id, {
    token: interviewToken,
    expiresAt: Date.now() + 45 * 60 * 1000,
  });

  req.interviewToken = interviewToken;

  res.cookie("interviewToken", interviewToken, {
    httpOnly: true,
    maxAge: 45 * 60 * 1000,
  });

  next();
};

export const validateInterviewTokenMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies["interviewToken"];

  if (!token) {
    console.log("No token provided");
    return res.status(403).json({ message: "No token provided" });
  }

  jwt.verify(token, INTERVIEW_JWT_SECRET, (err: any, decoded: any) => {
    if (err) {
      console.log("Invalid or expired token");
      return res.status(403).json({ message: "Invalid or expired token" });
    }
    req.user = decoded;
    next();
  });
};
