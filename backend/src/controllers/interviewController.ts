// src/controllers/interviewController.ts
import { generateResponse } from "../services/aiService";
import { transcribeAudio } from "../services/speechToTextService";
import { synthesizeSpeech } from "../services/textToSpeechService";
import { Request, Response } from "express";
import { promises as fs } from "fs";
import path from "path";

export const handleInterview = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).send("No file uploaded.");
    }

    const audioFilePath = req.file.path;

    const userExplanation = await transcribeAudio(audioFilePath);

    // Load questions context from JSON file
    const questionsContext = await fs.readFile("questions.json", "utf-8");

    const aiResponse = await generateResponse(questionsContext, "I will sort and then check for sum of all possible 2 value combinations");

    const outputDir = path.resolve("output");
    const outputFilePath = path.join(outputDir, "response.mp3");

    // Ensure the output directory exists
    await fs.mkdir(outputDir, { recursive: true });

    await synthesizeSpeech(aiResponse, outputFilePath);

    res.sendFile(outputFilePath);
  } catch (error) {
    console.error("Error handling interview:", error);
    res.status(500).send("Internal Server Error");
  }
};
