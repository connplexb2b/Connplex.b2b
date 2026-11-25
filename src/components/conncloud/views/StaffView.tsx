import React, { useState } from 'react';
import { ConnCloudStore, Staff } from '../../../lib/conncloudData';

interface StaffViewProps {
  selectedCinemaId: string;
  selectedDateRange: string;
  triggerNotification: (msg: string) => void;
  initialSubSection?: string;
}

export type StaffSubSection = 
  | 'roster' 
  | 'attendance' 
  | 'shifts' 
  | 'leaves' 
  | 'performance' 
  | 'training' 
  | 'documents' 
  | 'departments';

export default function StaffView({
  selectedCinemaId,
  selectedDateRange,
  triggerNotification,
  initialSubSection
}: StaffViewProps) {
  const resolveSubSection = (sec?: string): StaffSubSection => {
    if (!sec) return 'roster';
    const s = sec.toLowerCase();
    if (s.includes('attend')) return 'attendance';
    if (s.includes('shift') || s.includes('sched')) return 'shifts';
    if (s.includes('leave')) return 'leaves';
    if (s.includes('perf') || s.includes('kpi') || s.includes('target')) return 'performance';
    if (s.includes('train') || s.includes('cert')) return 'training';
    if (s.includes('doc') || s.includes('file')) return 'documents';
    if (s.includes('dept') || s.includes('depart')) return 'departments';
    return 'roster';
  };

  const [subSection, setSubSection] = useState<StaffSubSection>(() => resolveSubSection(initialSubSection));

  React.useEffect(() => {
    if (initialSubSection) {
      setSubSection(resolveSubSection(initialSubSection));
    }
  }, [initialSubSection]);

  const isAhilyanagar = selectedCinemaId === 'c5';
  const currentCinema = ConnCloudStore.getCinemas().find(c => c.cinemaId === selectedCinemaId);
  const cinemaName = selectedCinemaId === 'all' ? 'All Cinemas' : (currentCinema?.name || 'Selected Cinema');

  // Pull staff list filtered by cinema
  const allStaff = ConnCloudStore.getStaff();
  const staff = isAhilyanagar
    ? allStaff.filter(s => Boolean(s?.employeeId?.includes('ah')) || Boolean(s?.name?.includes('Shinde')) || Boolean(s?.name?.includes('Kadam')) || Boolean(s?.name?.includes('Deshmukh')))
    : (selectedCinemaId === 'all' ? allStaff : allStaff.filter(s => !s?.employeeId?.includes('ah')));

  // Leaves management local state
  const [leaves, setLeaves] = useState(() => isAhilyanagar ? [
    { id: 'lv_ah1', employee: 'Ramesh Kadam', type: 'Privilege Leave', duration: '2026-09-12 to 2026-09-14', reason: 'Annual family festival visit', status: 'Approved' },
    { id: 'lv_ah2', employee: 'Snehal Deshmukh', type: 'Sick Leave', duration: '2026-08-28 to 2026-08-29', reason: 'Viral fever rest', status: 'Approved' },
    { id: 'lv_ah3', employee: 'Vikram Shinde', type: 'Casual Leave', duration: '2026-09-05 to 2026-09-06', reason: 'Corporate franchise owners summit', status: 'Approved' }
  ] : [
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

  const subSectionsList: { id: StaffSubSection; label: string; icon: string }[] = [
    { id: 'roster', label: 'Employees Directory', icon: 'fa-users' },
    { id: 'attendance', label: 'Attendance Sheet', icon: 'fa-clipboard-user' },
    { id: 'shifts', label: 'Shifts & Scheduling', icon: 'fa-calendar-week' },
    { id: 'leaves', label: 'Leave Management', icon: 'fa-plane-departure' },
    { id: 'performance', label: 'Staff Performance', icon: 'fa-chart-simple' },
    { id: 'training', label: 'Training & SOPs', icon: 'fa-graduation-cap' },
    { id: 'documents', label: 'Employee Documents', icon: 'fa-folder-closed' },
    { id: 'departments', label: 'Departments', icon: 'fa-sitemap' }
  ];

  return (
    <div className="space-y-6">
      {/* Sub navigation tabs */}
      <section className="flex flex-wrap gap-1 bg-[#111827] border border-white/5 p-2 rounded-xl">
        {subSectionsList.map((sec) => (
          <button
            key={sec.id}
            onClick={() => setSubSection(sec.id)}
            className={`px-3 py-1.5 rounded text-xs font-semibold flex items-center gap-1.5 transition-all ${
              subSection === sec.id 
                ? 'bg-blue-600 text-white shadow shadow-blue-600/10' 
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <i className={`fa-solid ${sec.icon} text-[11px]`}></i>
            <span>{sec.label}</span>
          </button>
        ))}
      </section>

      {/* 1. EMPLOYEES ROSTER */}
      {subSection === 'roster' && (
        <div className="cc-card">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400">Franchise Staff Directory</h3>
              <p className="text-xs text-gray-500 mt-0.5">Active cinema team roster for {cinemaName}</p>
            </div>
            <span className="text-xs text-gray-400">Total Staff: <strong className="text-white">{staff.length}</strong></span>
          </div>

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
                    <td className="py-3 font-semibold text-gray-300 font-mono">{emp.employeeId}</td>
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
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="cc-card">
              <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold block mb-1">On-Duty Present</span>
              <div className="text-3xl font-extrabold text-emerald-400">{staff.filter(s => s.status === 'Active').length}</div>
              <div className="text-xs text-gray-400 mt-2">100% scheduled shifts covered</div>
            </div>
            <div className="cc-card">
              <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold block mb-1">On Leave</span>
              <div className="text-3xl font-extrabold text-amber-400">{staff.filter(s => s.status !== 'Active').length}</div>
              <div className="text-xs text-gray-400 mt-2">Authorized casual / medical leave</div>
            </div>
            <div className="cc-card">
              <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold block mb-1">Biometric Ingest</span>
              <div className="text-3xl font-extrabold text-blue-400">Synchronized</div>
              <div className="text-xs text-gray-400 mt-2">Real-time turnstile clock-in</div>
            </div>
          </div>

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
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-gray-400 text-[11px]">Clock In: 08:45 AM</span>
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
          <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-4">Leave Management &amp; Approvals</h3>
          <div className="space-y-4">
            {leaves.map((l) => (
              <div key={l.id} className="p-4 rounded bg-black/20 border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-sm">{l.employee}</span>
                    <span className="text-[10px] text-gray-400 font-semibold bg-white/5 px-2 py-0.5 rounded">{l.type}</span>
                  </div>
                  <p className="text-gray-400 mt-1.5">Reason: {l.reason}</p>
                  <span className="text-[10px] text-gray-500 block mt-1">Duration: {l.duration}</span>
                </div>
                
                <div className="flex items-center gap-4 self-end sm:self-auto">
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

      {/* 5. PERFORMANCE */}
      {subSection === 'performance' && (
        <div className="cc-card">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-4">Staff Key Performance Indicators (KPIs)</h3>
          <div className="space-y-3">
            {staff.map((emp, idx) => {
              const rating = [4.9, 4.8, 4.7, 4.8, 4.9][idx % 5];
              const target = [102, 98, 105, 96, 100][idx % 5];
              return (
                <div key={emp.employeeId} className="p-3 bg-black/20 rounded border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div>
                    <strong className="text-white text-sm block">{emp.name}</strong>
                    <span className="text-gray-400 text-[11px]">{emp.designation} • {emp.department}</span>
                  </div>
                  <div className="flex items-center gap-6">
                    <div>
                      <span className="text-[10px] text-gray-500 block">Performance Score</span>
                      <strong className="text-sm text-[#f5b041]">{rating} ★</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-gray-500 block">Target Achieved</span>
                      <strong className="text-sm text-emerald-400">{target}%</strong>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 6. TRAINING */}
      {subSection === 'training' && (
        <div className="cc-card">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-4">Cinema Operations Training &amp; Certifications</h3>
          <div className="space-y-3">
            {[
              { module: 'Connplex Hospitality & Luxury Recliner Service Etiquette', dept: 'All Staff', duration: '4 Hours', status: 'Mandatory • 100% Certified' },
              { module: 'Barco 4K Laser Projector Safety & Optical Cleaning SOP', dept: 'Projection', duration: '6 Hours', status: 'Certified (Vikram Shinde)' },
              { module: 'FSSAI Food Safety, Popcorn Kettle Hygiene & Cold Chain', dept: 'Concessions', duration: '3 Hours', status: 'Certified (Snehal Deshmukh)' },
              { module: 'Emergency Auditorium Fire Evacuation & Crowd Protocol', dept: 'Operations & Security', duration: '2 Hours', status: 'Drill Completed' }
            ].map(mod => (
              <div key={mod.module} className="p-3 bg-black/20 rounded border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div>
                  <h4 className="font-semibold text-white">{mod.module}</h4>
                  <span className="text-gray-400 text-[11px]">Department: {mod.dept} • Duration: {mod.duration}</span>
                </div>
                <span className="px-2.5 py-1 rounded font-bold text-blue-400 bg-blue-500/10 border border-blue-500/20 text-xs self-start sm:self-auto">
                  {mod.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 7. DOCUMENTS */}
      {subSection === 'documents' && (
        <div className="cc-card">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-4">Employee Statutory &amp; Onboarding Documents</h3>
          <div className="space-y-3">
            {staff.map(emp => (
              <div key={emp.employeeId} className="p-3 bg-black/20 rounded border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div>
                  <strong className="text-white text-sm block">{emp.name}</strong>
                  <span className="text-gray-400 text-[11px]">Aadhaar Verified • Police Verification Clear • Employment Agreement Signed</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    Compliant
                  </span>
                  <button 
                    onClick={() => triggerNotification(`Downloading dossier for ${emp.name}...`)}
                    className="px-2.5 py-1 rounded bg-white/5 hover:bg-white/10 text-gray-300 text-xs"
                  >
                    View Dossier
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 8. DEPARTMENTS */}
      {subSection === 'departments' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { name: 'Box Office & Ticketing', head: isAhilyanagar ? 'Ramesh Kadam' : 'Deepak Patel', count: 3, budget: '₹65,000/mo', desc: 'Front-desk bookings, cash collection, and customer inquiries' },
            { name: 'Concessions & F&B', head: isAhilyanagar ? 'Snehal Deshmukh' : 'Priya Nair', count: 4, budget: '₹85,000/mo', desc: 'Food preparation, kitchen hygiene, popcorn kettles and counter service' },
            { name: 'Projection & Technical Engineering', head: isAhilyanagar ? 'Vikram Shinde' : 'Aarav Sharma', count: 2, budget: '₹75,000/mo', desc: 'Laser projectors, Dolby Atmos, electricals, Daikin VRV HVAC' },
            { name: 'Housekeeping & Cinema Sanitization', head: 'Central Supervisor', count: 3, budget: '₹45,000/mo', desc: 'Screen auditorium turnaround, luxury recliner cleaning and waste management' }
          ].map(d => (
            <div key={d.name} className="cc-card">
              <h4 className="font-bold text-white text-sm">{d.name}</h4>
              <p className="text-xs text-gray-400 mt-1">{d.desc}</p>
              <div className="flex justify-between items-center text-[11px] text-gray-300 mt-4 pt-3 border-t border-white/5">
                <span>Team Lead: <strong>{d.head}</strong></span>
                <span className="text-blue-400 font-bold">{d.count} Staff Members</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
