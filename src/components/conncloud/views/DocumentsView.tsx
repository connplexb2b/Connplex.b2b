import React, { useState } from 'react';
import { ConnCloudStore } from '../../../lib/conncloudData';

interface DocumentsViewProps {
  selectedCinemaId?: string;
  triggerNotification: (msg: string) => void;
}

export default function DocumentsView({ 
  selectedCinemaId = 'all', 
  triggerNotification 
}: DocumentsViewProps) {
  const isAhilyanagar = selectedCinemaId === 'c5';
  const [docs, setDocs] = useState(ConnCloudStore.getDocuments());
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [uploadForm, setUploadForm] = useState({ name: '', category: 'SOP' as any, permissions: 'All Managers' });
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [selectedVersionDoc, setSelectedVersionDoc] = useState<any | null>(null);

  const documentCategories = [
    'All',
    'Franchise Agreements',
    'Corporate Policies',
    'SOPs',
    'Legal Documents',
    'Finance Documents',
    'Training Materials',
    'Certificates',
    'Marketing Assets'
  ];

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadForm.name) return;

    const uploader = isAhilyanagar ? 'Vikram Shinde (GM / Partner, Ahilyanagar)' : 'Rakesh Patel';

    const newDoc = ConnCloudStore.addDocument({
      name: uploadForm.name.endsWith('.pdf') ? uploadForm.name : `${uploadForm.name}.pdf`,
      category: uploadForm.category,
      version: 'V1.0',
      uploadedBy: uploader,
      expiryDate: '2028-12-31',
      permissions: [uploadForm.permissions]
    });

    setDocs(prev => [newDoc, ...prev]);
    triggerNotification(`Document "${uploadForm.name}" uploaded successfully.`);
    setUploadForm({ name: '', category: 'SOP', permissions: 'All Managers' });
    setIsUploadOpen(false);
  };

  const filteredDocs = docs.filter(d => {
    const matchesSearch = Boolean(d?.name?.toLowerCase().includes(search.toLowerCase())) || 
      Boolean(d?.category?.toLowerCase().includes(search.toLowerCase())) ||
      Boolean(d?.uploadedBy?.toLowerCase().includes(search.toLowerCase()));
    
    const matchesCategory = categoryFilter === 'All' || 
      d.category.toLowerCase().includes(categoryFilter.toLowerCase().slice(0, 4));

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      {isAhilyanagar && (
        <div className="p-4 rounded-xl bg-gradient-to-r from-blue-900/30 via-indigo-900/15 to-transparent border border-blue-500/30 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
          <div className="flex items-start md:items-center gap-3">
            <span className="relative flex h-3 w-3 mt-0.5 md:mt-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
            </span>
            <div>
              <span className="font-bold text-blue-300 uppercase tracking-wider text-[11px] block">
                Ahilyanagar Document &amp; Statutory Vault
              </span>
              <span className="text-gray-300 text-[11px]">
                Authorized Document Repository for Connplex Ahilyanagar • Sync Guides, Municipal Licenses, Fire NOCs, and Franchise Agreements
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 self-start md:self-auto font-mono text-[11px] text-blue-400 bg-blue-950/60 px-2.5 py-1 rounded border border-blue-500/30">
            <span>AUDIT VERIFIED</span>
          </div>
        </div>
      )}

      {/* Categories Horizontal Filter */}
      <section className="flex flex-wrap gap-1 bg-[#111827] border border-white/5 p-2 rounded-xl">
        {documentCategories.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategoryFilter(cat)}
            className={`px-3 py-1.5 rounded text-xs font-semibold transition-all ${
              categoryFilter === cat 
                ? 'bg-blue-600 text-white shadow shadow-blue-600/10' 
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            {cat}
          </button>
        ))}
      </section>

      <div className="cc-card">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="relative w-full sm:w-60">
            <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xs"></i>
            <input 
              type="text" 
              className="cc-input pl-9 w-full text-xs" 
              placeholder="Search documents..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button onClick={() => setIsUploadOpen(true)} className="cc-btn cc-btn-primary text-xs flex items-center gap-1.5">
            <i className="fa-solid fa-cloud-arrow-up"></i> Upload Document
          </button>
        </div>

        <div className="space-y-3">
          {filteredDocs.map((doc) => (
            <div key={doc.documentId} className="p-3.5 rounded bg-black/20 border border-white/5 hover:border-white/10 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="space-y-1">
                <div className="flex items-center gap-2.5">
                  <i className="fa-solid fa-file-pdf text-red-400 text-base"></i>
                  <span className="font-bold text-white text-sm">{doc.name}</span>
                  <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-white/5 text-gray-400 border border-white/10">
                    {doc.version}
                  </span>
                </div>
                <div className="text-[11px] text-gray-400 pl-6">
                  Category: <strong>{doc.category}</strong> • Uploaded by: {doc.uploadedBy} • Permissions: {doc.permissions?.join(', ') || 'All Managers'}
                </div>
              </div>
              
              <div className="flex items-center gap-2 self-end sm:self-auto">
                <button 
                  onClick={() => setSelectedVersionDoc(doc)}
                  className="px-2.5 py-1 rounded bg-white/5 hover:bg-white/10 text-gray-300 text-[11px]"
                >
                  Version History
                </button>
                <button 
                  onClick={() => triggerNotification(`Downloading document: ${doc.name}`)}
                  className="cc-btn cc-btn-outline py-1 px-3 text-[11px] flex items-center gap-1"
                >
                  <i className="fa-solid fa-download"></i> Download
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Version History Modal */}
      {selectedVersionDoc && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-[#111827] border border-white/10 rounded-xl w-full max-w-md p-5 space-y-4">
            <div className="flex justify-between items-center border-b border-white/10 pb-3">
              <div>
                <h4 className="font-bold text-white text-sm">{selectedVersionDoc.name}</h4>
                <span className="text-gray-400 text-[10px]">Audit Document Version Register</span>
              </div>
              <button onClick={() => setSelectedVersionDoc(null)} className="text-gray-400 hover:text-white">&times;</button>
            </div>
            <div className="space-y-3 text-xs">
              <div className="p-3 bg-black/25 rounded border border-white/5 flex justify-between items-center">
                <div>
                  <strong className="text-white">Version 1.0 (Current)</strong>
                  <span className="text-gray-400 text-[10px] block mt-0.5">Uploaded on 2026-08-15 by {selectedVersionDoc.uploadedBy}</span>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/10 text-emerald-400 font-bold">Active</span>
              </div>
              <div className="p-3 bg-black/25 rounded border border-white/5 flex justify-between items-center opacity-60">
                <div>
                  <strong className="text-gray-300">Version 0.9 (Draft)</strong>
                  <span className="text-gray-500 text-[10px] block mt-0.5">Initial draft uploaded on 2026-08-01</span>
                </div>
                <span className="text-[10px] text-gray-500">Archived</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Upload Modal */}
      {isUploadOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-[#111827] border border-white/10 rounded-xl w-full max-w-sm overflow-hidden">
            <div className="p-4 border-b border-white/5 flex justify-between items-center">
              <h3 className="font-bold text-sm uppercase tracking-wider text-gray-300">Upload Corporate Asset</h3>
              <button onClick={() => setIsUploadOpen(false)} className="text-gray-400 hover:text-white">
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
            <form onSubmit={handleUpload} className="p-6 space-y-4 text-xs">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase font-bold text-gray-400">Document Name (PDF)</label>
                <input 
                  type="text" 
                  className="cc-input" 
                  placeholder="e.g. fire_safety_audit_2026.pdf"
                  value={uploadForm.name}
                  onChange={(e) => setUploadForm(prev => ({ ...prev, name: e.target.value }))}
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase font-bold text-gray-400">Category Tag</label>
                <select 
                  className="cc-input"
                  value={uploadForm.category}
                  onChange={(e) => setUploadForm(prev => ({ ...prev, category: e.target.value as any }))}
                >
                  <option value="Agreement">Franchise Agreement</option>
                  <option value="Policy">Corporate Policy</option>
                  <option value="SOP">Standard Operations SOP</option>
                  <option value="Legal">Legal Documents</option>
                  <option value="Finance">Finance Documents</option>
                  <option value="Training">Training Materials</option>
                  <option value="Certificates">Certificates &amp; Licenses</option>
                  <option value="Marketing">Marketing Assets</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase font-bold text-gray-400">Access Permissions</label>
                <select 
                  className="cc-input"
                  value={uploadForm.permissions}
                  onChange={(e) => setUploadForm(prev => ({ ...prev, permissions: e.target.value }))}
                >
                  <option value="All Managers">All Managers</option>
                  <option value="Franchise Owner Only">Franchise Owner Only</option>
                  <option value="Corporate Only">Corporate Only</option>
                  <option value="Public Staff">Public Staff</option>
                </select>
              </div>

              <button type="submit" className="w-full cc-btn cc-btn-primary py-2 font-bold mt-2">
                Submit File Upload
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
