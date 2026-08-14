'use client';

import { useEffect, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import type { Investor } from '@/lib/media-utils';
import { getAcceptForType, formatFileSize } from '@/lib/media-utils';

export default function EditInvestorPage() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [investor, setInvestor] = useState<Investor | null>(null);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`/api/admin/investors/${id}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        setInvestor(data);
        setTitle(data?.title ?? '');
        setLoading(false);
      });
  }, [id]);

  const addPendingFiles = (list: FileList | File[]) => {
    const arr = Array.from(list).filter((f) => f.size > 0);
    setPendingFiles((prev) => [...prev, ...arr]);
    setError('');
  };

  const removePending = (index: number) => {
    setPendingFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const removeStoredFile = async (fileId: string) => {
    if (!confirm('Are you sure you want to delete this file?')) return;
    try {
      const res = await fetch(`/api/admin/investors/${id}/files/${fileId}`, {
        method: 'DELETE',
      });
      if (!res.ok) {
        throw new Error('Failed to remove file');
      }
      const updated = await res.json();
      setInvestor(updated);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    }
  };

  const accept = getAcceptForType(investor?.type ?? 'pdf');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Title is required');
      return;
    }
    setSaving(true);
    setError('');
    try {
      // update title
      const res = await fetch(`/api/admin/investors/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: title.trim() }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to update investor');
      }

      // upload pending files
      for (const file of pendingFiles) {
        const formData = new FormData();
        formData.append('file', file);
        const up = await fetch(`/api/admin/investors/${id}/upload`, {
          method: 'POST',
          body: formData,
        });
        if (!up.ok) {
          const data = await up.json().catch(() => ({}));
          throw new Error(data.error || 'Upload failed');
        }
      }

      router.push('/admin/investors');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="admin-card admin-empty">Loading…</div>;
  }

  if (!investor) {
    return <div className="admin-card admin-empty">Investor not found.</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="admin-card">
      <h1 style={{ marginBottom: '0.75rem', fontSize: '1.5rem', fontWeight: 700 }}>
        ✏️ Edit Investor
      </h1>

      {error && (
        <div style={{ background: '#fee2e2', color: '#991b1b', padding: '0.75rem 1rem', borderRadius: 6 }}>
          ⚠️ {error}
        </div>
      )}

      <div className="admin-form-group" style={{ marginBottom: '1.25rem' }}>
        <label style={{ fontWeight: 600, fontSize: '0.95rem' }}>
          Investor Name<span className="required">*</span>
        </label>
        <input
          className="admin-input"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Goldman Sachs"
          required
          style={{ marginTop: '0.5rem' }}
        />
      </div>

      <div className="admin-form-group" style={{ marginBottom: '1.25rem' }}>
        <label style={{ fontWeight: 600, fontSize: '0.95rem', display: 'block', marginBottom: '0.75rem' }}>
          Investor Files
        </label>

        <div
          className={`admin-upload-zone ${dragOver ? 'dragover' : ''}`}
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            if (e.dataTransfer.files.length) addPendingFiles(e.dataTransfer.files);
          }}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && fileInputRef.current?.click()}
        >
          <div className="upload-inner">
            <div className="upload-emoji">📎</div>
            <div className="upload-title">Drag and drop files here</div>
            <div className="upload-subtitle">or click to browse</div>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept={accept}
            onChange={(e) => e.currentTarget.files && addPendingFiles(e.currentTarget.files)}
            style={{ display: 'none' }}
          />
        </div>
      </div>

      {pendingFiles.length > 0 && (
        <div
          className="admin-form-group"
          style={{
            background: '#f0fdf4',
            border: '1px solid #86efac',
            padding: '1.25rem',
            borderRadius: '8px',
            marginBottom: '1.5rem',
          }}
        >
          <label style={{ fontWeight: '600', fontSize: '0.95rem', color: '#166534' }}>
            ✅ Files to Upload ({pendingFiles.length})
          </label>
          <div className="admin-file-list" style={{ marginTop: '1rem' }}>
            {pendingFiles.map((f, i) => (
              <div
                key={i}
                className="admin-file-row"
                style={{
                  background: '#fff',
                  padding: '0.75rem',
                  borderRadius: '6px',
                  marginBottom: '0.5rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div>
                  <div className="admin-file-name" style={{ fontWeight: 500 }}>📎 {f.name}</div>
                  <div className="admin-file-meta" style={{ fontSize: '0.85rem', color: '#666' }}>{formatFileSize(f.size)}</div>
                </div>
                <button
                  type="button"
                  className="admin-file-remove"
                  onClick={() => removePending(i)}
                  title="Remove"
                  style={{
                    background: '#fee2e2',
                    borderColor: '#fecaca',
                    color: '#dc2626',
                    border: '1px solid',
                    padding: '0.35rem 0.6rem',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                  }}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {investor.files && investor.files.length > 0 && (
        <div
          className="admin-form-group"
          style={{
            background: '#eff6ff',
            border: '1px solid #bfdbfe',
            padding: '1.25rem',
            borderRadius: '8px',
            marginBottom: '1.5rem',
          }}
        >
          <label style={{ fontWeight: '600', fontSize: '0.95rem', color: '#1e40af' }}>
            📁 Uploaded Files ({investor.files.length})
          </label>
          <div className="admin-file-list" style={{ marginTop: '1rem' }}>
            {[...investor.files].reverse().map((f) => (
              <div
                key={f.id}
                className="admin-file-row"
                style={{
                  background: '#fff',
                  padding: '0.75rem',
                  borderRadius: '6px',
                  marginBottom: '0.5rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div>
                  <div className="admin-file-name" style={{ fontWeight: 500 }}>
                    {investor.type === 'pdf' ? '📄' : '🎵'} {f.originalName}
                  </div>

                </div>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <a
                    href={f.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      color: '#2563eb',
                      fontWeight: '500',
                      textDecoration: 'none',
                      fontSize: '0.9rem',
                      background: '#eff6ff',
                      padding: '0.35rem 0.6rem',
                      borderRadius: '4px',
                      border: '1px solid #bfdbfe',
                    }}
                  >
                    ⬇️ Download
                  </a>
                  <button
                    type="button"
                    className="admin-file-remove"
                    onClick={() => removeStoredFile(f.id)}
                    title="Remove"
                    style={{
                      background: '#fee2e2',
                      borderColor: '#fecaca',
                      color: '#dc2626',
                      border: '1px solid',
                      padding: '0.35rem 0.6rem',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontWeight: 'bold',
                    }}
                  >
                    ×
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="admin-form-footer" style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
        <button type="button" className="admin-btn admin-btn-outline" onClick={() => router.back()} disabled={saving}>
          ← Cancel
        </button>
        <button type="submit" className="admin-btn admin-btn-primary" disabled={saving}>
          {saving ? '⏳ Saving…' : '💾 Save Changes'}
        </button>
      </div>
    </form>
  );
}
