import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const { login, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/chat';

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const res = await login(email, password);
    if (res.ok) {
      navigate(from, { replace: true });
    } else {
      setError(res.error || 'Login failed');
    }
  };

  return (
    <div className="auth-page" style={{ maxWidth: 420, margin: '60px auto' }}>
      <h2>Sign in</h2>
      {error && <div className="error" style={{ color: 'crimson', marginBottom: 12 }}>{error}</div>}
      <form onSubmit={onSubmit} className="auth-form" style={{ display: 'grid', gap: 12 }}>
        <label>
          <div>Email</div>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </label>
        <label>
          <div>Password</div>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </label>
        <button type="submit" disabled={loading} className="primary">{loading ? 'Signing in…' : 'Sign in'}</button>
      </form>
      <div style={{ marginTop: 12 }}>
        New here? <Link to="/register">Create an account</Link>
      </div>
    </div>
  );
};

export default Login;
