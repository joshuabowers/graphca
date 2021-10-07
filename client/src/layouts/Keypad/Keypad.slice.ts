import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ModeType } from "../../features/Mode";

export interface KeypadState {
  currentMode: ModeType
}

const initialState: KeypadState = {
  currentMode: 'default'
}

export const keypadSlice = createSlice({
  name: 'keypad',
  initialState,
  reducers: {
    changeMode: (state, action: PayloadAction<ModeType>) => {
      state.currentMode = action.payload
    }
  }
})

export const { changeMode } = keypadSlice.actions
export default keypadSlice.reducer