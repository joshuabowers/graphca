import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { App } from './app';
import { store } from './app/store';
import { Provider } from 'react-redux';
import reportWebVitals from './reportWebVitals';
import { ErrorBoundary } from './features/ErrorBoundary';

const renderApp = () =>
  ReactDOM.render(
    <React.StrictMode>
      <Provider store={store}>
        <ErrorBoundary>
          <App />
        </ErrorBoundary>
      </Provider>
    </React.StrictMode>,
    document.getElementById('root')
  );

if(process.env.NODE_ENV !== 'production' && module.hot){
  module.hot.accept('./app', renderApp);
}

renderApp();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
