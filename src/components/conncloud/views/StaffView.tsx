import React, { useState } from 'react';
import { ConnCloudStore, Staff } from '../../../lib/conncloudData';

interface StaffViewProps {
  selectedCinemaId: string;
  selectedDateRange: string;
  triggerNotification: (msg: string) => void;
}

export default function StaffView({
  selectedCinemaId,
  selectedDateRange,
  triggerNotification
}: StaffViewProps) {
  const [subSection, setSubSection] = useState<'roster' | 'attendance' | 'shifts' | 'leaves'>('roster');

  // Pull staff list
  const staff = ConnCloudStore.getStaff();

  // Leaves management local state
  const [leaves, setLeaves] = useState([
    { id: 'lv_1', employee: 'Nisha Singh', type: 'Sick Leave', duration: '2026-08-30 to 2026-09-02', reason: 'High fever recovery', status: 'Pending' },
    { id: 'lv_2', employee: 'Deepak Patel', type: 'Privilege Leave', duration: '2026-08-25 to 2026-08-27', reason: 'Family wedding regional visit', status: 'Approved' }
  ]);

  const handleLeaveDecision = (id: string, approve: boolean) => {
    setLeaves(prev => prev.map(l => {
      if (l.id === id) {
        const nextStatus = approve ? 'Approved' : 'Rejected';
        triggerNotification(`Leave application for ${l.employee} has been ${nextStatus}.`);
        return { ...l, status: nextStatus };
      }
      return l;
    }));
  };

  return (
    <div className="space-y-6">
      {/* Sub navigation tabs */}
      <section className="flex flex-wrap gap-1 bg-[#111827] border border-white/5 p-2 rounded-xl">
        {[
          { id: 'roster', label: 'Employees Directory' },
          { id: 'attendance', label: 'Attendance Sheet' },
          { id: 'shifts', label: 'Shifts Scheduling' },
          { id: 'leaves', label: 'Leaves Planner' }
        ].map((sec) => (
          <button
            key={sec.id}
            onClick={() => setSubSection(sec.id as any)}
            className={`px-3 py-1.5 rounded text-xs font-semibold transition-all ${
              subSection === sec.id 
                ? 'bg-blue-600 text-white shadow shadow-blue-600/10' 
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            {sec.label}
          </button>
        ))}
      </section>

      {/* 1. ROSTER */}
      {subSection === 'roster' && (
        <div className="cc-card">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-4">Franchise Staff Roster</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-white/10 text-gray-400 font-bold">
                  <th className="pb-3">Employee ID</th>
                  <th className="pb-3">Name</th>
                  <th className="pb-3">Department</th>
                  <th className="pb-3">Designation</th>
                  <th className="pb-3">Joining Date</th>
                  <th className="pb-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody>
                {staff.map((emp) => (
                  <tr key={emp.employeeId} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="py-3 font-semibold text-gray-300">{emp.employeeId}</td>
                    <td className="py-3 font-bold text-white">{emp.name}</td>
                    <td className="py-3 text-gray-400">{emp.department}</td>
                    <td className="py-3 text-gray-300 font-medium">{emp.designation}</td>
                    <td className="py-3 text-gray-400 font-mono">{emp.joiningDate}</td>
                    <td className="py-3 text-center">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        emp.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
                      }`}>
                        {emp.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 2. ATTENDANCE */}
      {subSection === 'attendance' && (
        <div className="cc-card">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400">Daily Attendance Log</h3>
            <span className="text-xs text-gray-400">Date: Today ({new Date().toLocaleDateString('en-IN')})</span>
          </div>

          <div className="space-y-3.5">
            {staff.map((emp) => (
              <div key={emp.employeeId} className="p-3 bg-black/25 border border-white/5 rounded flex justify-between items-center text-xs">
                <div>
                  <span className="font-bold text-white block">{emp.name}</span>
                  <span className="text-[10px] text-gray-400 mt-0.5">{emp.designation} • {emp.department}</span>
                </div>
                <div className="flex gap-2">
                  <span className={`px-2.5 py-1 rounded text-[10px] font-bold ${
                    emp.status === 'Active' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/10 text-amber-400'
                  }`}>
                    {emp.status === 'Active' ? 'Present' : 'Excused / On Leave'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. SHIFTS */}
      {subSection === 'shifts' && (
        <div className="cc-card">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-6">Shift Scheduling Grid</h3>
          
          <div className="overflow-x-auto">
            <div className="min-w-[600px] space-y-3 text-xs">
              <div className="grid grid-cols-8 gap-2 text-center text-gray-400 font-bold border-b border-white/10 pb-3">
                <div className="text-left">Employee</div>
                <div>Mon</div>
                <div>Tue</div>
                <div>Wed</div>
                <div>Thu</div>
                <div>Fri</div>
                <div>Sat</div>
                <div>Sun</div>
              </div>
              {staff.map((emp) => (
                <div key={emp.employeeId} className="grid grid-cols-8 gap-2 items-center border-b border-white/5 pb-2">
                  <div className="text-left font-semibold text-white">{emp.name}</div>
                  {['09:00 - 17:00', '09:00 - 17:00', '13:00 - 21:00', '13:00 - 21:00', '17:00 - 01:00', 'OFF', 'OFF'].map((shift, sIdx) => {
                    const isOff = shift === 'OFF';
                    return (
                      <div 
                        key={sIdx}
                        className={`p-2 rounded text-center text-[10px] font-medium border ${
                          isOff ? 'bg-black/10 border-white/5 text-gray-500' : 'bg-blue-600/10 border-blue-500/20 text-blue-300'
                        }`}
                      >
                        {shift}
                      </div>
                    );
                  })}
                  <div className="p-2 rounded text-center text-[10px] bg-blue-600/10 border border-blue-500/20 text-blue-300">17:00 - 01:00</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 4. LEAVES */}
      {subSection === 'leaves' && (
        <div className="cc-card">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-4">Leaves Applications</h3>
          <div className="space-y-4">
            {leaves.map((l) => (
              <div key={l.id} className="p-4 rounded bg-black/20 border border-white/5 flex justify-between items-center text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-sm">{l.employee}</span>
                    <span className="text-[10px] text-gray-400 font-semibold bg-white/5 px-2 py-0.5 rounded">{l.type}</span>
                  </div>
                  <p className="text-gray-400 mt-1.5">Reason: {l.reason}</p>
                  <span className="text-[10px] text-gray-500 block mt-1">Duration: {l.duration}</span>
                </div>
                
                <div className="flex items-center gap-4">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    l.status === 'Approved' ? 'bg-emerald-500/10 text-emerald-400' : (l.status === 'Pending' ? 'bg-amber-500/10 text-amber-400' : 'bg-red-500/10 text-red-400')
                  }`}>
                    {l.status}
                  </span>

                  {l.status === 'Pending' && (
                    <div className="flex gap-1.5">
                      <button 
                        onClick={() => handleLeaveDecision(l.id, true)}
                        className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[10px] font-bold transition-colors"
                      >
                        Approve
                      </button>
                      <button 
                        onClick={() => handleLeaveDecision(l.id, false)}
                        className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-[10px] font-bold transition-colors"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
