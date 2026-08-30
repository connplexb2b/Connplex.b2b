import React, { useState } from 'react';
import { ConnCloudStore } from '../../../lib/conncloudData';

interface DocumentsViewProps {
  triggerNotification: (msg: string) => void;
}

export default function DocumentsView({ triggerNotification }: DocumentsViewProps) {
  const [docs, setDocs] = useState(ConnCloudStore.getDocuments());
  const [search, setSearch] = useState('');
  const [uploadForm, setUploadForm] = useState({ name: '', category: 'SOP' as any });
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadForm.name) return;

    const newDoc = ConnCloudStore.addDocument({
      name: uploadForm.name.endsWith('.pdf') ? uploadForm.name : `${uploadForm.name}.pdf`,
      category: uploadForm.category,
      version: 'V1.0',
      uploadedBy: 'Rakesh Patel',
      expiryDate: '2028-12-31',
      permissions: ['All Managers']
    });

    setDocs(prev => [newDoc, ...prev]);
    triggerNotification(`Document "${uploadForm.name}" uploaded successfully.`);
    setUploadForm({ name: '', category: 'SOP' });
    setIsUploadOpen(false);
  };

  const filteredDocs = docs.filter(d => 
    d.name.toLowerCase().includes(search.toLowerCase()) || 
    d.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
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
        <button onClick={() => setIsUploadOpen(true)} className="cc-btn cc-btn-accent text-xs">
          <i className="fa-solid fa-cloud-arrow-up"></i> Upload Document
        </button>
      </div>

      <div className="space-y-4">
        {filteredDocs.map((doc) => (
          <div key={doc.documentId} className="p-4 rounded bg-black/20 border border-white/5 hover:border-white/10 transition-colors flex justify-between items-center text-xs">
            <div className="space-y-1">
              <div className="flex items-center gap-2.5">
                <i className="fa-solid fa-file-pdf text-red-400 text-lg"></i>
                <span className="font-bold text-white text-sm">{doc.name}</span>
              </div>
              <div className="text-[10px] text-gray-400 pl-7">Category: {doc.category} • Uploaded by: {doc.uploadedBy} • Expiry: {doc.expiryDate}</div>
            </div>
            
            <div className="flex items-center gap-3">
              <span className="font-mono text-gray-500 font-bold bg-white/5 px-2 py-0.5 rounded">{doc.version}</span>
              <button 
                onClick={() => triggerNotification(`Downloading document: ${doc.name}`)}
                className="cc-btn cc-btn-outline py-1 px-3 text-[10px]"
              >
                Download
              </button>
            </div>
          </div>
        ))}
      </div>

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
                  <option value="Legal">Legal Compliance</option>
                  <option value="Finance">Financial Audit</option>
                  <option value="Training">Training Modules</option>
                </select>
              </div>

              <button type="submit" className="w-full cc-btn cc-btn-accent text-blue-950 font-bold mt-4">
                Submit File Upload
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
