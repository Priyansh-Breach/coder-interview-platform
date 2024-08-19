import { createSlice } from "@reduxjs/toolkit";

// Define the initial state with response as an empty string
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
  },
});

// Export the actions
export const { appendResponse, setError, setStreaming, resetResponse } =
  aiResponseSlice.actions;

// Export the reducer
export default aiResponseSlice.reducer;
