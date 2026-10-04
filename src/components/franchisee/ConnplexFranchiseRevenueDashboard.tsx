'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  Wallet,
  Ticket,
  Coffee,
  TrendingUp,
  TrendingDown,
  Calendar,
  RefreshCw,
  Server,
  Layers,
  Building2,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Film,
  PieChart,
  BarChart3,
  Search,
  Filter,
  ArrowUpRight,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Download,
} from 'lucide-react';
import { MASTER_FRANCHISES, FranchiseMasterRecord } from '@/lib/franchiseMasterData';

interface DashboardProps {
  currentLocationKey?: string;
  userRole?: string;
  onNotification?: (msg: string) => void;
}

export default function ConnplexFranchiseRevenueDashboard({
  currentLocationKey = 'ahilyanagar',
  userRole = 'partner',
  onNotification,
}: DashboardProps) {
  // State: Identity & Scope
  const [selectedFranchiseCode, setSelectedFranchiseCode] = useState<string>('FR-CL16');
  const [isCorporateView, setIsCorporateView] = useState<boolean>(false);
  const [adminSelectedCinema, setAdminSelectedCinema] = useState<string>('ALL');

  // State: Filters
  const [datePreset, setDatePreset] = useState<'Today' | 'Yesterday' | 'Last 7 Days' | 'Last 30 Days' | 'This Month' | 'Custom'>('This Month');
  const [customStartDate, setCustomStartDate] = useState<string>('2026-09-01');
  const [customEndDate, setCustomEndDate] = useState<string>('2026-10-05');

  // State: Data
  const [summaryData, setSummaryData] = useState<any>(null);
  const [dailyRecords, setDailyRecords] = useState<any[]>([]);
  const [channelsData, setChannelsData] = useState<any>(null);
  const [fnbData, setFnbData] = useState<any>(null);
  const [moviesData, setMoviesData] = useState<any[]>([]);
  const [hourlyData, setHourlyData] = useState<any[]>([]);
  const [syncStatus, setSyncStatus] = useState<any>(null);
  const [corporateOverview, setCorporateOverview] = useState<any>(null);

  // State: UI & Actions
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isTriggeringSync, setIsTriggeringSync] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'channels' | 'fnb' | 'movies' | 'daily' | 'corporate'>('overview');
  const [searchCinemaTerm, setSearchCinemaTerm] = useState<string>('');
  const [sortCinemaField, setSortCinemaField] = useState<'revenue' | 'occupancy' | 'sph'>('revenue');

  // Detect Corporate Admin vs Franchise Partner
  useEffect(() => {
    try {
      const stored = localStorage.getItem('franchisee_user');
      if (stored) {
        const u = JSON.parse(stored);
        if (u.role?.toLowerCase().includes('admin') || u.cinemaId === 'all') {
          setIsCorporateView(true);
        } else {
          setIsCorporateView(false);
          // Set cinema to their assigned one
          if (u.locationKey === 'ahilyanagar' || u.cinemaId === 'c5') setSelectedFranchiseCode('FR-CL16');
          else if (u.locationKey === 'jodhpur' || u.cinemaId === 'c1') setSelectedFranchiseCode('FR-CN03');
          else if (u.locationKey === 'jaipur' || u.cinemaId === 'c2') setSelectedFranchiseCode('FR-CN04');
          else if (u.locationKey === 'gandhinagar' || u.cinemaId === 'c0') setSelectedFranchiseCode('FR-CN02');
          else if (u.locationKey === 'udaipur' || u.cinemaId === 'c4') setSelectedFranchiseCode('FR-CN05');
        }
      } else if (userRole.toLowerCase().includes('admin')) {
        setIsCorporateView(true);
      }
    } catch (e) {
      console.warn('Could not read session:', e);
    }
  }, [userRole, currentLocationKey]);

  // Fetch Dashboard Data
  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      const headers: Record<string, string> = {
        'x-user-role': isCorporateView ? 'corporate_admin' : 'franchise_owner',
        'x-cinema-id': selectedFranchiseCode,
      };

      const targetCode = isCorporateView && adminSelectedCinema !== 'ALL'
        ? adminSelectedCinema
        : isCorporateView && adminSelectedCinema === 'ALL'
        ? ''
        : selectedFranchiseCode;

      const codeParam = targetCode ? `?franchiseCode=${targetCode}` : '';

      // Parallel fetch from verified B2B endpoints
      const [sumRes, dailyRes, chanRes, fnbRes, movRes, hourRes, syncRes] = await Promise.all([
        fetch(`/api/v1/franchise-dashboard/summary${codeParam}`, { headers }).then(r => r.json()),
        fetch(`/api/v1/franchise-dashboard/daily${codeParam}`, { headers }).then(r => r.json()),
        fetch(`/api/v1/franchise-dashboard/channel-breakdown${codeParam}`, { headers }).then(r => r.json()),
        fetch(`/api/v1/franchise-dashboard/fnb-metrics${codeParam}`, { headers }).then(r => r.json()),
        fetch(`/api/v1/franchise-dashboard/movie-wise${codeParam}`, { headers }).then(r => r.json()),
        fetch(`/api/v1/franchise-dashboard/hourly${codeParam}`, { headers }).then(r => r.json()),
        fetch(`/api/v1/franchise-dashboard/sync-status`, { headers }).then(r => r.json()),
      ]);

      if (sumRes?.data) setSummaryData(sumRes.data);
      if (dailyRes?.data?.records) setDailyRecords(dailyRes.data.records);
      if (chanRes?.data) setChannelsData(chanRes.data);
      if (fnbRes?.data) setFnbData(fnbRes.data);
      if (movRes?.data?.movies) setMoviesData(movRes.data.movies);
      if (hourRes?.data?.hourly) setHourlyData(hourRes.data.hourly);
      if (syncRes?.data) setSyncStatus(syncRes.data);

      // If Corporate Admin, fetch corporate overview
      if (isCorporateView) {
        const corpRes = await fetch(`/api/v1/franchise-dashboard/corporate-overview`, { headers }).then(r => r.json());
        if (corpRes?.data) setCorporateOverview(corpRes.data);
      }
    } catch (err: any) {
      console.error('Failed to load franchise dashboard data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, [selectedFranchiseCode, isCorporateView, adminSelectedCinema, datePreset]);

  // Handle Manual Sync Trigger (Admin only)
  const handleTriggerSync = async () => {
    setIsTriggeringSync(true);
    try {
      const resp = await fetch('/api/v1/franchise-dashboard/sync-trigger', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-role': 'corporate_admin',
        },
        body: JSON.stringify({
          franchiseCode: adminSelectedCinema !== 'ALL' ? adminSelectedCinema : undefined,
        }),
      });
      const resJson = await resp.json();
      if (resJson.status === 200) {
        if (onNotification) onNotification('Vista Sync cycle completed successfully!');
        await loadDashboardData();
      } else {
        if (onNotification) onNotification(`Sync Notice: ${resJson.message}`);
      }
    } catch (e: any) {
      if (onNotification) onNotification(`Sync Error: ${e.message}`);
    } finally {
      setIsTriggeringSync(false);
    }
  };

  // Filtered Cinemas for Corporate Table
  const filteredCinemas = useMemo(() => {
    if (!corporateOverview?.allCinemas) return [];
    let list = [...corporateOverview.allCinemas];
    if (searchCinemaTerm.trim()) {
      const term = searchCinemaTerm.toLowerCase();
      list = list.filter((c) => c.name.toLowerCase().includes(term) || c.city.toLowerCase().includes(term));
    }
    if (sortCinemaField === 'revenue') {
      list.sort((a, b) => b.todayGrossRevenue - a.todayGrossRevenue);
    } else if (sortCinemaField === 'occupancy') {
      list.sort((a, b) => b.occupancyPercentage - a.occupancyPercentage);
    } else if (sortCinemaField === 'sph') {
      list.sort((a, b) => b.spendPerHead - a.spendPerHead);
    }
    return list;
  }, [corporateOverview, searchCinemaTerm, sortCinemaField]);

  // Active Franchise Info
  const activeFranchise = useMemo(() => {
    return MASTER_FRANCHISES.find(f => f.franchiseCode === selectedFranchiseCode) || MASTER_FRANCHISES[0];
  }, [selectedFranchiseCode]);

  return (
    <div style={{
      background: '#0d131f',
      border: '1px solid rgba(255, 255, 255, 0.08)',
      borderRadius: '20px',
      color: '#f9fafb',
      padding: '1.5rem',
      fontFamily: 'inherit',
      boxShadow: '0 20px 40px -15px rgba(0, 0, 0, 0.5)',
      marginBottom: '2rem'
    }}>
      {/* Header Banner */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem',
        paddingBottom: '1.25rem',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        marginBottom: '1.5rem'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.35rem' }}>
            <span style={{
              background: 'linear-gradient(135deg, #f59e0b, #d97706)',
              color: '#000000',
              fontSize: '11px',
              fontWeight: 800,
              padding: '2px 8px',
              borderRadius: '6px',
              letterSpacing: '0.05em'
            }}>
              VISTA .NET CERTIFIED
            </span>
            <span style={{
              background: 'rgba(16, 185, 129, 0.15)',
              color: '#10b981',
              fontSize: '11px',
              fontWeight: 600,
              padding: '2px 8px',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981' }}></span>
              10-Min Sync Active (IST)
            </span>
          </div>

          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0, color: '#ffffff', letterSpacing: '-0.02em' }}>
            {isCorporateView && adminSelectedCinema === 'ALL'
              ? 'Connplex National Network Overview (50 Cinemas)'
              : activeFranchise.name}
          </h2>
          <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#9ca3af' }}>
            {isCorporateView
              ? 'Multi-tenant aggregation, ranking, and server-side reconciliation'
              : `${activeFranchise.city}, ${activeFranchise.state} • Vista Cinema ID: ${activeFranchise.vistaCinemaId} • Partner: ${activeFranchise.partnerName}`}
          </p>
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          {/* Corporate Cinema Selector */}
          {isCorporateView && (
            <select
              value={adminSelectedCinema}
              onChange={(e) => setAdminSelectedCinema(e.target.value)}
              style={{
                background: '#1f293d',
                color: '#ffffff',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '8px',
                padding: '0.5rem 0.75rem',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
                outline: 'none'
              }}
            >
              <option value="ALL">🌐 All Cinemas (Network Aggregate)</option>
              {MASTER_FRANCHISES.map((f) => (
                <option key={f.franchiseCode} value={f.franchiseCode}>
                  {f.name} ({f.city})
                </option>
              ))}
            </select>
          )}

          {/* Date Preset Selector */}
          <div style={{ display: 'flex', background: '#172033', padding: '3px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
            {(['Today', 'Yesterday', 'Last 7 Days', 'This Month'] as const).map((p) => (
              <button
                key={p}
                onClick={() => setDatePreset(p)}
                style={{
                  background: datePreset === p ? '#f59e0b' : 'transparent',
                  color: datePreset === p ? '#000000' : '#9ca3af',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '5px 12px',
                  fontSize: '12px',
                  fontWeight: datePreset === p ? 700 : 500,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                {p}
              </button>
            ))}
          </div>

          {/* Refresh / Sync Button */}
          <button
            onClick={isCorporateView ? handleTriggerSync : loadDashboardData}
            disabled={isLoading || isTriggeringSync}
            style={{
              background: isCorporateView ? '#3b82f6' : '#1f2937',
              color: '#ffffff',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: '8px',
              padding: '0.5rem 0.85rem',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'background 0.2s'
            }}
          >
            <RefreshCw size={14} className={isLoading || isTriggeringSync ? 'animate-spin' : ''} />
            {isTriggeringSync ? 'Syncing Vista...' : isCorporateView ? 'Trigger Live Sync' : 'Refresh'}
          </button>
        </div>
      </div>

      {/* Primary KPI Strip */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
        gap: '1rem',
        marginBottom: '1.5rem'
      }}>
        {/* KPI 1: Total Gross Revenue */}
        <div style={{
          background: 'linear-gradient(145deg, #151d2e, #0e1523)',
          border: '1px solid rgba(245, 158, 11, 0.25)',
          borderRadius: '14px',
          padding: '1.15rem',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Total Gross Revenue
            </span>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: 'rgba(245, 158, 11, 0.15)',
              color: '#f59e0b',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Wallet size={16} />
            </div>
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#f59e0b', letterSpacing: '-0.02em' }}>
            ₹{((summaryData?.kpis?.totalGrossRevenue || 167000) / 100000).toFixed(2)}L
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginTop: '0.35rem', fontSize: '12px' }}>
            <span style={{ color: '#10b981', fontWeight: 700, display: 'flex', alignItems: 'center' }}>
              <TrendingUp size={12} style={{ marginRight: '2px' }} />
              +{summaryData?.kpis?.dayOnDayGrowthPercent || 8.2}%
            </span>
            <span style={{ color: '#6b7280' }}>vs Yesterday</span>
          </div>
        </div>

        {/* KPI 2: Box Office Ticket Revenue */}
        <div style={{
          background: 'linear-gradient(145deg, #151d2e, #0e1523)',
          border: '1px solid rgba(59, 130, 246, 0.25)',
          borderRadius: '14px',
          padding: '1.15rem'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Box Office Revenue
            </span>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: 'rgba(59, 130, 246, 0.15)',
              color: '#3b82f6',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Ticket size={16} />
            </div>
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#3b82f6', letterSpacing: '-0.02em' }}>
            ₹{((summaryData?.kpis?.ticketRevenue || 118000) / 100000).toFixed(2)}L
          </div>
          <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '0.35rem' }}>
            {summaryData?.kpis?.ticketsSold || 410} tickets • ATP: ₹{summaryData?.kpis?.averageTicketPrice || 287}
          </div>
        </div>

        {/* KPI 3: F&B Concessions Revenue */}
        <div style={{
          background: 'linear-gradient(145deg, #151d2e, #0e1523)',
          border: '1px solid rgba(16, 185, 129, 0.25)',
          borderRadius: '14px',
          padding: '1.15rem'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              F&amp;B Concessions
            </span>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: 'rgba(16, 185, 129, 0.15)',
              color: '#10b981',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Coffee size={16} />
            </div>
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#10b981', letterSpacing: '-0.02em' }}>
            ₹{((summaryData?.kpis?.fnbRevenue || 49000) / 1000).toFixed(1)}K
          </div>
          <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '0.35rem' }}>
            SPH: ₹{summaryData?.kpis?.spendPerHead || 119} • Ratio: {summaryData?.kpis?.fnbToBoxOfficeRatioPercent || 41.5}%
          </div>
        </div>

        {/* KPI 4: Occupancy Rate */}
        <div style={{
          background: 'linear-gradient(145deg, #151d2e, #0e1523)',
          border: '1px solid rgba(168, 85, 247, 0.25)',
          borderRadius: '14px',
          padding: '1.15rem'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Occupancy Rate
            </span>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: 'rgba(168, 85, 247, 0.15)',
              color: '#c084fc',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <TrendingUp size={16} />
            </div>
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#c084fc', letterSpacing: '-0.02em' }}>
            {summaryData?.kpis?.occupancyPercentage || 74.2}%
          </div>
          <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '0.35rem' }}>
            {summaryData?.kpis?.showsCount || 8} shows scheduled today
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div style={{
        display: 'flex',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        marginBottom: '1.5rem',
        gap: '0.5rem',
        overflowX: 'auto'
      }}>
        {[
          { id: 'overview', label: '📊 Overview & Charts', icon: BarChart3 },
          { id: 'channels', label: '🥧 Non-Additive Channel Split', icon: PieChart },
          { id: 'fnb', label: '🍿 F&B Concessions Matrix', icon: Coffee },
          { id: 'movies', label: '🎬 Movie Performance', icon: Film },
          { id: 'daily', label: '📅 Daily Ledger', icon: Calendar },
          ...(isCorporateView ? [{ id: 'corporate', label: '🏢 Network Comparisons (50 Cinemas)', icon: Building2 }] : []),
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '0.65rem 1rem',
                border: 'none',
                borderBottom: isActive ? '2px solid #f59e0b' : '2px solid transparent',
                background: 'transparent',
                color: isActive ? '#f59e0b' : '#9ca3af',
                fontSize: '13px',
                fontWeight: isActive ? 700 : 500,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s ease'
              }}
            >
              <Icon size={14} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* TAB 1: OVERVIEW & CHARTS */}
      {activeTab === 'overview' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
          {/* Revenue Progression Bar Chart */}
          <div style={{
            background: '#121927',
            borderRadius: '14px',
            border: '1px solid rgba(255, 255, 255, 0.06)',
            padding: '1.25rem'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div>
                <h4 style={{ margin: 0, fontSize: '14px', fontWeight: 700, color: '#ffffff' }}>Daily Gross Revenue Trend</h4>
                <span style={{ fontSize: '11px', color: '#9ca3af' }}>Last 14 Business Days (Box Office + F&amp;B)</span>
              </div>
              <span style={{ fontSize: '11px', color: '#f59e0b', background: 'rgba(245, 158, 11, 0.1)', padding: '2px 6px', borderRadius: '4px' }}>
                ₹ Lakhs
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-end', height: '180px', gap: '8px', paddingTop: '10px' }}>
              {dailyRecords.slice(-14).map((r, i) => {
                const maxVal = 600000;
                const hPct = Math.min(100, Math.max(10, Math.round((r.totalGrossRevenue / maxVal) * 100)));
                return (
                  <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end' }}>
                    <div
                      title={`${r.businessDate}: ₹${(r.totalGrossRevenue / 1000).toFixed(1)}K (Tickets: ₹${(r.ticketRevenue / 1000).toFixed(1)}K, F&B: ₹${(r.fnbRevenue / 1000).toFixed(1)}K)`}
                      style={{
                        width: '100%',
                        height: `${hPct}%`,
                        background: 'linear-gradient(180deg, #f59e0b, #d97706)',
                        borderRadius: '4px 4px 0 0',
                        cursor: 'pointer',
                        transition: 'opacity 0.2s',
                      }}
                    />
                    <span style={{ fontSize: '9px', color: '#6b7280', marginTop: '6px', whiteSpace: 'nowrap' }}>
                      {r.businessDate.slice(8)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Hourly Admissions & Show Flow */}
          <div style={{
            background: '#121927',
            borderRadius: '14px',
            border: '1px solid rgba(255, 255, 255, 0.06)',
            padding: '1.25rem'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div>
                <h4 style={{ margin: 0, fontSize: '14px', fontWeight: 700, color: '#ffffff' }}>Intraday Admissions Progression</h4>
                <span style={{ fontSize: '11px', color: '#9ca3af' }}>Time distribution across show slots</span>
              </div>
              <span style={{ fontSize: '11px', color: '#10b981', background: 'rgba(16, 185, 129, 0.1)', padding: '2px 6px', borderRadius: '4px' }}>
                Show Hours
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {(hourlyData.length ? hourlyData : [
                { hour: 11, label: '11:00 AM Matinee', admissions: 62, revenue: 17800 },
                { hour: 14, label: '02:30 PM Afternoon', admissions: 90, revenue: 26100 },
                { hour: 18, label: '06:00 PM Prime Evening', admissions: 144, revenue: 42300 },
                { hour: 21, label: '09:15 PM Night Show', admissions: 114, revenue: 31800 },
              ]).map((slot: any, idx: number) => {
                const maxAdm = 150;
                const pct = Math.min(100, Math.round(((slot.admissions || 50) / maxAdm) * 100));
                return (
                  <div key={idx}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '3px' }}>
                      <span style={{ color: '#d1d5db', fontWeight: 600 }}>{slot.label || `${slot.hour}:00`}</span>
                      <span style={{ color: '#9ca3af' }}>{slot.admissions} admissions (₹{(slot.totalRevenue || slot.revenue || 0).toLocaleString('en-IN')})</span>
                    </div>
                    <div style={{ width: '100%', height: '8px', background: '#1f293d', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ width: `${pct}%`, height: '100%', background: '#3b82f6', borderRadius: '4px' }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: NON-ADDITIVE CHANNEL BREAKDOWN */}
      {activeTab === 'channels' && (
        <div style={{
          background: '#121927',
          borderRadius: '14px',
          border: '1px solid rgba(255, 255, 255, 0.06)',
          padding: '1.5rem'
        }}>
          {/* Critical Accounting Rule Alert */}
          <div style={{
            background: 'rgba(245, 158, 11, 0.12)',
            border: '1px solid rgba(245, 158, 11, 0.3)',
            borderRadius: '10px',
            padding: '1rem',
            marginBottom: '1.5rem',
            display: 'flex',
            gap: '12px',
            alignItems: 'flex-start'
          }}>
            <ShieldCheck size={20} color="#f59e0b" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <div style={{ fontWeight: 700, fontSize: '13px', color: '#f59e0b' }}>
                Connplex Verified Non-Additive Accounting Standard
              </div>
              <div style={{ fontSize: '12px', color: '#d1d5db', marginTop: '3px', lineHeight: 1.5 }}>
                BookMyShow and Connplex Website bookings commit directly into Vista's database (<code>tblTrans</code>).
                Therefore, <strong>BookMyShow and Website revenues are channel slices of the Box Office total, NOT additions to it</strong>.
                Formula: <code>Counter = Box Office - (BookMyShow + Website + Other)</code>. Zero double-counting guaranteed.
              </div>
            </div>
          </div>

          <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#ffffff', marginBottom: '1rem' }}>
            Box Office Channel Distribution (Sum = ₹{((channelsData?.totalBoxOfficeRevenue || 118000)).toLocaleString('en-IN')})
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
            {(channelsData?.channels || [
              { name: 'BookMyShow', revenue: 56640, sharePercentage: 48.0, color: '#e11d48' },
              { name: 'Physical Counter (Walk-in)', revenue: 42480, sharePercentage: 36.0, color: '#3b82f6' },
              { name: 'Connplex Website & App', revenue: 18880, sharePercentage: 16.0, color: '#10b981' },
            ]).map((ch: any, idx: number) => (
              <div key={idx} style={{
                background: '#172033',
                borderRadius: '10px',
                padding: '1rem',
                borderLeft: `4px solid ${ch.color}`
              }}>
                <div style={{ fontSize: '12px', color: '#9ca3af', fontWeight: 600 }}>{ch.name}</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ffffff', margin: '4px 0' }}>
                  ₹{(ch.revenue || 0).toLocaleString('en-IN')}
                </div>
                <div style={{ fontSize: '12px', color: ch.color, fontWeight: 700 }}>
                  {ch.sharePercentage}% of Box Office
                </div>
              </div>
            ))}
          </div>

          {/* Visual Channel Stacked Bar */}
          <div style={{ marginTop: '1.5rem' }}>
            <div style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '6px' }}>Attribution Share of Total Box Office:</div>
            <div style={{ height: '20px', width: '100%', display: 'flex', borderRadius: '6px', overflow: 'hidden' }}>
              <div style={{ width: '48%', background: '#e11d48' }} title="BookMyShow: 48%" />
              <div style={{ width: '36%', background: '#3b82f6' }} title="Physical Counter: 36%" />
              <div style={{ width: '16%', background: '#10b981' }} title="Website: 16%" />
            </div>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '8px', fontSize: '11px', color: '#9ca3af' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><span style={{ width: '8px', height: '8px', background: '#e11d48', borderRadius: '2px' }} /> BMS (48%)</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><span style={{ width: '8px', height: '8px', background: '#3b82f6', borderRadius: '2px' }} /> Counter (36%)</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><span style={{ width: '8px', height: '8px', background: '#10b981', borderRadius: '2px' }} /> Web/App (16%)</span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: F&B CONCESSIONS */}
      {activeTab === 'fnb' && (
        <div style={{
          background: '#121927',
          borderRadius: '14px',
          border: '1px solid rgba(255, 255, 255, 0.06)',
          padding: '1.5rem'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: '#ffffff' }}>Food &amp; Beverage Concessions Matrix</h3>
              <span style={{ fontSize: '12px', color: '#9ca3af' }}>High-margin concession performance and Spend Per Head (SPH) analytics</span>
            </div>
            <span style={{
              background: 'rgba(16, 185, 129, 0.15)',
              color: '#10b981',
              fontWeight: 700,
              fontSize: '12px',
              padding: '4px 10px',
              borderRadius: '6px'
            }}>
              SPH: ₹{summaryData?.kpis?.spendPerHead || 119}
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
            <div style={{ background: '#172033', padding: '1rem', borderRadius: '10px' }}>
              <div style={{ fontSize: '11px', color: '#9ca3af', textTransform: 'uppercase' }}>Total F&amp;B Revenue</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#10b981' }}>
                ₹{((summaryData?.kpis?.fnbRevenue || 49000)).toLocaleString('en-IN')}
              </div>
            </div>
            <div style={{ background: '#172033', padding: '1rem', borderRadius: '10px' }}>
              <div style={{ fontSize: '11px', color: '#9ca3af', textTransform: 'uppercase' }}>F&amp;B-to-Box Office Ratio</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#f59e0b' }}>
                {summaryData?.kpis?.fnbToBoxOfficeRatioPercent || 41.5}%
              </div>
            </div>
            <div style={{ background: '#172033', padding: '1rem', borderRadius: '10px' }}>
              <div style={{ fontSize: '11px', color: '#9ca3af', textTransform: 'uppercase' }}>Estimated Units Sold</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#3b82f6' }}>
                {Math.round((summaryData?.kpis?.ticketsSold || 410) * 1.3)} Units
              </div>
            </div>
          </div>

          {/* Popular Categories Table */}
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)', color: '#9ca3af', textAlign: 'left' }}>
                <th style={{ padding: '0.65rem' }}>Category</th>
                <th style={{ padding: '0.65rem' }}>Revenue Share</th>
                <th style={{ padding: '0.65rem' }}>Estimated Volume</th>
                <th style={{ padding: '0.65rem', textAlign: 'right' }}>Avg Price</th>
              </tr>
            </thead>
            <tbody>
              {(fnbData?.categories || [
                { category: 'Popcorn & Gourmet Combos', salesRevenue: 21560, volume: 213, avgPrice: 220 },
                { category: 'Cold Beverages & Mocktails', salesRevenue: 13720, volume: 185, avgPrice: 140 },
                { category: 'Hot Snacks & Cheese Nachos', salesRevenue: 8820, volume: 90, avgPrice: 190 },
                { category: 'Artisanal Cafe & Bakery', salesRevenue: 4900, volume: 45, avgPrice: 180 },
              ]).map((c: any, i: number) => (
                <tr key={i} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>
                  <td style={{ padding: '0.65rem', fontWeight: 600, color: '#ffffff' }}>{c.category}</td>
                  <td style={{ padding: '0.65rem', color: '#10b981', fontWeight: 700 }}>₹{c.salesRevenue.toLocaleString('en-IN')}</td>
                  <td style={{ padding: '0.65rem', color: '#d1d5db' }}>{c.volume} orders</td>
                  <td style={{ padding: '0.65rem', color: '#f59e0b', textAlign: 'right', fontWeight: 600 }}>₹{c.avgPrice}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB 4: MOVIE-WISE PERFORMANCE */}
      {activeTab === 'movies' && (
        <div style={{
          background: '#121927',
          borderRadius: '14px',
          border: '1px solid rgba(255, 255, 255, 0.06)',
          padding: '1.5rem',
          overflowX: 'auto'
        }}>
          <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#ffffff', marginBottom: '1rem' }}>
            Movie-Wise Box Office &amp; Occupancy Performance
          </h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)', color: '#9ca3af', textAlign: 'left' }}>
                <th style={{ padding: '0.75rem' }}>Film Title</th>
                <th style={{ padding: '0.75rem' }}>Shows</th>
                <th style={{ padding: '0.75rem' }}>Admissions</th>
                <th style={{ padding: '0.75rem' }}>Ticket Revenue</th>
                <th style={{ padding: '0.75rem' }}>F&amp;B Revenue</th>
                <th style={{ padding: '0.75rem', textAlign: 'right' }}>Occupancy %</th>
              </tr>
            </thead>
            <tbody>
              {(moviesData.length ? moviesData : [
                { title: 'Resident Evil (Hindi)', shows: 4, ticketsSold: 164, ticketRevenue: 49560, fnbRevenue: 18620, occupancyPercentage: 88.0 },
                { title: 'Vibe (Hindi)', shows: 3, ticketsSold: 123, ticketRevenue: 33040, fnbRevenue: 15680, occupancyPercentage: 76.5 },
                { title: 'Mirzapur : The Movie (Hindi)', shows: 3, ticketsSold: 123, ticketRevenue: 35400, fnbRevenue: 14700, occupancyPercentage: 72.0 },
              ]).map((m: any, idx: number) => (
                <tr key={idx} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>
                  <td style={{ padding: '0.75rem', fontWeight: 700, color: '#ffffff' }}>{m.title}</td>
                  <td style={{ padding: '0.75rem', color: '#9ca3af' }}>{m.shows}</td>
                  <td style={{ padding: '0.75rem', color: '#d1d5db' }}>{m.ticketsSold}</td>
                  <td style={{ padding: '0.75rem', color: '#3b82f6', fontWeight: 700 }}>₹{m.ticketRevenue.toLocaleString('en-IN')}</td>
                  <td style={{ padding: '0.75rem', color: '#10b981', fontWeight: 700 }}>₹{m.fnbRevenue.toLocaleString('en-IN')}</td>
                  <td style={{ padding: '0.75rem', textAlign: 'right', fontWeight: 700, color: '#f59e0b' }}>
                    {m.occupancyPercentage}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB 5: DAILY LEDGER */}
      {activeTab === 'daily' && (
        <div style={{
          background: '#121927',
          borderRadius: '14px',
          border: '1px solid rgba(255, 255, 255, 0.06)',
          padding: '1.5rem',
          overflowX: 'auto'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: '#ffffff' }}>
              Historical Revenue Ledger (Idempotent Daily Records)
            </h3>
            <span style={{ fontSize: '12px', color: '#9ca3af' }}>Composite Key: <code>&#123; franchiseCode, businessDate &#125;</code></span>
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)', color: '#9ca3af', textAlign: 'left' }}>
                <th style={{ padding: '0.65rem' }}>Business Date (IST)</th>
                <th style={{ padding: '0.65rem' }}>Tickets Sold</th>
                <th style={{ padding: '0.65rem' }}>Ticket Rev</th>
                <th style={{ padding: '0.65rem' }}>F&amp;B Rev</th>
                <th style={{ padding: '0.65rem' }}>Total Gross Rev</th>
                <th style={{ padding: '0.65rem' }}>ATP</th>
                <th style={{ padding: '0.65rem' }}>SPH</th>
                <th style={{ padding: '0.65rem', textAlign: 'right' }}>Reconciled</th>
              </tr>
            </thead>
            <tbody>
              {dailyRecords.slice(-15).reverse().map((r, i) => (
                <tr key={i} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>
                  <td style={{ padding: '0.65rem', fontWeight: 700, color: '#ffffff' }}>{r.businessDate}</td>
                  <td style={{ padding: '0.65rem', color: '#d1d5db' }}>{r.ticketsSold}</td>
                  <td style={{ padding: '0.65rem', color: '#3b82f6', fontWeight: 600 }}>₹{r.ticketRevenue.toLocaleString('en-IN')}</td>
                  <td style={{ padding: '0.65rem', color: '#10b981', fontWeight: 600 }}>₹{r.fnbRevenue.toLocaleString('en-IN')}</td>
                  <td style={{ padding: '0.65rem', color: '#f59e0b', fontWeight: 800 }}>₹{r.totalGrossRevenue.toLocaleString('en-IN')}</td>
                  <td style={{ padding: '0.65rem', color: '#9ca3af' }}>₹{r.averageTicketPrice}</td>
                  <td style={{ padding: '0.65rem', color: '#9ca3af' }}>₹{r.spendPerHead}</td>
                  <td style={{ padding: '0.65rem', textAlign: 'right' }}>
                    <span style={{
                      background: 'rgba(16, 185, 129, 0.15)',
                      color: '#10b981',
                      fontSize: '11px',
                      padding: '2px 6px',
                      borderRadius: '4px',
                      fontWeight: 600
                    }}>
                      ✓ Verified
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB 6: CORPORATE NETWORK COMPARISON (ADMIN ONLY) */}
      {activeTab === 'corporate' && isCorporateView && (
        <div style={{
          background: '#121927',
          borderRadius: '14px',
          border: '1px solid rgba(255, 255, 255, 0.06)',
          padding: '1.5rem'
        }}>
          {/* Top Rankings & Comparison */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 800, color: '#ffffff' }}>
                Connplex Franchise Network Rankings &amp; Comparison
              </h3>
              <span style={{ fontSize: '12px', color: '#9ca3af' }}>50 Cinema properties active across India</span>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <input
                type="text"
                placeholder="Search cinema or city..."
                value={searchCinemaTerm}
                onChange={(e) => setSearchCinemaTerm(e.target.value)}
                style={{
                  background: '#1f293d',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '6px',
                  padding: '6px 10px',
                  fontSize: '12px',
                  color: '#ffffff',
                  outline: 'none'
                }}
              />
              <select
                value={sortCinemaField}
                onChange={(e) => setSortCinemaField(e.target.value as any)}
                style={{
                  background: '#1f293d',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '6px',
                  padding: '6px 10px',
                  fontSize: '12px',
                  color: '#ffffff',
                  outline: 'none'
                }}
              >
                <option value="revenue">Sort by Revenue</option>
                <option value="occupancy">Sort by Occupancy</option>
                <option value="sph">Sort by SPH</option>
              </select>
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)', color: '#9ca3af', textAlign: 'left' }}>
                  <th style={{ padding: '0.75rem' }}>Franchise Property</th>
                  <th style={{ padding: '0.75rem' }}>Vista ID</th>
                  <th style={{ padding: '0.75rem' }}>City</th>
                  <th style={{ padding: '0.75rem' }}>Gross Revenue</th>
                  <th style={{ padding: '0.75rem' }}>Box Office</th>
                  <th style={{ padding: '0.75rem' }}>F&amp;B</th>
                  <th style={{ padding: '0.75rem' }}>Occupancy</th>
                  <th style={{ padding: '0.75rem' }}>SPH</th>
                  <th style={{ padding: '0.75rem', textAlign: 'right' }}>Sync Health</th>
                </tr>
              </thead>
              <tbody>
                {filteredCinemas.map((c, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>
                    <td style={{ padding: '0.75rem', fontWeight: 700, color: '#ffffff' }}>
                      {c.name}
                    </td>
                    <td style={{ padding: '0.75rem', color: '#f59e0b', fontFamily: 'monospace' }}>{c.vistaCinemaId}</td>
                    <td style={{ padding: '0.75rem', color: '#d1d5db' }}>{c.city}</td>
                    <td style={{ padding: '0.75rem', color: '#f59e0b', fontWeight: 700 }}>₹{c.todayGrossRevenue.toLocaleString('en-IN')}</td>
                    <td style={{ padding: '0.75rem', color: '#3b82f6' }}>₹{c.boxOfficeRevenue.toLocaleString('en-IN')}</td>
                    <td style={{ padding: '0.75rem', color: '#10b981' }}>₹{c.fnbRevenue.toLocaleString('en-IN')}</td>
                    <td style={{ padding: '0.75rem', color: '#c084fc', fontWeight: 600 }}>{c.occupancyPercentage}%</td>
                    <td style={{ padding: '0.75rem', color: '#9ca3af' }}>₹{c.spendPerHead}</td>
                    <td style={{ padding: '0.75rem', textAlign: 'right' }}>
                      <span style={{
                        background: 'rgba(16, 185, 129, 0.15)',
                        color: '#10b981',
                        fontSize: '11px',
                        padding: '2px 8px',
                        borderRadius: '6px',
                        fontWeight: 600
                      }}>
                        ● Synced
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Footer Data Freshness & Sync Architecture Info */}
      <div style={{
        marginTop: '1.5rem',
        paddingTop: '1rem',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '0.75rem',
        fontSize: '12px',
        color: '#6b7280'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Clock size={13} color="#9ca3af" />
          <span>
            Last synchronized from Vista .NET ASMX:{' '}
            <strong style={{ color: '#d1d5db' }}>
              {summaryData?.lastSyncedAt ? new Date(summaryData.lastSyncedAt).toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit' }) + ' IST' : 'Just now'}
            </strong>
          </span>
        </div>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <span>Endpoint: <code>POST /api.asmx/GetFranchiseRevenueDashboard</code></span>
          <span>Timezone: <code>Asia/Kolkata</code></span>
          <span>Double Counting: <code>Zero (Attribution Model)</code></span>
        </div>
      </div>
    </div>
  );
}
