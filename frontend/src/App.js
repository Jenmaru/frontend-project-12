import {
  BrowserRouter, Routes, Route, Navigate,
} from 'react-router-dom';
import routes from './routes.js';
import SignUpPage from './pages/SignUp.jsx';
import ChatPage from './pages/Chat.jsx';
import MainPage from './pages/SignIn.jsx';
import NotFoundPage from './pages/Page404.jsx';
import { ChatProvider } from './contexts/chatContext.jsx';
import AuthProvider, { useAuth } from './contexts/authProvider.jsx';
import { getCurrentChannel } from './slices/Channels.js';

const Access = ({ children }) => {
  const auth = useAuth();
  if (auth.user === null) {
    return <Navigate to={routes.login()} />;
  }
  return children;
};

const App = ({ socket }) => (
  <AuthProvider>
    <BrowserRouter>
      <Routes>
        <Route
          path={routes.chat()}
          element={(
            <ChatProvider socket={socket}>
              <Access>
                <ChatPage getMainChannel={getCurrentChannel} />
              </Access>
            </ChatProvider>
              )}
        />
        <Route path={routes.login()} element={<MainPage />} />
        <Route path={routes.notFound()} element={<NotFoundPage />} />
        <Route path={routes.signup()} element={<SignUpPage />} />
      </Routes>
    </BrowserRouter>
  </AuthProvider>
);

export default App;
