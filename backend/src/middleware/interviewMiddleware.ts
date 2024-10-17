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
      threadId?: any;
      assistantId?: any;
    }
  }
}

export const generateInterviewTokenMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { user, MongoInterviewId, assistantId, threadId } = req;
  const { id } = req.params;
  const { time } = req.body;

  const interviewDuration = time;

  if (!user || !user._id || !id) {
    return res
      .status(400)
      .json({ message: "User or question ID not provided" });
  }

  const reviewTokenKeyPattern = `${user._id}ReviewAndFeedbackToken*`;

  try {
    const reviewKeys = await connectRedis.keys(reviewTokenKeyPattern);

    if (reviewKeys.length >= 2) {
      return res.status(403).json({
        message:
          "You already have two active interview review sessions. Please wait until those are completed before starting a new interview.",
      });
    }
  } catch (error: any) {
    return res.status(500).json({
      message: "Error while checking active review sessions.",
      error: error.message,
    });
  }

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
    assistantId: assistantId,
    threadId: threadId,
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
      req.MongoInterviewId = parsedTokenData?.mongoDBInterviewId;
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
      const { user, interViewDuration, assistantId, threadId } = req as any;
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
        questionData,
        assistantId,
        threadId
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

/**
 * Create feedback token in redis
 */
export const generateReviewTokenMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { user } = req;
  const { interviewId } = req.body;

  if (!user || !user._id || !interviewId) {
    return res
      .status(400)
      .json({ message: "User ID or Interview ID not provided" });
  }

  const redisKey = `${user._id}ReviewAndFeedbackToken${interviewId}`;

  const reviewToken = jwt.sign(
    { userId: user._id, interviewId },
    INTERVIEW_JWT_SECRET
  );

  const tokenData = {
    token: reviewToken,
    userId: user._id,
    interviewId,
  };

  await connectRedis.set(redisKey, JSON.stringify(tokenData));

  req.userId = user._id;

  res.status(200);
  next();
};

/**
 * It checks if the user have more than two interview review session going on
 */
export const validateReviewTokenMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { user } = req;
  const { interviewId } = req.body;

  if (!user || !user._id || !interviewId) {
    return res
      .status(400)
      .json({ message: "User ID or Interview ID not provided" });
  }

  const redisKeyPattern = `${user._id}ReviewAndFeedbackToken*`;

  try {
    const keys = await connectRedis.keys(redisKeyPattern);

    if (keys.length >= 2) {
      return res.status(403).json({
        message:
          "You have two feedback processes in the pipeline. Wait until those feedback processes complete.",
      });
    }

    for (const key of keys) {
      const tokenData: any = await connectRedis.get(key);
      const parsedTokenData: any = JSON.parse(tokenData);

      try {
        const decoded = jwt.verify(
          parsedTokenData?.token,
          INTERVIEW_JWT_SECRET
        ) as jwt.JwtPayload;

        if (decoded && decoded.interviewId === interviewId) {
          return res.status(403).json({
            message:
              "You already have an active review session for this interview.",
          });
        }
      } catch (err) {
        await connectRedis.del(key);
      }
    }

    next();
  } catch (error: any) {
    return res.status(500).json({
      message: "Error while validating review tokens.",
      error: error.message,
    });
  }
};


// Middleware to check for active interview token
export const checkActiveInterviewToken = async (req: Request, res: Response, next: NextFunction) => {
  const user = req.user; // Assuming user info is attached to req.user
  if (!user || !user._id) {
    return res.status(400).json({ message: "User not provided" });
  }

  try {
    const keys = await connectRedis.keys(`${user._id}InterviewToken*`);

    if (keys.length > 0) {
      const existingToken: any = await connectRedis.get(keys[0]);
      const parsedExistingToken: any = JSON.parse(existingToken);

      if (parsedExistingToken) {
        try {
          const decoded = jwt.verify(parsedExistingToken?.token, INTERVIEW_JWT_SECRET) as jwt.JwtPayload;

          // Check if token is valid and not expired
          if (decoded && Date.now() / 1000 < decoded.exp!) {
            return res.status(403).json({
              message: "You already have an active interview session. Please either leave the interview or complete the session before starting a new one.",
            });
          }
        } catch (err) {
          await connectRedis.del(keys[0]); // Delete the token if verification fails
        }
      }
    }
    // Proceed to the next middleware or route handler
    next();
  } catch (error:any) {
    return res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};