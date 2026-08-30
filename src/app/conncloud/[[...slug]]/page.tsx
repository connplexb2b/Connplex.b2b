'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import '../conncloud.css';

// Import Views
import DashboardView from '../../../components/conncloud/views/DashboardView';
import AnalyticsView from '../../../components/conncloud/views/AnalyticsView';
import FinanceView from '../../../components/conncloud/views/FinanceView';
import MoviesView from '../../../components/conncloud/views/MoviesView';
import TicketSalesView from '../../../components/conncloud/views/TicketSalesView';
import FnBView from '../../../components/conncloud/views/FnBView';
import StaffView from '../../../components/conncloud/views/StaffView';
import OperationsView from '../../../components/conncloud/views/OperationsView';
import MarketingView from '../../../components/conncloud/views/MarketingView';
import ReportsView from '../../../components/conncloud/views/ReportsView';
import DocumentsView from '../../../components/conncloud/views/DocumentsView';
import SupportView from '../../../components/conncloud/views/SupportView';
import CalendarView from '../../../components/conncloud/views/CalendarView';
import SettingsView from '../../../components/conncloud/views/SettingsView';
import NotificationsView from '../../../components/conncloud/views/NotificationsView';

// Central Relational Store import
import { ConnCloudStore } from '../../../lib/conncloudData';

// Shared valid credentials matching Franchisee portal
const VALID_EMAIL = 'guptajahnvi47@gmail.com';
const VALID_CONTACT = '9511310113';
const VALID_PASSWORD = 'Jahnvi@04';

