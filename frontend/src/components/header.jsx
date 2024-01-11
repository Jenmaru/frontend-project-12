import useAuth from '../hooks/index.jsx';
import { useTranslation } from "react-i18next";
import { Button } from 'react-bootstrap';

const Header = () => {
    const { t } = useTranslation();
    const auth = useAuth();

    const AuthButton = () => {
        const auth = useAuth();
      
        return (
          auth.loggedIn
            ? <Button onClick={auth.logOut}>{t("header.exit")}</Button>
            : null
        );
      };

    return (
        <>
        <nav className='shadow-sm navbar navbar-expand-lg navbar-light bg-white'>
            <div className='container'>
              <a className='navbar-brand' href='/'>{t("header.title")}</a>
                <AuthButton />
            </div>
          </nav>
        </>
    )
}

export default Header;