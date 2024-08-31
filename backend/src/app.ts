import dotenv from "dotenv";
dotenv.config();

import express, { NextFunction, Response, Request } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import multer from "multer";

import ErrorMiddleware from "./middleware/errorHandler";
import { transcribeAudio } from "./services/speechToTextService";
import { generateQuestionContext } from "./services/aiService";
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
      "http://35.192.173.75:5173",
      "http://localhost:5173",
      "https://dronacharya.co",
    ],
    methods: ["GET", "POST"],
    credentials: true,
  })
);

const upload = multer({ dest: "uploads/" });

app.use(express.json());
app.use(cookieParser());

app.use("/api/interview", interviewRoutes);
app.use("/api/users", userRoutes);
app.use("/api/code", codeRoutes);
app.use("/api/explore", explorePageRoutes);

/**Route not found */
app.use("*", (req: Request, res: Response, next: NextFunction) => {
  const error = new Error(`Route ${req} originUrl not found`) as any;
  error.statusCode = 404;
  next(error);
});
app.use(ErrorMiddleware);
