import { NextFunction, Response, Request } from "express";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { IUser } from "../entities/User";
import { connectRedis } from "../Database/redisDb";

dotenv.config();

const INTERVIEW_JWT_SECRET = process.env.INTERVIEW_JWT_SECRET || "";

declare global {
  namespace Express {
    interface Request {
      user?: IUser;
      interviewToken?: string;
    }
  }
}

export const generateInterviewTokenMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { user } = req;

  if (!user || !user._id) {
    return res.status(400).json({ message: "User not authenticated" });
  }

  const redisKey = `${user._id}token`;

  const existingToken = await connectRedis.get(redisKey);

  if (existingToken) {
    try {
      const decoded = jwt.verify(
        existingToken,
        INTERVIEW_JWT_SECRET
      ) as jwt.JwtPayload;

      if (decoded && Date.now() / 1000 < decoded.exp!) {
        return res
          .status(403)
          .json({ message: "You already have an active interview session." });
      }
    } catch (err) {
      await connectRedis.del(redisKey);
    }
  }

  const interviewToken = jwt.sign({ userId: user._id }, INTERVIEW_JWT_SECRET, {
    expiresIn: "45m",
  });

  await connectRedis.set(redisKey, interviewToken, "EX", 45 * 60);

  req.interviewToken = interviewToken;

  next();
};

export const validateInterviewTokenMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { user } = req;

  if (!user || !user._id) {
    return res.status(400).json({ message: "User not authenticated" });
  }

  const redisKey = `${user._id}token`;

  const token = await connectRedis.get(redisKey);

  if (!token) {
    return res.status(403).json({
      message:
        "No active interview session found. Please restart the interview process.",
    });
  }

  jwt.verify(token, INTERVIEW_JWT_SECRET, (err: any, decoded: any) => {
    if (err) {
      return res.status(403).json({
        message:
          "Invalid or expired token. Please restart the interview process.",
      });
    }

    req.user = decoded;
    next();
  });
};
