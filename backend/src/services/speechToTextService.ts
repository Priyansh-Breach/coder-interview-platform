// src/services/speechToTextService.ts
import { HfInference } from "@huggingface/inference";
import { promises as fs } from "fs";

const hf = new HfInference("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");

export const transcribeAudio = async (
  audioFilePath: string
): Promise<string> => {
  const audioBuffer = await fs.readFile(audioFilePath);
  const response = await hf.automaticSpeechRecognition({
    model: "openai/whisper-base",
    data: audioBuffer,
  });
  return response.text;
};
