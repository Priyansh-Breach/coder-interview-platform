// src/services/textToSpeechService.ts
import { HfInference } from "@huggingface/inference";
import { promises as fs } from "fs";
import path from "path";

const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

export const synthesizeSpeech = async (
  text: string,
  outputFile: string
): Promise<void> => {
  const response = await hf.textToSpeech({
    model: "facebook/fastspeech2-en-ljspeech",
    inputs: text,
  });

  const arrayBuffer = await response.arrayBuffer();
  const audioBuffer = Buffer.from(arrayBuffer);
  await fs.writeFile(outputFile, audioBuffer);
};
