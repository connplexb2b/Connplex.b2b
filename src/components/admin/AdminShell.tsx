'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import './AdminShell.css';

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [role, setRole] = useState<'admin' | 'hr'>('admin');
  const [userName, setUserName] = useState('ADMIN');
  const [userEmail, setUserEmail] = useState('connplexadmin@yopmail.com');

  useEffect(() => {
    // Check role from cookie or auth API
    const match = document.cookie.match(/(?:^|;\s*)admin_role=([^;]*)/);
    const cookieRole = match ? decodeURIComponent(match[1]) : null;

    if (cookieRole === 'hr') {
      setRole('hr');
      setUserName('HR MANAGER');
      setUserEmail('hr@theconnplex.com');
    } else {
      // Validate via auth endpoint
      fetch('/api/admin/auth')
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data?.role === 'hr') {
            setRole('hr');
            setUserName('HR MANAGER');
            setUserEmail('hr@theconnplex.com');
          } else {
            setRole('admin');
            setUserName('ADMIN');
            setUserEmail('connplexadmin@yopmail.com');
          }
        })
        .catch(() => {});
    }
  }, []);

  const handleLogout = async () => {
    await fetch('/api/admin/auth', { method: 'DELETE' });
    router.push('/admin/login');
    router.refresh();
  };

  const navLink = (href: string, label: string, icon: string) => {
    const active = pathname === href || (href !== '/admin' && pathname?.startsWith(href));
    return (
      <Link href={href} className={active ? 'active' : ''}>
        <i className={`fa-solid ${icon}`} aria-hidden="true" />
        {label}
      </Link>
    );
  };

  return (
    <div className="admin-root">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-logo">
          <Image src="/logo.png" alt="Connplex Cinemas" width={140} height={36} priority />
        </div>
        <nav className="admin-nav">
          {role === 'hr' ? (
            <>
              <div
                style={{
                  padding: '0.4rem 1.5rem 0.2rem',
                  fontSize: '0.65rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  color: 'rgba(255,255,255,0.3)',
                }}
              >
                Human Resources
              </div>
              {navLink('/admin/careers', 'Career Applications', 'fa-briefcase')}
              {navLink('/admin/submissions?collection=careerapplications', 'Submissions Table', 'fa-inbox')}
            </>
          ) : (
            <>
              <div
                style={{
                  padding: '0.4rem 1.5rem 0.2rem',
                  fontSize: '0.65rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  color: 'rgba(255,255,255,0.3)',
                }}
              >
                Recruitment
              </div>
              {navLink('/admin/careers', 'Career Applications', 'fa-briefcase')}

              <div
                style={{
                  padding: '0.6rem 1.5rem 0.2rem',
                  fontSize: '0.65rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  color: 'rgba(255,255,255,0.3)',
                  marginTop: '0.25rem',
                }}
              >
                Content
              </div>
              {navLink('/admin/stats', 'Website Stats', 'fa-chart-bar')}
              {navLink('/admin/news', 'News & Promotions', 'fa-newspaper')}
              {navLink('/admin/investors', 'Investors Section', 'fa-building-columns')}

              <div
                style={{
                  padding: '0.6rem 1.5rem 0.2rem',
                  fontSize: '0.65rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  color: 'rgba(255,255,255,0.3)',
                  marginTop: '0.25rem',
                }}
              >
                Data & SEO
              </div>
              {navLink('/admin/submissions', 'Form Submissions', 'fa-inbox')}
              {navLink('/admin/analytics', 'Analytics', 'fa-chart-line')}
              {navLink('/admin/seo', 'SEO Manager', 'fa-magnifying-glass')}
            </>
          )}
        </nav>
      </aside>

      <div className="admin-main">
        <header className="admin-topbar">
          <div className="admin-topbar-user">
            <div
              className="admin-avatar"
              style={{
                background: role === 'hr' ? '#10b981' : 'var(--admin-gold)',
                color: role === 'hr' ? '#fff' : '#000',
              }}
            >
              {role === 'hr' ? 'HR' : 'A'}
            </div>
            <div>
              <strong style={{ display: 'block', fontSize: '0.8rem' }}>{userName}</strong>
              <span style={{ color: 'var(--admin-muted)', fontSize: '0.75rem' }}>{userEmail}</span>
            </div>
          </div>
          <button type="button" className="admin-btn admin-btn-outline" onClick={handleLogout}>
            Logout
          </button>
        </header>
        <div className="admin-content">{children}</div>
      </div>
    </div>
  );
}
