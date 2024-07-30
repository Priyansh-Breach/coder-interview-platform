// src/services/aiService.ts
// src/services/aiService.ts
import axios from 'axios';

const HUGGINGFACE_API_URL =
  "https://api-inference.huggingface.co/models/unsloth/Meta-Llama-3.1-8B-bnb-4bit";
const HUGGINGFACE_API_KEY = process.env.HUGGINGFACE_API_KEY;

export const generateResponse = async (
  question: string,
  code: string,
  userExplanation: string,
  language: string,
): Promise<string> => {
  const prompt = `Role: Interviewer\nGiven the data about coding question, comment on the user's provided approach with respect to the provided solution.\n${question}`;
  try {
    const response = await axios.post(
      HUGGINGFACE_API_URL,
      {
        inputs: prompt,
        parameters: {
          max_new_tokens: 200,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${HUGGINGFACE_API_KEY}`,
        },
      }
    );
    console.log(response.data);
    return response.data.generated_text.trim();
  } catch (error) {
    console.error("Error generating response:", error);
    throw error;
  }
};
