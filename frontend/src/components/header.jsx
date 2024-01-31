import { Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/authProvider.jsx';

const HeaderComponent = () => {
  const { t } = useTranslation();
  const auth = useAuth();
  const loggedIn = auth.getAuth() !== null;

  return (
    <nav className="shadow-sm navbar navbar-expand-lg navbar-light bg-white">
      <div className="container">
        <a className="navbar-brand" href="/">{t('header.title')}</a>
        {loggedIn
          ? <Button onClick={auth.logOut}>{t('header.exit')}</Button>
          : null}
      </div>
    </nav>
  );
};

export default HeaderComponent;
