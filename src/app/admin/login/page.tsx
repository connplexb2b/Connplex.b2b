'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import '../admin.css';

function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) {
        setLoading(false);
        setError('Invalid username or password. Please try again.');
        return;
      }

      const data = await res.json();
      // If HR, always direct to /admin/careers unless from is specifically careers/submissions
      let target = data.redirectTo || '/admin/news';
      const fromParam = searchParams?.get('from');

      if (data.role === 'hr') {
        if (fromParam && (fromParam.startsWith('/admin/careers') || fromParam.startsWith('/admin/submissions'))) {
          target = fromParam;
        } else {
          target = '/admin/careers';
        }
      } else if (fromParam) {
        target = fromParam;
      }

      // Refresh session first, then navigate
      router.refresh();

      setTimeout(() => {
        router.push(target);
      }, 150);
    } catch (err) {
      setLoading(false);
      setError('Connection error. Please try again.');
      console.error('Auth error:', err);
    }
  };

  return (
    <div className="admin-login-page">
      <button
        type="button"
        className="admin-back-btn"
        onClick={() => router.push('/')}
        aria-label="Back to home"
      >
        ← Back
      </button>
      <form className="admin-login-card" onSubmit={handleSubmit}>
        <Image
          src="/logo.png"
          alt="Connplex"
          width={160}
          height={48}
          style={{ objectFit: 'contain', margin: '0 auto 1.5rem', display: 'block', height: 'auto' }}
          priority
        />
        <h1 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '0.35rem' }}>
          Connplex Portal Login
        </h1>
        <p style={{ color: 'var(--admin-muted)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
          Sign in to access Admin Management or HR Career Applications
        </p>

        {error && <p className="admin-error">{error}</p>}

        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
          <div
            style={{
              flex: 1,
              padding: '0.45rem',
              textAlign: 'center',
              borderRadius: '6px',
              fontSize: '0.72rem',
              fontWeight: 600,
              background: 'rgba(193, 155, 98, 0.1)',
              border: '1px solid rgba(193, 155, 98, 0.25)',
              color: 'var(--admin-gold)',
            }}
          >
            🔑 Admin Portal
          </div>
          <div
            style={{
              flex: 1,
              padding: '0.45rem',
              textAlign: 'center',
              borderRadius: '6px',
              fontSize: '0.72rem',
              fontWeight: 600,
              background: 'rgba(16, 185, 129, 0.1)',
              border: '1px solid rgba(16, 185, 129, 0.25)',
              color: '#10b981',
            }}
          >
            👥 HR Recruitment
          </div>
        </div>

        <input
          type="text"
          className="admin-input"
          placeholder="Username or email (e.g. admin or hr)"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          autoComplete="username"
          style={{ marginBottom: '0.75rem' }}
        />
        <input
          type="password"
          className="admin-input"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
          style={{ marginBottom: '1rem' }}
        />
        <button
          type="submit"
          className="admin-btn admin-btn-primary"
          style={{ width: '100%', justifyContent: 'center' }}
          disabled={loading}
        >
          {loading ? 'Signing in…' : 'Sign In'}
        </button>
      </form>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<div className="admin-login-page">Loading…</div>}>
      <AdminLoginForm />
    </Suspense>
  );
}
