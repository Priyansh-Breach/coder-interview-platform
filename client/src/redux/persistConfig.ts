// src/redux/persistConfig.ts
import { PersistConfig } from "redux-persist";
import storage from "redux-persist/lib/storage";

const persistConfig: PersistConfig<any> = {
  key: "panel",
  storage,
  whitelist: [
    "chatPanelVisible",
    "consolePanelVisible",
    "questionPanelVisible",
    "code",
    "language",
    "sendCode",
    "interviewId",
    "threadId",
  ],
};

export default persistConfig;
