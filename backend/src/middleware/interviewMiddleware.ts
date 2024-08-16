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
  const { id } = req.params;

  if (!user || !user._id || !id) {
    return res
      .status(400)
      .json({ message: "User or question ID not provided" });
  }

  
  const keys = await connectRedis.keys(`${user._id}InterviewToken*`);

  if (keys.length > 0) {
    const existingToken = await connectRedis.get(keys[0]); 

    if (existingToken) {
      try {
        const decoded = jwt.verify(
          existingToken,
          INTERVIEW_JWT_SECRET
        ) as jwt.JwtPayload;

        if (decoded && Date.now() / 1000 < decoded.exp!) {
          return res.status(403).json({
            message:
              "You already have an active interview session. Please either leave the interview or complete the session before starting a new one.",
          });
        }
      } catch (err) {
    
        await connectRedis.del(keys[0]);
      }
    }
  }

  const redisKey = `${user._id}InterviewToken${id}`;

  const interviewToken = jwt.sign(
    { userId: user._id, id }, 
    INTERVIEW_JWT_SECRET,
    {
      expiresIn: "45m",
    }
  );

  await connectRedis.set(redisKey, interviewToken, "EX", 45 * 60);

  req.interviewToken = interviewToken;
  res.status(200);
  next();
};


export const validateInterviewTokenMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { user } = req;
  const { id } = req.params;

  if (!user || !user._id || !id) {
    return res
      .status(400)
      .json({ message: "User or question ID not provided" });
  }

  const redisKey = `${user._id}InterviewToken${id}`;

  const token = await connectRedis.get(redisKey);

  if (!token) {
    return res.status(403).json({
      message:
        "No active interview session found for this question. Please restart the interview process.",
    });
  }

  jwt.verify(token, INTERVIEW_JWT_SECRET, (err: any, decoded: any) => {
    if (err || decoded.id !== id) {
      return res.status(403).json({
        message:
          "Invalid or expired token for this question. Please restart the interview process.",
      });
    }

    req.user = decoded;
    next();
  });
};
