import { Middleware } from "@reduxjs/toolkit";
import { socket } from "../../../socket";
import { addMessage, updateStatus } from "./editorSlice";
import {
  appendResponse,
  setLoading,
  setError,
  resetResponse,
} from "./socketResponseSlice";
import { setConversation } from "./conversationSlice";

let apnd = false;
let close = false;
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
    console.log(chunk);
    let jsonObject = JSON.parse(chunk);
    storeAPI.dispatch(setLoading(loading));
    storeAPI.dispatch(appendResponse(jsonObject?.response));
    if (jsonObject?.done) {
      storeAPI.dispatch(
        setConversation({
          sender: "ai",
          response: storeAPI.getState().aiResponse.response,
          code: storeAPI.getState().aiResponse.code,
          language: storeAPI.getState().aiResponse.language,
          userMessage: storeAPI.getState().aiResponse.userMessage,
        })
      );
      storeAPI.dispatch(resetResponse());
    }
  });

  socket.on("responseStreamConversation", (chunk: string, loading: boolean) => {
    let jsonObject = JSON.parse(chunk)?.response;
    storeAPI.dispatch(setLoading(loading));
    console.log(chunk, "Handle Response Chunk");
    console.log(jsonObject, "Json object");
    console.log(apnd, "Append value");
    storeAPI.dispatch(appendResponse(jsonObject));
    // if (jsonObject.includes("~") && apnd) {
    //   apnd = false;
    //   close = true;
    // }

    // if (apnd) {
    //   storeAPI.dispatch(appendResponse(jsonObject));
    // }

    // if (jsonObject.includes("~") && !apnd && !close) {
    //   apnd = true;
    // }
    // close = false;
    if (JSON.parse(chunk)?.done) {
      storeAPI.dispatch(
        setConversation({
          sender: "ai",
          response: storeAPI.getState().aiResponse.response,
          code: storeAPI.getState().aiResponse.code,
          language: storeAPI.getState().aiResponse.language,
          userMessage: storeAPI.getState().aiResponse.userMessage,
        })
      );
      storeAPI.dispatch(resetResponse());
    }
  });

  socket.on("streamEnd", (message: string) => {
    storeAPI.dispatch(addMessage(message));
  });

  socket.on("error", (error: Error, loading: boolean) => {
    storeAPI.dispatch(setLoading(loading));
    storeAPI.dispatch(setError(error));
    storeAPI.dispatch(appendResponse(error));
  });

  return (next) => (action) => {
    return next(action);
  };
};
