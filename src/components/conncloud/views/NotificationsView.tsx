import React, { useState } from 'react';
import { ConnCloudStore } from '../../../lib/conncloudData';

interface NotificationsViewProps {
  onNavigate: (route: string) => void;
  triggerNotification: (msg: string) => void;
}

export default function NotificationsView({ onNavigate, triggerNotification }: NotificationsViewProps) {
  const [filterSeverity, setFilterSeverity] = useState<'All' | 'Critical' | 'Warning' | 'Info' | 'Success'>('All');
  
  // Specific required notification roster
  const [notifs, setNotifs] = useState([
    { notificationId: 'notif_01', type: 'Critical', category: 'Projector Failure', message: 'Projector Telemetry Critical: Screen 1 Laser engine temperature exceeded warning threshold (42°C).', timestamp: '5 mins ago', severity: 1, action: '/conncloud/operations/projector', read: false },
    { notificationId: 'notif_02', type: 'Critical', category: 'Fire System Alert', message: 'Fire System Advisory: Zone 2 Sprinkler riser quarterly sensor check due today.', timestamp: '15 mins ago', severity: 1, action: '/conncloud/operations/fire', read: false },
    { notificationId: 'notif_03', type: 'Critical', category: 'Screen Offline', message: 'Screen 2 TMS link heartbeat verified active after 2-minute maintenance sweep.', timestamp: '35 mins ago', severity: 1, action: '/conncloud/operations/screens', read: true },
    { notificationId: 'notif_04', type: 'Warning', category: 'Low Inventory', message: 'Concession Inventory Alert: Jumbo Butterfly Popcorn Kernels below minimum reorder point (38 units left).', timestamp: '1 hour ago', severity: 2, action: '/conncloud/fnb/inventory', read: false },
    { notificationId: 'notif_05', type: 'Warning', category: 'Low Occupancy', message: 'Occupancy Watch: Screen 2 show 14:15 PM running at 28% capacity (<30% benchmark).', timestamp: '2 hours ago', severity: 2, action: '/conncloud/analytics/occupancy', read: false },
    { notificationId: 'notif_06', type: 'Success', category: 'High Revenue', message: 'Revenue Milestone: Today gross collections exceeded target by +18.4% (₹1,02,000 achieved).', timestamp: '3 hours ago', severity: 4, action: '/conncloud/analytics/revenue', read: true },
    { notificationId: 'notif_07', type: 'Warning', category: 'Settlement Pending', message: 'Settlement Pending: Razorpay UPI gross payout of ₹62,400 pending T+1 wire transfer.', timestamp: '4 hours ago', severity: 2, action: '/conncloud/finance/settlements', read: false },
    { notificationId: 'notif_08', type: 'Warning', category: 'Maintenance SLA', message: 'Maintenance SLA Alert: Barco VRV HVAC filter calibration ticket approaching 12h resolution window.', timestamp: '5 hours ago', severity: 2, action: '/conncloud/operations/maintenance', read: false },
    { notificationId: 'notif_09', type: 'Info', category: 'New Announcement', message: 'Corporate Announcement: National Cinema Day ticket pricing guidelines released by Connplex HQ.', timestamp: '1 day ago', severity: 3, action: '/conncloud/documents', read: true },
    { notificationId: 'notif_10', type: 'Info', category: 'Policy Update', message: 'Policy Update: FY 2026-27 Franchise distributor share compliance SOP published to document vault.', timestamp: '2 days ago', severity: 3, action: '/conncloud/documents', read: true }
  ]);

  const handleMarkAllRead = () => {
    setNotifs(prev => prev.map(n => ({ ...n, read: true })));
    triggerNotification('All notifications marked as read.');
  };

  const handleItemClick = (id: string, action: string) => {
    setNotifs(prev => prev.map(n => n.notificationId === id ? { ...n, read: true } : n));
    onNavigate(action);
  };

  const filteredNotifs = notifs.filter(n => {
    if (filterSeverity === 'All') return true;
    return n.type === filterSeverity;
  });

  return (
    <div className="cc-card">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400">Notifications &amp; Incident Alerts</h3>
          <p className="text-xs text-gray-500 mt-0.5">Real-time alerts across hardware, operations, concessions, and box office</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-black/30 p-1 rounded-lg border border-white/5 text-xs">
            {(['All', 'Critical', 'Warning', 'Info', 'Success'] as const).map(sev => (
              <button
                key={sev}
                onClick={() => setFilterSeverity(sev)}
                className={`px-2.5 py-1 rounded text-[11px] font-bold transition-all ${
                  filterSeverity === sev ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                {sev}
              </button>
            ))}
          </div>
          <button 
            onClick={handleMarkAllRead}
            className="text-xs text-blue-400 hover:underline"
          >
            Mark all as read
          </button>
        </div>
      </div>

      <div className="space-y-3.5">
        {filteredNotifs.map((n) => (
          <div 
            key={n.notificationId}
            onClick={() => handleItemClick(n.notificationId, n.action)}
            className={`p-4 rounded border text-xs cursor-pointer flex gap-3 transition-colors ${
              n.read ? 'bg-black/10 border-white/5 opacity-75' : 'bg-[#111827] border-white/10 hover:border-blue-500/20'
            }`}
          >
            <i className={`fa-solid mt-0.5 text-base ${
              n.type === 'Critical' 
                ? 'text-red-500 fa-triangle-exclamation' 
                : (n.type === 'Warning' ? 'text-amber-500 fa-circle-exclamation' : (n.type === 'Success' ? 'text-emerald-400 fa-circle-check' : 'text-blue-500 fa-info-circle'))
            }`}></i>
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <div>
                  <span className="font-bold text-white text-sm block leading-snug">{n.message}</span>
                  <span className="text-[10px] text-gray-400 uppercase font-mono mt-0.5 block">{n.category}</span>
                </div>
                <span className="text-[10px] text-gray-500 whitespace-nowrap ml-4">{n.timestamp}</span>
              </div>
              <div className="text-[10px] text-gray-400 mt-2 flex items-center justify-between">
                <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                  n.type === 'Critical' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : (n.type === 'Warning' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'bg-blue-500/10 text-blue-400 border border-blue-500/20')
                }`}>
                  Severity: {n.type}
                </span>
                <span className="text-blue-400 text-[11px] underline">View Details &rarr;</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
