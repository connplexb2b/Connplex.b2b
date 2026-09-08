'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import './franchisee.css';
import AhilyanagarApiIntegration from '../../components/conncloud/AhilyanagarApiIntegration';

// Credentials defined by the user
const VALID_EMAIL = 'guptajahnvi47@gmail.com';
const VALID_CONTACT = '9511310113';
const VALID_PASSWORD = 'Jahnvi@04';

// TypeScript Interfaces
interface Metric {
  label: string;
  value: string;
  trend: string;
  isUp: boolean;
  sparkline: number[];
}

interface ScreenShow {
  screen: string;
  movie: string;
  time: string;
  occupancy: number;
}

interface EventItem {
  date: string;
  month: string;
  title: string;
  type: string;
  tagColor?: string;
}

interface NewsItem {
  tag: string;
  title: string;
  time: string;
}

interface CampaignItem {
  name: string;
  reach: string;
  ctr: string;
  status: 'ACTIVE' | 'SCHEDULED';
}

interface LocationConfig {
  id: string;
  name: string;
  shortLabel: string;
  fullName: string;
  city: string;
  state: string;
  cinemaId: string;
  screens: ScreenShow[];
  hasApiIntegration?: boolean;
}

const LOCATIONS: Record<string, LocationConfig> = {
  ahilyanagar: {
    id: 'ahilyanagar',
    name: 'Ahilyanagar',
    shortLabel: 'Ahilyanagar (Vista API Ready)',
    fullName: 'CONNPLEX LUXURIANCE, AHILYANAGAR',
    city: 'Ahilyanagar',
    state: 'Maharashtra',
    cinemaId: 'c5',
    hasApiIntegration: true,
    screens: [
      { screen: 'Screen 1 (Couple Recliner)', movie: 'Raftaar', time: '2:30 PM - 5:10 PM', occupancy: 85 },
      { screen: 'Screen 1 (Couple Recliner)', movie: 'Cosmic Drift', time: '6:00 PM - 8:45 PM', occupancy: 95 },
      { screen: 'Screen 2 (Gold Class)', movie: 'Ishq Junction', time: '3:00 PM - 5:35 PM', occupancy: 70 },
      { screen: 'Screen 2 (Gold Class)', movie: 'Shadow Protocol', time: '6:30 PM - 9:00 PM', occupancy: 60 }
    ]
  },
  gandhinagar: {
    id: 'gandhinagar',
    name: 'Gandhinagar',
    shortLabel: 'Gandhinagar (Capital 2)',
    fullName: 'CONNPLEX CAPITAL 2, GANDHINAGAR',
    city: 'Gandhinagar',
    state: 'Gujarat',
    cinemaId: 'c0',
    screens: [
      { screen: 'Screen 1', movie: 'Raftaar', time: '2:30 PM - 5:10 PM', occupancy: 82 },
      { screen: 'Screen 2', movie: 'Cosmic Drift', time: '3:00 PM - 5:45 PM', occupancy: 64 },
      { screen: 'Screen 3', movie: 'Ishq Junction', time: '2:45 PM - 5:20 PM', occupancy: 91 },
      { screen: 'Screen 4', movie: 'Shadow Protocol', time: '4:00 PM - 6:30 PM', occupancy: 57 },
      { screen: 'Screen 5', movie: 'Dil Ki Baazi', time: '3:15 PM - 5:50 PM', occupancy: 73 },
      { screen: 'Screen 6', movie: 'The Last Circuit', time: '4:30 PM - 7:00 PM', occupancy: 48 }
    ]
  },
  jodhpur: {
    id: 'jodhpur',
    name: 'Jodhpur',
    shortLabel: 'Connplex Jodhpur',
    fullName: 'CONNPLEX JODHPUR',
    city: 'Jodhpur',
    state: 'Rajasthan',
    cinemaId: 'c1',
    screens: [
      { screen: 'Screen 1 (Gold)', movie: 'Raftaar', time: '1:30 PM - 4:10 PM', occupancy: 78 },
      { screen: 'Screen 2', movie: 'Cosmic Drift', time: '2:15 PM - 5:00 PM', occupancy: 65 },
      { screen: 'Screen 3', movie: 'Ishq Junction', time: '4:30 PM - 7:00 PM', occupancy: 88 },
      { screen: 'Screen 4', movie: 'Shadow Protocol', time: '5:15 PM - 7:45 PM', occupancy: 52 }
    ]
  },
  jaipur: {
    id: 'jaipur',
    name: 'Jaipur',
    shortLabel: 'Connplex Jaipur',
    fullName: 'CONNPLEX JAIPUR',
    city: 'Jaipur',
    state: 'Rajasthan',
    cinemaId: 'c2',
    screens: [
      { screen: 'Screen 1 (IMAX)', movie: 'Cosmic Drift', time: '3:00 PM - 5:45 PM', occupancy: 92 },
      { screen: 'Screen 2', movie: 'Raftaar', time: '2:30 PM - 5:10 PM', occupancy: 80 },
      { screen: 'Screen 3', movie: 'Ishq Junction', time: '4:00 PM - 6:30 PM', occupancy: 74 },
      { screen: 'Screen 5 (4DX)', movie: 'Shadow Protocol', time: '5:30 PM - 8:00 PM', occupancy: 86 }
    ]
  },
  ahmedabad: {
    id: 'ahmedabad',
    name: 'Ahmedabad',
    shortLabel: 'Connplex Ahmedabad',
    fullName: 'CONNPLEX AHMEDABAD',
    city: 'Ahmedabad',
    state: 'Gujarat',
    cinemaId: 'c3',
    screens: [
      { screen: 'Screen 1', movie: 'Raftaar', time: '2:00 PM - 4:40 PM', occupancy: 84 },
      { screen: 'Screen 2', movie: 'Cosmic Drift', time: '3:15 PM - 6:00 PM', occupancy: 68 },
      { screen: 'Screen 3', movie: 'Ishq Junction', time: '5:00 PM - 7:30 PM', occupancy: 79 }
    ]
  },
  udaipur: {
    id: 'udaipur',
    name: 'Udaipur',
    shortLabel: 'Connplex Udaipur',
    fullName: 'CONNPLEX UDAIPUR',
    city: 'Udaipur',
    state: 'Rajasthan',
    cinemaId: 'c4',
    screens: [
      { screen: 'Screen 1', movie: 'Raftaar', time: '2:45 PM - 5:25 PM', occupancy: 75 },
      { screen: 'Screen 2', movie: 'Shadow Protocol', time: '4:15 PM - 6:45 PM', occupancy: 62 }
    ]
  }
};

