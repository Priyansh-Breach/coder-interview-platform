import dotenv from "dotenv";
dotenv.config({ path: "./keys.env" });

import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import multer from "multer";
import { handleInterview } from "./controllers/interviewController";
import userRoutes from "./routes/userRoutes";
import codeRoutes from "./routes/codeRoutes";
import { errorHandler } from "./middleware/errorHandler";
import { transcribeAudio } from "./services/speechToTextService";
import { generateResponse } from "./services/aiService";
import { promises as fs } from "fs";
import path from "path";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

const upload = multer({ dest: "uploads/" });

app.use(cors()); // Add CORS middleware
app.use(express.json());

app.post("/interview", upload.single("audio"), handleInterview);
app.use("/users", userRoutes);
app.use("/code", codeRoutes);
app.use(errorHandler);

io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on(
    "audioData",
    async (audioBuffer, questionContext, userCode, language) => {
      try {
        const userExplanation = "" //await transcribeAudio(audioBuffer);

        const aiResponse = await generateResponse(
          questionContext,
          userExplanation,
          userCode,
          language
        );

        console.log("ai", aiResponse);

        const outputDir = path.resolve("output");
        const outputFilePath = path.join(outputDir, "response.mp3");

        // Ensure the output directory exists
        await fs.mkdir(outputDir, { recursive: true });

        // await synthesizeSpeech(aiResponse, outputFilePath);

        // Send the response back to the client
        socket.emit("aiResponse", aiResponse);
        socket.emit("audioResponse", { filePath: outputFilePath });
      } catch (error) {
        console.error("Error handling audio data:", error);
        socket.emit("error", "Internal Server Error");
      }
    }
  );

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
