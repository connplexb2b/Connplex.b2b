'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import type { Investor, InvestorFile } from '@/lib/media-utils';
import { formatDate, formatFileSize } from '@/lib/media-utils';
import { INVESTOR_SECTION_GROUPS, ALL_PREDEFINED_SECTIONS } from '@/lib/investor-sections';

interface FlatDocumentItem {
  sectionId: string;
  sectionTitle: string;
  category: string;
  file: InvestorFile;
  updatedAt: string;
}

export default function InvestorsListPage() {
  const [investors, setInvestors] = useState<Investor[]>([]);
  const [search, setSearch] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('All');
  const [viewMode, setViewMode] = useState<'sections' | 'documents'>('sections');
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);

  // Upload Modal State
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadSectionTitle, setUploadSectionTitle] = useState('');
  const [uploadSectionCategory, setUploadSectionCategory] = useState('');
  const [isCustomSection, setIsCustomSection] = useState(false);
  const [customSectionName, setCustomSectionName] = useState('');
  const [customSectionCategory, setCustomSectionCategory] = useState('');
  const [uploadDocumentTitle, setUploadDocumentTitle] = useState('');
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadDragOver, setUploadDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Rename Document Modal State
  const [renameModalData, setRenameModalData] = useState<{
    sectionId: string;
    sectionTitle: string;
    fileId: string;
    currentTitle: string;
  } | null>(null);
  const [newDocumentTitle, setNewDocumentTitle] = useState('');
  const [renaming, setRenaming] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/investors');
      if (res.ok) {
        const data: Investor[] = await res.json();
        setInvestors(data);
      }
    } catch (err) {
      console.error('Failed to load investors:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const showNotification = (text: string, type: 'success' | 'error' = 'success') => {
    setFeedbackMsg({ type, text });
    setTimeout(() => setFeedbackMsg(null), 5000);
  };

  // Filtered Investors (Sections)
  const filteredInvestors = useMemo(() => {
    let list = investors;

    // Filter by Category
    if (selectedCategoryFilter !== 'All') {
      if (selectedCategoryFilter === 'Standalone') {
        list = list.filter((inv) => !inv.parent || inv.parent.trim() === '');
      } else {
        list = list.filter(
          (inv) => (inv.parent || '').toLowerCase().trim() === selectedCategoryFilter.toLowerCase().trim()
        );
      }
    }

    // Filter by Search
    const q = search.trim().toLowerCase();
    if (!q) return list;

    return list.filter((inv) => {
      const titleMatch = inv.title.toLowerCase().includes(q);
      const parentMatch = (inv.parent || '').toLowerCase().includes(q);
      const fileMatch = inv.files.some(
        (f) =>
          (f.title || '').toLowerCase().includes(q) ||
          f.originalName.toLowerCase().includes(q)
      );
      return titleMatch || parentMatch || fileMatch;
    });
  }, [investors, search, selectedCategoryFilter]);

  // Flattened Documents for "All Documents" view
  const allDocuments = useMemo(() => {
    const docs: FlatDocumentItem[] = [];
    investors.forEach((inv) => {
      (inv.files || []).forEach((f) => {
        docs.push({
          sectionId: inv.id,
          sectionTitle: inv.title,
          category: inv.parent || 'Standalone',
          file: f,
          updatedAt: inv.updatedAt,
        });
      });
    });

    const q = search.trim().toLowerCase();
    if (!q) return docs;

    return docs.filter(
      (d) =>
        (d.file.title || '').toLowerCase().includes(q) ||
        d.file.originalName.toLowerCase().includes(q) ||
        d.sectionTitle.toLowerCase().includes(q) ||
        d.category.toLowerCase().includes(q)
    );
  }, [investors, search]);

  const toggleSectionExpand = (id: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const expandAll = () => {
    const allExpanded: Record<string, boolean> = {};
    investors.forEach((inv) => {
      allExpanded[inv.id] = true;
    });
    setExpandedSections(allExpanded);
  };

  const collapseAll = () => {
    setExpandedSections({});
  };

  // Open Quick Upload Modal
  const openUploadModal = (preselectedSectionTitle?: string) => {
    setUploadError('');
    setUploadFile(null);
    setUploadDocumentTitle('');

    if (preselectedSectionTitle) {
      setUploadSectionTitle(preselectedSectionTitle);
      const pre = ALL_PREDEFINED_SECTIONS.find(
        (s) => s.title.toLowerCase() === preselectedSectionTitle.toLowerCase()
      );
      setUploadSectionCategory(pre?.parent || '');
      setIsCustomSection(false);
    } else {
      setUploadSectionTitle('Board Meeting');
      setUploadSectionCategory('Announcements');
      setIsCustomSection(false);
    }

    setIsUploadModalOpen(true);
  };

  const handleFileSelected = (file: File) => {
    setUploadFile(file);
    // Auto-fill document title if empty
    if (!uploadDocumentTitle) {
      const cleanName = file.name
        .replace(/\.pdf$/i, '')
        .replace(/\.mp3$/i, '')
        .replace(/[-_]+/g, ' ')
        .trim();
      setUploadDocumentTitle(cleanName);
    }
    setUploadError('');
  };

  const handleQuickUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFile) {
      setUploadError('Please select a PDF or Audio file to upload.');
      return;
    }

    const targetTitle = isCustomSection ? customSectionName.trim() : uploadSectionTitle.trim();
    const targetCategory = isCustomSection ? customSectionCategory.trim() : uploadSectionCategory.trim();

    if (!targetTitle) {
      setUploadError('Please specify the section for this document.');
      return;
    }

    const docName = uploadDocumentTitle.trim() || uploadFile.name.replace(/\.pdf$/i, '').trim();

    setUploading(true);
    setUploadError('');

    try {
      const formData = new FormData();
      formData.append('file', uploadFile);
      formData.append('sectionTitle', targetTitle);
      if (targetCategory) {
        formData.append('parent', targetCategory);
      }
      formData.append('title', docName);

      const res = await fetch('/api/admin/investors/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to upload document');
      }

      setIsUploadModalOpen(false);
      showNotification(
        `🎉 Document "${docName}" uploaded successfully to "${targetTitle}"! It is now live on the website.`
      );
      await load();

      // Automatically expand the section that received the upload
      if (data.investor?.id) {
        setExpandedSections((prev) => ({ ...prev, [data.investor.id]: true }));
      }
    } catch (err: any) {
      setUploadError(err.message || 'Something went wrong during upload');
    } finally {
      setUploading(false);
    }
  };

  // Open Rename Modal
  const openRenameModal = (sectionId: string, sectionTitle: string, file: InvestorFile) => {
    const current = file.title || file.originalName.replace(/\.pdf$/i, '').replace(/\.mp3$/i, '');
    setRenameModalData({
      sectionId,
      sectionTitle,
      fileId: file.id,
      currentTitle: current,
    });
    setNewDocumentTitle(current);
  };

  const handleRenameSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!renameModalData || !newDocumentTitle.trim()) return;

    setRenaming(true);
    try {
      const res = await fetch(
        `/api/admin/investors/${renameModalData.sectionId}/files/${renameModalData.fileId}`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title: newDocumentTitle.trim() }),
        }
      );

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to update document title');
      }

      setRenameModalData(null);
      showNotification(`Document title updated to "${newDocumentTitle.trim()}". Visible on website.`);
      await load();
    } catch (err: any) {
      alert(err.message || 'Failed to update document name');
    } finally {
      setRenaming(false);
    }
  };

  // Delete Document
  const handleDeleteDocument = async (sectionId: string, sectionTitle: string, fileId: string, docName: string) => {
    if (!confirm(`Are you sure you want to delete "${docName}" from "${sectionTitle}"? It will be removed from the website.`)) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/investors/${sectionId}/files/${fileId}`, {
        method: 'DELETE',
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to delete file');
      }
      showNotification(`Document "${docName}" deleted successfully.`);
      await load();
    } catch (err: any) {
      alert(err.message || 'Failed to delete document');
    }
  };

  // Delete Section
  const handleDeleteSection = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete the entire section "${title}" and all its documents?`)) {
      return;
    }
    const res = await fetch(`/api/admin/investors/${id}`, { method: 'DELETE' });
    if (res.ok) {
      showNotification(`Section "${title}" deleted.`);
      load();
    }
  };

  const totalDocumentsCount = useMemo(() => {
    return investors.reduce((acc, inv) => acc + (inv.files?.length || 0), 0);
  }, [investors]);

  return (
    <>
      {/* Top Banner and Actions */}
      <div
        style={{
          marginBottom: '1.75rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: '1.25rem',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <h1 style={{ fontSize: '1.85rem', fontWeight: '800', margin: 0, color: '#0f172a' }}>
              🏢 Investor Documents & Sections
            </h1>
            <span
              style={{
                background: '#fef3c7',
                color: '#92400e',
                border: '1px solid #fde047',
                borderRadius: '20px',
                padding: '0.2rem 0.65rem',
                fontSize: '0.78rem',
                fontWeight: '700',
              }}
            >
              {totalDocumentsCount} Live Documents
            </span>
          </div>
          <p style={{ color: 'var(--admin-muted)', fontSize: '0.92rem', margin: '0.35rem 0 0 0' }}>
            Upload documents, set custom document titles, and choose sections to display live on{' '}
            <a
              href="https://www.theconnplex.com/investors"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: 'var(--admin-gold)', textDecoration: 'underline', fontWeight: '600' }}
            >
              theconnplex.com/investors
            </a>
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <button
            type="button"
            onClick={() => openUploadModal()}
            className="admin-btn admin-btn-primary"
            style={{
              background: 'var(--admin-gold)',
              color: '#000',
              fontSize: '0.92rem',
              fontWeight: '700',
              padding: '0.7rem 1.5rem',
              borderRadius: '8px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              cursor: 'pointer',
              border: 'none',
            }}
          >
            <span style={{ fontSize: '1.1rem' }}>📤</span> Upload Document
          </button>

          <Link
            href="/admin/investors/add"
            className="admin-btn admin-btn-outline"
            style={{
              fontSize: '0.88rem',
              fontWeight: '600',
              padding: '0.65rem 1.25rem',
              borderRadius: '8px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
            }}
          >
            <span>➕</span> Add New Section
          </Link>
        </div>
      </div>

      {/* Floating Feedback Notification */}
      {feedbackMsg && (
        <div
          style={{
            background: feedbackMsg.type === 'success' ? '#f0fdf4' : '#fee2e2',
            color: feedbackMsg.type === 'success' ? '#166534' : '#991b1b',
            border: `1px solid ${feedbackMsg.type === 'success' ? '#86efac' : '#fecaca'}`,
            padding: '0.85rem 1.25rem',
            borderRadius: '8px',
            marginBottom: '1.5rem',
            fontSize: '0.92rem',
            fontWeight: '600',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
          }}
        >
          <div>{feedbackMsg.text}</div>
          <button
            type="button"
            onClick={() => setFeedbackMsg(null)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1rem' }}
          >
            ✕
          </button>
        </div>
      )}

      {/* Filter and View Controls Bar */}
      <div
        className="admin-card"
        style={{
          padding: '1rem 1.25rem',
          marginBottom: '1.5rem',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '1rem',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Left: Search input */}
        <div style={{ flex: '1', minWidth: '260px' }}>
          <input
            type="search"
            className="admin-search"
            placeholder="🔍 Search documents by title, filename, or section…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: '100%',
              padding: '0.6rem 1rem',
              borderRadius: '8px',
              border: '1px solid var(--admin-border)',
              fontSize: '0.9rem',
            }}
          />
        </div>

        {/* Center: Category Filter Pills */}
        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', alignItems: 'center' }}>
          {[
            { label: 'All Sections', value: 'All' },
            { label: '📢 Announcements', value: 'Announcements' },
            { label: '📊 Standalone', value: 'Standalone' },
            { label: '📜 Policies', value: 'Policies' },
            { label: '👥 Committees', value: 'Committees' },
            { label: '📈 IPO', value: 'Initial Public Offer' },
          ].map((cat) => {
            const active = selectedCategoryFilter === cat.value;
            return (
              <button
                key={cat.value}
                type="button"
                onClick={() => setSelectedCategoryFilter(cat.value)}
                style={{
                  background: active ? '#1e293b' : '#f1f5f9',
                  color: active ? '#fff' : '#475569',
                  border: 'none',
                  borderRadius: '20px',
                  padding: '0.35rem 0.85rem',
                  fontSize: '0.82rem',
                  fontWeight: active ? '700' : '500',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Right: View Mode Toggle */}
        <div
          style={{
            display: 'flex',
            background: '#e2e8f0',
            padding: '3px',
            borderRadius: '8px',
          }}
        >
          <button
            type="button"
            onClick={() => setViewMode('sections')}
            style={{
              border: 'none',
              background: viewMode === 'sections' ? '#fff' : 'transparent',
              color: viewMode === 'sections' ? '#0f172a' : '#64748b',
              fontWeight: viewMode === 'sections' ? '700' : '500',
              borderRadius: '6px',
              padding: '0.35rem 0.8rem',
              fontSize: '0.82rem',
              cursor: 'pointer',
              boxShadow: viewMode === 'sections' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
            }}
          >
            📁 Sections View
          </button>
          <button
            type="button"
            onClick={() => setViewMode('documents')}
            style={{
              border: 'none',
              background: viewMode === 'documents' ? '#fff' : 'transparent',
              color: viewMode === 'documents' ? '#0f172a' : '#64748b',
              fontWeight: viewMode === 'documents' ? '700' : '500',
              borderRadius: '6px',
              padding: '0.35rem 0.8rem',
              fontSize: '0.82rem',
              cursor: 'pointer',
              boxShadow: viewMode === 'documents' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
            }}
          >
            📄 All Documents ({totalDocumentsCount})
          </button>
        </div>
      </div>

      {/* Main View Area */}
      {loading ? (
        <div className="admin-card" style={{ padding: '4rem 2rem', textAlign: 'center', color: 'var(--admin-muted)' }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>⏳</div>
          <div style={{ fontSize: '1rem', fontWeight: '600' }}>Loading investor sections and live documents…</div>
        </div>
      ) : viewMode === 'documents' ? (
        /* FLAT ALL DOCUMENTS VIEW */
        <div className="admin-card admin-table-wrap" style={{ padding: '0' }}>
          <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--admin-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h2 style={{ fontSize: '1.15rem', fontWeight: '700', margin: 0 }}>
                📄 All Uploaded Documents ({allDocuments.length})
              </h2>
              <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.82rem', color: 'var(--admin-muted)' }}>
                Sorted by most recently added. Edit document names or delete files directly.
              </p>
            </div>
            <button
              type="button"
              onClick={() => openUploadModal()}
              style={{
                background: 'var(--admin-gold)',
                color: '#000',
                border: 'none',
                borderRadius: '6px',
                padding: '0.4rem 0.9rem',
                fontSize: '0.82rem',
                fontWeight: '700',
                cursor: 'pointer',
              }}
            >
              ➕ Upload Document
            </button>
          </div>

          {allDocuments.length === 0 ? (
            <div style={{ padding: '3.5rem', textAlign: 'center', color: 'var(--admin-muted)' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>📭</div>
              <p style={{ fontWeight: '600', fontSize: '1rem', margin: 0 }}>No documents match your search criteria</p>
            </div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th style={{ width: '4%' }}>#</th>
                  <th style={{ width: '36%' }}>Document Name (Shown on Website)</th>
                  <th style={{ width: '18%' }}>Target Section</th>
                  <th style={{ width: '14%' }}>Category</th>
                  <th style={{ width: '10%' }}>Size</th>
                  <th style={{ width: '18%', textAlign: 'center' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {allDocuments.map((item, idx) => {
                  const displayTitle = item.file.title || item.file.originalName.replace(/\.pdf$/i, '').replace(/\.mp3$/i, '');
                  return (
                    <tr key={`${item.sectionId}-${item.file.id}`} style={{ borderBottom: '1px solid var(--admin-border)' }}>
                      <td style={{ fontWeight: '600', color: 'var(--admin-gold)' }}>{idx + 1}</td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span style={{ fontSize: '1.1rem' }}>
                            {item.file.mimeType?.startsWith('audio/') || item.file.originalName.endsWith('.mp3') ? '🎵' : '📄'}
                          </span>
                          <div>
                            <div style={{ fontWeight: '700', fontSize: '0.92rem', color: '#0f172a' }}>
                              {displayTitle}
                            </div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--admin-muted)' }}>
                              File: {item.file.originalName}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td style={{ fontWeight: '600', color: '#1e293b' }}>
                        {item.sectionTitle}
                      </td>
                      <td>
                        <span
                          style={{
                            display: 'inline-block',
                            padding: '0.2rem 0.6rem',
                            borderRadius: '4px',
                            background: item.category === 'Standalone' ? '#f3f4f6' : '#eff6ff',
                            color: item.category === 'Standalone' ? '#475569' : '#1e40af',
                            fontSize: '0.8rem',
                            fontWeight: '600',
                          }}
                        >
                          {item.category}
                        </span>
                      </td>
                      <td style={{ fontSize: '0.82rem', color: 'var(--admin-muted)' }}>
                        {formatFileSize(item.file.size)}
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'center' }}>
                          <button
                            type="button"
                            onClick={() => openRenameModal(item.sectionId, item.sectionTitle, item.file)}
                            title="Edit document name"
                            style={{
                              background: '#eff6ff',
                              border: '1px solid #bfdbfe',
                              color: '#1d4ed8',
                              padding: '0.35rem 0.65rem',
                              borderRadius: '6px',
                              fontSize: '0.8rem',
                              fontWeight: '600',
                              cursor: 'pointer',
                            }}
                          >
                            ✏️ Rename
                          </button>
                          <a
                            href={item.file.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              background: '#f1f5f9',
                              border: '1px solid #cbd5e1',
                              color: '#0f172a',
                              padding: '0.35rem 0.65rem',
                              borderRadius: '6px',
                              fontSize: '0.8rem',
                              fontWeight: '600',
                              textDecoration: 'none',
                              display: 'inline-flex',
                              alignItems: 'center',
                            }}
                          >
                            👁️ View
                          </a>
                          <button
                            type="button"
                            onClick={() =>
                              handleDeleteDocument(item.sectionId, item.sectionTitle, item.file.id, displayTitle)
                            }
                            title="Delete document"
                            style={{
                              background: '#fee2e2',
                              border: '1px solid #fecaca',
                              color: '#dc2626',
                              padding: '0.35rem 0.55rem',
                              borderRadius: '6px',
                              fontSize: '0.8rem',
                              fontWeight: '600',
                              cursor: 'pointer',
                            }}
                          >
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      ) : (
        /* GROUPED SECTIONS VIEW */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 0.25rem' }}>
            <span style={{ fontSize: '0.88rem', color: 'var(--admin-muted)' }}>
              Showing {filteredInvestors.length} active investor sections
            </span>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                type="button"
                onClick={expandAll}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--admin-gold)',
                  fontSize: '0.82rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  textDecoration: 'underline',
                }}
              >
                Expand All Documents
              </button>
              <span style={{ color: '#cbd5e1' }}>•</span>
              <button
                type="button"
                onClick={collapseAll}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--admin-muted)',
                  fontSize: '0.82rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  textDecoration: 'underline',
                }}
              >
                Collapse All
              </button>
            </div>
          </div>

          {filteredInvestors.length === 0 ? (
            <div className="admin-card" style={{ padding: '3.5rem', textAlign: 'center', color: 'var(--admin-muted)' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>📭</div>
              <p style={{ fontWeight: '600', fontSize: '1rem', margin: '0 0 0.5rem 0' }}>
                No investor sections match your filter
              </p>
              <button
                type="button"
                onClick={() => openUploadModal()}
                className="admin-btn admin-btn-primary"
                style={{ background: 'var(--admin-gold)', color: '#000', marginTop: '0.5rem' }}
              >
                📤 Upload to a Section
              </button>
            </div>
          ) : (
            filteredInvestors.map((investor) => {
              const isExpanded = !!expandedSections[investor.id];
              const fileCount = investor.files?.length || 0;

              return (
                <div
                  key={investor.id}
                  className="admin-card"
                  style={{
                    padding: '0',
                    overflow: 'hidden',
                    border: '1px solid var(--admin-border)',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                  }}
                >
                  {/* Section Summary Header Row */}
                  <div
                    style={{
                      padding: '1rem 1.25rem',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      gap: '0.75rem',
                      background: isExpanded ? '#f8fafc' : '#fff',
                      borderBottom: isExpanded ? '1px solid #e2e8f0' : 'none',
                      transition: 'background 0.15s ease',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                      <button
                        type="button"
                        onClick={() => toggleSectionExpand(investor.id)}
                        style={{
                          background: 'none',
                          border: 'none',
                          fontSize: '1rem',
                          cursor: 'pointer',
                          color: '#475569',
                          padding: '0.2rem',
                          display: 'flex',
                          alignItems: 'center',
                        }}
                      >
                        {isExpanded ? '▼' : '▶'}
                      </button>

                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                          <span style={{ fontWeight: '800', fontSize: '1.05rem', color: '#0f172a' }}>
                            {investor.title}
                          </span>
                          {investor.parent ? (
                            <span
                              style={{
                                padding: '0.15rem 0.5rem',
                                borderRadius: '4px',
                                background: '#eff6ff',
                                color: '#1e40af',
                                fontSize: '0.75rem',
                                fontWeight: '600',
                              }}
                            >
                              📂 {investor.parent}
                            </span>
                          ) : (
                            <span
                              style={{
                                padding: '0.15rem 0.5rem',
                                borderRadius: '4px',
                                background: '#f3f4f6',
                                color: '#4b5563',
                                fontSize: '0.75rem',
                                fontWeight: '600',
                              }}
                            >
                              📌 Standalone
                            </span>
                          )}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--admin-muted)', marginTop: '0.15rem' }}>
                          Last updated: {formatDate(investor.updatedAt)}
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                      {/* Document count badge */}
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.3rem',
                          padding: '0.3rem 0.75rem',
                          borderRadius: '20px',
                          fontSize: '0.82rem',
                          fontWeight: '700',
                          background: fileCount > 0 ? '#f0fdf4' : '#f3f4f6',
                          color: fileCount > 0 ? '#166534' : 'var(--admin-muted)',
                          border: `1px solid ${fileCount > 0 ? '#bbf7d0' : '#e5e7eb'}`,
                        }}
                      >
                        📄 {fileCount} {fileCount === 1 ? 'document' : 'documents'}
                      </span>

                      {/* Quick Upload directly to this section */}
                      <button
                        type="button"
                        onClick={() => openUploadModal(investor.title)}
                        style={{
                          background: 'var(--admin-gold)',
                          color: '#000',
                          border: 'none',
                          borderRadius: '6px',
                          padding: '0.4rem 0.85rem',
                          fontSize: '0.82rem',
                          fontWeight: '700',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                        }}
                      >
                        <span>📤</span> Add Doc
                      </button>

                      {/* Toggle files view */}
                      <button
                        type="button"
                        onClick={() => toggleSectionExpand(investor.id)}
                        style={{
                          background: '#f1f5f9',
                          border: '1px solid #cbd5e1',
                          color: '#334155',
                          borderRadius: '6px',
                          padding: '0.4rem 0.8rem',
                          fontSize: '0.82rem',
                          fontWeight: '600',
                          cursor: 'pointer',
                        }}
                      >
                        {isExpanded ? 'Hide Files' : 'View Files'}
                      </button>

                      {/* Edit section link */}
                      <Link
                        href={`/admin/investors/edit/${investor.id}`}
                        title="Edit section details"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: '32px',
                          height: '32px',
                          borderRadius: '6px',
                          border: '1px solid var(--admin-border)',
                          background: '#fff',
                          color: 'var(--admin-gold)',
                          textDecoration: 'none',
                          fontSize: '0.9rem',
                        }}
                      >
                        ✏️
                      </Link>

                      {/* Delete section */}
                      <button
                        type="button"
                        onClick={() => handleDeleteSection(investor.id, investor.title)}
                        title="Delete entire section"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: '32px',
                          height: '32px',
                          borderRadius: '6px',
                          border: '1px solid #fecaca',
                          background: '#fff',
                          color: '#dc2626',
                          cursor: 'pointer',
                          fontSize: '0.9rem',
                        }}
                      >
                        🗑️
                      </button>
                    </div>
                  </div>

                  {/* Expanded Documents List inside section */}
                  {isExpanded && (
                    <div style={{ background: '#f8fafc', padding: '1rem 1.25rem' }}>
                      {fileCount === 0 ? (
                        <div
                          style={{
                            padding: '1.75rem',
                            textAlign: 'center',
                            background: '#fff',
                            border: '1px dashed #cbd5e1',
                            borderRadius: '8px',
                          }}
                        >
                          <p style={{ margin: '0 0 0.75rem 0', color: 'var(--admin-muted)', fontSize: '0.9rem' }}>
                            No documents have been uploaded to this section yet.
                          </p>
                          <button
                            type="button"
                            onClick={() => openUploadModal(investor.title)}
                            style={{
                              background: 'var(--admin-gold)',
                              color: '#000',
                              border: 'none',
                              borderRadius: '6px',
                              padding: '0.45rem 1rem',
                              fontSize: '0.85rem',
                              fontWeight: '700',
                              cursor: 'pointer',
                            }}
                          >
                            📤 Upload First Document
                          </button>
                        </div>
                      ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                            <span style={{ fontSize: '0.8rem', fontWeight: '700', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                              Documents Visible on Website in this Section
                            </span>
                            <button
                              type="button"
                              onClick={() => openUploadModal(investor.title)}
                              style={{
                                background: 'none',
                                border: 'none',
                                color: '#2563eb',
                                fontSize: '0.8rem',
                                fontWeight: '700',
                                cursor: 'pointer',
                                textDecoration: 'underline',
                              }}
                            >
                              + Upload Another Document
                            </button>
                          </div>

                          {investor.files.map((file, fIdx) => {
                            const docTitle =
                              file.title ||
                              file.originalName.replace(/\.pdf$/i, '').replace(/\.mp3$/i, '');
                            const isAudio =
                              file.mimeType?.startsWith('audio/') || file.originalName.endsWith('.mp3');

                            return (
                              <div
                                key={file.id || fIdx}
                                style={{
                                  background: '#fff',
                                  border: '1px solid #e2e8f0',
                                  borderRadius: '8px',
                                  padding: '0.75rem 1rem',
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                  alignItems: 'center',
                                  flexWrap: 'wrap',
                                  gap: '0.75rem',
                                }}
                              >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flex: 1, minWidth: '260px' }}>
                                  <span style={{ fontSize: '1.25rem' }}>{isAudio ? '🎵' : '📄'}</span>
                                  <div style={{ minWidth: 0, flex: 1 }}>
                                    <div style={{ fontWeight: '700', fontSize: '0.92rem', color: '#0f172a' }}>
                                      {docTitle}
                                    </div>
                                    <div style={{ fontSize: '0.76rem', color: 'var(--admin-muted)', marginTop: '0.1rem' }}>
                                      Filename: {file.originalName} • {formatFileSize(file.size)}
                                    </div>
                                  </div>
                                </div>

                                <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                                  {/* Rename Document Button */}
                                  <button
                                    type="button"
                                    onClick={() => openRenameModal(investor.id, investor.title, file)}
                                    style={{
                                      background: '#eff6ff',
                                      border: '1px solid #bfdbfe',
                                      color: '#1d4ed8',
                                      padding: '0.35rem 0.75rem',
                                      borderRadius: '6px',
                                      fontSize: '0.8rem',
                                      fontWeight: '600',
                                      cursor: 'pointer',
                                      display: 'inline-flex',
                                      alignItems: 'center',
                                      gap: '0.3rem',
                                    }}
                                  >
                                    ✏️ Rename Title
                                  </button>

                                  {/* Preview File */}
                                  <a
                                    href={file.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{
                                      background: '#f1f5f9',
                                      border: '1px solid #cbd5e1',
                                      color: '#0f172a',
                                      padding: '0.35rem 0.75rem',
                                      borderRadius: '6px',
                                      fontSize: '0.8rem',
                                      fontWeight: '600',
                                      textDecoration: 'none',
                                      display: 'inline-flex',
                                      alignItems: 'center',
                                      gap: '0.3rem',
                                    }}
                                  >
                                    👁️ Preview
                                  </a>

                                  {/* Delete File */}
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleDeleteDocument(investor.id, investor.title, file.id, docTitle)
                                    }
                                    style={{
                                      background: '#fee2e2',
                                      border: '1px solid #fecaca',
                                      color: '#dc2626',
                                      padding: '0.35rem 0.65rem',
                                      borderRadius: '6px',
                                      fontSize: '0.8rem',
                                      fontWeight: '600',
                                      cursor: 'pointer',
                                    }}
                                  >
                                    🗑️ Delete
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}

      {/* QUICK UPLOAD DOCUMENT MODAL */}
      {isUploadModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.65)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '1rem',
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget && !uploading) setIsUploadModalOpen(false);
          }}
        >
          <div
            className="admin-card"
            style={{
              width: '100%',
              maxWidth: '650px',
              maxHeight: '90vh',
              overflowY: 'auto',
              borderRadius: '14px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
              padding: '1.75rem',
              position: 'relative',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid var(--admin-border)', paddingBottom: '0.75rem' }}>
              <div>
                <h2 style={{ fontSize: '1.35rem', fontWeight: '800', margin: 0, color: '#0f172a' }}>
                  📤 Upload Document to Investor Section
                </h2>
                <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.85rem', color: 'var(--admin-muted)' }}>
                  Name your document and select which section it belongs to
                </p>
              </div>
              <button
                type="button"
                onClick={() => !uploading && setIsUploadModalOpen(false)}
                disabled={uploading}
                style={{
                  background: '#f1f5f9',
                  border: 'none',
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  color: '#475569',
                }}
              >
                ✕
              </button>
            </div>

            {uploadError && (
              <div
                style={{
                  background: '#fee2e2',
                  color: '#991b1b',
                  border: '1px solid #fecaca',
                  padding: '0.75rem 1rem',
                  borderRadius: '8px',
                  fontSize: '0.88rem',
                  marginBottom: '1.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}
              >
                <span>⚠️</span> <span>{uploadError}</span>
              </div>
            )}

            <form onSubmit={handleQuickUploadSubmit}>
              {/* 1. Choose Section */}
              <div className="admin-form-group" style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', fontWeight: '700', fontSize: '0.92rem', marginBottom: '0.4rem', color: '#1e293b' }}>
                  1. Target Section on Website<span style={{ color: '#dc2626' }}>*</span>
                </label>

                {!isCustomSection ? (
                  <>
                    <select
                      className="admin-select"
                      value={uploadSectionTitle}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val === '__custom__') {
                          setIsCustomSection(true);
                        } else {
                          setUploadSectionTitle(val);
                          const matched = ALL_PREDEFINED_SECTIONS.find(
                            (s) => s.title.toLowerCase() === val.toLowerCase()
                          );
                          setUploadSectionCategory(matched?.parent || '');
                        }
                      }}
                      style={{ width: '100%', fontWeight: '600' }}
                      required
                    >
                      {INVESTOR_SECTION_GROUPS.map((group) => (
                        <optgroup key={group.category} label={`${group.icon} ${group.category}`}>
                          {group.sections.map((sec) => (
                            <option key={sec.title} value={sec.title}>
                              {sec.title} {sec.parent ? `(${sec.parent})` : '(Standalone)'}
                            </option>
                          ))}
                        </optgroup>
                      ))}
                      <option value="__custom__">➕ + Add New Custom Section…</option>
                    </select>
                  </>
                ) : (
                  <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '0.75rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <span style={{ fontSize: '0.82rem', fontWeight: '700', color: '#1e293b' }}>
                        Custom Section Details:
                      </span>
                      <button
                        type="button"
                        onClick={() => setIsCustomSection(false)}
                        style={{ background: 'none', border: 'none', color: '#2563eb', fontSize: '0.8rem', cursor: 'pointer', textDecoration: 'underline' }}
                      >
                        Choose from standard sections instead
                      </button>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                      <div>
                        <label style={{ fontSize: '0.78rem', fontWeight: '600', color: '#475569', display: 'block', marginBottom: '0.2rem' }}>
                          Section Title *
                        </label>
                        <input
                          type="text"
                          className="admin-input"
                          value={customSectionName}
                          onChange={(e) => setCustomSectionName(e.target.value)}
                          placeholder="e.g. Credit Ratings"
                          required={isCustomSection}
                          style={{ width: '100%', fontSize: '0.88rem' }}
                        />
                      </div>
                      <div>
                        <label style={{ fontSize: '0.78rem', fontWeight: '600', color: '#475569', display: 'block', marginBottom: '0.2rem' }}>
                          Parent Category
                        </label>
                        <select
                          className="admin-select"
                          value={customSectionCategory}
                          onChange={(e) => setCustomSectionCategory(e.target.value)}
                          style={{ width: '100%', fontSize: '0.88rem' }}
                        >
                          <option value="">None (Standalone)</option>
                          <option value="Announcements">Announcements</option>
                          <option value="Policies">Policies</option>
                          <option value="Committees">Committees</option>
                          <option value="Initial Public Offer">Initial Public Offer</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* 2. Drag & Drop File Zone */}
              <div className="admin-form-group" style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', fontWeight: '700', fontSize: '0.92rem', marginBottom: '0.4rem', color: '#1e293b' }}>
                  2. Select Document File (PDF / Audio)<span style={{ color: '#dc2626' }}>*</span>
                </label>

                <div
                  className={`admin-upload-zone ${uploadDragOver ? 'dragover' : ''}`}
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setUploadDragOver(true);
                  }}
                  onDragLeave={() => setUploadDragOver(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setUploadDragOver(false);
                    if (e.dataTransfer.files.length) {
                      handleFileSelected(e.dataTransfer.files[0]);
                    }
                  }}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && fileInputRef.current?.click()}
                  style={{
                    border: uploadDragOver ? '2px dashed var(--admin-gold)' : '2px dashed #cbd5e1',
                    borderRadius: '10px',
                    padding: uploadFile ? '1rem 1.25rem' : '1.75rem 1rem',
                    textAlign: 'center',
                    cursor: 'pointer',
                    background: uploadDragOver ? '#fffbeb' : uploadFile ? '#f0fdf4' : '#fafafa',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {uploadFile ? (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }}>
                      <span style={{ fontSize: '1.75rem' }}>📄</span>
                      <div style={{ textAlign: 'left' }}>
                        <div style={{ fontWeight: '700', fontSize: '0.95rem', color: '#166534' }}>
                          {uploadFile.name}
                        </div>
                        <div style={{ fontSize: '0.78rem', color: '#15803d' }}>
                          {formatFileSize(uploadFile.size)} • Click to change file
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div style={{ fontSize: '2rem', marginBottom: '0.35rem' }}>📎</div>
                      <div style={{ fontWeight: '600', fontSize: '0.95rem', color: '#1e293b' }}>
                        Click to browse or drop file here
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--admin-muted)', marginTop: '0.2rem' }}>
                        PDF (.pdf) or Audio (.mp3, .wav) files up to 50MB
                      </div>
                    </div>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,application/pdf,audio/*,.mp3,.wav,.m4a"
                    onChange={(e) => {
                      if (e.currentTarget.files && e.currentTarget.files[0]) {
                        handleFileSelected(e.currentTarget.files[0]);
                      }
                    }}
                    style={{ display: 'none' }}
                  />
                </div>
              </div>

              {/* 3. Document Name / Title */}
              <div className="admin-form-group" style={{ marginBottom: '1.75rem' }}>
                <label style={{ display: 'block', fontWeight: '700', fontSize: '0.92rem', marginBottom: '0.4rem', color: '#1e293b' }}>
                  3. Document Name / Title (will be visible on website)<span style={{ color: '#dc2626' }}>*</span>
                </label>
                <input
                  type="text"
                  className="admin-input"
                  value={uploadDocumentTitle}
                  onChange={(e) => setUploadDocumentTitle(e.target.value)}
                  placeholder="e.g. Outcome of Board Meeting - 04.11.2026"
                  required
                  style={{ width: '100%', fontSize: '0.95rem', fontWeight: '600' }}
                />
                <p style={{ margin: '0.35rem 0 0 0', fontSize: '0.78rem', color: 'var(--admin-muted)' }}>
                  This title is displayed on <strong>https://www.theconnplex.com/investors</strong> for visitors to read and download.
                </p>
              </div>

              {/* Modal Buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', borderTop: '1px solid var(--admin-border)', paddingTop: '1rem' }}>
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  disabled={uploading}
                  className="admin-btn admin-btn-outline"
                  style={{ padding: '0.6rem 1.25rem', fontWeight: '600' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading || !uploadFile}
                  className="admin-btn admin-btn-primary"
                  style={{
                    background: uploading || !uploadFile ? '#cbd5e1' : 'var(--admin-gold)',
                    color: '#000',
                    fontWeight: '700',
                    padding: '0.65rem 1.75rem',
                    borderRadius: '8px',
                    border: 'none',
                    cursor: uploading || !uploadFile ? 'not-allowed' : 'pointer',
                  }}
                >
                  {uploading ? '⏳ Uploading…' : '🚀 Upload Document Now'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* RENAME DOCUMENT MODAL */}
      {renameModalData && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.65)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '1rem',
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget && !renaming) setRenameModalData(null);
          }}
        >
          <div
            className="admin-card"
            style={{
              width: '100%',
              maxWidth: '520px',
              borderRadius: '12px',
              padding: '1.5rem',
              boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
            }}
          >
            <h3 style={{ fontSize: '1.25rem', fontWeight: '800', margin: '0 0 0.35rem 0', color: '#0f172a' }}>
              ✏️ Rename Document Title
            </h3>
            <p style={{ margin: '0 0 1.25rem 0', fontSize: '0.85rem', color: 'var(--admin-muted)' }}>
              Section: <strong>{renameModalData.sectionTitle}</strong>
            </p>

            <form onSubmit={handleRenameSubmit}>
              <div className="admin-form-group" style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', fontWeight: '600', fontSize: '0.88rem', marginBottom: '0.35rem' }}>
                  Document Name / Title (shown on website):
                </label>
                <input
                  type="text"
                  className="admin-input"
                  value={newDocumentTitle}
                  onChange={(e) => setNewDocumentTitle(e.target.value)}
                  placeholder="Enter clean title"
                  required
                  style={{ width: '100%', fontSize: '0.92rem', fontWeight: '600' }}
                  autoFocus
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button
                  type="button"
                  onClick={() => setRenameModalData(null)}
                  disabled={renaming}
                  className="admin-btn admin-btn-outline"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={renaming || !newDocumentTitle.trim()}
                  className="admin-btn admin-btn-primary"
                  style={{
                    background: 'var(--admin-gold)',
                    color: '#000',
                    fontWeight: '700',
                    border: 'none',
                    padding: '0.55rem 1.4rem',
                    borderRadius: '6px',
                  }}
                >
                  {renaming ? 'Saving…' : 'Save Title'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
