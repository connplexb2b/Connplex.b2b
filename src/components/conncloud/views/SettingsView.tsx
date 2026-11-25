import React, { useState } from 'react';
import { ConnCloudStore } from '../../../lib/conncloudData';
import AhilyanagarApiIntegration from '../AhilyanagarApiIntegration';
import DataExtractionMatrix from '../DataExtractionMatrix';

interface SettingsViewProps {
  selectedCinemaId?: string;
  initialSubTab?: string;
}

export type SettingsSubTab = 
  | 'profile' 
  | 'cinema' 
  | 'users' 
  | 'roles' 
  | 'permissions' 
  | 'notifications' 
  | 'integrations' 
  | 'security' 
  | 'sessions' 
  | 'audit' 
  | 'api-keys' 
  | 'preferences' 
  | 'matrix';

export default function SettingsView({ selectedCinemaId = 'all', initialSubTab }: SettingsViewProps) {
  const isAhilyanagar = selectedCinemaId === 'c5';

  const resolveSubTab = (tab?: string): SettingsSubTab => {
    if (!tab) return 'profile';
    const t = tab.toLowerCase();
    if (t.includes('cinema')) return 'cinema';
    if (t.includes('user')) return 'users';
    if (t.includes('role') && !t.includes('perm')) return 'roles';
    if (t.includes('perm')) return 'permissions';
    if (t.includes('notif')) return 'notifications';
    if (t.includes('sec') || t.includes('2fa') || t.includes('pass')) return 'security';
    if (t.includes('sess')) return 'sessions';
    if (t.includes('aud')) return 'audit';
    if (t.includes('key') || t.includes('cred')) return 'api-keys';
    if (t.includes('pref')) return 'preferences';
    if (t.includes('matrix') || t.includes('extract')) return 'matrix';
    if (t.includes('integ') || t.includes('api') || t.includes('vista')) return 'integrations';
    return 'profile';
  };

  const [subTab, setSubTab] = useState<SettingsSubTab>(() => resolveSubTab(initialSubTab));

  React.useEffect(() => {
    if (initialSubTab) {
      setSubTab(resolveSubTab(initialSubTab));
    }
  }, [initialSubTab]);

  // Pull audits
  const audits = ConnCloudStore.getAuditLogs();

  // User Management State
  const [usersList, setUsersList] = useState([
    { id: 'usr_1', name: isAhilyanagar ? 'Vikram Shinde' : 'Rakesh Patel', email: isAhilyanagar ? 'ahilyanagar.gm@theconnplex.com' : 'guptajahnvi47@gmail.com', role: 'Franchise Owner', cinema: isAhilyanagar ? 'Connplex Ahilyanagar' : 'All Cinemas', status: 'Active' },
    { id: 'usr_2', name: 'Ramesh Kadam', email: 'ramesh.boxoffice@theconnplex.com', role: 'Cinema Manager', cinema: 'Connplex Ahilyanagar', status: 'Active' },
    { id: 'usr_3', name: 'Snehal Deshmukh', email: 'snehal.fnb@theconnplex.com', role: 'Staff', cinema: 'Connplex Ahilyanagar', status: 'Active' },
    { id: 'usr_4', name: 'Kavita R', email: 'audit.corp@theconnplex.com', role: 'Auditor', cinema: 'Corporate HQ', status: 'Active' }
  ]);

  // 2FA state
  const [is2faEnabled, setIs2faEnabled] = useState(true);

  // Notification Preferences state
  const [notifPrefs, setNotifPrefs] = useState({
    criticalSms: true,
    emailDailyDigest: true,
    projectorFailurePush: true,
    fireSystemPush: true,
    lowInventoryAlert: true,
    occupancyLimitsPush: false
  });

  // Active Sessions state
  const [sessions, setSessions] = useState([
    { id: 'sess_1', device: 'Chrome 128 / Windows 11', ip: '103.24.18.92', location: 'Mumbai / Ahilyanagar, India', lastActive: 'Active Now (Current Session)' },
    { id: 'sess_2', device: 'Safari Mobile / iPhone 15 Pro', ip: '103.24.18.94', location: 'Pune, India', lastActive: '2 hours ago' }
  ]);

  // Full Permission Matrix per Excel specification across 12 roles & modules
  const fullPermissionsMatrix = [
    { module: 'Dashboard & KPIs', superAdmin: 'Full', corpAdmin: 'Full', owner: 'Full', fManager: 'Full', cManager: 'View', finance: 'View', ops: 'View', staff: 'Limited', auditor: 'View' },
    { module: 'Commercial Analytics', superAdmin: 'Full', corpAdmin: 'Full', owner: 'Full', fManager: 'Full', cManager: 'View', finance: 'Full', ops: 'Limited', staff: 'None', auditor: 'View' },
    { module: 'Finance & Expenses', superAdmin: 'Full', corpAdmin: 'Full', owner: 'Full', fManager: 'Manage', cManager: 'Limited', finance: 'Full', ops: 'None', staff: 'None', auditor: 'View' },
    { module: 'Movies & Programming', superAdmin: 'Full', corpAdmin: 'Full', owner: 'Manage', fManager: 'Manage', cManager: 'Full', finance: 'None', ops: 'View', staff: 'View', auditor: 'View' },
    { module: 'Ticket Sales & POS', superAdmin: 'Full', corpAdmin: 'Full', owner: 'Full', fManager: 'Full', cManager: 'Full', finance: 'View', ops: 'View', staff: 'Assigned', auditor: 'View' },
    { module: 'F&B & Inventory', superAdmin: 'Full', corpAdmin: 'Full', owner: 'Full', fManager: 'Manage', cManager: 'Full', finance: 'View', ops: 'Limited', staff: 'Assigned', auditor: 'View' },
    { module: 'Staff & Shifts', superAdmin: 'Full', corpAdmin: 'Full', owner: 'Full', fManager: 'Manage', cManager: 'Full', finance: 'None', ops: 'None', staff: 'Own', auditor: 'View' },
    { module: 'Operations & Telemetry', superAdmin: 'Full', corpAdmin: 'Full', owner: 'Full', fManager: 'Manage', cManager: 'Full', finance: 'None', ops: 'Full', staff: 'Limited', auditor: 'View' },
    { module: 'Marketing & Campaigns', superAdmin: 'Full', corpAdmin: 'Full', owner: 'Manage', fManager: 'Manage', cManager: 'View', finance: 'None', ops: 'None', staff: 'None', auditor: 'View' },
    { module: 'Reports & Export', superAdmin: 'Full', corpAdmin: 'Full', owner: 'Full', fManager: 'Full', cManager: 'Limited', finance: 'Full', ops: 'Limited', staff: 'None', auditor: 'Full' },
    { module: 'Settings & Security', superAdmin: 'Full', corpAdmin: 'Manage', owner: 'Own', fManager: 'Limited', cManager: 'None', finance: 'None', ops: 'None', staff: 'None', auditor: 'View' }
  ];

  const subSectionsList: { id: SettingsSubTab; label: string; icon: string }[] = [
    { id: 'profile', label: 'Partner Profile', icon: 'fa-user' },
    { id: 'cinema', label: 'Cinema Information', icon: 'fa-building' },
    { id: 'users', label: 'User Management', icon: 'fa-users-gear' },
    { id: 'roles', label: 'Role Creation', icon: 'fa-id-badge' },
    { id: 'permissions', label: 'Permission Matrix', icon: 'fa-shield-halved' },
    { id: 'notifications', label: 'Notification Preferences', icon: 'fa-bell' },
    { id: 'integrations', label: 'Integrations & Vista', icon: 'fa-network-wired' },
    { id: 'security', label: 'Security & 2FA', icon: 'fa-key' },
    { id: 'sessions', label: 'Active Sessions', icon: 'fa-desktop' },
    { id: 'audit', label: 'System Audit Logs', icon: 'fa-clock-rotate-left' },
    { id: 'api-keys', label: 'API Credentials', icon: 'fa-code' },
    { id: 'preferences', label: 'Regional Preferences', icon: 'fa-sliders' },
    { id: 'matrix', label: 'Data Extraction Matrix', icon: 'fa-table-cells' }
  ];

  return (
    <div className="space-y-6">
      {/* Sub Tabs */}
      <section className="flex flex-wrap gap-1 bg-[#111827] border border-white/5 p-2 rounded-xl">
        {subSectionsList.map((sec) => (
          <button
            key={sec.id}
            onClick={() => setSubTab(sec.id)}
            className={`px-3 py-1.5 rounded text-xs font-semibold flex items-center gap-1.5 transition-all ${
              subTab === sec.id 
                ? 'bg-blue-600 text-white shadow shadow-blue-600/10' 
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <i className={`fa-solid ${sec.icon} text-[11px]`}></i>
            <span>{sec.label}</span>
          </button>
        ))}
      </section>

      {/* 1. PROFILE */}
      {subTab === 'profile' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="cc-card space-y-4 text-xs">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400 font-display">Franchise Partner Profile</h3>
            <div className="flex items-center gap-4 py-2 border-b border-white/5">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-white text-base ${
                isAhilyanagar ? 'bg-gradient-to-tr from-amber-600 to-amber-500 shadow-lg shadow-amber-500/20' : 'bg-blue-600'
              }`}>
                {isAhilyanagar ? 'VS' : 'RP'}
              </div>
              <div>
                <span className="font-bold text-white text-sm block">
                  {isAhilyanagar ? 'Vikram Shinde' : 'Rakesh Patel'}
                </span>
                <span className="text-[10px] text-gray-400">
                  {isAhilyanagar ? 'General Manager & Cinema Partner' : 'Franchise Owner Account'}
                </span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-400">Email Address:</span>
                <span className="text-white">{isAhilyanagar ? 'ahilyanagar.gm@theconnplex.com' : 'guptajahnvi47@gmail.com'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Contact Number:</span>
                <span className="text-white">{isAhilyanagar ? '+91 9822451290' : '+91 9511310113'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Permissions Tier:</span>
                <span className="text-[#f5b041] font-bold">{isAhilyanagar ? 'Partner & General Manager' : 'Franchise Owner'}</span>
              </div>
            </div>
          </div>

          <div className="cc-card space-y-4 text-xs">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400 font-display">Cinema Information</h3>
            <div className="space-y-2.5">
              <div className="flex justify-between">
                <span className="text-gray-400">Main Location:</span>
                <span className="text-white">{isAhilyanagar ? 'Connplex Smart Cinema, Ahilyanagar, Maharashtra' : 'Connplex Gandhinagar, Gujarat'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Screens Configured:</span>
                <span className="text-white">{isAhilyanagar ? '2 Screens (Screen 1 Couple Recliner, Screen 2 Gold Class)' : '6 Screens (1 IMAX, 1 4DX)'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Total Seating Capacity:</span>
                <span className="text-white font-mono">{isAhilyanagar ? '80 Seats (20 Couple Recliners + 60 Gold Class)' : '840 Seats'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Operating Status:</span>
                <span className="text-emerald-400 font-semibold">{isAhilyanagar ? 'Active & Live Vista Sync' : 'Active & Healthy'}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. CINEMA INFO */}
      {subTab === 'cinema' && (
        <div className="cc-card space-y-4 text-xs">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400">Cinema Master Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-3 bg-black/20 rounded border border-white/5 space-y-2">
              <strong className="text-white">Commercial Properties</strong>
              <div><span className="text-gray-400">Cinema Name:</span> {isAhilyanagar ? 'Connplex Smart Cinema Ahilyanagar' : 'Connplex Gandhinagar'}</div>
              <div><span className="text-gray-400">Cinematograph License:</span> CNX-MH-AH-2024-89</div>
              <div><span className="text-gray-400">GST Identification (GSTIN):</span> 27AABCC8921M1ZX</div>
              <div><span className="text-gray-400">FSSAI License:</span> 11524022000189</div>
            </div>
            <div className="p-3 bg-black/20 rounded border border-white/5 space-y-2">
              <strong className="text-white">Auditorium Configuration</strong>
              <div><span className="text-gray-400">Screen 1:</span> 20 Seats (Luxuriance Couple Recliner) • Barco 4K Laser</div>
              <div><span className="text-gray-400">Screen 2:</span> 60 Seats (Gold Class) • Barco 2K Laser</div>
              <div><span className="text-gray-400">Audio:</span> Dolby Atmos Multichannel Processors</div>
            </div>
          </div>
        </div>
      )}

      {/* 3. USER MANAGEMENT */}
      {subTab === 'users' && (
        <div className="cc-card">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400">Authorized System Users</h3>
            <button className="cc-btn cc-btn-primary text-xs py-1.5 px-3 flex items-center gap-1.5">
              <i className="fa-solid fa-user-plus"></i> Invite User
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/10 text-gray-400">
                  <th className="py-2.5 font-semibold">User</th>
                  <th className="py-2.5 font-semibold">Email</th>
                  <th className="py-2.5 font-semibold">Assigned Role</th>
                  <th className="py-2.5 font-semibold">Cinema Access</th>
                  <th className="py-2.5 text-center font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {usersList.map(u => (
                  <tr key={u.id} className="hover:bg-white/5 transition-colors">
                    <td className="py-3 font-semibold text-white">{u.name}</td>
                    <td className="py-3 text-gray-400">{u.email}</td>
                    <td className="py-3 font-bold text-blue-400">{u.role}</td>
                    <td className="py-3 text-gray-300">{u.cinema}</td>
                    <td className="py-3 text-center">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400">
                        {u.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 4. ROLES */}
      {subTab === 'roles' && (
        <div className="cc-card">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-4">Standardized Enterprise Roles (12 Tiers)</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            {[
              { role: 'Super Admin', desc: 'Full corporate master control across all platforms and databases' },
              { role: 'Corporate Admin', desc: 'Headquarters operations and content distribution management' },
              { role: 'Franchise Owner', desc: 'Complete access to owned property financials, tickets and reports' },
              { role: 'Franchise Manager', desc: 'Day-to-day operational management and expense approvals' },
              { role: 'Cinema Manager', desc: 'On-site show allocations, staff shifts, and auditorium uptime' },
              { role: 'Finance Manager', desc: 'P&L statements, GST reconciliation, and distributor royalty ledger' },
              { role: 'Operations Manager', desc: 'Hardware telemetry, AMC contracts, and maintenance dispatches' },
              { role: 'Marketing Manager', desc: 'Promotional campaigns, social toolkits, and poster libraries' },
              { role: 'HR / Staff Manager', desc: 'Biometric attendance, shift duty scheduling, and leave approvals' },
              { role: 'Staff Member', desc: 'Assigned Box Office POS counter or Concession sales terminal' },
              { role: 'Auditor', desc: 'Read-only compliance access to ledgers, NOC certificates, and logs' },
              { role: 'Support Agent', desc: 'NOC helpdesk ticket resolution and client communication' }
            ].map(r => (
              <div key={r.role} className="p-3 bg-black/20 rounded border border-white/5 space-y-1">
                <strong className="text-white text-sm block">{r.role}</strong>
                <p className="text-gray-400 text-[11px]">{r.desc}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. PERMISSION MATRIX */}
      {subTab === 'permissions' && (
        <div className="cc-card">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400">Role-Based Access Control (RBAC) Matrix</h3>
              <p className="text-xs text-gray-500 mt-0.5">Permission levels: Full • Manage • View • Limited • Own • Assigned • None</p>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-white/10 text-gray-400 font-bold">
                  <th className="pb-3">Module Tier</th>
                  <th className="pb-3 text-center">Super Admin</th>
                  <th className="pb-3 text-center">Corp Admin</th>
                  <th className="pb-3 text-center">Owner</th>
                  <th className="pb-3 text-center">Cinema Mgr</th>
                  <th className="pb-3 text-center">Finance</th>
                  <th className="pb-3 text-center">Operations</th>
                  <th className="pb-3 text-center">Auditor</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {fullPermissionsMatrix.map((row, idx) => (
                  <tr key={idx} className="hover:bg-white/5 transition-colors text-center">
                    <td className="py-2.5 font-semibold text-white text-left">{row.module}</td>
                    <td className="py-2.5 text-blue-400 font-bold">{row.superAdmin}</td>
                    <td className="py-2.5 text-blue-300">{row.corpAdmin}</td>
                    <td className="py-2.5 text-emerald-400 font-bold">{row.owner}</td>
                    <td className="py-2.5 text-amber-300">{row.cManager}</td>
                    <td className="py-2.5 text-gray-300">{row.finance}</td>
                    <td className="py-2.5 text-gray-300">{row.ops}</td>
                    <td className="py-2.5 text-gray-500 font-mono">{row.auditor}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 6. NOTIFICATION PREFERENCES */}
      {subTab === 'notifications' && (
        <div className="cc-card space-y-4 text-xs">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400">Notification Channels &amp; Alert Rules</h3>
          <div className="space-y-3">
            {[
              { key: 'criticalSms', title: 'Critical SMS Alerts', desc: 'Instant SMS for Projector Failure, Screen Offline > 2 mins, or Fire Alert' },
              { key: 'emailDailyDigest', title: 'Daily Collection Summary Email', desc: 'Automated end-of-day DCR summary delivered at 00:30 AM' },
              { key: 'projectorFailurePush', title: 'Projector Telemetry Critical Push', desc: 'Immediate notification on laser temperature exceedance' },
              { key: 'lowInventoryAlert', title: 'Concession Low-Inventory Warnings', desc: 'Alert when popcorn kernels or soda syrup drops below 40 units' }
            ].map(item => (
              <div key={item.key} className="p-3 bg-black/20 rounded border border-white/5 flex justify-between items-center">
                <div>
                  <strong className="text-white block">{item.title}</strong>
                  <span className="text-gray-400 text-[11px]">{item.desc}</span>
                </div>
                <input 
                  type="checkbox" 
                  checked={(notifPrefs as any)[item.key]} 
                  onChange={(e) => setNotifPrefs({ ...notifPrefs, [item.key]: e.target.checked })}
                  className="w-4 h-4 accent-blue-600 rounded cursor-pointer"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 7. INTEGRATIONS */}
      {subTab === 'integrations' && (
        <AhilyanagarApiIntegration selectedCinemaId={selectedCinemaId} />
      )}

      {/* 8. SECURITY & 2FA */}
      {subTab === 'security' && (
        <div className="cc-card space-y-4 text-xs">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400">Security &amp; Multi-Factor Authentication</h3>
          <div className="p-4 rounded-xl bg-black/20 border border-white/5 space-y-3">
            <div className="flex justify-between items-center">
              <div>
                <strong className="text-white text-sm block">Two-Factor Authentication (2FA)</strong>
                <span className="text-gray-400 text-[11px]">Require OTP verification via registered mobile on new device login</span>
              </div>
              <button 
                onClick={() => setIs2faEnabled(!is2faEnabled)}
                className={`px-3 py-1.5 rounded font-bold text-xs ${
                  is2faEnabled ? 'bg-emerald-600 text-white' : 'bg-white/10 text-gray-400'
                }`}
              >
                {is2faEnabled ? 'Enabled' : 'Disabled'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 9. SESSIONS */}
      {subTab === 'sessions' && (
        <div className="cc-card space-y-4 text-xs">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400">Active Login Sessions</h3>
          <div className="space-y-3">
            {sessions.map(s => (
              <div key={s.id} className="p-3.5 bg-black/20 rounded border border-white/5 flex justify-between items-center">
                <div>
                  <strong className="text-white block">{s.device}</strong>
                  <span className="text-gray-400 text-[11px]">IP: {s.ip} • Location: {s.location}</span>
                  <span className="text-emerald-400 text-[10px] block mt-0.5">{s.lastActive}</span>
                </div>
                {s.id !== 'sess_1' && (
                  <button className="px-2.5 py-1 rounded bg-red-600/20 text-red-400 border border-red-500/30 text-[11px]">
                    Revoke
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 10. AUDIT LOGS */}
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

      {/* 11. API CREDENTIALS */}
      {subTab === 'api-keys' && (
        <div className="cc-card space-y-4 text-xs">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400">Production API Credentials</h3>
          <div className="space-y-3">
            <div className="p-3 bg-black/20 rounded border border-white/5">
              <span className="text-[10px] text-gray-400 uppercase font-bold block mb-1">Live Webhook Secret</span>
              <code className="text-amber-400 font-mono block bg-black/40 p-2 rounded">whsec_connplex_live_ahilyanagar_89230198</code>
            </div>
            <div className="p-3 bg-black/20 rounded border border-white/5">
              <span className="text-[10px] text-gray-400 uppercase font-bold block mb-1">Vista On-Premise Gateway Key</span>
              <code className="text-blue-400 font-mono block bg-black/40 p-2 rounded">cnx_vista_live_token_77a2bf8901</code>
            </div>
          </div>
        </div>
      )}

      {/* 12. PREFERENCES */}
      {subTab === 'preferences' && (
        <div className="cc-card space-y-3 text-xs">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-2">Regional Localization Preferences</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-gray-400 block mb-1">Standard Currency</label>
              <input type="text" value="INR (₹)" readOnly className="cc-input" />
            </div>
            <div>
              <label className="text-gray-400 block mb-1">Fiscal Year Cycle</label>
              <input type="text" value="April 1 to March 31" readOnly className="cc-input" />
            </div>
          </div>
        </div>
      )}

      {/* 13. EXTRACTION MATRIX */}
      {subTab === 'matrix' && (
        <DataExtractionMatrix selectedCinemaId={selectedCinemaId} />
      )}
    </div>
  );
}
