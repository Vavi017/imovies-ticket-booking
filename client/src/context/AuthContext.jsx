import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('imovies_token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const storedToken = localStorage.getItem('imovies_token');
      if (storedToken) {
        try {
          const { data } = await api.get('/auth/me');
          if (data.success && data.user) {
            setUser(data.user);
          }
        } catch (err) {
          console.warn('Failed to restore user session:', err);
          logout();
        }
      }
      setLoading(false);
    };

    fetchUser();
  }, []);

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    if (data.success) {
      localStorage.setItem('imovies_token', data.token);
      localStorage.setItem('imovies_user', JSON.stringify(data.user));
      setToken(data.token);
      setUser(data.user);
      return data.user;
    }
  };

  const register = async (userData) => {
    const { data } = await api.post('/auth/register', userData);
    if (data.success) {
      localStorage.setItem('imovies_token', data.token);
      localStorage.setItem('imovies_user', JSON.stringify(data.user));
      setToken(data.token);
      setUser(data.user);
      return data.user;
    }
  };

  const logout = () => {
    localStorage.removeItem('imovies_token');
    localStorage.removeItem('imovies_user');
    setToken(null);
    setUser(null);
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('imovies_user', JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        login,
        register,
        logout,
        updateUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
