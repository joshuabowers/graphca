import { createSlice, PayloadAction, createSelector } from "@reduxjs/toolkit";
export interface TerminalEntryState {
  type: 'input' | 'output';
  content: string;
  enteredAt: number;
  showDerivation: boolean;
}

export interface TerminalState {
  name: string;
  currentLine: string[];
  history: Array<TerminalEntryState>;
  focus?: number
}

const initialState: TerminalState = {
  name: 'terminal',
  currentLine: [],
  history: [],
  focus: undefined
}

export const terminalSlice = createSlice({
  name: 'terminal',
  initialState,
  reducers: {
    keyPress: (state, action: PayloadAction<string>) => {
      state.currentLine.push(action.payload);
      state.focus = undefined
    },

    deleteLast: (state) => {
      state.currentLine.pop();
      state.focus = undefined
    },

    calculate: (state) => {
      state.history.push({
        type: 'input',
        content: state.currentLine.join(''),
        enteredAt: Date.now(),
        showDerivation: false
      });
      state.focus = state.history[state.history.length-1].enteredAt
      state.currentLine = [];
    },

    toggleDerivation: (state, action: PayloadAction<number>) => {
      const entry = state.history.find(item => item.enteredAt === action.payload)
      if(entry){ entry.showDerivation = !entry.showDerivation }
      state.focus = entry?.enteredAt
    },

    forget: (state, action: PayloadAction<number>) => {
      const next = state.history.find(item => item.enteredAt > action.payload)
      state.history = state.history.filter(item => item.enteredAt !== action.payload)
      state.focus = next?.enteredAt
    }
  }
})

export const { 
  keyPress, deleteLast, calculate, toggleDerivation, forget 
} = terminalSlice.actions
export default terminalSlice.reducer

const rawCurrentLine = (state: TerminalState) => state.currentLine;
export const currentLine = createSelector(rawCurrentLine, (lineParts) => lineParts.join(''));