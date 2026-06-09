'use client';

import { useEffect, useState } from 'react';

interface Article {
  _id: string;
  slug: string;
  title: string;
  date: string;
  shortDesc: string;
  imagePath: string;
  body: string;
  isActive: boolean;
  order: number;
}

export default function NewsAdminPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<Partial<Article> | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    const res = await fetch('/api/admin/news');
    if (res.ok) setArticles(await res.json());
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const openAdd = () => setModal({ slug: '', title: '', date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase(), shortDesc: '', imagePath: '', body: '', isActive: true, order: 0 });
  const openEdit = (a: Article) => setModal({ ...a });
  const closeModal = () => { setModal(null); setError(''); };

  const handleSave = async () => {
    if (!modal) return;
    if (!modal.slug?.trim() || !modal.title?.trim()) { setError('Slug and Title are required'); return; }
    setSaving(true); setError('');
    const isEdit = !!modal._id;
    const url = isEdit ? `/api/admin/news/${modal._id}` : '/api/admin/news';
    const method = isEdit ? 'PUT' : 'POST';
    const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(modal) });
    setSaving(false);
    if (res.ok) { closeModal(); load(); } else { const d = await res.json(); setError(d.error || 'Failed to save'); }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"?`)) return;
    const res = await fetch(`/api/admin/news/${id}`, { method: 'DELETE' });
    if (res.ok) load();
  };

  const handleToggle = async (a: Article) => {
    await fetch(`/api/admin/news/${a._id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ isActive: !a.isActive }) });
    load();
  };

  return (
    <>
      <div className="admin-page-header">
        <h1>News &amp; Promotions Manager</h1>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <span style={{ fontSize: '0.82rem', color: 'var(--admin-muted)' }}>If no articles in DB, news page uses hardcoded fallback</span>
          <button className="admin-btn admin-btn-primary" onClick={openAdd}>+ Add Article</button>
        </div>
      </div>

      <div className="admin-card admin-table-wrap">
        {loading ? <p className="admin-empty">Loading...</p> : articles.length === 0 ? (
          <p className="admin-empty">No articles yet. <button onClick={openAdd} style={{ background: 'none', border: 'none', color: 'var(--admin-gold)', cursor: 'pointer', fontWeight: 600 }}>Add first article</button></p>
        ) : (
          <table className="admin-table">
            <thead><tr><th>#</th><th>Slug</th><th>Title</th><th>Date</th><th>Status</th><th>Action</th></tr></thead>
            <tbody>
              {articles.map((a, i) => (
                <tr key={a._id}>
                  <td>{i + 1}</td>
                  <td><code style={{ fontSize: '0.78rem', background: '#f4f4f5', padding: '0.15rem 0.4rem', borderRadius: '3px' }}>{a.slug}</code></td>
                  <td style={{ maxWidth: '280px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontWeight: 500 }}>{a.title}</td>
                  <td style={{ fontSize: '0.82rem', color: 'var(--admin-muted)' }}>{a.date}</td>
                  <td><button onClick={() => handleToggle(a)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>{a.isActive ? '🟢' : '🔴'}</button></td>
                  <td>
                    <div className="admin-actions">
                      <button className="admin-icon-btn" onClick={() => openEdit(a)}><i className="fa-solid fa-pen" /></button>
                      <button className="admin-icon-btn danger" onClick={() => handleDelete(a._id, a.title)}><i className="fa-solid fa-trash" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {modal !== null && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div style={{ background: '#fff', borderRadius: '12px', padding: '2rem', width: '100%', maxWidth: '700px', maxHeight: '90vh', overflowY: 'auto' }}>
            <h2 style={{ marginTop: 0 }}>{modal._id ? 'Edit Article' : 'Add Article'}</h2>
            {error && <p style={{ color: '#dc2626', fontSize: '0.88rem' }}>{error}</p>}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="admin-form-group"><label>Slug <span style={{ color: '#dc2626' }}>*</span></label>
                <input className="admin-input" value={modal.slug || ''} onChange={e => setModal({ ...modal, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })} placeholder="next-gen-auditorium" /></div>
              <div className="admin-form-group"><label>Date</label>
                <input className="admin-input" value={modal.date || ''} onChange={e => setModal({ ...modal, date: e.target.value })} placeholder="20 MAY 2024" /></div>
            </div>
            <div className="admin-form-group"><label>Title <span style={{ color: '#dc2626' }}>*</span></label>
              <input className="admin-input" style={{ maxWidth: '100%' }} value={modal.title || ''} onChange={e => setModal({ ...modal, title: e.target.value })} placeholder="Article headline" /></div>
            <div className="admin-form-group"><label>Short Description</label>
              <input className="admin-input" style={{ maxWidth: '100%' }} value={modal.shortDesc || ''} onChange={e => setModal({ ...modal, shortDesc: e.target.value })} placeholder="Brief summary shown on news card" /></div>
            <div className="admin-form-group"><label>Image Path</label>
              <input className="admin-input" style={{ maxWidth: '100%' }} value={modal.imagePath || ''} onChange={e => setModal({ ...modal, imagePath: e.target.value })} placeholder="/news/news_1.jpeg" />
              {modal.imagePath && <img src={modal.imagePath} alt="" style={{ marginTop: '0.5rem', height: '70px', borderRadius: '4px', objectFit: 'cover', border: '1px solid var(--admin-border)' }} onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />}
            </div>
            <div className="admin-form-group"><label>Body HTML</label>
              <textarea className="admin-input" style={{ maxWidth: '100%', height: '150px', resize: 'vertical', fontFamily: 'monospace', fontSize: '0.82rem' }} value={modal.body || ''} onChange={e => setModal({ ...modal, body: e.target.value })} placeholder="<p>Article content in HTML...</p>" /></div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="admin-form-group"><label>Order</label><input className="admin-input" type="number" value={modal.order ?? 0} onChange={e => setModal({ ...modal, order: parseInt(e.target.value) })} /></div>
              <div className="admin-form-group" style={{ display: 'flex', alignItems: 'flex-end', paddingBottom: '1.25rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', marginBottom: 0 }}><input type="checkbox" checked={modal.isActive ?? true} onChange={e => setModal({ ...modal, isActive: e.target.checked })} />Active</label>
              </div>
            </div>
            <div className="admin-form-footer">
              <button className="admin-btn admin-btn-outline" onClick={closeModal}>Cancel</button>
              <button className="admin-btn admin-btn-primary" onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : 'Save Article'}</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
