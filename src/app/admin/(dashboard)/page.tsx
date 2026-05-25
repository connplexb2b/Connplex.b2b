'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import type { MediaEntry } from '@/lib/media-utils';
import { formatDate } from '@/lib/media-utils';

export default function AdminMediaListPage() {
  const [entries, setEntries] = useState<MediaEntry[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const res = await fetch('/api/admin/media');
    if (res.ok) setEntries(await res.json());
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return entries;
    return entries.filter(
      (e) =>
        e.title.toLowerCase().includes(q) ||
        e.parent.toLowerCase().includes(q) ||
        e.type.toLowerCase().includes(q)
    );
  }, [entries, search]);

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}" and all its files?`)) return;
    const res = await fetch(`/api/admin/media/${id}`, { method: 'DELETE' });
    if (res.ok) load();
  };

  return (
    <>
      <div className="admin-page-header">
        <h1>Media Library</h1>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <input
            type="search"
            className="admin-search"
            placeholder="Search by title…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Link href="/admin/add" className="admin-btn admin-btn-primary">
            + Add Media
          </Link>
        </div>
      </div>

      <div className="admin-card admin-table-wrap">
        {loading ? (
          <p className="admin-empty">Loading…</p>
        ) : filtered.length === 0 ? (
          <p className="admin-empty">
            No entries yet.{' '}
            <Link href="/admin/add" style={{ color: 'var(--admin-gold)' }}>
              Add your first PDF or audio entry
            </Link>
          </p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>S.No.</th>
                <th>Title</th>
                <th>Type</th>
                <th>Parent</th>
                <th>Files</th>
                <th>Updated At</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((entry, index) => (
                <tr key={entry.id}>
                  <td>{index + 1}</td>
                  <td>{entry.title}</td>
                  <td>
                    <span
                      className={`admin-badge ${
                        entry.type === 'pdf' ? 'admin-badge-pdf' : 'admin-badge-audio'
                      }`}
                    >
                      {entry.type === 'pdf' ? 'PDF' : 'Audio'}
                    </span>
                  </td>
                  <td>{entry.parent || '—'}</td>
                  <td>{entry.files.length}</td>
                  <td>{formatDate(entry.updatedAt)}</td>
                  <td>
                    <div className="admin-actions">
                      <Link
                        href={`/admin/edit/${entry.id}`}
                        className="admin-icon-btn"
                        aria-label={`Edit ${entry.title}`}
                      >
                        <i className="fa-solid fa-pen" />
                      </Link>
                      <button
                        type="button"
                        className="admin-icon-btn danger"
                        aria-label={`Delete ${entry.title}`}
                        onClick={() => handleDelete(entry.id, entry.title)}
                      >
                        <i className="fa-solid fa-trash" />
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
