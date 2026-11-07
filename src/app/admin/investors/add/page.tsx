import InvestorForm from '@/components/admin/InvestorForm';
import Link from 'next/link';

export default function AddInvestorPage() {
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
            ➕ Add Section & Upload Documents
          </h1>
          <p style={{ color: 'var(--admin-muted)', fontSize: '0.9rem', margin: 0 }}>
            Upload investor relations documents directly to any section on the website
          </p>
        </div>
        <Link href="/admin/investors" className="admin-btn admin-btn-outline" style={{ fontWeight: '600' }}>
          ← Back to Investors
        </Link>
      </div>

      <InvestorForm mode="create" showHeader={false} />
    </>
  );
}
