'use client';

import { useState, useEffect, useCallback } from 'react';

interface Application {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  position: string;
  experience?: string;
  coverLetter?: string;
  cvUrl?: string;
  status?: string;
  notes?: string;
  createdAt: string;
  updatedAt?: string;
}

const STATUS_OPTIONS = ['New', 'In Review', 'Shortlisted', 'Interviewing', 'Hired', 'Rejected'];

const STATUS_COLORS: Record<string, { bg: string; color: string; border: string }> = {
  New: { bg: '#eff6ff', color: '#1d4ed8', border: '#bfdbfe' },
  'In Review': { bg: '#fffbeb', color: '#b45309', border: '#fde68a' },
  Shortlisted: { bg: '#f0fdf4', color: '#15803d', border: '#bbf7d0' },
  Interviewing: { bg: '#faf5ff', color: '#7e22ce', border: '#e9d5ff' },
  Hired: { bg: '#ecfdf5', color: '#047857', border: '#a7f3d0' },
  Rejected: { bg: '#fef2f2', color: '#b91c1c', border: '#fecaca' },
};

export default function CareerApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [search, setSearch] = useState('');
  const [selectedPosition, setSelectedPosition] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [stats, setStats] = useState({
    total: 0,
    new: 0,
    inReview: 0,
    shortlisted: 0,
    hired: 0,
    rejected: 0,
    positions: [] as string[],
  });
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [hrNotes, setHrNotes] = useState('');
  const [savingNotes, setSavingNotes] = useState(false);
  const [actionMessage, setActionMessage] = useState('');

  const loadApplications = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: '15',
        search,
        position: selectedPosition,
        status: selectedStatus,
      });

      const res = await fetch(`/api/admin/careers?${params}`);
      if (res.ok) {
        const data = await res.json();
        setApplications(data.applications || []);
        setTotal(data.total || 0);
        setPages(data.pages || 1);
        if (data.stats) {
          setStats(data.stats);
        }
      }
    } catch (err) {
      console.error('Failed to load applications:', err);
    } finally {
      setLoading(false);
    }
  }, [page, search, selectedPosition, selectedStatus]);

  useEffect(() => {
    setPage(1);
  }, [search, selectedPosition, selectedStatus]);

  useEffect(() => {
    loadApplications();
  }, [loadApplications]);

  // Update Status
  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const res = await fetch('/api/admin/careers', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus }),
      });

      if (res.ok) {
        setApplications((prev) =>
          prev.map((app) => (app._id === id ? { ...app, status: newStatus } : app))
        );
        if (selectedApp && selectedApp._id === id) {
          setSelectedApp({ ...selectedApp, status: newStatus });
        }
        setActionMessage(`Status updated to "${newStatus}"`);
        setTimeout(() => setActionMessage(''), 3000);
      }
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  // Save HR Notes
  const handleSaveNotes = async () => {
    if (!selectedApp) return;
    setSavingNotes(true);
    try {
      const res = await fetch('/api/admin/careers', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: selectedApp._id, notes: hrNotes }),
      });

      if (res.ok) {
        setSelectedApp({ ...selectedApp, notes: hrNotes });
        setApplications((prev) =>
          prev.map((app) => (app._id === selectedApp._id ? { ...app, notes: hrNotes } : app))
        );
        setActionMessage('HR notes saved successfully');
        setTimeout(() => setActionMessage(''), 3000);
      }
    } catch (err) {
      console.error('Failed to save notes:', err);
    } finally {
      setSavingNotes(false);
    }
  };

  // Delete Application
  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete the application for ${name}?`)) return;

    try {
      const res = await fetch(`/api/admin/careers?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        if (selectedApp?._id === id) setSelectedApp(null);
        loadApplications();
        setActionMessage('Application deleted successfully');
        setTimeout(() => setActionMessage(''), 3000);
      }
    } catch (err) {
      console.error('Failed to delete application:', err);
    }
  };

  // Open Details Modal
  const openDetails = (app: Application) => {
    setSelectedApp(app);
    setHrNotes(app.notes || '');
  };

  // Export to CSV
  const handleExportCSV = () => {
    if (applications.length === 0) {
      alert('No applications to export.');
      return;
    }

    const headers = ['Full Name', 'Email', 'Phone', 'Position', 'Department', 'Status', 'Date', 'Cover Letter', 'CV File'];
    const rows = applications.map((app) => [
      `"${app.fullName || ''}"`,
      `"${app.email || ''}"`,
      `"${app.phone || ''}"`,
      `"${app.position || ''}"`,
      `"${app.experience || ''}"`,
      `"${app.status || 'New'}"`,
      `"${new Date(app.createdAt).toLocaleDateString()}"`,
      `"${(app.coverLetter || '').replace(/"/g, '""')}"`,
      `"${app.cvUrl || ''}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `connplex-career-applications-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getInitials = (name: string) => {
    if (!name) return 'HR';
    const parts = name.trim().split(' ');
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  return (
    <>
      {/* Header */}
      <div className="admin-page-header">
        <div>
          <h1>Career Applications</h1>
          <p style={{ margin: '0.25rem 0 0', fontSize: '0.85rem', color: 'var(--admin-muted)' }}>
            HR Portal • Review and manage incoming candidate job applications
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <button type="button" className="admin-btn admin-btn-outline" onClick={handleExportCSV}>
            <i className="fa-solid fa-file-csv" /> Export CSV
          </button>
          <button type="button" className="admin-btn admin-btn-outline" onClick={loadApplications}>
            <i className="fa-solid fa-rotate" /> Refresh
          </button>
        </div>
      </div>

      {actionMessage && (
        <div
          style={{
            background: '#ecfdf5',
            border: '1px solid #a7f3d0',
            color: '#065f46',
            padding: '0.65rem 1rem',
            borderRadius: '6px',
            fontSize: '0.85rem',
            marginBottom: '1rem',
          }}
        >
          ✓ {actionMessage}
        </div>
      )}

      {/* Metrics Row */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
          marginBottom: '1.5rem',
        }}
      >
        <div className="admin-card" style={{ padding: '1.25rem 1.5rem' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--admin-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Total Applications
          </span>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.4rem' }}>
            <span style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--admin-text)' }}>
              {stats.total}
            </span>
            <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(193, 155, 98, 0.15)', color: 'var(--admin-gold)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <i className="fa-solid fa-users" />
            </div>
          </div>
        </div>

        <div className="admin-card" style={{ padding: '1.25rem 1.5rem' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--admin-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            New / Unreviewed
          </span>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.4rem' }}>
            <span style={{ fontSize: '1.75rem', fontWeight: 700, color: '#1d4ed8' }}>
              {stats.new}
            </span>
            <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#eff6ff', color: '#1d4ed8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <i className="fa-solid fa-sparkles" />
            </div>
          </div>
        </div>

        <div className="admin-card" style={{ padding: '1.25rem 1.5rem' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--admin-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            In Review / Pipeline
          </span>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.4rem' }}>
            <span style={{ fontSize: '1.75rem', fontWeight: 700, color: '#b45309' }}>
              {stats.inReview}
            </span>
            <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#fffbeb', color: '#b45309', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <i className="fa-solid fa-hourglass-half" />
            </div>
          </div>
        </div>

        <div className="admin-card" style={{ padding: '1.25rem 1.5rem' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--admin-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Shortlisted Candidates
          </span>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.4rem' }}>
            <span style={{ fontSize: '1.75rem', fontWeight: 700, color: '#15803d' }}>
              {stats.shortlisted}
            </span>
            <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#f0fdf4', color: '#15803d', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <i className="fa-solid fa-star" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters & Search Toolbar */}
      <div
        className="admin-card"
        style={{
          marginBottom: '1.5rem',
          padding: '1.25rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
        }}
      >
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: '1 1 240px' }}>
            <i
              className="fa-solid fa-magnifying-glass"
              style={{
                position: 'absolute',
                left: '0.85rem',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--admin-muted)',
                fontSize: '0.85rem',
              }}
            />
            <input
              type="search"
              className="admin-search"
              placeholder="Search by candidate name, email, phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ width: '100%', paddingLeft: '2.3rem' }}
            />
          </div>

          <div style={{ flex: '0 0 auto' }}>
            <select
              className="admin-search"
              value={selectedPosition}
              onChange={(e) => setSelectedPosition(e.target.value)}
              style={{ minWidth: '220px' }}
            >
              <option value="all">All Positions</option>
              <option value="Legal Executive">Legal Executive</option>
              <option value="IT Executive">IT Executive</option>
              <option value="Junior Architect">Junior Architect</option>
              <option value="Senior Architect">Senior Architect</option>
              {stats.positions
                ?.filter(
                  (p) =>
                    !['Legal Executive', 'IT Executive', 'Junior Architect', 'Senior Architect'].includes(p)
                )
                .map((pos) => (
                  <option key={pos} value={pos}>
                    {pos}
                  </option>
                ))}
            </select>
          </div>

          <span style={{ fontSize: '0.85rem', color: 'var(--admin-muted)', marginLeft: 'auto' }}>
            Found <strong style={{ color: 'var(--admin-text)' }}>{total}</strong> applications
          </span>
        </div>

        {/* Status Pills */}
        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', borderTop: '1px solid var(--admin-border)', paddingTop: '0.75rem' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--admin-muted)', alignSelf: 'center', marginRight: '0.4rem' }}>
            Status:
          </span>
          {['all', ...STATUS_OPTIONS].map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setSelectedStatus(st)}
              style={{
                background: selectedStatus === st ? '#18181b' : '#f4f4f5',
                color: selectedStatus === st ? '#fff' : '#52525b',
                border: '1px solid',
                borderColor: selectedStatus === st ? '#18181b' : '#e4e4e7',
                padding: '0.3rem 0.75rem',
                borderRadius: '999px',
                fontSize: '0.75rem',
                fontWeight: 600,
                cursor: 'pointer',
                textTransform: 'capitalize',
                transition: 'all 0.15s ease',
              }}
            >
              {st === 'all' ? 'All Applications' : st}
            </button>
          ))}
        </div>
      </div>

      {/* Applications Table */}
      <div className="admin-card admin-table-wrap">
        {loading ? (
          <p className="admin-empty">Loading applications…</p>
        ) : applications.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
            <div style={{ fontSize: '2.5rem', color: '#d4d4d8', marginBottom: '0.75rem' }}>
              <i className="fa-solid fa-folder-open" />
            </div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--admin-text)' }}>No Applications Found</h3>
            <p style={{ color: 'var(--admin-muted)', fontSize: '0.85rem', maxWidth: '400px', margin: '0.35rem auto 1rem' }}>
              {search || selectedPosition !== 'all' || selectedStatus !== 'all'
                ? 'Try adjusting your search filters or status options to find candidate applications.'
                : 'Candidates who apply through the website careers page will automatically appear here.'}
            </p>
          </div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Candidate</th>
                <th>Position Applied</th>
                <th>Resume / CV</th>
                <th>Applied Date</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((app) => {
                const currentStatus = app.status || 'New';
                const styleObj = STATUS_COLORS[currentStatus] || STATUS_COLORS['New'];
                return (
                  <tr key={app._id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div
                          style={{
                            width: 36,
                            height: 36,
                            borderRadius: '50%',
                            background: '#e4e4e7',
                            color: '#27272a',
                            fontWeight: 700,
                            fontSize: '0.75rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                          }}
                        >
                          {getInitials(app.fullName)}
                        </div>
                        <div>
                          <strong
                            style={{
                              display: 'block',
                              color: 'var(--admin-text)',
                              fontSize: '0.88rem',
                              cursor: 'pointer',
                            }}
                            onClick={() => openDetails(app)}
                          >
                            {app.fullName}
                          </strong>
                          <div style={{ display: 'flex', gap: '0.6rem', fontSize: '0.75rem', color: 'var(--admin-muted)' }}>
                            <a
                              href={`mailto:${app.email}`}
                              style={{ color: 'inherit', textDecoration: 'none' }}
                              onClick={(e) => e.stopPropagation()}
                            >
                              <i className="fa-solid fa-envelope" style={{ marginRight: '0.25rem' }} />
                              {app.email}
                            </a>
                            <span>•</span>
                            <a
                              href={`tel:${app.phone}`}
                              style={{ color: 'inherit', textDecoration: 'none' }}
                              onClick={(e) => e.stopPropagation()}
                            >
                              <i className="fa-solid fa-phone" style={{ marginRight: '0.25rem' }} />
                              {app.phone}
                            </a>
                          </div>
                        </div>
                      </div>
                    </td>

                    <td>
                      <span
                        style={{
                          display: 'inline-block',
                          padding: '0.2rem 0.6rem',
                          background: 'rgba(193, 155, 98, 0.12)',
                          color: '#926c2e',
                          borderRadius: '4px',
                          fontSize: '0.78rem',
                          fontWeight: 600,
                          border: '1px solid rgba(193, 155, 98, 0.3)',
                        }}
                      >
                        {app.position || 'General Application'}
                      </span>
                      {app.experience && (
                        <span style={{ display: 'block', fontSize: '0.72rem', color: 'var(--admin-muted)', marginTop: '0.2rem' }}>
                          Dept: {app.experience}
                        </span>
                      )}
                    </td>

                    <td>
                      {app.cvUrl ? (
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.35rem',
                            padding: '0.25rem 0.5rem',
                            background: '#f4f4f5',
                            border: '1px solid #e4e4e7',
                            borderRadius: '4px',
                            fontSize: '0.76rem',
                            color: '#3f3f46',
                            maxWidth: '180px',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                          title={app.cvUrl}
                        >
                          <i className="fa-regular fa-file-pdf" style={{ color: '#dc2626' }} />
                          {app.cvUrl}
                        </span>
                      ) : (
                        <span style={{ color: 'var(--admin-muted)', fontSize: '0.75rem' }}>No file</span>
                      )}
                    </td>

                    <td>
                      <span style={{ fontSize: '0.8rem', color: 'var(--admin-text)' }}>
                        {new Date(app.createdAt).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                      <span style={{ display: 'block', fontSize: '0.7rem', color: 'var(--admin-muted)' }}>
                        {new Date(app.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </td>

                    <td>
                      <select
                        value={currentStatus}
                        onChange={(e) => handleStatusChange(app._id, e.target.value)}
                        style={{
                          background: styleObj.bg,
                          color: styleObj.color,
                          border: `1px solid ${styleObj.border}`,
                          padding: '0.3rem 0.6rem',
                          borderRadius: '6px',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          outline: 'none',
                        }}
                      >
                        {STATUS_OPTIONS.map((st) => (
                          <option key={st} value={st}>
                            {st}
                          </option>
                        ))}
                      </select>
                    </td>

                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '0.4rem', justifyContent: 'flex-end' }}>
                        <button
                          type="button"
                          className="admin-btn admin-btn-outline"
                          style={{ padding: '0.35rem 0.65rem', fontSize: '0.76rem' }}
                          onClick={() => openDetails(app)}
                        >
                          <i className="fa-solid fa-eye" /> View
                        </button>
                        <button
                          type="button"
                          className="admin-btn admin-btn-danger"
                          style={{ padding: '0.35rem 0.65rem', fontSize: '0.76rem' }}
                          onClick={() => handleDelete(app._id, app.fullName)}
                          title="Delete application"
                        >
                          <i className="fa-solid fa-trash" />
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

      {/* Pagination */}
      {pages > 1 && (
        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1.25rem', justifyContent: 'flex-end', alignItems: 'center' }}>
          <button
            type="button"
            className="admin-btn admin-btn-outline"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            ← Prev
          </button>
          <span style={{ fontSize: '0.85rem', color: 'var(--admin-muted)' }}>
            Page {page} of {pages}
          </span>
          <button
            type="button"
            className="admin-btn admin-btn-outline"
            onClick={() => setPage((p) => Math.min(pages, p + 1))}
            disabled={page === pages}
          >
            Next →
          </button>
        </div>
      )}

      {/* Candidate Details Modal */}
      {selectedApp && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.65)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem',
            zIndex: 9999,
          }}
          onClick={() => setSelectedApp(null)}
        >
          <div
            style={{
              background: '#fff',
              borderRadius: '12px',
              maxWidth: '680px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div
              style={{
                padding: '1.5rem 2rem',
                borderBottom: '1px solid #e4e4e7',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: '50%',
                    background: 'var(--admin-gold)',
                    color: '#000',
                    fontWeight: 700,
                    fontSize: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {getInitials(selectedApp.fullName)}
                </div>
                <div>
                  <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0, color: '#18181b' }}>
                    {selectedApp.fullName}
                  </h2>
                  <span
                    style={{
                      display: 'inline-block',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      color: 'var(--admin-gold)',
                      marginTop: '0.2rem',
                    }}
                  >
                    Applied for: {selectedApp.position}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedApp(null)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  fontSize: '1.5rem',
                  lineHeight: 1,
                  cursor: 'pointer',
                  color: '#71717a',
                }}
              >
                &times;
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '1.75rem 2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {/* Status and Action bar */}
              <div
                style={{
                  background: '#f4f4f5',
                  padding: '1rem 1.25rem',
                  borderRadius: '8px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '0.75rem',
                }}
              >
                <div>
                  <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--admin-muted)', display: 'block' }}>
                    Application Status
                  </span>
                  <select
                    value={selectedApp.status || 'New'}
                    onChange={(e) => handleStatusChange(selectedApp._id, e.target.value)}
                    style={{
                      marginTop: '0.25rem',
                      padding: '0.35rem 0.75rem',
                      borderRadius: '6px',
                      fontWeight: 700,
                      fontSize: '0.82rem',
                      cursor: 'pointer',
                    }}
                  >
                    {STATUS_OPTIONS.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <a
                    href={`mailto:${selectedApp.email}?subject=Application for ${selectedApp.position} at Connplex Cinemas`}
                    className="admin-btn admin-btn-primary"
                    style={{ fontSize: '0.78rem', textDecoration: 'none' }}
                  >
                    <i className="fa-solid fa-envelope" /> Email Candidate
                  </a>
                  <a
                    href={`tel:${selectedApp.phone}`}
                    className="admin-btn admin-btn-outline"
                    style={{ fontSize: '0.78rem', textDecoration: 'none' }}
                  >
                    <i className="fa-solid fa-phone" /> Call
                  </a>
                </div>
              </div>

              {/* Candidate Info Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--admin-muted)' }}>Email Address</span>
                  <p style={{ margin: '0.2rem 0 0', fontSize: '0.88rem', fontWeight: 500, color: '#18181b' }}>{selectedApp.email}</p>
                </div>
                <div>
                  <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--admin-muted)' }}>Phone Number</span>
                  <p style={{ margin: '0.2rem 0 0', fontSize: '0.88rem', fontWeight: 500, color: '#18181b' }}>{selectedApp.phone}</p>
                </div>
                <div>
                  <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--admin-muted)' }}>Department / Pref</span>
                  <p style={{ margin: '0.2rem 0 0', fontSize: '0.88rem', fontWeight: 500, color: '#18181b' }}>{selectedApp.experience || '—'}</p>
                </div>
                <div>
                  <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--admin-muted)' }}>Applied Date</span>
                  <p style={{ margin: '0.2rem 0 0', fontSize: '0.88rem', fontWeight: 500, color: '#18181b' }}>
                    {new Date(selectedApp.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Resume / Attachment */}
              <div>
                <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--admin-muted)', display: 'block', marginBottom: '0.4rem' }}>
                  Resume / CV Uploaded
                </span>
                {selectedApp.cvUrl ? (
                  <div
                    style={{
                      background: '#fafafa',
                      border: '1px solid #e4e4e7',
                      borderRadius: '8px',
                      padding: '0.75rem 1rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                    }}
                  >
                    <i className="fa-solid fa-file-lines" style={{ color: 'var(--admin-gold)', fontSize: '1.5rem' }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ margin: 0, fontSize: '0.88rem', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {selectedApp.cvUrl}
                      </p>
                      <span style={{ fontSize: '0.75rem', color: 'var(--admin-muted)' }}>Attached with application</span>
                    </div>
                  </div>
                ) : (
                  <p style={{ color: 'var(--admin-muted)', fontSize: '0.85rem', margin: 0 }}>No CV file name was provided.</p>
                )}
              </div>

              {/* Cover Letter / Why Connplex */}
              <div>
                <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--admin-muted)', display: 'block', marginBottom: '0.4rem' }}>
                  Why do you want to join Connplex? / Cover Note
                </span>
                <div
                  style={{
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    padding: '1rem',
                    fontSize: '0.88rem',
                    lineHeight: 1.6,
                    color: '#334155',
                    whiteSpace: 'pre-wrap',
                  }}
                >
                  {selectedApp.coverLetter || 'No message provided.'}
                </div>
              </div>

              {/* Internal HR Notes */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                  <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--admin-muted)' }}>
                    Internal HR Notes
                  </span>
                  <span style={{ fontSize: '0.72rem', color: 'var(--admin-muted)' }}>Visible only to HR/Admin team</span>
                </div>
                <textarea
                  className="admin-input"
                  rows={3}
                  placeholder="Add evaluation notes, interview feedback, or salary expectations..."
                  value={hrNotes}
                  onChange={(e) => setHrNotes(e.target.value)}
                  style={{ width: '100%', marginBottom: '0.5rem', fontFamily: 'inherit' }}
                />
                <button
                  type="button"
                  className="admin-btn admin-btn-outline"
                  onClick={handleSaveNotes}
                  disabled={savingNotes}
                  style={{ fontSize: '0.78rem' }}
                >
                  {savingNotes ? 'Saving note…' : 'Save HR Note'}
                </button>
              </div>
            </div>

            {/* Modal Footer */}
            <div
              style={{
                padding: '1rem 2rem',
                borderTop: '1px solid #e4e4e7',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                background: '#fafafa',
                borderRadius: '0 0 12px 12px',
              }}
            >
              <button
                type="button"
                className="admin-btn admin-btn-danger"
                onClick={() => handleDelete(selectedApp._id, selectedApp.fullName)}
              >
                Delete Application
              </button>
              <button
                type="button"
                className="admin-btn admin-btn-outline"
                onClick={() => setSelectedApp(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
