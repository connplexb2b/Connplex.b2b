import React, { useState } from 'react';
import { ConnCloudStore } from '../../../lib/conncloudData';

export default function SettingsView() {
  const [subTab, setSubTab] = useState<'profile' | 'permissions' | 'audit'>('profile');

  // Pull audits
  const audits = ConnCloudStore.getAuditLogs();

  const permissionsList = [
    { module: 'Dashboard & Telemetry', superAdmin: 'Full', manager: 'Full', finance: 'View Only', auditor: 'View Only' },
    { module: 'Commercial Analytics', superAdmin: 'Full', manager: 'Full', finance: 'Full', auditor: 'View Only' },
    { module: 'Ledger & Expenses', superAdmin: 'Full', manager: 'Approve Only', finance: 'Full', auditor: 'View Only' },
    { module: 'Movies Show Allocation', superAdmin: 'Full', manager: 'Full', finance: 'None', auditor: 'View Only' },
    { module: 'F&B Inventory', superAdmin: 'Full', manager: 'Full', finance: 'View Only', auditor: 'View Only' },
    { module: 'IoT System Settings', superAdmin: 'Full', manager: 'View Only', finance: 'None', auditor: 'None' }
  ];

  return (
    <div className="space-y-6">
      {/* Sub tabs */}
      <section className="flex flex-wrap gap-1 bg-[#111827] border border-white/5 p-2 rounded-xl">
        {[
          { id: 'profile', label: 'Cinema Profile' },
          { id: 'permissions', label: 'Role Permissions Matrix' },
          { id: 'audit', label: 'System Audit Logs' }
        ].map((sec) => (
          <button
            key={sec.id}
            onClick={() => setSubTab(sec.id as any)}
            className={`px-3 py-1.5 rounded text-xs font-semibold transition-all ${
              subTab === sec.id 
                ? 'bg-blue-600 text-white shadow shadow-blue-600/10' 
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            {sec.label}
          </button>
        ))}
      </section>

      {/* 1. PROFILE */}
      {subTab === 'profile' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="cc-card space-y-4 text-xs">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400 font-display">Franchise Partner Profile</h3>
            <div className="flex items-center gap-4 py-2 border-b border-white/5">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center font-bold text-white text-base">RP</div>
              <div>
                <span className="font-bold text-white text-sm block">Rakesh Patel</span>
                <span className="text-[10px] text-gray-400">Franchise Owner Account</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between"><span className="text-gray-400">Email Address:</span><span className="text-white">guptajahnvi47@gmail.com</span></div>
              <div className="flex justify-between"><span className="text-gray-400">Contact Number:</span><span className="text-white">+91 9511310113</span></div>
              <div className="flex justify-between"><span className="text-gray-400">Permissions tier:</span><span className="text-[#f5b041] font-bold">Franchise Owner</span></div>
            </div>
          </div>

          <div className="cc-card space-y-4 text-xs">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400 font-display">Cinema Details</h3>
            <div className="space-y-2.5">
              <div className="flex justify-between"><span className="text-gray-400">Main Location:</span><span className="text-white">Connplex Gandhinagar, Gujarat</span></div>
              <div className="flex justify-between"><span className="text-gray-400">Screens Configured:</span><span className="text-white">6 Screens (1 IMAX, 1 4DX)</span></div>
              <div className="flex justify-between"><span className="text-gray-400">Operating Status:</span><span className="text-emerald-400 font-semibold">Active & Healthy</span></div>
              <div className="flex justify-between"><span className="text-gray-400">Last Telemetry Sweep:</span><span className="text-gray-300">Today, 07:15 PM</span></div>
            </div>
          </div>
        </div>
      )}

      {/* 2. PERMISSIONS */}
      {subTab === 'permissions' && (
        <div className="cc-card">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-4">Granular Permission Matrix</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-white/10 text-gray-400 font-bold">
                  <th className="pb-3">Module Tier</th>
                  <th className="pb-3 text-center">Super Admin</th>
                  <th className="pb-3 text-center">Franchise Owner</th>
                  <th className="pb-3 text-center">Finance Desk</th>
                  <th className="pb-3 text-center">Auditor</th>
                </tr>
              </thead>
              <tbody>
                {permissionsList.map((row, idx) => (
                  <tr key={idx} className="border-b border-white/5 hover:bg-white/5 transition-colors text-center">
                    <td className="py-3 font-semibold text-white text-left">{row.module}</td>
                    <td className="py-3 text-blue-400 font-bold">{row.superAdmin}</td>
                    <td className="py-3 text-emerald-400 font-bold">{row.manager}</td>
                    <td className="py-3 text-gray-300">{row.finance}</td>
                    <td className="py-3 text-gray-500 font-semibold">{row.auditor}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. AUDIT LOG */}
      {subTab === 'audit' && (
        <div className="cc-card">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-4">Security Auditing Logs</h3>
          <div className="space-y-3.5">
            {audits.map((a) => (
              <div key={a.auditId} className="p-3 bg-black/25 border border-white/5 rounded text-xs">
                <div className="flex justify-between items-center mb-1.5">
                  <span className="font-bold text-white">{a.action}</span>
                  <span className="text-[10px] text-gray-400 font-mono">{a.timestamp}</span>
                </div>
                <div className="text-[10px] text-gray-400">Object: <span className="text-gray-300 font-semibold">{a.object}</span> • Previous: <span className="text-red-400">{a.previousValue}</span> • New: <span className="text-emerald-400">{a.newValue}</span></div>
                <div className="text-[9px] text-gray-500 mt-1 uppercase">User: {a.user} ({a.role}) • Node IP: {a.ip} • Device: {a.device}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
