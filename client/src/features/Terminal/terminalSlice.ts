import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface TerminalEntryState {
  type: 'input' | 'output';
  content: string;
}

export interface TerminalState {
  name: string;
  currentLine: string;
  history: Array<TerminalEntryState>;
}

const initialState: TerminalState = {
  name: 'terminal',
  currentLine: '',
  history: []
}

export const terminalSlice = createSlice({
  name: 'terminal',
  initialState,
  reducers: {
    keyPress: (state, action: PayloadAction<string>) => {
      state.currentLine += action.payload;
    },

    deleteLast: (state) => {
      state.currentLine = state.currentLine.slice(0, state.currentLine.length - 1)
    },

    calculate: (state) => {
      state.history.push({
        type: 'input',
        content: state.currentLine
      });
      state.currentLine = '';
    }
  }
})

export const { keyPress, deleteLast, calculate } = terminalSlice.actions
export default terminalSlice.reducer
