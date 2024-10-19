// src/controllers/interviewController.ts
import { cactchAsyncError } from "../middleware/catchAsyncError";
import { transcribeAudio } from "../services/speechToTextService";
import { synthesizeSpeech } from "../services/textToSpeechService";
import { NextFunction, Request, Response } from "express";
import QuestionData from "../Database/Questions/leetcode-solutions.json";
import ErrorHandler from "../Utils/Error Handler/errorHandler";
import { CreateInterviewier, CreateThread } from "../services/aiService";
import { IQuestion } from "./Socket.io/SocketinterviewController";
import { InterviewModel } from "../entities/interview";
import { IUser } from "../entities/User";
import {
  completeInterviewMongo,
  createInterview,
  getUserInterviews,
  leaveInterviewMongo,
} from "../Utils/Interview MongoDB/interview.utils.mongodb";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { connectRedis } from "../Database/redisDb";
// socketMiddleware.ts
import OpenAI from "openai";

dotenv.config();

const INTERVIEW_JWT_SECRET = process.env.INTERVIEW_JWT_SECRET || "";
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

declare global {
  namespace Express {
    interface Request {
      user?: IUser;
      interviewToken?: string;
      userId?: string;
      questionId?: string;
      interViewDuration?: any;
      tokenRemainingTime?: any;
      MongoInterviewId?: any;
      assistantId?: any;
      threadId?: any;
      assistantFirstMessage?: any;
    }
  }
}

// Interface for question ID
interface IQuestionId {
  id: string;
}

/**
 * Return the question based on Params id
 */
export const getQuestionData = cactchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params as unknown as IQuestionId;
      const { tokenRemainingTime, MongoInterviewId, assistantId, threadId } =
        req;

      const questionData = (QuestionData as IQuestion[]).find(
        (question) => question.id === id
      );

      if (!questionData) {
        return next(new ErrorHandler("Question not found", 404));
      }

      res.status(200).json({
        success: true,
        data: questionData,
        timeLeftForInterview: tokenRemainingTime,
        MongoInterviewId: MongoInterviewId,
        assistantId: assistantId,
        threadId: threadId,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

/**
 * Mark Interveiw status as canceled in MongoDB
 */
export const handleLeaveInterviewMongo = cactchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { user, questionId, tokenRemainingTime } = req as any;
      await leaveInterviewMongo(user?._id, questionId, tokenRemainingTime);
      res.status(200).json({
        success: true,
        message: "Canceled the interview.",
      });
    } catch (error: any) {
      return next(
        new ErrorHandler("Error in canceling the interview in MongoDB : ", 400)
      );
    }
  }
);

/**
 * Mark Interveiw status as complete in MongoDB
 */
export const handleCompleteInterviewMongo = cactchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { user } = req as any;
      const { interviewId } = req.body as any;

      const completeInterview = await completeInterviewMongo(
        user?._id,
        interviewId,
        "Generating Feedback"
      );

      if (completeInterview) {
        return next();
      }

      return res.status(400).json({
        message: "Failed to complete interview",
        error: completeInterview,
        success: false,
      });
    } catch (error: any) {
      return next(
        new ErrorHandler(
          "Error in completing the interview in MongoDB: " + error.message,
          400
        )
      );
    }
  }
);

/**
 * Gives the Past Interviews made by user
 */
export const handleGetInterviewHistory_Interviews = cactchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { user } = req;
      const { pageNo, limit } = req.body;
      if (!user || !user._id) {
        return res.status(400).json({ message: "User not provided" });
      }

      const pastInterviews = await getUserInterviews(user._id, pageNo, limit);

      res.status(200).json({
        success: true,
        pastInterviews,
      });
    } catch (error: any) {
      return next(
        new ErrorHandler("Error fetching your past interviews.", 500)
      );
    }
  }
);

/**
 * Gives the active feedback review sessions
 */
export const handleGetActiveSessions = cactchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { user } = req;

      if (!user || !user._id) {
        return res.status(400).json({ message: "User not provided" });
      }

      const interviewKeys = await connectRedis.keys(
        `${user._id}InterviewToken*`
      );
      const reviewKeys = await connectRedis.keys(
        `${user._id}ReviewAndFeedbackToken*`
      );

      const fetchSessions = async (keys: string[], type: string) => {
        let sessions: any[] = [];

        for (const key of keys) {
          const tokenData: any = await connectRedis.get(key);

          if (tokenData) {
            const parsedTokenData = JSON.parse(tokenData);

            try {
              const decoded: any = jwt.verify(
                parsedTokenData?.token,
                INTERVIEW_JWT_SECRET
              );

              const { token, ...sessionWithoutToken } = parsedTokenData;

              sessions.push({
                session: sessionWithoutToken,
                ...(type === "interview" ? { ttl: await getTTL(key) } : {}),
                id: decoded?.id || decoded?.interviewId,
              });
            } catch (err) {
              continue;
            }
          }
        }

        return sessions;
      };

      const getTTL = async (key: string): Promise<number> => {
        return new Promise<number>((resolve, reject) => {
          connectRedis.ttl(key, (err: any, ttl: any) => {
            if (err) {
              return reject(err);
            }
            resolve(ttl);
          });
        });
      };

      const [activeInterviews, activeReviewSessions] = await Promise.all([
        fetchSessions(interviewKeys, "interview"),
        fetchSessions(reviewKeys, "review"),
      ]);

      res.status(200).json({
        success: true,
        activeInterviews,
        activeReviewSessions,
      });
    } catch (error: any) {
      return next(new ErrorHandler("Error fetching active sessions", 500));
    }
  }
);

/**
 * Creates the Interviewer for the User
 */
export const HandleCreateInterviewier = cactchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { user } = req;
      const { id } = req.params;

      if (!user || !user._id) {
        return res.status(400).json({ message: "User not provided" });
      }
      const questionData: any = (QuestionData as IQuestion[]).find(
        (question: any) => question.id === id
      );

      if (!questionData) {
        return next(new ErrorHandler("No question found", 404));
      }

      const assistant = await CreateInterviewier(questionData);
      if (!assistant) {
        return next(new ErrorHandler("Error in Creating Assistant.", 500));
      }
      const Thread = await CreateThread(
        assistant?.id,
        user?.name,
        questionData
      );

      req.threadId = Thread?.threadId;
      req.assistantId = assistant?.id;
      req.assistantFirstMessage = Thread?.Ai;
      next();
    } catch (error: any) {
      return next(new ErrorHandler("Error creating interview assistant.", 500));
    }
  }
);

export const getAllMessages = async (threadId: string) => {
  let messages: any[] = [];

  // Fetch the first page of messages
  let messagesPage: any = await openai.beta.threads.messages.list(threadId);
  messages = messagesPage?.body?.data || [];

  // Keep fetching more pages as long as there's a next page
  while (messagesPage.hasNextPage()) {
    messagesPage = await messagesPage.getNextPage();
    messages = messages.concat(messagesPage?.body?.data || []);
  }

  // Return all the messages in the conversation
  return {
    messages, // Entire message list
    totalMessages: messages.length, // Total number of messages fetched
  };
};

