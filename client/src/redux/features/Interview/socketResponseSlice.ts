import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  response: [],
  error: null,
  streaming: false,
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
      state.response = [];
    },
  },
});

export const { appendResponse, setError, setStreaming, resetResponse } = aiResponseSlice.actions;
export default aiResponseSlice.reducer;