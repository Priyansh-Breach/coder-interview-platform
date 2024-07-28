// src/controllers/interviewController.ts
import { cactchAsyncError } from "../middleware/catchAsyncError";
import { generateResponse } from "../services/aiService";
import { transcribeAudio } from "../services/speechToTextService";
import { synthesizeSpeech } from "../services/textToSpeechService";
import { Request, Response } from "express";
import { promises as fs } from "fs";
import path from "path";

interface IInterview {
  question: string;
  code: string;
  language: string;
  userExplaination: string;
}

export const handleInterview = cactchAsyncError(
  async (req: Request, res: Response) => {
    try {
      console.log(req.body);
      const { question, code, language, userExplaination } =
        req.body as IInterview;
      // const userExplanation = await transcribeAudio(audioFilePath);

      const aiResponse = await generateResponse(
        question,
        code,
        userExplaination,
        language
      );

      const outputDir = path.resolve("output");
      const outputFilePath = path.join(outputDir, "response.mp3");

      // Ensure the output directory exists
      // await fs.mkdir(outputDir, { recursive: true });

      // await synthesizeSpeech(aiResponse, outputFilePath);
      console.log(aiResponse);
      // res.sendFile(outputFilePath);
      res.status(201).json({
        message: aiResponse,
      });
    } catch (error) {
      console.error("Error handling interview:", error);
      res.status(500).send("Internal Server Error");
    }
  }
);
