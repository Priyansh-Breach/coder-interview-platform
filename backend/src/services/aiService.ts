import axios from "axios";
import { Readable } from "stream";

const LLM_API_URL = "http://127.0.0.1:11434/api/generate";

// Utility function to handle Node.js streams
const handleStream = (
  stream: Readable,
  callback: (data: string) => void,
  onEnd: () => void
) => {
  stream.on("data", (chunk) => {
    const text = chunk.toString(); // Convert Buffer to string
    callback(text);
  });

  stream.on("end", () => {
    onEnd();
  });

  stream.on("error", (error) => {
    console.error("Stream error:", error);
  });
};

export const generateQuestionContext = async (
  question: string
): Promise<string> => {
  const prompt = `${question}`;

  const requestBody = {
    model: "phase_1",
    prompt: `{ "question": ${prompt}}`,
  };

  try {
    console.log("Sending request with:", requestBody);

    const response = await axios.post(LLM_API_URL, requestBody, {
      responseType: "stream", // Set the response type to stream
    });

    let fullResponse = "";

    return new Promise((resolve) => {
      handleStream(
        response.data as unknown as Readable,
        (chunk) => {
          fullResponse += JSON.parse(chunk).response;
        },
        () => {
          resolve(fullResponse);
        }
      );
    });
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
  const prompt = JSON.stringify({
    question: question,
    conversation_log: conversationLog,
    user_current_approach: userCurrentApproach,
    user_code: userCode,
  });

  const requestBody = {
    model: "phase_2",
    prompt: prompt,
  };

  try {
    console.log("Sending request with:", requestBody);

    const response = await axios.post(LLM_API_URL, requestBody, {
      responseType: "stream",
    });

    let fullResponse = "";

    return new Promise((resolve) => {
      handleStream(
        response.data as unknown as Readable,
        (chunk) => {
          fullResponse += chunk;
        },
        () => {
          resolve(fullResponse);
        }
      );
    });
  } catch (error) {
    console.error("Error generating response:", error);
    throw error;
  }
};
