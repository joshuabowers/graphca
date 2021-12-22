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
    }
  }
})

export const { graph } = graphSlice.actions
export default graphSlice.reducer
