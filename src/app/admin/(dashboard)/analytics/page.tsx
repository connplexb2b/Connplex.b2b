'use client';

import { useEffect, useState } from 'react';

interface CollectionStat {
  key: string;
  label: string;
  icon: string;
  color: string;
  count: number;
}

export default function AnalyticsPage() {
  const [data, setData] = useState<{ collections: CollectionStat[]; total: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/admin/analytics')
      .then(r => {
        if (!r.ok) throw new Error('Failed to load analytics');
        return r.json();
      })
      .then(d => {
        if (d.error) throw new Error(d.error);
        setData(d);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || 'Failed to load analytics');
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="admin-empty">Loading analytics…</p>;
  if (error || !data) return <p className="admin-empty" style={{ color: '#dc2626' }}>{error || 'Error loading data'}</p>;

  return (
    <>
      <div className="admin-page-header">
        <h1>Analytics Dashboard</h1>
        <span style={{ color: 'var(--admin-muted)', fontSize: '0.9rem' }}>
          Total Submissions: <strong style={{ color: 'var(--admin-text)' }}>{data.total}</strong>
        </span>
      </div>

      <div className="admin-card" style={{ marginBottom: '1.5rem', background: 'linear-gradient(135deg, #18181b 0%, #27272a 100%)', border: 'none', color: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <p style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'rgba(255,255,255,0.5)', marginBottom: '0.25rem' }}>All Time Total Leads</p>
          <p style={{ fontSize: '3rem', fontWeight: 700, color: '#c19b62', lineHeight: 1 }}>{data.total.toLocaleString()}</p>
        </div>
        <i className="fa-solid fa-chart-bar" style={{ fontSize: '4rem', color: 'rgba(193,155,98,0.15)' }} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1rem' }}>
        {data.collections.map((col) => (
          <div key={col.key} className="admin-card" style={{ padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: col.color + '18', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <i className={`fa-solid ${col.icon}`} style={{ color: col.color, fontSize: '1.1rem' }} />
            </div>
            <div style={{ minWidth: 0 }}>
              <p style={{ fontSize: '0.75rem', color: 'var(--admin-muted)', marginBottom: '0.2rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{col.label}</p>
              <p style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--admin-text)', lineHeight: 1 }}>{col.count}</p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
