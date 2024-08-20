import { Middleware } from "@reduxjs/toolkit";
import { socket } from "../../../socket";
import { addMessage, updateStatus } from "./editorSlice";
import { appendResponse } from "./socketResponseSlice";
import { setLoading } from "../Interview/socketResponseSlice";

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

  // socket.on("loading", (chunk: boolean) => {
  //   storeAPI.dispatch(setLoading(chunk));
  // });

  socket.on("responseStream", (chunk: string, loading: boolean) => {
    let jsonObject = JSON.parse(chunk);
    storeAPI.dispatch(setLoading(loading));
    storeAPI.dispatch(appendResponse(jsonObject?.response));
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
