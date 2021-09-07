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
    keyPressed: (state, action: PayloadAction<string>) => {
      state.currentLine += action.payload;
    },

    cePressed: (state) => {
      state.currentLine.slice(0, state.currentLine.length - 1)
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

export const { keyPressed, cePressed, calculate } = terminalSlice.actions
export default terminalSlice.reducer
