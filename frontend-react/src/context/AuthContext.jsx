import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import api from '../api/client';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => {
    try { return localStorage.getItem('token') || null; } catch { return null; }
  });
  const [user, setUser] = useState(() => {
    try { const u = localStorage.getItem('user'); return u ? JSON.parse(u) : null; } catch { return null; }
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    try {
      if (token) localStorage.setItem('token', token); else localStorage.removeItem('token');
      if (user) localStorage.setItem('user', JSON.stringify(user)); else localStorage.removeItem('user');
    } catch {}
  }, [token, user]);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const { data } = await api.post('/api/auth/login', { email, password });
      setToken(data.access_token);
      setUser(data.user);
      return { ok: true };
    } catch (e) {
      return { ok: false, error: e.response?.data?.error || e.message };
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password) => {
    setLoading(true);
    try {
      const { data } = await api.post('/api/auth/register', { name, email, password });
      setToken(data.access_token);
      setUser(data.user);
      return { ok: true };
    } catch (e) {
      return { ok: false, error: e.response?.data?.error || e.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => { setToken(null); setUser(null); };

  const value = useMemo(() => ({ token, user, loading, login, register, logout }), [token, user, loading]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