export default function ConnCloudPage() {
  const router = useRouter();
  const pathname = usePathname();

  // Authentication states
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [loginInput, setLoginInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Global filters
  const [selectedCinema, setSelectedCinema] = useState('all');
  const [selectedDateRange, setSelectedDateRange] = useState('Last 30 Days');
  const [searchQuery, setSearchQuery] = useState('');
  
  // UI states
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [profileOpen, setProfileOpen] = useState(false);
  const [cinemaSelectOpen, setCinemaSelectOpen] = useState(false);
  const [dateSelectOpen, setDateSelectOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const profileRef = useRef<HTMLDivElement>(null);
  const cinemaRef = useRef<HTMLDivElement>(null);
  const dateRef = useRef<HTMLDivElement>(null);

  // Initialize store and check session
  useEffect(() => {
    ConnCloudStore.init();
    const session = localStorage.getItem('franchisee_session');
    if (session === 'authenticated') {
      setIsAuthenticated(true);
    }
    setAuthLoading(false);
  }, []);

  // Handle click outside dropdowns
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setProfileOpen(false);
      if (cinemaRef.current && !cinemaRef.current.contains(e.target as Node)) setCinemaSelectOpen(false);
      if (dateRef.current && !dateRef.current.contains(e.target as Node)) setDateSelectOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Toast feedback helper
  const triggerNotification = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  // Sign-in
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setLoginError('');

    setTimeout(() => {
      const sanitized = loginInput.trim().toLowerCase();
      const matchEmail = sanitized === VALID_EMAIL.toLowerCase();
      const matchContact = sanitized === VALID_CONTACT;

      if ((matchEmail || matchContact) && passwordInput === VALID_PASSWORD) {
        setIsAuthenticated(true);
        localStorage.setItem('franchisee_session', 'authenticated');
        triggerNotification('Sign-in verified. Welcome to ConnCloud.');
      } else {
        setLoginError('Invalid login email/contact or password credentials.');
      }
      setIsSubmitting(false);
    }, 600);
  };

  // Sign-out
  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('franchisee_session');
    setProfileOpen(false);
    triggerNotification('Signed out from ConnCloud session.');
  };

  // Nav item route helper
  const isRouteActive = (route: string) => {
    if (!pathname) return false;
    if (route === '/conncloud/dashboard') {
      return pathname === '/conncloud' || pathname === '/conncloud/dashboard';
    }
    return pathname.startsWith(route);
  };

  // Sidebar navigation configuration
  const navigationItems = [
    { name: 'Dashboard', icon: 'fa-table-columns', route: '/conncloud/dashboard' },
    { name: 'Analytics', icon: 'fa-chart-line', route: '/conncloud/analytics', badge: 'New' },
    { name: 'Finance', icon: 'fa-indian-rupee-sign', route: '/conncloud/finance' },
    { name: 'Movies', icon: 'fa-film', route: '/conncloud/movies' },
    { name: 'Ticket Sales', icon: 'fa-ticket', route: '/conncloud/ticket-sales' },
    { name: 'Food & Beverage', icon: 'fa-burger', route: '/conncloud/fnb', badge: 'Alert' },
    { name: 'Staff', icon: 'fa-user-tie', route: '/conncloud/staff' },
    { name: 'Operations', icon: 'fa-gears', route: '/conncloud/operations', badge: '3' },
    { name: 'Marketing', icon: 'fa-bullhorn', route: '/conncloud/marketing' },
    { name: 'Reports', icon: 'fa-file-invoice-dollar', route: '/conncloud/reports' },
    { name: 'Documents', icon: 'fa-folder-open', route: '/conncloud/documents' },
    { name: 'Support', icon: 'fa-circle-question', route: '/conncloud/support' },
    { name: 'Notifications', icon: 'fa-bell', route: '/conncloud/notifications' },
    { name: 'Calendar', icon: 'fa-calendar-days', route: '/conncloud/calendar' },
    { name: 'Settings', icon: 'fa-sliders', route: '/conncloud/settings' }
  ];

  // Routing Handler mapping pathnames directly to Subviews
  const renderActiveView = () => {
    if (!pathname) return <DashboardView selectedCinemaId={selectedCinema} selectedDateRange={selectedDateRange} onNavigate={(r) => router.push(r)} triggerNotification={triggerNotification} />;
    
    if (pathname === '/conncloud' || pathname === '/conncloud/dashboard') {
      return <DashboardView selectedCinemaId={selectedCinema} selectedDateRange={selectedDateRange} onNavigate={(r) => router.push(r)} triggerNotification={triggerNotification} />;
    }
    if (pathname.startsWith('/conncloud/analytics')) {
      return <AnalyticsView selectedCinemaId={selectedCinema} selectedDateRange={selectedDateRange} triggerNotification={triggerNotification} />;
    }
    if (pathname.startsWith('/conncloud/finance')) {
      return <FinanceView selectedCinemaId={selectedCinema} selectedDateRange={selectedDateRange} triggerNotification={triggerNotification} />;
    }
    if (pathname.startsWith('/conncloud/movies')) {
      return <MoviesView selectedCinemaId={selectedCinema} selectedDateRange={selectedDateRange} triggerNotification={triggerNotification} />;
    }
    if (pathname.startsWith('/conncloud/ticket-sales')) {
      return <TicketSalesView selectedCinemaId={selectedCinema} selectedDateRange={selectedDateRange} triggerNotification={triggerNotification} />;
    }
    if (pathname.startsWith('/conncloud/fnb')) {
      return <FnBView selectedCinemaId={selectedCinema} selectedDateRange={selectedDateRange} triggerNotification={triggerNotification} />;
    }
    if (pathname.startsWith('/conncloud/staff')) {
      return <StaffView selectedCinemaId={selectedCinema} selectedDateRange={selectedDateRange} triggerNotification={triggerNotification} />;
    }
    if (pathname.startsWith('/conncloud/operations')) {
      return <OperationsView selectedCinemaId={selectedCinema} selectedDateRange={selectedDateRange} triggerNotification={triggerNotification} />;
    }
    if (pathname.startsWith('/conncloud/marketing')) {
      return <MarketingView selectedCinemaId={selectedCinema} selectedDateRange={selectedDateRange} triggerNotification={triggerNotification} />;
    }
    if (pathname === '/conncloud/reports') {
      return <ReportsView triggerNotification={triggerNotification} />;
    }
    if (pathname === '/conncloud/documents') {
      return <DocumentsView triggerNotification={triggerNotification} />;
    }
    if (pathname.startsWith('/conncloud/support')) {
      return <SupportView triggerNotification={triggerNotification} />;
    }
    if (pathname === '/conncloud/calendar') {
      return <CalendarView />;
    }
    if (pathname.startsWith('/conncloud/settings')) {
      return <SettingsView />;
    }
    if (pathname === '/conncloud/notifications') {
      return <NotificationsView onNavigate={(r) => router.push(r)} triggerNotification={triggerNotification} />;
    }

    // Default Fallback
    return <DashboardView selectedCinemaId={selectedCinema} selectedDateRange={selectedDateRange} onNavigate={(r) => router.push(r)} triggerNotification={triggerNotification} />;
  };

  // Resolve breadcrumbs dynamically
  const getBreadcrumbs = () => {
    if (!pathname) return ['ConnCloud'];
    const parts = pathname.split('/').filter(Boolean);
    return parts.map(p => p.charAt(0).toUpperCase() + p.slice(1));
  };

  if (authLoading) {
    return (
      <div className="conncloud-body flex items-center justify-center min-h-screen bg-[#0b1220] text-white">
        <div className="text-center space-y-4">
          <i className="fa-solid fa-circle-notch fa-spin text-3xl text-[#f5b041]"></i>
          <p className="text-sm text-gray-400">Loading secure corporate channels...</p>
        </div>
      </div>
    );
  }

  // RENDER LOGIN SCREEN (Matches theme color variables)
  if (!isAuthenticated) {
    return (
      <div className="conncloud-body flex items-center justify-center min-h-screen bg-radial from-[#0f1624] to-[#05070a] p-4 relative overflow-hidden">
        {/* Glow rings */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#f5b041]/[0.02] rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-600/[0.03] rounded-full blur-[120px] pointer-events-none"></div>

        <div className="w-full max-w-sm bg-[#111827] border border-white/5 rounded-2xl p-8 shadow-2xl relative z-10">
          <div className="flex justify-center mb-6">
            <Image src="/logo.png" alt="Connplex logo" width={160} height={44} priority style={{ height: 'auto' }} />
          </div>
          
          <div className="text-center mb-8">
            <h2 className="text-xl font-bold tracking-tight text-white">Franchise ConnCloud</h2>
            <p className="text-xs text-gray-400 mt-1">Authenticate access to secure business portals</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {loginError && (
              <div className="p-3 rounded bg-red-500/10 border border-red-500/20 text-xs text-red-200 flex items-center gap-2">
                <i className="fa-solid fa-triangle-exclamation text-red-400"></i>
                <span>{loginError}</span>
              </div>
            )}

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">EMAIL ADDRESS OR CONTACT</label>
              <div className="relative">
                <i className="fa-solid fa-user absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-xs"></i>
                <input 
                  type="text" 
                  className="w-full cc-input pl-9 text-xs" 
                  placeholder="Enter Registered ID"
                  value={loginInput}
                  onChange={(e) => setLoginInput(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">SECURE PASSWORD</label>
              <div className="relative">
                <i className="fa-solid fa-lock absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-xs"></i>
                <input 
                  type="password" 
                  className="w-full cc-input pl-9 text-xs" 
                  placeholder="••••••••"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  required
                />
              </div>
            </div>

            <button 
              type="submit" 
              className="w-full mt-4 cc-btn cc-btn-accent py-2.5 rounded-lg flex items-center justify-center gap-2 font-bold"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <i className="fa-solid fa-circle-notch fa-spin"></i> Authenticating...
                </>
              ) : (
                <>
                  Sign In <i className="fa-solid fa-arrow-right"></i>
                </>
              )}
            </button>
          </form>

          <p className="text-[10px] text-gray-500 text-center mt-6">
            Authorized franchisee logins only. Connections are tracked.
          </p>
        </div>
      </div>
    );
  }

  // RENDER APP SHELL (Sidebar + Header + Content Container)
  return (
    <div className="conncloud-body flex min-h-screen relative">
      {/* Toast popup */}
      {toast && (
        <div className="fixed top-4 right-4 bg-gray-900 border border-[#f5b041]/30 p-3 rounded-lg shadow-2xl flex items-center gap-2 text-xs text-white z-[999] animate-fadeIn">
          <i className="fa-solid fa-circle-check text-emerald-400"></i>
          <span>{toast}</span>
        </div>
      )}

      {/* Left Sidebar */}
      <aside className={`bg-[#07090e] border-r border-white/5 flex flex-col h-screen sticky top-0 z-50 transition-all duration-300 ${
        sidebarExpanded ? 'w-60 min-w-60' : 'w-[68px] min-w-[68px]'
      }`}>
        {/* Logo area */}
        <div className="p-4 border-b border-white/5 flex items-center justify-between overflow-hidden">
          {sidebarExpanded ? (
            <div className="flex flex-col gap-0.5">
              <Image src="/logo.png" alt="Connplex" width={110} height={28} priority style={{ height: 'auto' }} />
              <span className="text-[8px] font-black text-[#f5b041] uppercase tracking-widest">ConnCloud SaaS</span>
            </div>
          ) : (
            <span className="text-[#f5b041] font-black text-sm tracking-tighter mx-auto">CX</span>
          )}
        </div>

        {/* Navigation list */}
        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1.5 cc-scrollbar">
          {navigationItems.map((item) => {
            const active = isRouteActive(item.route);
            return (
              <Link 
                key={item.name} 
                href={item.route}
                className={`w-full flex items-center gap-3 p-2.5 rounded-lg text-xs font-semibold transition-all relative group ${
                  active 
                    ? 'bg-blue-600 text-white shadow shadow-blue-600/10' 
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <i className={`fa-solid ${item.icon} text-sm text-center ${sidebarExpanded ? 'w-5' : 'mx-auto'}`}></i>
                {sidebarExpanded && <span className="truncate">{item.name}</span>}

                {/* Collapsed Tooltip */}
                {!sidebarExpanded && (
                  <span className="absolute left-full ml-2 px-2 py-1 bg-gray-900 border border-white/10 rounded text-[10px] text-white opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none z-50 whitespace-nowrap">
                    {item.name}
                  </span>
                )}

                {/* Optional navigation badges */}
                {item.badge && sidebarExpanded && (
                  <span className={`ml-auto px-1.5 py-0.5 rounded text-[8px] font-black uppercase ${
                    item.badge === 'New' ? 'bg-blue-500/20 text-blue-400' : 'bg-red-500/20 text-red-400'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>

        {/* Sidebar Footer toggle */}
        <div className="p-3 border-t border-white/5 flex items-center justify-between">
          {sidebarExpanded && (
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 cc-pulse-live"></span>
              <span className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">ALL SYSTEMS GO</span>
            </div>
          )}
          <button 
            onClick={() => setSidebarExpanded(!sidebarExpanded)}
            className="w-8 h-8 rounded hover:bg-white/5 text-gray-400 hover:text-white flex items-center justify-center mx-auto transition-colors"
          >
            <i className={`fa-solid ${sidebarExpanded ? 'fa-angles-left' : 'fa-angles-right'}`}></i>
          </button>
        </div>
      </aside>

      {/* Main Panel */}
      <div className="flex-1 flex flex-col min-h-screen overflow-x-hidden">
        {/* Topbar Header */}
        <header className="h-16 bg-[#07090e] border-b border-white/5 sticky top-0 flex items-center justify-between px-6 z-40">
          
          {/* Breadcrumbs / Title */}
          <div className="hidden md:flex items-center gap-2 text-xs text-gray-400 font-semibold">
            {getBreadcrumbs().map((crumb, idx, arr) => (
              <React.Fragment key={idx}>
                <span className={idx === arr.length - 1 ? 'text-white font-bold' : ''}>{crumb}</span>
                {idx < arr.length - 1 && <i className="fa-solid fa-chevron-right text-[10px]"></i>}
              </React.Fragment>
            ))}
          </div>

          {/* Controls: Cinema Switcher, Date Switcher, Search, User settings */}
          <div className="flex items-center gap-4 ml-auto w-full md:w-auto justify-between md:justify-end">
            
            {/* Cinema Switcher */}
            <div className="relative" ref={cinemaRef}>
              <button 
                onClick={() => setCinemaSelectOpen(!cinemaSelectOpen)}
                className="cc-btn cc-btn-outline py-1.5 text-xs flex items-center gap-1.5"
              >
                <i className="fa-solid fa-building text-blue-400"></i>
                <span>{selectedCinema === 'all' ? 'All Cinemas' : ConnCloudStore.getCinemas().find(c => c.cinemaId === selectedCinema)?.name}</span>
                <i className="fa-solid fa-chevron-down text-[10px] text-gray-500"></i>
              </button>
              {cinemaSelectOpen && (
                <div className="absolute top-full left-0 mt-2 bg-[#111827] border border-white/10 p-1.5 rounded-lg shadow-2xl w-48 z-50 flex flex-col gap-0.5 animate-dropdownFade">
                  <button 
                    onClick={() => { setSelectedCinema('all'); setCinemaSelectOpen(false); triggerNotification('Switched to all Cinemas.'); }}
                    className="p-2 text-left rounded hover:bg-white/5 text-xs text-gray-300 hover:text-white"
                  >
                    All Cinemas
                  </button>
                  {ConnCloudStore.getCinemas().map(c => (
                    <button
                      key={c.cinemaId}
                      onClick={() => { setSelectedCinema(c.cinemaId); setCinemaSelectOpen(false); triggerNotification(`Selected ${c.name}`); }}
                      className="p-2 text-left rounded hover:bg-white/5 text-xs text-gray-300 hover:text-white"
                    >
                      {c.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Date range Switcher */}
            <div className="relative" ref={dateRef}>
              <button 
                onClick={() => setDateSelectOpen(!dateSelectOpen)}
                className="cc-btn cc-btn-outline py-1.5 text-xs flex items-center gap-1.5"
              >
                <i className="fa-solid fa-calendar text-[#f5b041]"></i>
                <span>{selectedDateRange}</span>
                <i className="fa-solid fa-chevron-down text-[10px] text-gray-500"></i>
              </button>
              {dateSelectOpen && (
                <div className="absolute top-full right-0 mt-2 bg-[#111827] border border-white/10 p-1.5 rounded-lg shadow-2xl w-40 z-50 flex flex-col gap-0.5 animate-dropdownFade">
                  {['Today', 'Yesterday', 'Last 7 Days', 'Last 30 Days', 'This Month', 'This Year'].map(range => (
                    <button
                      key={range}
                      onClick={() => { setSelectedDateRange(range); setDateSelectOpen(false); triggerNotification(`Date filter: ${range}`); }}
                      className="p-2 text-left rounded hover:bg-white/5 text-xs text-gray-300 hover:text-white"
                    >
                      {range}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="w-px h-6 bg-white/5 hidden md:block"></div>

            {/* Profile Dropdown */}
            <div className="relative" ref={profileRef}>
              <button 
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 hover:bg-white/5 p-1 rounded-lg transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center font-bold text-white text-xs">RP</div>
                <div className="hidden lg:flex flex-col text-left">
                  <span className="text-xs font-bold text-white leading-tight">Rakesh Patel</span>
                  <span className="text-[9px] text-gray-400">Franchise Partner</span>
                </div>
                <i className="fa-solid fa-chevron-down text-[10px] text-gray-500 hidden lg:block"></i>
              </button>
              {profileOpen && (
                <div className="absolute top-full right-0 mt-2 bg-[#111827] border border-white/10 p-1.5 rounded-lg shadow-2xl w-44 z-50 flex flex-col gap-0.5 animate-dropdownFade">
                  <button onClick={() => { setProfileOpen(false); router.push('/conncloud/settings'); }} className="p-2 text-left rounded hover:bg-white/5 text-xs text-gray-300 hover:text-white flex items-center gap-2">
                    <i className="fa-solid fa-user-circle"></i> Profile Settings
                  </button>
                  <button onClick={() => { setProfileOpen(false); router.push('/conncloud/settings'); }} className="p-2 text-left rounded hover:bg-white/5 text-xs text-gray-300 hover:text-white flex items-center gap-2">
                    <i className="fa-solid fa-building"></i> Cinema Settings
                  </button>
                  <button onClick={handleLogout} className="p-2 text-left rounded hover:bg-red-500/10 text-xs text-red-400 flex items-center gap-2">
                    <i className="fa-solid fa-sign-out-alt"></i> Log Out
                  </button>
                </div>
              )}
            </div>

          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-grow p-6 md:p-8 space-y-6">
          {renderActiveView()}
        </main>

        {/* Footer */}
        <footer className="p-6 border-t border-white/5 text-center text-[10px] text-gray-500 bg-[#07090e]/50">
          ConnCloud Enterprise Cinema Operation System &copy; 2026 Connplex Cinemas Ltd. All rights reserved.
        </footer>
      </div>
    </div>
  );
}
