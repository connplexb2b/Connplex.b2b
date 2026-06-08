'use client';

import { useEffect, useState, useCallback } from 'react';

const COLLECTIONS = [
  { key: 'contactmessages', label: 'Contact Messages' },
  { key: 'franchiseinquiries', label: 'Franchise Inquiries' },
  { key: 'careerapplications', label: 'Career Applications' },
  { key: 'bookevents', label: 'Book Events' },
  { key: 'newsletters', label: 'Newsletter Subscribers' },
  { key: 'connflixsubscribers', label: 'Connflix Subscribers' },
  { key: 'connmusicwaitlists', label: 'ConnMusic Waitlist' },
  { key: 'gameflixwaitlists', label: 'Gameflix Waitlist' },
  { key: 'conneventswaitlists', label: 'ConnEvents Waitlist' },
  { key: 'studioinvitations', label: 'Studio Invitations' },
  { key: 'downtowninvitations', label: 'Downtown Invitations' },
  { key: 'purexsubscribers', label: 'PureX Subscribers' },
  { key: 'skyinnreservations', label: 'Sky Inn Reservations' },
  { key: 'vendorregistrations', label: 'Vendor Registrations' },
  { key: 'consultantbookings', label: 'Consultant Bookings' },
  { key: 'preapprovedfranchises', label: 'Pre-Approved Franchise' },
  { key: 'generalinquiries', label: 'General Inquiries' },
  { key: 'feedbacks', label: 'Feedback' },
];

export default function SubmissionsPage() {
  const [collection, setCollection] = useState('contactmessages');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ collection, page: String(page), limit: '15', search });
    const res = await fetch(`/api/admin/form-submissions?${params}`);
    if (res.ok) setData(await res.json());
    setLoading(false);
  }, [collection, page, search]);

  useEffect(() => { setPage(1); }, [collection, search]);
  useEffect(() => { load(); }, [load]);

  const docs = data?.docs || [];
  const allKeys = docs.length > 0 ? Object.keys(docs[0]).filter((k: string) => k !== '__v') : [];

  return (
    <>
      <div className="admin-page-header">
        <h1>Form Submissions</h1>
      </div>

      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
        <select className="admin-search" value={collection} onChange={e => setCollection(e.target.value)} style={{ minWidth: '220px' }}>
          {COLLECTIONS.map(c => <option key={c.key} value={c.key}>{c.label}</option>)}
        </select>
        <input type="search" className="admin-search" placeholder="Search by email or name…" value={search} onChange={e => setSearch(e.target.value)} />
        <span style={{ alignSelf: 'center', color: 'var(--admin-muted)', fontSize: '0.85rem' }}>{data?.total ?? 0} results</span>
      </div>

      <div className="admin-card admin-table-wrap">
        {loading ? <p className="admin-empty">Loading…</p> : docs.length === 0 ? (
          <p className="admin-empty">No submissions found.</p>
        ) : (
          <table className="admin-table">
            <thead><tr>{allKeys.map((k: string) => <th key={k}>{k}</th>)}</tr></thead>
            <tbody>
              {docs.map((doc: any, i: number) => (
                <tr key={doc._id || i}>
                  {allKeys.map((k: string) => (
                    <td key={k} style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {typeof doc[k] === 'object' ? JSON.stringify(doc[k]) : String(doc[k] ?? '—')}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {data && data.pages > 1 && (
        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem', justifyContent: 'flex-end', alignItems: 'center' }}>
          <button className="admin-btn admin-btn-outline" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>← Prev</button>
          <span style={{ fontSize: '0.88rem', color: 'var(--admin-muted)' }}>Page {page} of {data.pages}</span>
          <button className="admin-btn admin-btn-outline" onClick={() => setPage(p => Math.min(data.pages, p + 1))} disabled={page === data.pages}>Next →</button>
        </div>
      )}
    </>
  );
}
