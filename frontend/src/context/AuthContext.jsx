import { createContext, useState, useEffect } from 'react';
import authService from '../services/authService';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return !!localStorage.getItem('user');
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        // Priority: Restore session securely from HTTP-only session cookie or Bearer header
        const sessionData = await authService.getSession();
        const currentUser = sessionData?.user || (sessionData?.email ? sessionData : null);

        if (currentUser) {
          setUser(currentUser);
          setIsAuthenticated(true);
          localStorage.setItem('user', JSON.stringify(currentUser));
        } else {
          setUser(null);
          setIsAuthenticated(false);
          localStorage.removeItem('user');
          localStorage.removeItem('token');
        }
      } catch {
        // Cookie or token absent or expired
        setUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (credentials) => {
    const response = await authService.login(credentials);
    const receivedUser = response.user;
    if (response.token) {
      localStorage.setItem('token', response.token);
    }
    setUser(receivedUser);
    setIsAuthenticated(true);
    localStorage.setItem('user', JSON.stringify(receivedUser));
    return response;
  };

  const googleLogin = async (googleData) => {
    const response = await authService.googleLogin(googleData);
    const receivedUser = response.user;
    if (response.token) {
      localStorage.setItem('token', response.token);
    }
    setUser(receivedUser);
    setIsAuthenticated(true);
    localStorage.setItem('user', JSON.stringify(receivedUser));
    return response;
  };

  const githubLogin = async (githubData) => {
    const response = await authService.githubOAuth(githubData);
    const receivedUser = response.user;
    if (response.token) {
      localStorage.setItem('token', response.token);
    }
    setUser(receivedUser);
    setIsAuthenticated(true);
    localStorage.setItem('user', JSON.stringify(receivedUser));
    return response;
  };

  const register = async (data) => {
    const response = await authService.register(data);
    const receivedUser = response.user;
    if (response.token) {
      localStorage.setItem('token', response.token);
    }
    if (receivedUser) {
      setUser(receivedUser);
      setIsAuthenticated(true);
      localStorage.setItem('user', JSON.stringify(receivedUser));
    }
    return response;
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (e) {
      console.warn('Logout request completed:', e);
    }
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    setIsAuthenticated(true);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loading,
        login,
        register,
        googleLogin,
        githubLogin,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext;
