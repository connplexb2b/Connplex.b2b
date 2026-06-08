'use client';

import { useEffect, useState } from 'react';

interface Slide {
  _id: string;
  eyebrow: string;
  title: string;
  tags: string;
  description: string;
  imagePath: string;
  link: string;
  linkText: string;
  order: number;
  isActive: boolean;
}

export default function HeroSlidesPage() {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<Partial<Slide> | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    const res = await fetch('/api/admin/hero-slides?all=true');
    if (res.ok) setSlides(await res.json());
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const openAdd = () => setModal({ eyebrow: '', title: '', tags: '', description: '', imagePath: '/img/LUX.jpeg', link: '/franchise', linkText: 'Know More', order: slides.length, isActive: true });
  const openEdit = (s: Slide) => setModal({ ...s });
  const closeModal = () => { setModal(null); setError(''); };

  const handleSave = async () => {
    if (!modal) return;
    if (!modal.eyebrow?.trim() || !modal.title?.trim() || !modal.imagePath?.trim()) { setError('Eyebrow, Title, and Image Path are required'); return; }
    setSaving(true); setError('');
    const isEdit = !!modal._id;
    const url = isEdit ? `/api/admin/hero-slides/${modal._id}` : '/api/admin/hero-slides';
    const method = isEdit ? 'PUT' : 'POST';
    const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(modal) });
    setSaving(false);
    if (res.ok) { closeModal(); load(); } else { const d = await res.json(); setError(d.error || 'Failed to save'); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this hero slide?')) return;
    const res = await fetch(`/api/admin/hero-slides/${id}`, { method: 'DELETE' });
    if (res.ok) load();
  };

  const handleToggle = async (s: Slide) => {
    await fetch(`/api/admin/hero-slides/${s._id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ isActive: !s.isActive }) });
    load();
  };

  return (
    <>
      <div className="admin-page-header">
        <h1>Hero Slides Manager</h1>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <span style={{ fontSize: '0.82rem', color: 'var(--admin-muted)' }}>If no slides in DB, homepage uses hardcoded fallback</span>
          <button className="admin-btn admin-btn-primary" onClick={openAdd}>+ Add Slide</button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        {loading ? <p className="admin-empty">Loading...</p> : slides.length === 0 ? (
          <div className="admin-card" style={{ gridColumn: '1/-1' }}>
            <p className="admin-empty">No custom slides. Homepage uses hardcoded defaults. <button onClick={openAdd} style={{ background: 'none', border: 'none', color: 'var(--admin-gold)', cursor: 'pointer', fontWeight: 600 }}>Add first slide</button></p>
          </div>
        ) : slides.map(slide => (
          <div key={slide._id} className="admin-card" style={{ padding: 0, overflow: 'hidden', opacity: slide.isActive ? 1 : 0.5 }}>
            <div style={{ position: 'relative', height: '160px', background: '#111', overflow: 'hidden' }}>
              <img src={slide.imagePath} alt={slide.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 60%)' }} />
              <div style={{ position: 'absolute', bottom: '0.75rem', left: '0.75rem', right: '0.75rem' }}>
                <p style={{ margin: 0, fontSize: '0.6rem', color: '#c19b62', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{slide.eyebrow}</p>
                <p style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: '#fff', lineHeight: 1.2 }}>{slide.title}</p>
              </div>
            </div>
            <div style={{ padding: '1rem' }}>
              <p style={{ margin: '0 0 0.5rem', fontSize: '0.78rem', color: 'var(--admin-muted)' }}>{slide.tags}</p>
              <p style={{ margin: '0 0 0.75rem', fontSize: '0.8rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{slide.description}</p>
              <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'space-between', alignItems: 'center' }}>
                <button onClick={() => handleToggle(slide)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1rem' }}>
                  {slide.isActive ? '🟢 Active' : '🔴 Inactive'}
                </button>
                <div className="admin-actions">
                  <button className="admin-icon-btn" onClick={() => openEdit(slide)}><i className="fa-solid fa-pen" /></button>
                  <button className="admin-icon-btn danger" onClick={() => handleDelete(slide._id)}><i className="fa-solid fa-trash" /></button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {modal !== null && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div style={{ background: '#fff', borderRadius: '12px', padding: '2rem', width: '100%', maxWidth: '640px', maxHeight: '90vh', overflowY: 'auto' }}>
            <h2 style={{ marginTop: 0 }}>{modal._id ? 'Edit Slide' : 'Add Slide'}</h2>
            {error && <p style={{ color: '#dc2626', fontSize: '0.88rem' }}>{error}</p>}
            <div className="admin-form-group"><label>Eyebrow Text <span style={{ color: '#dc2626' }}>*</span></label>
              <input className="admin-input" style={{ maxWidth: '100%' }} value={modal.eyebrow || ''} onChange={e => setModal({ ...modal, eyebrow: e.target.value })} placeholder="Luxury Cinema Experience." /></div>
            <div className="admin-form-group"><label>Title <span style={{ color: '#dc2626' }}>*</span></label>
              <input className="admin-input" style={{ maxWidth: '100%' }} value={modal.title || ''} onChange={e => setModal({ ...modal, title: e.target.value })} placeholder="Luxury Cinema Experience" /></div>
            <div className="admin-form-group"><label>Tags / Subtitle</label>
              <input className="admin-input" style={{ maxWidth: '100%' }} value={modal.tags || ''} onChange={e => setModal({ ...modal, tags: e.target.value })} placeholder="Recliners · Gourmet F&B · VIP Service" /></div>
            <div className="admin-form-group"><label>Description</label>
              <textarea className="admin-input" style={{ maxWidth: '100%', height: '100px', resize: 'vertical' }} value={modal.description || ''} onChange={e => setModal({ ...modal, description: e.target.value })} /></div>
            <div className="admin-form-group"><label>Image Path <span style={{ color: '#dc2626' }}>*</span></label>
              <input className="admin-input" style={{ maxWidth: '100%' }} value={modal.imagePath || ''} onChange={e => setModal({ ...modal, imagePath: e.target.value })} placeholder="/img/LUX.jpeg" />
              {modal.imagePath && <img src={modal.imagePath} alt="preview" style={{ marginTop: '0.5rem', height: '80px', borderRadius: '4px', objectFit: 'cover', border: '1px solid var(--admin-border)' }} onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
              <div className="admin-form-group"><label>Button Link</label><input className="admin-input" value={modal.link || ''} onChange={e => setModal({ ...modal, link: e.target.value })} placeholder="/franchise" /></div>
              <div className="admin-form-group"><label>Button Text</label><input className="admin-input" value={modal.linkText || ''} onChange={e => setModal({ ...modal, linkText: e.target.value })} placeholder="Know More" /></div>
              <div className="admin-form-group"><label>Order</label><input className="admin-input" type="number" value={modal.order ?? 0} onChange={e => setModal({ ...modal, order: parseInt(e.target.value) })} /></div>
            </div>
            <div className="admin-form-group"><label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}><input type="checkbox" checked={modal.isActive ?? true} onChange={e => setModal({ ...modal, isActive: e.target.checked })} />Active (show on homepage)</label></div>
            <div className="admin-form-footer">
              <button className="admin-btn admin-btn-outline" onClick={closeModal}>Cancel</button>
              <button className="admin-btn admin-btn-primary" onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : 'Save Slide'}</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
