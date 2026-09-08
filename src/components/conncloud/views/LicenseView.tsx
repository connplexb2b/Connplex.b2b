import React, { useState } from 'react';
import { ConnCloudStore, CinemaLicense } from '../../../lib/conncloudData';

interface LicenseViewProps {
  selectedCinemaId: string;
  selectedDateRange: string;
  triggerNotification: (msg: string) => void;
}

export default function LicenseView({
  selectedCinemaId,
  selectedDateRange,
  triggerNotification
}: LicenseViewProps) {
  const [subSection, setSubSection] = useState<'registry' | 'renewals' | 'authorities'>('registry');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Store data
  const [licenses, setLicenses] = useState<CinemaLicense[]>(() => {
    return ConnCloudStore.getLicenses();
  });
  const cinemas = ConnCloudStore.getCinemas();

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [renewTarget, setRenewTarget] = useState<CinemaLicense | null>(null);
  const [newExpiryInput, setNewExpiryInput] = useState('');

  // Add License Form State
  const [form, setForm] = useState({
    cinemaId: selectedCinemaId === 'all' ? 'c1' : selectedCinemaId,
    licenseName: '',
    category: 'Cinematograph' as CinemaLicense['category'],
    licenseNumber: '',
    issuingAuthority: '',
    issueDate: '',
    expiryDate: '',
    officerInCharge: 'Rakesh Patel',
    feePaid: '25000'
  });

  const formatCurrency = (val: number) => {
    return `₹${val.toLocaleString('en-IN')}`;
  };

  // Helper: calculate days remaining until expiry
  const getDaysRemaining = (expiryStr: string) => {
    const today = new Date();
    const expiry = new Date(expiryStr);
    const diffTime = expiry.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  // Filtered licenses
  const filteredLicenses = licenses.filter(lic => {
    const cinemaMatch = selectedCinemaId === 'all' || lic.cinemaId === selectedCinemaId;
    const catMatch = categoryFilter === 'all' || lic.category === categoryFilter;
    const statusMatch = statusFilter === 'all' || lic.status === statusFilter;
    const searchMatch = lic.licenseName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        lic.licenseNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        lic.issuingAuthority.toLowerCase().includes(searchQuery.toLowerCase());
    return cinemaMatch && catMatch && statusMatch && searchMatch;
  });

  // KPI Calculations
  const totalLicensesCount = licenses.length;
  const validLicensesCount = licenses.filter(l => l.status === 'Valid').length;
  const expiringSoonCount = licenses.filter(l => l.status === 'Expiring Soon').length;
  const inRenewalCount = licenses.filter(l => l.status === 'In Renewal').length;
  const complianceScore = totalLicensesCount > 0 
    ? Math.round(((validLicensesCount + inRenewalCount) / totalLicensesCount) * 100) 
    : 100;

  // Handle Add License
  const handleAddLicense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.licenseName || !form.licenseNumber || !form.expiryDate) return;

    const newLic = ConnCloudStore.addLicense({
      cinemaId: form.cinemaId,
      licenseName: form.licenseName,
      category: form.category,
      licenseNumber: form.licenseNumber,
      issuingAuthority: form.issuingAuthority || 'Municipal Cinema Authority',
      issueDate: form.issueDate || new Date().toISOString().split('T')[0],
      expiryDate: form.expiryDate,
      renewalReminderDays: 45,
      status: 'Valid',
      documentUrl: '/docs/license_certificate.pdf',
      officerInCharge: form.officerInCharge,
      feePaid: parseFloat(form.feePaid) || 0
    });

    setLicenses(ConnCloudStore.getLicenses());
    setIsAddModalOpen(false);
    setForm({
      cinemaId: selectedCinemaId === 'all' ? 'c1' : selectedCinemaId,
      licenseName: '',
      category: 'Cinematograph',
      licenseNumber: '',
      issuingAuthority: '',
      issueDate: '',
      expiryDate: '',
      officerInCharge: 'Rakesh Patel',
      feePaid: '25000'
    });
    triggerNotification(`Registered statutory license: ${newLic.licenseName}`);
  };

  // Handle Renewal Submit
  const handleRenewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!renewTarget || !newExpiryInput) return;

    ConnCloudStore.renewLicense(renewTarget.licenseId, newExpiryInput);
    setLicenses(ConnCloudStore.getLicenses());
    setRenewTarget(null);
    setNewExpiryInput('');
    triggerNotification(`License ${renewTarget.licenseName} renewed successfully until ${newExpiryInput}!`);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <section className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[#111827] border border-white/5 p-6 rounded-xl">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase tracking-wide">
              <i className="fa-solid fa-certificate text-[10px]"></i>
              Statutory Compliance & Legal Governance
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
              {complianceScore}% Audit Ready
            </span>
          </div>
          <h1 className="text-2xl font-bold mt-2 tracking-tight text-white">License & Statutory Compliance</h1>
          <p className="text-xs text-gray-400 mt-1">
            Track Cinematograph permits, Fire Safety NOCs, FSSAI certifications, electrical clearances, and copyright performance royalties.
          </p>
        </div>

        <div className="flex gap-2.5">
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="cc-btn cc-btn-accent text-xs"
          >
            <i className="fa-solid fa-plus"></i> Register New License
          </button>
          <button 
            onClick={() => triggerNotification('Exporting All Certified Statutory Compliance Dossiers (ZIP)...')}
            className="cc-btn cc-btn-outline text-xs"
          >
            <i className="fa-solid fa-file-shield"></i> Download Dossiers
          </button>
        </div>
      </section>

      {/* KPI Stats */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="cc-card">
          <div className="flex justify-between items-center mb-1">
            <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Statutory Readiness</span>
            <i className="fa-solid fa-shield-check text-emerald-400 text-xs"></i>
          </div>
          <div className="text-xl font-bold text-emerald-400">{complianceScore}% Compliant</div>
          <div className="text-[10px] text-gray-400 mt-1">Zero non-compliance fines</div>
        </div>

        <div className="cc-card">
          <div className="flex justify-between items-center mb-1">
            <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Total Active Licenses</span>
            <i className="fa-solid fa-file-contract text-blue-400 text-xs"></i>
          </div>
          <div className="text-xl font-bold text-white">{totalLicensesCount} Certificates</div>
          <div className="text-[10px] text-gray-400 mt-1">Across 8 statutory departments</div>
        </div>

        <div className="cc-card">
          <div className="flex justify-between items-center mb-1">
            <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Expiring Soon</span>
            <i className="fa-solid fa-clock-rotate-left text-[#f5b041] text-xs"></i>
          </div>
          <div className={`text-xl font-bold ${expiringSoonCount > 0 ? 'text-[#f5b041]' : 'text-gray-400'}`}>
            {expiringSoonCount} Required Action
          </div>
          <div className="text-[10px] text-[#f5b041] mt-1">Within next 30 calendar days</div>
        </div>

        <div className="cc-card">
          <div className="flex justify-between items-center mb-1">
            <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">In Renewal Process</span>
            <i className="fa-solid fa-arrows-spin text-purple-400 text-xs"></i>
          </div>
          <div className="text-xl font-bold text-purple-400">{inRenewalCount} Pending Filing</div>
          <div className="text-[10px] text-gray-400 mt-1">Department inspection underway</div>
        </div>
      </section>

      {/* Tabs */}
      <section className="flex flex-wrap gap-1 bg-[#111827] border border-white/5 p-2 rounded-xl">
        <button
          onClick={() => setSubSection('registry')}
          className={`px-3 py-1.5 rounded text-xs font-semibold transition-all ${
            subSection === 'registry'
              ? 'bg-blue-600 text-white shadow shadow-blue-600/10'
              : 'text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <i className="fa-solid fa-stamp mr-1.5"></i> Licenses & Permits Registry
        </button>
        <button
          onClick={() => setSubSection('renewals')}
          className={`px-3 py-1.5 rounded text-xs font-semibold transition-all ${
            subSection === 'renewals'
              ? 'bg-blue-600 text-white shadow shadow-blue-600/10'
              : 'text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <i className="fa-solid fa-bell mr-1.5"></i> Renewal Alerts Queue
        </button>
        <button
          onClick={() => setSubSection('authorities')}
          className={`px-3 py-1.5 rounded text-xs font-semibold transition-all ${
            subSection === 'authorities'
              ? 'bg-blue-600 text-white shadow shadow-blue-600/10'
              : 'text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <i className="fa-solid fa-building-columns mr-1.5"></i> Issuing Authorities Directory
        </button>
      </section>

      {/* 1. REGISTRY TAB */}
      {subSection === 'registry' && (
        <div className="space-y-4">
          {/* Controls Bar */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-3 bg-[#111827]/60 p-3 rounded-lg border border-white/5">
            <div className="flex flex-wrap items-center gap-2">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="cc-input text-xs py-1.5"
              >
                <option value="all">All Categories</option>
                <option value="Cinematograph">Cinematograph (DM / Licensing)</option>
                <option value="Fire Safety">Fire Safety NOC</option>
                <option value="Food & Health (FSSAI)">Food Safety (FSSAI)</option>
                <option value="Copyright & Performance">Copyright & Performance (PPL / IPRS)</option>
                <option value="Electrical">Electrical Clearance</option>
                <option value="Structural">Structural Stability</option>
                <option value="Environmental / Pollution">Environmental / Pollution</option>
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="cc-input text-xs py-1.5"
              >
                <option value="all">All Statuses</option>
                <option value="Valid">Valid</option>
                <option value="Expiring Soon">Expiring Soon</option>
                <option value="In Renewal">In Renewal</option>
                <option value="Expired">Expired</option>
              </select>
            </div>

            <div className="relative w-full lg:w-72">
              <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xs"></i>
              <input
                type="text"
                placeholder="Search certificate or authority..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="cc-input pl-9 w-full text-xs"
              />
            </div>
          </div>

          {/* Licenses Table */}
          <div className="cc-card">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-white/10 text-gray-400">
                    <th className="pb-3 font-semibold">License Name & Classification</th>
                    <th className="pb-3 font-semibold">License No.</th>
                    <th className="pb-3 font-semibold">Cinema Unit</th>
                    <th className="pb-3 font-semibold">Issuing Regulatory Body</th>
                    <th className="pb-3 font-semibold">Valid Period</th>
                    <th className="pb-3 font-semibold text-center">Days Remaining</th>
                    <th className="pb-3 font-semibold text-center">Status</th>
                    <th className="pb-3 font-semibold text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLicenses.map((lic) => {
                    const cinemaName = cinemas.find(c => c.cinemaId === lic.cinemaId)?.name || 'All Locations';
                    const daysRemaining = getDaysRemaining(lic.expiryDate);
                    return (
                      <tr key={lic.licenseId} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                        <td className="py-3">
                          <div className="font-bold text-white flex items-center gap-2">
                            <i className="fa-solid fa-file-shield text-[#f5b041] text-xs"></i>
                            {lic.licenseName}
                          </div>
                          <div className="text-[10px] text-gray-400 pl-4">{lic.category} • Officer: {lic.officerInCharge}</div>
                        </td>
                        <td className="py-3 font-mono font-bold text-blue-400">{lic.licenseNumber}</td>
                        <td className="py-3 text-gray-300 font-medium">{cinemaName}</td>
                        <td className="py-3 text-gray-400 max-w-[220px] truncate">{lic.issuingAuthority}</td>
                        <td className="py-3 font-mono text-[11px] text-gray-300">
                          {lic.issueDate} → <strong className="text-white">{lic.expiryDate}</strong>
                        </td>
                        <td className="py-3 text-center">
                          <span className={`font-mono font-bold text-xs ${
                            daysRemaining <= 30 ? 'text-amber-400' : (daysRemaining <= 0 ? 'text-red-400' : 'text-emerald-400')
                          }`}>
                            {daysRemaining > 0 ? `${daysRemaining} days` : 'Expired'}
                          </span>
                        </td>
                        <td className="py-3 text-center">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            lic.status === 'Valid'
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : (lic.status === 'Expiring Soon'
                                  ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                                  : 'bg-purple-500/10 text-purple-400 border border-purple-500/20')
                          }`}>
                            {lic.status}
                          </span>
                        </td>
                        <td className="py-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => triggerNotification(`Downloading official attested copy of ${lic.licenseName}...`)}
                              className="text-gray-400 hover:text-white p-1 rounded hover:bg-white/5 transition-colors"
                              title="Download PDF Certificate"
                            >
                              <i className="fa-solid fa-download"></i>
                            </button>
                            <button
                              onClick={() => {
                                setRenewTarget(lic);
                                setNewExpiryInput('2027-12-31');
                              }}
                              className="px-2 py-0.5 rounded bg-blue-600/20 text-blue-400 hover:bg-blue-600/40 text-[10px] font-bold border border-blue-500/30"
                            >
                              Renew
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {filteredLicenses.length === 0 && (
              <div className="text-center py-10">
                <i className="fa-solid fa-file-circle-xmark text-3xl text-gray-600 mb-2"></i>
                <p className="text-sm text-gray-400">No licenses found matching your criteria.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 2. RENEWALS TAB */}
      {subSection === 'renewals' && (
        <div className="cc-card">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400">
                Upcoming License Expirations & Department Actions
              </h3>
              <p className="text-xs text-gray-500">Statutory certifications that mandate formal inspection or renewal submission within 60 days.</p>
            </div>
            <button 
              onClick={() => triggerNotification('Inspection liaison emails sent to respective cinema managers.')}
              className="cc-btn cc-btn-primary text-xs"
            >
              <i className="fa-solid fa-paper-plane mr-1"></i> Alert Compliance Officers
            </button>
          </div>

          <div className="space-y-3">
            {licenses.filter(l => l.status === 'Expiring Soon' || l.status === 'In Renewal').map((lic) => {
              const days = getDaysRemaining(lic.expiryDate);
              return (
                <div key={lic.licenseId} className="p-4 rounded-xl bg-black/30 border border-white/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                      <i className="fa-solid fa-triangle-exclamation"></i>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-sm">{lic.licenseName}</span>
                        <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-amber-500/20 text-amber-300">
                          {days} Days Remaining
                        </span>
                      </div>
                      <div className="text-xs text-gray-400 mt-0.5">
                        Authority: {lic.issuingAuthority} • Lic No: <span className="font-mono text-gray-300">{lic.licenseNumber}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => triggerNotification(`Filing renewal submission for ${lic.licenseName}...`)}
                      className="cc-btn cc-btn-accent py-1.5 px-3 text-xs"
                    >
                      <i className="fa-solid fa-upload mr-1"></i> Submit Filing
                    </button>
                    <button
                      onClick={() => {
                        setRenewTarget(lic);
                        setNewExpiryInput('2027-12-31');
                      }}
                      className="cc-btn cc-btn-outline py-1.5 px-3 text-xs"
                    >
                      Log Approval
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. AUTHORITIES DIRECTORY TAB */}
      {subSection === 'authorities' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { name: 'District Magistrate Office & Licensing Branch', role: 'Cinematograph Annual Exhibition License', contact: 'dm-cinema-cell@rajasthan.gov.in', renewalFreq: 'Annual', icon: 'fa-landmark text-blue-400' },
            { name: 'State Fire & Emergency Services', role: 'Screen & Common Area Fire NOC', contact: 'firenoc@rajfireservices.org', renewalFreq: 'Annual / Bi-annual', icon: 'fa-fire-extinguisher text-red-400' },
            { name: 'Food Safety and Standards Authority (FSSAI)', role: 'Cinema Food Counter & Central Kitchen', contact: 'compliance@fssai.gov.in', renewalFreq: 'Annual', icon: 'fa-utensils text-emerald-400' },
            { name: 'Phonographic Performance Limited (PPL)', role: 'Lobby & Pre-show Music Playback Rights', contact: 'cinemalicense@pplindia.org', renewalFreq: 'Annual Sync', icon: 'fa-music text-purple-400' },
            { name: 'Chief Electrical Inspectorate (CEA)', role: 'Substation & Standby DG Synchronizer Approval', contact: 'cei.power@state.gov.in', renewalFreq: '3-Year Term', icon: 'fa-bolt text-[#f5b041]' },
            { name: 'State Pollution Control Board (SPCB)', role: 'Consent to Operate (CTO) & DG Emission', contact: 'cto-cell@spcb.gov.in', renewalFreq: '2-Year Term', icon: 'fa-leaf text-green-400' }
          ].map((auth, idx) => (
            <div key={idx} className="cc-card p-4 space-y-2">
              <div className="flex items-center gap-2">
                <i className={`fa-solid ${auth.icon} text-sm`}></i>
                <h4 className="font-bold text-white text-xs">{auth.name}</h4>
              </div>
              <p className="text-[11px] text-gray-400">{auth.role}</p>
              <div className="pt-2 border-t border-white/5 space-y-1 text-[10px]">
                <div className="flex justify-between text-gray-500">
                  <span>Contact:</span>
                  <span className="text-gray-300 font-mono">{auth.contact}</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Frequency:</span>
                  <span className="text-white font-semibold">{auth.renewalFreq}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL: REGISTER NEW LICENSE */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-[#111827] border border-white/10 rounded-xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="p-4 border-b border-white/5 flex justify-between items-center bg-black/30">
              <h3 className="font-bold text-sm uppercase tracking-wider text-white flex items-center gap-2">
                <i className="fa-solid fa-certificate text-emerald-400"></i> Register Statutory Certificate
              </h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-gray-400 hover:text-white">
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            <form onSubmit={handleAddLicense} className="p-6 space-y-4 text-xs">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase font-bold text-gray-400">License / NOC Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Cinematograph Act Screen License 2026-27"
                  value={form.licenseName}
                  onChange={(e) => setForm(prev => ({ ...prev, licenseName: e.target.value }))}
                  className="cc-input"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] uppercase font-bold text-gray-400">License Number</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. DM/CINE/2026/08"
                    value={form.licenseNumber}
                    onChange={(e) => setForm(prev => ({ ...prev, licenseNumber: e.target.value }))}
                    className="cc-input font-mono"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] uppercase font-bold text-gray-400">Category</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm(prev => ({ ...prev, category: e.target.value as any }))}
                    className="cc-input"
                  >
                    <option value="Cinematograph">Cinematograph</option>
                    <option value="Fire Safety">Fire Safety</option>
                    <option value="Food & Health (FSSAI)">Food & Health (FSSAI)</option>
                    <option value="Copyright & Performance">Copyright & Performance</option>
                    <option value="Electrical">Electrical</option>
                    <option value="Structural">Structural</option>
                    <option value="Environmental / Pollution">Environmental / Pollution</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] uppercase font-bold text-gray-400">Cinema Location</label>
                  <select
                    value={form.cinemaId}
                    onChange={(e) => setForm(prev => ({ ...prev, cinemaId: e.target.value }))}
                    className="cc-input"
                  >
                    {cinemas.map(c => (
                      <option key={c.cinemaId} value={c.cinemaId}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] uppercase font-bold text-gray-400">Officer In-Charge</label>
                  <input
                    type="text"
                    placeholder="e.g. Rakesh Patel"
                    value={form.officerInCharge}
                    onChange={(e) => setForm(prev => ({ ...prev, officerInCharge: e.target.value }))}
                    className="cc-input"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase font-bold text-gray-400">Issuing Regulatory Body</label>
                <input
                  type="text"
                  placeholder="e.g. District Magistrate Office, Jodhpur"
                  value={form.issuingAuthority}
                  onChange={(e) => setForm(prev => ({ ...prev, issuingAuthority: e.target.value }))}
                  className="cc-input"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] uppercase font-bold text-gray-400">Issue Date</label>
                  <input
                    type="date"
                    value={form.issueDate}
                    onChange={(e) => setForm(prev => ({ ...prev, issueDate: e.target.value }))}
                    className="cc-input"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] uppercase font-bold text-gray-400">Expiry Date</label>
                  <input
                    type="date"
                    required
                    value={form.expiryDate}
                    onChange={(e) => setForm(prev => ({ ...prev, expiryDate: e.target.value }))}
                    className="cc-input"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase font-bold text-gray-400">Statutory Fee Paid (₹)</label>
                <input
                  type="number"
                  placeholder="e.g. 45000"
                  value={form.feePaid}
                  onChange={(e) => setForm(prev => ({ ...prev, feePaid: e.target.value }))}
                  className="cc-input font-mono"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="cc-btn cc-btn-outline py-2 px-4"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="cc-btn cc-btn-accent py-2 px-4"
                >
                  Register License
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: RENEW LICENSE */}
      {renewTarget && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-[#111827] border border-white/10 rounded-xl w-full max-w-sm overflow-hidden shadow-2xl">
            <div className="p-4 border-b border-white/5 flex justify-between items-center bg-black/30">
              <h3 className="font-bold text-sm uppercase tracking-wider text-white">
                Renew Certificate
              </h3>
              <button onClick={() => setRenewTarget(null)} className="text-gray-400 hover:text-white">
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            <form onSubmit={handleRenewSubmit} className="p-6 space-y-4 text-xs">
              <div className="p-3 rounded bg-black/40 border border-white/5">
                <div className="font-bold text-white">{renewTarget.licenseName}</div>
                <div className="text-[10px] text-gray-400 font-mono mt-0.5">Lic No: {renewTarget.licenseNumber}</div>
                <div className="text-[10px] text-gray-400 mt-1">Current Expiry: {renewTarget.expiryDate}</div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase font-bold text-gray-400">New Renewal Expiry Date</label>
                <input
                  type="date"
                  required
                  value={newExpiryInput}
                  onChange={(e) => setNewExpiryInput(e.target.value)}
                  className="cc-input"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => setRenewTarget(null)}
                  className="cc-btn cc-btn-outline py-2 px-4"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="cc-btn cc-btn-primary py-2 px-4"
                >
                  Update & Validate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
