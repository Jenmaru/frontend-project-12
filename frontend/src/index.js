import React from 'react';
import ReactDOM from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.js';
import { io } from 'socket.io-client';
import { Provider } from 'react-redux';
import store from './reducers/StoreReducer';

import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('chat'));

const socket = io();

root.render(
  <Provider store={store}>
    <App socket={socket} />
  </Provider>,
);

reportWebVitals();
