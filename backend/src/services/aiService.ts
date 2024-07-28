// src/services/aiService.ts
import { HfInference } from "@huggingface/inference";

const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

export const generateResponse = async (
  question: string,
  code: string,
  userExplanation: string,
  language: string,
): Promise<string> => {
  const prompt = `Role: Interviewer\nGiven the data about coding question, comment on the user's provided approach with respect to the provided solution.\n${question}`;//\nInterviewee Explanation: ${userExplanation}\nCoding Language: ${language}\nInterviewee Code: ${userCode}`;
  try {
    const response = await hf.textGeneration({
      model: 'unsloth/Meta-Llama-3.1-8B',
      inputs: prompt,
      parameters: {
        max_new_tokens: 200,
      },
    });
    console.log(response);
    return response.generated_text.trim();
  } catch (error) {
    console.error("Error generating response:", error);
    throw error;
  }
};
