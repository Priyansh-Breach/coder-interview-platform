import { Middleware } from "@reduxjs/toolkit";
import { socket } from "../../../socket";
import { addMessage, updateSendCode, updateStatus } from "./editorSlice";
import {
  appendResponse,
  setLoading,
  setError,
  resetResponse,
} from "./socketResponseSlice";
import {
  appendMessages,
  resetConversation,
  setConversation,
  setFetchConversationLoading,
} from "./conversationSlice";

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
    storeAPI.dispatch(setLoading(loading));
    console.log(chunk);
    storeAPI.dispatch(appendResponse(chunk));
    if (JSON.parse(storeAPI.getState().aiResponse.response)) {
      storeAPI.dispatch(
        setConversation({
          sender: "ai",
          response: storeAPI.getState().aiResponse.response,
          code: storeAPI.getState().aiResponse.code,
          language: storeAPI.getState().aiResponse.language,
          userMessage: storeAPI.getState().aiResponse.userMessage,
          interviewId: storeAPI.getState().conversation.interviewId,
        })
      );
      storeAPI.dispatch(
        updateSendCode(
          JSON.parse(storeAPI.getState().aiResponse.response)?.code
        )
      );

      storeAPI.dispatch(resetResponse());
    }
  });

  socket.on("conversationFromRedis", (conversation: any) => {
    storeAPI.dispatch(resetConversation());
    storeAPI.dispatch(setConversation(conversation[0]));

    console.log(conversation[0]);
  });

  // Listen for the loaded messages
  socket.on("messages", (data: any, loading: any) => {
    const newMessages = data?.messages?.messages;

    extractContentFromMessages(newMessages, storeAPI);
    storeAPI.dispatch(setFetchConversationLoading(loading?.loading));
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

const extractContentFromMessages = (messages: any[], storeAPI: any) => {
  const contentArray: any[] = [];
  messages = messages.reverse();
  messages.forEach((message) => {
    if (message?.role === "user") {
      const jsonObject = JSON.parse(message?.content[0]?.text?.value);
      storeAPI.dispatch(
        setConversation({
          sender: "user",
          response: jsonObject?.user_current_approach,
          code: jsonObject?.user_code,
          // language: storeAPI.getState().aiResponse.language,
          // userMessage: storeAPI.getState().aiResponse.userMessage,
          // interviewId: storeAPI.getState().conversation.interviewId,
        })
      );
    } else if (message?.role === "assistant") {
      const jsonObject = JSON.parse(message?.content[0]?.text?.value);

      storeAPI.dispatch(
        setConversation({
          sender: "ai",
          response: jsonObject?.response,
          // code: storeAPI.getState().aiResponse.code,
          // language: storeAPI.getState().aiResponse.language,
          // userMessage: storeAPI.getState().aiResponse.userMessage,
          // interviewId: storeAPI.getState().conversation.interviewId,
        })
      );
    }
  });

  return contentArray;
};
