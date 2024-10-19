import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface MessageInterface {
  sender: string;
  response: string;
  code?: string;
  language?: string;
  userMessage?: string;
  interviewId?: string;
  assistantId?: string;
  threadId?: string;
}

interface ConversationInterface {
  message: MessageInterface[];
  interviewId: string;
  assistantId: string;
  threadId: string;
  questionId?: any;
  fetchConversationLoading: boolean;
}

const initialState: ConversationInterface = {
  message: [],
  interviewId: "",
  assistantId: "",
  threadId: "",
  questionId: null,
  fetchConversationLoading: false,
};

const conversationSlice = createSlice({
  name: "conversation",
  initialState,
  reducers: {
    setConversation(state, action: PayloadAction<MessageInterface>) {
      state.message.push(action.payload);
    },

    appendMessages(state, action: PayloadAction<MessageInterface[]>) {
      const incomingMessages = action.payload;

      const uniqueMessages = incomingMessages.filter(
        (incomingMessage: any) =>
          !state.message.some(
            (existingMessage: any) => existingMessage.id === incomingMessage.id
          )
      );

      state.message = [...uniqueMessages, ...state.message];
    },

    setInterviewId(state, action: PayloadAction<string>) {
      state.interviewId = action.payload;
    },

    setAssistantId(state, action: PayloadAction<string>) {
      state.assistantId = action.payload;
    },

    setThreadId(state, action: PayloadAction<string>) {
      state.threadId = action.payload;
    },
    setquestionId(state, action: PayloadAction<any>) {
      state.questionId = action.payload;
    },
    resetConversation(state) {
      state.message = [];
    },
    setFetchConversationLoading(state, action: PayloadAction<any>) {
      state.fetchConversationLoading = action.payload;
    },
  },
});

export const {
  setConversation,
  appendMessages,
  setInterviewId,
  setAssistantId,
  setThreadId,
  setquestionId,
  resetConversation,
  setFetchConversationLoading,
} = conversationSlice.actions;

export default conversationSlice.reducer;
