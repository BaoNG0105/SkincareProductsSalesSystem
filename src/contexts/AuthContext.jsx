import { createContext, useState, useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [authState, setAuthState] = useState({
    isAuthenticated: false,
    user: null
  });

  // Kiểm tra token và cập nhật authState khi component mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setAuthState({
          isAuthenticated: true,
          user: decoded
        });
      } catch (error) {
        console.error('Invalid token:', error);
        localStorage.removeItem('token');
        setAuthState({
          isAuthenticated: false,
          user: null
        });
      }
    }
  }, []);

  const updateAuthState = (newState) => {
    setAuthState(newState);
  };

  return (
    <AuthContext.Provider value={{ authState, updateAuthState }}>
      {children}
    </AuthContext.Provider>
  );
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export function useAuth() {
  return useContext(AuthContext);
} 