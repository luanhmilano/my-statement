import { useState, useMemo } from 'react';
import { AuthContext } from './auth.context';

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('authToken');
  });

  const login = (userToken: string) => {
    setToken(userToken);
    localStorage.setItem('authToken', userToken);
  };

  const logout = () => {
    setToken(null);
    localStorage.removeItem('authToken');
  };

  const isAuthenticated = !!token;

  const value = useMemo(
    () => ({ isAuthenticated, token, login, logout }),
    [isAuthenticated, token]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
