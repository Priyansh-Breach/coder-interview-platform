import dotenv from "dotenv";
dotenv.config({ path: "./keys.env" });

import express from "express";
import http from "http";
import { Server } from "socket.io";
import multer from "multer";
import { handleInterview } from "./controllers/interviewController";
import userRoutes from "./routes/userRoutes";
import { errorHandler } from "./middleware/errorHandler";
import { transcribeAudio } from "./services/speechToTextService";
import { generateResponse } from "./services/aiService";
import { promises as fs } from "fs";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5000",
    methods: ["GET", "POST"],
  },
});

const upload = multer({ dest: "uploads/" });

app.use(express.json());

app.post("/interview", upload.single("audio"), handleInterview);
app.use("/users", userRoutes);

// Use error handling middleware
app.use(errorHandler);

io.on("connection", (socket) => {
  console.log("a user connected");

  // Handle incoming audio data
  socket.on("audioData", async (audioBuffer) => {
    const userExplanation = await transcribeAudio(audioBuffer);

    // Load questions context from JSON file
    const questionsContext = await fs.readFile("questions.json", "utf-8");

    const aiResponse = await generateResponse(
      questionsContext,
      userExplanation
    );

    // Emit AI response back to the client
    socket.emit("aiResponse", aiResponse);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
