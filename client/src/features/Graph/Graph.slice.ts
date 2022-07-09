import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { forget } from "../Terminal/Terminal.slice";

export interface Plot {
  expression: string;
  enteredAt: number;
}

export interface GraphState {
  plots: Plot[]
}

const initialState: GraphState = {plots: []}

export const graphSlice = createSlice({
  name: 'graph',
  initialState,
  reducers: {
    graph: (state, action: PayloadAction<Plot>) => {
      state.plots.push(action.payload)
    },

    removePlot: (state, action: PayloadAction<number>) => {
      state.plots = state.plots.filter(item => item.enteredAt !== action.payload)
    },

    clear: (state) => {
      state.plots = []
    }
  },
  extraReducers: (builder) => {
    builder.addCase(forget, (state, action) => {
      state.plots = state.plots.filter(item => item.enteredAt !== action.payload)
    })
  }
})

export const { graph, removePlot, clear } = graphSlice.actions
export default graphSlice.reducer
