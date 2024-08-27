import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface MessageInterface {
  sender: string;
  response: string;
  code?: string;
  language?: string;
  userMessage?: string;
}

interface ConversationInterface {
  message: MessageInterface[];
}

const initialState: ConversationInterface = {
  message: [],
};

const conversationSlice = createSlice({
  name: "conversation",
  initialState,
  reducers: {
    setConversation(state, action: PayloadAction<MessageInterface>) {
      state.message.push(action.payload);
    },
  },
});

export const { setConversation } = conversationSlice.actions;
export default conversationSlice.reducer;
