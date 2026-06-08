'use client';

import { useEffect, useState } from 'react';

interface SEOEntry {
  pageSlug: string;
  pageLabel: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string;
  ogImage: string;
}

export default function SEOAdminPage() {
  const [pages, setPages] = useState<SEOEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<SEOEntry | null>(null);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/admin/seo');
      if (!res.ok) throw new Error('Failed to load SEO pages');
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setPages(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load SEO pages');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleSave = async () => {
    if (!selected) return;
    setSaving(true); setSuccess(false);
    const res = await fetch('/api/admin/seo', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(selected) });
    setSaving(false);
    if (res.ok) { setSuccess(true); load(); setTimeout(() => setSuccess(false), 3000); }
  };

  if (loading) return <p className="admin-empty">Loading SEO data…</p>;
  if (error) return <p className="admin-empty" style={{ color: '#dc2626' }}>{error}</p>;

  return (
    <>
      <div className="admin-page-header">
        <h1>SEO Manager</h1>
        <p style={{ margin: 0, color: 'var(--admin-muted)', fontSize: '0.88rem' }}>Edit meta tags for each page</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '1.5rem' }}>
        <div className="admin-card" style={{ padding: '0.5rem', height: 'fit-content' }}>
          {pages.map(p => (
            <button key={p.pageSlug} onClick={() => { setSelected({ ...p }); setSuccess(false); }}
              style={{ width: '100%', textAlign: 'left', padding: '0.65rem 1rem', borderRadius: '6px', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.85rem', fontWeight: 500,
                background: selected?.pageSlug === p.pageSlug ? 'var(--admin-gold)' : 'transparent',
                color: selected?.pageSlug === p.pageSlug ? '#000' : 'var(--admin-text)', marginBottom: '0.15rem' }}>
              <span style={{ fontSize: '0.7rem', color: selected?.pageSlug === p.pageSlug ? '#333' : 'var(--admin-muted)', display: 'block' }}>{p.pageSlug}</span>
              {p.pageLabel}
            </button>
          ))}
        </div>

        {selected ? (
          <div className="admin-card">
            <h2 style={{ marginTop: 0, fontSize: '1.1rem' }}>{selected.pageLabel} <span style={{ color: 'var(--admin-muted)', fontWeight: 400, fontSize: '0.85rem' }}>{selected.pageSlug}</span></h2>
            <div className="admin-form-group">
              <label>Meta Title <span style={{ color: 'var(--admin-muted)', fontWeight: 400 }}>({(selected.metaTitle || '').length}/60 chars)</span></label>
              <input className="admin-input" style={{ maxWidth: '100%' }} value={selected.metaTitle} onChange={e => setSelected({ ...selected, metaTitle: e.target.value })} placeholder="Page title for search engines" />
            </div>
            <div className="admin-form-group">
              <label>Meta Description <span style={{ color: 'var(--admin-muted)', fontWeight: 400 }}>({(selected.metaDescription || '').length}/160 chars)</span></label>
              <textarea className="admin-input" style={{ maxWidth: '100%', height: '80px', resize: 'vertical' }} value={selected.metaDescription} onChange={e => setSelected({ ...selected, metaDescription: e.target.value })} placeholder="Brief description for search results" />
            </div>
            <div className="admin-form-group">
              <label>Keywords <span style={{ color: 'var(--admin-muted)', fontWeight: 400 }}>(comma separated)</span></label>
              <input className="admin-input" style={{ maxWidth: '100%' }} value={selected.keywords} onChange={e => setSelected({ ...selected, keywords: e.target.value })} placeholder="cinema, franchise, luxury, India" />
            </div>
            <div className="admin-form-group">
              <label>OG Image URL</label>
              <input className="admin-input" style={{ maxWidth: '100%' }} value={selected.ogImage} onChange={e => setSelected({ ...selected, ogImage: e.target.value })} placeholder="/images/og-home.jpg" />
              {selected.ogImage && <img src={selected.ogImage} alt="OG preview" style={{ marginTop: '0.5rem', height: '80px', borderRadius: '4px', border: '1px solid var(--admin-border)' }} onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />}
            </div>
            <div className="admin-form-footer">
              {success && <span style={{ color: '#16a34a', fontSize: '0.88rem' }}>✓ Saved successfully!</span>}
              <button className="admin-btn admin-btn-primary" onClick={handleSave} disabled={saving}>{saving ? 'Saving…' : 'Save SEO Data'}</button>
            </div>
          </div>
        ) : (
          <div className="admin-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <p className="admin-empty">← Select a page to edit its SEO settings</p>
          </div>
        )}
      </div>
    </>
  );
}
