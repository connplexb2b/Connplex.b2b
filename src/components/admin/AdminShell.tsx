'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import './AdminShell.css';

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await fetch('/api/admin/auth', { method: 'DELETE' });
    router.push('/admin/login');
    router.refresh();
  };

  const navLink = (href: string, label: string, icon: string) => {
    const active = pathname === href || (href !== '/admin' && pathname.startsWith(href));
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
          {navLink('/admin', 'Media Library', 'fa-folder-open')}
          {navLink('/admin/investors', 'Investors', 'fa-building')}
          <span className="disabled">
            <i className="fa-solid fa-chart-line" aria-hidden="true" />
            Dashboard
          </span>
          <span className="disabled">
            <i className="fa-solid fa-circle-question" aria-hidden="true" />
            FAQ&apos;s
          </span>
          <span className="disabled">
            <i className="fa-solid fa-images" aria-hidden="true" />
            Gallery
          </span>
        </nav>
      </aside>

      <div className="admin-main">
        <header className="admin-topbar">
          <div className="admin-topbar-user">
            <div className="admin-avatar">A</div>
            <div>
              <strong style={{ display: 'block', fontSize: '0.8rem' }}>ADMIN</strong>
              <span style={{ color: 'var(--admin-muted)', fontSize: '0.75rem' }}>
                connplexadmin@yopmail.com
              </span>
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
