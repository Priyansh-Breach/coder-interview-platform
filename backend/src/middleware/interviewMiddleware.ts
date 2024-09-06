import { NextFunction, Response, Request } from "express";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { IUser } from "../entities/User";
import { connectRedis } from "../Database/redisDb";
import { InterviewModel } from "../entities/interview";
import { IQuestion } from "../controllers/Socket.io/SocketinterviewController";
import QuestionData from "../Database/Questions/leetcode-solutions.json";
import { cactchAsyncError } from "./catchAsyncError";
import { createInterview } from "../Utils/Interview MongoDB/interview.utils.mongodb";
import ErrorHandler from "../Utils/Error Handler/errorHandler";

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
      MongoInterviewId?: any;
    }
  }
}

export const generateInterviewTokenMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { user, MongoInterviewId } = req;
  const { id } = req.params;
  const { time } = req.body;

  const interviewDuration = time;

  if (!user || !user._id || !id) {
    return res
      .status(400)
      .json({ message: "User or question ID not provided" });
  }

  // Retrieve question data based on ID
  const questionData = (QuestionData as IQuestion[]).find(
    (question) => question.id === id
  );

  if (!questionData) {
    return res.status(404).json({ message: "Question not found" });
  }

  const keys = await connectRedis.keys(`${user._id}InterviewToken*`);

  if (keys.length > 0) {
    const existingToken: any = await connectRedis.get(keys[0]);
    const parsedExistingToken: any = JSON.parse(existingToken);
    if (existingToken) {
      try {
        const decoded = jwt.verify(
          parsedExistingToken?.token,
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

  const tokenData = {
    token: interviewToken,
    questionName: questionData?.title,
    questionId: id,
    difficulty: questionData?.difficulty,
    slug: questionData?.slug,
    mongoDBInterviewId: MongoInterviewId,
  };

  await connectRedis.set(
    redisKey,
    JSON.stringify(tokenData),
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
  let parsedTokenData: any;
  if (!user || !user._id || !id) {
    return res
      .status(400)
      .json({ message: "User or question ID not provided" });
  }

  const redisKey = `${user._id}InterviewToken${id}`;
  const tokenData: any = await connectRedis.get(redisKey);

  if (!tokenData) {
    return res.status(403).json({
      message:
        "No active interview session found for this question. Please restart the interview process.",
    });
  } else {
    parsedTokenData = JSON.parse(tokenData);
  }

  const ttl: any = await new Promise<number>((resolve, reject) => {
    connectRedis.ttl(redisKey, (err: any, ttl: any) => {
      if (err) {
        return reject(err);
      }
      resolve(ttl);
    });
  });

  jwt.verify(
    parsedTokenData?.token,
    INTERVIEW_JWT_SECRET,
    (err: any, decoded: any) => {
      if (err || decoded.id !== id) {
        return res.status(403).json({
          message:
            "Invalid or expired token for this question. Please restart the interview process.",
        });
      }

      req.questionId = id;
      req.tokenRemainingTime = ttl;
      req.MongoInterviewId= parsedTokenData?.mongoDBInterviewId;
      next();
    }
  );
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

/**
 * Create interview in MongoDB
 */
export const handleCreateInterviewMongo = cactchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { user, interViewDuration } = req as any;
      const { id } = req.params;

      const questionData = (QuestionData as IQuestion[]).find(
        (question) => question.id === id
      );

      if (!questionData) {
        return res.status(404).json({ message: "Question not found." });
      }
      const newInterview: any = await createInterview(
        user._id,
        id,
        interViewDuration,
        questionData
      );

      (req as any).MongoInterviewId = newInterview._id;
      next();
    } catch (error: any) {
      return next(
        new ErrorHandler(
          `Error in creating the interview in MongoDB ${error}`,
          400
        )
      );
    }
  }
);
