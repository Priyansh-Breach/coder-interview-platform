// src/slices/editorSlice.ts
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
  questionData?: QuestionData | null; 
}

const initialState: EditorState = {
  code: "",
  language: "javascript",
  questionData: null,
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
    setQuestionData(state, action: PayloadAction<QuestionData>) { 
      state.questionData = action.payload;
    },
  },
});

export const { setCode, setLanguage, setQuestionData } = editorSlice.actions;
export default editorSlice.reducer;
