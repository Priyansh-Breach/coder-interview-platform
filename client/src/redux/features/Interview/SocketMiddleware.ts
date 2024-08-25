import { Middleware } from "@reduxjs/toolkit";
import { socket } from "../../../socket";
import { addMessage, updateStatus } from "./editorSlice";
import { appendResponse, setLoading, setError } from "./socketResponseSlice";

let apnd = 0;

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

  socket.on("loading", (chunk: boolean) => {
    storeAPI.dispatch(setLoading(chunk));
  });

  socket.on("responseStream", (chunk: string, loading: boolean) => {
    let jsonObject = chunk;
    storeAPI.dispatch(setLoading(loading));
    storeAPI.dispatch(appendResponse(jsonObject?.response));
  });
  socket.on("responseStreamConversation", (chunk: string, loading: boolean) => {
    let jsonObject = chunk?.response;
    storeAPI.dispatch(setLoading(loading));
    if (jsonObject == '"code":') {
      apnd = 0;
    }
    if (apnd == 1) {
      let c = jsonObject.split('",')[0].split('"')
      storeAPI.dispatch(appendResponse(c[c.length-1] + " "));
    }
    if (jsonObject == '{"response":') {
      apnd = 1;
    }
  });

  socket.on("streamEnd", (message: string) => {
    storeAPI.dispatch(addMessage(message));
  });

  socket.on("error", (error: Error, loading: boolean) => {
    storeAPI.dispatch(setLoading(loading));
    storeAPI.dispatch(setError(error));
  });

  return (next) => (action) => {
    return next(action);
  };
};
