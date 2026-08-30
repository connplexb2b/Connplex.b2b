import React, { useState } from 'react';
import { ConnCloudStore, Equipment, MaintenanceTicket } from '../../../lib/conncloudData';

interface OperationsViewProps {
  selectedCinemaId: string;
  selectedDateRange: string;
  triggerNotification: (msg: string) => void;
}

export default function OperationsView({
  selectedCinemaId,
  selectedDateRange,
  triggerNotification
}: OperationsViewProps) {
  const [subSection, setSubSection] = useState<'screens' | 'equipment' | 'maintenance' | 'simulator'>('screens');

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

  const [ticketForm, setTicketForm] = useState({
    equipmentId: 'eq3',
    issue: '',
    priority: 'Medium' as MaintenanceTicket['priority'],
    technician: 'Barco Services India',
    SLA: '24 Hours'
  });

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
    setTicketForm({ equipmentId: 'eq3', issue: '', priority: 'Medium', technician: 'Barco Services India', SLA: '24 Hours' });
    setSubSection('maintenance');
  };

  // Telemetry Fail Simulator Trigger
  const triggerTelemetryFailure = (eqId: string) => {
    // Set status to Offline and health to 12
    const success = ConnCloudStore.updateEquipmentStatus(eqId, 'Offline', 12);
    if (success) {
      triggerNotification(`IoT TELEMETRY: Equipment ${eqId} has failed (Offline, 12% health). Automated ticket dispatch triggered.`);
      // Reload parent container states if any
    }
  };

  return (
    <div className="space-y-6">
      {/* Sub nav tabs */}
      <section className="flex flex-wrap gap-1 bg-[#111827] border border-white/5 p-2 rounded-xl">
        {[
          { id: 'screens', label: 'Live Screens Status' },
          { id: 'equipment', label: 'Equipment Telemetry' },
          { id: 'maintenance', label: 'Service Tickets Log' },
          { id: 'simulator', label: 'IoT Failure Simulator' }
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
                    <span className="text-[10px] text-gray-500 uppercase tracking-wide">{screen.format}</span>
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
                      {projector?.status || 'Unknown'} {projector?.temperature && `(${projector.temperature}°C)`}
                    </span>
                  </div>
                  <div className="p-2.5 rounded bg-black/20 border border-white/5">
                    <span className="text-gray-400 block mb-1">HVAC Zone</span>
                    <span className={`font-semibold ${
                      hvac?.status === 'Healthy' ? 'text-emerald-400' : 'text-amber-400'
                    }`}>
                      {hvac?.status || 'Unknown'}
                    </span>
                  </div>
                  <div className="p-2.5 rounded bg-black/20 border border-white/5">
                    <span className="text-gray-400 block mb-1">Audio Dolby</span>
                    <span className="text-emerald-400 font-semibold">Active</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 2. EQUIPMENT */}
      {subSection === 'equipment' && (
        <div className="cc-card">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-4">IoT Hardware Telemetry</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-white/10 text-gray-400 font-bold">
                  <th className="pb-3">Equipment ID</th>
                  <th className="pb-3">Type</th>
                  <th className="pb-3">Vendor / Service</th>
                  <th className="pb-3 text-center">Health Index</th>
                  <th className="pb-3 text-center">Last Maintenance</th>
                  <th className="pb-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody>
                {equipment.map((eq) => (
                  <tr key={eq.equipmentId} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="py-3 font-semibold text-gray-300">{eq.equipmentId}</td>
                    <td className="py-3 font-bold text-white">{eq.type}</td>
                    <td className="py-3 text-gray-400">{eq.vendor}</td>
                    <td className="py-3 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <span className={`font-bold font-mono ${
                          eq.health > 80 ? 'text-emerald-400' : (eq.health > 50 ? 'text-amber-400' : 'text-red-400')
                        }`}>
                          {eq.health}%
                        </span>
                      </div>
                    </td>
                    <td className="py-3 text-center text-gray-400 font-mono">{eq.lastMaintenance}</td>
                    <td className="py-3 text-center">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        eq.status === 'Healthy' ? 'bg-emerald-500/10 text-emerald-400' : (eq.status === 'Warning' ? 'bg-amber-500/10 text-amber-400' : 'bg-red-500/10 text-red-400')
                      }`}>
                        {eq.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. MAINTENANCE TICKETS */}
      {subSection === 'maintenance' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Active tickets */}
          <div className="lg:col-span-2 cc-card">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-4 font-display">Active Service Tickets</h3>
            <div className="space-y-4">
              {tickets.length === 0 ? (
                <div className="py-8 text-center text-gray-500">All hardware units functioning normally. No active tickets.</div>
              ) : (
                tickets.map((t) => (
                  <div key={t.ticketId} className="p-4 rounded bg-black/20 border border-white/5 text-xs">
                    <div className="flex justify-between items-center mb-2.5">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-white text-sm">{t.ticketId}</span>
                        <span className="text-[10px] text-gray-400">Assigned: {t.technician}</span>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        t.priority === 'Critical' ? 'bg-red-500/10 text-red-400' : 'bg-amber-500/10 text-amber-400'
                      }`}>
                        {t.priority}
                      </span>
                    </div>
                    <p className="text-gray-300 font-medium">{t.issue}</p>
                    <div className="flex justify-between items-center mt-3 border-t border-white/5 pt-2">
                      <span className="text-[10px] text-gray-500">Target SLA: {t.SLA} • Logged: {t.date}</span>
                      <span className="text-[10px] font-bold text-blue-400 uppercase">{t.status}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Raise ticket form */}
          <div className="cc-card">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-4">Create Service Request</h3>
            <form onSubmit={handleTicketSubmit} className="space-y-4 text-xs">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase font-bold text-gray-400">Select Equipment</label>
                <select 
                  className="cc-input"
                  value={ticketForm.equipmentId}
                  onChange={(e) => setTicketForm(prev => ({ ...prev, equipmentId: e.target.value }))}
                >
                  {equipment.map(eq => (
                    <option key={eq.equipmentId} value={eq.equipmentId}>{eq.equipmentId} - {eq.type}</option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase font-bold text-gray-400">Fault Description</label>
                <textarea 
                  className="cc-input min-h-[80px]"
                  placeholder="Provide precise details of telemetry warnings..."
                  value={ticketForm.issue}
                  onChange={(e) => setTicketForm(prev => ({ ...prev, issue: e.target.value }))}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] uppercase font-bold text-gray-400">Priority Level</label>
                  <select 
                    className="cc-input"
                    value={ticketForm.priority}
                    onChange={(e) => setTicketForm(prev => ({ ...prev, priority: e.target.value as any }))}
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] uppercase font-bold text-gray-400">SLA Response Window</label>
                  <select 
                    className="cc-input"
                    value={ticketForm.SLA}
                    onChange={(e) => setTicketForm(prev => ({ ...prev, SLA: e.target.value }))}
                  >
                    <option value="2 Hours">Emergency (2h)</option>
                    <option value="12 Hours">High SLA (12h)</option>
                    <option value="24 Hours">Standard (24h)</option>
                  </select>
                </div>
              </div>

              <button type="submit" className="w-full cc-btn cc-btn-accent text-blue-950 font-bold mt-4">
                Dispatch Service Ticket
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 4. SIMULATOR */}
      {subSection === 'simulator' && (
        <div className="cc-card">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-2">Hardware Telemetry Fail Simulator</h3>
          <p className="text-xs text-gray-500 mb-6">Proactively test automated maintenance workflows. Clicking "Simulate Failure" will set the hardware component offline (health &lt; 20%), dispatch an SLA service ticket, and write a secure audit entry.</p>
          
          <div className="space-y-4">
            {equipment.map((eq) => (
              <div key={eq.equipmentId} className="p-4 rounded bg-black/25 border border-white/5 flex justify-between items-center text-xs">
                <div>
                  <span className="font-bold text-white text-sm">{eq.equipmentId} ({eq.type})</span>
                  <p className="text-gray-400 mt-1">Vendor: {eq.vendor} • Screen: {eq.screenId}</p>
                </div>
                <button
                  onClick={() => triggerTelemetryFailure(eq.equipmentId)}
                  disabled={eq.status === 'Offline'}
                  className="cc-btn cc-btn-outline px-3 py-1 border-red-500/30 text-red-400 hover:bg-red-500/10 disabled:opacity-50"
                >
                  {eq.status === 'Offline' ? 'Offline simulated' : 'Simulate Failure'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
