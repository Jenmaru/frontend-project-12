import { io } from 'socket.io-client';
import { Provider } from 'react-redux';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.js';
import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import store from './slices/StoreReducer';
import App from './App';
import ru from './locales/ru';

const init = async () => {
  await i18next
    .use(initReactI18next)
    .init({
      lng: 'ru',
      resources: {
        ru,
      },
    });

  const socket = io();
  return (
    <Provider store={store}>
      <App socket={socket} />
    </Provider>
  );
};

export default init;
