import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface QuestionData {
  id: string;
  title: string;
  content: string;
  difficulty: string;
}

interface EditorState {
  code: string;
  language: string;
  userMessage: string;
  messages: string[];
  questionData?: QuestionData | null;
  status: string;
  interviewTimeLeft: any;
  sendCode: boolean;
}

const initialState: EditorState = {
  code: "",
  language: "Select Language",
  userMessage: "",
  messages: [],
  status: "disconnected",
  interviewTimeLeft: 0,
  sendCode: true,
};

const editorSlice = createSlice({
  name: "editor",
  initialState,
  reducers: {
    setCode(state, action: PayloadAction<string>) {
      state.code = action.payload;
    },
    setLanguage(state, action: PayloadAction<string>) {
      state.language = action.payload;
    },
    userMessage(state, action: PayloadAction<string>) {
      state.userMessage = action.payload;
    },
    addMessage(state, action: PayloadAction<string>) {
      state.messages.push(action.payload);
    },
    setQuestionData(state, action: PayloadAction<QuestionData>) {
      state.questionData = action.payload;
    },
    updateStatus(state, action: PayloadAction<string>) {
      state.status = action.payload;
    },
    setInterviewTime(state, action: PayloadAction<any>) {
      state.interviewTimeLeft = action.payload;
    },
    updateSendCode: (state, action: PayloadAction<boolean>) => {
      state.sendCode = action.payload;
    },
  },
});

export const {
  setCode,
  setLanguage,
  addMessage,
  updateStatus,
  setQuestionData,
  userMessage,
  setInterviewTime,
  updateSendCode,
} = editorSlice.actions;
export default editorSlice.reducer;
