// src/services/aiService.ts
// src/services/aiService.ts

const HUGGINGFACE_API_URL =
  "https://api-inference.huggingface.co/models/unsloth/Meta-Llama-3.1-8B-bnb-4bit";
const HUGGINGFACE_API_KEY = process.env.HUGGINGFACE_API_KEY;

export const generateResponse = async (
  question: string,
  code: string,
  userExplanation: string,
  language: string
): Promise<string> => {
  const prompt = `Role: Interviewer\nGiven the data about coding question, comment on the user's provided approach with respect to the provided solution.\n${question}`;
  try {
    console.log(question, code, userExplanation, language);
    let response: string = "Hard coded";
    // const response = await axios.post(
    //   HUGGINGFACE_API_URL,
    //   {
    //   }
    // // );
    // console.log(response.data);
    return response;
  } catch (error) {
    console.error("Error generating response:", error);
    throw error;
  }
};
