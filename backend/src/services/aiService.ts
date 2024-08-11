// src/services/aiService.ts
import axios from "axios";
import { stringify } from "querystring";

const LLM_API_URL =
  "https://api-inference.huggingface.co/models/unsloth/Meta-Llama-3.1-8B-bnb-4bit";

export const generateResponse = async (
  question: string,
  code: string,
  userExplanation: string,
  language: string
): Promise<string> => {
  const prompt = `Role: Interviewer\nGiven the data about coding question, comment on the user's provided approach with respect to the provided solution.\n${question}`;
  try {
    console.log(question, code, userExplanation, language);
    const response = await axios.post(
      LLM_API_URL,
      prompt
    );
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Error generating response:", error);
    throw error;
  }
};
