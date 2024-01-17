import { io } from 'socket.io-client';
import { Provider } from 'react-redux';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.js';
import store from './reducers/StoreReducer';
import App from './App';

const socket = io();

const init = async () => (
  <Provider store={store}>
    <App socket={socket} />
  </Provider>
);

export default init;
