import axios from "axios";
import { Readable } from "stream";
import { IQuestion } from "../controllers/interviewController";
// Set your LLM API URL
const LLM_API_URL = "http://127.0.0.1:11434/api/generate";

// Utility function to handle Node.js streams
const handleStream = (
  stream: Readable,
  onData: (data: string) => void,
  onEnd: () => void
) => {
  stream.on("data", (chunk) => {
    const text = chunk.toString(); // Convert Buffer to string
    onData(text);
  });

  stream.on("end", () => {
    onEnd();
  });

  stream.on("error", (error) => {
    console.error("Stream error:", error);
  });
};

export const generateQuestionContext = async (
  question: IQuestion | undefined,
  socket: any
) => {
  const prompt = `${question}`;
  const requestBody = {
    model: "phase_1",
    prompt: `{ "question": ${prompt}}`,
  };

  try {

    const response = await axios.post(LLM_API_URL, requestBody, {
      responseType: "stream", // Set the response type to stream
    });

    handleStream(
      response.data as unknown as Readable,
      (chunk) => {
        socket.emit("responseStream", chunk); 
      },
      () => {
        socket.emit("responseComplete"); 
      }
    );
  } catch (error) {
    socket.emit("error", "Failed to generate question context"); 
  }
};

export const generateResponse = async (
  question: any,
  conversationLog: any,
  userCurrentApproach: string,
  userCode: any,
  socket: any // Add socket parameter for emitting data
) => {
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

    handleStream(
      response.data as unknown as Readable,
      (chunk) => {
        socket.emit("responseStream", chunk); 
      },
      () => {
        socket.emit("responseComplete"); 
      }
    );
  } catch (error) {
    console.error("Error generating response:", error);
    socket.emit("error", "Failed to generate response"); // Emit error message to client
  }
};