export default function FranchiseePortal() {
  const router = useRouter();
  // Session State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Form State
  const [loginInput, setLoginInput] = useState<string>(''); // Email or contact
  const [password, setPassword] = useState<string>('');
  const [loginError, setLoginError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Interactive UI State
  const [activeTab, setActiveTab] = useState<string>('Dashboard');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [profileDropdownOpen, setProfileDropdownOpen] = useState<boolean>(false);
  const [locationDropdownOpen, setLocationDropdownOpen] = useState<boolean>(false);
  const [selectedLocationKey, setSelectedLocationKey] = useState<string>('ahilyanagar');
  const [toast, setToast] = useState<string | null>(null);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const locationDropdownRef = useRef<HTMLDivElement>(null);

  // Check login state and url parameters on mount
  useEffect(() => {
    const session = localStorage.getItem('franchisee_session');
    if (session === 'authenticated') {
      setIsAuthenticated(true);
    }
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const loc = params.get('location') || params.get('cinema');
      if (loc && LOCATIONS[loc.toLowerCase()]) {
        setSelectedLocationKey(loc.toLowerCase());
      }
    }
    setIsLoading(false);
  }, []);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setProfileDropdownOpen(false);
      }
      if (locationDropdownRef.current && !locationDropdownRef.current.contains(event.target as Node)) {
        setLocationDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle Login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setLoginError('');

    setTimeout(() => {
      const sanitizedInput = loginInput.trim().toLowerCase();
      const isEmailValid = sanitizedInput === VALID_EMAIL.toLowerCase();
      const isContactValid = sanitizedInput === VALID_CONTACT;

      if ((isEmailValid || isContactValid) && password === VALID_PASSWORD) {
        setIsAuthenticated(true);
        localStorage.setItem('franchisee_session', 'authenticated');
        showToast('Successfully signed in! Welcome to Franchise Portal.');
      } else {
        setLoginError('Invalid credentials. Check your email/contact number and password.');
      }
      setIsSubmitting(false);
    }, 800);
  };

  // Handle Logout
  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('franchisee_session');
    setLoginInput('');
    setPassword('');
    setProfileDropdownOpen(false);
    showToast('Signed out successfully.');
  };

  // Show Toast Feedback
  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  // KPI Metrics data
  const metrics: Metric[] = [
    { label: "Today's Revenue", value: "₹4.82L", trend: "+8.2%", isUp: true, sparkline: [10, 15, 8, 20, 25, 18, 30] },
    { label: "Weekly Revenue", value: "₹31.6L", trend: "+5.4%", isUp: true, sparkline: [20, 24, 22, 28, 25, 32, 35] },
    { label: "Monthly Revenue", value: "₹1.28Cr", trend: "+3.1%", isUp: true, sparkline: [15, 18, 21, 20, 24, 23, 28] },
    { label: "ROI", value: "18.4%", trend: "+1.2pt", isUp: true, sparkline: [12, 14, 13, 16, 15, 17, 18.4] },
    { label: "Admissions", value: "3,842", trend: "+6.7%", isUp: true, sparkline: [10, 14, 18, 15, 22, 26, 28] },
    { label: "Occupancy", value: "68%", trend: "-2.1%", isUp: false, sparkline: [75, 73, 72, 70, 71, 69, 68] },
    { label: "Avg Ticket Price", value: "₹215", trend: "+1.8%", isUp: true, sparkline: [205, 208, 210, 209, 212, 214, 215] },
    { label: "Spend Per Head", value: "₹142", trend: "+4.0%", isUp: true, sparkline: [130, 133, 135, 138, 136, 140, 142] },
    { label: "Online Bookings", value: "2,150", trend: "+11.3%", isUp: true, sparkline: [1200, 1400, 1500, 1700, 1900, 2000, 2150] },
    { label: "Counter Sales", value: "1,692", trend: "-3.4%", isUp: false, sparkline: [1800, 1750, 1720, 1710, 1730, 1700, 1692] },
    { label: "Food Revenue", value: "₹1.86L", trend: "+7.9%", isUp: true, sparkline: [1.2, 1.4, 1.3, 1.6, 1.5, 1.7, 1.86] },
    { label: "Customer Rating", value: "4.6★", trend: "+0.2", isUp: true, sparkline: [4.4, 4.4, 4.5, 4.5, 4.5, 4.6, 4.6] }
  ];

  const currentLocation = LOCATIONS[selectedLocationKey] || LOCATIONS['ahilyanagar'];

  // Screen Shows (Live Operations Snapshot based on current cinema)
  const shows: ScreenShow[] = currentLocation.screens;

  // Calendar Events
  const events: EventItem[] = [
    { date: "08", month: "Aug", title: "Raftaar 2: Weekend release", type: "Release" },
    { date: "10", month: "Aug", title: "Regional Franchise Review Meeting", type: "Meeting" },
    { date: "11", month: "Aug", title: "AC Zone C compressor service", type: "Maintenance" },
    { date: "14", month: "Aug", title: "Independence Day ticket bundle", type: "Promotion" },
    { date: "15", month: "Aug", title: "Gandhinagar Cultural Fest", type: "Local event" },
    { date: "20", month: "Aug", title: "Cosmic Drift: Origins release", type: "Release" }
  ];

  // News Items
  const newsList: NewsItem[] = [
    { tag: "CORPORATE", title: "Q2 franchise royalty statements now available", time: "2h ago" },
    { tag: "INDUSTRY", title: "National box office up 14% this quarter", time: "1d ago" },
    { tag: "RELEASE", title: "The Last Circuit 2 confirmed for Sept 2026", time: "2d ago" },
    { tag: "POLICY", title: "Updated F&B hygiene compliance checklist released", time: "3d ago" },
    { tag: "CORPORATE", title: "New loyalty program rollout begins next month", time: "4d ago" }
  ];

  // Campaigns
  const campaigns: CampaignItem[] = [
    { name: "Monsoon Movie Fest", reach: "48.2K", ctr: "4.1%", status: "ACTIVE" },
    { name: "Weekday Family Combo", reach: "21.6K", ctr: "3.2%", status: "ACTIVE" },
    { name: "Independence Day Bundle", reach: "---", ctr: "---", status: "SCHEDULED" }
  ];

  // Render mini Sparkline using SVG
  const renderSparkline = (points: number[], isUp: boolean) => {
    const width = 60;
    const height = 20;
    const min = Math.min(...points);
    const max = Math.max(...points);
    const range = max - min || 1;
    
    const coordinates = points.map((p, index) => {
      const x = (index / (points.length - 1)) * width;
      const y = height - ((p - min) / range) * height;
      return `${x},${y}`;
    }).join(' ');

    return (
      <svg className="fra-sparkline-container" viewBox={`0 0 ${width} ${height}`}>
        <polyline
          fill="none"
          stroke={isUp ? 'var(--fra-green)' : 'var(--fra-red)'}
          strokeWidth="1.5"
          points={coordinates}
        />
      </svg>
    );
  };

  // Filter shows based on query
  const filteredShows = shows.filter(s => 
    s.movie.toLowerCase().includes(searchQuery.toLowerCase()) || 
    s.screen.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Switch tabs
  const handleNavClick = (tab: string) => {
    const slugMap: Record<string, string> = {
      'Dashboard': 'dashboard',
      'Analytics': 'analytics',
      'Finance': 'finance',
      'Movies': 'movies',
      'Ticket Sales': 'ticket-sales',
      'Food & Beverage': 'fnb',
      'Staff': 'staff',
      'Operations': 'operations',
      'Marketing': 'marketing',
      'Reports': 'reports',
      'Documents': 'documents',
      'Support': 'support',
      'Settings': 'settings'
    };
    const slug = slugMap[tab] || '';
    router.push(`/conncloud/${slug}`);
  };

  // Quick action helper
  const handleActionClick = (actionName: string) => {
    if (actionName === 'Ahilyanagar API Sync') {
      setSelectedLocationKey('ahilyanagar');
      showToast('Loaded Ahilyanagar Vista API Integration documentation.');
      setTimeout(() => {
        const el = document.getElementById('ahilyanagar-api-integration');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
      return;
    }
    showToast(`Triggered Action: ${actionName}`);
  };

  if (isLoading) {
    return (
      <div className="fra-signin-container">
        <div className="fra-signin-card" style={{ textAlign: 'center' }}>
          <div className="fra-signin-logo-wrap">
            <Image src="/logo.png" alt="Connplex Cinemas" width={160} height={44} priority style={{ height: 'auto' }} />
          </div>
          <div style={{ color: 'var(--fra-text-secondary)', margin: '2rem 0' }}>
            <i className="fa-solid fa-circle-notch fa-spin" style={{ fontSize: '2rem', color: 'var(--fra-gold)', marginBottom: '1rem', display: 'block' }}></i>
            Initializing Conncloud secure portal...
          </div>
        </div>
      </div>
    );
  }

  // Render Sign-In Page
  if (!isAuthenticated) {
    return (
      <div className="fra-signin-container">
        <div className="fra-signin-card">
          <div className="fra-signin-logo-wrap">
            <Image src="/logo.png" alt="Connplex Cinemas" width={180} height={50} priority style={{ height: 'auto' }} />
          </div>
          <div className="fra-signin-title-wrap">
            <h1>Franchise Portal</h1>
            <p>Access your Conncloud Franchise Owner Dashboard</p>
          </div>

          <form onSubmit={handleLogin}>
            {loginError && (
              <div className="fra-signin-error">
                <i className="fa-solid fa-triangle-exclamation"></i>
                <span>{loginError}</span>
              </div>
            )}

            <div className="fra-signin-form-group">
              <label htmlFor="loginInput">EMAIL ADDRESS OR CONTACT NUMBER</label>
              <div className="fra-signin-input-wrapper">
                <input
                  id="loginInput"
                  type="text"
                  className="fra-signin-input"
                  placeholder="Enter Email or Contact Number"
                  value={loginInput}
                  onChange={(e) => setLoginInput(e.target.value)}
                  required
                />
                <i className="fa-solid fa-user"></i>
              </div>
            </div>

            <div className="fra-signin-form-group">
              <label htmlFor="password">PASSWORD</label>
              <div className="fra-signin-input-wrapper">
                <input
                  id="password"
                  type="password"
                  className="fra-signin-input"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <i className="fa-solid fa-lock"></i>
              </div>
            </div>

            <button type="submit" className="fra-signin-btn" disabled={isSubmitting}>
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

          <p className="fra-signin-hint">
            Authorized franchise personnel only. Connection is encrypted.
          </p>
        </div>
      </div>
    );
  }

  // Render Franchisee Portal Dashboard
  return (
    <div className="fra-portal-layout">
      {/* Toast Alert */}
      {toast && (
        <div className="fra-toast">
          <i className="fa-solid fa-circle-check"></i>
          <span>{toast}</span>
        </div>
      )}

      {/* Left Sidebar */}
      <aside className="fra-sidebar">
        <div className="fra-sidebar-logo-container">
          <Image src="/logo.png" alt="Connplex" width={135} height={36} priority style={{ height: 'auto' }} />
          <span className="fra-sidebar-logo-sub">Conncloud Portal</span>
        </div>

        <div className="fra-sidebar-scroll">
          <div className="fra-sidebar-group">
            <span className="fra-sidebar-group-title">Overview</span>
            <ul className="fra-sidebar-nav-list">
              {[
                { name: 'Dashboard', icon: 'fa-table-columns' },
                { name: 'Analytics', icon: 'fa-chart-line' },
                { name: 'Finance', icon: 'fa-indian-rupee-sign' },
                { name: 'Movies', icon: 'fa-film' },
                { name: 'Ticket Sales', icon: 'fa-ticket' },
                { name: 'Food & Beverage', icon: 'fa-burger' },
                { name: 'Staff', icon: 'fa-user-tie' },
                { name: 'Operations', icon: 'fa-gears' },
                { name: 'Marketing', icon: 'fa-bullhorn' },
                { name: 'Reports', icon: 'fa-file-invoice-dollar' },
                { name: 'Documents', icon: 'fa-folder-open' },
                { name: 'Support', icon: 'fa-circle-question' },
                { name: 'Settings', icon: 'fa-sliders' }
              ].map((item) => (
                <li 
                  key={item.name} 
                  className={`fra-sidebar-nav-item ${activeTab === item.name ? 'active' : ''}`}
                >
                  <button onClick={() => handleNavClick(item.name)}>
                    <i className={`fa-solid ${item.icon}`}></i>
                    <span>{item.name}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="fra-sidebar-footer">
          <span className="fra-status-dot"></span>
          <span className="fra-sidebar-footer-text">All systems operational</span>
        </div>
      </aside>

      {/* Main Panel */}
      <main className="fra-main-container">
        {/* Topbar */}
        <header className="fra-topbar">
          <div className="fra-search-container">
            <i className="fa-solid fa-magnifying-glass"></i>
            <input
              type="text"
              placeholder="Search movies, screens, reports..."
              className="fra-search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="fra-topbar-actions">
            {/* Location Switcher */}
            <div className="relative" ref={locationDropdownRef} style={{ position: 'relative' }}>
              <button
                type="button"
                onClick={() => setLocationDropdownOpen(!locationDropdownOpen)}
                className="fra-btn fra-btn-outline"
                style={{ padding: '0.45rem 0.8rem', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
              >
                <i className="fa-solid fa-location-dot" style={{ color: selectedLocationKey === 'ahilyanagar' ? '#f59e0b' : 'var(--fra-gold)' }}></i>
                <span>{currentLocation.name}</span>
                {currentLocation.hasApiIntegration && (
                  <span style={{ fontSize: '9px', background: 'rgba(245, 158, 11, 0.2)', color: '#fbbf24', padding: '1px 5px', borderRadius: '4px', fontWeight: 'bold' }}>
                    API READY
                  </span>
                )}
                <i className="fa-solid fa-chevron-down" style={{ fontSize: '9px', color: 'var(--fra-text-muted)' }}></i>
              </button>

              {locationDropdownOpen && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  right: 0,
                  marginTop: '0.5rem',
                  background: '#111827',
                  border: '1px solid rgba(255,255,255,0.12)',
                  borderRadius: '10px',
                  padding: '0.4rem',
                  minWidth: '240px',
                  boxShadow: '0 15px 35px rgba(0,0,0,0.6)',
                  zIndex: 50,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '3px'
                }}>
                  <div style={{ fontSize: '10px', color: '#9ca3af', textTransform: 'uppercase', padding: '6px 8px', fontWeight: 'bold', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                    Switch Cinema Property
                  </div>
                  {Object.values(LOCATIONS).map((loc) => (
                    <button
                      key={loc.id}
                      type="button"
                      onClick={() => {
                        setSelectedLocationKey(loc.id);
                        setLocationDropdownOpen(false);
                        showToast(`Switched location to ${loc.name}`);
                      }}
                      style={{
                        textAlign: 'left',
                        padding: '0.5rem 0.65rem',
                        fontSize: '0.75rem',
                        color: selectedLocationKey === loc.id ? '#ffffff' : '#9ca3af',
                        background: selectedLocationKey === loc.id ? 'rgba(37, 99, 235, 0.25)' : 'transparent',
                        borderRadius: '6px',
                        border: 'none',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        transition: 'background 0.2s'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <i className="fa-solid fa-film" style={{ fontSize: '10px', color: selectedLocationKey === loc.id ? '#60a5fa' : '#6b7280' }}></i>
                        <span>{loc.shortLabel}</span>
                      </div>
                      {loc.hasApiIntegration && (
                        <span style={{ fontSize: '8px', background: '#f59e0b', color: '#000', padding: '1px 5px', borderRadius: '3px', fontWeight: '900' }}>
                          VISTA SYNC
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Launch ConnCloud Suite */}
            <Link
              href={`/conncloud/dashboard?cinema=${currentLocation.cinemaId}`}
              className="fra-btn fra-btn-outline"
              style={{ padding: '0.45rem 0.75rem', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
            >
              <span>ConnCloud SaaS</span>
              <i className="fa-solid fa-arrow-up-right-from-square" style={{ fontSize: '9px' }}></i>
            </Link>

            <button className="fra-icon-btn" onClick={() => showToast('No new notifications')}>
              <i className="fa-solid fa-bell"></i>
              <span className="fra-badge">3</span>
            </button>

            <button className="fra-icon-btn" onClick={() => showToast('Inbox is empty')}>
              <i className="fa-solid fa-envelope"></i>
            </button>

            <div className="fra-topbar-divider"></div>

            <div className="fra-profile-dropdown-container" ref={dropdownRef}>
              <button 
                className="fra-profile-trigger"
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              >
                <div className="fra-avatar">RP</div>
                <div className="fra-profile-info">
                  <span className="fra-profile-name">Rakesh Patel</span>
                  <span className="fra-profile-role">Franchise Partner</span>
                </div>
                <i className={`fa-solid ${profileDropdownOpen ? 'fa-chevron-up' : 'fa-chevron-down'}`}></i>
              </button>

              {profileDropdownOpen && (
                <div className="fra-dropdown-menu">
                  <button className="fra-dropdown-item" onClick={() => handleActionClick('Profile settings')}>
                    <i className="fa-solid fa-user-circle"></i> Profile Settings
                  </button>
                  <button className="fra-dropdown-item" onClick={() => handleActionClick('Cinema settings')}>
                    <i className="fa-solid fa-building"></i> Cinema Details
                  </button>
                  <button className="fra-dropdown-item danger" onClick={handleLogout}>
                    <i className="fa-solid fa-sign-out-alt"></i> Log Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="fra-dashboard-content">
          
          {/* Welcome Banner */}
          <section className="fra-welcome-banner">
            <div className="fra-banner-left">
              <span className="fra-live-indicator">
                <span className="fra-live-dot"></span>
                LIVE — {currentLocation.fullName}
              </span>
              <h1>Welcome back, Franchisee Partner</h1>
              <p>Here&apos;s what&apos;s happening across your cinema today — Wednesday, Aug 6, 2026.</p>
            </div>
            
            <div className="fra-banner-actions">
              {selectedLocationKey === 'ahilyanagar' && (
                <button 
                  className="fra-btn"
                  style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: '#000', fontWeight: 'bold' }}
                  onClick={() => {
                    const el = document.getElementById('ahilyanagar-api-integration');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  <i className="fa-solid fa-server mr-1"></i> Vista API Sync Docs
                </button>
              )}
              <button className="fra-btn fra-btn-outline" onClick={() => handleActionClick('Export Revenue')}>
                <i className="fa-solid fa-download"></i> Export Revenue
              </button>
              <button className="fra-btn fra-btn-primary" onClick={() => handleActionClick('View Live Screens')}>
                View Live Screens
              </button>
            </div>
          </section>

          {/* Quick Location Pills Bar */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            overflowX: 'auto',
            padding: '0.5rem 0',
            marginBottom: '0.75rem'
          }}>
            <span style={{ fontSize: '11px', color: '#9ca3af', textTransform: 'uppercase', fontWeight: 'bold', whiteSpace: 'nowrap' }}>
              Cinema Property:
            </span>
            {Object.values(LOCATIONS).map((loc) => (
              <button
                key={loc.id}
                type="button"
                onClick={() => {
                  setSelectedLocationKey(loc.id);
                  showToast(`Viewing ${loc.name}`);
                }}
                style={{
                  padding: '0.35rem 0.8rem',
                  borderRadius: '20px',
                  fontSize: '11px',
                  fontWeight: selectedLocationKey === loc.id ? 'bold' : 'normal',
                  background: selectedLocationKey === loc.id 
                    ? (loc.id === 'ahilyanagar' ? 'linear-gradient(135deg, rgba(245, 158, 11, 0.3), rgba(217, 119, 6, 0.3))' : 'rgba(37, 99, 235, 0.3)')
                    : '#131924',
                  color: selectedLocationKey === loc.id ? '#ffffff' : '#9ca3af',
                  border: selectedLocationKey === loc.id 
                    ? (loc.id === 'ahilyanagar' ? '1px solid rgba(245, 158, 11, 0.6)' : '1px solid rgba(37, 99, 235, 0.6)')
                    : '1px solid rgba(255, 255, 255, 0.06)',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  transition: 'all 0.2s'
                }}
              >
                {loc.id === 'ahilyanagar' && <i className="fa-solid fa-bolt" style={{ color: '#f59e0b' }}></i>}
                <span>{loc.name}</span>
                {loc.hasApiIntegration && (
                  <span style={{ fontSize: '8px', background: '#f59e0b', color: '#000', padding: '1px 5px', borderRadius: '3px', fontWeight: '900' }}>
                    API READY
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Ahilyanagar Vista API Integration Section - Highlighted for Ahilyanagar location */}
          {selectedLocationKey === 'ahilyanagar' && (
            <div style={{ marginBottom: '1.75rem' }}>
              <AhilyanagarApiIntegration onNotification={showToast} defaultExpanded={true} />
            </div>
          )}

          {/* Metrics Grid */}
          <section className="fra-metrics-grid">
            {metrics.map((m, idx) => (
              <div key={idx} className="fra-metric-card">
                <div className="fra-metric-header">
                  <div className="fra-metric-title-wrap">
                    <span className={`fra-metric-dot ${m.isUp ? '' : 'red'}`}></span>
                    <span className="fra-metric-label">{m.label}</span>
                  </div>
                  {renderSparkline(m.sparkline, m.isUp)}
                </div>
                <div className="fra-metric-value">{m.value}</div>
                <div className={`fra-metric-trend ${m.isUp ? 'up' : 'down'}`}>
                  <i className={`fa-solid ${m.isUp ? 'fa-caret-up' : 'fa-caret-down'}`}></i>
                  <span>{m.trend}</span>
                </div>
              </div>
            ))}
          </section>

          {/* Middle Layout - snapshot & actions */}
          <div className="fra-mid-grid">
            
            {/* Live Snapshot */}
            <section className="fra-section-card">
              <div className="fra-section-header">
                <h2 className="fra-section-title">
                  Live Operations Snapshot
                </h2>
                <span className="fra-header-badge">{filteredShows.length} SHOWS ACTIVE</span>
              </div>

              <div className="fra-table-wrap">
                <table className="fra-table">
                  <thead>
                    <tr>
                      <th>Screen</th>
                      <th>Playing Now</th>
                      <th>Time Slot</th>
                      <th>Occupancy</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredShows.length === 0 ? (
                      <tr>
                        <td colSpan={4} style={{ textAlign: 'center', color: 'var(--fra-text-muted)', padding: '2rem' }}>
                          No matching active shows found.
                        </td>
                      </tr>
                    ) : (
                      filteredShows.map((s, idx) => (
                        <tr key={idx}>
                          <td className="fra-screen-name">{s.screen}</td>
                          <td className="fra-movie-title">{s.movie}</td>
                          <td className="fra-showtime">{s.time}</td>
                          <td>
                            <div className="fra-progress-container">
                              <div className="fra-progress-track">
                                <div 
                                  className="fra-progress-fill" 
                                  style={{ width: `${s.occupancy}%` }}
                                ></div>
                              </div>
                              <span className="fra-progress-percent">{s.occupancy}%</span>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Quick Actions */}
            <section className="fra-section-card">
              <div className="fra-section-header">
                <h2 className="fra-section-title">Quick Actions</h2>
              </div>
              <div className="fra-actions-grid">
                {[
                  { label: "Ahilyanagar API Sync", icon: "fa-server" },
                  { label: "Download Daily Report", icon: "fa-download" },
                  { label: "Download Monthly Report", icon: "fa-file-arrow-down" },
                  { label: "Create Maintenance Ticket", icon: "fa-ticket" },
                  { label: "View Live Screens", icon: "fa-display" },
                  { label: "Export Revenue", icon: "fa-upload" },
                  { label: "Manage Staff", icon: "fa-users" },
                  { label: "Order Inventory", icon: "fa-boxes-stacked" }
                ].map((act, idx) => (
                  <button 
                    key={idx} 
                    className="fra-action-item"
                    onClick={() => handleActionClick(act.label)}
                  >
                    <div className="fra-action-icon">
                      <i className={`fa-solid ${act.icon}`}></i>
                    </div>
                    <span className="fra-action-label">{act.label}</span>
                  </button>
                ))}
              </div>
            </section>

          </div>

          {/* Bottom layout - events, news, campaigns */}
          <div className="fra-bottom-grid">
            
            {/* Calendar & Events */}
            <section className="fra-section-card">
              <div className="fra-section-header">
                <h2 className="fra-section-title">Calendar &amp; Events</h2>
              </div>
              <div className="fra-list">
                {events.map((e, idx) => (
                  <div key={idx} className="fra-event-item">
                    <div className="fra-event-date-badge">
                      <span className="fra-event-month">{e.month}</span>
                      <span className="fra-event-day">{e.date}</span>
                    </div>
                    <div className="fra-event-details">
                      <span className="fra-event-title">{e.title}</span>
                      <span className="fra-event-type">{e.type}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* News & Announcements */}
            <section className="fra-section-card">
              <div className="fra-section-header">
                <h2 className="fra-section-title">News &amp; Announcements</h2>
              </div>
              <div className="fra-list">
                {newsList.map((n, idx) => (
                  <div key={idx} className="fra-news-item">
                    <div className="fra-news-meta">
                      <span className="fra-news-tag">{n.tag}</span>
                      <span className="fra-news-time">{n.time}</span>
                    </div>
                    <span className="fra-news-title" onClick={() => handleActionClick(n.title)}>
                      {n.title}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            {/* Marketing */}
            <section className="fra-section-card">
              <div className="fra-section-header">
                <h2 className="fra-section-title">Marketing</h2>
              </div>
              <div className="fra-list">
                {campaigns.map((c, idx) => (
                  <div key={idx} className="fra-marketing-campaign">
                    <div className="fra-campaign-info">
                      <span className="fra-campaign-name">{c.name}</span>
                      <span className="fra-campaign-metrics">
                        Reach {c.reach} - CTR {c.ctr}
                      </span>
                    </div>
                    <span className={`fra-campaign-badge ${c.status.toLowerCase()}`}>
                      {c.status}
                    </span>
                  </div>
                ))}
              </div>
              <div className="fra-marketing-actions">
                <button className="fra-btn fra-btn-outline" style={{ justifyContent: 'center' }} onClick={() => handleActionClick('Poster Library')}>
                  Poster Library
                </button>
                <button className="fra-btn fra-btn-outline" style={{ justifyContent: 'center' }} onClick={() => handleActionClick('Social Toolkit')}>
                  Social Toolkit
                </button>
              </div>
            </section>

          </div>

          {/* Support Center section */}
          <section className="fra-support-section">
            <h2 className="fra-section-title" style={{ marginBottom: '1.25rem' }}>Support Center</h2>
            <div className="fra-support-grid">
              {[
                { title: "Raise Ticket", desc: "New request", icon: "fa-ticket" },
                { title: "Live Chat", desc: "Online now", icon: "fa-comments" },
                { title: "Knowledge Base", desc: "120 articles", icon: "fa-book-open" },
                { title: "Training Videos", desc: "18 modules", icon: "fa-video" },
                { title: "Emergency", desc: "Contacts", icon: "fa-phone-flip" }
              ].map((sup, idx) => (
                <div 
                  key={idx} 
                  className="fra-support-item"
                  onClick={() => handleActionClick(sup.title)}
                >
                  <div className="fra-support-icon">
                    <i className={`fa-solid ${sup.icon}`}></i>
                  </div>
                  <span className="fra-support-title">{sup.title}</span>
                  <span className="fra-support-desc">{sup.desc}</span>
                </div>
              ))}
            </div>
          </section>

        </div>

        {/* Footer */}
        <footer className="fra-footer">
          <span className="fra-footer-text">Connplex Cinemas &copy; 2026</span>
        </footer>

      </main>
    </div>
  );
}
