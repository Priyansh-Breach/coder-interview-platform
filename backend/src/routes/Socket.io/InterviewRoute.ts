import { Server, Socket } from "socket.io";
import { handleAiConversationResponse } from "../../controllers/Socket.io/SocketinterviewController";
import { getAllMessages } from "../../controllers/interviewController";

export const socketRoutes = (io: Server) => {
  io.on("connection", (socket: Socket) => {
    socket.on("startConversationResponseGeneration", async (data) => {
      try {
        socket.emit("loading", { loading: true });

        await handleAiConversationResponse(socket, data);
      } catch (error) {
        socket.emit("error", "Failed to generate response.eeesdfdds");
      }
    });
    // Listening for requests to load more messages
    socket.on("getConversationFromOpenAi", async ({ threadId, cursor }) => {
      try {
        console.log(threadId);
        if (!threadId) {
          socket.emit("error", "Refresh to sync messages.", { loading: false });
          return;
        }
        const messages: any = await getAllMessages(threadId);
        
        socket.emit("messages", { messages }, { loading: false });
      } catch (error) {
        socket.emit("error", "Failed to fetch messages.");
        console.log(error);
      }
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });
};
