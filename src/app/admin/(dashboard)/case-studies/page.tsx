'use client';

import { useEffect, useState } from 'react';

interface CaseStudy {
  _id: string;
  num: string;
  tag: string;
  title: string;
  subtitle: string;
  location: string;
  img: string;
  desc: string;
  category: string;
  order: number;
  isActive: boolean;
}

const CATEGORIES = [
  { value: 'smart-cinemas', label: 'Smart Cinemas' },
  { value: 'premium-formats', label: 'Premium Formats' },
  { value: 'drive-in-cinemas', label: 'Drive-In Cinemas' },
  { value: 'experience-initiatives', label: 'Experience Initiatives' },
  { value: 'brand-collaborations', label: 'Brand Collaborations' }
];

export default function CaseStudiesAdminPage() {
  const [studies, setStudies] = useState<CaseStudy[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<Partial<CaseStudy> | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/admin/case-studies?all=true');
      if (!res.ok) throw new Error('Failed to load B2B case studies');
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setStudies(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load case studies');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const openAdd = () => setModal({
    num: String(studies.length + 1).padStart(2, '0'),
    tag: 'SMART CINEMA',
    title: '',
    subtitle: '',
    location: '',
    img: '/img/case-study/case_study_1.png',
    desc: '',
    category: 'smart-cinemas',
    order: studies.length,
    isActive: true
  });

  const openEdit = (s: CaseStudy) => setModal({ ...s });
  const closeModal = () => { setModal(null); setError(''); };

  const handleSave = async () => {
    if (!modal) return;
    if (!modal.num?.trim() || !modal.tag?.trim() || !modal.title?.trim() || !modal.img?.trim() || !modal.category) {
      setError('Number, Tag, Title, Image path, and Category are required');
      return;
    }
    setSaving(true);
    setError('');
    const isEdit = !!modal._id;
    // Don't try to save fallback fake IDs to DB
    const isFallbackId = modal._id?.startsWith('casestudy-fallback-');
    
    const url = (isEdit && !isFallbackId) ? `/api/admin/case-studies/${modal._id}` : '/api/admin/case-studies';
    const method = (isEdit && !isFallbackId) ? 'PUT' : 'POST';
    
    // If saving a fallback item, remove fallback fake ID so it creates a new clean record in MongoDB
    const bodyPayload = { ...modal };
    if (isFallbackId) {
      delete bodyPayload._id;
    }

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyPayload)
      });
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error || 'Failed to save case study');
      }
      closeModal();
      load();
    } catch (err: any) {
      setError(err.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (id.startsWith('casestudy-fallback-')) {
      alert('Cannot delete hardcoded default entries in offline mode.');
      return;
    }
    if (!confirm(`Delete case study "${title.replace(/<br>/g, ' ')}"?`)) return;
    try {
      const res = await fetch(`/api/admin/case-studies/${id}`, { method: 'DELETE' });
      if (res.ok) {
        load();
      } else {
        const d = await res.json();
        alert(d.error || 'Failed to delete');
      }
    } catch {
      alert('Failed to delete');
    }
  };

  const handleToggle = async (s: CaseStudy) => {
    if (s._id.startsWith('casestudy-fallback-')) {
      alert('Cannot toggle hardcoded default entries in offline mode.');
      return;
    }
    try {
      await fetch(`/api/admin/case-studies/${s._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !s.isActive })
      });
      load();
    } catch {
      alert('Failed to toggle status');
    }
  };

  return (
    <>
      <div className="admin-page-header">
        <h1>Case Studies Manager</h1>
        <button className="admin-btn admin-btn-primary" onClick={openAdd}>+ Add Case Study</button>
      </div>

      {error && !modal && <p className="admin-empty" style={{ color: '#dc2626', marginBottom: '1.5rem' }}>{error}</p>}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem', marginBottom: '1.5rem' }}>
        {loading ? <p className="admin-empty">Loading case studies...</p> : studies.length === 0 ? (
          <div className="admin-card" style={{ gridColumn: '1/-1' }}>
            <p className="admin-empty">No case studies yet. <button onClick={openAdd} style={{ background: 'none', border: 'none', color: 'var(--admin-gold)', cursor: 'pointer', fontWeight: 600 }}>Create your first case study</button></p>
          </div>
        ) : studies.map(study => (
          <div key={study._id} className="admin-card" style={{ padding: 0, overflow: 'hidden', opacity: study.isActive ? 1 : 0.55, display: 'flex', flexDirection: 'column', justifyContent: 'between' }}>
            <div style={{ position: 'relative', height: '160px', background: '#111' }}>
              <img src={study.img} alt={study.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { (e.target as HTMLImageElement).src = '/logo.png'; }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.88) 0%, transparent 60%)' }} />
              <span style={{ position: 'absolute', top: '0.75rem', left: '0.75rem', background: 'var(--admin-gold)', color: '#000', fontSize: '0.8rem', fontWeight: 700, padding: '0.2rem 0.5rem', borderRadius: '4px' }}>{study.num}</span>
              <div style={{ position: 'absolute', bottom: '0.75rem', left: '0.75rem', right: '0.75rem' }}>
                <p style={{ margin: 0, fontSize: '0.62rem', color: '#c19b62', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600 }}>{study.tag}</p>
                <p style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: '#fff', lineHeight: 1.2 }} dangerouslySetInnerHTML={{ __html: study.title }}></p>
              </div>
            </div>
            <div style={{ padding: '1rem', flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <p style={{ margin: '0 0 0.25rem', fontSize: '0.75rem', color: 'var(--admin-muted)' }}><strong>Category:</strong> {CATEGORIES.find(c => c.value === study.category)?.label || study.category}</p>
                <p style={{ margin: '0 0 0.5rem', fontSize: '0.75rem', color: 'var(--admin-muted)' }}><strong>Location:</strong> {study.location || '—'}</p>
                <p style={{ margin: '0 0 0.88rem', fontSize: '0.78rem', lineHeight: 1.4, color: 'var(--admin-text)', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{study.desc}</p>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--admin-border)', paddingTop: '0.75rem' }}>
                <button onClick={() => handleToggle(study)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.85rem', color: 'var(--admin-text)' }}>
                  {study.isActive ? '🟢 Active' : '🔴 Inactive'}
                </button>
                <div className="admin-actions">
                  <button className="admin-icon-btn" onClick={() => openEdit(study)} aria-label="Edit"><i className="fa-solid fa-pen" /></button>
                  <button className="admin-icon-btn danger" onClick={() => handleDelete(study._id, study.title)} aria-label="Delete"><i className="fa-solid fa-trash" /></button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {modal !== null && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div style={{ background: '#fff', borderRadius: '12px', padding: '2rem', width: '100%', maxWidth: '640px', maxHeight: '90vh', overflowY: 'auto' }}>
            <h2 style={{ marginTop: 0 }}>{modal._id ? 'Edit B2B Case Study' : 'Add B2B Case Study'}</h2>
            {error && <p style={{ color: '#dc2626', fontSize: '0.88rem', marginBottom: '1rem' }}>{error}</p>}
            
            <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr', gap: '1rem' }}>
              <div className="admin-form-group">
                <label>Number <span style={{ color: '#dc2626' }}>*</span></label>
                <input className="admin-input" value={modal.num || ''} onChange={e => setModal({ ...modal, num: e.target.value })} placeholder="e.g. 01" />
              </div>
              <div className="admin-form-group">
                <label>Tag / Badge <span style={{ color: '#dc2626' }}>*</span></label>
                <input className="admin-input" value={modal.tag || ''} onChange={e => setModal({ ...modal, tag: e.target.value })} placeholder="e.g. SMART CINEMA" />
              </div>
            </div>

            <div className="admin-form-group">
              <label>Title <span style={{ color: '#dc2626' }}>*</span> <span style={{ color: 'var(--admin-muted)', fontWeight: 400 }}>(Use &lt;br&gt; for line breaks)</span></label>
              <input className="admin-input" style={{ maxWidth: '100%' }} value={modal.title || ''} onChange={e => setModal({ ...modal, title: e.target.value })} placeholder="e.g. CONNPLEX&lt;br&gt;EXPERIENCE CENTRE" />
            </div>

            <div className="admin-form-group">
              <label>Subtitle</label>
              <input className="admin-input" style={{ maxWidth: '100%' }} value={modal.subtitle || ''} onChange={e => setModal({ ...modal, subtitle: e.target.value })} placeholder="e.g. REDEFINING THE FUTURE OF CINEMA" />
            </div>

            <div className="admin-form-group">
              <label>Location</label>
              <input className="admin-input" style={{ maxWidth: '100%' }} value={modal.location || ''} onChange={e => setModal({ ...modal, location: e.target.value })} placeholder="e.g. MUMBAI, MAHARASHTRA" />
            </div>

            <div className="admin-form-group">
              <label>Image Path / URL <span style={{ color: '#dc2626' }}>*</span></label>
              <input className="admin-input" style={{ maxWidth: '100%' }} value={modal.img || ''} onChange={e => setModal({ ...modal, img: e.target.value })} placeholder="e.g. /img/case-study/case_study_1.png" />
              {modal.img && <img src={modal.img} alt="preview" style={{ marginTop: '0.5rem', height: '80px', borderRadius: '4px', objectFit: 'cover', border: '1px solid var(--admin-border)' }} onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />}
            </div>

            <div className="admin-form-group">
              <label>Short Description</label>
              <textarea className="admin-input" style={{ maxWidth: '100%', height: '80px', resize: 'vertical' }} value={modal.desc || ''} onChange={e => setModal({ ...modal, desc: e.target.value })} placeholder="Brief case details..." />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem' }}>
              <div className="admin-form-group">
                <label>Category <span style={{ color: '#dc2626' }}>*</span></label>
                <select className="admin-input" style={{ maxWidth: '100%' }} value={modal.category || 'smart-cinemas'} onChange={e => setModal({ ...modal, category: e.target.value })}>
                  {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                </select>
              </div>
              <div className="admin-form-group">
                <label>Order</label>
                <input className="admin-input" type="number" value={modal.order ?? 0} onChange={e => setModal({ ...modal, order: parseInt(e.target.value) })} />
              </div>
            </div>

            <div className="admin-form-group">
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                <input type="checkbox" checked={modal.isActive ?? true} onChange={e => setModal({ ...modal, isActive: e.target.checked })} />
                Active (Show on case studies page)
              </label>
            </div>

            <div className="admin-form-footer">
              <button className="admin-btn admin-btn-outline" onClick={closeModal}>Cancel</button>
              <button className="admin-btn admin-btn-primary" onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : 'Save Case Study'}</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
