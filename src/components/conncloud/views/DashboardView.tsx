import React from 'react';
import { ConnCloudStore, Cinema } from '../../../lib/conncloudData';

interface DashboardViewProps {
  selectedCinemaId: string;
  selectedDateRange: string;
  onNavigate: (route: string) => void;
  triggerNotification: (msg: string) => void;
}

export default function DashboardView({
  selectedCinemaId,
  selectedDateRange,
  onNavigate,
  triggerNotification
}: DashboardViewProps) {
  // Pull data from central state store
  const cinemas = ConnCloudStore.getCinemas();
  const screens = ConnCloudStore.getScreens().filter(s => selectedCinemaId === 'all' || s.cinemaId === selectedCinemaId);
  const shows = ConnCloudStore.getShows().filter(sh => {
    const screenMatch = selectedCinemaId === 'all' || 
      ConnCloudStore.getScreens().find(scr => scr.screenId === sh.screenId)?.cinemaId === selectedCinemaId;
    return screenMatch; // In standard implementation, dateRange filter applies here as well
  });
  const finance = ConnCloudStore.getFinanceTransactions().filter(t => selectedCinemaId === 'all' || t.cinemaId === selectedCinemaId);
  const fnbProducts = ConnCloudStore.getFnBProducts();
  const equipment = ConnCloudStore.getEquipment().filter(eq => {
    const scr = ConnCloudStore.getScreens().find(s => s.screenId === eq.screenId);
    return selectedCinemaId === 'all' || scr?.cinemaId === selectedCinemaId;
  });

  // KPI Calculations
  const ticketRevenue = finance.filter(t => t.type === 'Income' && t.category === 'Tickets').reduce((acc, t) => acc + t.amount, 0);
  const fnbRevenue = finance.filter(t => t.type === 'Income' && t.category === 'Food & Beverage').reduce((acc, t) => acc + t.amount, 0);
  const expenses = finance.filter(t => t.type === 'Expense').reduce((acc, t) => acc + t.amount, 0);
  
  // Total Revenue
  const totalRevenue = ticketRevenue + fnbRevenue;
  
  // Admissions
  const admissions = shows.reduce((acc, s) => acc + s.ticketsSold, 0);
  const totalCapacity = shows.reduce((acc, s) => acc + s.capacity, 0);
  
  // Occupancy %
  const occupancy = totalCapacity > 0 ? parseFloat(((admissions / totalCapacity) * 100).toFixed(1)) : 0;
  
  // ATP
  const atp = admissions > 0 ? Math.round(ticketRevenue / admissions) : 0;
  
  // SPH
  const sph = admissions > 0 ? Math.round(fnbRevenue / admissions) : 0;

  // ROI
  const totalInvestment = 25000000; // Mock franchise launch budget in INR
  const netProfit = totalRevenue - expenses;
  const roi = totalInvestment > 0 ? parseFloat(((netProfit / totalInvestment) * 100).toFixed(1)) : 0;

  const formatCurrency = (val: number) => {
    if (val >= 10000000) return `₹${(val / 10000000).toFixed(2)}Cr`;
    if (val >= 100000) return `₹${(val / 100000).toFixed(2)}L`;
    return `₹${val.toLocaleString('en-IN')}`;
  };

  // Sparkline generator
  const renderSparkline = (points: number[], isUp: boolean) => {
    const width = 60;
    const height = 20;
    const min = Math.min(...points);
    const max = Math.max(...points);
    const range = max - min || 1;
    const coords = points.map((p, i) => {
      const x = (i / (points.length - 1)) * width;
      const y = height - ((p - min) / range) * height;
      return `${x},${y}`;
    }).join(' ');
    return (
      <svg className="w-[60px] h-[20px]" viewBox={`0 0 ${width} ${height}`}>
        <polyline fill="none" stroke={isUp ? '#10b981' : '#ef4444'} strokeWidth="1.5" points={coords} />
      </svg>
    );
  };

  // Filter shows to display dynamic list of active playing items
  const activeShows = shows.slice(0, 5).map(s => {
    const movie = ConnCloudStore.getMovies().find(m => m.movieId === s.movieId);
    const scr = ConnCloudStore.getScreens().find(sc => sc.screenId === s.screenId);
    return {
      screenName: scr?.name || 'Screen',
      movieTitle: movie?.title || 'Unknown Movie',
      timeSlot: s.time,
      occupancy: Math.round((s.ticketsSold / s.capacity) * 100)
    };
  });

  return (
    <div className="space-y-6">
      {/* Banner */}
      <section className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[#111827] border border-white/5 p-6 rounded-xl">
        <div>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase tracking-wide">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 cc-pulse-live"></span>
            Live Operational Telemetry
          </span>
          <h1 className="text-2xl font-bold mt-2 tracking-tight">Executive Dashboard</h1>
          <p className="text-sm text-gray-400 mt-1">
            Real-time business visibility across your cinema franchise portals.
          </p>
        </div>
        <div className="flex gap-2.5">
          <button 
            onClick={() => {
              triggerNotification('Revenue records exported.');
              onNavigate('/conncloud/reports');
            }} 
            className="cc-btn cc-btn-outline"
          >
            <i className="fa-solid fa-download"></i> Export Revenue
          </button>
          <button 
            onClick={() => onNavigate('/conncloud/operations/screens')} 
            className="cc-btn cc-btn-primary"
          >
            View Live Screens
          </button>
        </div>
      </section>

      {/* KPI Cards Grid */}
      <section className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {[
          { label: "Today's Revenue", value: formatCurrency(totalRevenue / 30), trend: "+8.2%", isUp: true, spark: [10, 15, 8, 20, 25, 18, 30], desc: "Calculated as Ticket sales + Food & Beverage collections today." },
          { label: "Weekly Revenue", value: formatCurrency(totalRevenue / 4), trend: "+5.4%", isUp: true, spark: [20, 24, 22, 28, 25, 32, 35], desc: "Accumulated sales over the last 7 calendar days." },
          { label: "Monthly Revenue", value: formatCurrency(totalRevenue), trend: "+3.1%", isUp: true, spark: [15, 18, 21, 20, 24, 23, 28], desc: "Accumulated revenue for the current monthly cycle." },
          { label: "ROI Status", value: `${roi}%`, trend: "+1.2pt", isUp: true, spark: [12, 14, 13, 16, 15, 17, 18], desc: "Return on investment calculated as Net Profit / Franchise investment." },
          { label: "Admissions", value: admissions.toLocaleString('en-IN'), trend: "+6.7%", isUp: true, spark: [10, 14, 18, 15, 22, 26, 28], desc: "Total footfalls/tickets sold across all show schedules." },
          { label: "Avg Occupancy", value: `${occupancy}%`, trend: "-2.1%", isUp: false, spark: [75, 73, 72, 70, 71, 69, 68], desc: "Percent of seats occupied across all cinema screens." },
          { label: "ATP (Ticket Price)", value: `₹${atp}`, trend: "+1.8%", isUp: true, spark: [205, 208, 210, 209, 212, 214, 215], desc: "Average Ticket Price calculated as Ticket Revenue / Admissions." },
          { label: "SPH (F&B Spend)", value: `₹${sph}`, trend: "+4.0%", isUp: true, spark: [130, 133, 135, 138, 136, 140, 142], desc: "Spend Per Head calculated as F&B Revenue / Admissions." },
          { label: "Online Booking", value: "68.2%", trend: "+11.3%", isUp: true, spark: [55, 58, 60, 62, 65, 67, 68], desc: "Percentage of bookings originating from web/app channels." },
          { label: "Counter Revenue", value: formatCurrency(ticketRevenue * 0.28), trend: "-3.4%", isUp: false, spark: [18, 17, 17, 17, 17, 17, 16], desc: "Ticket revenue collected physically at box office counters." },
          { label: "F&B Sales", value: formatCurrency(fnbRevenue), trend: "+7.9%", isUp: true, spark: [12, 14, 13, 16, 15, 17, 18], desc: "Total snacks, popcorn, beverages, and combo sales." },
          { label: "Customer Rating", value: "4.6 ★", trend: "+0.2", isUp: true, spark: [44, 44, 45, 45, 45, 46, 46], desc: "Aggregate guest satisfaction score out of 5 stars." }
        ].map((kpi, idx) => (
          <div key={idx} className="cc-card relative group cursor-pointer hover:border-[#f5b041]/30">
            {/* Tooltip */}
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-48 bg-gray-900 border border-white/10 text-xs text-gray-300 p-2 rounded shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 z-30 text-center">
              {kpi.desc}
            </div>

            <div className="flex justify-between items-center mb-2">
              <span className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">{kpi.label}</span>
              {renderSparkline(kpi.spark, kpi.isUp)}
            </div>
            <div className="text-xl font-bold tracking-tight text-white">{kpi.value}</div>
            <div className={`flex items-center gap-0.5 text-xs font-semibold mt-1.5 ${kpi.isUp ? 'text-emerald-400' : 'text-red-400'}`}>
              <i className={`fa-solid ${kpi.isUp ? 'fa-caret-up' : 'fa-caret-down'}`}></i>
              <span>{kpi.trend}</span>
            </div>
          </div>
        ))}
      </section>

      {/* Grid: Charts, Live, and Alerts */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Revenue Trend SVG Preview */}
        <div className="lg:col-span-2 cc-card flex flex-col justify-between">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-semibold tracking-wider text-gray-400 uppercase">Revenue Performance Trend</h3>
            <button onClick={() => onNavigate('/conncloud/analytics/revenue')} className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1">
              View Analytics <i className="fa-solid fa-arrow-right"></i>
            </button>
          </div>
          
          {/* Custom SVG line chart */}
          <div className="h-[200px] w-full bg-black/20 rounded-lg p-2 border border-white/5 relative">
            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              {/* Grid Lines */}
              <line x1="0" y1="25" x2="100" y2="25" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />
              <line x1="0" y1="50" x2="100" y2="50" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />
              <line x1="0" y1="75" x2="100" y2="75" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />
              
              {/* F&B Trend Path */}
              <path
                d="M 0 85 L 15 80 L 30 83 L 45 75 L 60 70 L 75 62 L 90 58 L 100 55"
                fill="none"
                stroke="#f5b041"
                strokeWidth="1.5"
                opacity="0.85"
              />

              {/* Tickets Trend Path */}
              <path
                d="M 0 70 L 15 65 L 30 55 L 45 60 L 60 48 L 75 35 L 90 42 L 100 28"
                fill="none"
                stroke="#1e40af"
                strokeWidth="2.5"
              />
            </svg>
            
            {/* Absolute positioning tags */}
            <div className="absolute top-2 left-2 flex gap-4 text-[10px]">
              <span className="flex items-center gap-1.5 text-blue-400">
                <span className="w-2.5 h-1 bg-[#1e40af] inline-block"></span> Tickets
              </span>
              <span className="flex items-center gap-1.5 text-[#f5b041]">
                <span className="w-2.5 h-1 bg-[#f5b041] inline-block"></span> F&B Sales
              </span>
            </div>
          </div>

          <div className="flex justify-between items-center text-xs text-gray-400 mt-4">
            <span>Period: Last 30 Days</span>
            <span>Relational Margin: ~42.5%</span>
          </div>
        </div>

        {/* Live Screens Summary */}
        <div className="cc-card">
          <h3 className="text-sm font-semibold tracking-wider text-gray-400 uppercase mb-4">Live Screen Status</h3>
          <div className="space-y-3.5">
            {screens.slice(0, 4).map((screen, idx) => {
              const show = activeShows[idx % activeShows.length];
              return (
                <div key={idx} className="flex justify-between items-center p-2.5 rounded bg-black/20 border border-white/5 hover:border-white/10 transition-colors">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${
                        screen.status === 'Healthy' ? 'bg-emerald-500' : (screen.status === 'Warning' ? 'bg-amber-500' : 'bg-red-500')
                      }`}></span>
                      <span className="text-xs font-semibold text-white">{screen.name}</span>
                    </div>
                    <div className="text-[10px] text-gray-400 mt-0.5">{show?.movieTitle || 'No Show'} • {show?.timeSlot}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-bold text-[#f5b041]">{show?.occupancy}%</div>
                    <div className="text-[9px] text-gray-400 uppercase">Occupancy</div>
                  </div>
                </div>
              );
            })}
          </div>
          <button 
            onClick={() => onNavigate('/conncloud/operations/screens')}
            className="w-full mt-4 cc-btn cc-btn-outline text-xs"
          >
            Manage Operations Shell
          </button>
        </div>
      </section>

      {/* Grid: Movie Leaderboard, Alerts, and Quick Actions */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Movie Leaderboard */}
        <div className="lg:col-span-2 cc-card">
          <h3 className="text-sm font-semibold tracking-wider text-gray-400 uppercase mb-4">Top Performing Movies</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-white/10 text-gray-400">
                  <th className="pb-3 font-semibold">Rank</th>
                  <th className="pb-3 font-semibold">Movie</th>
                  <th className="pb-3 font-semibold text-right">Admissions</th>
                  <th className="pb-3 font-semibold text-right">Revenue</th>
                  <th className="pb-3 font-semibold text-right">ATP</th>
                </tr>
              </thead>
              <tbody>
                {ConnCloudStore.getMovies().slice(0, 4).map((movie, index) => {
                  const gross = (index === 0 ? 4850000 : index === 1 ? 3200000 : index === 2 ? 1800000 : 950000);
                  const adm = (index === 0 ? 22000 : index === 1 ? 14500 : index === 2 ? 8200 : 4300);
                  return (
                    <tr 
                      key={movie.movieId} 
                      onClick={() => onNavigate(`/conncloud/movies`)}
                      className="border-b border-white/5 hover:bg-white/5 cursor-pointer transition-colors"
                    >
                      <td className="py-3 font-bold text-gray-400">#{index + 1}</td>
                      <td className="py-3 font-semibold text-white">{movie.title}</td>
                      <td className="py-3 text-right text-gray-300">{adm.toLocaleString('en-IN')}</td>
                      <td className="py-3 text-right text-emerald-400 font-medium">{formatCurrency(gross)}</td>
                      <td className="py-3 text-right text-gray-300">₹{Math.round(gross / adm)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Alerts & Critical Statuses */}
        <div className="cc-card flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-semibold tracking-wider text-gray-400 uppercase mb-4 font-display">System Alerts</h3>
            <div className="space-y-3">
              {ConnCloudStore.getNotifications().slice(0, 3).map((n) => (
                <div 
                  key={n.notificationId} 
                  className={`p-3 rounded border text-xs flex gap-2.5 items-start ${
                    n.type === 'Critical' 
                      ? 'bg-red-500/5 border-red-500/20 text-red-200' 
                      : (n.type === 'Warning' ? 'bg-amber-500/5 border-amber-500/20 text-amber-200' : 'bg-blue-500/5 border-blue-500/20 text-blue-200')
                  }`}
                >
                  <i className={`fa-solid mt-0.5 ${
                    n.type === 'Critical' ? 'fa-triangle-exclamation' : (n.type === 'Warning' ? 'fa-circle-exclamation' : 'fa-info-circle')
                  }`}></i>
                  <div>
                    <p className="font-semibold leading-tight">{n.message}</p>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-[10px] text-gray-400">{n.timestamp}</span>
                      <button 
                        onClick={() => onNavigate(n.action)} 
                        className="text-[10px] underline text-blue-400 hover:text-blue-300"
                      >
                        Action
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Quick Actions grid */}
          <div className="mt-6 pt-4 border-t border-white/5">
            <h4 className="text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-3">Quick Actions</h4>
            <div className="grid grid-cols-2 gap-2">
              <button onClick={() => onNavigate('/conncloud/operations/maintenance')} className="p-2.5 rounded bg-black/20 hover:bg-[#1f2937] border border-white/5 text-[11px] font-semibold flex items-center gap-2 transition-colors">
                <i className="fa-solid fa-screwdriver-wrench text-blue-400"></i> Create Ticket
              </button>
              <button onClick={() => onNavigate('/conncloud/finance/expenses')} className="p-2.5 rounded bg-black/20 hover:bg-[#1f2937] border border-white/5 text-[11px] font-semibold flex items-center gap-2 transition-colors">
                <i className="fa-solid fa-file-invoice-dollar text-[#f5b041]"></i> Add Expense
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
