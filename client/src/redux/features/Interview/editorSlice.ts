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
  messages: string[];
  questionData?: QuestionData | null; 
  status: string;
}

const initialState: EditorState = {
  code: "",
  language: "javascript",
  messages: [], 
  status: "disconnected", 
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
    addMessage(state, action: PayloadAction<string>) {
      state.messages.push(action.payload);
    },
    setQuestionData(state, action: PayloadAction<QuestionData>) {
      state.questionData = action.payload;
    },
    updateStatus(state, action: PayloadAction<string>) {
      state.status = action.payload;
    },
  },
});

export const { setCode, setLanguage, addMessage, updateStatus,setQuestionData } =
  editorSlice.actions;
export default editorSlice.reducer;
