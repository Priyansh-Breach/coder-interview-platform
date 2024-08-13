// src/controllers/interviewController.ts
import { cactchAsyncError } from "../middleware/catchAsyncError";
import { generateResponse } from "../services/aiService";
import { transcribeAudio } from "../services/speechToTextService";
import { synthesizeSpeech } from "../services/textToSpeechService";
import { NextFunction, Request, Response } from "express";
import { promises as fs } from "fs";
import path from "path";
import QuestionData from "../Database/Questions/leetcode-solutions.json";
import ErrorHandler from "../Utils/Error Handler/errorHandler";

interface IInterview {
  question: string;
  code: string;
  language: string;
  userExplaination: string;
}
/**
 * Ai Response based on user input
 */
export const handleAiResponse = cactchAsyncError(
  async (req: Request, res: Response) => {
    try {
      console.log(req.body);
      const { question, code, language, userExplaination } =
        req.body as IInterview;
      // const userExplanation = await transcribeAudio(audioFilePath);

      // const aiResponse = await generateResponse(
      //   question,
      //   code,
      //   userExplaination,
      //   language
      // );

      const outputDir = path.resolve("output");
      const outputFilePath = path.join(outputDir, "response.mp3");

      // Ensure the output directory exists
      // await fs.mkdir(outputDir, { recursive: true });

      // await synthesizeSpeech(aiResponse, outputFilePath);
    
      // res.sendFile(outputFilePath);
      res.status(201).json({
        message: "aiResponse",
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

interface IQuestion {
  id: string;
  content: string;
  title: string;
  difficulty?: string;
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
