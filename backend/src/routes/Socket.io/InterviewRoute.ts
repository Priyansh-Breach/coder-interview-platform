import { Server, Socket } from "socket.io";
import { handleAiConversationResponse } from "../../controllers/Socket.io/SocketinterviewController";
import { attachSocket } from "../../controllers/interviewController";

export const socketRoutes = (io: Server) => {
  io.on("connection", (socket: Socket) => {
    
    socket.on("startConversationResponseGeneration", async (data) => {
      try {
        socket.emit("loading", { loading: true });

        await handleAiConversationResponse(socket, data);
      } catch (error) {
        socket.emit("error", "Failed to generate response.");
      }
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });
};
