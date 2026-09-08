import React, { useState } from 'react';
import { ConnCloudStore } from '../../../lib/conncloudData';

interface AnalyticsViewProps {
  selectedCinemaId: string;
  selectedDateRange: string;
  triggerNotification: (msg: string) => void;
}

export default function AnalyticsView({
  selectedCinemaId,
  selectedDateRange,
  triggerNotification
}: AnalyticsViewProps) {
  const [subTab, setSubTab] = useState<'revenue' | 'admissions' | 'occupancy' | 'atp-sph' | 'forecast'>('revenue');

  // Pull calculations from ConnCloudStore
  const currentCinema = ConnCloudStore.getCinemas().find(c => c.cinemaId === selectedCinemaId);
  const isAhilyanagar = selectedCinemaId === 'c5';
  const cinemaName = selectedCinemaId === 'all' ? 'All Cinemas' : (currentCinema?.name || 'Selected Cinema');

  const finance = ConnCloudStore.getFinanceTransactions().filter(t => selectedCinemaId === 'all' || t.cinemaId === selectedCinemaId);
  const shows = ConnCloudStore.getShows().filter(sh => {
    const scr = ConnCloudStore.getScreens().find(s => s.screenId === sh.screenId);
    return selectedCinemaId === 'all' || scr?.cinemaId === selectedCinemaId;
  });

  const ticketRev = finance.filter(t => t.type === 'Income' && t.category === 'Tickets').reduce((acc, t) => acc + t.amount, 0);
  const fnbRev = finance.filter(t => t.type === 'Income' && t.category === 'Food & Beverage').reduce((acc, t) => acc + t.amount, 0);
  const totalRev = ticketRev + fnbRev;
  const admissions = shows.reduce((acc, s) => acc + s.ticketsSold, 0);
  const cap = shows.reduce((acc, s) => acc + s.capacity, 0);
  const occupancyPercent = cap > 0 ? ((admissions / cap) * 100).toFixed(1) : '0';
  const atp = admissions > 0 ? Math.round(ticketRev / admissions) : 0;
  const sph = admissions > 0 ? Math.round(fnbRev / admissions) : 0;

  // Filter screens belonging to this cinema
  const currentScreens = ConnCloudStore.getScreens().filter(s => 
    selectedCinemaId === 'all' || s.cinemaId === selectedCinemaId
  );

  // Compute screen statistics dynamically from shows
  const screenStats = currentScreens.map((screen) => {
    const screenShows = shows.filter(sh => sh.screenId === screen.screenId);
    const screenTickets = screenShows.reduce((acc, s) => acc + s.ticketsSold, 0);
    const screenCap = screenShows.reduce((acc, s) => acc + s.capacity, 0);
    const screenOccupancy = screenCap > 0 ? Math.round((screenTickets / screenCap) * 100) : 0;
    
    // Weight revenue based on screen price tier
    const ticketPrice = screen.format.includes('IMAX') 
      ? 350 
      : (screen.name.toLowerCase().includes('couple') ? 280 : 240);
    const rawRevenue = screenShows.reduce((acc, s) => acc + (s.ticketsSold * ticketPrice), 0);

    return {
      screen,
      tickets: screenTickets,
      capacity: screenCap,
      occupancy: screenOccupancy,
      rawRevenue,
      showsCount: screenShows.length
    };
  });

  const rawTotalScreenRevenue = screenStats.reduce((acc, s) => acc + s.rawRevenue, 0) || 1;
  const screenItems = screenStats.map(s => {
    const share = Math.round((s.rawRevenue / rawTotalScreenRevenue) * 100);
    const allocatedRevenue = ticketRev > 0 ? Math.round((ticketRev * s.rawRevenue) / rawTotalScreenRevenue) : s.rawRevenue;
    return {
      ...s,
      share,
      revenue: allocatedRevenue
    };
  });

  // Movie distribution filtered for current cinema's shows
  const movieStats = ConnCloudStore.getMovies().map(movie => {
    const movieShows = shows.filter(sh => sh.movieId === movie.movieId);
    const movieTickets = movieShows.reduce((acc, s) => acc + s.ticketsSold, 0);
    return {
      movie,
      tickets: movieTickets,
      showsCount: movieShows.length
    };
  }).filter(m => m.showsCount > 0);

  const formatCurrency = (val: number) => {
    if (val >= 10000000) return `₹${(val / 10000000).toFixed(2)}Cr`;
    if (val >= 100000) return `₹${(val / 100000).toFixed(2)}L`;
    return `₹${val.toLocaleString('en-IN')}`;
  };

  const handleExport = (format: string) => {
    triggerNotification(`Analytics report for ${cinemaName} exported as ${format.toUpperCase()}`);
  };

  // Day of week / Hour occupancy heatmap matrices
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const timeslots = ['11:00 AM', '02:00 PM', '05:00 PM', '08:00 PM', '11:00 PM'];
  const heatmapData = isAhilyanagar ? [
    [40, 55, 62, 78, 60], // Mon
    [42, 50, 60, 80, 58], // Tue
    [45, 52, 65, 82, 62], // Wed
    [48, 56, 70, 85, 68], // Thu
    [65, 78, 90, 96, 85], // Fri (Couple Recliners peak)
    [75, 88, 96, 98, 92], // Sat
    [80, 92, 98, 98, 94]  // Sun
  ] : [
    [32, 45, 52, 68, 48], // Mon
    [35, 42, 50, 72, 44], // Tue
    [38, 40, 58, 75, 50], // Wed
    [40, 48, 62, 78, 55], // Thu
    [55, 68, 82, 90, 70], // Fri
    [65, 80, 92, 95, 85], // Sat
    [70, 85, 95, 96, 90]  // Sun
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
                <span className="font-bold text-white text-sm">Vista Cinema Cloud Live Sync: Ahilyanagar</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  CONNECTED
                </span>
                <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  CinemaID: Ahilyanagar
                </span>
              </div>
              <p className="text-gray-400 text-xs mt-0.5">
                Ticket and F&amp;B analytics are synchronized with your on-premise Vista POS / Box Office endpoint (<code className="text-amber-300 text-[11px]">/api.asmx/GetDailyTicketAndFnbData</code>).
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-[11px] text-gray-400">Last Synced: <strong className="text-white">Today 06:00 AM</strong></span>
            <button 
              onClick={() => triggerNotification('Triggered live re-fetch from Vista API for Ahilyanagar.')}
              className="cc-btn cc-btn-outline text-xs px-3 py-1 flex items-center gap-1.5"
            >
              <i className="fa-solid fa-arrows-rotate text-amber-400"></i>
              <span>Re-sync Vista Data</span>
            </button>
          </div>
        </div>
      )}

      {/* View Header */}
      <section className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#111827] border border-white/5 p-4 rounded-xl">
        <div className="flex flex-wrap gap-1">
          {[
            { id: 'revenue', label: 'Revenue Analytics' },
            { id: 'admissions', label: 'Admissions' },
            { id: 'occupancy', label: 'Occupancy Heatmap' },
            { id: 'atp-sph', label: 'ATP & SPH Trends' },
            { id: 'forecast', label: 'Revenue Forecast' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSubTab(tab.id as any)}
              className={`px-3 py-1.5 rounded text-xs font-semibold transition-all ${
                subTab === tab.id 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' 
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <button onClick={() => handleExport('excel')} className="px-3 py-1.5 rounded bg-black/20 hover:bg-[#1f2937] border border-white/5 text-xs font-semibold text-gray-300 flex items-center gap-1.5 transition-colors">
            <i className="fa-solid fa-file-excel text-emerald-500"></i> Excel
          </button>
          <button onClick={() => handleExport('pdf')} className="px-3 py-1.5 rounded bg-black/20 hover:bg-[#1f2937] border border-white/5 text-xs font-semibold text-gray-300 flex items-center gap-1.5 transition-colors">
            <i className="fa-solid fa-file-pdf text-red-500"></i> PDF
          </button>
        </div>
      </section>

      {/* Main View Cards */}
      {subTab === 'revenue' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="cc-card">
              <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold block mb-1">Gross Revenue</span>
              <div className="text-2xl font-extrabold text-white">{formatCurrency(totalRev)}</div>
              <div className="text-xs text-gray-400 mt-2">
                {isAhilyanagar ? 'Cumulative ticket & F&B collections (Vista Synced)' : 'Cumulative ticket & F&B collections'}
              </div>
            </div>
            <div className="cc-card">
              <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold block mb-1">Ticket Revenue</span>
              <div className="text-2xl font-extrabold text-blue-400">{formatCurrency(ticketRev)}</div>
              <div className="text-xs text-gray-400 mt-2">~{totalRev > 0 ? ((ticketRev / totalRev) * 100).toFixed(0) : 0}% contribution share</div>
            </div>
            <div className="cc-card">
              <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold block mb-1">F&B Revenue</span>
              <div className="text-2xl font-extrabold text-[#f5b041]">{formatCurrency(fnbRev)}</div>
              <div className="text-xs text-gray-400 mt-2">~{totalRev > 0 ? ((fnbRev / totalRev) * 100).toFixed(0) : 0}% contribution share</div>
            </div>
          </div>

          <div className="cc-card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400">
                Revenue Contribution by Screen ({currentScreens.length} {currentScreens.length === 1 ? 'Screen' : 'Screens'})
              </h3>
              {isAhilyanagar && (
                <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                  Ahilyanagar Boutique Luxury Setup
                </span>
              )}
            </div>
            <div className={`grid grid-cols-1 sm:grid-cols-2 ${currentScreens.length > 2 ? 'md:grid-cols-4' : 'md:grid-cols-2'} gap-4`}>
              {screenItems.map((item) => {
                return (
                  <div key={item.screen.screenId} className="bg-black/25 p-4 rounded-lg border border-white/5 hover:border-white/15 transition-colors">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-xs font-bold text-white block">{item.screen.name}</span>
                        <span className="text-[10px] text-gray-400 block mt-0.5">{item.screen.format}</span>
                      </div>
                      <span className="text-[10px] font-bold text-amber-300 bg-amber-500/15 px-2 py-0.5 rounded border border-amber-500/30 whitespace-nowrap">
                        {item.screen.capacity} Seats
                      </span>
                    </div>
                    <span className="text-xl font-black text-gray-200 block mt-3">{formatCurrency(item.revenue)}</span>
                    <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden mt-3">
                      <div className="bg-blue-600 h-full" style={{ width: `${item.share}%` }}></div>
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-gray-400 mt-2">
                      <span className="font-semibold text-blue-400">{item.share}% of box office</span>
                      <span>{item.occupancy}% avg occupancy</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {subTab === 'admissions' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="cc-card">
              <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold block mb-1">Total Footfalls</span>
              <div className="text-2xl font-extrabold text-white">{admissions.toLocaleString('en-IN')}</div>
              <div className="text-xs text-gray-400 mt-2">Admissions collected for selected range</div>
            </div>
            <div className="cc-card">
              <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold block mb-1">Online Share</span>
              <div className="text-2xl font-extrabold text-emerald-400">68.2%</div>
              <div className="text-xs text-gray-400 mt-2">App and website online tickets bookings</div>
            </div>
            <div className="cc-card">
              <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold block mb-1">POS / Counter Share</span>
              <div className="text-2xl font-extrabold text-gray-300">31.8%</div>
              <div className="text-xs text-gray-400 mt-2">Box office and terminal ticket kiosk orders</div>
            </div>
          </div>

          <div className="cc-card">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-4">Admissions Distribution by Movie</h3>
            <div className="space-y-3">
              {(movieStats.length > 0 ? movieStats : ConnCloudStore.getMovies().slice(0, 4).map(m => ({ movie: m, tickets: Math.round(admissions / 4), showsCount: 1 }))).map((stat) => {
                const totalMovieTix = movieStats.reduce((acc, m) => acc + m.tickets, 0) || admissions || 1;
                const admissionsShare = Math.round((stat.tickets / totalMovieTix) * 100);
                return (
                  <div key={stat.movie.movieId}>
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span className="text-white">{stat.movie.title}</span>
                      <span className="text-gray-400">{admissionsShare}% ({stat.tickets.toLocaleString('en-IN')} tickets)</span>
                    </div>
                    <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                      <div className="bg-emerald-500 h-full" style={{ width: `${admissionsShare}%` }}></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {subTab === 'occupancy' && (
        <div className="cc-card">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400">Day-Hour Heatmap</h3>
              <p className="text-xs text-gray-500 mt-1">Color intensity represents average show seat occupancy levels.</p>
            </div>
            <div className="flex gap-4 text-[10px] text-gray-400">
              <span className="flex items-center gap-1"><span className="w-3 h-3 bg-blue-950 border border-white/5 rounded"></span> &lt; 40%</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 bg-blue-700 rounded"></span> 40% - 70%</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 bg-blue-500 rounded"></span> 70% - 90%</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 bg-[#f5b041] rounded"></span> &gt; 90%</span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <div className="min-w-[600px] space-y-2">
              <div className="grid grid-cols-6 gap-2 text-center text-[10px] font-bold text-gray-400">
                <div></div>
                {timeslots.map((t) => <div key={t}>{t}</div>)}
              </div>
              {daysOfWeek.map((day, dIdx) => (
                <div key={day} className="grid grid-cols-6 gap-2 items-center">
                  <div className="text-left text-xs font-semibold text-gray-300">{day}</div>
                  {heatmapData[dIdx].map((val, tIdx) => {
                    let bg = 'bg-blue-950 text-blue-300';
                    if (val > 90) bg = 'bg-[#f5b041] text-blue-950 font-bold';
                    else if (val > 70) bg = 'bg-blue-50 text-white';
                    else if (val > 40) bg = 'bg-blue-700 text-blue-100';

                    return (
                      <div 
                        key={tIdx} 
                        className={`py-3 rounded border border-white/5 text-center text-xs transition-transform hover:scale-105 ${bg}`}
                      >
                        {val}%
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {subTab === 'atp-sph' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="cc-card">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-4">Average Ticket Price (ATP)</h3>
              <div className="flex items-baseline gap-2.5 mb-2">
                <span className="text-3xl font-black text-white">₹{atp}</span>
                <span className="text-xs text-emerald-400 font-semibold"><i className="fa-solid fa-arrow-trend-up"></i> +1.8% vs last month</span>
              </div>
              <p className="text-xs text-gray-500 mb-6">
                {isAhilyanagar 
                  ? 'Benchmark price targets: Couple Recliner: ₹280, Gold Class: ₹240' 
                  : 'Benchmark price targets: Class A: ₹350, Class B: ₹220'}
              </p>
              
              {/* Dynamic screen price breakdown */}
              <div className="space-y-3.5">
                {screenItems.map(item => {
                  const screenTicketShare = admissions > 0 ? Math.round((item.tickets / admissions) * 100) : item.share;
                  const estimatedScreenAtp = item.tickets > 0 ? Math.round(item.revenue / item.tickets) : (item.screen.name.includes('Couple') ? 280 : 240);
                  return (
                    <div key={item.screen.screenId}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-300">{item.screen.name}</span>
                        <span className="font-semibold text-white">₹{estimatedScreenAtp} ({screenTicketShare}% admissions)</span>
                      </div>
                      <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-blue-500 h-full" style={{ width: `${screenTicketShare}%` }}></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="cc-card">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-4">Spend Per Head (SPH)</h3>
              <div className="flex items-baseline gap-2.5 mb-2">
                <span className="text-3xl font-black text-[#f5b041]">₹{sph}</span>
                <span className="text-xs text-emerald-400 font-semibold"><i className="fa-solid fa-arrow-trend-up"></i> +4.0% vs last month</span>
              </div>
              <p className="text-xs text-gray-500 mb-6">Benchmark target: ₹150 SPH across screens</p>
              
              <div className="space-y-3.5">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-300">Popcorn & Beverages</span>
                  <span className="font-semibold text-white">₹110 (65% share)</span>
                </div>
                <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-[#f5b041] h-full" style={{ width: '65%' }}></div>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-300">Combos & Snacks</span>
                  <span className="font-semibold text-white">₹32 (35% share)</span>
                </div>
                <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-[#f5b041] h-full" style={{ width: '35%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

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
                <span className="w-3 h-0.5 bg-[#1e40af] inline-block"></span> Actual Sales (Aug 1 - Aug 20)
              </span>
              <span className="flex items-center gap-1.5 text-[#f5b041]">
                <span className="w-3 h-0.5 bg-[#f5b041] stroke-dasharray-[3] inline-block"></span> Projected Forecast (Aug 21 - Aug 30)
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-black/20 p-3.5 rounded border border-white/5 text-center">
              <span className="text-[10px] text-gray-400 block uppercase font-bold">Monthly Target</span>
              <span className="text-lg font-black text-white mt-1 block">
                {selectedCinemaId === 'all' ? '₹1.35Cr' : formatCurrency(Math.round(totalRev * 0.95))}
              </span>
            </div>
            <div className="bg-black/20 p-3.5 rounded border border-white/5 text-center">
              <span className="text-[10px] text-gray-400 block uppercase font-bold">Projected Achieved</span>
              <span className="text-lg font-black text-[#f5b041] mt-1 block">
                {selectedCinemaId === 'all' ? '₹1.48Cr' : formatCurrency(Math.round(totalRev * 1.06))}
              </span>
            </div>
            <div className="bg-black/20 p-3.5 rounded border border-white/5 text-center">
              <span className="text-[10px] text-gray-400 block uppercase font-bold">Admissions Forecast</span>
              <span className="text-lg font-black text-white mt-1 block">
                {selectedCinemaId === 'all' ? '42,000' : Math.round(admissions * 1.05).toLocaleString('en-IN')}
              </span>
            </div>
            <div className="bg-black/20 p-3.5 rounded border border-white/5 text-center">
              <span className="text-[10px] text-gray-400 block uppercase font-bold">Expected Occupancy</span>
              <span className="text-lg font-black text-white mt-1 block">{occupancyPercent}%</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
