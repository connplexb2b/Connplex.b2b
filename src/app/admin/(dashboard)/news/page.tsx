'use client';

import { useEffect, useState, useRef } from 'react';
import RichTextEditor from '@/components/admin/RichTextEditor';

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
  buttonText?: string;
}

export default function NewsAdminPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<Partial<Article> | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const load = async () => {
    setLoading(true);
    const res = await fetch('/api/admin/news?all=true');
    if (res.ok) setArticles(await res.json());
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const openAdd = () => setModal({ 
    slug: '', 
    title: '', 
    date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase(), 
    shortDesc: '', 
    imagePath: '', 
    body: '', 
    isActive: true, 
    order: articles.length, 
    buttonText: "LET'S CONNECT" 
  });
  
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

  const handleTitleChange = (val: string) => {
    if (!modal) return;
    const slug = modal._id ? (modal.slug || '') : val.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    setModal({ ...modal, title: val, slug });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !modal) return;

    // Limit file size to 2MB to keep MongoDB BSON size small
    if (file.size > 2 * 1024 * 1024) {
      setError('Image must be less than 2MB');
      return;
    }

    try {
      setError('');
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setModal({ ...modal, imagePath: reader.result });
        }
      };
      reader.onerror = () => {
        setError('Failed to read image file');
      };
      reader.readAsDataURL(file);
    } catch (err: any) {
      setError(err.message || 'Upload error');
    }
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
          <div style={{ background: '#fff', borderRadius: '12px', padding: '2rem', width: '100%', maxWidth: '850px', maxHeight: '90vh', overflowY: 'auto' }}>
            <h2 style={{ marginTop: 0, fontSize: '1.4rem', fontWeight: 600, color: '#18181b', marginBottom: '1.5rem' }}>
              {modal._id ? 'Edit Blog' : 'Add Blog'}
            </h2>
            
            {error && <p style={{ color: '#dc2626', fontSize: '0.88rem', marginBottom: '1rem' }}>{error}</p>}
            
            {/* Image Upload Zone */}
            <div className="admin-form-group">
              <label style={{ fontSize: '0.88rem', fontWeight: 600, color: '#18181b', marginBottom: '0.5rem', display: 'block' }}>
                Image (size 1100x540 px)
              </label>
              <div 
                className="upload-preview-container"
                onClick={() => fileInputRef.current?.click()}
              >
                {modal.imagePath ? (
                  <>
                    <img src={modal.imagePath} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <div className="upload-overlay" onClick={(e) => { e.stopPropagation(); setModal({ ...modal, imagePath: '' }); }}>
                      Remove
                    </div>
                  </>
                ) : (
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    background: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#a1a1aa',
                    fontSize: '1.25rem',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                  }}>
                    +
                  </div>
                )}
              </div>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleImageUpload} 
                accept="image/*" 
                style={{ display: 'none' }} 
              />
            </div>

            {/* Title & Sequence */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.25rem' }}>
              <div className="admin-form-group" style={{ marginBottom: 0 }}>
                <label style={{ fontSize: '0.88rem', fontWeight: 600 }}>Blog Title</label>
                <input 
                  className="admin-input" 
                  style={{ maxWidth: '100%', padding: '0.65rem 0.85rem' }}
                  value={modal.title || ''} 
                  onChange={e => handleTitleChange(e.target.value)} 
                  placeholder="Enter blog title" 
                />
              </div>
              <div className="admin-form-group" style={{ marginBottom: 0 }}>
                <label style={{ fontSize: '0.88rem', fontWeight: 600 }}>Blog Sequence</label>
                <input 
                  className="admin-input" 
                  style={{ maxWidth: '100%', padding: '0.65rem 0.85rem' }}
                  type="number" 
                  value={modal.order ?? 0} 
                  onChange={e => setModal({ ...modal, order: parseInt(e.target.value) || 0 })} 
                  placeholder="Add item Sequence" 
                />
              </div>
            </div>

            {/* Date, Button Text, Active, Slug */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
              <div className="admin-form-group" style={{ marginBottom: 0 }}><label style={{ fontSize: '0.88rem', fontWeight: 600 }}>Date</label>
                <input className="admin-input" style={{ maxWidth: '100%' }} value={modal.date || ''} onChange={e => setModal({ ...modal, date: e.target.value })} placeholder="20 MAY 2024" /></div>
              <div className="admin-form-group" style={{ marginBottom: 0 }}><label style={{ fontSize: '0.88rem', fontWeight: 600 }}>Button Text</label>
                <input className="admin-input" style={{ maxWidth: '100%' }} value={modal.buttonText || ''} onChange={e => setModal({ ...modal, buttonText: e.target.value })} placeholder="LET'S CONNECT" /></div>
              <div className="admin-form-group" style={{ display: 'flex', alignItems: 'flex-end', paddingBottom: '0.65rem', marginBottom: 0 }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', marginBottom: 0, fontSize: '0.88rem', fontWeight: 600 }}>
                  <input type="checkbox" checked={modal.isActive ?? true} onChange={e => setModal({ ...modal, isActive: e.target.checked })} />Active
                </label>
              </div>
            </div>

            <div className="admin-form-group" style={{ marginBottom: '1.25rem' }}>
              <label style={{ fontSize: '0.88rem', fontWeight: 600 }}>Slug <span style={{ color: '#dc2626' }}>*</span></label>
              <input className="admin-input" style={{ maxWidth: '100%' }} value={modal.slug || ''} onChange={e => setModal({ ...modal, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })} placeholder="slug-path" />
            </div>

            <div className="admin-form-group" style={{ marginBottom: '1.25rem' }}>
              <label style={{ fontSize: '0.88rem', fontWeight: 600 }}>Short Description</label>
              <input className="admin-input" style={{ maxWidth: '100%' }} value={modal.shortDesc || ''} onChange={e => setModal({ ...modal, shortDesc: e.target.value })} placeholder="Brief summary shown on news card" />
            </div>

            {/* Description (Rich Text Editor) */}
            <div className="admin-form-group" style={{ marginBottom: '1.5rem' }}>
              <label style={{ fontSize: '0.88rem', fontWeight: 600, marginBottom: '0.5rem', display: 'block' }}>Blog Description</label>
              <RichTextEditor 
                value={modal.body || ''} 
                onChange={(html) => setModal({ ...modal, body: html })}
                placeholder="Enter description here..."
              />
            </div>

            <div className="admin-form-footer" style={{ borderTop: '1px solid #d1d1d6', paddingTop: '1.25rem', marginTop: '1.5rem' }}>
              <button className="admin-btn admin-btn-outline" onClick={closeModal}>Cancel</button>
              <button className="admin-btn admin-btn-primary" onClick={handleSave} disabled={saving} style={{ background: '#18181b', color: '#fff' }}>
                {saving ? 'Saving...' : 'Save Article'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
