import React from 'react';
import ReactDOM from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.js';
import { io } from 'socket.io-client';
import { Provider } from 'react-redux';
import App from './App';
import reportWebVitals from './reportWebVitals';
import store from './reducers/StoreReducer';

const root = ReactDOM.createRoot(document.getElementById('root'));

const socket = io();

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App socket={socket} />
    </Provider>
  </React.StrictMode>,
);

reportWebVitals();
