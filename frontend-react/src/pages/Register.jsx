import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, ArrowLeft } from 'lucide-react';
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
      navigate('/', { replace: true });
    } else {
      setError(res.error || 'Registration failed');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'radial-gradient(circle at top right, var(--surface-primary-strong), transparent 40%), radial-gradient(circle at bottom left, var(--surface-secondary-strong), transparent 40%)',
      position: 'relative'
    }}>
      {/* Top Navigation */}
      <nav style={{
        padding: '1.5rem',
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        zIndex: 10
      }}>
        <div className="container">
          <Link to="/" className="btn btn-secondary glass" style={{
            padding: '0.5rem 1rem',
            display: 'inline-flex',
            gap: '0.5rem',
            fontSize: '0.9rem',
            borderRadius: 'var(--radius-full)'
          }}>
            <ArrowLeft size={18} /> Back to Home
          </Link>
        </div>
      </nav>

      <div className="card glass fade-in" style={{ width: '100%', maxWidth: '420px', padding: '2.5rem' }}>
        <div className="flex flex-col items-center gap-4 text-center mb-8">
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, var(--primary-500), var(--primary-600))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            boxShadow: 'var(--shadow-md)'
          }}>
            <Heart size={24} fill="currentColor" />
          </div>
          <div>
            <h2 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Create Account</h2>
            <p className="text-secondary text-sm">Join our community of future mothers.</p>
          </div>
        </div>

        {error && (
          <div style={{
            background: 'var(--surface-accent)',
            border: '1px solid var(--accent-500)',
            color: 'var(--text-error)',
            padding: '0.75rem',
            borderRadius: 'var(--radius-md)',
            marginBottom: '1.5rem',
            fontSize: '0.9rem',
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold" style={{ color: 'var(--text-secondary)' }}>Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Enter your name"
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border-color)',
                background: 'var(--bg-app)',
                fontSize: '1rem',
                transition: 'border-color 0.2s',
                outline: 'none',
                color: 'var(--text-primary)'
              }}
              onFocus={(e) => e.target.style.borderColor = 'var(--primary-500)'}
              onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold" style={{ color: 'var(--text-secondary)' }}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email"
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border-color)',
                background: 'var(--bg-app)',
                fontSize: '1rem',
                transition: 'border-color 0.2s',
                outline: 'none',
                color: 'var(--text-primary)'
              }}
              onFocus={(e) => e.target.style.borderColor = 'var(--primary-500)'}
              onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold" style={{ color: 'var(--text-secondary)' }}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Create a password"
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border-color)',
                background: 'var(--bg-app)',
                fontSize: '1rem',
                transition: 'border-color 0.2s',
                outline: 'none',
                color: 'var(--text-primary)'
              }}
              onFocus={(e) => e.target.style.borderColor = 'var(--primary-500)'}
              onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem' }} disabled={loading}>
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <p className="text-center text-sm" style={{ marginTop: '2rem', color: 'var(--text-secondary)' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--primary-600)', fontWeight: '600' }}>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
