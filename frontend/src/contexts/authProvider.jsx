import {
  createContext, useState, useContext,
} from 'react';

const AuthContext = createContext({});

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null);

  const logIn = (data) => {
    setUser(data);
    localStorage.setItem('user', JSON.stringify(data));
  };

  const logOut = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const getAuth = () => {
    if (user?.token) {
      return { Authorization: `Bearer ${user.token}` };
    }
    return {};
  };

  return (
    <AuthContext.Provider value={{
      user,
      logIn,
      logOut,
      getAuth,
    }}
    >
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => useContext(AuthContext);

export { useAuth };
export default AuthProvider;
