import React from 'react';

interface CalendarViewProps {
  selectedCinemaId?: string;
}

export default function CalendarView({ selectedCinemaId = 'all' }: CalendarViewProps) {
  const isAhilyanagar = selectedCinemaId === 'c5';
  const agenda = isAhilyanagar ? [
    { date: 'Today', type: 'Sync', title: 'Vista Daily Ticket & Concession Ingest Sync (Ahilyanagar)', time: '09:00 AM' },
    { date: 'Sep 10', type: 'Maintenance', title: 'Screen 1 Barco 4K Laser Projector Inspection & Dust Filter Purge', time: '10:30 AM' },
    { date: 'Sep 12', type: 'Operations', title: 'Daikin VRV Dual Inverter HVAC Sensor Calibration (Screen 1 & 2)', time: '02:00 PM' },
    { date: 'Sep 14', type: 'Audit', title: 'Ahilyanagar Fire Hydrant & Maharashtra NOC Quarterly Readiness Drill', time: '11:00 AM' },
    { date: 'Sep 16', type: 'Private Event', title: 'Kalyani Steels & Engineering Corporate Screening (Screen 2 Gold Class)', time: '06:00 PM' },
    { date: 'Sep 20', type: 'Promotion', title: 'Ahilyanagar Couple Recliner VIP Weekend Flash Pass (AHILYA20)', time: '12:00 AM' }
  ] : [
    { date: 'Aug 30', type: 'Release', title: 'Dil Ki Baazi (Multi-screen launch)', time: '09:00 AM' },
    { date: 'Sep 02', type: 'Maintenance', title: 'Laser Recalibration Screen 3 (Sony)', time: '02:00 PM' },
    { date: 'Sep 05', type: 'Meeting', title: 'Monthly Franchise Review Meeting', time: '11:00 AM' },
    { date: 'Sep 12', type: 'Promotion', title: 'Independence Day Ticket Flash Bundle release', time: '12:00 AM' }
  ];

  return (
    <div className="cc-card">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400">
            {isAhilyanagar ? 'Connplex Ahilyanagar Operational Agenda' : 'Agenda Schedule Roster'}
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">
            {isAhilyanagar ? 'Synchronized schedule of Vista API syncs, equipment servicing, corporate charters, and promo launches.' : 'Key events, releases, maintenance dates, and corporate review schedules.'}
          </p>
        </div>
        {isAhilyanagar && (
          <span className="px-2.5 py-1 rounded text-xs font-mono font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <i className="fa-solid fa-clock-rotate-left mr-1.5"></i> VISTA SYNC SCHEDULED
          </span>
        )}
      </div>

      <div className="space-y-4">
        {agenda.map((item, idx) => (
          <div key={idx} className="p-4 rounded bg-black/25 border border-white/5 hover:border-white/10 transition-colors flex justify-between items-center text-xs">
            <div className="space-y-1">
              <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                item.type === 'Release' || item.type === 'Sync' ? 'bg-blue-500/15 text-blue-400' : (item.type === 'Maintenance' || item.type === 'Operations' ? 'bg-amber-500/15 text-amber-400' : (item.type === 'Private Event' ? 'bg-emerald-500/15 text-emerald-400' : 'bg-purple-500/15 text-purple-400'))
              }`}>
                {item.type}
              </span>
              <h4 className="font-bold text-white text-sm mt-1">{item.title}</h4>
            </div>
            <div className="text-right">
              <span className="font-bold text-gray-300 block">{item.date}</span>
              <span className="text-[10px] text-gray-500 block mt-0.5">{item.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
