import React, { useState } from 'react';
import { ConnCloudStore, CinemaOffer } from '../../../lib/conncloudData';

interface OffersViewProps {
  selectedCinemaId: string;
  selectedDateRange: string;
  triggerNotification: (msg: string) => void;
}

export default function OffersView({
  selectedCinemaId,
  selectedDateRange,
  triggerNotification
}: OffersViewProps) {
  const [subSection, setSubSection] = useState<'active' | 'analytics' | 'archive'>('active');
  const [filterType, setFilterType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Store data
  const [offers, setOffers] = useState<CinemaOffer[]>(() => {
    return ConnCloudStore.getOffers();
  });
  const cinemas = ConnCloudStore.getCinemas();

  // Modal state
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // Create offer form
  const [form, setForm] = useState({
    code: '',
    title: '',
    description: '',
    discountType: 'Percentage' as CinemaOffer['discountType'],
    discountValue: '',
    minTicketsRequired: '2',
    maxDiscountAmount: '150',
    cinemaId: selectedCinemaId,
    applicableDays: 'Weekdays Only' as CinemaOffer['applicableDays'],
    validFrom: '',
    validUntil: '',
    usageLimit: '1000'
  });

  const formatCurrency = (val: number) => {
    return `₹${val.toLocaleString('en-IN')}`;
  };

  // Filtered offers
  const filteredOffers = offers.filter(o => {
    const cinemaMatch = selectedCinemaId === 'all' || o.cinemaId === 'all' || o.cinemaId === selectedCinemaId;
    const typeMatch = filterType === 'all' || o.discountType === filterType;
    const isArchive = subSection === 'archive';
    const statusMatch = isArchive ? (o.status === 'Expired') : (o.status === 'Active' || o.status === 'Paused');
    const searchMatch = o.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        o.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        o.description.toLowerCase().includes(searchQuery.toLowerCase());
    return cinemaMatch && typeMatch && statusMatch && searchMatch;
  });

  // KPI Calculations
  const activeOffers = offers.filter(o => o.status === 'Active');
  const totalRedemptions = offers.reduce((acc, o) => acc + o.timesRedeemed, 0);
  const totalSavings = offers.reduce((acc, o) => acc + o.totalSavingsGranted, 0);
  const incrementalRevenue = Math.round(totalSavings * 4.2); // Typical box office uplift multiplier

  // Copy Promo Code
  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    triggerNotification(`Copied promo coupon code "${code}" to clipboard!`);
  };

  // Toggle Status
  const handleToggleStatus = (offerId: string) => {
    const newStatus = ConnCloudStore.toggleOfferStatus(offerId);
    setOffers(ConnCloudStore.getOffers());
    triggerNotification(`Offer ${offerId} status updated to ${newStatus}.`);
  };

  // Create Offer Submit
  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.code || !form.title || !form.discountValue) return;

    const discountVal = parseFloat(form.discountValue);
    const minTickets = parseInt(form.minTicketsRequired, 10) || 1;
    const maxDiscount = parseFloat(form.maxDiscountAmount) || undefined;
    const usageLim = parseInt(form.usageLimit, 10) || 1000;

    const newOffer = ConnCloudStore.addOffer({
      code: form.code.toUpperCase().trim(),
      title: form.title,
      description: form.description || 'Special cinema promotion.',
      discountType: form.discountType,
      discountValue: discountVal,
      minTicketsRequired: minTickets,
      maxDiscountAmount: maxDiscount,
      cinemaId: form.cinemaId === 'all' ? 'all' : form.cinemaId,
      applicableDays: form.applicableDays,
      validFrom: form.validFrom || new Date().toISOString().split('T')[0],
      validUntil: form.validUntil || '2026-12-31',
      usageLimit: usageLim,
      status: 'Active',
      bannerColor: 'from-blue-600 to-indigo-700'
    });

    setOffers(ConnCloudStore.getOffers());
    setIsCreateOpen(false);
    setForm({
      code: '',
      title: '',
      description: '',
      discountType: 'Percentage',
      discountValue: '',
      minTicketsRequired: '2',
      maxDiscountAmount: '150',
      cinemaId: selectedCinemaId,
      applicableDays: 'Weekdays Only',
      validFrom: '',
      validUntil: '',
      usageLimit: '1000'
    });
    triggerNotification(`Launched promotional campaign "${newOffer.code}"!`);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <section className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[#111827] border border-white/5 p-6 rounded-xl">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20 uppercase tracking-wide">
              <i className="fa-solid fa-tags text-[10px]"></i>
              Promotions & Vouchers
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              {activeOffers.length} Active Campaigns
            </span>
          </div>
          <h1 className="text-2xl font-bold mt-2 tracking-tight text-white">My Offers & Franchise Discounts</h1>
          <p className="text-xs text-gray-400 mt-1">
            Configure promo codes, BOGO concessions, corporate tie-ups, student passes, and weekend festival vouchers.
          </p>
        </div>

        <div className="flex gap-2.5">
          <button 
            onClick={() => setIsCreateOpen(true)}
            className="cc-btn cc-btn-accent text-xs"
          >
            <i className="fa-solid fa-plus"></i> Create New Offer
          </button>
          <button 
            onClick={() => triggerNotification('Exporting Offer Redemptions Report (XLS)...')}
            className="cc-btn cc-btn-outline text-xs"
          >
            <i className="fa-solid fa-chart-simple"></i> Redemption Report
          </button>
        </div>
      </section>

      {/* KPI Stats Grid */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="cc-card">
          <div className="flex justify-between items-center mb-1">
            <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Active Campaigns</span>
            <i className="fa-solid fa-ticket-simple text-rose-400 text-xs"></i>
          </div>
          <div className="text-xl font-bold text-white">{activeOffers.length} Live Promos</div>
          <div className="text-[10px] text-gray-400 mt-1">Across all cinema screen formats</div>
        </div>

        <div className="cc-card">
          <div className="flex justify-between items-center mb-1">
            <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Total Redemptions</span>
            <i className="fa-solid fa-qrcode text-blue-400 text-xs"></i>
          </div>
          <div className="text-xl font-bold text-white">{totalRedemptions.toLocaleString('en-IN')} Uses</div>
          <div className="text-[10px] text-emerald-400 mt-1">▲ +18.7% redemption velocity</div>
        </div>

        <div className="cc-card">
          <div className="flex justify-between items-center mb-1">
            <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Customer Savings</span>
            <i className="fa-solid fa-hand-holding-dollar text-[#f5b041] text-xs"></i>
          </div>
          <div className="text-xl font-bold text-[#f5b041]">{formatCurrency(totalSavings)}</div>
          <div className="text-[10px] text-gray-400 mt-1">Total discounts absorbed</div>
        </div>

        <div className="cc-card">
          <div className="flex justify-between items-center mb-1">
            <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Incremental Revenue</span>
            <i className="fa-solid fa-arrow-trend-up text-emerald-400 text-xs"></i>
          </div>
          <div className="text-xl font-bold text-emerald-400">{formatCurrency(incrementalRevenue)}</div>
          <div className="text-[10px] text-gray-400 mt-1">ROI: <strong className="text-white">5.4x</strong> campaign yield</div>
        </div>
      </section>

      {/* Tabs */}
      <section className="flex flex-wrap gap-1 bg-[#111827] border border-white/5 p-2 rounded-xl">
        <button
          onClick={() => setSubSection('active')}
          className={`px-3 py-1.5 rounded text-xs font-semibold transition-all ${
            subSection === 'active'
              ? 'bg-blue-600 text-white shadow shadow-blue-600/10'
              : 'text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <i className="fa-solid fa-fire mr-1.5"></i> Live Promotional Offers
        </button>
        <button
          onClick={() => setSubSection('analytics')}
          className={`px-3 py-1.5 rounded text-xs font-semibold transition-all ${
            subSection === 'analytics'
              ? 'bg-blue-600 text-white shadow shadow-blue-600/10'
              : 'text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <i className="fa-solid fa-chart-pie mr-1.5"></i> Redemption Analytics
        </button>
        <button
          onClick={() => setSubSection('archive')}
          className={`px-3 py-1.5 rounded text-xs font-semibold transition-all ${
            subSection === 'archive'
              ? 'bg-blue-600 text-white shadow shadow-blue-600/10'
              : 'text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <i className="fa-solid fa-box-archive mr-1.5"></i> Expired & Archived
        </button>
      </section>

      {/* 1. OFFERS GRID TAB */}
      {(subSection === 'active' || subSection === 'archive') && (
        <div className="space-y-4">
          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-[#111827]/60 p-3 rounded-lg border border-white/5">
            <div className="flex flex-wrap gap-1.5">
              {['all', 'Percentage', 'Flat Amount', 'BOGO', 'Free F&B Combo'].map((t) => (
                <button
                  key={t}
                  onClick={() => setFilterType(t)}
                  className={`px-2.5 py-1 rounded text-xs font-medium transition-all ${
                    filterType === t
                      ? 'bg-white/10 text-white border border-white/20'
                      : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
                  }`}
                >
                  {t === 'all' ? 'All Types' : t}
                </button>
              ))}
            </div>

            <div className="relative w-full sm:w-64">
              <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xs"></i>
              <input
                type="text"
                placeholder="Search offer or coupon..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="cc-input pl-9 w-full text-xs"
              />
            </div>
          </div>

          {/* Offer Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredOffers.map((offer) => {
              const usagePct = Math.round((offer.timesRedeemed / offer.usageLimit) * 100);
              const isActive = offer.status === 'Active';
              return (
                <div
                  key={offer.offerId}
                  className={`relative rounded-xl border overflow-hidden transition-all bg-[#111827] flex flex-col justify-between ${
                    isActive ? 'border-white/10 hover:border-[#f5b041]/40' : 'border-white/5 opacity-60'
                  }`}
                >
                  {/* Top Gradient Banner */}
                  <div className={`p-4 bg-gradient-to-r ${offer.bannerColor || 'from-blue-600 to-indigo-700'} relative`}>
                    <div className="flex justify-between items-start">
                      <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-black/40 text-white tracking-wider backdrop-blur-sm">
                        {offer.discountType}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                        isActive ? 'bg-emerald-500 text-black font-black' : 'bg-gray-800 text-gray-400'
                      }`}>
                        {offer.status}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-white mt-2 leading-tight">
                      {offer.title}
                    </h3>
                  </div>

                  {/* Body Details */}
                  <div className="p-4 space-y-3 text-xs flex-1">
                    <p className="text-gray-300 leading-relaxed text-[11px]">
                      {offer.description}
                    </p>

                    {/* Coupon Code Strip */}
                    <div className="flex items-center justify-between p-2.5 rounded-lg bg-black/40 border border-dashed border-white/20">
                      <div className="flex items-center gap-2">
                        <i className="fa-solid fa-ticket text-[#f5b041]"></i>
                        <span className="font-mono font-bold text-white text-sm tracking-wider">
                          {offer.code}
                        </span>
                      </div>
                      <button
                        onClick={() => handleCopyCode(offer.code)}
                        className="text-[10px] font-bold text-blue-400 hover:text-white px-2 py-1 rounded hover:bg-white/5 transition-colors"
                      >
                        <i className="fa-regular fa-copy mr-1"></i> Copy
                      </button>
                    </div>

                    {/* Meta Specs */}
                    <div className="space-y-1.5 pt-1 text-[11px] text-gray-400">
                      <div className="flex justify-between">
                        <span>Applicable Days:</span>
                        <span className="text-white font-semibold">{offer.applicableDays}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Min Tickets Required:</span>
                        <span className="text-white font-semibold">{offer.minTicketsRequired} Tickets</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Validity Period:</span>
                        <span className="text-gray-300 font-mono text-[10px]">
                          {offer.validFrom} to {offer.validUntil}
                        </span>
                      </div>
                    </div>

                    {/* Redemption Progress */}
                    <div className="pt-2 border-t border-white/5 space-y-1">
                      <div className="flex justify-between text-[10px]">
                        <span className="text-gray-400">Redemption Progress:</span>
                        <span className="font-mono text-white font-bold">{offer.timesRedeemed} / {offer.usageLimit} ({usagePct}%)</span>
                      </div>
                      <div className="w-full h-1.5 bg-black/50 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${Math.min(100, usagePct)}%` }}></div>
                      </div>
                    </div>
                  </div>

                  {/* Footer Actions */}
                  <div className="p-3 bg-black/20 border-t border-white/5 flex items-center justify-between">
                    <div className="text-[10px] text-gray-400">
                      Savings granted: <strong className="text-emerald-400 font-mono">{formatCurrency(offer.totalSavingsGranted)}</strong>
                    </div>

                    {offer.status !== 'Expired' && (
                      <button
                        onClick={() => handleToggleStatus(offer.offerId)}
                        className={`px-2.5 py-1 rounded text-[10px] font-bold transition-colors ${
                          isActive 
                            ? 'bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 border border-amber-500/20' 
                            : 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/20'
                        }`}
                      >
                        {isActive ? 'Pause Offer' : 'Resume Offer'}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {filteredOffers.length === 0 && (
            <div className="text-center py-12 cc-card">
              <i className="fa-solid fa-tag text-3xl text-gray-600 mb-2"></i>
              <p className="text-sm text-gray-400">No promotional offers found matching your query.</p>
            </div>
          )}
        </div>
      )}

      {/* 2. ANALYTICS TAB */}
      {subSection === 'analytics' && (
        <div className="space-y-6">
          <div className="cc-card">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-4">
              Promo Campaigns Performance Breakdown
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-white/10 text-gray-400">
                    <th className="pb-3 font-semibold">Promo Code</th>
                    <th className="pb-3 font-semibold">Campaign Title</th>
                    <th className="pb-3 font-semibold">Discount Type</th>
                    <th className="pb-3 font-semibold text-center">Redemptions</th>
                    <th className="pb-3 font-semibold text-right">Total Savings Granted</th>
                    <th className="pb-3 font-semibold text-right">Estimated Gross Inflow</th>
                    <th className="pb-3 font-semibold text-center">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {offers.map((o) => {
                    const grossInflow = Math.round(o.totalSavingsGranted * 3.8);
                    return (
                      <tr key={o.offerId} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                        <td className="py-3 font-mono font-bold text-[#f5b041]">{o.code}</td>
                        <td className="py-3 font-semibold text-white">{o.title}</td>
                        <td className="py-3 text-gray-300">{o.discountType}</td>
                        <td className="py-3 text-center font-mono font-bold text-white">{o.timesRedeemed}</td>
                        <td className="py-3 text-right font-mono text-amber-400 font-bold">{formatCurrency(o.totalSavingsGranted)}</td>
                        <td className="py-3 text-right font-mono text-emerald-400 font-bold">{formatCurrency(grossInflow)}</td>
                        <td className="py-3 text-center">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            o.status === 'Active' 
                              ? 'bg-emerald-500/10 text-emerald-400' 
                              : (o.status === 'Paused' ? 'bg-amber-500/10 text-amber-400' : 'bg-gray-500/10 text-gray-400')
                          }`}>
                            {o.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: CREATE NEW OFFER */}
      {isCreateOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-[#111827] border border-white/10 rounded-xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="p-4 border-b border-white/5 flex justify-between items-center bg-black/30">
              <h3 className="font-bold text-sm uppercase tracking-wider text-white flex items-center gap-2">
                <i className="fa-solid fa-ticket text-rose-400"></i> Launch Discount Campaign
              </h3>
              <button onClick={() => setIsCreateOpen(false)} className="text-gray-400 hover:text-white">
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="p-6 space-y-4 text-xs max-h-[80vh] overflow-y-auto cc-scrollbar">
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] uppercase font-bold text-gray-400">Promo Code</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. DIWALI50"
                    value={form.code}
                    onChange={(e) => setForm(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
                    className="cc-input font-mono font-bold"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] uppercase font-bold text-gray-400">Discount Type</label>
                  <select
                    value={form.discountType}
                    onChange={(e) => setForm(prev => ({ ...prev, discountType: e.target.value as any }))}
                    className="cc-input"
                  >
                    <option value="Percentage">Percentage (%)</option>
                    <option value="Flat Amount">Flat Discount (₹)</option>
                    <option value="BOGO">BOGO (Buy 1 Get 1)</option>
                    <option value="Free F&B Combo">Free F&B Combo</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase font-bold text-gray-400">Campaign Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Festival 50% Off on Second Ticket"
                  value={form.title}
                  onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))}
                  className="cc-input"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] uppercase font-bold text-gray-400">
                    {form.discountType === 'Percentage' ? 'Discount Percent (%)' : 'Discount Value (₹)'}
                  </label>
                  <input
                    type="number"
                    required
                    placeholder={form.discountType === 'Percentage' ? '50' : '100'}
                    value={form.discountValue}
                    onChange={(e) => setForm(prev => ({ ...prev, discountValue: e.target.value }))}
                    className="cc-input font-mono"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] uppercase font-bold text-gray-400">Max Discount Cap (₹)</label>
                  <input
                    type="number"
                    placeholder="e.g. 200"
                    value={form.maxDiscountAmount}
                    onChange={(e) => setForm(prev => ({ ...prev, maxDiscountAmount: e.target.value }))}
                    className="cc-input font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] uppercase font-bold text-gray-400">Min Tickets</label>
                  <input
                    type="number"
                    min={1}
                    value={form.minTicketsRequired}
                    onChange={(e) => setForm(prev => ({ ...prev, minTicketsRequired: e.target.value }))}
                    className="cc-input"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] uppercase font-bold text-gray-400">Applicable Days</label>
                  <select
                    value={form.applicableDays}
                    onChange={(e) => setForm(prev => ({ ...prev, applicableDays: e.target.value as any }))}
                    className="cc-input"
                  >
                    <option value="All Days">All Days</option>
                    <option value="Weekdays Only">Weekdays Only</option>
                    <option value="Weekends Only">Weekends Only</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] uppercase font-bold text-gray-400">Valid From</label>
                  <input
                    type="date"
                    value={form.validFrom}
                    onChange={(e) => setForm(prev => ({ ...prev, validFrom: e.target.value }))}
                    className="cc-input"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] uppercase font-bold text-gray-400">Valid Until</label>
                  <input
                    type="date"
                    value={form.validUntil}
                    onChange={(e) => setForm(prev => ({ ...prev, validUntil: e.target.value }))}
                    className="cc-input"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase font-bold text-gray-400">Usage Redemption Limit</label>
                <input
                  type="number"
                  placeholder="e.g. 1000"
                  value={form.usageLimit}
                  onChange={(e) => setForm(prev => ({ ...prev, usageLimit: e.target.value }))}
                  className="cc-input"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase font-bold text-gray-400">Campaign Description</label>
                <textarea
                  rows={2}
                  placeholder="Short customer-facing terms..."
                  value={form.description}
                  onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
                  className="cc-input"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="cc-btn cc-btn-outline py-2 px-4"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="cc-btn cc-btn-accent py-2 px-4"
                >
                  Publish Campaign
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
