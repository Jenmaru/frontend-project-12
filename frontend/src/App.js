import {
  BrowserRouter, Routes, Route, Navigate,
} from 'react-router-dom';
import { useEffect, useState } from 'react';
import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import { Provider, ErrorBoundary } from '@rollbar/react';
import Rollbar from 'rollbar';
import path from './pathes';
import SignUpPage from './pages/signUpPage.jsx';
import ChatPage from './pages/chatPage.jsx';
import MainPage from './pages/mainPage.jsx';
import NotFoundPage from './pages/page404.jsx';
import AuthContext from './contexts/index.jsx';
import { ChatProvider } from './contexts/chatContext.jsx';
import ru from './locales/ru';

const AuthProvider = ({ children }) => {
  const stateInit = localStorage.token;
  const [loggedIn, setLoggedIn] = useState(stateInit);

  const logIn = (token, username) => {
    setLoggedIn(true);
    localStorage.token = token;
    localStorage.username = username;
  };

  const logOut = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setLoggedIn(false);
    window.location = path.login;
  };

  return (
    <AuthContext.Provider value={{
      loggedIn, logIn, logOut,
    }}
    >
      {children}
    </AuthContext.Provider>
  );
};

const Access = ({ children }) => {
  if (!localStorage.token) {
    return <Navigate to={path.login} />;
  }
  return children;
};

const rollbarConfig = {
  accessToken: process.env.TOKEN_ROLLBAR,
  environment: process.env.ENVIRONMENT_ROLLBAR,
  captureUncaught: true,
  captureUnhandledRejections: true,
};

const rollbar = new Rollbar(rollbarConfig);

const App = ({ socket }) => {
  i18next
    .use(initReactI18next)
    .init({
      lng: 'ru',
      resources: {
        ru,
      },
    });

  useEffect(() => {
    socket.on('connect_error', (e) => {
      rollbar.error(e);
    });
  }, [socket]);

  return (
    <Provider config={rollbarConfig}>
      <BrowserRouter>
        <ErrorBoundary>
          <AuthProvider>
            <Routes>
              <Route
                path={path.chat}
                element={(
                  <Access>
                    <ChatProvider socket={socket}>
                      <ChatPage />
                    </ChatProvider>
                  </Access>
              )}
              />
              <Route path={path.login} element={<MainPage />} />
              <Route path={path.notFound} element={<NotFoundPage />} />
              <Route path={path.signup} element={<SignUpPage />} />
            </Routes>
          </AuthProvider>
        </ErrorBoundary>
      </BrowserRouter>
    </Provider>
  );
};

export default App;
