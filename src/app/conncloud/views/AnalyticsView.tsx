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

  const formatCurrency = (val: number) => {
    if (val >= 10000000) return `₹${(val / 10000000).toFixed(2)}Cr`;
    if (val >= 100000) return `₹${(val / 100000).toFixed(2)}L`;
    return `₹${val.toLocaleString('en-IN')}`;
  };

  const handleExport = (format: string) => {
    triggerNotification(`Analytics data exported as ${format.toUpperCase()}`);
  };

  // Day of week / Hour occupancy heatmap matrices
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const timeslots = ['11:00 AM', '02:00 PM', '05:00 PM', '08:00 PM', '11:00 PM'];
  const heatmapData = [
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
              <div className="text-xs text-gray-400 mt-2">Cumulative ticket & F&B collections</div>
            </div>
            <div className="cc-card">
              <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold block mb-1">Ticket Revenue</span>
              <div className="text-2xl font-extrabold text-blue-400">{formatCurrency(ticketRev)}</div>
              <div className="text-xs text-gray-400 mt-2">~{((ticketRev / totalRev) * 100).toFixed(0)}% contribution share</div>
            </div>
            <div className="cc-card">
              <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold block mb-1">F&B Revenue</span>
              <div className="text-2xl font-extrabold text-[#f5b041]">{formatCurrency(fnbRev)}</div>
              <div className="text-xs text-gray-400 mt-2">~{((fnbRev / totalRev) * 100).toFixed(0)}% contribution share</div>
            </div>
          </div>

          <div className="cc-card">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-4">Revenue Contribution by Screen</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {ConnCloudStore.getScreens().slice(0, 4).map((screen, idx) => {
                const share = [38, 28, 20, 14][idx];
                return (
                  <div key={screen.screenId} className="bg-black/25 p-4 rounded-lg border border-white/5">
                    <span className="text-xs font-bold text-white block">{screen.name}</span>
                    <span className="text-lg font-black text-gray-300 block mt-1">{formatCurrency(ticketRev * share / 100)}</span>
                    <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden mt-3">
                      <div className="bg-blue-600 h-full" style={{ width: `${share}%` }}></div>
                    </div>
                    <span className="text-[10px] text-gray-500 block mt-1.5">{share}% of total screen occupancy</span>
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
              {ConnCloudStore.getMovies().slice(0, 4).map((movie, idx) => {
                const admissionsShare = [42, 28, 18, 12][idx];
                return (
                  <div key={movie.movieId}>
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span className="text-white">{movie.title}</span>
                      <span className="text-gray-400">{admissionsShare}% ({Math.round(admissions * admissionsShare / 100).toLocaleString()} tickets)</span>
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
                    else if (val > 70) bg = 'bg-blue-500 text-white';
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
              <p className="text-xs text-gray-500 mb-6">Benchmark price targets: Class A: ₹350, Class B: ₹220</p>
              
              {/* Simple horizontal visual breakdown */}
              <div className="space-y-3.5">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-300">IMAX Premium</span>
                  <span className="font-semibold text-white">₹350 (22% admissions)</span>
                </div>
                <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-blue-500 h-full" style={{ width: '22%' }}></div>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-300">Standard Screens</span>
                  <span className="font-semibold text-white">₹220 (78% admissions)</span>
                </div>
                <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-blue-500 h-full" style={{ width: '78%' }}></div>
                </div>
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
              <span className="text-[10px] text-gray-400 block uppercase font-bold">Aug Target</span>
              <span className="text-lg font-black text-white mt-1 block">₹1.35Cr</span>
            </div>
            <div className="bg-black/20 p-3.5 rounded border border-white/5 text-center">
              <span className="text-[10px] text-gray-400 block uppercase font-bold">Projected Achieved</span>
              <span className="text-lg font-black text-[#f5b041] mt-1 block">₹1.48Cr</span>
            </div>
            <div className="bg-black/20 p-3.5 rounded border border-white/5 text-center">
              <span className="text-[10px] text-gray-400 block uppercase font-bold">Admissions Forecast</span>
              <span className="text-lg font-black text-white mt-1 block">4,200</span>
            </div>
            <div className="bg-black/20 p-3.5 rounded border border-white/5 text-center">
              <span className="text-[10px] text-gray-400 block uppercase font-bold">Expected Occupancy</span>
              <span className="text-lg font-black text-white mt-1 block">74.5%</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
