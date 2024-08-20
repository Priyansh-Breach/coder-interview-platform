import axios from "axios";
import { Readable } from "stream";
import { IQuestion } from "../controllers/Socket.io/interviewController";
// streamUtils.ts
import { promises as fs } from "fs";
import path from "path";

// Set your LLM API URL
const LLM_API_URL = "http://127.0.0.1:11434/api/generate";

// Utility function to handle Node.js streams
const handleStream = (
  stream: Readable,
  onData: (data: string) => void,
  onEnd: () => void
) => {
  stream.on("data", (chunk) => {
    const text = chunk?.toString(); // Convert Buffer to string
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
    socket.emit("error", "Failed to generate question context", {
      loading: false,
    });
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
    socket.emit("error", "Failed to generate question context", {
      loading: false,
    }); // Emit error message to client
  }
};

// Define the path to your JSON file
const filePath = path.resolve(
  __dirname,
  "../Database/Questions/leetcode-solutions.json"
);

// Function to simulate streaming data
export const simulateStream = async (interval: number, socket: any) => {
  try {
    // Read the JSON file
    const data = await fs.readFile(filePath, "utf-8");
    const questions = JSON.parse(data);

    let index = 0;

    // Function to send a chunk of data
    const sendChunk = () => {
      if (index < questions.length) {
        const question = questions[index];
        question.toString();
        socket.emit("responseStream", question); // Emit the chunk to the frontend
        index++;
      } else {
        socket.emit("responseComplete"); // Signal that streaming is complete
        clearInterval(streamingInterval);
      }
    };

    // Set up an interval to simulate streaming
    const streamingInterval = setInterval(sendChunk, interval);

    // Optionally, return a promise that resolves when all data is streamed
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        if (index >= questions.length) {
          resolve();
        }
      }, interval * questions.length + 1000); // Allow some time for the last chunk to be sent
    });
  } catch (error) {
    console.error("Error reading or parsing the file:", error);
  }
};
