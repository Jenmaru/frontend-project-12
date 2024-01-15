import { Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import useAuth from '../hooks/index.jsx';

const Header = () => {
  const { t } = useTranslation();
  const auth = useAuth();

  return (
    <nav className="shadow-sm navbar navbar-expand-lg navbar-light bg-white">
      <div className="container">
        <a className="navbar-brand" href="/">{t('header.title')}</a>
        {auth.loggedIn
          ? <Button onClick={auth.logOut}>{t('header.exit')}</Button>
          : null}
      </div>
    </nav>
  );
};

export default Header;
