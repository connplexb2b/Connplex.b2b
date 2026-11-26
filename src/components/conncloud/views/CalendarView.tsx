import React, { useState } from 'react';

interface CalendarViewProps {
  selectedCinemaId?: string;
}

export default function CalendarView({ selectedCinemaId = 'all' }: CalendarViewProps) {
  const isAhilyanagar = selectedCinemaId === 'c5';
  const [activeTab, setActiveTab] = useState<'calendar' | 'alert-rules'>('calendar');

  // Configurable Alert Rules State
  const [alertThresholds, setAlertThresholds] = useState({
    screenOfflineMinutes: 2,
    projectorTempCritical: 42,
    fireAlertTrigger: 'Auto Dispatch NOC',
    inventoryMinUnits: 40,
    occupancyMinPercent: 30,
    occupancyMaxPercent: 90,
    revenueTargetDeviation: 15,
    maintenanceSlaHours: 12,
    settlementPendingDays: 3
  });

  // Calendar events: Movie Releases, Meetings, Maintenance, Promotions, Local Events, Training, Deadlines
  const agenda = [
    { date: 'Today', type: 'Movie Release', title: 'Resident Evil (Hindi) - Exclusive Screening Launch', time: '11:00 AM' },
    { date: 'Tomorrow', type: 'Meeting', title: 'Connplex Corporate Monthly Franchise Review Video Call', time: '04:00 PM' },
    { date: 'Sep 10', type: 'Maintenance', title: 'Barco 4K Laser Optical Lens & Dust Purge Calibration', time: '10:30 AM' },
    { date: 'Sep 12', type: 'Promotion', title: 'Boutique Couple Recliner Flash Weekend Pass (AHILYA20)', time: '12:00 AM' },
    { date: 'Sep 16', type: 'Local Event', title: 'Kalyani Steels Regional Engineers Corporate Charter Screening', time: '06:00 PM' },
    { date: 'Sep 18', type: 'Training', title: 'FSSAI Food Safety & Popcorn Freshness Certification Session', time: '02:00 PM' },
    { date: 'Sep 20', type: 'Deadline', title: 'GSTR-3B Monthly Tax Ledger Filing & Auditor Verification', time: '11:59 PM' }
  ];

  const handleSaveThresholds = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Alert rule thresholds saved and updated across IoT telemetry services.');
  };

  return (
    <div className="space-y-6">
      {/* View Switcher Header */}
      <section className="flex flex-wrap gap-1 bg-[#111827] border border-white/5 p-2 rounded-xl">
        <button
          onClick={() => setActiveTab('calendar')}
          className={`px-3 py-1.5 rounded text-xs font-semibold flex items-center gap-1.5 transition-all ${
            activeTab === 'calendar' 
              ? 'bg-blue-600 text-white shadow shadow-blue-600/10' 
              : 'text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <i className="fa-solid fa-calendar-days text-[11px]"></i>
          Operational Calendar Events
        </button>
        <button
          onClick={() => setActiveTab('alert-rules')}
          className={`px-3 py-1.5 rounded text-xs font-semibold flex items-center gap-1.5 transition-all ${
            activeTab === 'alert-rules' 
              ? 'bg-blue-600 text-white shadow shadow-blue-600/10' 
              : 'text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <i className="fa-solid fa-sliders text-[11px]"></i>
          Configurable Alert Rules &amp; Thresholds
        </button>
      </section>

      {/* 1. CALENDAR VIEW */}
      {activeTab === 'calendar' && (
        <div className="cc-card">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400">
                {isAhilyanagar ? 'Connplex Ahilyanagar Operational Agenda' : 'Corporate Agenda & Releases Schedule'}
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Key movie releases, meetings, equipment maintenance, promos, local events, training, and statutory deadlines.
              </p>
            </div>
            {isAhilyanagar && (
              <span className="px-2.5 py-1 rounded text-xs font-mono font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <i className="fa-solid fa-clock-rotate-left mr-1.5"></i> LIVE POS SYNC SCHEDULED
              </span>
            )}
          </div>

          <div className="space-y-3">
            {agenda.map((item, idx) => (
              <div key={idx} className="p-4 rounded bg-black/25 border border-white/5 hover:border-white/10 transition-colors flex flex-col sm:flex-row justify-between sm:items-center gap-2 text-xs">
                <div className="space-y-1">
                  <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                    item.type === 'Movie Release' ? 'bg-blue-500/15 text-blue-400' : 
                    (item.type === 'Maintenance' ? 'bg-amber-500/15 text-amber-400' : 
                    (item.type === 'Meeting' ? 'bg-purple-500/15 text-purple-400' : 
                    (item.type === 'Promotion' ? 'bg-pink-500/15 text-pink-400' : 
                    (item.type === 'Local Event' ? 'bg-emerald-500/15 text-emerald-400' : 
                    (item.type === 'Training' ? 'bg-cyan-500/15 text-cyan-400' : 'bg-red-500/15 text-red-400')))))
                  }`}>
                    {item.type}
                  </span>
                  <h4 className="font-bold text-white text-sm mt-1">{item.title}</h4>
                </div>
                <div className="text-left sm:text-right">
                  <span className="font-bold text-gray-300 block">{item.date}</span>
                  <span className="text-[10px] text-gray-500 block mt-0.5">{item.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. CONFIGURABLE ALERT RULES */}
      {activeTab === 'alert-rules' && (
        <div className="cc-card">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400">
                Configurable Automated Alert Rules
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Set custom trigger thresholds for hardware telemetry, sales performance, and SLA escalations.
              </p>
            </div>
            <button 
              type="button" 
              onClick={handleSaveThresholds} 
              className="cc-btn cc-btn-primary text-xs py-1.5 px-4 font-bold"
            >
              Save Alert Rules
            </button>
          </div>

          <form onSubmit={handleSaveThresholds} className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-3.5 rounded bg-black/20 border border-white/5 space-y-1.5">
              <label className="font-bold text-white block">1. Screen Offline Trigger</label>
              <span className="text-[10px] text-gray-400 block">Trigger critical alert when TMS screen connection is lost for longer than:</span>
              <div className="flex items-center gap-2 mt-1">
                <input 
                  type="number" 
                  value={alertThresholds.screenOfflineMinutes} 
                  onChange={(e) => setAlertThresholds({ ...alertThresholds, screenOfflineMinutes: parseInt(e.target.value) || 2 })}
                  className="w-20 cc-input py-1 text-xs" 
                />
                <span className="text-gray-300">Minutes</span>
              </div>
            </div>

            <div className="p-3.5 rounded bg-black/20 border border-white/5 space-y-1.5">
              <label className="font-bold text-white block">2. Projector Critical Temperature</label>
              <span className="text-[10px] text-gray-400 block">Trigger immediate cooling alarm when laser optical temp exceeds:</span>
              <div className="flex items-center gap-2 mt-1">
                <input 
                  type="number" 
                  value={alertThresholds.projectorTempCritical} 
                  onChange={(e) => setAlertThresholds({ ...alertThresholds, projectorTempCritical: parseInt(e.target.value) || 42 })}
                  className="w-20 cc-input py-1 text-xs" 
                />
                <span className="text-gray-300">°Celsius</span>
              </div>
            </div>

            <div className="p-3.5 rounded bg-black/20 border border-white/5 space-y-1.5">
              <label className="font-bold text-white block">3. Fire Safety Sensor Trip</label>
              <span className="text-[10px] text-gray-400 block">Sprinkler line drop or smoke detector trip policy:</span>
              <select 
                value={alertThresholds.fireAlertTrigger} 
                onChange={(e) => setAlertThresholds({ ...alertThresholds, fireAlertTrigger: e.target.value })}
                className="w-full cc-input py-1.5 text-xs mt-1"
              >
                <option value="Auto Dispatch NOC">Auto Dispatch NOC &amp; Sound Auditorium Alarm</option>
                <option value="Silent GM Notification">Silent Alert to Duty General Manager</option>
              </select>
            </div>

            <div className="p-3.5 rounded bg-black/20 border border-white/5 space-y-1.5">
              <label className="font-bold text-white block">4. Inventory Minimum Reorder Point</label>
              <span className="text-[10px] text-gray-400 block">Raise low-inventory alert when stock units fall below:</span>
              <div className="flex items-center gap-2 mt-1">
                <input 
                  type="number" 
                  value={alertThresholds.inventoryMinUnits} 
                  onChange={(e) => setAlertThresholds({ ...alertThresholds, inventoryMinUnits: parseInt(e.target.value) || 40 })}
                  className="w-20 cc-input py-1 text-xs" 
                />
                <span className="text-gray-300">Units / Canisters</span>
              </div>
            </div>

            <div className="p-3.5 rounded bg-black/20 border border-white/5 space-y-1.5">
              <label className="font-bold text-white block">5. Occupancy Thresholds (Low &amp; High)</label>
              <span className="text-[10px] text-gray-400 block">Alert when show occupancy is below min or exceeds capacity max:</span>
              <div className="flex items-center gap-3 mt-1">
                <div className="flex items-center gap-1">
                  <span className="text-gray-400">Min:</span>
                  <input 
                    type="number" 
                    value={alertThresholds.occupancyMinPercent} 
                    onChange={(e) => setAlertThresholds({ ...alertThresholds, occupancyMinPercent: parseInt(e.target.value) || 30 })}
                    className="w-16 cc-input py-1 text-xs" 
                  />
                  <span>%</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-gray-400">Max:</span>
                  <input 
                    type="number" 
                    value={alertThresholds.occupancyMaxPercent} 
                    onChange={(e) => setAlertThresholds({ ...alertThresholds, occupancyMaxPercent: parseInt(e.target.value) || 90 })}
                    className="w-16 cc-input py-1 text-xs" 
                  />
                  <span>%</span>
                </div>
              </div>
            </div>

            <div className="p-3.5 rounded bg-black/20 border border-white/5 space-y-1.5">
              <label className="font-bold text-white block">6. Revenue Target Variance</label>
              <span className="text-[10px] text-gray-400 block">Notify when daily box office deviates from scheduled target by:</span>
              <div className="flex items-center gap-2 mt-1">
                <input 
                  type="number" 
                  value={alertThresholds.revenueTargetDeviation} 
                  onChange={(e) => setAlertThresholds({ ...alertThresholds, revenueTargetDeviation: parseInt(e.target.value) || 15 })}
                  className="w-20 cc-input py-1 text-xs" 
                />
                <span className="text-gray-300">% Deviation (±)</span>
              </div>
            </div>

            <div className="p-3.5 rounded bg-black/20 border border-white/5 space-y-1.5">
              <label className="font-bold text-white block">7. Maintenance SLA Exceedance</label>
              <span className="text-[10px] text-gray-400 block">Escalate ticket to Corporate Technical Director when unresolved after:</span>
              <div className="flex items-center gap-2 mt-1">
                <input 
                  type="number" 
                  value={alertThresholds.maintenanceSlaHours} 
                  onChange={(e) => setAlertThresholds({ ...alertThresholds, maintenanceSlaHours: parseInt(e.target.value) || 12 })}
                  className="w-20 cc-input py-1 text-xs" 
                />
                <span className="text-gray-300">Hours</span>
              </div>
            </div>

            <div className="p-3.5 rounded bg-black/20 border border-white/5 space-y-1.5">
              <label className="font-bold text-white block">8. Settlement Pending Threshold</label>
              <span className="text-[10px] text-gray-400 block">Notify accounts team when payment gateway settlements remain unpaid beyond:</span>
              <div className="flex items-center gap-2 mt-1">
                <input 
                  type="number" 
                  value={alertThresholds.settlementPendingDays} 
                  onChange={(e) => setAlertThresholds({ ...alertThresholds, settlementPendingDays: parseInt(e.target.value) || 3 })}
                  className="w-20 cc-input py-1 text-xs" 
                />
                <span className="text-gray-300">Days</span>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
