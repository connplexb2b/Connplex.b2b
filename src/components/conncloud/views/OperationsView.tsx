import React, { useState } from 'react';
import { ConnCloudStore, Equipment, MaintenanceTicket } from '../../../lib/conncloudData';

interface OperationsViewProps {
  selectedCinemaId: string;
  selectedDateRange: string;
  triggerNotification: (msg: string) => void;
  initialSubSection?: string;
}

export type OperationsSubSection = 
  | 'screens' 
  | 'equipment' 
  | 'projector' 
  | 'hvac' 
  | 'sound' 
  | 'power' 
  | 'fire' 
  | 'cleaning' 
  | 'maintenance' 
  | 'inventory' 
  | 'vendors' 
  | 'simulator';

export default function OperationsView({
  selectedCinemaId,
  selectedDateRange,
  triggerNotification,
  initialSubSection
}: OperationsViewProps) {
  const resolveSubSection = (sec?: string): OperationsSubSection => {
    if (!sec) return 'screens';
    const s = sec.toLowerCase();
    if (s.includes('proj')) return 'projector';
    if (s.includes('hvac') || s.includes('cool') || s.includes('air')) return 'hvac';
    if (s.includes('sound') || s.includes('audio') || s.includes('atmos')) return 'sound';
    if (s.includes('power') || s.includes('ups') || s.includes('volt')) return 'power';
    if (s.includes('fire') || s.includes('safety') || s.includes('noc')) return 'fire';
    if (s.includes('clean') || s.includes('sanit')) return 'cleaning';
    if (s.includes('maint') || s.includes('ticket')) return 'maintenance';
    if (s.includes('invent') || s.includes('spare')) return 'inventory';
    if (s.includes('vend') || s.includes('amc')) return 'vendors';
    if (s.includes('sim')) return 'simulator';
    if (s.includes('equip')) return 'equipment';
    return 'screens';
  };

  const [subSection, setSubSection] = useState<OperationsSubSection>(() => resolveSubSection(initialSubSection));

  React.useEffect(() => {
    if (initialSubSection) {
      setSubSection(resolveSubSection(initialSubSection));
    }
  }, [initialSubSection]);

  // Pull records from store
  const screens = ConnCloudStore.getScreens().filter(s => selectedCinemaId === 'all' || s.cinemaId === selectedCinemaId);
  const equipment = ConnCloudStore.getEquipment().filter(eq => {
    const scr = ConnCloudStore.getScreens().find(s => s.screenId === eq.screenId);
    return selectedCinemaId === 'all' || scr?.cinemaId === selectedCinemaId;
  });
  const tickets = ConnCloudStore.getMaintenanceTickets().filter(t => {
    const eq = ConnCloudStore.getEquipment().find(e => e.equipmentId === t.equipmentId);
    const scr = ConnCloudStore.getScreens().find(s => s.screenId === eq?.screenId);
    return selectedCinemaId === 'all' || scr?.cinemaId === selectedCinemaId;
  });

  const isAhilyanagar = selectedCinemaId === 'c5';
  const defaultEquipmentId = isAhilyanagar ? (equipment[0]?.equipmentId || 'eq_ah1') : (equipment[0]?.equipmentId || 'eq3');
  const defaultTechnician = isAhilyanagar ? 'Barco Laser Services India' : 'Barco Services India';

  const [ticketForm, setTicketForm] = useState({
    equipmentId: defaultEquipmentId,
    issue: '',
    priority: 'Medium' as MaintenanceTicket['priority'],
    technician: defaultTechnician,
    SLA: '24 Hours'
  });

  React.useEffect(() => {
    if (equipment.length > 0 && !equipment.some(e => e.equipmentId === ticketForm.equipmentId)) {
      setTicketForm(prev => ({
        ...prev,
        equipmentId: equipment[0].equipmentId,
        technician: isAhilyanagar ? 'Barco Laser Services India' : 'Barco Services India'
      }));
    }
  }, [selectedCinemaId, equipment, isAhilyanagar]);

  // Ticket creation handler
  const handleTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketForm.issue) return;

    ConnCloudStore.addMaintenanceTicket({
      equipmentId: ticketForm.equipmentId,
      issue: ticketForm.issue,
      priority: ticketForm.priority,
      technician: ticketForm.technician,
      SLA: ticketForm.SLA,
      status: 'New'
    });

    triggerNotification(`Maintenance Service Ticket registered for ${ticketForm.equipmentId}.`);
    setTicketForm({ equipmentId: defaultEquipmentId, issue: '', priority: 'Medium', technician: defaultTechnician, SLA: '24 Hours' });
    setSubSection('maintenance');
  };

  // Status transition: Healthy -> Warning -> Critical -> Offline
  const handleStatusChange = (eqId: string, newStatus: Equipment['status']) => {
    const newHealth = newStatus === 'Healthy' ? 98 : (newStatus === 'Warning' ? 72 : (newStatus === 'Critical' ? 40 : 10));
    ConnCloudStore.updateEquipmentStatus(eqId, newStatus, newHealth);
    
    if (newStatus === 'Critical' || newStatus === 'Offline') {
      triggerNotification(`CRITICAL ALERT: Equipment ${eqId} status changed to ${newStatus}. Auto-generating SLA ticket.`);
      ConnCloudStore.addMaintenanceTicket({
        equipmentId: eqId,
        issue: `Automated Telemetry Incident: Equipment is ${newStatus} with health ${newHealth}%.`,
        priority: 'High',
        technician: isAhilyanagar ? 'Barco Laser Services India' : 'Barco Services India',
        SLA: '4 Hours',
        status: 'New'
      });
    } else {
      triggerNotification(`Equipment ${eqId} status set to ${newStatus}.`);
    }
  };

  const subSectionsList: { id: OperationsSubSection; label: string; icon: string }[] = [
    { id: 'screens', label: 'Live Screens', icon: 'fa-tv' },
    { id: 'equipment', label: 'Equipment Registry', icon: 'fa-server' },
    { id: 'projector', label: 'Projector Health', icon: 'fa-video' },
    { id: 'hvac', label: 'HVAC Monitoring', icon: 'fa-snowflake' },
    { id: 'sound', label: 'Dolby Atmos Sound', icon: 'fa-volume-high' },
    { id: 'power', label: 'Power & UPS', icon: 'fa-bolt' },
    { id: 'fire', label: 'Fire Safety', icon: 'fa-fire-extinguisher' },
    { id: 'cleaning', label: 'Cleaning Schedule', icon: 'fa-broom' },
    { id: 'maintenance', label: 'Maintenance Requests', icon: 'fa-screwdriver-wrench' },
    { id: 'inventory', label: 'Operational Spares', icon: 'fa-boxes-stacked' },
    { id: 'vendors', label: 'Vendor & AMCs', icon: 'fa-handshake' },
    { id: 'simulator', label: 'Telemetry Simulator', icon: 'fa-triangle-exclamation' }
  ];

  return (
    <div className="space-y-6">
      {/* Telemetry Banner */}
      {isAhilyanagar && (
        <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-900/30 via-emerald-800/10 to-transparent border border-emerald-500/30 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
          <div className="flex items-start md:items-center gap-3">
            <span className="relative flex h-3 w-3 mt-0.5 md:mt-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            <div>
              <span className="font-bold text-emerald-300 uppercase tracking-wider text-[11px] block">
                TMS &amp; IoT Telemetry Live • Connplex Ahilyanagar
              </span>
              <span className="text-gray-300 text-[11px]">
                Screen 1 (Luxuriance Couple Recliner) &amp; Screen 2 (Gold Class) connected to Barco Laser &amp; Christie Digital NOC • Daikin VRV HVAC: 21.5°C Optimal • 80kVA Online UPS Active
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 self-start md:self-auto font-mono text-[11px] text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded border border-emerald-500/30">
            <span>PING 14ms</span>
            <span>•</span>
            <span>100% HEALTH</span>
          </div>
        </div>
      )}

      {/* Sub Nav Tabs */}
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

      {/* 1. LIVE SCREENS */}
      {subSection === 'screens' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {screens.map((screen) => {
            const screenEquipment = equipment.filter(eq => eq.screenId === screen.screenId);
            const projector = screenEquipment.find(e => e.type === 'Projector');
            const hvac = screenEquipment.find(e => e.type === 'HVAC');
            
            return (
              <div key={screen.screenId} className="cc-card space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-white text-base">{screen.name}</h4>
                    <span className="text-[10px] text-gray-500 uppercase tracking-wide">{screen.format} • {screen.capacity} Seats</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    screen.status === 'Healthy' ? 'bg-emerald-500/10 text-emerald-400' : (screen.status === 'Warning' ? 'bg-amber-500/10 text-amber-400' : 'bg-red-500/10 text-red-400')
                  }`}>
                    {screen.status}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2.5 text-[11px]">
                  <div className="p-2.5 rounded bg-black/20 border border-white/5">
                    <span className="text-gray-400 block mb-1">Projector</span>
                    <span className={`font-semibold ${
                      projector?.status === 'Healthy' ? 'text-emerald-400' : (projector?.status === 'Warning' ? 'text-amber-400' : 'text-red-400')
                    }`}>
                      {projector?.status || 'Active'} {projector?.temperature && `(${projector.temperature}°C)`}
                    </span>
                  </div>
                  <div className="p-2.5 rounded bg-black/20 border border-white/5">
                    <span className="text-gray-400 block mb-1">HVAC Zone</span>
                    <span className={`font-semibold ${
                      hvac?.status === 'Healthy' ? 'text-emerald-400' : 'text-amber-400'
                    }`}>
                      {hvac?.status || 'Active (22°C)'}
                    </span>
                  </div>
                  <div className="p-2.5 rounded bg-black/20 border border-white/5">
                    <span className="text-gray-400 block mb-1">Audio Dolby</span>
                    <span className="text-emerald-400 font-semibold">Atmos Active</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 2. EQUIPMENT REGISTRY */}
      {subSection === 'equipment' && (
        <div className="cc-card">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-4">Equipment Registry &amp; Lifecycle</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-white/10 text-gray-400 font-bold">
                  <th className="pb-3">Equipment ID</th>
                  <th className="pb-3">Type</th>
                  <th className="pb-3">Vendor / Service</th>
                  <th className="pb-3 text-center">Health Index</th>
                  <th className="pb-3 text-center">Last Serviced</th>
                  <th className="pb-3 text-center">Status</th>
                  <th className="pb-3 text-center">Workflow Action</th>
                </tr>
              </thead>
              <tbody>
                {equipment.map((eq) => (
                  <tr key={eq.equipmentId} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="py-3 font-semibold text-gray-300 font-mono">{eq.equipmentId}</td>
                    <td className="py-3 font-bold text-white">{eq.type}</td>
                    <td className="py-3 text-gray-400">{eq.vendor}</td>
                    <td className="py-3 text-center">
                      <span className={`font-bold font-mono ${
                        eq.health > 80 ? 'text-emerald-400' : (eq.health > 50 ? 'text-amber-400' : 'text-red-400')
                      }`}>
                        {eq.health}%
                      </span>
                    </td>
                    <td className="py-3 text-center text-gray-400 font-mono">{eq.lastMaintenance}</td>
                    <td className="py-3 text-center">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        eq.status === 'Healthy' ? 'bg-emerald-500/10 text-emerald-400' : (eq.status === 'Warning' ? 'bg-amber-500/10 text-amber-400' : (eq.status === 'Critical' ? 'bg-red-500/20 text-red-300' : 'bg-red-900/40 text-red-400'))
                      }`}>
                        {eq.status}
                      </span>
                    </td>
                    <td className="py-3 text-center">
                      <select 
                        value={eq.status} 
                        onChange={(e) => handleStatusChange(eq.equipmentId, e.target.value as any)}
                        className="bg-black/30 border border-white/10 text-[10px] text-gray-300 rounded px-2 py-0.5"
                      >
                        <option value="Healthy">Healthy</option>
                        <option value="Warning">Warning</option>
                        <option value="Critical">Critical</option>
                        <option value="Offline">Offline</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. PROJECTOR HEALTH */}
      {subSection === 'projector' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { screen: 'Screen 1', model: 'Barco Series 4 SP4K-12B (RGB Laser)', laserHours: '1,240 / 30,000 hrs', temp: '28.2°C', cooling: 'Liquid Chiller Nominal', convergence: 'Calibrated', status: 'Healthy' },
              { screen: 'Screen 2', model: 'Barco Smart Laser SP2K-7S (Smart Laser)', laserHours: '980 / 30,000 hrs', temp: '29.0°C', cooling: 'Active Air Nominal', convergence: 'Calibrated', status: 'Healthy' }
            ].map(p => (
              <div key={p.screen} className="cc-card space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-white text-base">{p.screen}: {p.model}</h4>
                    <span className="text-xs text-gray-400">DCI Compliant 4K Laser Engine</span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {p.status}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-white/5">
                  <span className="text-gray-400">Laser Life: <strong className="text-white">{p.laserHours}</strong></span>
                  <span className="text-gray-400">Operating Temp: <strong className="text-emerald-400">{p.temp}</strong></span>
                  <span className="text-gray-400">Cooling Loop: <strong className="text-white">{p.cooling}</strong></span>
                  <span className="text-gray-400">Optics &amp; Lens: <strong className="text-blue-400">{p.convergence}</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. HVAC MONITORING */}
      {subSection === 'hvac' && (
        <div className="cc-card">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-4">Daikin VRV Dual Inverter HVAC Telemetry</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { zone: 'Auditorium Screen 1 (Couple Recliner)', currentTemp: '21.5°C', setPoint: '22.0°C', humidity: '48%', airQuality: 'AQI 32 (Good)', compressor: 'Duty Active (65% Load)' },
              { zone: 'Auditorium Screen 2 (Gold Class)', currentTemp: '22.0°C', setPoint: '22.0°C', humidity: '50%', airQuality: 'AQI 35 (Good)', compressor: 'Duty Active (70% Load)' }
            ].map(z => (
              <div key={z.zone} className="p-4 rounded-xl bg-black/20 border border-white/5 space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <strong className="text-white text-sm">{z.zone}</strong>
                  <span className="text-emerald-400 font-bold">{z.currentTemp}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/5 text-[11px] text-gray-400">
                  <span>Target Set: <strong className="text-white">{z.setPoint}</strong></span>
                  <span>Humidity: <strong className="text-white">{z.humidity}</strong></span>
                  <span>Filtration AQI: <strong className="text-emerald-400">{z.airQuality}</strong></span>
                  <span>Chiller Comp: <strong className="text-white">{z.compressor}</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. SOUND SYSTEM HEALTH */}
      {subSection === 'sound' && (
        <div className="cc-card">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-4">Dolby Atmos Audio Processors &amp; Multi-Channel Amps</h3>
          <div className="space-y-3">
            {[
              { unit: 'Dolby CP950 Cinema Audio Processor', channels: '16 Channels Digital', noiseFloor: '-96 dB', status: 'Healthy • Calibrated' },
              { unit: 'Crown DCI Multi-Channel Power Amplifiers', channels: 'Subwoofer + Surround Array', impedance: '4/8 Ohm Balanced', status: 'Healthy • Nominal' }
            ].map(s => (
              <div key={s.unit} className="p-3 bg-black/20 rounded border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div>
                  <h4 className="font-semibold text-white">{s.unit}</h4>
                  <span className="text-gray-400 text-[11px]">Configuration: {s.channels}</span>
                </div>
                <span className="px-2.5 py-1 rounded font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 text-xs self-start sm:self-auto">
                  {s.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 6. POWER & UPS */}
      {subSection === 'power' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="cc-card">
            <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold block mb-1">Mains Input Voltage</span>
            <div className="text-3xl font-extrabold text-white">415V <span className="text-sm text-gray-400">3-Phase</span></div>
            <div className="text-xs text-emerald-400 mt-2 font-semibold">Grid Frequency: 50.0 Hz (Stable)</div>
          </div>
          <div className="cc-card">
            <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold block mb-1">Online UPS Battery Load</span>
            <div className="text-3xl font-extrabold text-emerald-400">42% Load</div>
            <div className="text-xs text-gray-400 mt-2">80 kVA Capacity • 45 mins full backup</div>
          </div>
          <div className="cc-card">
            <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold block mb-1">Diesel Generator (DG) Standby</span>
            <div className="text-3xl font-extrabold text-blue-400">Auto Ready</div>
            <div className="text-xs text-gray-400 mt-2">125 kVA Cummins Silent DG</div>
          </div>
        </div>
      )}

      {/* 7. FIRE SAFETY */}
      {subSection === 'fire' && (
        <div className="cc-card">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400">Fire Safety &amp; Statutory NOC Readiness</h3>
              <p className="text-xs text-gray-500 mt-0.5">Automated sprinkler lines, smoke detectors, and Maharashtra Fire NOC audit status</p>
            </div>
            <span className="px-2.5 py-1 rounded text-xs font-mono font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
              NOC VALID TILL DEC 2026
            </span>
          </div>
          <div className="space-y-3">
            {[
              { system: 'Main Sprinkler Line Riser Pressure', sensor: 'Zone 1 & 2 Aud', value: '7.2 Bar (Nominal)', status: 'PASS' },
              { system: 'Auditorium Photoelectric Smoke Sensors', sensor: '8 Sensors Active', value: '0 Alarms Triggered', status: 'PASS' },
              { system: 'Illuminated Emergency Exit Pathways', sensor: 'All Emergency Doors', value: 'Battery Backup Tested', status: 'PASS' }
            ].map((f, i) => (
              <div key={i} className="p-3 bg-black/20 rounded border border-white/5 flex justify-between items-center text-xs">
                <div>
                  <strong className="text-white block">{f.system}</strong>
                  <span className="text-gray-400 text-[11px]">{f.sensor} • Telemetry Reading: {f.value}</span>
                </div>
                <span className="px-2.5 py-0.5 rounded font-bold text-emerald-400 bg-emerald-500/10 text-xs">
                  {f.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 8. CLEANING SCHEDULE */}
      {subSection === 'cleaning' && (
        <div className="cc-card">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-4">Screen Sanitization &amp; Turn-Around Log</h3>
          <div className="space-y-3">
            {[
              { screen: 'Screen 1 (Couple Recliners)', time: '14:00 - 14:15 PM', status: 'Completed', cleaner: 'Ramesh Kadam', checks: 'Recliner leather sanitization, floor vacuumed' },
              { screen: 'Screen 2 (Gold Class)', time: '14:05 - 14:20 PM', status: 'Completed', cleaner: 'Team Shift A', checks: 'Cup holders sanitized, aisle clearing' },
              { screen: 'Screen 1 (Couple Recliners)', time: '17:15 - 17:30 PM', status: 'Scheduled', cleaner: 'Team Shift B', checks: 'Intermission preparation' }
            ].map((c, i) => (
              <div key={i} className="p-3 bg-black/20 rounded border border-white/5 flex justify-between items-center text-xs">
                <div>
                  <strong className="text-white block">{c.screen} ({c.time})</strong>
                  <span className="text-gray-400 text-[11px]">Assigned: {c.cleaner} • Tasks: {c.checks}</span>
                </div>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  c.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-blue-500/10 text-blue-400'
                }`}>
                  {c.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 9. MAINTENANCE REQUESTS */}
      {subSection === 'maintenance' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 cc-card">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-4 font-display">Active Service Tickets</h3>
            <div className="space-y-4">
              {tickets.length === 0 ? (
                <div className="text-center py-8 text-gray-500 text-xs">No active maintenance tickets recorded.</div>
              ) : (
                tickets.map((t) => (
                  <div key={t.ticketId} className="p-4 rounded bg-black/20 border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-sm">{t.equipmentId}</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          t.priority === 'High' ? 'bg-red-500/10 text-red-400' : 'bg-amber-500/10 text-amber-400'
                        }`}>
                          {t.priority} Priority
                        </span>
                      </div>
                      <p className="text-gray-400 mt-1.5">{t.issue}</p>
                      <span className="text-[10px] text-gray-500 block mt-1">Assigned Vendor: {t.technician} • SLA: {t.SLA}</span>
                    </div>
                    <span className="px-2.5 py-1 rounded font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 text-xs self-start sm:self-auto">
                      {t.status}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="cc-card">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-4 font-display">Dispatch Service Request</h3>
            <form onSubmit={handleTicketSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="text-gray-400 block mb-1">Equipment</label>
                <select 
                  value={ticketForm.equipmentId}
                  onChange={(e) => setTicketForm({ ...ticketForm, equipmentId: e.target.value })}
                  className="w-full cc-input py-1.5"
                >
                  {equipment.map(e => (
                    <option key={e.equipmentId} value={e.equipmentId}>{e.equipmentId} ({e.type})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-gray-400 block mb-1">Issue Description</label>
                <textarea 
                  value={ticketForm.issue}
                  onChange={(e) => setTicketForm({ ...ticketForm, issue: e.target.value })}
                  placeholder="Describe problem observed..."
                  className="w-full cc-input py-1.5 h-20"
                  required
                ></textarea>
              </div>
              <div>
                <label className="text-gray-400 block mb-1">Priority</label>
                <select 
                  value={ticketForm.priority}
                  onChange={(e) => setTicketForm({ ...ticketForm, priority: e.target.value as any })}
                  className="w-full cc-input py-1.5"
                >
                  <option value="Low">Low (Informational)</option>
                  <option value="Medium">Medium (Scheduled)</option>
                  <option value="High">High (Immediate)</option>
                </select>
              </div>
              <button type="submit" className="w-full cc-btn cc-btn-primary py-2 mt-2">Submit Ticket</button>
            </form>
          </div>
        </div>
      )}

      {/* 10. OPERATIONAL INVENTORY */}
      {subSection === 'inventory' && (
        <div className="cc-card">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-4">Operational Spares &amp; Consumables</h3>
          <div className="space-y-3">
            {[
              { item: 'MasterImage 3D Polarized Glasses', stock: '850 units', target: '1,000 units', status: 'Adequate' },
              { item: 'Air Filter Cartridges for Barco Series 4', stock: '4 sets', target: '2 sets min', status: 'Healthy' },
              { item: 'Spare Recliner Linear Actuator Motor', stock: '2 units', target: '1 unit min', status: 'Adequate' }
            ].map(sp => (
              <div key={sp.item} className="p-3 bg-black/20 rounded border border-white/5 flex justify-between items-center text-xs">
                <div>
                  <strong className="text-white block">{sp.item}</strong>
                  <span className="text-gray-400 text-[11px]">Stock on site: {sp.stock} (Target: {sp.target})</span>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400">
                  {sp.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 11. VENDOR MANAGEMENT */}
      {subSection === 'vendors' && (
        <div className="cc-card">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-4">Equipment Vendors &amp; AMC Contracts</h3>
          <div className="space-y-3">
            {[
              { vendor: 'Barco Laser Services India Pvt Ltd', system: 'Series 4 Laser Projectors', amc: 'Comprehensive AMC (Till Dec 2027)', sla: '4 Hours Remote / 24h On-site' },
              { vendor: 'Daikin Airconditioning India Pvt Ltd', system: 'VRV Chiller & HVAC System', amc: 'Gold Care AMC (Till Nov 2026)', sla: '8 Hours Turnaround' },
              { vendor: 'Dolby Laboratories India', system: 'Atmos Processors & Sound Tuning', amc: 'Annual Calibration Certificate', sla: 'Priority Tech Hotline' }
            ].map(v => (
              <div key={v.vendor} className="p-3 bg-black/20 rounded border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div>
                  <strong className="text-white text-sm block">{v.vendor}</strong>
                  <span className="text-gray-400 text-[11px]">Scope: {v.system} • AMC: {v.amc}</span>
                </div>
                <span className="px-2.5 py-1 rounded text-xs font-mono font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20 self-start sm:self-auto">
                  SLA: {v.sla}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 12. TELEMETRY SIMULATOR */}
      {subSection === 'simulator' && (
        <div className="cc-card space-y-4">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400">IoT Telemetry Hardware Fault Simulator</h3>
          <p className="text-xs text-gray-400">
            Trigger simulated hardware faults to test TMS automated alerts, incident logging, and emergency dispatch ticketing.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            {equipment.map(eq => (
              <div key={eq.equipmentId} className="p-4 rounded bg-black/20 border border-white/5 flex justify-between items-center text-xs">
                <div>
                  <span className="font-bold text-white block">{eq.equipmentId} ({eq.type})</span>
                  <span className="text-[10px] text-gray-400">Current Health: {eq.health}% • {eq.status}</span>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleStatusChange(eq.equipmentId, 'Critical')}
                    className="px-2.5 py-1 bg-red-600/30 hover:bg-red-600/50 text-red-300 border border-red-500/30 rounded text-[10px] font-bold"
                  >
                    Set Critical
                  </button>
                  <button 
                    onClick={() => handleStatusChange(eq.equipmentId, 'Healthy')}
                    className="px-2.5 py-1 bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-300 border border-emerald-500/30 rounded text-[10px] font-bold"
                  >
                    Reset Normal
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
