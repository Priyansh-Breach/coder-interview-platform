import { createSlice } from "@reduxjs/toolkit";

// Define the initial state with response as an empty string
const initialState = {
  response: "",
  error: null,
  streaming: false,
  loading: false,
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
    setLoading(state, action) {
      state.loading = action.payload;
    },
  },
});

// Export the actions
export const {
  appendResponse,
  setError,
  setStreaming,
  resetResponse,
  setLoading,
} = aiResponseSlice.actions;

// Export the reducer
export default aiResponseSlice.reducer;
