import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sellerProfile, setSellerProfile] = useState(null);

  useEffect(() => {
    // Rehydrate auth state from localStorage on app mount
    const storedToken = localStorage.getItem('authToken');
    const storedUser = localStorage.getItem('authUser');
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const fetchSellerProfile = async () => {
    try {
      const res = await api.get('/seller/settings');
      setSellerProfile(res.data);
    } catch (err) {
      console.error('Failed to fetch seller profile', err);
    }
  };

  useEffect(() => {
    if (token) {
      fetchSellerProfile();
    } else {
      setSellerProfile(null);
    }
  }, [token]);

  const login = (tokenValue, userData) => {
    localStorage.setItem('authToken', tokenValue);
    localStorage.setItem('authUser', JSON.stringify(userData));
    setToken(tokenValue);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');
    localStorage.removeItem('tempToken');
    setToken(null);
    setUser(null);
    setSellerProfile(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, sellerProfile, setSellerProfile, fetchSellerProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};
