import { Server, Socket } from "socket.io";
import {
  generateQuestionContext,
  generateResponse,
  simulateStream,
} from "../../services/aiService";
import {
  handleAiConversationResponse,
  handleAiQuestionContext,
} from "../../controllers/Socket.io/SocketinterviewController";

export const socketRoutes = (io: Server) => {
  io.on("connection", (socket: Socket) => {

    socket.on("startQuestionContextGeneration", (data) => {
      try {
        socket.emit("loading", { loading: true });
        handleAiQuestionContext(socket, data);
      } catch (error: any) {
        socket.emit("error", { loading: false });
      }
    });

    socket.on("startConversationResponseGeneration", async (data) => {
      try {
        socket.emit("loading", { loading: true });
        await handleAiConversationResponse(socket, data);
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
