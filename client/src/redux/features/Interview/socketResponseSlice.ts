import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  response: "",
  userMessage: "",
  code: "",
  language: "",
  error: null,
  streaming: false,
  loading: false,
};

const aiResponseSlice = createSlice({
  name: "aiResponse",
  initialState,
  reducers: {
    appendResponse(state, action) {
      state.response += action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
    },
    setStreaming(state, action) {
      state.streaming = action.payload;
    },
    resetResponse(state) {
      state.response = "";
    },
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setUserMessage(state, action) {
      state.userMessage = action.payload;
    },
    setCode(state, action) {
      state.code = action.payload;
    },
    setLanguage(state, action) {
      state.language = action.payload;
    },
  },
});

export const {
  appendResponse,
  setError,
  setStreaming,
  resetResponse,
  setLoading,
  setUserMessage,
  setCode,
  setLanguage,
} = aiResponseSlice.actions;

export default aiResponseSlice.reducer;
