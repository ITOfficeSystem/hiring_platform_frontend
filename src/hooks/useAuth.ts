import { useState, useEffect } from 'react';
import type { HRUser } from '../types';

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [user, setUser] = useState<HRUser | null>(null);

  useEffect(() => {
    const checkAuth = () => {
      const hrToken = localStorage.getItem('hrToken');
      const hrUserData = localStorage.getItem('hrUser');

      if (hrToken && hrUserData) {
        setUser(JSON.parse(hrUserData));
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, []);

  const login = (userData: HRUser) => {
    localStorage.setItem('hrToken', 'mocktoken');
    localStorage.setItem('hrUser', JSON.stringify(userData));
    setUser(userData);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem('hrToken');
    localStorage.removeItem('hrUser');
    setUser(null);
    setIsAuthenticated(false);
  };

  return {
    isAuthenticated,
    user,
    login,
    logout,
  };
};
