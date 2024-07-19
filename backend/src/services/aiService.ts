// src/services/aiService.ts
import { HfInference } from "@huggingface/inference";

const hf = new HfInference('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');

export const generateResponse = async (
  context: string,
  userExplanation: string
): Promise<string> => {
  const prompt = `Role: Interviewer\nGiven the data about coding question, comment on the user's provided approach with respect to the provided solution.\n${context}\n\nUser Explanation: ${userExplanation}`;
  try {
    const response = await hf.textGeneration({
      model: 'EleutherAI/gpt-neo-2.7B',
      inputs: prompt,
      parameters: {
        max_new_tokens: 150,
      },
    });
    console.log(response);
    return response.generated_text.trim();
  } catch (error) {
    console.error("Error generating response:", error);
    throw error;
  }
};
