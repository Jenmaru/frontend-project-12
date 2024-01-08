import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { MainPage } from './components/MainPage';
import ChatPage from './components/chatPage';
import path from './pathes';
import React, { useEffect, useState } from 'react';

import { Provider, ErrorBoundary } from '@rollbar/react';
import AuthContext from './contexts/index';
import { ChatProvider } from './contexts/chatContext';
import { initReactI18next } from 'react-i18next';

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

const App = ({ socket }) => {

  useEffect(() => {
    socket.on('connect_error', (e) => {
      e;
    });
  }, [socket]);

  return (
    <Provider>
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
      </Routes>
      </AuthProvider>
    </BrowserRouter>
    </Provider>
  );
}

export default App;
