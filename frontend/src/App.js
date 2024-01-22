import {
  BrowserRouter, Routes, Route, Navigate,
} from 'react-router-dom';
import { useEffect } from 'react';
import { Provider, ErrorBoundary } from '@rollbar/react';
import Rollbar from 'rollbar';
import path from './routes.js';
import SignUpPage from './pages/signUpPage.jsx';
import ChatPage from './pages/chatPage.jsx';
import MainPage from './pages/mainPage.jsx';
import NotFoundPage from './pages/page404.jsx';
import { ChatProvider } from './contexts/chatContext.jsx';
import AuthProvider, { useAuth } from './contexts/authProvider.jsx';

const Access = ({ children }) => {
  const auth = useAuth();
  if (auth.user === null) {
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
  useEffect(() => {
    socket.on('connect_error', (e) => {
      rollbar.error(e);
    });
  }, [socket]);

  return (
    <Provider config={rollbarConfig}>
      <ErrorBoundary>
        <AuthProvider>
          <BrowserRouter>
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
          </BrowserRouter>
        </AuthProvider>
      </ErrorBoundary>
    </Provider>
  );
};

export default App;
