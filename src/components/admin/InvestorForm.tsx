'use client';

import { useCallback, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Investor, InvestorFileType, InvestorFile } from '@/lib/media-utils';
import { formatFileSize, getAcceptForType } from '@/lib/media-utils';
import { INVESTOR_SECTION_GROUPS, ALL_PREDEFINED_SECTIONS } from '@/lib/investor-sections';

interface PendingFileItem {
  file: File;
  title: string;
}

type InvestorFormProps = {
  mode: 'create' | 'edit';
  initial?: Investor;
  showHeader?: boolean;
};

export default function InvestorForm({ mode, initial, showHeader = true }: InvestorFormProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState(initial?.title ?? '');
  const [type, setType] = useState<InvestorFileType>(initial?.type ?? 'pdf');
  const [parent, setParent] = useState(initial?.parent ?? '');
  const [files, setFiles] = useState<InvestorFile[]>(initial?.files ?? []);
  const [pendingFiles, setPendingFiles] = useState<PendingFileItem[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Editing existing file title state
  const [editingFileId, setEditingFileId] = useState<string | null>(null);
  const [editingFileTitle, setEditingFileTitle] = useState('');
  const [savingFileId, setSavingFileId] = useState<string | null>(null);

  const accept = getAcceptForType(type);

  const addPendingFiles = useCallback(
    (list: FileList | File[]) => {
      const arr = Array.from(list).filter((f) => f.size > 0);
      const newItems: PendingFileItem[] = arr.map((f) => ({
        file: f,
        title: f.name.replace(/\.pdf$/i, '').replace(/\.mp3$/i, '').replace(/[-_]+/g, ' ').trim(),
      }));
      setPendingFiles((prev) => [...prev, ...newItems]);
      setError('');
    },
    []
  );

  const updatePendingTitle = (index: number, newTitle: string) => {
    setPendingFiles((prev) =>
      prev.map((item, i) => (i === index ? { ...item, title: newTitle } : item))
    );
  };

  const removePending = (index: number) => {
    setPendingFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSelectPredefinedSection = (secTitle: string) => {
    const predefined = ALL_PREDEFINED_SECTIONS.find(
      (s) => s.title.toLowerCase().trim() === secTitle.toLowerCase().trim()
    );
    if (predefined) {
      setTitle(predefined.title);
      setParent(predefined.parent);
      setType(predefined.type);
    } else {
      setTitle(secTitle);
    }
  };

  const uploadFileToInvestor = async (investorId: string, item: PendingFileItem) => {
    const formData = new FormData();
    formData.append('file', item.file);
    if (item.title) {
      formData.append('title', item.title.trim());
    }
    const res = await fetch(`/api/admin/investors/${investorId}/upload`, {
      method: 'POST',
      body: formData,
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.error || 'Upload failed');
    }
    return res.json() as Promise<{ investor: Investor; file: InvestorFile }>;
  };

  const removeStoredFile = async (fileId: string, docTitle: string) => {
    if (!initial?.id) return;
    if (!confirm(`Are you sure you want to delete "${docTitle}"? This will remove it from the website.`)) return;

    try {
      const res = await fetch(`/api/admin/investors/${initial.id}/files/${fileId}`, {
        method: 'DELETE',
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to remove file');
      }
      const investor = (await res.json()) as Investor;
      setFiles(investor.files || []);
      setSuccessMsg('Document deleted successfully.');
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err: any) {
      setError(err?.message || 'Failed to remove document');
    }
  };

  const startRenameStoredFile = (file: InvestorFile) => {
    setEditingFileId(file.id);
    setEditingFileTitle(file.title || file.originalName.replace(/\.pdf$/i, '').replace(/\.mp3$/i, ''));
  };

  const saveRenameStoredFile = async (fileId: string) => {
    if (!initial?.id || !editingFileTitle.trim()) return;
    setSavingFileId(fileId);
    try {
      const res = await fetch(`/api/admin/investors/${initial.id}/files/${fileId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: editingFileTitle.trim() }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to update document name');
      }
      const data = await res.json();
      if (data.investor?.files) {
        setFiles(data.investor.files);
      } else {
        setFiles((prev) =>
          prev.map((f) => (f.id === fileId ? { ...f, title: editingFileTitle.trim() } : f))
        );
      }
      setEditingFileId(null);
      setSuccessMsg('Document name updated successfully! Visible on website.');
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err: any) {
      setError(err?.message || 'Failed to rename document');
    } finally {
      setSavingFileId(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Section / Document Name is required');
      return;
    }

    setSaving(true);
    setError('');
    setSuccessMsg('');

    try {
      if (mode === 'create') {
        const formData = new FormData();
        formData.append('title', title.trim());
        formData.append('type', type);
        formData.append('parent', parent.trim());
        formData.append('fileTitles', JSON.stringify(pendingFiles.map((p) => p.title)));
        pendingFiles.forEach((p) => formData.append('files', p.file));

        const res = await fetch('/api/admin/investors', {
          method: 'POST',
          body: formData,
        });
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error || 'Failed to create section');
        }
        router.push('/admin/investors');
        router.refresh();
        return;
      }

      // Mode: Edit
      const res = await fetch(`/api/admin/investors/${initial!.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: title.trim(), type, parent: parent.trim() }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to update section');
      }

      let currentInvestor = (await res.json()) as Investor;

      // Upload any new pending files
      for (const item of pendingFiles) {
        const uploadResult = await uploadFileToInvestor(currentInvestor.id, item);
        if (uploadResult.investor) {
          currentInvestor = uploadResult.investor;
        }
      }

      setFiles(currentInvestor.files || []);
      setPendingFiles([]);
      setSuccessMsg('Section and documents saved successfully! All updates are live on the website.');
      router.push('/admin/investors');
      router.refresh();
    } catch (err: any) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="admin-card" style={{ maxWidth: '900px', margin: '0 auto' }}>
      {showHeader && (
        <div style={{ marginBottom: '1.75rem', borderBottom: '1px solid var(--admin-border)', paddingBottom: '1rem' }}>
          <h1 style={{ marginBottom: '0.35rem', fontSize: '1.65rem', fontWeight: '700' }}>
            {mode === 'create' ? '➕ Add Investor Section & Upload Documents' : '✏️ Manage Section & Documents'}
          </h1>
          <p style={{ color: 'var(--admin-muted)', fontSize: '0.9rem', margin: 0 }}>
            Upload documents, set their website display names, and choose their target section.
          </p>
        </div>
      )}

      {error && (
        <div
          style={{
            background: '#fee2e2',
            color: '#991b1b',
            padding: '0.85rem 1.25rem',
            borderRadius: '8px',
            marginBottom: '1.5rem',
            fontSize: '0.92rem',
            border: '1px solid #fecaca',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <span>⚠️</span> <span>{error}</span>
        </div>
      )}

      {successMsg && (
        <div
          style={{
            background: '#f0fdf4',
            color: '#166534',
            padding: '0.85rem 1.25rem',
            borderRadius: '8px',
            marginBottom: '1.5rem',
            fontSize: '0.92rem',
            border: '1px solid #bbf7d0',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <span>✅</span> <span>{successMsg}</span>
        </div>
      )}

      {/* Section Selection Quick Selector */}
      <div
        style={{
          background: '#f8fafc',
          border: '1px solid #e2e8f0',
          borderRadius: '10px',
          padding: '1.25rem',
          marginBottom: '1.75rem',
        }}
      >
        <label style={{ display: 'block', fontWeight: '700', fontSize: '0.95rem', marginBottom: '0.4rem', color: '#1e293b' }}>
          🎯 Choose Target Section on Website
        </label>
        <p style={{ fontSize: '0.82rem', color: 'var(--admin-muted)', margin: '0 0 0.75rem 0' }}>
          Select an existing section from the website list, or type a custom section name below.
        </p>

        <select
          className="admin-select"
          onChange={(e) => {
            if (e.target.value) handleSelectPredefinedSection(e.target.value);
          }}
          value={ALL_PREDEFINED_SECTIONS.some((s) => s.title.toLowerCase() === title.toLowerCase()) ? title : ''}
          style={{ width: '100%', background: '#fff', fontWeight: '500' }}
        >
          <option value="">-- Choose from standard website sections --</option>
          {INVESTOR_SECTION_GROUPS.map((group) => (
            <optgroup key={group.category} label={`${group.icon} ${group.category}`}>
              {group.sections.map((sec) => (
                <option key={sec.title} value={sec.title}>
                  {sec.title} {sec.parent ? `(${sec.parent})` : '(Standalone)'}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
      </div>

      {/* Main Section Meta Details */}
      <div className="investor-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem', marginBottom: '1.5rem' }}>
        <div className="admin-form-group">
          <label style={{ fontWeight: '600', fontSize: '0.92rem', display: 'block', marginBottom: '0.4rem' }}>
            Section Name (as shown in website navigation)<span className="required" style={{ color: '#dc2626' }}>*</span>
          </label>
          <input
            className="admin-input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Board Meeting, Preferential Issue, Financial Results"
            required
            style={{ width: '100%' }}
          />
        </div>

        <div className="admin-form-group">
          <label style={{ fontWeight: '600', fontSize: '0.92rem', display: 'block', marginBottom: '0.4rem' }}>
            Parent Category (Optional accordion group)
          </label>
          <select
            className="admin-select"
            value={parent}
            onChange={(e) => setParent(e.target.value)}
            style={{ width: '100%' }}
          >
            <option value="">None (Standalone Section)</option>
            <option value="Announcements">Announcements</option>
            <option value="Policies">Policies</option>
            <option value="Committees">Committees</option>
            <option value="Initial Public Offer">Initial Public Offer</option>
          </select>
        </div>
      </div>

      <div className="admin-form-group" style={{ marginBottom: '1.75rem' }}>
        <label style={{ fontWeight: '600', fontSize: '0.92rem', display: 'block', marginBottom: '0.4rem' }}>
          Document Type Format
        </label>
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          <label style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer', fontSize: '0.9rem' }}>
            <input
              type="radio"
              name="docType"
              value="pdf"
              checked={type === 'pdf'}
              onChange={() => setType('pdf')}
            />
            <span>📄 PDF Documents</span>
          </label>
          <label style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer', fontSize: '0.9rem' }}>
            <input
              type="radio"
              name="docType"
              value="audio"
              checked={type === 'audio'}
              onChange={() => setType('audio')}
            />
            <span>🎵 Audio Files (.mp3, .wav)</span>
          </label>
        </div>
      </div>

      {/* Upload Zone */}
      <div className="admin-form-group" style={{ marginBottom: '2rem' }}>
        <label style={{ fontWeight: '700', fontSize: '0.95rem', display: 'block', marginBottom: '0.5rem', color: '#18181b' }}>
          📤 Select & Upload Documents
        </label>
        <p style={{ fontSize: '0.85rem', color: 'var(--admin-muted)', margin: '0 0 0.85rem 0' }}>
          Select one or multiple {type === 'pdf' ? 'PDF' : 'Audio'} files to upload. You can rename each document title below before saving.
        </p>

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
          style={{
            border: dragOver ? '2px dashed var(--admin-gold)' : '2px dashed #cbd5e1',
            borderRadius: '10px',
            padding: '2.5rem 1.5rem',
            textAlign: 'center',
            cursor: 'pointer',
            background: dragOver ? '#fffbeb' : '#fafafa',
            transition: 'all 0.2s ease',
          }}
        >
          <div className="upload-inner">
            <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{type === 'pdf' ? '📎' : '🎙️'}</div>
            <div style={{ fontWeight: '600', fontSize: '1.05rem', color: '#1e293b' }}>
              Drag and drop files here, or click to browse
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--admin-muted)', marginTop: '0.35rem' }}>
              Supports {type === 'pdf' ? '.pdf documents' : '.mp3, .wav, .m4a audio'} up to 50MB
            </div>
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

      {/* Pending Files to Upload (WITH DOCUMENT NAME / TITLE INPUT!) */}
      {pendingFiles.length > 0 && (
        <div
          style={{
            background: '#f0fdf4',
            border: '1px solid #86efac',
            padding: '1.25rem',
            borderRadius: '10px',
            marginBottom: '1.75rem',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
            <label style={{ fontWeight: '700', fontSize: '0.95rem', color: '#166534' }}>
              ✅ Files Ready to Upload ({pendingFiles.length})
            </label>
            <span style={{ fontSize: '0.8rem', color: '#15803d' }}>
              Type the exact title you want visible on the website
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {pendingFiles.map((item, i) => (
              <div
                key={i}
                style={{
                  background: '#fff',
                  border: '1px solid #bbf7d0',
                  padding: '0.85rem 1rem',
                  borderRadius: '8px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', overflow: 'hidden' }}>
                    <span style={{ fontSize: '1.2rem' }}>{type === 'pdf' ? '📄' : '🎵'}</span>
                    <span style={{ fontWeight: '600', fontSize: '0.88rem', color: '#1e293b' }}>
                      {item.file.name}
                    </span>
                    <span style={{ fontSize: '0.78rem', color: 'var(--admin-muted)', background: '#f1f5f9', padding: '0.15rem 0.5rem', borderRadius: '4px' }}>
                      {formatFileSize(item.file.size)}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => removePending(i)}
                    title="Remove this file"
                    style={{
                      background: '#fee2e2',
                      border: '1px solid #fecaca',
                      color: '#dc2626',
                      borderRadius: '6px',
                      padding: '0.25rem 0.6rem',
                      cursor: 'pointer',
                      fontSize: '0.85rem',
                      fontWeight: '600',
                    }}
                  >
                    ✕ Remove
                  </button>
                </div>

                {/* Editable Document Title Input */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', marginTop: '0.25rem' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: '600', color: '#475569' }}>
                    Document Name / Title (will show on the website):
                  </label>
                  <input
                    type="text"
                    className="admin-input"
                    value={item.title}
                    onChange={(e) => updatePendingTitle(i, e.target.value)}
                    placeholder="e.g. Outcome of Board Meeting - 04.11.2026"
                    style={{
                      width: '100%',
                      padding: '0.5rem 0.75rem',
                      fontSize: '0.9rem',
                      borderColor: '#cbd5e1',
                      borderRadius: '6px',
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Already Uploaded Files in this Section */}
      {files.length > 0 && (
        <div
          style={{
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            padding: '1.25rem',
            borderRadius: '10px',
            marginBottom: '1.75rem',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
            <label style={{ fontWeight: '700', fontSize: '0.95rem', color: '#0f172a' }}>
              📁 Live Documents in this Section ({files.length})
            </label>
            <span style={{ fontSize: '0.8rem', color: 'var(--admin-muted)' }}>
              Currently visible on https://www.theconnplex.com/investors
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            {files.map((f) => {
              const displayTitle = f.title || f.originalName.replace(/\.pdf$/i, '').replace(/\.mp3$/i, '');
              const isEditing = editingFileId === f.id;

              return (
                <div
                  key={f.id}
                  style={{
                    background: '#fff',
                    border: '1px solid #e2e8f0',
                    padding: '0.85rem 1rem',
                    borderRadius: '8px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.5rem',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flex: 1, minWidth: '240px' }}>
                      <span style={{ fontSize: '1.25rem' }}>{type === 'pdf' ? '📄' : '🎵'}</span>
                      <div style={{ minWidth: 0, flex: 1 }}>
                        <div style={{ fontWeight: '700', fontSize: '0.92rem', color: '#0f172a' }}>
                          {displayTitle}
                        </div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--admin-muted)', marginTop: '0.15rem' }}>
                          File: {f.originalName} • {formatFileSize(f.size)}
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      <a
                        href={f.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                          background: '#f1f5f9',
                          border: '1px solid #cbd5e1',
                          color: '#0f172a',
                          padding: '0.35rem 0.75rem',
                          borderRadius: '6px',
                          fontSize: '0.82rem',
                          fontWeight: '600',
                          textDecoration: 'none',
                        }}
                      >
                        👁️ Preview
                      </a>

                      <button
                        type="button"
                        onClick={() => (isEditing ? setEditingFileId(null) : startRenameStoredFile(f))}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                          background: isEditing ? '#fef3c7' : '#eff6ff',
                          border: isEditing ? '1px solid #fde047' : '1px solid #bfdbfe',
                          color: isEditing ? '#92400e' : '#1e40af',
                          padding: '0.35rem 0.75rem',
                          borderRadius: '6px',
                          fontSize: '0.82rem',
                          fontWeight: '600',
                          cursor: 'pointer',
                        }}
                      >
                        ✏️ {isEditing ? 'Cancel' : 'Edit Title'}
                      </button>

                      <button
                        type="button"
                        onClick={() => removeStoredFile(f.id, displayTitle)}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                          background: '#fee2e2',
                          border: '1px solid #fecaca',
                          color: '#dc2626',
                          padding: '0.35rem 0.75rem',
                          borderRadius: '6px',
                          fontSize: '0.82rem',
                          fontWeight: '600',
                          cursor: 'pointer',
                        }}
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </div>

                  {/* Inline Rename Box */}
                  {isEditing && (
                    <div
                      style={{
                        marginTop: '0.5rem',
                        padding: '0.75rem',
                        background: '#fffbeb',
                        border: '1px solid #fef08a',
                        borderRadius: '6px',
                        display: 'flex',
                        gap: '0.5rem',
                        alignItems: 'center',
                      }}
                    >
                      <input
                        type="text"
                        className="admin-input"
                        value={editingFileTitle}
                        onChange={(e) => setEditingFileTitle(e.target.value)}
                        placeholder="Enter new document title"
                        style={{ flex: 1, padding: '0.45rem 0.75rem', fontSize: '0.88rem' }}
                      />
                      <button
                        type="button"
                        onClick={() => saveRenameStoredFile(f.id)}
                        disabled={savingFileId === f.id}
                        style={{
                          background: 'var(--admin-gold)',
                          color: '#000',
                          border: 'none',
                          padding: '0.45rem 1rem',
                          borderRadius: '6px',
                          fontWeight: '600',
                          fontSize: '0.85rem',
                          cursor: 'pointer',
                        }}
                      >
                        {savingFileId === f.id ? 'Saving…' : 'Save Title'}
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Form Action Buttons */}
      <div
        className="admin-form-footer"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '1rem',
          marginTop: '2rem',
          paddingTop: '1.25rem',
          borderTop: '1px solid var(--admin-border)',
        }}
      >
        <button
          type="button"
          className="admin-btn admin-btn-outline"
          onClick={() => router.push('/admin/investors')}
          disabled={saving}
          style={{ padding: '0.65rem 1.5rem', fontSize: '0.9rem', fontWeight: '600' }}
        >
          ← Back to Investors List
        </button>

        <button
          type="submit"
          className="admin-btn admin-btn-primary"
          disabled={saving}
          style={{
            padding: '0.7rem 2rem',
            fontSize: '0.92rem',
            fontWeight: '700',
            background: saving ? 'var(--admin-muted)' : 'var(--admin-gold)',
            color: '#000',
            borderRadius: '8px',
          }}
        >
          {saving
            ? '⏳ Saving Updates…'
            : mode === 'create'
            ? '🚀 Create Section & Upload Documents'
            : '💾 Save All Changes'}
        </button>
      </div>
    </form>
  );
}
