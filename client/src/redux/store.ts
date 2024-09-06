// src/redux/store.ts
import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { apiSlice } from "./features/Api/apiSlice";
import authReducer, { setLoading } from "./features/Auth/authSlice";
import editorReducer from "./features/Interview/editorSlice";
import { socketMiddleware } from "./features/Interview/SocketMiddleware";
import aiResponseReducer from "./features/Interview/socketResponseSlice";
import panelReducer from "./features/Interview/panelSlice";
import conversationReducer from "./features/Interview/conversationSlice";
import { persistStore, persistReducer } from "redux-persist";
import persistConfig from "./persistConfig";
import { createLogger } from "redux-logger";

// Add logger middleware (optional, useful for debugging)
const logger = createLogger({
  collapsed: true,
});


const persistedPanelReducer = persistReducer(persistConfig, panelReducer);
const editorPersistedPanelReducer = persistReducer(
  persistConfig,
  editorReducer
);
const conversationPersistedReducer = persistReducer(
  persistConfig,
  conversationReducer
);
export const store = configureStore({
  reducer: {
    panel: persistedPanelReducer,
    editor: editorPersistedPanelReducer,
    conversation: conversationPersistedReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
    auth: authReducer,
    aiResponse: aiResponseReducer,
  },
  devTools: true,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(apiSlice.middleware, socketMiddleware, logger),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export const persistor = persistStore(store);

export const refreshTokenFunc = async () => {
  try {
    await store.dispatch(
      apiSlice.endpoints.refreshToken.initiate({}, { forceRefetch: true })
    );
  } catch (error) {
    console.error("Error refreshing:", error);
  }
};

export const initializeApp = async () => {
  try {
    store.dispatch(setLoading(true)); 
    await store.dispatch(
      apiSlice.endpoints.refreshToken.initiate({}, { forceRefetch: true })
    );
    await store.dispatch(
      apiSlice.endpoints.loadUser.initiate({}, { forceRefetch: true })
    );
  } catch (error) {
    console.error("Error refreshing:", error);
  } finally {
    store.dispatch(setLoading(false));
  }
};

export const initializeAppAsync = () => {
  return initializeApp();
};
