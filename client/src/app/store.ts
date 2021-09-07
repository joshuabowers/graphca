import { configureStore, Middleware } from '@reduxjs/toolkit';
import rootReducer from './reducers'

function configureAppStore() {
  const environment = process.env.NODE_ENV;
  const middleware: Middleware[] = [];

  if(environment === 'development'){
    const reduxLogger = require('redux-logger');
    middleware.push(reduxLogger.logger as Middleware);
  }

  const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(middleware)
  })

  if(environment !== 'production' && module.hot){
    module.hot?.accept('./reducers', () => store.replaceReducer(rootReducer))
  }

  return store;
}

export const store = configureAppStore()
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch