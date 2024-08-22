import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface PanelState {
  questionPanelVisible: boolean;
  consolePanelVisible: boolean;
  chatPanelVisible: boolean;
}

const initialState: PanelState = {
  questionPanelVisible: true,
  consolePanelVisible: true,
  chatPanelVisible: true,
};

const panelSlice = createSlice({
  name: "panel",
  initialState,
  reducers: {
    setQuestionPanel(state, action: PayloadAction<boolean>) {
      state.questionPanelVisible = action.payload;
    },
    setConsolePanel(state, action: PayloadAction<boolean>) {
      state.consolePanelVisible = action.payload;
    },
    setChatPanel(state, action: PayloadAction<boolean>) {
      state.chatPanelVisible = action.payload;
    },
  },
});

export const { setQuestionPanel, setConsolePanel, setChatPanel } =
  panelSlice.actions;
export default panelSlice.reducer;
