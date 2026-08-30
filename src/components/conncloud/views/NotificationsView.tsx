import React, { useState } from 'react';
import { ConnCloudStore } from '../../../lib/conncloudData';

interface NotificationsViewProps {
  onNavigate: (route: string) => void;
  triggerNotification: (msg: string) => void;
}

export default function NotificationsView({ onNavigate, triggerNotification }: NotificationsViewProps) {
  const [notifs, setNotifs] = useState(ConnCloudStore.getNotifications());

  const handleMarkAllRead = () => {
    notifs.forEach(n => n.read = true);
    setNotifs([...notifs]);
    triggerNotification('All notifications marked as read.');
  };

  const handleItemClick = (id: string, action: string) => {
    const n = notifs.find(item => item.notificationId === id);
    if (n) {
      n.read = true;
      setNotifs([...notifs]);
    }
    onNavigate(action);
  };

  return (
    <div className="cc-card">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400">Notifications Feed</h3>
        <button 
          onClick={handleMarkAllRead}
          className="text-xs text-blue-400 hover:underline"
        >
          Mark all as read
        </button>
      </div>

      <div className="space-y-3.5">
        {notifs.map((n) => (
          <div 
            key={n.notificationId}
            onClick={() => handleItemClick(n.notificationId, n.action)}
            className={`p-4 rounded border text-xs cursor-pointer flex gap-3 transition-colors ${
              n.read ? 'bg-black/10 border-white/5 opacity-70' : 'bg-[#111827] border-white/10 hover:border-blue-500/20'
            }`}
          >
            <i className={`fa-solid mt-0.5 text-base ${
              n.type === 'Critical' 
                ? 'text-red-500 fa-circle-exclamation' 
                : (n.type === 'Warning' ? 'text-amber-500 fa-triangle-exclamation' : 'text-blue-500 fa-info-circle')
            }`}></i>
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <span className="font-semibold text-white leading-snug">{n.message}</span>
                <span className="text-[10px] text-gray-500 whitespace-nowrap ml-4">{n.timestamp}</span>
              </div>
              <div className="text-[10px] text-gray-400 mt-1 flex items-center gap-1">
                <span>Severity: {n.severity}</span>
                {!n.read && <span className="w-1.5 h-1.5 bg-blue-500 rounded-full inline-block ml-1"></span>}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
