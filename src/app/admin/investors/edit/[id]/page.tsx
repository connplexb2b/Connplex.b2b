'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import type { Investor } from '@/lib/media-utils';
import InvestorForm from '@/components/admin/InvestorForm';

export default function EditInvestorPage() {
  const params = useParams();
  const id = params?.id as string;
  const [investor, setInvestor] = useState<Investor | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/admin/investors/${id}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        setInvestor(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load investor section:', err);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="admin-card" style={{ padding: '3rem', textAlign: 'center', color: 'var(--admin-muted)' }}>
        ⏳ Loading investor section details…
      </div>
    );
  }

  if (!investor) {
    return (
      <div className="admin-card" style={{ padding: '3rem', textAlign: 'center' }}>
        <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>⚠️</div>
        <h2 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '0.5rem' }}>
          Investor Section Not Found
        </h2>
        <p style={{ color: 'var(--admin-muted)', marginBottom: '1.5rem' }}>
          The requested section could not be found or has been removed.
        </p>
        <Link href="/admin/investors" className="admin-btn admin-btn-primary" style={{ background: 'var(--admin-gold)', color: '#000' }}>
          ← Back to Investors Management
        </Link>
      </div>
    );
  }

  return (
    <>
      <div
        style={{
          marginBottom: '1.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div>
          <h1 style={{ fontSize: '1.65rem', fontWeight: '700', margin: '0 0 0.25rem 0' }}>
            ✏️ Manage: {investor.title}
          </h1>
          <p style={{ color: 'var(--admin-muted)', fontSize: '0.9rem', margin: 0 }}>
            {investor.parent ? `Category: ${investor.parent} • ` : ''}
            {investor.files?.length || 0} live documents
          </p>
        </div>
        <Link href="/admin/investors" className="admin-btn admin-btn-outline" style={{ fontWeight: '600' }}>
          ← Back to List
        </Link>
      </div>

      <InvestorForm mode="edit" initial={investor} showHeader={false} />
    </>
  );
}
