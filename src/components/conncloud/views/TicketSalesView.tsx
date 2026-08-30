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

  // Pull tickets
  const tickets = ConnCloudStore.getTickets().filter(t => {
    const channelMatch = channelFilter === 'all' || t.channel === channelFilter;
    // Map screen to check cinemaId
    const scr = ConnCloudStore.getScreens().find(sc => sc.screenId === t.screenId);
    const cinemaMatch = selectedCinemaId === 'all' || scr?.cinemaId === selectedCinemaId;
    return channelMatch && cinemaMatch;
  });

  const formatCurrency = (val: number) => {
    return `₹${val.toLocaleString('en-IN')}`;
  };

  // Seat Map State (8x8 Grid representing a Screen Layout)
  const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
  const cols = Array.from({ length: 8 }, (_, i) => i + 1);
  
  // Seed status: Available, Sold, Reserved, Blocked, Complimentary
  const [seatStatusMap, setSeatStatusMap] = useState<Record<string, 'Available' | 'Sold' | 'Reserved' | 'Blocked' | 'Complimentary'>>({
    'A1': 'Sold', 'A2': 'Sold', 'A5': 'Reserved', 'A6': 'Reserved',
    'B3': 'Blocked', 'B4': 'Blocked', 'C6': 'Complimentary', 'C7': 'Complimentary',
    'F1': 'Sold', 'F2': 'Sold', 'F3': 'Sold', 'G4': 'Reserved', 'H7': 'Blocked'
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
      case 'Sold': return 'bg-blue-600 border-blue-500 text-white';
      case 'Reserved': return 'bg-amber-500 border-amber-400 text-blue-950 font-bold';
      case 'Blocked': return 'bg-red-600 border-red-500 text-white';
      case 'Complimentary': return 'bg-purple-600 border-purple-500 text-white';
      default: return 'bg-transparent border-white/20 text-gray-400 hover:border-white/50';
    }
  };

  return (
    <div className="space-y-6">
      {/* View Header */}
      <section className="flex flex-wrap gap-1 bg-[#111827] border border-white/5 p-2 rounded-xl">
        <button
          onClick={() => setSubSection('sales')}
          className={`px-3 py-1.5 rounded text-xs font-semibold transition-all ${
            subSection === 'sales'
              ? 'bg-blue-600 text-white shadow shadow-blue-600/10' 
              : 'text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
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
          Discounts & Campaigns Impact
        </button>
        <button
          onClick={() => setSubSection('refunds')}
          className={`px-3 py-1.5 rounded text-xs font-semibold transition-all ${
            subSection === 'refunds' 
              ? 'bg-blue-600 text-white shadow shadow-blue-600/10' 
              : 'text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          Refunds & Cancellations Queue
        </button>
      </section>

      {/* 1. SALES LEDGER */}
      {subSection === 'sales' && (
        <div className="cc-card">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400">Transactions Ledger</h3>
            <select 
              className="cc-input"
              value={channelFilter}
              onChange={(e) => setChannelFilter(e.target.value as any)}
            >
              <option value="all">All Channels</option>
              <option value="Online">Online Web / App</option>
              <option value="Counter">Counter POS</option>
              <option value="Kiosk">Self-Service Kiosk</option>
            </select>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-white/10 text-gray-400 font-bold">
                  <th className="pb-3">Booking ID</th>
                  <th className="pb-3">Movie</th>
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
                  return (
                    <tr key={t.bookingId} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="py-3 font-semibold text-gray-300">{t.bookingId}</td>
                      <td className="py-3 font-semibold text-white">{m?.title}</td>
                      <td className="py-3 font-mono text-gray-400">{t.seat}</td>
                      <td className="py-3 font-medium text-gray-300">{t.channel}</td>
                      <td className="py-3 text-gray-400">{t.payment}</td>
                      <td className="py-3 text-right font-bold text-white">{formatCurrency(t.price)}</td>
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
          <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400 self-start mb-6">Interactive Seating Arrangement</h3>
          
          {/* Cinema Screen shape */}
          <div className="w-full max-w-md h-4 bg-blue-900/30 rounded-b-xl border-b-2 border-blue-500 flex items-center justify-center text-[10px] font-black text-blue-300 uppercase tracking-widest mb-10 shadow-lg shadow-blue-500/10">
            Cinema Screen / Stage Direction
          </div>

          <div className="space-y-2 mb-8">
            {rows.map((row) => (
              <div key={row} className="flex gap-2 items-center">
                <span className="w-4 text-xs font-bold text-gray-500 font-mono text-center mr-2">{row}</span>
                {cols.map((col) => {
                  const seatId = `${row}${col}`;
                  const status = seatStatusMap[seatId] || 'Available';
                  return (
                    <button
                      key={col}
                      onClick={() => handleSeatClick(seatId)}
                      className={`w-8 h-8 rounded border flex items-center justify-center text-[10px] font-semibold transition-all ${getSeatColor(status)}`}
                    >
                      {col}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>

          {/* Map Legends */}
          <div className="flex flex-wrap gap-4 text-xs justify-center pt-4 border-t border-white/5 w-full">
            <span className="flex items-center gap-1.5 text-gray-400"><span className="w-3 h-3 rounded border border-white/20 bg-transparent block"></span> Available</span>
            <span className="flex items-center gap-1.5 text-blue-400"><span className="w-3 h-3 rounded bg-blue-600 block"></span> Sold</span>
            <span className="flex items-center gap-1.5 text-amber-400"><span className="w-3 h-3 rounded bg-amber-500 block"></span> Reserved</span>
            <span className="flex items-center gap-1.5 text-red-400"><span className="w-3 h-3 rounded bg-red-600 block"></span> Blocked</span>
            <span className="flex items-center gap-1.5 text-purple-400"><span className="w-3 h-3 rounded bg-purple-600 block"></span> Complimentary</span>
          </div>
        </div>
      )}

      {/* 3. DISCOUNTS */}
      {subSection === 'discounts' && (
        <div className="cc-card">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-4">Active Coupon Campaigns</h3>
          <div className="space-y-4">
            {[
              { code: 'CONNMONSOON', desc: '15% Off family ticket bundle sets', usage: '820 orders', impact: 42000 },
              { code: 'UPIFREEFNB', desc: 'Complimentary small soda on UPI booking payments', usage: '1,450 orders', impact: 18500 },
              { code: 'B2BMEMBER10', desc: 'Flat 10% Off ticket entries for Corporate cardholders', usage: '340 orders', impact: 29000 }
            ].map((disc) => (
              <div key={disc.code} className="p-4 rounded bg-black/20 border border-white/5 flex justify-between items-center text-xs">
                <div>
                  <span className="font-mono font-black text-white text-sm bg-white/5 px-2 py-0.5 rounded border border-white/10">{disc.code}</span>
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
            {[
              { id: 'ref_1', booking: 'bk_2083', customer: 'Amit Sharma', amount: 880, reason: 'Accidental double checkout online payment', date: '2026-08-30' },
              { id: 'ref_2', booking: 'bk_1952', customer: 'Sita Verma', amount: 440, reason: 'Show rescheduled by operations team', date: '2026-08-29' }
            ].map((req) => (
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
