import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "./features/Api/apiSlice";
import authReducer, { setLoading } from "./features/Auth/authSlice";

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    auth: authReducer,
  },
  devTools: false,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
});

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

