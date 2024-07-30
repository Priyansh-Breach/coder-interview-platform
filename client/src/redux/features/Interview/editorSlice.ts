// src/slices/editorSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface EditorState {
  code: string;
  language: string;
}

const initialState: EditorState = {
  code: "",
  language: "javascript",
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
  },
});

export const { setCode, setLanguage } = editorSlice.actions;
export default editorSlice.reducer;
