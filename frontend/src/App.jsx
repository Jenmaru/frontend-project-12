import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.js';
import AuthProvider from './contexts/authProvider.jsx';
import PagesRouter from './Routers/PagesRouter.jsx';

const App = () => (
  <AuthProvider>
    <PagesRouter />
  </AuthProvider>
);

export default App;
