import { Middleware } from "@reduxjs/toolkit";
import { socket } from "../../../socket";
import { addMessage, updateStatus } from "./editorSlice";
import { appendResponse } from "./socketResponseSlice";

export const socketMiddleware: Middleware = (storeAPI) => {
  socket.on("connect", () => {
    console.log("Connected to Socket.IO server:", socket.id);
    storeAPI.dispatch(updateStatus("connected"));
  });

  socket.on("disconnect", () => {
    console.log("Disconnected from Socket.IO server");
    storeAPI.dispatch(updateStatus("disconnected"));
  });

  socket.on("questionContextStream", (chunk: string) => {
    storeAPI.dispatch(addMessage(chunk));
  });

  socket.on("responseStream", (chunk) => {
    // Convert the ArrayBuffer to a string
    const stringData: any = arrayBufferToString(chunk);

    // Optionally parse it if it's JSON
    try {
      const jsonData = JSON.parse(stringData);
      storeAPI.dispatch(appendResponse(jsonData.response)); // Dispatch the 'response' field
    } catch (error) {
      console.error("Error parsing JSON:", error);
      storeAPI.dispatch(appendResponse(stringData)); // Or handle the raw string if not JSON
    }
  });

  socket.on("streamEnd", (message: string) => {
    storeAPI.dispatch(addMessage(message));
  });

  socket.on("error", (error: Error) => {
    console.error("Socket.IO error:", error);
    storeAPI.dispatch(updateStatus("error"));
  });

  return (next) => (action) => {
    return next(action);
  };
};
function arrayBufferToString(chunk: any) {
  throw new Error("Function not implemented.");
}
