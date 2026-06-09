'use client';

import { useEffect, useState } from 'react';

interface FAQ {
  _id: string;
  question: string;
  answer: string;
  order: number;
  category: string;
  isActive: boolean;
}

export default function FAQsAdminPage() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<Partial<FAQ> | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    const res = await fetch('/api/admin/faqs?all=true');
    if (res.ok) setFaqs(await res.json());
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const openAdd = () => setModal({ question: '', answer: '', order: faqs.length, category: 'General', isActive: true });
  const openEdit = (faq: FAQ) => setModal({ ...faq });
  const closeModal = () => { setModal(null); setError(''); };

  const handleSave = async () => {
    if (!modal) return;
    if (!modal.question?.trim() || !modal.answer?.trim()) { setError('Question and Answer are required'); return; }
    setSaving(true); setError('');
    const isEdit = !!modal._id;
    const url = isEdit ? `/api/admin/faqs/${modal._id}` : '/api/admin/faqs';
    const method = isEdit ? 'PUT' : 'POST';
    const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(modal) });
    setSaving(false);
    if (res.ok) { closeModal(); load(); } else { const d = await res.json(); setError(d.error || 'Failed to save'); }
  };

  const handleDelete = async (id: string, q: string) => {
    if (!confirm(`Delete FAQ?`)) return;
    const res = await fetch(`/api/admin/faqs/${id}`, { method: 'DELETE' });
    if (res.ok) load();
  };

  const handleToggle = async (faq: FAQ) => {
    await fetch(`/api/admin/faqs/${faq._id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ isActive: !faq.isActive }) });
    load();
  };

  return (
    <>
      <div className="admin-page-header">
        <h1>FAQ Manager</h1>
        <button className="admin-btn admin-btn-primary" onClick={openAdd}>+ Add FAQ</button>
      </div>

      <div className="admin-card admin-table-wrap">
        {loading ? <p className="admin-empty">Loading...</p> : faqs.length === 0 ? (
          <p className="admin-empty">No FAQs yet. <button onClick={openAdd} style={{ background: 'none', border: 'none', color: 'var(--admin-gold)', cursor: 'pointer', fontWeight: 600 }}>Add your first FAQ</button></p>
        ) : (
          <table className="admin-table">
            <thead><tr><th>#</th><th>Question</th><th>Category</th><th>Order</th><th>Status</th><th>Action</th></tr></thead>
            <tbody>
              {faqs.map((faq, i) => (
                <tr key={faq._id}>
                  <td>{i + 1}</td>
                  <td style={{ maxWidth: '320px' }}>
                    <p style={{ margin: 0, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{faq.question}</p>
                    <p style={{ margin: '0.2rem 0 0', fontSize: '0.75rem', color: 'var(--admin-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{faq.answer.substring(0, 80)}...</p>
                  </td>
                  <td><span className="admin-badge" style={{ background: '#f0fdf4', color: '#166534' }}>{faq.category}</span></td>
                  <td>{faq.order}</td>
                  <td>
                    <button onClick={() => handleToggle(faq)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.1rem' }}>
                      {faq.isActive ? '🟢' : '🔴'}
                    </button>
                  </td>
                  <td>
                    <div className="admin-actions">
                      <button className="admin-icon-btn" onClick={() => openEdit(faq)} aria-label="Edit"><i className="fa-solid fa-pen" /></button>
                      <button className="admin-icon-btn danger" onClick={() => handleDelete(faq._id, faq.question)} aria-label="Delete"><i className="fa-solid fa-trash" /></button>
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
          <div style={{ background: '#fff', borderRadius: '12px', padding: '2rem', width: '100%', maxWidth: '620px', maxHeight: '90vh', overflowY: 'auto' }}>
            <h2 style={{ marginTop: 0 }}>{modal._id ? 'Edit FAQ' : 'Add FAQ'}</h2>
            {error && <p style={{ color: '#dc2626', fontSize: '0.88rem', marginBottom: '1rem' }}>{error}</p>}
            <div className="admin-form-group">
              <label>Question <span style={{ color: '#dc2626' }}>*</span></label>
              <input className="admin-input" style={{ maxWidth: '100%' }} value={modal.question || ''} onChange={e => setModal({ ...modal, question: e.target.value })} placeholder="e.g. What is the minimum investment?" />
            </div>
            <div className="admin-form-group">
              <label>Answer <span style={{ color: '#dc2626' }}>*</span></label>
              <textarea className="admin-input" style={{ maxWidth: '100%', height: '140px', resize: 'vertical' }} value={modal.answer || ''} onChange={e => setModal({ ...modal, answer: e.target.value })} placeholder="Detailed answer..." />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="admin-form-group">
                <label>Category</label>
                <input className="admin-input" value={modal.category || ''} onChange={e => setModal({ ...modal, category: e.target.value })} placeholder="General" />
              </div>
              <div className="admin-form-group">
                <label>Order (lower = first)</label>
                <input className="admin-input" type="number" value={modal.order ?? 0} onChange={e => setModal({ ...modal, order: parseInt(e.target.value) })} />
              </div>
            </div>
            <div className="admin-form-group">
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                <input type="checkbox" checked={modal.isActive ?? true} onChange={e => setModal({ ...modal, isActive: e.target.checked })} />
                Active (visible on website)
              </label>
            </div>
            <div className="admin-form-footer">
              <button className="admin-btn admin-btn-outline" onClick={closeModal}>Cancel</button>
              <button className="admin-btn admin-btn-primary" onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : 'Save FAQ'}</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
