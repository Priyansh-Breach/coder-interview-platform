import dotenv from "dotenv";
dotenv.config();

import express, { NextFunction, Response, Request } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import multer from "multer";

import ErrorMiddleware from "./middleware/errorHandler";
import { transcribeAudio } from "./services/speechToTextService";
import { generateResponse } from "./services/aiService";
import { promises as fs } from "fs";
import path from "path";

import userRoutes from "./routes/userRoutes";
import codeRoutes from "./routes/codeRoutes";
import interviewRoutes from "./routes/interviewRoutes";
import explorePageRoutes from "./routes/explorePageRoutes";

export const app = express();

/**
 * Cross origin resource sharing
 */
app.use(
  cors({
    origin: [
      "http://10.128.0.4:5173",
      "https://dronacharya.co",
      "http://34.134.72.92:5173",
    ],
    methods: ["GET", "POST"],
    credentials: true,
  })
);

const upload = multer({ dest: "uploads/" });

app.use(express.json());
app.use(cookieParser());

app.use("/api", interviewRoutes);
app.use("/api/users", userRoutes);
app.use("/api/code", codeRoutes);
app.use("/api/explore", explorePageRoutes);

/**Route not found */
app.use("*", (req: Request, res: Response, next: NextFunction) => {
  const error = new Error(`Route ${req} originUrl not found`) as any;
  error.statusCode = 404;
  next(error);
});

// io.on("connection", (socket) => {
//   console.log("a user connected");

//   socket.on(
//     "audioData",
//     async (audioBuffer, questionContext, userCode, language) => {
//       try {
//         const userExplanation = ""; //await transcribeAudio(audioBuffer);

//         const aiResponse = await generateResponse(
//           questionContext,
//           userExplanation,
//           userCode,
//           language
//         );

//         console.log("ai", aiResponse);

//         const outputDir = path.resolve("output");
//         const outputFilePath = path.join(outputDir, "response.mp3");

//         // Ensure the output directory exists
//         await fs.mkdir(outputDir, { recursive: true });

//         // await synthesizeSpeech(aiResponse, outputFilePath);

//         // Send the response back to the client
//         socket.emit("aiResponse", aiResponse);
//         socket.emit("audioResponse", { filePath: outputFilePath });
//       } catch (error) {
//         console.error("Error handling audio data:", error);
//         socket.emit("error", "Internal Server Error");
//       }
//     }
//   );

//   socket.on("disconnect", () => {
//     console.log("user disconnected");
//   });
// });

/**
 * Error Handler
 */
app.use(ErrorMiddleware);
