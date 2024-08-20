import { Server, Socket } from "socket.io";
import {
  generateQuestionContext,
  generateResponse,
  simulateStream,
} from "../../services/aiService";
import { handleAiQuestionContext } from "../../controllers/Socket.io/interviewController";

export const socketRoutes = (io: Server) => {
  io.on("connection", (socket: Socket) => {
    console.log("A user connected:", socket.id);

    socket.on("startQuestionContextGeneration", (data) => {
      try {
        socket.emit("loading", { loading: true });
        handleAiQuestionContext(socket, data);
        socket.emit("loading", { loading: false });
      } catch (error: any) {
        socket.emit("error", { loading: false });
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
};
