// src/controllers/interviewController.ts
import { cactchAsyncError } from "../middleware/catchAsyncError";
import { transcribeAudio } from "../services/speechToTextService";
import { synthesizeSpeech } from "../services/textToSpeechService";
import { NextFunction, Request, Response } from "express";
import { promises as fs } from "fs";
import path from "path";
import QuestionData from "../Database/Questions/leetcode-solutions.json";
import ErrorHandler from "../Utils/Error Handler/errorHandler";
import {
  generateQuestionContext,
  generateResponse,
} from "../services/aiService";
import { stringify } from "querystring";
import { io } from "../server";

export interface IQuestion {
  id: string;
  content: string;
  title: string;
  difficulty?: string;
}

interface IQuestionContext {
  questionId: string;
  userQuery: any;
}
/**
 * Ai Response based on question it gives question context
 */

export const handleAiQuestionContext = cactchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { questionId } = req.body as IQuestionContext;
      const questionData = (QuestionData as IQuestion[]).find(
        (question: any) => question.id === questionId
      );

      if (!questionData) {
        return next(new ErrorHandler("Question not found", 404));
      }
      const questionContent =
        "Hello Thiis is question content from interview controller";

      io.emit("startQuestionContextGeneration", { questionContent });
      // const questionContext = await generateQuestionContext(
      //   questionData.content
      // );

      res.status(200).json({
        message: "Response generation started",
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

interface IInterview {
  questionId: string;
  language: string;
  userCurrentApproach: string;
  userCode: string;
}

interface IConversation {
  user: string;
  ai: string | null;
}

/**
 * Ai Response based on user input
 */
export const handleAiResponse = cactchAsyncError(
  async (req: Request, res: Response) => {
    try {
      const { userCurrentApproach, questionId, userCode, language } =
        req.body as IInterview;
      const questionData = (QuestionData as IQuestion[]).find(
        (question) => question.id === questionId
      );

      const conversationArray = [] as IConversation[];
      const userCodeandLanguage = `${userCode} is in language ${language}`;
      // if (userCurrentApproach) {
      //   const aiResponse = await generateResponse(
      //     questionData,
      //     conversationArray,
      //     userCurrentApproach,
      //     userCodeandLanguage
      //   );

      //   conversationArray.push({
      //     user: userCurrentApproach,
      //     ai: aiResponse,
      //   });
      // }

      res.status(201).json({
        questionData: questionData,
        message: "aiResponse",
        conversation: conversationArray,
      });
    } catch (error) {
      console.error("Error handling interview:", error);
      res.status(500).send("Internal Server Error");
    }
  }
);

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
