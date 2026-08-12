'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import '../admin.css';

function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
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
        setError('Invalid credentials. Please try again.');
        return;
      }

      // Successfully authenticated, navigate to dashboard
      const from = searchParams?.get('from') || '/admin/news';
      
      // Refresh session first, then navigate
      router.refresh();
      
      // Small delay to ensure cookie is set before redirect
      setTimeout(() => {
        router.push(from);
      }, 100);
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
        />
        <h1>Admin Login</h1>
        <p>Upload and manage PDF &amp; audio files</p>
        {error && <p className="admin-error">{error}</p>}
        <input
          type="text"
          className="admin-input"
          placeholder="Admin username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          autoComplete="username"
          style={{ marginBottom: '0.75rem' }}
        />
        <input
          type="password"
          className="admin-input"
          placeholder="Admin password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
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
