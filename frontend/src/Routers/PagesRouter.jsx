import { Routes, Route } from 'react-router-dom';
import MainPage from '../pages/mainPage.jsx';
import NotFoundPage from '../pages/page404.jsx';
import SignUpPage from '../pages/signUpPage.jsx';
import routes from '../routes.js';
import AccessRoute from './AccessRoute.jsx';
import ChatPage from '../pages/chatPage.jsx';

const PagesRouter = () => (
  <Routes>
    <Route path={routes.chat} element={<AccessRoute />}>
      <Route path={routes.chat} element={<ChatPage />} />
    </Route>
    <Route path={routes.login} element={<AccessRoute />}>
      <Route path={routes.login} element={<MainPage />} />
    </Route>
    <Route path={routes.signup} element={<AccessRoute />}>
      <Route path={routes.signup} element={<SignUpPage />} />
    </Route>
    <Route path="*" element={<NotFoundPage />} />
  </Routes>
);

export default PagesRouter;
