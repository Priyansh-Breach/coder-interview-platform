/* eslint-disable @typescript-eslint/no-explicit-any */
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface AuthState {
  token: string;
  user: string;
  loading: boolean; // Add loading state
}

const initialState: AuthState = {
  token: "",
  user: "",
  loading: false, // Initial loading state is false
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    userRegistration: (state, action: PayloadAction<{ token: string }>) => {
      state.token = action.payload.token;
    },
    userLoggedIn: (
      state,
      action: PayloadAction<{ accessToken: string; user: string }>
    ) => {
      state.token = action.payload.accessToken;
      state.user = action.payload.user;
    },
    userLoggedOut: (state) => {
      state.token = "";
      state.user = "";
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
});

export const {
  userRegistration,
  userLoggedIn,
  userLoggedOut,
  setLoading,
} = authSlice.actions;

export default authSlice.reducer;