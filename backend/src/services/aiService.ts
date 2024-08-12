// src/services/aiService.ts
import axios from "axios";

const LLM_API_URL = "http://127.0.0.1:11434/api/generate";

export const generateResponse = async (
  question: string,
  code: string,
  userExplanation: string,
  language: string
): Promise<string> => {
  // Construct the prompt with the provided inputs
  const prompt = `Role: Interviewer\nGiven the data about the coding question, comment on the user's provided approach, code, and explanation. The question is "${question}", the code is "${code}", the explanation is "${userExplanation}", and the language is "${language}".`;

  // Define the request body
  const requestBody = {
    model: "llama3.1",
    prompt: prompt,
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

