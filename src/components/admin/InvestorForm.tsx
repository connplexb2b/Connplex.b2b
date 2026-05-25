'use client';

import { useCallback, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Investor, InvestorFileType, InvestorFile } from '@/lib/media-utils';
import { formatFileSize, getAcceptForType } from '@/lib/media-utils';

type InvestorFormProps = {
  mode: 'create' | 'edit';
  initial?: Investor;
  showHeader?: boolean;
};

export default function InvestorForm({ mode, initial }: InvestorFormProps) {
  const router = useRouter();
  const showHeader = (typeof (arguments[0] as any)?.showHeader === 'boolean')
    ? (arguments[0] as any).showHeader
    : true;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState(initial?.title ?? '');
  const [type, setType] = useState<InvestorFileType>(initial?.type ?? 'pdf');
  const [parent, setParent] = useState(initial?.parent ?? '');
  const [files, setFiles] = useState<InvestorFile[]>(initial?.files ?? []);
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const accept = getAcceptForType(type);

  const addPendingFiles = useCallback(
    (list: FileList | File[]) => {
      const arr = Array.from(list).filter((f) => f.size > 0);
      setPendingFiles((prev) => [...prev, ...arr]);
      setError('');
    },
    []
  );

  const removePending = (index: number) => {
    setPendingFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const uploadFileToInvestor = async (investorId: string, file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch(`/api/admin/investors/${investorId}/upload`, {
      method: 'POST',
      body: formData,
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.error || 'Upload failed');
    }
    return res.json() as Promise<Investor>;
  };

  const removeStoredFile = async (fileId: string) => {
    if (!initial?.id) return;
    const res = await fetch(`/api/admin/investors/${initial.id}/files/${fileId}`, {
      method: 'DELETE',
    });
    if (!res.ok) {
      setError('Failed to remove file');
      return;
    }
    const investor = (await res.json()) as Investor;
    setFiles(investor.files);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Title is required');
      return;
    }

    setSaving(true);
    setError('');

    try {
      if (mode === 'create') {
        const formData = new FormData();
        formData.append('title', title.trim());
        formData.append('type', type);
        formData.append('parent', parent.trim());
        pendingFiles.forEach((f) => formData.append('files', f));

        const res = await fetch('/api/admin/investors', {
          method: 'POST',
          body: formData,
        });
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error || 'Failed to create investor');
        }
        router.push('/admin/investors');
        router.refresh();
        return;
      }

      const res = await fetch(`/api/admin/investors/${initial!.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: title.trim(), type, parent: parent.trim() }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to update investor');
      }

      let investor = (await res.json()) as Investor;
      for (const file of pendingFiles) {
        investor = await uploadFileToInvestor(investor.id, file);
      }

      setFiles(investor.files);
      setPendingFiles([]);
      router.push('/admin/investors');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="admin-card">
      {showHeader && (
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ marginBottom: '0.5rem', fontSize: '1.75rem', fontWeight: '700' }}>
            {mode === 'create' ? '➕ Add New Investor' : '✏️ Edit Investor'}
          </h1>
          <p style={{ color: 'var(--admin-muted)', fontSize: '0.9rem' }}>
            {mode === 'create'
              ? 'Create a new investor profile with documents'
              : 'Update investor details and manage documents'}
          </p>
        </div>
      )}

      {error && (
        <div
          style={{
            background: '#fee2e2',
            color: '#991b1b',
            padding: '0.75rem 1rem',
            borderRadius: '6px',
            marginBottom: '1.5rem',
            fontSize: '0.9rem',
            border: '1px solid #fecaca',
          }}
        >
          ⚠️ {error}
        </div>
      )}

      <div className="investor-grid">
        <div className="admin-form-group">
          <label style={{ fontWeight: '600', fontSize: '0.95rem' }}>
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

        <div className="admin-form-group">
          <label style={{ fontWeight: '600', fontSize: '0.95rem' }}>
            Document Type<span className="required">*</span>
          </label>
          <select
            className="admin-select"
            value={type}
            onChange={(e) => {
              setType(e.target.value as InvestorFileType);
              setPendingFiles([]);
            }}
            disabled={mode === 'edit' && files.length > 0}
            style={{ marginTop: '0.5rem' }}
          >
            <option value="pdf">📄 PDF Documents</option>
            <option value="audio">🎵 Audio Files</option>
          </select>
          {mode === 'edit' && files.length > 0 && (
            <p style={{ fontSize: '0.75rem', color: 'var(--admin-muted)', marginTop: '0.35rem' }}>
              ℹ️ Remove all files to change type between PDF and Audio.
            </p>
          )}
        </div>
      </div>

      <div className="admin-form-group" style={{ marginBottom: '2rem' }}>
        <label style={{ fontWeight: '600', fontSize: '0.95rem' }}>Category / Section</label>
        <select
          className="admin-select"
          value={parent}
          onChange={(e) => setParent(e.target.value)}
          style={{ marginTop: '0.5rem' }}
        >
          <option value="">Select Category</option>
          <option value="Announcements">Announcements</option>
          <option value="Committees">Committees</option>
          <option value="Initial Public Offer">Initial Public Offer</option>
          <option value="Policies">Policies</option>
          <option value="N/A">N/A</option>
        </select>
      </div>

      <div className="admin-form-group" style={{ marginBottom: '2rem' }}>
        <label style={{ fontWeight: '600', fontSize: '0.95rem', display: 'block', marginBottom: '1rem' }}>
          {type === 'pdf' ? '📄 PDF Files' : '🎵 Audio Files'}
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
            <div className="upload-emoji">{type === 'pdf' ? '📎' : '🎙️'}</div>
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
                }}
              >
                <div>
                  <div className="admin-file-name">📎 {f.name}</div>
                  <div className="admin-file-meta">{formatFileSize(f.size)}</div>
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
                  }}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {files.length > 0 && (
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
            📁 Uploaded Files ({files.length})
          </label>
          <div className="admin-file-list" style={{ marginTop: '1rem' }}>
            {files.map((f) => (
              <div
                key={f.id}
                className="admin-file-row"
                style={{
                  background: '#fff',
                  padding: '0.75rem',
                  borderRadius: '6px',
                  marginBottom: '0.5rem',
                }}
              >
                <div>
                  <div className="admin-file-name">
                    {type === 'pdf' ? '📄' : '🎵'} {f.originalName}
                  </div>
                  <div className="admin-file-meta">{formatFileSize(f.size)}</div>
                </div>
                <div className="admin-file-links">
                  <a
                    href={f.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: '#2563eb', fontWeight: '500' }}
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

      <div
        className="admin-form-footer"
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          gap: '1rem',
          marginTop: '2rem',
          paddingTop: '1.5rem',
          borderTop: '1px solid var(--admin-border)',
        }}
      >
        <button
          type="button"
          className="admin-btn admin-btn-outline"
          onClick={() => router.back()}
          disabled={saving}
          style={{
            padding: '0.65rem 1.5rem',
            fontSize: '0.9rem',
            fontWeight: '600',
          }}
        >
          ← Cancel
        </button>
        <button
          type="submit"
          className="admin-btn admin-btn-primary"
          disabled={saving}
          style={{
            padding: '0.65rem 1.75rem',
            fontSize: '0.9rem',
            fontWeight: '600',
            background: saving ? 'var(--admin-muted)' : 'var(--admin-gold)',
            color: '#000',
          }}
        >
          {saving ? '⏳ Saving…' : mode === 'create' ? '✅ Create Investor' : '💾 Save Changes'}
        </button>
      </div>
    </form>
  );
}
