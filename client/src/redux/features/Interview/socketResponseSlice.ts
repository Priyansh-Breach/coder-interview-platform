import { createSlice } from "@reduxjs/toolkit";

// Define the initial state
const initialState = {
  response: "",
  error: null,
  streaming: false,
};

// Create the slice
const aiResponseSlice = createSlice({
  name: "aiResponse",
  initialState,
  reducers: {
    // Append only the 'response' field from the payload
    appendResponse(state, action) {
      if (action.payload && typeof action.payload.response === "string") {
        state.response += action.payload.response;
      }
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
  },
});

// Export the actions
export const { appendResponse, setError, setStreaming, resetResponse } = aiResponseSlice.actions;

// Export the reducer
export default aiResponseSlice.reducer;
