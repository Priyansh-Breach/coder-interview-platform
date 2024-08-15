// src/services/aiService.ts
import axios from "axios";

const LLM_API_URL = "http://127.0.0.1:11434/api/generate";

export const generateQuestionContext = async (
  question: string,
  code: string,
  userExplanation: string,
  language: string
): Promise<string> => {
  // Construct the prompt with the provided inputs
  const prompt = `${question}`;

  // Define the request body
  const requestBody = {
    model: "temp",
    prompt: `{ "question": ${prompt}}`,
    stream: false
  };

  try {
    console.log("Sending request with:", requestBody);

    // Make the POST request to the LLM API
    const response = await axios.post(LLM_API_URL, requestBody);

    console.log("Response received:", response.data.response);

    // Return the generated response
    return response.data.response;
  } catch (error) {
    console.error("Error generating response:", error);
    throw error;
  }
};

