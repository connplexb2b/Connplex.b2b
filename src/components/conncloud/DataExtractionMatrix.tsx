'use client';

import React, { useState, useMemo } from 'react';
import { 
  EXTRACTION_CATEGORIES_SPEC, 
  ExtractionCategorySpec, 
  ExtractionFeatureItem 
} from '@/lib/dataExtractionEngine';

interface DataExtractionMatrixProps {
  selectedCinemaId?: string;
  selectedDateRange?: string;
  onNotification?: (msg: string) => void;
}

export default function DataExtractionMatrix({
  selectedCinemaId = 'c5',
  selectedDateRange = 'Month-to-Date',
  onNotification
}: DataExtractionMatrixProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sourceFilter, setSourceFilter] = useState('all');
  const [expandedSno, setExpandedSno] = useState<number | null>(null);
  const [inspectModalCategory, setInspectModalCategory] = useState<ExtractionCategorySpec | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<string>(() => new Date().toLocaleTimeString());

  const notify = (msg: string) => {
    if (onNotification) onNotification(msg);
  };

  const isAhilyanagar = selectedCinemaId === 'c5';

  // Filtered categories
  const filteredCategories = useMemo(() => {
    return EXTRACTION_CATEGORIES_SPEC.filter(cat => {
      const sourceMatch = sourceFilter === 'all' || 
        Boolean(cat?.sourceSummary?.toLowerCase().includes(sourceFilter.toLowerCase())) ||
        Boolean(cat?.features?.some(f => f?.dataSource?.toLowerCase().includes(sourceFilter.toLowerCase())));

      const searchMatch = searchQuery === '' ||
        Boolean(cat?.category?.toLowerCase().includes(searchQuery.toLowerCase())) ||
        Boolean(cat?.features?.some(f => f?.name?.toLowerCase().includes(searchQuery.toLowerCase())));

      return sourceMatch && searchMatch;
    });
  }, [sourceFilter, searchQuery]);

  // Total features mapped
  const totalFeatures = useMemo(() => {
    return EXTRACTION_CATEGORIES_SPEC.reduce((sum, c) => sum + c.features.length, 0);
  }, []);

  // Trigger sync simulation
  const handleSyncAll = () => {
    setIsSyncing(true);
    notify('Initiating data extraction pipeline across all 21 categories...');
    setTimeout(() => {
      setIsSyncing(false);
      setLastSyncTime(new Date().toLocaleTimeString());
      notify('All 21 categories successfully synchronized with Vista & Data Services.');
    }, 1200);
  };

  // Export to CSV
  const handleExportCsv = () => {
    notify('Exporting 21-Category Ingestion Matrix to CSV...');
    let csv = 'Sno,Category,Feature/KPI,Data Source,Fetching From,Extraction Mechanism\n';
    EXTRACTION_CATEGORIES_SPEC.forEach(cat => {
      cat.features.forEach(f => {
        csv += `"${cat.sno}","${cat.category}","${f.name}","${f.dataSource}","${f.fetchingFrom}","${f.extractionMechanism.replace(/"/g, '""')}"\n`;
      });
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Connplex_21_Categories_Extraction_Matrix_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-amber-950/40 via-[#111827] to-blue-950/30 border border-amber-500/30">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/40">
                Data Extraction & Ingestion Engine
              </span>
              <span className="text-xs text-emerald-400 flex items-center gap-1 font-mono">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                21 / 21 Modules Mapped
              </span>
            </div>
            <h2 className="text-2xl font-black text-white mt-2 font-display tracking-wide">
              Master Data Extraction Matrix
            </h2>
            <p className="text-xs text-gray-400 mt-1 max-w-2xl">
              Authoritative ingestion specification mapping each feature and KPI to its verified source (Vista POS, Vista WebService, Calculation Engine, Admin Portal, Google Reviews API, and Attendance Software).
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={handleSyncAll}
              disabled={isSyncing}
              className="cc-btn cc-btn-primary flex items-center gap-2 text-xs py-2 px-4 shadow-lg shadow-amber-500/10"
            >
              <i className={`fa-solid fa-arrows-rotate ${isSyncing ? 'animate-spin' : ''}`}></i>
              <span>{isSyncing ? 'Extracting Feeds...' : 'Sync All 21 Categories'}</span>
            </button>
            <button
              onClick={handleExportCsv}
              className="cc-btn cc-btn-outline flex items-center gap-2 text-xs py-2 px-3.5"
            >
              <i className="fa-solid fa-file-csv text-emerald-400"></i>
              <span>Export CSV Matrix</span>
            </button>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-5 pt-5 border-t border-white/10">
          <div className="p-3 rounded-xl bg-black/30 border border-white/5">
            <span className="text-[10px] uppercase text-gray-400 tracking-wider block">Total Categories</span>
            <span className="text-xl font-bold text-white font-mono mt-0.5 block">21 Categories</span>
          </div>
          <div className="p-3 rounded-xl bg-black/30 border border-white/5">
            <span className="text-[10px] uppercase text-gray-400 tracking-wider block">Total Features & KPIs</span>
            <span className="text-xl font-bold text-[#f5b041] font-mono mt-0.5 block">{totalFeatures} Features</span>
          </div>
          <div className="p-3 rounded-xl bg-black/30 border border-white/5">
            <span className="text-[10px] uppercase text-gray-400 tracking-wider block">Primary Data Feeds</span>
            <span className="text-xl font-bold text-blue-400 font-mono mt-0.5 block">Vista POS & ASMX</span>
          </div>
          <div className="p-3 rounded-xl bg-black/30 border border-white/5">
            <span className="text-[10px] uppercase text-gray-400 tracking-wider block">Last Pipeline Extract</span>
            <span className="text-xl font-bold text-emerald-400 font-mono mt-0.5 block">{lastSyncTime}</span>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[#111827] border border-white/5 p-3 rounded-xl">
        <div className="relative flex-1">
          <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 text-xs"></i>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search category, KPI, or feature name (e.g. Occupancy, ATP, GST, SPH)..."
            className="w-full bg-black/40 border border-white/10 rounded-lg pl-9 pr-4 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-amber-500/50"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400 whitespace-nowrap">Filter Source:</span>
          <select
            value={sourceFilter}
            onChange={(e) => setSourceFilter(e.target.value)}
            className="bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500/50"
          >
            <option value="all">All Sources (21)</option>
            <option value="vista">Vista / Vista POS</option>
            <option value="calculation">Calculation Engine</option>
            <option value="admin">Admin Login</option>
            <option value="franchisee">Franchisee Login</option>
            <option value="google">Google Reviews</option>
            <option value="attendance">Attendance Software</option>
            <option value="website">Platform Website / Backend</option>
          </select>
        </div>
      </div>

      {/* 21-Category Matrix Table */}
      <div className="cc-card overflow-hidden p-0 border border-white/10">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#111827] border-b border-white/10 text-gray-400 font-semibold uppercase tracking-wider text-[10px]">
                <th className="py-3.5 px-4 w-12 text-center">Sno</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Mapped Features & KPIs</th>
                <th className="py-3.5 px-4">Data Source</th>
                <th className="py-3.5 px-4">Fetching From</th>
                <th className="py-3.5 px-4 text-center">Pipeline Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredCategories.map((cat) => {
                const isExpanded = expandedSno === cat.sno;
                return (
                  <React.Fragment key={cat.sno}>
                    <tr className={`hover:bg-white/[0.02] transition-colors ${isExpanded ? 'bg-white/[0.03]' : ''}`}>
                      <td className="py-3.5 px-4 font-mono font-bold text-center text-gray-400">
                        {cat.sno}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-white whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setExpandedSno(isExpanded ? null : cat.sno)}
                            className="text-gray-400 hover:text-amber-400"
                          >
                            <i className={`fa-solid ${isExpanded ? 'fa-chevron-down' : 'fa-chevron-right'} text-[10px]`}></i>
                          </button>
                          <span>{cat.category}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-white/5 border border-white/10 text-gray-300">
                            {cat.features.length} KPIs / Features
                          </span>
                          <span className="text-gray-400 text-[11px] truncate max-w-xs">
                            {cat.features.slice(0, 3).map(f => f.name.replace(/^> /, '')).join(', ')}
                            {cat.features.length > 3 && ` +${cat.features.length - 3} more`}
                          </span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-gray-300 whitespace-nowrap">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                          cat.sourceSummary.includes('Vista') 
                            ? 'bg-amber-500/10 text-amber-300 border border-amber-500/20' 
                            : (cat.sourceSummary.includes('Attendance')
                              ? 'bg-purple-500/10 text-purple-300 border border-purple-500/20'
                              : (cat.sourceSummary.includes('Google')
                                ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20'
                                : 'bg-blue-500/10 text-blue-300 border border-blue-500/20'))
                        }`}>
                          {cat.sourceSummary}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-gray-400 whitespace-nowrap font-mono text-[11px]">
                        {cat.fetchingOrigin}
                      </td>
                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider ${
                          cat.status === 'LIVE_API'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                            : (cat.status === 'SYNCED'
                              ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                              : 'bg-amber-500/20 text-amber-300 border border-amber-500/40')
                        }`}>
                          {cat.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setExpandedSno(isExpanded ? null : cat.sno)}
                            className="px-2.5 py-1 rounded text-[11px] bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10"
                            title="Toggle Feature Breakdown"
                          >
                            {isExpanded ? 'Collapse' : 'Details'}
                          </button>
                          <button
                            onClick={() => setInspectModalCategory(cat)}
                            className="px-2.5 py-1 rounded text-[11px] bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 flex items-center gap-1 font-semibold"
                            title="Inspect Extracted JSON Payload"
                          >
                            <i className="fa-solid fa-code text-[10px]"></i>
                            <span>Inspect Data</span>
                          </button>
                        </div>
                      </td>
                    </tr>

                    {/* Expanded Detail Rows */}
                    {isExpanded && (
                      <tr className="bg-black/40">
                        <td colSpan={7} className="p-4 pl-12 border-b border-white/10">
                          <div className="space-y-2">
                            <h4 className="text-[11px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                              <i className="fa-solid fa-layer-group"></i>
                              <span>Feature & Extraction Mechanism Breakdown for {cat.category}</span>
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                              {cat.features.map((f, idx) => (
                                <div key={idx} className="p-2.5 rounded bg-[#111827]/80 border border-white/5 space-y-1">
                                  <div className="flex justify-between items-start gap-2">
                                    <span className="font-bold text-white text-xs">{f.name}</span>
                                    <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-white/10 text-gray-300 shrink-0">
                                      {f.dataSource}
                                    </span>
                                  </div>
                                  <div className="text-[10px] text-gray-400 flex items-center gap-1 font-mono">
                                    <span className="text-gray-500">Origin:</span>
                                    <span className="text-blue-300">{f.fetchingFrom}</span>
                                  </div>
                                  <div className="text-[10px] text-amber-300/80 font-mono bg-black/30 p-1.5 rounded border border-white/5 truncate">
                                    {f.extractionMechanism}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Inspect Extracted Data Modal */}
      {inspectModalCategory && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#111827] border border-white/10 rounded-2xl max-w-3xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-white/10 flex justify-between items-center bg-black/40">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-amber-500/20 border border-amber-500/30 text-amber-400 flex items-center justify-center font-bold font-mono">
                  {inspectModalCategory.sno}
                </div>
                <div>
                  <h3 className="font-bold text-white text-base">
                    Category {inspectModalCategory.sno}: {inspectModalCategory.category}
                  </h3>
                  <p className="text-[11px] text-gray-400">
                    Live extracted payload for {isAhilyanagar ? 'Ahilyanagar (c5)' : 'Active Cinema'} • {selectedDateRange}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setInspectModalCategory(null)}
                className="text-gray-400 hover:text-white p-1 text-base"
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            <div className="p-5 overflow-y-auto space-y-4 flex-1 font-mono text-xs">
              <div className="flex flex-wrap gap-2 text-[11px]">
                <span className="px-2.5 py-1 rounded bg-black/40 border border-white/10 text-gray-300">
                  <span className="text-gray-500">Source:</span> {inspectModalCategory.sourceSummary}
                </span>
                <span className="px-2.5 py-1 rounded bg-black/40 border border-white/10 text-gray-300">
                  <span className="text-gray-500">Fetching:</span> {inspectModalCategory.fetchingOrigin}
                </span>
                <span className="px-2.5 py-1 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                  <span className="text-emerald-500">Status:</span> {inspectModalCategory.status}
                </span>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1 text-[11px] text-gray-400">
                  <span>Extracted JSON Payload:</span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(JSON.stringify(inspectModalCategory.extractData(selectedCinemaId, selectedDateRange), null, 2));
                      notify('JSON payload copied to clipboard.');
                    }}
                    className="text-[#f5b041] hover:underline flex items-center gap-1"
                  >
                    <i className="fa-solid fa-copy"></i>
                    <span>Copy JSON</span>
                  </button>
                </div>
                <pre className="p-4 rounded-xl bg-black/60 border border-white/10 text-emerald-400 overflow-x-auto text-[11px] leading-relaxed max-h-80">
                  {JSON.stringify(inspectModalCategory.extractData(selectedCinemaId, selectedDateRange), null, 2)}
                </pre>
              </div>

              <div className="pt-2 border-t border-white/10">
                <span className="text-[11px] font-bold text-gray-300 block mb-2">Mapped Feature Keys:</span>
                <div className="grid grid-cols-2 gap-1.5 text-[10px]">
                  {inspectModalCategory.features.map((f, i) => (
                    <div key={i} className="p-1.5 rounded bg-black/30 border border-white/5 flex justify-between">
                      <span className="text-gray-300 truncate">{f.name}</span>
                      <span className="text-amber-400 font-bold shrink-0">{f.fieldKey}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-white/10 bg-black/40 flex justify-end">
              <button
                onClick={() => setInspectModalCategory(null)}
                className="cc-btn cc-btn-outline text-xs px-4 py-1.5"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
