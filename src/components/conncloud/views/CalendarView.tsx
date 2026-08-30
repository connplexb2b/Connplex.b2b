import React from 'react';

export default function CalendarView() {
  const agenda = [
    { date: 'Aug 30', type: 'Release', title: 'Dil Ki Baazi (Multi-screen launch)', time: '09:00 AM' },
    { date: 'Sep 02', type: 'Maintenance', title: 'Laser Recalibration Screen 3 (Sony)', time: '02:00 PM' },
    { date: 'Sep 05', type: 'Meeting', title: 'Monthly Franchise Review Meeting', time: '11:00 AM' },
    { date: 'Sep 12', type: 'Promotion', title: 'Independence Day Ticket Flash Bundle release', time: '12:00 AM' }
  ];

  return (
    <div className="cc-card">
      <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-6">Agenda Schedule Roster</h3>
      <div className="space-y-4">
        {agenda.map((item, idx) => (
          <div key={idx} className="p-4 rounded bg-black/25 border border-white/5 hover:border-white/10 transition-colors flex justify-between items-center text-xs">
            <div className="space-y-1">
              <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                item.type === 'Release' ? 'bg-blue-500/15 text-blue-400' : (item.type === 'Maintenance' ? 'bg-amber-500/15 text-amber-400' : 'bg-purple-500/15 text-purple-400')
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
