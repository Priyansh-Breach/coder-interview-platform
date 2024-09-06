import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface MessageInterface {
  sender: string;
  response: string;
  code?: string;
  language?: string;
  userMessage?: string;
  interviewId?: string;
}

interface ConversationInterface {
  message: MessageInterface[];
  interviewId: string;
}

const initialState: ConversationInterface = {
  message: [],
  interviewId: "",
};

const conversationSlice = createSlice({
  name: "conversation",
  initialState,
  reducers: {
    setConversation(state, action: PayloadAction<MessageInterface>) {
      state.message.push(action.payload);
    },
    setInterviewId(state, action: PayloadAction<string>) {
      state.interviewId = action.payload;
    },
  },
});

export const { setConversation, setInterviewId } = conversationSlice.actions;
export default conversationSlice.reducer;
