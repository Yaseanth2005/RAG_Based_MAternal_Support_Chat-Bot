import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Layout = ({ children }) => {
  const { user, logout, token } = useAuth ? useAuth() : { user: null, logout: () => {}, token: null };
  const navigate = useNavigate ? useNavigate() : () => {};
  const [theme, setTheme] = useState(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem('theme') : null;
    return saved === 'dark' ? 'dark' : 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    // For better contrast in light theme, invert chat bubble mapping
    document.documentElement.setAttribute('data-invert', theme === 'light' ? 'true' : 'false');
    try { localStorage.setItem('theme', theme); } catch {}
  }, [theme]);

  const toggleTheme = () => setTheme((t) => (t === 'light' ? 'dark' : 'light'));

  return (
    <div className="layout">
      <header className="header">
        <div className="header-inner">
          <div className="logo">
            <div className="logo-icon">🤱</div>
            <h1>Maternal Care AI</h1>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
              {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
            </button>
            {token ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div className="status-badge status-ready">
                  <span className="status-dot" />
                  <span>{user?.email || 'Ready'}</span>
                </div>
                <button
                  className="ghost"
                  onClick={() => { logout(); navigate('/login'); }}
                >Logout</button>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Link className="ghost" to="/login">Login</Link>
                <Link className="ghost" to="/register">Register</Link>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="main-content">
        <div className="content-inner">
          {children}
        </div>
      </main>

      <footer className="footer" style={{ padding: '12px 20px', textAlign: 'center', color: '#777' }}>
        © {new Date().getFullYear()} Maternal Care AI
      </footer>
    </div>
  );
};

export default Layout;

