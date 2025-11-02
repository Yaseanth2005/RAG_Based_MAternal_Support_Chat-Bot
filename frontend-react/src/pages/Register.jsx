import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const { register, loading } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const res = await register(name, email, password);
    if (res.ok) {
      navigate('/chat', { replace: true });
    } else {
      setError(res.error || 'Registration failed');
    }
  };

  return (
    <div className="auth-page" style={{ maxWidth: 420, margin: '60px auto' }}>
      <h2>Create account</h2>
      {error && <div className="error" style={{ color: 'crimson', marginBottom: 12 }}>{error}</div>}
      <form onSubmit={onSubmit} className="auth-form" style={{ display: 'grid', gap: 12 }}>
        <label>
          <div>Name</div>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
        </label>
        <label>
          <div>Email</div>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </label>
        <label>
          <div>Password</div>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </label>
        <button type="submit" disabled={loading} className="primary">{loading ? 'Creating…' : 'Create account'}</button>
      </form>
      <div style={{ marginTop: 12 }}>
        Have an account? <Link to="/login">Sign in</Link>
      </div>
    </div>
  );
};

export default Register;
