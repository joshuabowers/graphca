import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface GraphState {
  expressions: string[]
}

const initialState: GraphState = {expressions: []}

export const graphSlice = createSlice({
  name: 'graph',
  initialState,
  reducers: {
    graph: (state, action: PayloadAction<string>) => {
      state.expressions.push(action.payload)
    },

    removePlot: (state, action: PayloadAction<string>) => {
      state.expressions = state.expressions.filter(item => item !== action.payload)
    },

    clear: (state) => {
      state.expressions = []
    }
  }
})

export const { graph, removePlot, clear } = graphSlice.actions
export default graphSlice.reducer
