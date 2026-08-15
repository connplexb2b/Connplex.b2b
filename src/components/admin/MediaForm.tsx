'use client';

import { useCallback, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { MediaEntry, MediaFileType, StoredMediaFile } from '@/lib/media-utils';
import { formatFileSize, getAcceptForType } from '@/lib/media-utils';

type MediaFormProps = {
  mode: 'create' | 'edit';
  initial?: MediaEntry;
};

export default function MediaForm({ mode, initial }: MediaFormProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState(initial?.title ?? '');
  const [type, setType] = useState<MediaFileType>(initial?.type ?? 'pdf');
  const [parent, setParent] = useState(initial?.parent ?? '');
  const [files, setFiles] = useState<StoredMediaFile[]>(initial?.files ?? []);
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

  const uploadFileToEntry = async (entryId: string, file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch(`/api/admin/media/${entryId}/upload`, {
      method: 'POST',
      body: formData,
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.error || 'Upload failed');
    }
    return res.json() as Promise<MediaEntry>;
  };

  const removeStoredFile = async (fileId: string) => {
    if (!initial?.id) return;
    const res = await fetch(`/api/admin/media/${initial.id}/files/${fileId}`, {
      method: 'DELETE',
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error || 'Failed to remove file');
      return;
    }
    const entry = (await res.json()) as MediaEntry;
    setFiles(entry.files);
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

        const res = await fetch('/api/admin/media', {
          method: 'POST',
          body: formData,
        });
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error || 'Failed to create entry');
        }
        router.push('/admin');
        router.refresh();
        return;
      }

      const res = await fetch(`/api/admin/media/${initial!.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: title.trim(), type, parent: parent.trim() }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to update entry');
      }

      let entry = (await res.json()) as MediaEntry;
      for (const file of pendingFiles) {
        entry = await uploadFileToEntry(entry.id, file);
      }

      setFiles(entry.files);
      setPendingFiles([]);
      router.push('/admin');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="admin-card">
      <h1 style={{ marginBottom: '1.5rem', fontSize: '1.35rem' }}>
        {mode === 'create' ? 'Add Media Entry' : 'Edit Media Entry'}
      </h1>

      {error && <p className="admin-error">{error}</p>}

      <div className="admin-form-group">
        <label>
          Title<span className="required">*</span>
        </label>
        <input
          className="admin-input"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Monitoring Agency Report"
          required
        />
      </div>

      <div className="admin-form-group">
        <label>
          File type<span className="required">*</span>
        </label>
        <select
          className="admin-select"
          value={type}
          onChange={(e) => {
            setType(e.target.value as MediaFileType);
            setPendingFiles([]);
          }}
          disabled={mode === 'edit' && files.length > 0}
        >
          <option value="pdf">PDF Documents</option>
          <option value="audio">Audio Files</option>
        </select>
        {mode === 'edit' && files.length > 0 && (
          <p style={{ fontSize: '0.75rem', color: 'var(--admin-muted)', marginTop: '0.35rem' }}>
            Remove all files to change type between PDF and Audio.
          </p>
        )}
      </div>

      <div className="admin-form-group">
        <label>Parent / Category</label>
        <input
          className="admin-input"
          value={parent}
          onChange={(e) => setParent(e.target.value)}
          placeholder="e.g. Policies (optional)"
        />
      </div>

      <div className="admin-form-group">
        <label>{type === 'pdf' ? 'PDF Files' : 'Audio Files'}</label>
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
          <span className="admin-upload-plus">+</span>
          <input
            ref={fileInputRef}
            type="file"
            accept={accept}
            multiple
            onChange={(e) => {
              if (e.target.files?.length) addPendingFiles(e.target.files);
              e.target.value = '';
            }}
          />
        </div>
        <p style={{ fontSize: '0.78rem', color: 'var(--admin-muted)', marginBottom: '1rem' }}>
          {type === 'pdf'
            ? 'Supported: PDF (max 50MB per file)'
            : 'Supported: MP3, WAV, M4A, OGG, WebM, AAC (max 50MB per file)'}
        </p>

        <div className="admin-file-list">
          {files.map((file) => (
            <div key={file.id} className="admin-file-row">
              <div>
                <div className="admin-file-name">{file.originalName}</div>
                <div className="admin-file-meta">{formatFileSize(file.size)}</div>
                {type === 'audio' && (
                  <div className="admin-audio-preview">
                    <audio controls preload="metadata" src={file.url}>
                      <track kind="captions" />
                    </audio>
                  </div>
                )}
              </div>
              <div className="admin-file-links">
                <a href={file.url} target="_blank" rel="noopener noreferrer">
                  Download File
                </a>
                {mode === 'edit' && (
                  <button
                    type="button"
                    className="admin-file-remove"
                    aria-label="Remove file"
                    onClick={() => removeStoredFile(file.id)}
                  >
                    ×
                  </button>
                )}
              </div>
            </div>
          ))}

          {pendingFiles.map((file, index) => (
            <div key={`pending-${index}`} className="admin-file-row">
              <div>
                <div className="admin-file-name">{file.name}</div>
                <div className="admin-file-meta">
                  {formatFileSize(file.size)} — pending upload
                </div>
              </div>
              <button
                type="button"
                className="admin-file-remove"
                aria-label="Remove pending file"
                onClick={() => removePending(index)}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="admin-form-footer">
        <button type="button" className="admin-btn admin-btn-outline" onClick={() => router.push('/admin')}>
          Back
        </button>
        <button type="submit" className="admin-btn admin-btn-primary" disabled={saving}>
          {saving ? 'Saving…' : 'Submit'}
        </button>
      </div>
    </form>
  );
}
