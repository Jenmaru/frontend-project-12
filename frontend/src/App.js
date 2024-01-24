import {
  BrowserRouter, Routes, Route, Navigate,
} from 'react-router-dom';
import path from './routes.js';
import SignUpPage from './pages/signUpPage.jsx';
import ChatPage from './pages/chatPage.jsx';
import MainPage from './pages/mainPage.jsx';
import NotFoundPage from './pages/page404.jsx';
import { ChatProvider } from './contexts/chatContext.jsx';
import AuthProvider, { useAuth } from './contexts/authProvider.jsx';
import { getCurrentChannel } from './slices/Channels.js';

const Access = ({ children }) => {
  const auth = useAuth();
  if (auth.user === null) {
    return <Navigate to={path.login} />;
  }
  return children;
};

const App = ({ socket }) => (
  <AuthProvider>
    <BrowserRouter>
      <Routes>
        <Route
          path={path.chat}
          element={(
            <ChatProvider socket={socket}>
              <Access>
                <ChatPage getMainChannel={getCurrentChannel} />
              </Access>
            </ChatProvider>
              )}
        />
        <Route path={path.login} element={<MainPage />} />
        <Route path={path.notFound} element={<NotFoundPage />} />
        <Route path={path.signup} element={<SignUpPage />} />
      </Routes>
    </BrowserRouter>
  </AuthProvider>
);

export default App;
