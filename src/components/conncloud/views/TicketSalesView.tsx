import React, { useState } from 'react';
import { ConnCloudStore, Ticket } from '../../../lib/conncloudData';

interface TicketSalesViewProps {
  selectedCinemaId: string;
  selectedDateRange: string;
  triggerNotification: (msg: string) => void;
}

export default function TicketSalesView({
  selectedCinemaId,
  selectedDateRange,
  triggerNotification
}: TicketSalesViewProps) {
  const [subSection, setSubSection] = useState<'sales' | 'seat-map' | 'discounts' | 'refunds'>('sales');
  const [channelFilter, setChannelFilter] = useState<'all' | 'Online' | 'Counter' | 'Kiosk'>('all');

  const isAhilyanagar = selectedCinemaId === 'c5';
  const currentCinema = ConnCloudStore.getCinemas().find(c => c.cinemaId === selectedCinemaId);
  const cinemaName = selectedCinemaId === 'all' ? 'All Cinemas' : (currentCinema?.name || 'Selected Cinema');
  const screens = ConnCloudStore.getScreens().filter(s => selectedCinemaId === 'all' || s.cinemaId === selectedCinemaId);

  const [selectedScreenId, setSelectedScreenId] = useState<string>(screens[0]?.screenId || 's20');

  // Pull tickets filtered by cinema and channel, sorted latest first
  const tickets = ConnCloudStore.getTickets().filter(t => {
    const channelMatch = channelFilter === 'all' || t.channel === channelFilter;
    const scr = ConnCloudStore.getScreens().find(sc => sc.screenId === t.screenId);
    const cinemaMatch = selectedCinemaId === 'all' || scr?.cinemaId === selectedCinemaId;
    return channelMatch && cinemaMatch;
  }).sort((a, b) => b.date.localeCompare(a.date));

  const formatCurrency = (val: number) => {
    return `₹${val.toLocaleString('en-IN')}`;
  };

  // Seat Map Configuration based on Selected Screen
  const activeScreen = screens.find(s => s.screenId === selectedScreenId) || screens[0];
  const isCoupleScreen = isAhilyanagar && (activeScreen?.name.toLowerCase().includes('couple') || activeScreen?.screenId === 's20');
  
  const rows = isCoupleScreen ? ['A', 'B', 'C', 'D'] : ['A', 'B', 'C', 'D', 'E', 'F'];
  const cols = isCoupleScreen ? [1, 2, 3, 4, 5] : Array.from({ length: 10 }, (_, i) => i + 1);

  // Seed status: Available, Sold, Reserved, Blocked, Complimentary
  const [seatStatusMap, setSeatStatusMap] = useState<Record<string, 'Available' | 'Sold' | 'Reserved' | 'Blocked' | 'Complimentary'>>({
    'A1': 'Sold', 'A2': 'Sold', 'A3': 'Reserved', 'B1': 'Sold', 'B2': 'Sold', 'B4': 'Blocked',
    'C2': 'Sold', 'C3': 'Complimentary', 'D1': 'Sold', 'D4': 'Reserved'
  });

  const handleSeatClick = (seatId: string) => {
    const current = seatStatusMap[seatId] || 'Available';
    const nextStatusMap: Record<typeof current, typeof current> = {
      'Available': 'Sold',
      'Sold': 'Reserved',
      'Reserved': 'Blocked',
      'Blocked': 'Complimentary',
      'Complimentary': 'Available'
    };
    const next = nextStatusMap[current];
    setSeatStatusMap(prev => ({ ...prev, [seatId]: next }));
    triggerNotification(`Seat ${seatId} status changed to ${next}`);
  };

  const getSeatColor = (status: 'Available' | 'Sold' | 'Reserved' | 'Blocked' | 'Complimentary') => {
    switch (status) {
      case 'Sold': return 'bg-blue-600 border-blue-500 text-white shadow-sm';
      case 'Reserved': return 'bg-amber-500 border-amber-400 text-blue-950 font-bold';
      case 'Blocked': return 'bg-red-600 border-red-500 text-white';
      case 'Complimentary': return 'bg-purple-600 border-purple-500 text-white';
      default: return 'bg-transparent border-white/20 text-gray-400 hover:border-white/50 hover:bg-white/5';
    }
  };

  const totalTicketsSold = tickets.filter(t => t.status === 'Confirmed').length;
  const totalRevenue = tickets.filter(t => t.status === 'Confirmed').reduce((acc, t) => acc + t.price, 0);

  return (
    <div className="space-y-6">
      {/* Vista API Integration Telemetry Header (Ahilyanagar) */}
      {isAhilyanagar && (
        <div className="bg-gradient-to-r from-amber-500/15 via-black/40 to-transparent border border-amber-500/30 p-4 rounded-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-500/20 border border-amber-500/30 text-amber-400 flex items-center justify-center font-bold text-base shrink-0">
              <i className="fa-solid fa-ticket"></i>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-white text-sm">Vista Box Office &amp; POS Sync: Ahilyanagar</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  CONNECTED
                </span>
                <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  CinemaID: Ahilyanagar
                </span>
              </div>
              <p className="text-gray-400 text-xs mt-0.5">
                Ticket transactions and real-time seat inventory are synchronized from on-premise Vista Box Office (<code className="text-amber-300 text-[11px]">/api.asmx/GetDailyTicketAndFnbData</code>).
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-[11px] text-gray-400">POS Channel: <strong className="text-white">Active</strong></span>
            <button 
              onClick={() => triggerNotification('Re-fetching live ticket ledger from Vista WebService...')}
              className="cc-btn cc-btn-outline text-xs px-3 py-1 flex items-center gap-1.5"
            >
              <i className="fa-solid fa-arrows-rotate text-amber-400"></i>
              <span>Re-sync Tickets</span>
            </button>
          </div>
        </div>
      )}

      {/* KPI Overview Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="cc-card p-3">
          <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider block mb-0.5">Confirmed Bookings</span>
          <div className="text-xl font-extrabold text-white">
            {totalTicketsSold.toLocaleString('en-IN')}
          </div>
          <span className="text-[10px] text-gray-500 mt-1 block">Ledger transaction count</span>
        </div>
        <div className="cc-card p-3">
          <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider block mb-0.5">Online Web/App Share</span>
          <div className="text-xl font-extrabold text-emerald-400">
            {tickets.length > 0 ? Math.round((tickets.filter(t => t.channel === 'Online').length / tickets.length) * 100) : 68}%
          </div>
          <span className="text-[10px] text-gray-500 mt-1 block">Digital bookings</span>
        </div>
        <div className="cc-card p-3">
          <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider block mb-0.5">Counter / POS Share</span>
          <div className="text-xl font-extrabold text-blue-400">
            {tickets.length > 0 ? Math.round((tickets.filter(t => t.channel === 'Counter').length / tickets.length) * 100) : 32}%
          </div>
          <span className="text-[10px] text-gray-500 mt-1 block">Box office kiosk &amp; counter</span>
        </div>
        <div className="cc-card p-3">
          <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider block mb-0.5">Ticket Sales Gross</span>
          <div className="text-xl font-extrabold text-[#f5b041]">
            {formatCurrency(totalRevenue)}
          </div>
          <span className="text-[10px] text-gray-500 mt-1 block">Total ticket collections</span>
        </div>
      </div>

      {/* View Navigation Header */}
      <section className="flex flex-wrap gap-1 bg-[#111827] border border-white/5 p-2 rounded-xl">
        <button
          onClick={() => setSubSection('sales')}
          className={`px-3 py-1.5 rounded text-xs font-semibold transition-all ${
            subSection === 'sales'
              ? 'bg-blue-600 text-white shadow shadow-blue-600/10' 
              : 'text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <i className="fa-solid fa-list-check mr-1.5"></i>
          Bookings Transactions Ledger
        </button>
        <button
          onClick={() => setSubSection('seat-map')}
          className={`px-3 py-1.5 rounded text-xs font-semibold transition-all ${
            subSection === 'seat-map' 
              ? 'bg-blue-600 text-white shadow shadow-blue-600/10' 
              : 'text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <i className="fa-solid fa-chair mr-1.5"></i>
          Visual Seat Map
        </button>
        <button
          onClick={() => setSubSection('discounts')}
          className={`px-3 py-1.5 rounded text-xs font-semibold transition-all ${
            subSection === 'discounts' 
              ? 'bg-blue-600 text-white shadow shadow-blue-600/10' 
              : 'text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <i className="fa-solid fa-tag mr-1.5"></i>
          Discounts &amp; Campaigns Impact
        </button>
        <button
          onClick={() => setSubSection('refunds')}
          className={`px-3 py-1.5 rounded text-xs font-semibold transition-all ${
            subSection === 'refunds' 
              ? 'bg-blue-600 text-white shadow shadow-blue-600/10' 
              : 'text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <i className="fa-solid fa-rotate-left mr-1.5"></i>
          Refunds &amp; Cancellations
        </button>
      </section>

      {/* 1. SALES LEDGER */}
      {subSection === 'sales' && (
        <div className="cc-card">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400">
                Ticket Bookings Transactions ({tickets.length} Records)
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">Real-time ticket issue ledger for {cinemaName}.</p>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400">Filter Channel:</span>
              <select 
                className="cc-input py-1 text-xs"
                value={channelFilter}
                onChange={(e) => setChannelFilter(e.target.value as any)}
              >
                <option value="all">All Channels</option>
                <option value="Online">Online Web / App</option>
                <option value="Counter">Counter POS</option>
                <option value="Kiosk">Self-Service Kiosk</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-white/10 text-gray-400 font-bold">
                  <th className="pb-3">Booking ID</th>
                  <th className="pb-3">Date</th>
                  <th className="pb-3">Movie</th>
                  <th className="pb-3">Screen</th>
                  <th className="pb-3">Seat</th>
                  <th className="pb-3">Channel</th>
                  <th className="pb-3">Payment</th>
                  <th className="pb-3 text-right">Amount</th>
                  <th className="pb-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody>
                {tickets.slice(0, 15).map((t) => {
                  const m = ConnCloudStore.getMovies().find(mov => mov.movieId === t.movieId);
                  const scr = ConnCloudStore.getScreens().find(s => s.screenId === t.screenId);
                  return (
                    <tr key={t.bookingId} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="py-3 font-semibold text-gray-300 font-mono">{t.bookingId}</td>
                      <td className="py-3 text-gray-400">{t.date}</td>
                      <td className="py-3 font-semibold text-white">{m?.title}</td>
                      <td className="py-3 text-amber-300 font-medium">{scr?.name || 'Screen'}</td>
                      <td className="py-3 font-mono font-bold text-gray-200">{t.seat}</td>
                      <td className="py-3 font-medium text-gray-300">{t.channel}</td>
                      <td className="py-3 text-gray-400">{t.payment}</td>
                      <td className="py-3 text-right font-bold text-emerald-400">{formatCurrency(t.price)}</td>
                      <td className="py-3 text-center">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          t.status === 'Confirmed' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
                        }`}>
                          {t.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 2. SEAT MAP */}
      {subSection === 'seat-map' && (
        <div className="cc-card flex flex-col items-center">
          <div className="w-full flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400">
                Interactive Seating Arrangement • {cinemaName}
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                {isCoupleScreen 
                  ? 'Boutique Luxuriance Couple Recliner Layout (20 Luxury Recliner Seats)' 
                  : `${activeScreen?.name || 'Screen'} Layout (${activeScreen?.capacity || 60} Seats)`}
              </p>
            </div>

            {screens.length > 1 && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400">Screen:</span>
                <select
                  className="cc-input py-1 text-xs bg-[#1f2937]"
                  value={selectedScreenId}
                  onChange={(e) => setSelectedScreenId(e.target.value)}
                >
                  {screens.map(s => (
                    <option key={s.screenId} value={s.screenId}>
                      {s.name} ({s.capacity} seats)
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
          
          {/* Cinema Screen shape */}
          <div className="w-full max-w-md h-4 bg-blue-900/30 rounded-b-xl border-b-2 border-blue-500 flex items-center justify-center text-[10px] font-black text-blue-300 uppercase tracking-widest mb-10 shadow-lg shadow-blue-500/10">
            Cinema Screen / Stage Direction
          </div>

          {/* Seat Grid */}
          <div className="space-y-3 mb-8">
            {rows.map((row) => (
              <div key={row} className="flex gap-2.5 items-center justify-center">
                <span className="w-6 text-xs font-bold text-gray-500 font-mono text-center mr-2">{row}</span>
                {cols.map((col) => {
                  const seatId = isCoupleScreen ? `${row}${col*2-1}-${col*2}` : `${row}${col}`;
                  const status = seatStatusMap[seatId] || 'Available';
                  return (
                    <button
                      key={col}
                      onClick={() => handleSeatClick(seatId)}
                      className={`rounded border flex items-center justify-center font-semibold transition-all ${
                        isCoupleScreen ? 'w-16 h-9 text-[11px]' : 'w-8 h-8 text-[10px]'
                      } ${getSeatColor(status)}`}
                      title={`Seat ${seatId}: ${status}`}
                    >
                      {isCoupleScreen ? `🛋️ ${seatId}` : col}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>

          {/* Map Legends */}
          <div className="flex flex-wrap gap-4 text-xs justify-center pt-4 border-t border-white/5 w-full">
            <span className="flex items-center gap-1.5 text-gray-400">
              <span className="w-3 h-3 rounded border border-white/20 bg-transparent block"></span> Available
            </span>
            <span className="flex items-center gap-1.5 text-blue-400">
              <span className="w-3 h-3 rounded bg-blue-600 block"></span> Sold
            </span>
            <span className="flex items-center gap-1.5 text-amber-400">
              <span className="w-3 h-3 rounded bg-amber-500 block"></span> Reserved
            </span>
            <span className="flex items-center gap-1.5 text-red-400">
              <span className="w-3 h-3 rounded bg-red-600 block"></span> Blocked
            </span>
            <span className="flex items-center gap-1.5 text-purple-400">
              <span className="w-3 h-3 rounded bg-purple-600 block"></span> Complimentary
            </span>
          </div>
        </div>
      )}

      {/* 3. DISCOUNTS */}
      {subSection === 'discounts' && (
        <div className="cc-card">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-4">Active Coupon Campaigns</h3>
          <div className="space-y-4">
            {[
              ...(isAhilyanagar ? [
                { code: 'AHILYA20', desc: 'Exclusive 20% privilege savings on couple recliner auditorium bookings in Ahilyanagar', usage: '142 orders', impact: 28400 }
              ] : []),
              { code: 'CONNMONSOON', desc: '15% Off family ticket bundle sets', usage: '820 orders', impact: 42000 },
              { code: 'UPIFREEFNB', desc: 'Complimentary small soda on UPI booking payments', usage: '1,450 orders', impact: 18500 },
              { code: 'B2BMEMBER10', desc: 'Flat 10% Off ticket entries for Corporate cardholders', usage: '340 orders', impact: 29000 }
            ].map((disc) => (
              <div key={disc.code} className="p-4 rounded bg-black/20 border border-white/5 flex justify-between items-center text-xs">
                <div>
                  <span className="font-mono font-black text-amber-300 text-sm bg-white/5 px-2 py-0.5 rounded border border-white/10">{disc.code}</span>
                  <p className="text-gray-400 mt-2">{disc.desc}</p>
                </div>
                <div className="text-right">
                  <span className="font-bold text-[#f5b041] block">{disc.usage}</span>
                  <span className="text-[10px] text-red-400 font-semibold block mt-1">Impact: -{formatCurrency(disc.impact)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. REFUNDS */}
      {subSection === 'refunds' && (
        <div className="cc-card">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-4">Refund Requests Pending</h3>
          <div className="space-y-4">
            {(isAhilyanagar ? [
              { id: 'ref_ah1', booking: 'bk_ah_8012', customer: 'Sachin Thorat', amount: 560, reason: 'Duplicate UPI checkout on Screen 1 Couple Recliner', date: '2026-08-30' },
              { id: 'ref_ah2', booking: 'bk_ah_8044', customer: 'Snehal Jagtap', amount: 480, reason: 'Show rescheduling requested by patron', date: '2026-08-28' }
            ] : [
              { id: 'ref_1', booking: 'bk_2083', customer: 'Amit Sharma', amount: 880, reason: 'Accidental double checkout online payment', date: '2026-08-30' },
              { id: 'ref_2', booking: 'bk_1952', customer: 'Sita Verma', amount: 440, reason: 'Show rescheduled by operations team', date: '2026-08-29' }
            ]).map((req) => (
              <div key={req.id} className="p-4 rounded bg-black/20 border border-white/5 flex justify-between items-center text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-sm">{req.customer}</span>
                    <span className="text-[10px] text-gray-400 font-mono">Booking: {req.booking}</span>
                  </div>
                  <p className="text-gray-400 mt-1.5">Reason: {req.reason}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-bold text-red-400">{formatCurrency(req.amount)}</span>
                  <button 
                    onClick={() => triggerNotification(`Refund of ${formatCurrency(req.amount)} approved for ${req.customer}`)}
                    className="cc-btn cc-btn-outline px-3 py-1 text-[10px] border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10"
                  >
                    Approve Refund
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
