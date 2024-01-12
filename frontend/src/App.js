import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import path from './pathes';
import React, { useEffect, useState } from 'react';
import SignUpPage from './pages/signUpPage';
import ChatPage from './pages/chatPage';
import MainPage from './pages/mainPage';
import AuthContext from './contexts/index';
import { ChatProvider } from './contexts/chatContext';
import ru from "./locales/ru";
import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import { Provider, ErrorBoundary } from '@rollbar/react';
import Rollbar from 'rollbar';

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
  accessToken: 'd172c2454e5c4eaf85d11bb98210b492',
  environment: 'testenv',
}

function TestError() {
  const a = null
  return a.hello()
}

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
      <ErrorBoundary>
        <BrowserRouter>
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
              )} />
              <Route path={path.login} element={<MainPage />} />
              <Route path={path.chat} element={<ChatPage />} />
              <Route path={path.signup} element={<SignUpPage />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </ErrorBoundary>
    </Provider>
  );
}

export default App;
