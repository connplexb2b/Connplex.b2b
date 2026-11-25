'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import '../admin.css';

function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<'admin' | 'hr'>('hr');
  const [username, setUsername] = useState('hr@theconnplex.com');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleTabChange = (tab: 'admin' | 'hr') => {
    setActiveTab(tab);
    setError('');
    if (tab === 'hr') {
      setUsername('hr@theconnplex.com');
    } else {
      setUsername('admin');
    }
  };

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
        const data = await res.json().catch(() => ({}));
        setError(
          data.error ||
            (activeTab === 'hr'
              ? 'Invalid credentials. For HR, use password: connplex-hr (or your admin password).'
              : 'Invalid credentials. For Admin, use password: connplex-admin.')
        );
        return;
      }

      const data = await res.json();
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
        <p style={{ color: 'var(--admin-muted)', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
          Sign in to access Admin Management or HR Career Applications
        </p>

        {/* Interactive Mode Tabs */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
          <button
            type="button"
            onClick={() => handleTabChange('hr')}
            style={{
              flex: 1,
              padding: '0.55rem',
              textAlign: 'center',
              borderRadius: '6px',
              fontSize: '0.78rem',
              fontWeight: 700,
              cursor: 'pointer',
              border: activeTab === 'hr' ? '2px solid #10b981' : '1px solid rgba(16, 185, 129, 0.25)',
              background: activeTab === 'hr' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(16, 185, 129, 0.05)',
              color: activeTab === 'hr' ? '#10b981' : 'var(--admin-muted)',
              transition: 'all 0.2s ease',
            }}
          >
            👥 HR Recruitment
          </button>
          <button
            type="button"
            onClick={() => handleTabChange('admin')}
            style={{
              flex: 1,
              padding: '0.55rem',
              textAlign: 'center',
              borderRadius: '6px',
              fontSize: '0.78rem',
              fontWeight: 700,
              cursor: 'pointer',
              border: activeTab === 'admin' ? '2px solid var(--admin-gold)' : '1px solid rgba(193, 155, 98, 0.25)',
              background: activeTab === 'admin' ? 'rgba(193, 155, 98, 0.2)' : 'rgba(193, 155, 98, 0.05)',
              color: activeTab === 'admin' ? 'var(--admin-gold)' : 'var(--admin-muted)',
              transition: 'all 0.2s ease',
            }}
          >
            🔑 Admin Portal
          </button>
        </div>

        {error && (
          <p
            className="admin-error"
            style={{
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#f87171',
              padding: '0.65rem 0.85rem',
              borderRadius: '6px',
              fontSize: '0.8rem',
              marginBottom: '1rem',
              lineHeight: 1.4,
            }}
          >
            {error}
          </p>
        )}

        <div style={{ textAlign: 'left', marginBottom: '0.75rem' }}>
          <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--admin-muted)', display: 'block', marginBottom: '0.3rem' }}>
            Username or Email
          </label>
          <input
            type="text"
            className="admin-input"
            placeholder={activeTab === 'hr' ? 'hr@theconnplex.com or hr' : 'admin'}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            autoComplete="username"
            style={{ width: '100%' }}
          />
        </div>

        <div style={{ textAlign: 'left', marginBottom: '1rem' }}>
          <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--admin-muted)', display: 'block', marginBottom: '0.3rem' }}>
            Password
          </label>
          <div style={{ position: 'relative' }}>
            <input
              type={showPassword ? 'text' : 'password'}
              className="admin-input"
              placeholder={activeTab === 'hr' ? 'Password (connplex-hr)' : 'Password (connplex-admin)'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              style={{ width: '100%', paddingRight: '2.5rem' }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: 'absolute',
                right: '0.75rem',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'transparent',
                border: 'none',
                color: 'var(--admin-muted)',
                cursor: 'pointer',
                fontSize: '0.85rem',
                padding: '0.2rem',
              }}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              <i className={`fa-solid ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`} />
            </button>
          </div>
          <span style={{ display: 'block', fontSize: '0.72rem', color: 'var(--admin-muted)', marginTop: '0.35rem' }}>
            {activeTab === 'hr'
              ? '🔑 Default HR password: connplex-hr (or use your admin password)'
              : '🔑 Default Admin password: connplex-admin'}
          </span>
        </div>

        <button
          type="submit"
          className="admin-btn admin-btn-primary"
          style={{ width: '100%', justifyContent: 'center', padding: '0.7rem' }}
          disabled={loading}
        >
          {loading ? 'Signing in…' : activeTab === 'hr' ? 'Sign In as HR' : 'Sign In as Admin'}
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
