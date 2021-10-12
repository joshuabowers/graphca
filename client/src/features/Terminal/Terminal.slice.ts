import { createSlice, PayloadAction, createSelector } from "@reduxjs/toolkit";
export interface TerminalEntryState {
  type: 'input' | 'output';
  content: string;
  enteredAt: number;
}

export interface TerminalState {
  name: string;
  currentLine: string[];
  history: Array<TerminalEntryState>;
}

const initialState: TerminalState = {
  name: 'terminal',
  currentLine: [],
  history: []
}

export const terminalSlice = createSlice({
  name: 'terminal',
  initialState,
  reducers: {
    keyPress: (state, action: PayloadAction<string>) => {
      state.currentLine.push(action.payload);
    },

    deleteLast: (state) => {
      state.currentLine.pop();
    },

    calculate: (state) => {
      state.history.push({
        type: 'input',
        content: state.currentLine.join(''),
        enteredAt: Date.now()
      });
      state.currentLine = [];
    }
  }
})

export const { keyPress, deleteLast, calculate } = terminalSlice.actions
export default terminalSlice.reducer

const rawCurrentLine = (state: TerminalState) => state.currentLine;
export const currentLine = createSelector(rawCurrentLine, (lineParts) => lineParts.join(''));