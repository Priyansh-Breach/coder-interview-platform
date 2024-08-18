import axios from "axios";

const LLM_API_URL = "http://127.0.0.1:11434/api/generate";

// Utility function to handle streaming data
const handleStream = (
  stream: ReadableStream,
  callback: (data: string) => void
) => {
  const reader = stream.getReader();
  const decoder = new TextDecoder();

  const read = () => {
    reader.read().then(({ done, value }) => {
      if (done) {
        return;
      }
      callback(decoder.decode(value, { stream: true }));
      read();
    });
  };

  read();
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

    handleStream(response.data, (chunk) => {
      fullResponse += chunk;
      console.log("Received chunk:", chunk);
    });

    return new Promise((resolve) => {
      response.data.on("end", () => {
        console.log("Full response received:", fullResponse);
        resolve(fullResponse);
      });
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

    handleStream(response.data, (chunk) => {
      fullResponse += chunk;
      console.log("Received chunk:", chunk);
    });

    return new Promise((resolve) => {
      response.data.on("end", () => {
        console.log("Full response received:", fullResponse);
        resolve(fullResponse);
      });
    });
  } catch (error) {
    console.error("Error generating response:", error);
    throw error;
  }
};
