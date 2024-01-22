import { Navigate, Outlet, useLocation } from 'react-router-dom';
import useAuth from '../hooks/index.jsx';
import routes from '../routes';

const AccessRoute = () => {
  const { user } = useAuth();
  const location = useLocation();

  if (location.pathname === routes.chat) {
    return user
      ? <Navigate to={routes.chat} state={{ from: location.pathname }} />
      : <Outlet />;
  }

  if (location.pathname === routes.signup) {
    return user
      ? <Navigate to={routes.chat} state={{ from: location.pathname }} />
      : <Outlet />;
  }

  return user
    ? <Outlet />
    : <Navigate to={routes.login} state={{ from: location.pathname }} />;
};

export default AccessRoute;
