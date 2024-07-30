// src/redux/store.ts
import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { apiSlice } from "./features/Api/apiSlice";
import authReducer, { setLoading } from "./features/Auth/authSlice";
import editorReducer from "./features/Interview/editorSlice";

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    auth: authReducer,
    editor: editorReducer,
  },
  devTools: false,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
});


export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export const refreshTokenFunc = async () => {
  try {
    await store.dispatch(
      apiSlice.endpoints.refreshToken.initiate({}, { forceRefetch: true })
    );
  } catch (error) {
    // Handle errors as needed
    console.error("Error refreshing:", error);
  }
};

export const initializeApp = async () => {
  try {
    store.dispatch(setLoading(true)); // Set loading to true before making requests
    await store.dispatch(
      apiSlice.endpoints.refreshToken.initiate({}, { forceRefetch: true })
    );
    await store.dispatch(
      apiSlice.endpoints.loadUser.initiate({}, { forceRefetch: true })
    );
  } catch (error) {
    // Handle errors as needed
    console.error("Error refreshing:", error);
  } finally {
    store.dispatch(setLoading(false)); // Set loading to false after requests are completed
  }
};

// Return a promise to handle async initialization
export const initializeAppAsync = () => {
  return initializeApp();
};
