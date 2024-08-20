import "reflect-metadata";
import express, { Request, Response } from "express";
import { connectMongoDB } from "./Database/mongoDb";
import { app } from "./app";
import { Server } from "socket.io";
import http from "http";
import {
  generateQuestionContext,
  generateResponse,
} from "./services/aiService";

import QuestionData from "./Database/Questions/leetcode-solutions.json";

const server = http.createServer(app);
export const io = new Server(server);

const PORT = process.env.PORT || 3000;

app.use(express.json());

interface IQuestion {
  id: string;
  content: string;
  title: string;
  difficulty?: string;
}

interface IQuestionContext {
  questionId: string;
  userQuery: any;
}

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // Handling the custom event
  socket.on("startQuestionContextGeneration", async (data) => {
    const { questionId } = data;
    try {
      const questionData: any = (QuestionData as IQuestion[]).find(
        (question: any) => question.id === questionId
      );
      if (!questionData) {
        return;
      }

      await generateQuestionContext(questionData?.content, socket);
    } catch (error) {
      console.error("Error during streaming:", error);
      socket.emit("error", "Failed to generate question context");
    }
  });

  socket.on("startResponseGeneration", async (data) => {
    const { question, conversationLog, userCurrentApproach, userCode } = data;

    try {
      // Start the response generation process
      await generateResponse(
        question,
        conversationLog,
        userCurrentApproach,
        userCode,
        socket
      );
    } catch (error) {
      console.error("Error during response generation:", error);
      socket.emit("error", "Failed to generate response");
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  // MongoDB connection function
  connectMongoDB();
});
