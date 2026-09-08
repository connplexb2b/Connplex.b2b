import React, { useState } from 'react';
import { ConnCloudStore, MISCinemaSummary } from '../../../lib/conncloudData';

interface MISViewProps {
  selectedCinemaId: string;
  selectedDateRange: string;
  triggerNotification: (msg: string) => void;
}

export default function MISView({
  selectedCinemaId,
  selectedDateRange,
  triggerNotification
}: MISViewProps) {
  const [subSection, setSubSection] = useState<'summary' | 'waterfall' | 'variance' | 'screen-yield'>('summary');
  const [period, setPeriod] = useState<'MTD' | 'QTD' | 'YTD'>('MTD');

  const misData: MISCinemaSummary[] = ConnCloudStore.getMISData().filter(item => 
    selectedCinemaId === 'all' || item.cinemaId === selectedCinemaId
  );

  const formatCurrency = (val: number) => {
    if (val >= 10000000) return `₹${(val / 10000000).toFixed(2)}Cr`;
    if (val >= 100000) return `₹${(val / 100000).toFixed(2)}L`;
    return `₹${val.toLocaleString('en-IN')}`;
  };

  const formatExactCurrency = (val: number) => {
    return `₹${val.toLocaleString('en-IN')}`;
  };

  // Consolidated Aggregates
  const networkTotalRevenue = misData.reduce((acc, c) => acc + c.totalRevenue, 0);
  const networkTotalBoxOffice = misData.reduce((acc, c) => acc + c.boxOfficeGross, 0);
  const networkTotalFnB = misData.reduce((acc, c) => acc + c.fnbGross, 0);
  const networkTotalMerchandise = misData.reduce((acc, c) => acc + c.merchandiseGross, 0);
  const networkTotalGroupBookings = misData.reduce((acc, c) => acc + c.groupBookingsGross, 0);
  const networkTotalScreenAds = misData.reduce((acc, c) => acc + c.screenAdsGross, 0);
  const networkDistributorShare = misData.reduce((acc, c) => acc + c.distributorShare, 0);
  const networkOperationalExpenses = misData.reduce((acc, c) => acc + c.operationalExpenses, 0);
  const networkNetEbitda = misData.reduce((acc, c) => acc + c.netEbitda, 0);
  const networkTotalFootfall = misData.reduce((acc, c) => acc + c.totalFootfall, 0);
  const networkAvgOccupancy = misData.length > 0 
    ? (misData.reduce((acc, c) => acc + c.occupancyPercent, 0) / misData.length).toFixed(1)
    : '0';
  const networkOverallMargin = networkTotalRevenue > 0 
    ? ((networkNetEbitda / networkTotalRevenue) * 100).toFixed(1) 
    : '0';

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <section className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[#111827] border border-white/5 p-6 rounded-xl">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 uppercase tracking-wide">
              <i className="fa-solid fa-chart-pie text-[10px]"></i>
              Executive Business Intelligence
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              Consolidated MIS Portal
            </span>
          </div>
          <h1 className="text-2xl font-bold mt-2 tracking-tight text-white">Management Information System (MIS)</h1>
          <p className="text-xs text-gray-400 mt-1">
            Consolidated multi-unit performance telemetry, revenue stream decomposition, EBITDA margins, and variance tracking.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Period selector */}
          <div className="flex rounded-lg bg-black/40 border border-white/5 p-0.5 text-xs">
            {(['MTD', 'QTD', 'YTD'] as const).map((p) => (
              <button
                key={p}
                onClick={() => { setPeriod(p); triggerNotification(`MIS dataset updated for ${p}`); }}
                className={`px-3 py-1 rounded font-semibold transition-all ${
                  period === p ? 'bg-blue-600 text-white shadow' : 'text-gray-400 hover:text-white'
                }`}
              >
                {p}
              </button>
            ))}
          </div>

          <button 
            onClick={() => triggerNotification('Generating Consolidated Executive MIS Board Dossier (PDF)...')}
            className="cc-btn cc-btn-accent text-xs"
          >
            <i className="fa-solid fa-file-invoice"></i> Export Board Deck
          </button>
        </div>
      </section>

      {/* Network KPI Cards */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="cc-card">
          <div className="flex justify-between items-center mb-1">
            <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Gross Network Turnover</span>
            <i className="fa-solid fa-coins text-[#f5b041] text-xs"></i>
          </div>
          <div className="text-xl font-bold text-white">{formatCurrency(networkTotalRevenue)}</div>
          <div className="text-[10px] text-emerald-400 mt-1">▲ +5.2% vs target quarterly budget</div>
        </div>

        <div className="cc-card">
          <div className="flex justify-between items-center mb-1">
            <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Operating EBITDA</span>
            <i className="fa-solid fa-chart-line-up text-emerald-400 text-xs"></i>
          </div>
          <div className="text-xl font-bold text-emerald-400">{formatCurrency(networkNetEbitda)}</div>
          <div className="text-[10px] text-gray-400 mt-1">EBITDA Margin: <strong className="text-white">{networkOverallMargin}%</strong></div>
        </div>

        <div className="cc-card">
          <div className="flex justify-between items-center mb-1">
            <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Network Footfalls</span>
            <i className="fa-solid fa-users text-blue-400 text-xs"></i>
          </div>
          <div className="text-xl font-bold text-white">{networkTotalFootfall.toLocaleString('en-IN')}</div>
          <div className="text-[10px] text-gray-400 mt-1">Avg Occupancy: <strong className="text-white">{networkAvgOccupancy}%</strong></div>
        </div>

        <div className="cc-card">
          <div className="flex justify-between items-center mb-1">
            <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Ancillary Non-Box Office</span>
            <i className="fa-solid fa-burger text-purple-400 text-xs"></i>
          </div>
          <div className="text-xl font-bold text-purple-400">
            {formatCurrency(networkTotalFnB + networkTotalMerchandise + networkTotalGroupBookings + networkTotalScreenAds)}
          </div>
          <div className="text-[10px] text-emerald-400 mt-1">
            {networkTotalRevenue > 0 ? Math.round(((networkTotalFnB + networkTotalMerchandise + networkTotalGroupBookings + networkTotalScreenAds) / networkTotalRevenue) * 100) : 0}% of turnover
          </div>
        </div>
      </section>

      {/* Tabs */}
      <section className="flex flex-wrap gap-1 bg-[#111827] border border-white/5 p-2 rounded-xl">
        <button
          onClick={() => setSubSection('summary')}
          className={`px-3 py-1.5 rounded text-xs font-semibold transition-all ${
            subSection === 'summary'
              ? 'bg-blue-600 text-white shadow shadow-blue-600/10'
              : 'text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <i className="fa-solid fa-table mr-1.5"></i> Multi-Unit Benchmarking Matrix
        </button>
        <button
          onClick={() => setSubSection('waterfall')}
          className={`px-3 py-1.5 rounded text-xs font-semibold transition-all ${
            subSection === 'waterfall'
              ? 'bg-blue-600 text-white shadow shadow-blue-600/10'
              : 'text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <i className="fa-solid fa-bars-staggered mr-1.5"></i> Revenue & Cost Waterfall
        </button>
        <button
          onClick={() => setSubSection('variance')}
          className={`px-3 py-1.5 rounded text-xs font-semibold transition-all ${
            subSection === 'variance'
              ? 'bg-blue-600 text-white shadow shadow-blue-600/10'
              : 'text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <i className="fa-solid fa-scale-balanced mr-1.5"></i> Budget Target vs Actual Variance
        </button>
        <button
          onClick={() => setSubSection('screen-yield')}
          className={`px-3 py-1.5 rounded text-xs font-semibold transition-all ${
            subSection === 'screen-yield'
              ? 'bg-blue-600 text-white shadow shadow-blue-600/10'
              : 'text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <i className="fa-solid fa-tv mr-1.5"></i> Screen Yield & Format Analysis
        </button>
      </section>

      {/* 1. MULTI-UNIT MATRIX */}
      {subSection === 'summary' && (
        <div className="cc-card">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400">
                Franchise Unit Performance Comparative Matrix ({period})
              </h3>
              <p className="text-xs text-gray-500">Cross-property commercial telemetry across operational cinema locations.</p>
            </div>
            <button 
              onClick={() => triggerNotification('Exporting Comparative Matrix to Excel...')}
              className="cc-btn cc-btn-outline text-xs"
            >
              <i className="fa-solid fa-file-excel mr-1"></i> Export Excel
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-white/10 text-gray-400">
                  <th className="pb-3 font-semibold">Cinema Unit</th>
                  <th className="pb-3 font-semibold text-center">Screens</th>
                  <th className="pb-3 font-semibold text-right">Admissions</th>
                  <th className="pb-3 font-semibold text-right">Box Office Gross</th>
                  <th className="pb-3 font-semibold text-right">F&B Turnover</th>
                  <th className="pb-3 font-semibold text-right">Other Income</th>
                  <th className="pb-3 font-semibold text-right">Total Revenue</th>
                  <th className="pb-3 font-semibold text-right">EBITDA</th>
                  <th className="pb-3 font-semibold text-center">Margin %</th>
                  <th className="pb-3 font-semibold text-right">ATP</th>
                  <th className="pb-3 font-semibold text-right">SPH</th>
                  <th className="pb-3 font-semibold text-center">Occupancy</th>
                </tr>
              </thead>
              <tbody>
                {misData.map((c) => {
                  const otherRevenue = c.merchandiseGross + c.groupBookingsGross + c.screenAdsGross;
                  return (
                    <tr key={c.cinemaId} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="py-3">
                        <span className="font-bold text-white block">{c.cinemaName}</span>
                        <span className="text-[10px] text-gray-400">{c.city}</span>
                      </td>
                      <td className="py-3 text-center font-mono text-gray-300">{c.screens}</td>
                      <td className="py-3 text-right font-mono text-gray-200">{c.totalFootfall.toLocaleString('en-IN')}</td>
                      <td className="py-3 text-right font-mono text-white">{formatCurrency(c.boxOfficeGross)}</td>
                      <td className="py-3 text-right font-mono text-[#f5b041]">{formatCurrency(c.fnbGross)}</td>
                      <td className="py-3 text-right font-mono text-purple-400">{formatCurrency(otherRevenue)}</td>
                      <td className="py-3 text-right font-mono font-bold text-white">{formatCurrency(c.totalRevenue)}</td>
                      <td className="py-3 text-right font-mono font-bold text-emerald-400">{formatCurrency(c.netEbitda)}</td>
                      <td className="py-3 text-center">
                        <span className="px-2 py-0.5 rounded font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          {c.ebitdaMargin}%
                        </span>
                      </td>
                      <td className="py-3 text-right font-mono text-gray-300">₹{c.atp}</td>
                      <td className="py-3 text-right font-mono text-gray-300">₹{c.sph}</td>
                      <td className="py-3 text-center font-mono font-semibold text-white">{c.occupancyPercent}%</td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-white/20 bg-white/5 font-bold">
                  <td className="py-3.5 text-white">CONSOLIDATED TOTAL</td>
                  <td className="py-3.5 text-center font-mono text-white">
                    {misData.reduce((acc, c) => acc + c.screens, 0)}
                  </td>
                  <td className="py-3.5 text-right font-mono text-white">
                    {networkTotalFootfall.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3.5 text-right font-mono text-white">{formatCurrency(networkTotalBoxOffice)}</td>
                  <td className="py-3.5 text-right font-mono text-[#f5b041]">{formatCurrency(networkTotalFnB)}</td>
                  <td className="py-3.5 text-right font-mono text-purple-400">
                    {formatCurrency(networkTotalMerchandise + networkTotalGroupBookings + networkTotalScreenAds)}
                  </td>
                  <td className="py-3.5 text-right font-mono text-white">{formatCurrency(networkTotalRevenue)}</td>
                  <td className="py-3.5 text-right font-mono text-emerald-400">{formatCurrency(networkNetEbitda)}</td>
                  <td className="py-3.5 text-center font-mono text-emerald-400">{networkOverallMargin}%</td>
                  <td className="py-3.5 text-right font-mono text-gray-300">
                    ₹{networkTotalFootfall > 0 ? Math.round(networkTotalBoxOffice / networkTotalFootfall) : 0}
                  </td>
                  <td className="py-3.5 text-right font-mono text-gray-300">
                    ₹{networkTotalFootfall > 0 ? Math.round(networkTotalFnB / networkTotalFootfall) : 0}
                  </td>
                  <td className="py-3.5 text-center font-mono text-white">{networkAvgOccupancy}%</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}

      {/* 2. WATERFALL BREAKDOWN */}
      {subSection === 'waterfall' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Revenue Inflows */}
          <div className="cc-card">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-4 flex items-center justify-between">
              <span>Gross Inflow Streams</span>
              <span className="text-emerald-400 font-mono font-bold">{formatCurrency(networkTotalRevenue)}</span>
            </h3>

            <div className="space-y-3">
              {[
                { name: 'Box Office Admissions', amount: networkTotalBoxOffice, color: 'bg-blue-600', pct: Math.round((networkTotalBoxOffice / networkTotalRevenue) * 100) },
                { name: 'Food & Beverage Counters', amount: networkTotalFnB, color: 'bg-[#f5b041]', pct: Math.round((networkTotalFnB / networkTotalRevenue) * 100) },
                { name: 'Group Bookings & Private Screenings', amount: networkTotalGroupBookings, color: 'bg-indigo-600', pct: Math.round((networkTotalGroupBookings / networkTotalRevenue) * 100) },
                { name: 'Screen On-Slide Advertisements', amount: networkTotalScreenAds, color: 'bg-cyan-600', pct: Math.round((networkTotalScreenAds / networkTotalRevenue) * 100) },
                { name: 'Merchandise & Retail Store', amount: networkTotalMerchandise, color: 'bg-pink-600', pct: Math.round((networkTotalMerchandise / networkTotalRevenue) * 100) }
              ].map((item, idx) => (
                <div key={idx} className="p-3 rounded-lg bg-black/30 border border-white/5 space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-white">{item.name}</span>
                    <span className="font-mono font-bold text-white">{formatExactCurrency(item.amount)} ({item.pct}%)</span>
                  </div>
                  <div className="w-full h-1.5 bg-black/50 rounded-full overflow-hidden">
                    <div className={`h-full ${item.color}`} style={{ width: `${item.pct}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Operational Expenses Outflows */}
          <div className="cc-card">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-4 flex items-center justify-between">
              <span>Operating Costs & Obligations</span>
              <span className="text-red-400 font-mono font-bold">
                {formatCurrency(networkDistributorShare + networkOperationalExpenses)}
              </span>
            </h3>

            <div className="space-y-3">
              {[
                { name: 'Film Distributor Royalty Share (~50% Gross)', amount: networkDistributorShare, color: 'bg-red-500', pct: 46 },
                { name: 'Staff & Managerial Payroll', amount: Math.round(networkOperationalExpenses * 0.35), color: 'bg-orange-500', pct: 21 },
                { name: 'Electricity, HVAC & Power Backup', amount: Math.round(networkOperationalExpenses * 0.28), color: 'bg-amber-500', pct: 17 },
                { name: 'Mall Property Lease & Common Area Maintenance', amount: Math.round(networkOperationalExpenses * 0.22), color: 'bg-purple-500', pct: 13 },
                { name: 'Equipment AMC & Projector Laser SLA', amount: Math.round(networkOperationalExpenses * 0.15), color: 'bg-blue-500', pct: 9 }
              ].map((item, idx) => (
                <div key={idx} className="p-3 rounded-lg bg-black/30 border border-white/5 space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-white">{item.name}</span>
                    <span className="font-mono font-bold text-red-300">-{formatExactCurrency(item.amount)}</span>
                  </div>
                  <div className="w-full h-1.5 bg-black/50 rounded-full overflow-hidden">
                    <div className={`h-full ${item.color}`} style={{ width: `${item.pct}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 3. VARIANCE LEDGER */}
      {subSection === 'variance' && (
        <div className="cc-card">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400">
              Budget Target vs Actual Achievement ({period})
            </h3>
            <span className="text-xs text-emerald-400 font-mono font-bold">
              Consolidated Net Variance: +4.9%
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-white/10 text-gray-400">
                  <th className="pb-3 font-semibold">Cinema Unit</th>
                  <th className="pb-3 font-semibold text-right">Target Budget</th>
                  <th className="pb-3 font-semibold text-right">Actual Generated</th>
                  <th className="pb-3 font-semibold text-right">Variance Amount</th>
                  <th className="pb-3 font-semibold text-center">Variance %</th>
                  <th className="pb-3 font-semibold text-center">Rating</th>
                </tr>
              </thead>
              <tbody>
                {misData.map((c) => {
                  const varianceAmount = c.totalRevenue - c.budgetTarget;
                  return (
                    <tr key={c.cinemaId} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="py-3 font-bold text-white">{c.cinemaName}</td>
                      <td className="py-3 text-right font-mono text-gray-400">{formatExactCurrency(c.budgetTarget)}</td>
                      <td className="py-3 text-right font-mono font-bold text-white">{formatExactCurrency(c.totalRevenue)}</td>
                      <td className="py-3 text-right font-mono font-bold text-emerald-400">+{formatExactCurrency(varianceAmount)}</td>
                      <td className="py-3 text-center">
                        <span className="px-2 py-0.5 rounded font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          +{c.variancePercent}%
                        </span>
                      </td>
                      <td className="py-3 text-center">
                        <span className="text-xs text-[#f5b041]">★★★★★</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 4. SCREEN YIELD */}
      {subSection === 'screen-yield' && (
        <div className="cc-card">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400">
              Format Productivity & Yield Comparison
            </h3>
            <span className="text-xs text-gray-400">IMAX 3D leads across all revenue and ATP indices.</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { format: 'IMAX 3D', screens: '2 Screens', avgAtp: '₹350', occupancy: '76.4%', monthlyGross: '₹1.15 Cr', icon: 'fa-film text-blue-400' },
              { format: '4DX Dynamic', screens: '1 Screen', avgAtp: '₹320', occupancy: '81.2%', monthlyGross: '₹62.5 L', icon: 'fa-wand-magic-sparkles text-purple-400' },
              { format: 'RealD 3D', screens: '6 Screens', avgAtp: '₹260', occupancy: '69.0%', monthlyGross: '₹2.84 Cr', icon: 'fa-glasses text-emerald-400' },
              { format: 'Digital 2D', screens: '10 Screens', avgAtp: '₹210', occupancy: '64.5%', monthlyGross: '₹3.93 Cr', icon: 'fa-display text-[#f5b041]' }
            ].map((fmt, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-black/30 border border-white/5 space-y-3">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <i className={`fa-solid ${fmt.icon}`}></i>
                    <span className="font-bold text-white">{fmt.format}</span>
                  </div>
                  <span className="text-[10px] text-gray-400">{fmt.screens}</span>
                </div>

                <div className="space-y-1.5 pt-2 border-t border-white/5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Avg Ticket Price:</span>
                    <span className="font-mono font-bold text-white">{fmt.avgAtp}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Avg Occupancy:</span>
                    <span className="font-mono font-bold text-emerald-400">{fmt.occupancy}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Turnover Yield:</span>
                    <span className="font-mono font-bold text-[#f5b041]">{fmt.monthlyGross}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
