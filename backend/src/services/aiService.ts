// src/services/aiService.ts
import axios from "axios";
import { stringify } from "querystring";

const LLM_API_URL = "http://127.0.0.1:11434/api/generate";

export const generateQuestionContext = async (
  question: string
): Promise<string> => {
  // Construct the prompt with the provided inputs
  const prompt = `${question}`;

  // Define the request body
  const requestBody = {
    model: "temp",
    prompt: `{ "question": ${prompt}}`,
    stream: false,
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

export const generateResponse = async (
  question: any,
  conversationLog: any, 
  userCurrentApproach: string,
  userCode: any
): Promise<string> => {
  // Construct the prompt with the provided inputs
  const prompt = stringify(
    {
      "question": question,
      "conversation_log": conversationLog,
      "user_current_approach": userCurrentApproach,
      "user_code": userCode
    }
  )

  // Define the request body
  const requestBody = {
    model: "temp2",
    prompt: prompt,
    stream: false,
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
