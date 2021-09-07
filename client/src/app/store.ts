import { configureStore } from '@reduxjs/toolkit';

import terminal from '../features/Terminal/terminalSlice';

export const store = configureStore({
  reducer: {terminal},
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch