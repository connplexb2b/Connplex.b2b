'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import type { Investor } from '@/lib/media-utils';
import { formatDate } from '@/lib/media-utils';

export default function InvestorsListPage() {
  const [investors, setInvestors] = useState<Investor[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const res = await fetch('/api/admin/investors');
    if (res.ok) setInvestors(await res.json());
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return investors;
    return investors.filter(
      (e) =>
        e.title.toLowerCase().includes(q) ||
        e.parent.toLowerCase().includes(q) ||
        e.type.toLowerCase().includes(q)
    );
  }, [investors, search]);

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}" and all its files?`)) return;
    const res = await fetch(`/api/admin/investors/${id}`, { method: 'DELETE' });
    if (res.ok) load();
  };

  return (
    <>
      <div
        style={{
          marginBottom: '2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: '1.5rem',
        }}
      >
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: '700', margin: '0 0 0.5rem 0' }}>
            🏢 Investors Management
          </h1>
          <p style={{ color: 'var(--admin-muted)', fontSize: '0.95rem', margin: '0' }}>
            Manage investor profiles and their documents
          </p>
        </div>
        <Link
          href="/admin/investors/add"
          className="admin-btn admin-btn-primary"
          style={{
            background: 'var(--admin-gold)',
            color: '#000',
            fontSize: '0.9rem',
            fontWeight: '600',
            padding: '0.65rem 1.5rem',
          }}
        >
          ➕ Add Investor
        </Link>
      </div>

      <div
        style={{
          marginBottom: '1.5rem',
          display: 'flex',
          gap: '0.75rem',
          alignItems: 'center',
        }}
      >
        <input
          type="search"
          className="admin-search"
          placeholder="🔍 Search by investor name, category, or type…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            flex: '1',
            minWidth: '250px',
            padding: '0.6rem 1rem',
            borderRadius: '8px',
          }}
        />
      </div>

      <div className="admin-card admin-table-wrap">
        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--admin-muted)' }}>
            ⏳ Loading investors…
          </div>
        ) : filtered.length === 0 ? (
          <div
            style={{
              padding: '3rem',
              textAlign: 'center',
              color: 'var(--admin-muted)',
            }}
          >
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>📭</div>
            <p style={{ margin: '0.5rem 0', fontSize: '1.05rem', fontWeight: '600' }}>
              No investors found
            </p>
            <p style={{ margin: '0.5rem 0 1.5rem 0', fontSize: '0.95rem' }}>
              {search
                ? 'Try a different search term'
                : 'Create your first investor to get started'}
            </p>
          </div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th style={{ width: '5%' }}>S.No.</th>
                <th style={{ width: '25%' }}>Investor Name</th>
                <th style={{ width: '12%' }}>Type</th>
                <th style={{ width: '20%' }}>Category</th>
                <th style={{ width: '10%', textAlign: 'center' }}>Files</th>
                <th style={{ width: '18%' }}>Updated</th>
                <th style={{ width: '10%', textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((investor, index) => (
                <tr key={investor.id} style={{ borderBottom: '1px solid var(--admin-border)' }}>
                  <td style={{ fontWeight: '600', color: 'var(--admin-gold)' }}>
                    {index + 1}
                  </td>
                  <td style={{ fontWeight: '500' }}>{investor.title}</td>
                  <td>
                    <span
                      style={{
                        display: 'inline-block',
                        padding: '0.35rem 0.75rem',
                        borderRadius: '20px',
                        fontSize: '0.8rem',
                        fontWeight: '600',
                        background:
                          investor.type === 'pdf' ? '#fef3c7' : '#dbeafe',
                        color: investor.type === 'pdf' ? '#92400e' : '#1e40af',
                      }}
                    >
                      {investor.type === 'pdf' ? '📄 PDF' : '🎵 Audio'}
                    </span>
                  </td>
                  <td style={{ color: 'var(--admin-text)' }}>
                    {investor.parent ? (
                      <span
                        style={{
                          display: 'inline-block',
                          padding: '0.25rem 0.6rem',
                          borderRadius: '4px',
                          background: '#f0f9ff',
                          fontSize: '0.85rem',
                        }}
                      >
                        {investor.parent}
                      </span>
                    ) : (
                      <span style={{ color: 'var(--admin-muted)' }}>—</span>
                    )}
                  </td>
                  <td style={{ textAlign: 'center', fontWeight: '600' }}>
                    <span
                      style={{
                        display: 'inline-block',
                        minWidth: '28px',
                        padding: '0.25rem 0.6rem',
                        borderRadius: '12px',
                        background: investor.files.length > 0 ? '#f0fdf4' : '#f3f4f6',
                        color: investor.files.length > 0 ? '#166534' : 'var(--admin-muted)',
                      }}
                    >
                      {investor.files.length}
                    </span>
                  </td>
                  <td style={{ fontSize: '0.9rem', color: 'var(--admin-muted)' }}>
                    {formatDate(investor.updatedAt)}
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                      <Link
                        href={`/admin/investors/edit/${investor.id}`}
                        title="Edit investor"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: '32px',
                          height: '32px',
                          borderRadius: '6px',
                          border: '1px solid var(--admin-border)',
                          background: '#fff',
                          color: 'var(--admin-gold)',
                          cursor: 'pointer',
                          fontSize: '0.9rem',
                          transition: 'all 0.2s',
                        }}
                      >
                        ✏️
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleDelete(investor.id, investor.title)}
                        title="Delete investor"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: '32px',
                          height: '32px',
                          borderRadius: '6px',
                          border: '1px solid #fecaca',
                          background: '#fff',
                          color: '#dc2626',
                          cursor: 'pointer',
                          fontSize: '0.9rem',
                          transition: 'all 0.2s',
                        }}
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
