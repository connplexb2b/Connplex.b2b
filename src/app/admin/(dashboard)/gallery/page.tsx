'use client';

import { useEffect, useState, useRef } from 'react';

interface GalleryItem {
  id: string;
  title: string;
  caption: string;
  category: string;
  imagePath: string;
  isActive: boolean;
  createdAt: string;
}

export default function GalleryAdminPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', caption: '', category: 'General' });
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>('');
  const [error, setError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const load = async () => {
    setLoading(true);
    const res = await fetch('/api/admin/gallery');
    if (res.ok) setItems(await res.json());
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleFile = (f: File) => { setFile(f); setPreview(URL.createObjectURL(f)); };

  const handleUpload = async () => {
    if (!file) { setError('Please select an image'); return; }
    if (!form.title.trim()) { setError('Title is required'); return; }
    setUploading(true); setError('');
    const fd = new FormData();
    fd.append('image', file);
    fd.append('title', form.title);
    fd.append('caption', form.caption);
    fd.append('category', form.category);
    const res = await fetch('/api/admin/gallery', { method: 'POST', body: fd });
    setUploading(false);
    if (res.ok) { setShowForm(false); setForm({ title: '', caption: '', category: 'General' }); setFile(null); setPreview(''); load(); }
    else { const d = await res.json(); setError(d.error || 'Upload failed'); }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"?`)) return;
    const res = await fetch(`/api/admin/gallery/${id}`, { method: 'DELETE' });
    if (res.ok) load();
  };

  const handleToggle = async (item: GalleryItem) => {
    await fetch(`/api/admin/gallery/${item.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ isActive: !item.isActive }) });
    load();
  };

  return (
    <>
      <div className="admin-page-header">
        <h1>Gallery Manager</h1>
        <button className="admin-btn admin-btn-primary" onClick={() => setShowForm(true)}>+ Upload Image</button>
      </div>

      {showForm && (
        <div className="admin-card" style={{ marginBottom: '1.5rem' }}>
          <h2 style={{ marginTop: 0, fontSize: '1.1rem' }}>Upload New Image</h2>
          {error && <p style={{ color: '#dc2626', fontSize: '0.88rem' }}>{error}</p>}
          <div
            className="admin-upload-zone"
            onClick={() => fileRef.current?.click()}
            onDragOver={e => { e.preventDefault(); e.currentTarget.classList.add('dragover'); }}
            onDragLeave={e => e.currentTarget.classList.remove('dragover')}
            onDrop={e => { e.preventDefault(); e.currentTarget.classList.remove('dragover'); if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]); }}
          >
            {preview ? (
              <img src={preview} alt="preview" style={{ height: '120px', borderRadius: '6px', objectFit: 'cover' }} />
            ) : (
              <div className="upload-inner">
                <span className="upload-emoji">🖼️</span>
                <span className="upload-title">Click or drag image here</span>
                <span className="upload-subtitle">JPG, PNG, WEBP — max 10MB</span>
              </div>
            )}
            <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={e => { if (e.target.files?.[0]) handleFile(e.target.files[0]); }} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
            <div className="admin-form-group"><label>Title <span style={{ color: '#dc2626' }}>*</span></label><input className="admin-input" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="e.g. Luxuriance Hall" /></div>
            <div className="admin-form-group"><label>Caption</label><input className="admin-input" value={form.caption} onChange={e => setForm({ ...form, caption: e.target.value })} placeholder="Optional caption" /></div>
            <div className="admin-form-group"><label>Category</label><input className="admin-input" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} placeholder="General" /></div>
          </div>
          <div className="admin-form-footer">
            <button className="admin-btn admin-btn-outline" onClick={() => { setShowForm(false); setError(''); setFile(null); setPreview(''); }}>Cancel</button>
            <button className="admin-btn admin-btn-primary" onClick={handleUpload} disabled={uploading}>{uploading ? 'Uploading...' : 'Upload Image'}</button>
          </div>
        </div>
      )}

      {loading ? <p className="admin-empty">Loading...</p> : items.length === 0 ? (
        <div className="admin-card"><p className="admin-empty">No gallery images yet.</p></div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
          {items.map(item => (
            <div key={item.id} className="admin-card" style={{ padding: 0, overflow: 'hidden', opacity: item.isActive ? 1 : 0.5 }}>
              <div style={{ position: 'relative', height: '140px', background: '#111' }}>
                <img src={item.imagePath} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { (e.target as HTMLImageElement).src = '/logo.png'; }} />
                <div style={{ position: 'absolute', top: '0.4rem', right: '0.4rem', display: 'flex', gap: '0.3rem' }}>
                  <button onClick={() => handleToggle(item)} style={{ width: '26px', height: '26px', borderRadius: '50%', border: 'none', background: 'rgba(0,0,0,0.6)', cursor: 'pointer', fontSize: '0.7rem', color: '#fff' }}>
                    {item.isActive ? '✓' : '✗'}
                  </button>
                  <button onClick={() => handleDelete(item.id, item.title)} style={{ width: '26px', height: '26px', borderRadius: '50%', border: 'none', background: 'rgba(220,38,38,0.8)', cursor: 'pointer', fontSize: '0.7rem', color: '#fff' }}>✕</button>
                </div>
              </div>
              <div style={{ padding: '0.75rem' }}>
                <p style={{ margin: 0, fontWeight: 600, fontSize: '0.85rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.title}</p>
                <p style={{ margin: '0.2rem 0 0', fontSize: '0.72rem', color: 'var(--admin-muted)' }}>{item.category}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
