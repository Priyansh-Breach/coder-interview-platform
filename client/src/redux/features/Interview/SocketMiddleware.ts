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
    console.log(chunk);
    storeAPI.dispatch(setLoading(loading));
    storeAPI.dispatch(appendResponse(jsonObject?.response));
  });

  socket.on("responseStreamConversation", (chunk: string, loading: boolean) => {
    let jsonObject = chunk?.response;
    storeAPI.dispatch(setLoading(loading));

    if (apnd === 1) {
      let c = jsonObject.split('",')[0].split('"');
     
      storeAPI.dispatch(appendResponse(c[c.length - 1] + " "));
    }

    if (jsonObject === '{"response":') {
      apnd = 1;
    }

    if (chunk?.done) {
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
  });

  return (next) => (action) => {
    return next(action);
  };
};
