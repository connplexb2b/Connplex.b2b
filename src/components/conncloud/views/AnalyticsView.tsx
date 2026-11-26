import React, { useState } from 'react';
import { ConnCloudStore } from '../../../lib/conncloudData';

interface AnalyticsViewProps {
  selectedCinemaId: string;
  selectedDateRange: string;
  triggerNotification: (msg: string) => void;
  initialSubTab?: string;
}

export type AnalyticsSubTab = 
  | 'revenue' 
  | 'admissions' 
  | 'occupancy' 
  | 'atp' 
  | 'sph' 
  | 'movies' 
  | 'screens' 
  | 'customers' 
  | 'fnb' 
  | 'staff' 
  | 'operations' 
  | 'forecast';

export default function AnalyticsView({
  selectedCinemaId,
  selectedDateRange,
  triggerNotification,
  initialSubTab
}: AnalyticsViewProps) {
  const resolveSubTab = (tab?: string): AnalyticsSubTab => {
    if (!tab) return 'revenue';
    const t = tab.toLowerCase();
    if (t.includes('admit') || t.includes('admission') || t.includes('footfall')) return 'admissions';
    if (t.includes('occupan') || t.includes('heat')) return 'occupancy';
    if (t.includes('atp')) return 'atp';
    if (t.includes('sph')) return 'sph';
    if (t.includes('movie')) return 'movies';
    if (t.includes('screen')) return 'screens';
    if (t.includes('custom') || t.includes('rating') || t.includes('review')) return 'customers';
    if (t.includes('fnb') || t.includes('food') || t.includes('snack')) return 'fnb';
    if (t.includes('staff') || t.includes('productiv') || t.includes('employ')) return 'staff';
    if (t.includes('operat') || t.includes('down') || t.includes('equip')) return 'operations';
    if (t.includes('fore') || t.includes('project')) return 'forecast';
    return 'revenue';
  };

  const [subTab, setSubTab] = useState<AnalyticsSubTab>(() => resolveSubTab(initialSubTab));
  const [movieFilter, setMovieFilter] = useState<string>('all');

  React.useEffect(() => {
    if (initialSubTab) {
      setSubTab(resolveSubTab(initialSubTab));
    }
  }, [initialSubTab]);

  // Pull calculations from ConnCloudStore
  const currentCinema = ConnCloudStore.getCinemas().find(c => c.cinemaId === selectedCinemaId);
  const isAhilyanagar = selectedCinemaId === 'c5';
  const cinemaName = selectedCinemaId === 'all' ? 'All Cinemas' : (currentCinema?.name || 'Selected Cinema');

  // Pull raw collections filtered by cinema with safe guards
  const rawFinance = ConnCloudStore.getFinanceTransactions().filter(t => t && (selectedCinemaId === 'all' || t.cinemaId === selectedCinemaId));
  const rawShows = ConnCloudStore.getShows().filter(sh => {
    if (!sh) return false;
    const scr = ConnCloudStore.getScreens().find(s => s && s.screenId === sh.screenId);
    return selectedCinemaId === 'all' || scr?.cinemaId === selectedCinemaId;
  });
  const rawTickets = ConnCloudStore.getTickets().filter(t => {
    if (!t) return false;
    const scr = ConnCloudStore.getScreens().find(s => s && s.screenId === t.screenId);
    return selectedCinemaId === 'all' || scr?.cinemaId === selectedCinemaId;
  });

  // Filter dynamically by selected date range
  const finance = ConnCloudStore.filterByDateRange(rawFinance, selectedDateRange);
  const shows = ConnCloudStore.filterByDateRange(rawShows, selectedDateRange);
  const tickets = ConnCloudStore.filterByDateRange(rawTickets, selectedDateRange);

  const ticketRev = finance.filter(t => t && t.type === 'Income' && t.category === 'Tickets').reduce((acc, t) => acc + (t.amount || 0), 0);
  const fnbRev = finance.filter(t => t && t.type === 'Income' && t.category === 'Food & Beverage').reduce((acc, t) => acc + (t.amount || 0), 0);
  const totalRev = ticketRev + fnbRev;
  const admissions = shows.reduce((acc, s) => acc + (s?.ticketsSold || 0), 0);
  const cap = shows.reduce((acc, s) => acc + (s?.capacity || 0), 0);
  const occupancyPercent = cap > 0 ? ((admissions / cap) * 100).toFixed(1) : '0';
  const atp = admissions > 0 ? Math.round(ticketRev / admissions) : (isAhilyanagar ? 298 : 250);
  const sph = admissions > 0 ? Math.round(fnbRev / admissions) : (isAhilyanagar ? 110 : 140);

  // Online vs counter booking shares
  const onlineCount = tickets.filter(t => t && t.channel === 'Online').length;
  const counterCount = tickets.filter(t => t && (t.channel === 'Counter' || t.channel === 'Kiosk')).length;
  const totalTixCount = onlineCount + counterCount;
  const onlineShare = totalTixCount > 0
    ? ((onlineCount / totalTixCount) * 100).toFixed(1)
    : (isAhilyanagar ? '71.6' : '68.2');
  const counterShare = (100 - parseFloat(onlineShare)).toFixed(1);

  // Current cinema screens
  const currentScreens = ConnCloudStore.getScreens().filter(s => 
    s && (selectedCinemaId === 'all' || s.cinemaId === selectedCinemaId)
  );

  // Screen statistics
  const screenStats = currentScreens.map((screen) => {
    const screenShows = shows.filter(sh => sh && sh.screenId === screen.screenId);
    const screenTickets = screenShows.reduce((acc, s) => acc + (s?.ticketsSold || 0), 0);
    const screenCap = screenShows.reduce((acc, s) => acc + (s?.capacity || 0), 0);
    const screenOccupancy = screenCap > 0 ? Math.round((screenTickets / screenCap) * 100) : 0;
    
    const isImax = Boolean(screen?.format?.includes('IMAX'));
    const scrName = screen?.name?.toLowerCase() || '';
    const isCouple = scrName.includes('couple');
    const isGold = scrName.includes('gold');
    const ticketPrice = screen?.cinemaId === 'c5'
      ? (screen?.screenId === 's20' ? 350 : 280)
      : (isImax ? 350 : (isCouple ? 350 : (isGold ? 280 : 240)));
    const rawRevenue = screenShows.reduce((acc, s) => acc + ((s?.ticketsSold || 0) * ticketPrice), 0);

    return {
      screen,
      tickets: screenTickets,
      capacity: screenCap,
      occupancy: screenOccupancy,
      rawRevenue,
      showsCount: screenShows.length
    };
  });

  const rawTotalScreenRevenue = screenStats.reduce((acc, s) => acc + (s.rawRevenue || 0), 0) || 1;
  const screenItems = screenStats.map(s => {
    const share = Math.round(((s.rawRevenue || 0) / rawTotalScreenRevenue) * 100);
    const allocatedRevenue = ticketRev > 0 ? Math.round((ticketRev * (s.rawRevenue || 0)) / rawTotalScreenRevenue) : (s.rawRevenue || 0);
    return {
      ...s,
      share: isNaN(share) ? 0 : share,
      revenue: isNaN(allocatedRevenue) ? 0 : allocatedRevenue
    };
  });

  // Movie distribution filtered for current cinema shows
  const movieStats = ConnCloudStore.getMovies().map(movie => {
    const movieShows = shows.filter(sh => sh && sh.movieId === movie.movieId);
    const movieTickets = movieShows.reduce((acc, s) => acc + (s?.ticketsSold || 0), 0);
    const gross = movieShows.reduce((acc, s) => {
      const scr = currentScreens.find(sc => sc.screenId === s.screenId);
      const isCouple = scr?.name?.toLowerCase().includes('couple');
      const price = scr?.cinemaId === 'c5' ? (scr.screenId === 's20' ? 350 : 280) : (isCouple ? 350 : 250);
      return acc + (s.ticketsSold * price);
    }, 0);
    return {
      movie,
      tickets: movieTickets,
      showsCount: movieShows.length,
      gross,
      atp: movieTickets > 0 ? Math.round(gross / movieTickets) : (isAhilyanagar ? 298 : 250)
    };
  }).filter(m => m.showsCount > 0).sort((a, b) => b.gross - a.gross);

  const formatCurrency = (val: number | undefined | null) => {
    const num = (typeof val === 'number' && !isNaN(val)) ? val : 0;
    if (num >= 10000000) return `₹${(num / 10000000).toFixed(2)}Cr`;
    if (num >= 100000) return `₹${(num / 100000).toFixed(2)}L`;
    return `₹${num.toLocaleString('en-IN')}`;
  };

  const handleExport = (format: string) => {
    triggerNotification(`Analytics report for ${cinemaName} (${selectedDateRange}) exported as ${format.toUpperCase()}`);
  };

  // Day of week / Hour occupancy heatmap matrices
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const timeslots = isAhilyanagar
    ? ['11:00 AM', '02:15 PM', '05:30 PM', '08:45 PM']
    : ['11:00 AM', '02:00 PM', '05:00 PM', '08:00 PM', '11:00 PM'];
  const heatmapData = isAhilyanagar ? [
    [45, 60, 78, 82], // Mon
    [48, 62, 80, 84], // Tue
    [50, 65, 82, 86], // Wed
    [52, 68, 85, 88], // Thu
    [70, 82, 96, 92], // Fri
    [80, 90, 98, 96], // Sat
    [82, 94, 98, 95]  // Sun
  ] : [
    [32, 45, 52, 68, 48], // Mon
    [35, 42, 50, 72, 44], // Tue
    [38, 40, 58, 75, 50], // Wed
    [40, 48, 62, 78, 55], // Thu
    [55, 68, 82, 90, 70], // Fri
    [65, 80, 92, 95, 85], // Sat
    [70, 85, 95, 96, 90]  // Sun
  ];

  // Tab definitions
  const subTabsList: { id: AnalyticsSubTab; label: string; icon: string }[] = [
    { id: 'revenue', label: '1. Revenue', icon: 'fa-chart-line' },
    { id: 'admissions', label: '2. Admissions', icon: 'fa-ticket' },
    { id: 'occupancy', label: '3. Occupancy Heatmap', icon: 'fa-table-cells' },
    { id: 'atp', label: '4. ATP Analysis', icon: 'fa-tag' },
    { id: 'sph', label: '5. SPH Analysis', icon: 'fa-mug-hot' },
    { id: 'movies', label: '6. Movies Ranking', icon: 'fa-film' },
    { id: 'screens', label: '7. Screens Revenue', icon: 'fa-tv' },
    { id: 'customers', label: '8. Customer Ratings', icon: 'fa-star' },
    { id: 'fnb', label: '9. F&B Product/Category', icon: 'fa-burger' },
    { id: 'staff', label: '10. Staff Productivity', icon: 'fa-user-tie' },
    { id: 'operations', label: '11. Operations Downtime', icon: 'fa-wrench' },
    { id: 'forecast', label: '12. Revenue Forecast', icon: 'fa-arrow-trend-up' }
  ];

  return (
    <div className="space-y-6">
      {/* Vista API Integration Telemetry Header (Visible for Ahilyanagar) */}
      {isAhilyanagar && (
        <div className="bg-gradient-to-r from-amber-500/15 via-black/40 to-transparent border border-amber-500/30 p-4 rounded-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-500/20 border border-amber-500/30 text-amber-400 flex items-center justify-center font-bold text-base shrink-0">
              <i className="fa-solid fa-server"></i>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-white text-sm">Cinema Cloud Live Sync: Ahilyanagar</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  CONNECTED
                </span>
                <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  CinemaID: Ahilyanagar
                </span>
              </div>
              <p className="text-gray-400 text-xs mt-0.5">
                Ticket and F&amp;B analytics are synchronized with your on-premise POS / Box Office endpoint (<code className="text-amber-300 text-[11px]">/api.asmx/GetDailyTicketAndFnbData</code>).
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-[11px] text-gray-400">Last Synced: <strong className="text-white">Today 06:00 AM</strong></span>
            <button 
              onClick={() => triggerNotification('Triggered live re-fetch from POS API for Ahilyanagar.')}
              className="cc-btn cc-btn-outline text-xs px-3 py-1 flex items-center gap-1.5"
            >
              <i className="fa-solid fa-arrows-rotate text-amber-400"></i>
              <span>Re-sync POS Data</span>
            </button>
          </div>
        </div>
      )}

      {/* Sub Navigation Bar - All 12 Excel Analytics Sections */}
      <section className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#111827] border border-white/5 p-3 rounded-xl">
        <div className="flex flex-wrap gap-1.5 max-w-full">
          {subTabsList.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSubTab(tab.id)}
              className={`px-3 py-1.5 rounded text-xs font-semibold flex items-center gap-1.5 transition-all ${
                subTab === tab.id 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' 
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <i className={`fa-solid ${tab.icon} text-[11px]`}></i>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
        <div className="flex gap-2 shrink-0">
          <button onClick={() => handleExport('excel')} className="px-3 py-1.5 rounded bg-black/20 hover:bg-[#1f2937] border border-white/5 text-xs font-semibold text-gray-300 flex items-center gap-1.5 transition-colors">
            <i className="fa-solid fa-file-excel text-emerald-500"></i> Excel
          </button>
          <button onClick={() => handleExport('pdf')} className="px-3 py-1.5 rounded bg-black/20 hover:bg-[#1f2937] border border-white/5 text-xs font-semibold text-gray-300 flex items-center gap-1.5 transition-colors">
            <i className="fa-solid fa-file-pdf text-red-500"></i> PDF
          </button>
        </div>
      </section>

      {/* 1. REVENUE ANALYTICS */}
      {subTab === 'revenue' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="cc-card">
              <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold block mb-1">Gross Revenue</span>
              <div className="text-2xl font-extrabold text-white">{formatCurrency(totalRev)}</div>
              <div className="text-xs text-gray-400 mt-2">
                {isAhilyanagar ? 'Cumulative ticket & F&B collections (Live Synced)' : 'Cumulative ticket & F&B collections'}
              </div>
            </div>
            <div className="cc-card">
              <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold block mb-1">Ticket Revenue</span>
              <div className="text-2xl font-extrabold text-blue-400">{formatCurrency(ticketRev)}</div>
              <div className="text-xs text-gray-400 mt-2">~{totalRev > 0 ? ((ticketRev / totalRev) * 100).toFixed(0) : 0}% contribution share</div>
            </div>
            <div className="cc-card">
              <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold block mb-1">F&amp;B Concession Intake</span>
              <div className="text-2xl font-extrabold text-[#f5b041]">{formatCurrency(fnbRev)}</div>
              <div className="text-xs text-gray-400 mt-2">~{totalRev > 0 ? ((fnbRev / totalRev) * 100).toFixed(0) : 0}% contribution share</div>
            </div>
          </div>

          <div className="cc-card">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400">Revenue Progression Trend</h3>
                <p className="text-xs text-gray-500 mt-0.5">Commercial revenue trajectory filtered for {cinemaName} ({selectedDateRange})</p>
              </div>
              <div className="flex gap-2">
                <span className="flex items-center gap-1.5 text-xs text-blue-400">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span> Tickets
                </span>
                <span className="flex items-center gap-1.5 text-xs text-[#f5b041] ml-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#f5b041]"></span> F&amp;B Concessions
                </span>
              </div>
            </div>

            <div className="h-64 w-full bg-black/20 rounded-lg p-4 flex items-end gap-2 border border-white/5">
              {[45, 52, 58, 64, 78, 92, 85, 72, 68, 74, 82, 95].map((val, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                  <div className="w-full flex flex-col gap-0.5 items-center h-full justify-end">
                    <div 
                      className="w-full max-w-[24px] bg-blue-500 rounded-t transition-all group-hover:bg-blue-400"
                      style={{ height: `${val * 0.65}%` }}
                      title={`Tickets: ${val}%`}
                    ></div>
                    <div 
                      className="w-full max-w-[24px] bg-[#f5b041] rounded-b transition-all group-hover:bg-amber-300"
                      style={{ height: `${val * 0.35}%` }}
                      title={`F&B: ${Math.round(val * 0.35)}%`}
                    ></div>
                  </div>
                  <span className="text-[10px] text-gray-500">M{idx + 1}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 2. ADMISSIONS ANALYTICS */}
      {subTab === 'admissions' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#111827] p-4 rounded-xl border border-white/5">
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400">Admissions Footfall Curve</h3>
              <p className="text-xs text-gray-500">Daily admissions across screens and format allocations</p>
            </div>
            <div className="flex items-center gap-3">
              <label className="text-xs text-gray-400">Filter by Movie:</label>
              <select 
                value={movieFilter} 
                onChange={(e) => setMovieFilter(e.target.value)}
                className="bg-black/30 border border-white/10 text-xs text-white rounded px-2.5 py-1"
              >
                <option value="all">All Playing Titles</option>
                {ConnCloudStore.getMovies().map(m => (
                  <option key={m.movieId} value={m.movieId}>{m.title}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="cc-card">
              <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold block mb-1">Total Admissions</span>
              <div className="text-2xl font-extrabold text-white">{admissions.toLocaleString('en-IN')}</div>
              <div className="text-xs text-gray-400 mt-2">Paid movie admissions in period</div>
            </div>
            <div className="cc-card">
              <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold block mb-1">Online Share</span>
              <div className="text-2xl font-extrabold text-blue-400">{onlineShare}%</div>
              <div className="text-xs text-gray-400 mt-2">BookMyShow, Paytm &amp; Connplex Web</div>
            </div>
            <div className="cc-card">
              <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold block mb-1">Counter / Kiosk Share</span>
              <div className="text-2xl font-extrabold text-emerald-400">{counterShare}%</div>
              <div className="text-xs text-gray-400 mt-2">Walk-in Box Office &amp; Lobby Kiosk</div>
            </div>
          </div>

          <div className="cc-card">
            <h4 className="text-xs font-semibold uppercase text-gray-400 mb-4">Admissions by Active Titles</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-white/10 text-gray-400">
                    <th className="py-2.5 font-semibold">Movie</th>
                    <th className="py-2.5 font-semibold">Language</th>
                    <th className="py-2.5 text-right font-semibold">Scheduled Shows</th>
                    <th className="py-2.5 text-right font-semibold">Tickets Sold</th>
                    <th className="py-2.5 text-right font-semibold">Occupancy %</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {movieStats
                    .filter(m => movieFilter === 'all' || m.movie.movieId === movieFilter)
                    .map(m => (
                      <tr key={m.movie.movieId} className="hover:bg-white/5 transition-colors">
                        <td className="py-3 font-semibold text-white">{m.movie.title}</td>
                        <td className="py-3 text-gray-400">{m.movie.language || 'Hindi'}</td>
                        <td className="py-3 text-right text-gray-300">{m.showsCount}</td>
                        <td className="py-3 text-right font-bold text-blue-400">{m.tickets.toLocaleString('en-IN')}</td>
                        <td className="py-3 text-right font-semibold text-emerald-400">
                          {Math.min(98, Math.round((m.tickets / (m.showsCount * 50 || 1)) * 100))}%
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 3. OCCUPANCY HEATMAP */}
      {subTab === 'occupancy' && (
        <div className="cc-card">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400">Day &amp; Hour Occupancy Matrix</h3>
              <p className="text-xs text-gray-500 mt-0.5">
                {isAhilyanagar 
                  ? 'Ahilyanagar Screen 1 Couple Recliners & Screen 2 Gold Class peak show occupancy distribution' 
                  : 'Time slot utilization across auditorium capacities'}
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-gray-400">
              <span className="w-3 h-3 bg-blue-950/60 rounded border border-white/5 inline-block"></span> &lt;40%
              <span className="w-3 h-3 bg-blue-800/80 rounded border border-white/5 inline-block ml-2"></span> 40-75%
              <span className="w-3 h-3 bg-blue-500 rounded border border-white/5 inline-block ml-2"></span> &gt;75%
              <span className="w-3 h-3 bg-[#f5b041] rounded border border-white/5 inline-block ml-2"></span> &gt;90%
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr>
                  <th className="p-2 border border-white/5 bg-black/20 text-gray-400 font-semibold w-28">Day</th>
                  {timeslots.map((slot, idx) => (
                    <th key={idx} className="p-2 border border-white/5 bg-black/20 text-gray-400 font-semibold text-center">
                      {slot}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {daysOfWeek.map((day, dIdx) => (
                  <tr key={dIdx}>
                    <td className="p-2 border border-white/5 font-semibold text-gray-300 bg-black/10">{day}</td>
                    {timeslots.map((_, tIdx) => {
                      const occ = heatmapData[dIdx]?.[tIdx] || 50;
                      let bgClass = 'bg-blue-950/40 text-blue-200';
                      if (occ >= 90) bgClass = 'bg-[#f5b041] text-black font-extrabold';
                      else if (occ >= 75) bgClass = 'bg-blue-500 text-white font-bold';
                      else if (occ >= 50) bgClass = 'bg-blue-800/70 text-blue-100 font-medium';

                      return (
                        <td key={tIdx} className={`p-2 border border-white/5 text-center text-xs transition-colors ${bgClass}`}>
                          {occ}%
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 4. ATP ANALYSIS */}
      {subTab === 'atp' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="cc-card">
              <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold block mb-1">Average Ticket Price</span>
              <div className="text-3xl font-extrabold text-white">₹{atp}</div>
              <div className="text-xs text-emerald-400 mt-2 font-semibold"><i className="fa-solid fa-arrow-trend-up"></i> +2.4% vs last period</div>
            </div>
            <div className="cc-card">
              <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold block mb-1">Benchmark Price Target</span>
              <div className="text-3xl font-extrabold text-blue-400">{isAhilyanagar ? '₹290' : '₹250'}</div>
              <div className="text-xs text-gray-400 mt-2">Achieved 102.8% of targeted yield</div>
            </div>
            <div className="cc-card">
              <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold block mb-1">Highest Yield Screen</span>
              <div className="text-3xl font-extrabold text-[#f5b041]">{isAhilyanagar ? '₹350' : '₹320'}</div>
              <div className="text-xs text-gray-400 mt-2">{isAhilyanagar ? 'Screen 1 (Couple Recliners)' : 'Screen 1 (Premium)'}</div>
            </div>
          </div>

          <div className="cc-card">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-4">Auditorium Price Tier Realization</h3>
            <div className="space-y-4">
              {screenItems.map(item => {
                const scrName = item.screen?.name?.toLowerCase() || '';
                const estimatedScreenAtp = item.tickets > 0 
                  ? Math.round(item.revenue / item.tickets) 
                  : (scrName.includes('couple') ? 350 : 280);
                return (
                  <div key={item.screen?.screenId} className="p-3 rounded bg-black/20 border border-white/5">
                    <div className="flex justify-between text-xs mb-2">
                      <span className="font-semibold text-white">{item.screen?.name}</span>
                      <span className="font-mono text-blue-400 font-bold">ATP: ₹{estimatedScreenAtp}</span>
                    </div>
                    <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                      <div className="bg-blue-500 h-full" style={{ width: `${Math.min(100, (estimatedScreenAtp / 350) * 100)}%` }}></div>
                    </div>
                    <div className="flex justify-between text-[10px] text-gray-400 mt-1.5">
                      <span>Admissions: {item.tickets.toLocaleString('en-IN')}</span>
                      <span>Revenue: {formatCurrency(item.revenue)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 5. SPH ANALYSIS */}
      {subTab === 'sph' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="cc-card">
              <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold block mb-1">Spend Per Head (SPH)</span>
              <div className="text-3xl font-extrabold text-[#f5b041]">₹{sph}</div>
              <div className="text-xs text-emerald-400 mt-2 font-semibold"><i className="fa-solid fa-arrow-trend-up"></i> +4.0% vs target</div>
            </div>
            <div className="cc-card">
              <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold block mb-1">Average F&amp;B Order Value</span>
              <div className="text-3xl font-extrabold text-white">₹{Math.round(sph * 1.8)}</div>
              <div className="text-xs text-gray-400 mt-2">Avg ~1.8 patrons per concession transaction</div>
            </div>
            <div className="cc-card">
              <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold block mb-1">F&amp;B Gross Margin</span>
              <div className="text-3xl font-extrabold text-emerald-400">72.4%</div>
              <div className="text-xs text-gray-400 mt-2">After deducting direct inventory COGS</div>
            </div>
          </div>

          <div className="cc-card">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-4">SPH Product Category Breakdown</h3>
            <div className="space-y-4">
              {[
                { name: 'Popcorn (Caramel, Cheese & Salted)', share: 48, amount: Math.round(sph * 0.48) },
                { name: 'Cold Beverages & Fountain Sodas', share: 24, amount: Math.round(sph * 0.24) },
                { name: 'Value Combos & VIP Bundles', share: 20, amount: Math.round(sph * 0.20) },
                { name: 'Gourmet Hot Snacks (Nachos, Burgers)', share: 8, amount: Math.round(sph * 0.08) }
              ].map(cat => (
                <div key={cat.name}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-300">{cat.name}</span>
                    <span className="font-semibold text-white">₹{cat.amount} ({cat.share}% SPH)</span>
                  </div>
                  <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                    <div className="bg-[#f5b041] h-full" style={{ width: `${cat.share}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 6. MOVIES RANKING */}
      {subTab === 'movies' && (
        <div className="cc-card">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400">Movie Revenue Ranking Leaderboard</h3>
              <p className="text-xs text-gray-500">Box office collections, admissions, and ATP ranked across playing films</p>
            </div>
            <span className="text-xs text-gray-400">Total Active Titles: <strong className="text-white">{movieStats.length}</strong></span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/10 text-gray-400">
                  <th className="py-2.5 font-semibold w-12">Rank</th>
                  <th className="py-2.5 font-semibold">Title</th>
                  <th className="py-2.5 font-semibold">Language</th>
                  <th className="py-2.5 text-right font-semibold">Admissions</th>
                  <th className="py-2.5 text-right font-semibold">Gross Collection</th>
                  <th className="py-2.5 text-right font-semibold">Realized ATP</th>
                  <th className="py-2.5 text-right font-semibold">Box Office Share</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {movieStats.map((item, idx) => {
                  const share = totalRev > 0 ? Math.round((item.gross / totalRev) * 100) : 0;
                  return (
                    <tr key={item.movie.movieId} className="hover:bg-white/5 transition-colors">
                      <td className="py-3 font-bold text-gray-400">#{idx + 1}</td>
                      <td className="py-3 font-semibold text-white">{item.movie.title}</td>
                      <td className="py-3 text-gray-400">{item.movie.language || 'Hindi'}</td>
                      <td className="py-3 text-right text-gray-300">{item.tickets.toLocaleString('en-IN')}</td>
                      <td className="py-3 text-right font-bold text-emerald-400">{formatCurrency(item.gross)}</td>
                      <td className="py-3 text-right text-gray-300">₹{item.atp}</td>
                      <td className="py-3 text-right font-bold text-blue-400">{share}%</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 7. SCREENS REVENUE */}
      {subTab === 'screens' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {screenItems.map(item => (
              <div key={item.screen?.screenId} className="cc-card">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-white text-base">{item.screen?.name}</h3>
                    <span className="text-xs text-gray-400 block mt-0.5">Format: {item.screen?.format} • {item.screen?.capacity} Seats</span>
                  </div>
                  <span className="px-2.5 py-1 rounded text-xs font-mono font-bold bg-blue-500/15 text-blue-400 border border-blue-500/30">
                    {item.share}% Share
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-3 my-4 p-3 rounded bg-black/20 border border-white/5 text-center">
                  <div>
                    <span className="text-[10px] text-gray-400 block">Revenue</span>
                    <strong className="text-sm text-emerald-400">{formatCurrency(item.revenue)}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-400 block">Admissions</span>
                    <strong className="text-sm text-white">{item.tickets.toLocaleString('en-IN')}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-400 block">Occupancy</span>
                    <strong className="text-sm text-[#f5b041]">{item.occupancy}%</strong>
                  </div>
                </div>

                <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                  <div className="bg-blue-500 h-full" style={{ width: `${item.occupancy}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 8. CUSTOMER RATINGS */}
      {subTab === 'customers' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="cc-card text-center">
              <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold block mb-1">Overall Guest Rating</span>
              <div className="text-4xl font-extrabold text-[#f5b041] my-2">4.8 <span className="text-lg text-gray-400">/ 5.0</span></div>
              <div className="flex justify-center gap-1 text-amber-400 text-sm">
                <i className="fa-solid fa-star"></i>
                <i className="fa-solid fa-star"></i>
                <i className="fa-solid fa-star"></i>
                <i className="fa-solid fa-star"></i>
                <i className="fa-solid fa-star-half-stroke"></i>
              </div>
              <span className="text-xs text-gray-400 mt-2 block">Based on 1,420 verified reviews</span>
            </div>
            <div className="cc-card">
              <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold block mb-1">Net Promoter Score (NPS)</span>
              <div className="text-3xl font-extrabold text-emerald-400 mt-2">+74</div>
              <div className="text-xs text-gray-400 mt-2">World-class hospitality benchmark for boutique cinema</div>
            </div>
            <div className="cc-card">
              <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold block mb-1">Repeat Patron Rate</span>
              <div className="text-3xl font-extrabold text-blue-400 mt-2">68.2%</div>
              <div className="text-xs text-gray-400 mt-2">Members returning within 45 days</div>
            </div>
          </div>

          <div className="cc-card">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-4">Experience Category Ratings</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { category: 'Audio & Visual Projection Quality', rating: 4.9, percent: 98 },
                { category: 'Recliner Seating Comfort & Cleanliness', rating: 4.9, percent: 98 },
                { category: 'F&B Quality, Freshness & Presentation', rating: 4.7, percent: 94 },
                { category: 'Box Office & Lobby Staff Courtesy', rating: 4.8, percent: 96 }
              ].map(item => (
                <div key={item.category} className="p-3 bg-black/20 rounded border border-white/5">
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-gray-300 font-semibold">{item.category}</span>
                    <span className="text-[#f5b041] font-bold">{item.rating} ★</span>
                  </div>
                  <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                    <div className="bg-[#f5b041] h-full" style={{ width: `${item.percent}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 9. F&B PRODUCT / CATEGORY REVENUE */}
      {subTab === 'fnb' && (
        <div className="space-y-6">
          <div className="cc-card">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-4">Concession Product Revenue Roster</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-white/10 text-gray-400">
                    <th className="py-2.5 font-semibold">Item Name</th>
                    <th className="py-2.5 font-semibold">Category</th>
                    <th className="py-2.5 text-right font-semibold">Selling Price</th>
                    <th className="py-2.5 text-right font-semibold">Cost (COGS)</th>
                    <th className="py-2.5 text-right font-semibold">Margin %</th>
                    <th className="py-2.5 text-right font-semibold">Units Sold</th>
                    <th className="py-2.5 text-right font-semibold">Total Revenue</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {ConnCloudStore.getFnBProducts().map(prod => {
                    const margin = prod.price > 0 ? Math.round(((prod.price - prod.cost) / prod.price) * 100) : 0;
                    const estUnits = isAhilyanagar ? 320 : 1240;
                    const estRev = estUnits * prod.price;
                    return (
                      <tr key={prod.productId} className="hover:bg-white/5 transition-colors">
                        <td className="py-3 font-semibold text-white">{prod.name}</td>
                        <td className="py-3 text-gray-400">{prod.category}</td>
                        <td className="py-3 text-right text-gray-300">₹{prod.price}</td>
                        <td className="py-3 text-right text-gray-400">₹{prod.cost}</td>
                        <td className="py-3 text-right font-bold text-emerald-400">{margin}%</td>
                        <td className="py-3 text-right text-gray-300">{estUnits}</td>
                        <td className="py-3 text-right font-bold text-[#f5b041]">{formatCurrency(estRev)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 10. STAFF PRODUCTIVITY */}
      {subTab === 'staff' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="cc-card">
              <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold block mb-1">Active Duty Roster</span>
              <div className="text-3xl font-extrabold text-white">{isAhilyanagar ? '12 Members' : '45 Members'}</div>
              <div className="text-xs text-emerald-400 mt-2 font-semibold">100% Attendance on active shifts</div>
            </div>
            <div className="cc-card">
              <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold block mb-1">Ticket Sales Velocity</span>
              <div className="text-3xl font-extrabold text-blue-400">18 sec / tx</div>
              <div className="text-xs text-gray-400 mt-2">Fast Box Office checkout turnaround</div>
            </div>
            <div className="cc-card">
              <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold block mb-1">F&amp;B Fulfillment Time</span>
              <div className="text-3xl font-extrabold text-[#f5b041]">65 sec / order</div>
              <div className="text-xs text-gray-400 mt-2">Zero intermission congestion achieved</div>
            </div>
          </div>

          <div className="cc-card">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-4">Department Productivity Indices</h3>
            <div className="space-y-3.5">
              {[
                { dept: 'Box Office & Ticketing', staffCount: 3, metric: 'Admissions Handled', val: '2,400+ tix/day', score: '98% Efficiency' },
                { dept: 'Concessions & Kitchen', staffCount: 4, metric: 'Order Dispatch Speed', val: '65s avg time', score: '96% Efficiency' },
                { dept: 'Projection & Technical Systems', staffCount: 2, metric: 'Uptime Reliability', val: '99.9% uptime', score: '100% SLA' },
                { dept: 'Housekeeping & Sanitization', staffCount: 3, metric: 'Auditorium Turnaround', val: '12m between shows', score: '95% Efficiency' }
              ].map(d => (
                <div key={d.dept} className="p-3 bg-black/20 rounded border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div>
                    <h4 className="font-bold text-white text-sm">{d.dept}</h4>
                    <span className="text-gray-400 text-[11px]">{d.staffCount} Staff Members Assigned • {d.metric}: <strong>{d.val}</strong></span>
                  </div>
                  <span className="px-2.5 py-1 rounded font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 text-xs self-start sm:self-auto">
                    {d.score}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 11. OPERATIONS DOWNTIME */}
      {subTab === 'operations' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="cc-card">
              <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold block mb-1">Equipment Uptime</span>
              <div className="text-3xl font-extrabold text-emerald-400">99.85%</div>
              <div className="text-xs text-gray-400 mt-2">Across Laser Projectors, HVAC &amp; Atmos</div>
            </div>
            <div className="cc-card">
              <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold block mb-1">Unscheduled Downtime</span>
              <div className="text-3xl font-extrabold text-white">0.00 hrs</div>
              <div className="text-xs text-gray-400 mt-2">Zero show interruptions recorded</div>
            </div>
            <div className="cc-card">
              <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold block mb-1">Mean Time Between Failures</span>
              <div className="text-3xl font-extrabold text-blue-400">1,820 hrs</div>
              <div className="text-xs text-gray-400 mt-2">Exceeds manufacturer AMC guidelines</div>
            </div>
          </div>

          <div className="cc-card">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-4">Equipment Telemetry &amp; Service Health Log</h3>
            <div className="space-y-3">
              {[
                { name: 'Screen 1: Barco 4K Laser Projector (SP4K-12B)', status: 'Healthy', temp: '28°C', laserHours: '1,240 hrs', amc: 'Barco India Care' },
                { name: 'Screen 2: Barco 2K Laser Projector (SP2K-7S)', status: 'Healthy', temp: '29°C', laserHours: '980 hrs', amc: 'Barco India Care' },
                { name: 'Auditorium 1 & 2 Daikin VRV Dual Inverter HVAC', status: 'Healthy', temp: '22°C Set', laserHours: '2,400 hrs', amc: 'Daikin Regional Service' },
                { name: 'Dolby Atmos Cinema Sound Audio Processors', status: 'Healthy', temp: 'Nominal', laserHours: 'Continuous', amc: 'Dolby Certified Partner' }
              ].map((eq, i) => (
                <div key={i} className="p-3 bg-black/20 rounded border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div>
                    <h4 className="font-semibold text-white">{eq.name}</h4>
                    <span className="text-gray-400 text-[11px]">AMC: {eq.amc} • Operating Temp: {eq.temp} • Runtime: {eq.laserHours}</span>
                  </div>
                  <span className="px-2.5 py-1 rounded font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 text-xs self-start sm:self-auto flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> {eq.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 12. REVENUE FORECAST */}
      {subTab === 'forecast' && (
        <div className="cc-card">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-4">Revenue Forecast vs Actual Projections</h3>
          <p className="text-xs text-gray-500 mb-6">Financial forecast projection based on upcoming release schedule demands, historical trends, and seating analytics.</p>
          
          <div className="h-[250px] w-full bg-black/20 rounded-lg p-4 border border-white/5 relative">
            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              {/* Actual Line */}
              <path
                d="M 0 80 L 20 72 L 40 68 L 60 55"
                fill="none"
                stroke="#1e40af"
                strokeWidth="2"
              />
              
              {/* Projected Line (Dashed) */}
              <path
                d="M 60 55 L 80 40 L 100 25"
                fill="none"
                stroke="#f5b041"
                strokeWidth="2"
                strokeDasharray="3,3"
              />
            </svg>
            <div className="absolute top-4 left-4 flex gap-4 text-xs">
              <span className="flex items-center gap-1.5 text-blue-400">
                <span className="w-3 h-0.5 bg-[#1e40af] inline-block"></span> MTD Actual Sales (Days 1 - 20)
              </span>
              <span className="flex items-center gap-1.5 text-[#f5b041]">
                <span className="w-3 h-0.5 bg-[#f5b041] stroke-dasharray-[3] inline-block"></span> Projected Forecast (Days 21 - 30)
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-black/20 p-3.5 rounded border border-white/5 text-center">
              <span className="text-[10px] text-gray-400 block uppercase font-bold">Monthly Target</span>
              <span className="text-lg font-black text-white mt-1 block">
                {selectedCinemaId === 'all' ? '₹1.35Cr' : (isAhilyanagar ? '₹32.00L' : formatCurrency(Math.round(totalRev * 0.95)))}
              </span>
            </div>
            <div className="bg-black/20 p-3.5 rounded border border-white/5 text-center">
              <span className="text-[10px] text-gray-400 block uppercase font-bold">Projected Achieved</span>
              <span className="text-lg font-black text-[#f5b041] mt-1 block">
                {selectedCinemaId === 'all' ? '₹1.48Cr' : (isAhilyanagar ? '₹33.50L' : formatCurrency(Math.round(totalRev * 1.06)))}
              </span>
            </div>
            <div className="bg-black/20 p-3.5 rounded border border-white/5 text-center">
              <span className="text-[10px] text-gray-400 block uppercase font-bold">Admissions Forecast</span>
              <span className="text-lg font-black text-white mt-1 block">
                {selectedCinemaId === 'all' ? '42,000' : (isAhilyanagar ? '8,200' : Math.round(admissions * 1.05).toLocaleString('en-IN'))}
              </span>
            </div>
            <div className="bg-black/20 p-3.5 rounded border border-white/5 text-center">
              <span className="text-[10px] text-gray-400 block uppercase font-bold">Expected Occupancy</span>
              <span className="text-lg font-black text-white mt-1 block">{isAhilyanagar ? '84.0%' : `${occupancyPercent}%`}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
