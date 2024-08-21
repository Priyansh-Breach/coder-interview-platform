// src/controllers/interviewController.ts
import { cactchAsyncError } from "../middleware/catchAsyncError";
import { transcribeAudio } from "../services/speechToTextService";
import { synthesizeSpeech } from "../services/textToSpeechService";
import { NextFunction, Request, Response } from "express";
import QuestionData from "../Database/Questions/leetcode-solutions.json";
import ErrorHandler from "../Utils/Error Handler/errorHandler";
import {
  generateQuestionContext,
  generateResponse,
  simulateStream,
} from "../services/aiService";
import { IQuestion } from "./Socket.io/SocketinterviewController";
import { InterviewModel } from "../entities/interview";
import { IUser } from "../entities/User";
import {
  createInterview,
  leaveInterviewMongo,
} from "../Utils/Interview MongoDB/interview.utils.mongodb";

declare global {
  namespace Express {
    interface Request {
      user?: IUser;
      interviewToken?: string;
      userId?: string;
      questionId?: string;
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

      const questionData = (QuestionData as IQuestion[]).find(
        (question) => question.id === id
      );

      if (!questionData) {
        return next(new ErrorHandler("Question not found", 404));
      }

      res.status(200).json({
        success: true,
        data: questionData,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

/**
 * Create interview in MongoDB
 */
export const handleCreateInterviewMongo = cactchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId, questionId } = req as any;
      await createInterview(userId, questionId);
      res.status(200).json({
        success: true,
        message: "Interview Activated",
      });
    } catch (error: any) {
      return next(
        new ErrorHandler("Error in creating the interview in MongoDB : ", 400)
      );
    }
  }
);

/**
 * Mark Interveiw status as canceled in MongoDB
 */
export const handleLeaveInterviewMongo = cactchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { user, questionId } = req as any;
      await leaveInterviewMongo(user?._id, questionId);
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
