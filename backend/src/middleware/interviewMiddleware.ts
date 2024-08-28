import { NextFunction, Response, Request } from "express";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { IUser } from "../entities/User";
import { connectRedis } from "../Database/redisDb";
import { InterviewModel } from "../entities/interview";
dotenv.config();

const INTERVIEW_JWT_SECRET = process.env.INTERVIEW_JWT_SECRET || "";

declare global {
  namespace Express {
    interface Request {
      user?: IUser;
      interviewToken?: string;
      userId?: string;
      questionId?: string;
      tokenRemainingTime?: any;
      interViewDuration?: any;
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
  const { time } = req.body;

  const interviewDuration = time === 60 ? 60 : 45;

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
      expiresIn: `${interviewDuration}m`,
    }
  );

  await connectRedis.set(
    redisKey,
    interviewToken,
    "EX",
    interviewDuration * 60
  );

  req.interviewToken = interviewToken;
  req.userId = user?._id;
  req.questionId = id;
  req.interViewDuration = interviewDuration;
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

  const ttl: any = await new Promise<number>((resolve, reject) => {
    connectRedis.ttl(redisKey, (err: any, ttl: any) => {
      if (err) {
        return reject(err);
      }
      resolve(ttl);
    });
  });

  jwt.verify(token, INTERVIEW_JWT_SECRET, (err: any, decoded: any) => {
    if (err || decoded.id !== id) {
      return res.status(403).json({
        message:
          "Invalid or expired token for this question. Please restart the interview process.",
      });
    }

    // Add the remaining time to the request object
    req.questionId = id;
    req.tokenRemainingTime = ttl; // Add this line to pass the remaining time to the next route

    next();
  });
};

export const deleteInterviewTokenMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { user } = req;
  const { id } = req.params;
  if (!user || !user._id || !id) {
    return res.status(400).json({
      message: "User or question ID not provided de",
      user: user,
      id: id,
    });
  }

  const redisKey = `${user._id}InterviewToken${id}`;

  try {
    const deleteResult = await connectRedis.del(redisKey);

    if (deleteResult) {
      req.user = user;
      req.questionId = id;
      next();
    } else {
      return res.status(404).json({
        message: "Interview token not found or already deleted.",
      });
    }
  } catch (error: any) {
    return res.status(500).json({
      message: "Error deleting interview token from Redis.",
      error: error.message,
    });
  }
};
