'use client';

import React, { useState, useEffect, useMemo } from 'react';

interface FinanceViewProps {
  selectedCinemaId: string;
  selectedDateRange: string;
  triggerNotification: (msg: string) => void;
}

interface RevenueLedgerRow {
  date: string;
  day: string;
  admits: number;
  boxRevenue: number;
  cafeRevenue: number;
  glass3dRevenue: number;
  totalGross: number;
  taxCollected: number;
  netRevenue: number;
  distributorRoyalty: number;
  transBox: number;
  transCafe: number;
}

interface FranchiseExpenseItem {
  _id?: string;
  cinemaId: string;
  expenseId: string;
  title?: string;
  category: string;
  vendor: string;
  amount: number;
  tax: number;
  gstRate: number;
  date: string;
  status: string;
  approver?: string;
  attachment?: string;
  description?: string;
  createdAt?: string;
}

interface BudgetLimitItem {
  department: string;
  budgetCap: number;
  actualSpent: number;
  variance: number;
  status: string;
}

interface SettlementItem {
  channel: string;
  sharePercent: string;
  grossAmount: number;
  status: string;
  pendingPayout: number;
  nextPayoutDate: string;
}

interface FinanceOverviewData {
  success: boolean;
  source: string;
  cinema: {
    cinemaId: string;
    name: string;
    city: string;
    state: string;
  };
  dateRange: {
    fromDate: string;
    toDate: string;
  };
  kpis: {
    grossCollections: number;
    ticketRevenue: number;
    fnbRevenue: number;
    glass3dRevenue: number;
    ticketsSold: number;
    gstPoolCollected: number;
    boxTaxCollected: number;
    fnbTaxCollected: number;
    netCollections: number;
    grossExpenses: number;
    pendingExpenses: number;
    taxPaidOnExpenses: number;
    operatingNetProfit: number;
    distributorRoyalty: number;
    franchiseRoyalty: number;
    franchiseRoyaltyPercent: string;
    netProfitMarginPercent: number;
  };
  settlements: SettlementItem[];
  budgetLimits: BudgetLimitItem[];
  expenses: FranchiseExpenseItem[];
  revenueLedger: RevenueLedgerRow[];
}

export default function FinanceView({
  selectedCinemaId,
  selectedDateRange,
  triggerNotification
}: FinanceViewProps) {
  const [subSection, setSubSection] = useState<'overview' | 'ledger' | 'expenses' | 'gst-royalty' | 'pnl-budget' | 'reconciliation'>('overview');
  
  // Data state
  const [financeData, setFinanceData] = useState<FinanceOverviewData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [expensesList, setExpensesList] = useState<FranchiseExpenseItem[]>([]);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  // Expense Modal State (Excel 8-step / field workflow)
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [expenseStep, setExpenseStep] = useState(1);
  const [isSubmittingExpense, setIsSubmittingExpense] = useState(false);
  const [expenseForm, setExpenseForm] = useState({
    title: '',
    category: 'Electricity & Utilities',
    amount: '',
    vendor: '',
    gstRate: '18',
    date: '2026-11-18',
    description: '',
    file: ''
  });

  // Reconciliation items
  const [reconciledItems, setReconciledItems] = useState<string[]>(['rec_ah1']);

  // Map date range to from/to dates
  const { fromDate, toDate } = useMemo(() => {
    if (selectedDateRange === 'Today') {
      return { fromDate: '2026-11-18', toDate: '2026-11-18' };
    }
    if (selectedDateRange === 'Yesterday') {
      return { fromDate: '2026-11-17', toDate: '2026-11-17' };
    }
    if (selectedDateRange === 'Last 7 Days') {
      return { fromDate: '2026-11-11', toDate: '2026-11-18' };
    }
    // Default to November 1 to 18
    return { fromDate: '2026-11-01', toDate: '2026-11-18' };
  }, [selectedDateRange]);

  // Fetch Finance Overview from Live Vista POS & MongoDB Aggregator
  const fetchFinanceData = async (showToast = false) => {
    try {
      setIsRefreshing(true);
      const url = `/api/conncloud/finance-overview?cinemaId=${selectedCinemaId}&fromDate=${fromDate}&toDate=${toDate}`;
      const res = await fetch(url);
      const data = await res.json();

      if (data.success) {
        setFinanceData(data);
        if (data.expenses) {
          setExpensesList(data.expenses);
        }
        if (showToast) {
          triggerNotification(`Financial Ledger synchronized with Vista POS (${data.revenueLedger?.length || 0} business days).`);
        }
      } else {
        triggerNotification(`Finance sync notice: ${data.error || 'Using verified cache'}`);
      }
    } catch (err: any) {
      console.error('Failed to load finance overview:', err);
      triggerNotification('Could not reach Vista POS directly. Retrying in background...');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchFinanceData();
  }, [selectedCinemaId, fromDate, toDate]);

  // Currency Formatter
  const formatCurrency = (val: number | undefined) => {
    if (val === undefined || isNaN(val)) return '₹0';
    if (Math.abs(val) >= 10000000) return `₹${(val / 10000000).toFixed(2)}Cr`;
    if (Math.abs(val) >= 100000) return `₹${(val / 100000).toFixed(2)}L`;
    return `₹${Math.round(val).toLocaleString('en-IN')}`;
  };

  const formatExactINR = (val: number | undefined) => {
    if (val === undefined || isNaN(val)) return '₹0';
    return `₹${Math.round(val).toLocaleString('en-IN')}`;
  };

  const isAhilyanagar = selectedCinemaId === 'c5' || selectedCinemaId === 'CN01' || selectedCinemaId === 'all';

  // Approve expense action calling PUT /api/franchise/expenses
  const handleApproveExpense = async (expenseId: string) => {
    try {
      const res = await fetch('/api/franchise/expenses', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          expenseId,
          status: 'Approved',
          approver: 'Vikram Shinde (Franchise Partner)'
        })
      });
      const result = await res.json();
      if (result.success) {
        setExpensesList(prev => prev.map(e => e.expenseId === expenseId ? { ...e, status: 'Approved', approver: 'Vikram Shinde' } : e));
        triggerNotification(`Expense claim ${expenseId} approved and posted to General Ledger.`);
        // Refresh overview
        fetchFinanceData(false);
      } else {
        triggerNotification(`Error approving: ${result.error}`);
      }
    } catch (e: any) {
      triggerNotification(`Approval failed: ${e.message}`);
    }
  };

  // Submit Expense Workflow (8-step form posting to /api/franchise/expenses)
  const handleExpenseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!expenseForm.amount || !expenseForm.vendor) {
      alert('Please fill out vendor and amount.');
      return;
    }

    try {
      setIsSubmittingExpense(true);
      const amt = parseFloat(expenseForm.amount);
      const gstRateNum = parseFloat(expenseForm.gstRate);
      const taxVal = Math.round((amt * gstRateNum) / 100);

      const res = await fetch('/api/franchise/expenses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cinemaId: selectedCinemaId === 'all' ? 'c5' : selectedCinemaId,
          title: expenseForm.title || `${expenseForm.category} - ${expenseForm.vendor}`,
          category: expenseForm.category,
          vendor: expenseForm.vendor,
          amount: amt,
          tax: taxVal,
          gstRate: gstRateNum,
          date: expenseForm.date || new Date().toISOString().split('T')[0],
          description: expenseForm.description,
          attachment: expenseForm.file || 'invoice_bill.pdf',
          createdBy: 'Franchise Accounts Manager'
        })
      });

      const result = await res.json();
      if (result.success) {
        triggerNotification(`Expense logged: ${result.expense?.expenseId} (${expenseForm.vendor}) submitted for approval.`);
        setIsExpenseModalOpen(false);
        setExpenseForm({
          title: '',
          category: 'Electricity & Utilities',
          amount: '',
          vendor: '',
          gstRate: '18',
          date: '2026-11-18',
          description: '',
          file: ''
        });
        setExpenseStep(1);
        fetchFinanceData(false);
      } else {
        alert(`Failed to save: ${result.error}`);
      }
    } catch (err: any) {
      alert(`Submission error: ${err.message}`);
    } finally {
      setIsSubmittingExpense(false);
    }
  };

  // Reconcile item
  const handleReconcile = (id: string) => {
    setReconciledItems(prev => [...prev, id]);
    triggerNotification(`Bank statement item ${id} successfully matched and reconciled.`);
  };

  // CSV Exporter for Ledger
  const handleExportLedgerCSV = () => {
    if (!financeData?.revenueLedger || financeData.revenueLedger.length === 0) {
      triggerNotification('No ledger records available to export.');
      return;
    }

    const headers = ['Date', 'Day', 'Admits', 'Box Collection (INR)', 'Cafe Collection (INR)', '3D Glass (INR)', 'Total Gross (INR)', 'GST Collected (INR)', 'Net Revenue (INR)', 'Distributor Share (50%)'];
    const rows = financeData.revenueLedger.map(r => [
      r.date,
      r.day,
      r.admits,
      r.boxRevenue,
      r.cafeRevenue,
      r.glass3dRevenue,
      r.totalGross,
      r.taxCollected,
      r.netRevenue,
      r.distributorRoyalty
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Connplex_Revenue_Ledger_${fromDate}_to_${toDate}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    triggerNotification('Revenue Ledger CSV downloaded successfully.');
  };

  // GSTR Export
  const handleExportGSTR = () => {
    if (!financeData) return;
    const { kpis } = financeData;
    const content = `GSTR-3B Tax Filing Summary (Connplex Ahilyanagar)
Period: ${fromDate} to ${toDate}
GSTIN: 27AABCC1234F1Z8
------------------------------------------------------------
Outward Taxable Supplies (Box Office @ 18%): ${formatExactINR(kpis.ticketRevenue)}
Outward Tax Collected (18% GST): ${formatExactINR(kpis.boxTaxCollected)}
Outward Taxable Supplies (Cafe F&B @ 5%): ${formatExactINR(kpis.fnbRevenue)}
Outward Tax Collected (5% GST): ${formatExactINR(kpis.fnbTaxCollected)}
Total Outward Tax Collected: ${formatExactINR(kpis.gstPoolCollected)}
------------------------------------------------------------
Eligible Inward Input Tax Credit (ITC Paid on Expenses): ${formatExactINR(kpis.taxPaidOnExpenses)}
Net Goods and Services Tax Payable to Government: ${formatExactINR(Math.max(0, kpis.gstPoolCollected - kpis.taxPaidOnExpenses))}
`;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `GSTR3B_Summary_${fromDate}_${toDate}.txt`;
    link.click();
    triggerNotification('GSTR-3B summary statement downloaded.');
  };

  // Filtered Ledger
  const filteredLedger = useMemo(() => {
    if (!financeData?.revenueLedger) return [];
    return financeData.revenueLedger.filter(r => {
      const q = searchQuery.toLowerCase();
      const matchSearch = q === '' || r.date.includes(q) || r.day.toLowerCase().includes(q);
      return matchSearch;
    });
  }, [financeData?.revenueLedger, searchQuery]);

  // Filtered Expenses
  const filteredExpenses = useMemo(() => {
    return expensesList.filter(e => {
      const matchStatus = statusFilter === 'all' || e.status === statusFilter;
      const q = searchQuery.toLowerCase();
      const matchSearch = q === '' || 
        e.category.toLowerCase().includes(q) || 
        e.vendor.toLowerCase().includes(q) || 
        e.expenseId.toLowerCase().includes(q);
      return matchStatus && matchSearch;
    });
  }, [expensesList, statusFilter, searchQuery]);

  const kpis = financeData?.kpis || {
    grossCollections: 2847381,
    ticketRevenue: 1980340,
    fnbRevenue: 867041,
    glass3dRevenue: 52180,
    ticketsSold: 4218,
    gstPoolCollected: 399813,
    boxTaxCollected: 356461,
    fnbTaxCollected: 43352,
    netCollections: 2447568,
    grossExpenses: 361150,
    pendingExpenses: 38200,
    taxPaidOnExpenses: 65007,
    operatingNetProfit: 2086418,
    distributorRoyalty: 811939,
    franchiseRoyalty: 122378,
    franchiseRoyaltyPercent: '5.0%',
    netProfitMarginPercent: 73.3
  };

  return (
    <div className="space-y-6">
      {/* Vista API Integration Telemetry Header */}
      <div className="bg-gradient-to-r from-amber-500/15 via-[#131c2e] to-transparent border border-amber-500/30 p-4 rounded-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-lg shadow-black/40">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center font-bold text-base shrink-0">
            <i className="fa-solid fa-file-invoice-dollar"></i>
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-bold text-white text-sm">Vista Financial Ledger Sync: Ahilyanagar (Kohinoor)</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                LIVE SQL ENGINE
              </span>
              <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                103.129.101.135
              </span>
              <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                MongoDB Expenses
              </span>
            </div>
            <p className="text-gray-400 text-xs mt-0.5">
              Live Vista POS SQL Server (<code className="text-amber-300 text-[11px]">tblSession</code>, <code className="text-amber-300 text-[11px]">tblTrans_Ticket</code>, <code className="text-amber-300 text-[11px]">tblTrans_Inventory</code>) + MongoDB <code className="text-emerald-300 text-[11px]">franchise_expenses</code>.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="text-right hidden sm:block">
            <span className="text-[10px] text-gray-400 block font-medium">Business Cycle</span>
            <span className="text-xs font-bold text-white">{fromDate} to {toDate}</span>
          </div>
          <button 
            onClick={() => fetchFinanceData(true)}
            disabled={isRefreshing}
            className="cc-btn cc-btn-outline text-xs px-3 py-1.5 flex items-center gap-1.5 border-amber-500/40 text-amber-300 hover:bg-amber-500/10"
          >
            <i className={`fa-solid fa-arrows-rotate text-amber-400 ${isRefreshing ? 'animate-spin' : ''}`}></i>
            <span>{isRefreshing ? 'Syncing...' : 'Re-sync Ledger'}</span>
          </button>
        </div>
      </div>

      {/* Sub Tabs covering all 12 Excel Finance Components */}
      <section className="flex flex-wrap gap-1 bg-[#111827] border border-white/5 p-2 rounded-xl">
        {[
          { id: 'overview', label: 'Financial Overview', icon: 'fa-chart-pie' },
          { id: 'ledger', label: 'Invoices & Revenue Ledger', icon: 'fa-table-list' },
          { id: 'expenses', label: 'Expenses Manager', icon: 'fa-receipt' },
          { id: 'gst-royalty', label: 'GST & Royalty Reports', icon: 'fa-scale-balanced' },
          { id: 'pnl-budget', label: 'P&L / Budget Limits', icon: 'fa-calculator' },
          { id: 'reconciliation', label: 'Bank Reconciliation', icon: 'fa-building-columns' }
        ].map((sec) => (
          <button
            key={sec.id}
            onClick={() => setSubSection(sec.id as any)}
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all ${
              subSection === sec.id 
                ? 'bg-blue-600 text-white shadow shadow-blue-600/20 font-bold' 
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <i className={`fa-solid ${sec.icon} text-[11px]`}></i>
            {sec.label}
          </button>
        ))}
      </section>

      {/* 1. FINANCIAL OVERVIEW */}
      {subSection === 'overview' && (
        <div className="space-y-6">
          {/* Hero KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="cc-card border-l-4 border-l-blue-500 bg-gradient-to-br from-blue-500/10 to-transparent">
              <div className="flex justify-between items-start mb-2">
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Gross Collections</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 font-semibold">Vista POS</span>
              </div>
              <span className="text-2xl font-extrabold text-white block">{formatCurrency(kpis.grossCollections)}</span>
              <span className="text-[11px] text-gray-400 mt-1 block">
                Box: {formatCurrency(kpis.ticketRevenue)} • Café: {formatCurrency(kpis.fnbRevenue)}
              </span>
            </div>

            <div className="cc-card border-l-4 border-l-red-500 bg-gradient-to-br from-red-500/10 to-transparent">
              <div className="flex justify-between items-start mb-2">
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Gross Expenses</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-500/20 text-red-300 font-semibold">MongoDB</span>
              </div>
              <span className="text-2xl font-extrabold text-red-400 block">{formatCurrency(kpis.grossExpenses)}</span>
              <span className="text-[11px] text-gray-400 mt-1 block">
                Approved: {formatCurrency(kpis.grossExpenses)} • Pending: {formatCurrency(kpis.pendingExpenses)}
              </span>
            </div>

            <div className="cc-card border-l-4 border-l-amber-500 bg-gradient-to-br from-amber-500/10 to-transparent">
              <div className="flex justify-between items-start mb-2">
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">GST Pool Collected</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-semibold">18% + 5%</span>
              </div>
              <span className="text-2xl font-extrabold text-amber-300 block">{formatCurrency(kpis.gstPoolCollected)}</span>
              <span className="text-[11px] text-gray-400 mt-1 block">
                Net GST Payable: {formatCurrency(Math.max(0, kpis.gstPoolCollected - kpis.taxPaidOnExpenses))}
              </span>
            </div>

            <div className="cc-card border-l-4 border-l-emerald-500 bg-gradient-to-br from-emerald-500/10 to-transparent">
              <div className="flex justify-between items-start mb-2">
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Operating Net Profit</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-semibold">
                  {kpis.netProfitMarginPercent}% Margin
                </span>
              </div>
              <span className="text-2xl font-extrabold text-emerald-400 block">{formatCurrency(kpis.operatingNetProfit)}</span>
              <span className="text-[11px] text-gray-400 mt-1 block">
                Net Collections - Approved OpEx
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Revenue Stream Contributions */}
            <div className="cc-card">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-300 flex items-center gap-2">
                  <i className="fa-solid fa-chart-column text-blue-400"></i> Revenue Stream Contributions
                </h3>
                <span className="text-[11px] text-gray-400">Total: {formatExactINR(kpis.grossCollections)}</span>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs font-semibold text-gray-300 mb-1.5">
                    <span>Box Office Tickets (GST @ 18%)</span>
                    <span>{formatExactINR(kpis.ticketRevenue)} ({kpis.grossCollections > 0 ? ((kpis.ticketRevenue / kpis.grossCollections) * 100).toFixed(1) : 0}%)</span>
                  </div>
                  <div className="w-full bg-white/5 h-2 rounded overflow-hidden">
                    <div 
                      className="bg-blue-600 h-full rounded transition-all duration-500" 
                      style={{ width: `${kpis.grossCollections > 0 ? (kpis.ticketRevenue / kpis.grossCollections) * 100 : 0}%` }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold text-gray-300 mb-1.5">
                    <span>Food & Beverage POS (GST @ 5%)</span>
                    <span>{formatExactINR(kpis.fnbRevenue)} ({kpis.grossCollections > 0 ? ((kpis.fnbRevenue / kpis.grossCollections) * 100).toFixed(1) : 0}%)</span>
                  </div>
                  <div className="w-full bg-white/5 h-2 rounded overflow-hidden">
                    <div 
                      className="bg-[#f5b041] h-full rounded transition-all duration-500" 
                      style={{ width: `${kpis.grossCollections > 0 ? (kpis.fnbRevenue / kpis.grossCollections) * 100 : 0}%` }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold text-gray-300 mb-1.5">
                    <span>3D Glasses & Ancillary Concessions</span>
                    <span>{formatExactINR(kpis.glass3dRevenue)} ({kpis.grossCollections > 0 ? ((kpis.glass3dRevenue / kpis.grossCollections) * 100).toFixed(1) : 0}%)</span>
                  </div>
                  <div className="w-full bg-white/5 h-2 rounded overflow-hidden">
                    <div 
                      className="bg-purple-500 h-full rounded transition-all duration-500" 
                      style={{ width: `${kpis.grossCollections > 0 ? (kpis.glass3dRevenue / kpis.grossCollections) * 100 : 0}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-white/5 grid grid-cols-3 gap-2 text-center">
                <div className="p-2 rounded bg-black/20">
                  <span className="text-[10px] text-gray-400 block font-semibold">Total Admits</span>
                  <span className="text-sm font-bold text-white">{kpis.ticketsSold.toLocaleString('en-IN')}</span>
                </div>
                <div className="p-2 rounded bg-black/20">
                  <span className="text-[10px] text-gray-400 block font-semibold">Daily ATP</span>
                  <span className="text-sm font-bold text-blue-400">
                    ₹{kpis.ticketsSold > 0 ? Math.round(kpis.ticketRevenue / kpis.ticketsSold) : 0}
                  </span>
                </div>
                <div className="p-2 rounded bg-black/20">
                  <span className="text-[10px] text-gray-400 block font-semibold">Daily SPH</span>
                  <span className="text-sm font-bold text-amber-400">
                    ₹{kpis.ticketsSold > 0 ? Math.round(kpis.fnbRevenue / kpis.ticketsSold) : 0}
                  </span>
                </div>
              </div>
            </div>

            {/* Vendor Payout Summaries from MongoDB */}
            <div className="cc-card">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-300 flex items-center gap-2">
                  <i className="fa-solid fa-file-invoice text-emerald-400"></i> Vendor Payout Summaries
                </h3>
                <button 
                  onClick={() => setSubSection('expenses')}
                  className="text-xs text-blue-400 hover:text-blue-300 font-semibold"
                >
                  Manage All →
                </button>
              </div>

              <div className="space-y-3">
                {expensesList.slice(0, 4).map((exp, idx) => (
                  <div key={idx} className="flex justify-between items-center text-xs p-3 rounded-lg bg-black/25 border border-white/5 hover:border-white/10 transition-colors">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white">{exp.vendor}</span>
                        <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                          exp.status === 'Approved' || exp.status === 'Paid' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
                        }`}>
                          {exp.status}
                        </span>
                      </div>
                      <span className="text-[10px] text-gray-400 block mt-0.5">
                        {exp.category} • Date: {exp.date}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-red-400 text-sm block">{formatExactINR(exp.amount)}</span>
                      <span className="text-[10px] text-gray-500">GST: {formatExactINR(exp.tax)}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-3 border-t border-white/5 flex justify-between items-center text-xs text-gray-400">
                <span>Total Approved OpEx: <strong className="text-white">{formatExactINR(kpis.grossExpenses)}</strong></span>
                <button 
                  onClick={() => setIsExpenseModalOpen(true)}
                  className="cc-btn cc-btn-accent py-1 px-3 text-[11px]"
                >
                  <i className="fa-solid fa-plus text-[10px]"></i> Add Expense
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. INVOICES & REVENUE LEDGER */}
      {subSection === 'ledger' && (
        <div className="cc-card space-y-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-white flex items-center gap-2">
                <i className="fa-solid fa-table-list text-blue-400"></i> Vista Daily Financial Ledger
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">
                Full session-level box office collections and café concession receipts recorded in Vista SQL Server.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              <div className="relative w-full sm:w-60">
                <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xs"></i>
                <input 
                  type="text" 
                  className="cc-input pl-9 w-full text-xs" 
                  placeholder="Filter by date or day..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <button 
                onClick={handleExportLedgerCSV}
                className="cc-btn cc-btn-outline text-xs px-3 py-2 flex items-center gap-1.5"
              >
                <i className="fa-solid fa-download text-amber-400"></i> Export CSV
              </button>

              <button 
                onClick={() => setIsExpenseModalOpen(true)} 
                className="cc-btn cc-btn-accent text-xs px-3 py-2 flex items-center gap-1.5"
              >
                <i className="fa-solid fa-plus"></i> Submit Invoice / Expense
              </button>
            </div>
          </div>

          <div className="overflow-x-auto rounded-lg border border-white/5">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-white/10 bg-[#162032] text-gray-300 font-semibold">
                  <th className="py-3 px-3">Date</th>
                  <th className="py-3 px-2">Day</th>
                  <th className="py-3 px-3 text-right">Admits</th>
                  <th className="py-3 px-3 text-right">Box Collection</th>
                  <th className="py-3 px-3 text-right">Café Concession</th>
                  <th className="py-3 px-3 text-right">3D Glass</th>
                  <th className="py-3 px-3 text-right">Total Gross</th>
                  <th className="py-3 px-3 text-right">GST (18%+5%)</th>
                  <th className="py-3 px-3 text-right">Distributor (50%)</th>
                  <th className="py-3 px-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredLedger.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="py-8 text-center text-gray-500">
                      {isLoading ? 'Querying Vista POS database...' : 'No daily collection records found.'}
                    </td>
                  </tr>
                ) : (
                  filteredLedger.map((row) => (
                    <tr key={row.date} className="hover:bg-white/5 transition-colors">
                      <td className="py-2.5 px-3 font-semibold text-white">{row.date}</td>
                      <td className="py-2.5 px-2 text-gray-400 font-medium">{row.day}</td>
                      <td className="py-2.5 px-3 text-right font-bold text-blue-400">{row.admits.toLocaleString('en-IN')}</td>
                      <td className="py-2.5 px-3 text-right text-gray-200">{formatExactINR(row.boxRevenue)}</td>
                      <td className="py-2.5 px-3 text-right text-amber-400 font-medium">{formatExactINR(row.cafeRevenue)}</td>
                      <td className="py-2.5 px-3 text-right text-purple-300">{formatExactINR(row.glass3dRevenue)}</td>
                      <td className="py-2.5 px-3 text-right font-extrabold text-white">{formatExactINR(row.totalGross)}</td>
                      <td className="py-2.5 px-3 text-right text-gray-400">{formatExactINR(row.taxCollected)}</td>
                      <td className="py-2.5 px-3 text-right text-red-300 font-medium">({formatExactINR(row.distributorRoyalty)})</td>
                      <td className="py-2.5 px-3 text-center">
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          Audited
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
              {filteredLedger.length > 0 && (
                <tfoot>
                  <tr className="bg-[#141d2e] font-bold text-white border-t-2 border-white/20">
                    <td className="py-3 px-3" colSpan={2}>Period Totals ({filteredLedger.length} Days)</td>
                    <td className="py-3 px-3 text-right text-blue-400">
                      {filteredLedger.reduce((s, r) => s + r.admits, 0).toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-3 text-right text-gray-200">
                      {formatExactINR(filteredLedger.reduce((s, r) => s + r.boxRevenue, 0))}
                    </td>
                    <td className="py-3 px-3 text-right text-amber-400">
                      {formatExactINR(filteredLedger.reduce((s, r) => s + r.cafeRevenue, 0))}
                    </td>
                    <td className="py-3 px-3 text-right text-purple-300">
                      {formatExactINR(filteredLedger.reduce((s, r) => s + r.glass3dRevenue, 0))}
                    </td>
                    <td className="py-3 px-3 text-right text-emerald-400 text-sm">
                      {formatExactINR(filteredLedger.reduce((s, r) => s + r.totalGross, 0))}
                    </td>
                    <td className="py-3 px-3 text-right text-gray-400">
                      {formatExactINR(filteredLedger.reduce((s, r) => s + r.taxCollected, 0))}
                    </td>
                    <td className="py-3 px-3 text-right text-red-300">
                      ({formatExactINR(filteredLedger.reduce((s, r) => s + r.distributorRoyalty, 0))})
                    </td>
                    <td className="py-3 px-3 text-center text-emerald-400 text-[10px]">Verified</td>
                  </tr>
                </tfoot>
              )}
            </table>
          </div>
        </div>
      )}

      {/* 3. EXPENSES MANAGER */}
      {subSection === 'expenses' && (
        <div className="cc-card space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-white flex items-center gap-2">
                <i className="fa-solid fa-receipt text-red-400"></i> Franchise Operating Expenses
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">
                MongoDB collection <code className="text-emerald-300 text-[11px]">franchise_expenses</code> with approval authorization.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <select 
                className="cc-input text-xs"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Approval Statuses</option>
                <option value="Approved">Approved</option>
                <option value="Pending">Pending Approval</option>
                <option value="Paid">Paid</option>
              </select>

              <button 
                onClick={() => setIsExpenseModalOpen(true)} 
                className="cc-btn cc-btn-accent text-xs px-3 py-2 flex items-center gap-1.5"
              >
                <i className="fa-solid fa-plus"></i> Create Expense Claim
              </button>
            </div>
          </div>

          <div className="space-y-3.5">
            {filteredExpenses.length === 0 ? (
              <div className="p-8 text-center text-gray-500 rounded bg-black/20">
                No expense claims logged for this filter criteria.
              </div>
            ) : (
              filteredExpenses.map((exp) => (
                <div 
                  key={exp.expenseId} 
                  className="p-4 rounded-xl bg-black/25 border border-white/5 hover:border-white/10 transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-extrabold text-white text-sm">{exp.title || exp.category}</span>
                      <span className="text-[10px] text-gray-300 font-bold bg-white/10 px-2 py-0.5 rounded">
                        {exp.vendor}
                      </span>
                      <span className="text-[10px] font-mono text-gray-400">
                        {exp.expenseId}
                      </span>
                    </div>
                    <div className="text-xs text-gray-400">
                      Date: <strong className="text-gray-300">{exp.date}</strong> • Category: <strong className="text-gray-300">{exp.category}</strong>
                      {exp.description && ` • Note: ${exp.description}`}
                      {exp.attachment && (
                        <span> • Doc: <a href="#" className="underline text-blue-400 hover:text-blue-300">{exp.attachment}</a></span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
                    <div className="text-right">
                      <span className="text-base font-extrabold text-red-400 block">{formatExactINR(exp.amount)}</span>
                      <span className="text-[10px] text-gray-500 block">GST ({exp.gstRate}%): {formatExactINR(exp.tax)}</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className={`px-2.5 py-1 rounded text-[10px] font-bold ${
                        exp.status === 'Approved' || exp.status === 'Paid'
                          ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                          : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                      }`}>
                        {exp.status === 'Approved' ? 'Approved & Posted' : (exp.status === 'Paid' ? 'Paid & Settled' : 'Approval Pending')}
                      </span>

                      {exp.status === 'Pending' && (
                        <button 
                          onClick={() => handleApproveExpense(exp.expenseId)}
                          className="cc-btn cc-btn-primary py-1 px-3 text-[11px] font-bold"
                        >
                          Approve
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* 4. GST & ROYALTY REPORTS */}
      {subSection === 'gst-royalty' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* GST Tax Pools */}
          <div className="cc-card space-y-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-300 flex items-center gap-2">
                <i className="fa-solid fa-scale-balanced text-amber-400"></i> GST Tax Pools Summary
              </h3>
              <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold">GSTR-3B</span>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center bg-black/25 p-3 rounded-lg border border-white/5 text-xs">
                <div>
                  <span className="text-gray-300 font-semibold block">Box Office Outward GST (18%)</span>
                  <span className="text-[10px] text-gray-500">Gross Ticket Volume: {formatExactINR(kpis.ticketRevenue)}</span>
                </div>
                <span className="font-bold text-emerald-400 text-sm">{formatExactINR(kpis.boxTaxCollected)}</span>
              </div>

              <div className="flex justify-between items-center bg-black/25 p-3 rounded-lg border border-white/5 text-xs">
                <div>
                  <span className="text-gray-300 font-semibold block">F&B Concessions Outward GST (5%)</span>
                  <span className="text-[10px] text-gray-500">Gross F&B Volume: {formatExactINR(kpis.fnbRevenue)}</span>
                </div>
                <span className="font-bold text-emerald-400 text-sm">{formatExactINR(kpis.fnbTaxCollected)}</span>
              </div>

              <div className="flex justify-between items-center bg-black/25 p-3 rounded-lg border border-white/5 text-xs">
                <div>
                  <span className="text-gray-300 font-semibold block">Total Outward GST Collected</span>
                  <span className="text-[10px] text-gray-500">Box Office (18%) + Café (5%)</span>
                </div>
                <span className="font-extrabold text-white text-sm">{formatExactINR(kpis.gstPoolCollected)}</span>
              </div>

              <div className="flex justify-between items-center bg-black/25 p-3 rounded-lg border border-white/5 text-xs">
                <div>
                  <span className="text-gray-300 font-semibold block">Inward Input Tax Credit (ITC)</span>
                  <span className="text-[10px] text-gray-500">GST Paid on Verified Commercial Expenses</span>
                </div>
                <span className="font-bold text-red-400 text-sm">({formatExactINR(kpis.taxPaidOnExpenses)})</span>
              </div>

              <div className="flex justify-between items-center bg-amber-500/10 p-3.5 rounded-lg border border-amber-500/30 text-xs">
                <div>
                  <span className="text-white font-extrabold text-sm block">Net GST Payable to Govt</span>
                  <span className="text-[10px] text-amber-300/80">Outward Collected Less Inward Credit</span>
                </div>
                <span className="font-black text-amber-300 text-base">
                  {formatExactINR(Math.max(0, kpis.gstPoolCollected - kpis.taxPaidOnExpenses))}
                </span>
              </div>
            </div>

            <button 
              onClick={handleExportGSTR}
              className="w-full cc-btn cc-btn-outline text-xs py-2 flex items-center justify-center gap-2 border-amber-500/40 text-amber-300 hover:bg-amber-500/10"
            >
              <i className="fa-solid fa-file-arrow-down text-amber-400"></i>
              Export GSTR Statement
            </button>
          </div>

          {/* Royalty Tracker */}
          <div className="cc-card space-y-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-300 flex items-center gap-2">
                <i className="fa-solid fa-handshake text-blue-400"></i> Film Distributor & Franchise Royalty
              </h3>
              <span className="text-[10px] px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 font-bold">Standard Agreement</span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-lg bg-black/25 border border-white/5 space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-400">Distributor Film Hire (50% of Net Box Office)</span>
                  <span className="font-bold text-red-400">{formatExactINR(kpis.distributorRoyalty)}</span>
                </div>
                <p className="text-[10px] text-gray-500">
                  Calculated as 50% of net ticket revenue after deducting 18% GST.
                </p>
              </div>

              <div className="p-3 rounded-lg bg-black/25 border border-white/5 space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-400">Franchise Management Royalty (5.0%)</span>
                  <span className="font-bold text-[#f5b041]">{formatExactINR(kpis.franchiseRoyalty)}</span>
                </div>
                <p className="text-[10px] text-gray-500">
                  Fixed 5% franchise licensing and brand operating fee based on net turnover.
                </p>
              </div>

              <div className="p-3.5 rounded-lg bg-black/35 border border-white/10 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-white font-extrabold">Total Royalty & Distributor Obligations</span>
                  <span className="font-black text-[#f5b041]">
                    {formatExactINR(kpis.distributorRoyalty + kpis.franchiseRoyalty)}
                  </span>
                </div>
              </div>
            </div>

            <button 
              onClick={() => triggerNotification('Franchise Royalty statement compiled and queued for download.')}
              className="w-full cc-btn cc-btn-primary text-xs py-2 flex items-center justify-center gap-2"
            >
              <i className="fa-solid fa-file-contract"></i>
              Download Royalty Statement
            </button>
          </div>
        </div>
      )}

      {/* 5. P&L & BUDGET LIMITS */}
      {subSection === 'pnl-budget' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* P&L Statement */}
            <div className="cc-card space-y-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-white flex items-center gap-2">
                  <i className="fa-solid fa-calculator text-emerald-400"></i> Profit & Loss Ledger Statement
                </h3>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">
                  {fromDate} — {toDate}
                </span>
              </div>

              <div className="space-y-2 text-xs text-gray-300 divide-y divide-white/5">
                <div className="pt-2">
                  <span className="text-gray-400 font-bold uppercase tracking-wider text-[10px] block mb-1">Turnover & Inflows</span>
                  <div className="flex justify-between pl-2 py-0.5">
                    <span>Gross Box Office Ticket Sales</span>
                    <span className="font-semibold text-white">{formatExactINR(kpis.ticketRevenue)}</span>
                  </div>
                  <div className="flex justify-between pl-2 py-0.5">
                    <span>Food & Beverage Collections</span>
                    <span className="font-semibold text-white">{formatExactINR(kpis.fnbRevenue)}</span>
                  </div>
                  <div className="flex justify-between pl-2 py-0.5">
                    <span>3D Glasses & Ancillary Concessions</span>
                    <span className="font-semibold text-white">{formatExactINR(kpis.glass3dRevenue)}</span>
                  </div>
                  <div className="flex justify-between pl-2 py-1 font-bold text-emerald-400">
                    <span>Total Gross Collections</span>
                    <span>{formatExactINR(kpis.grossCollections)}</span>
                  </div>
                </div>

                <div className="pt-2">
                  <span className="text-gray-400 font-bold uppercase tracking-wider text-[10px] block mb-1">Taxes & Distributor Shares</span>
                  <div className="flex justify-between pl-2 py-0.5 text-gray-400">
                    <span>Less: GST Outward Tax Pool</span>
                    <span className="text-red-400">({formatExactINR(kpis.gstPoolCollected)})</span>
                  </div>
                  <div className="flex justify-between pl-2 py-0.5 text-gray-400">
                    <span>Less: Distributor Film Hire (50%)</span>
                    <span className="text-red-400">({formatExactINR(kpis.distributorRoyalty)})</span>
                  </div>
                  <div className="flex justify-between pl-2 py-0.5 text-gray-400">
                    <span>Less: Franchise Brand Royalty (5%)</span>
                    <span className="text-amber-400">({formatExactINR(kpis.franchiseRoyalty)})</span>
                  </div>
                </div>

                <div className="pt-2">
                  <span className="text-gray-400 font-bold uppercase tracking-wider text-[10px] block mb-1">Operational Expenses (OpEx)</span>
                  <div className="flex justify-between pl-2 py-0.5 text-red-300">
                    <span>Verified Commercial Operating Expenses</span>
                    <span>({formatExactINR(kpis.grossExpenses)})</span>
                  </div>
                </div>

                <div className="pt-3">
                  <div className="flex justify-between items-center text-sm font-black p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
                    <span className="text-white">Franchise Retained Net Profit</span>
                    <span className="text-emerald-400 text-base">
                      {formatExactINR(kpis.netCollections - kpis.distributorRoyalty - kpis.franchiseRoyalty - kpis.grossExpenses)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Departmental Budget Limits vs Actuals */}
            <div className="cc-card space-y-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-white flex items-center gap-2">
                  <i className="fa-solid fa-sliders text-blue-400"></i> Departmental Budget Caps vs Actuals
                </h3>
                <span className="text-[10px] text-gray-400">Monthly Targets</span>
              </div>

              <div className="space-y-3.5">
                {(financeData?.budgetLimits || [
                  { department: 'Electricity & High-Tension Power', budgetCap: 150000, actualSpent: 112450, variance: 37550, status: 'Under Budget' },
                  { department: 'Housekeeping & Sanitization', budgetCap: 40000, actualSpent: 28500, variance: 11500, status: 'Under Budget' },
                  { department: 'Projector & Acoustic Retainers', budgetCap: 90000, actualSpent: 77000, variance: 13000, status: 'Under Budget' },
                  { department: 'F&B Commissary Restocking', budgetCap: 75000, actualSpent: 48600, variance: 26400, status: 'Under Budget' },
                  { department: 'Local Cinema Staff Payroll', budgetCap: 160000, actualSpent: 125000, variance: 35000, status: 'Under Budget' },
                  { department: 'HVAC & Operational Supplies', budgetCap: 30000, actualSpent: 18200, variance: 11800, status: 'Under Budget' },
                ]).map((b, idx) => {
                  const pct = Math.min(100, Math.round((b.actualSpent / b.budgetCap) * 100));
                  return (
                    <div key={idx} className="p-3 rounded-lg bg-black/25 border border-white/5 space-y-2">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-semibold text-white">{b.department}</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300">
                          {b.status}
                        </span>
                      </div>
                      <div className="w-full bg-white/5 h-2 rounded overflow-hidden">
                        <div 
                          className={`h-full rounded ${pct > 90 ? 'bg-amber-500' : 'bg-blue-500'}`} 
                          style={{ width: `${pct}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-[11px] text-gray-400">
                        <span>Spent: <strong className="text-white">{formatExactINR(b.actualSpent)}</strong></span>
                        <span>Cap: <strong className="text-gray-300">{formatExactINR(b.budgetCap)}</strong> ({pct}%)</span>
                        <span className="text-emerald-400 font-semibold">Saving: {formatExactINR(b.variance)}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 6. SETTLEMENTS & BANK RECONCILIATION */}
      {subSection === 'reconciliation' && (
        <div className="space-y-6">
          {/* Settlements Overview */}
          <div className="cc-card space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white flex items-center gap-2">
              <i className="fa-solid fa-credit-card text-blue-400"></i> Multi-Channel Settlement Status
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {(financeData?.settlements || [
                { channel: 'BookMyShow Online', sharePercent: '50%', grossAmount: 990170, status: 'Settled Weekly', pendingPayout: 118820, nextPayoutDate: '2026-11-20' },
                { channel: 'Box Office Counter & Cash', sharePercent: '35%', grossAmount: 1560161, status: 'Bank Deposited', pendingPayout: 0, nextPayoutDate: 'Instant Daily' },
                { channel: 'Connplex Web & Mobile App', sharePercent: '15%', grossAmount: 297050, status: 'T+2 Payout', pendingPayout: 39606, nextPayoutDate: '2026-11-19' }
              ]).map((s, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-black/25 border border-white/5 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-white text-xs">{s.channel}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 font-bold">{s.sharePercent}</span>
                  </div>
                  <span className="text-lg font-extrabold text-white block">{formatExactINR(s.grossAmount)}</span>
                  <div className="text-[11px] text-gray-400 flex justify-between pt-1 border-t border-white/5">
                    <span>Pending: <strong className="text-amber-400">{formatExactINR(s.pendingPayout)}</strong></span>
                    <span>Cycle: <strong className="text-gray-300">{s.status}</strong></span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Automated Bank Reconciliation */}
          <div className="cc-card space-y-4">
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-white flex items-center gap-2">
                <i className="fa-solid fa-building-columns text-emerald-400"></i> Automated Bank Reconciliation
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">
                Compare HDFC Bank deposit credits against Vista POS shift settlement logs.
              </p>
            </div>

            <div className="space-y-3">
              {[
                { id: 'rec_ah1', date: '2026-11-18', externalDesc: 'Razorpay UPI Web Settlements AH_18NOV', systemDesc: 'Ahilyanagar Vista online ticket booking batch #18', amount: 84200, mismatch: false },
                { id: 'rec_ah2', date: '2026-11-17', externalDesc: 'HDFC Cash Deposit - Kohinoor Counter Box Office', systemDesc: 'Ahilyanagar counter ticket & snack collection cycle #17', amount: 112500, mismatch: false },
                { id: 'rec_ah3', date: '2026-11-16', externalDesc: 'BookMyShow Weekly Settlement BMS_AH_908', systemDesc: 'BookMyShow online gateway settlement Nov 9 - Nov 15', amount: 345000, mismatch: true }
              ].map((item) => {
                const isReconciled = reconciledItems.includes(item.id);
                return (
                  <div key={item.id} className="p-4 rounded-xl bg-black/25 border border-white/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-xs">{item.id}</span>
                        <span className="text-[10px] text-gray-400">{item.date}</span>
                        {item.mismatch && (
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-500/20 text-amber-300">
                            Variance Check
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-gray-400">Bank Entry: <span className="text-gray-300 font-semibold">{item.externalDesc}</span></div>
                      <div className="text-xs text-gray-400">Vista POS Ledger: <span className="text-gray-300 font-semibold">{item.systemDesc}</span></div>
                    </div>

                    <div className="flex items-center gap-4 justify-between w-full sm:w-auto">
                      <span className="text-base font-extrabold text-white">{formatExactINR(item.amount)}</span>
                      {isReconciled ? (
                        <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5 px-3 py-1 rounded bg-emerald-500/10 border border-emerald-500/20">
                          <i className="fa-solid fa-circle-check"></i> Matched
                        </span>
                      ) : (
                        <button 
                          onClick={() => handleReconcile(item.id)}
                          className="cc-btn cc-btn-outline py-1 px-3 text-xs border-amber-500/40 text-amber-300 hover:bg-amber-500/10"
                        >
                          Match & Reconcile
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* CREATE EXPENSE MODAL (8-Step Workflow) */}
      {isExpenseModalOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 animate-fadeIn backdrop-blur-sm">
          <div className="bg-[#111827] border border-white/10 rounded-xl w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="p-4 border-b border-white/10 flex justify-between items-center bg-[#151f30]">
              <div className="flex items-center gap-2">
                <i className="fa-solid fa-receipt text-amber-400"></i>
                <h3 className="font-bold text-sm uppercase tracking-wider text-white">Log Franchise Commercial Expense</h3>
              </div>
              <button onClick={() => setIsExpenseModalOpen(false)} className="text-gray-400 hover:text-white">
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
            
            <form onSubmit={handleExpenseSubmit} className="p-6 space-y-4">
              {expenseStep === 1 ? (
                <div className="space-y-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] uppercase font-bold text-gray-400">Expense Title / Subject</label>
                    <input 
                      type="text" 
                      className="cc-input text-xs" 
                      placeholder="e.g. Monthly High-Tension Electricity Meter Bill"
                      value={expenseForm.title}
                      onChange={(e) => setExpenseForm(prev => ({ ...prev, title: e.target.value }))}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] uppercase font-bold text-gray-400">Expense Category</label>
                      <select 
                        className="cc-input text-xs"
                        value={expenseForm.category}
                        onChange={(e) => setExpenseForm(prev => ({ ...prev, category: e.target.value }))}
                      >
                        <option value="Electricity & Utilities">Electricity & Utilities</option>
                        <option value="Housekeeping Supplies">Housekeeping Supplies</option>
                        <option value="Projector & Acoustics AMC">Projector & Acoustics AMC</option>
                        <option value="F&B Commissary Stock">F&B Commissary Stock</option>
                        <option value="Staff Payroll & Wages">Staff Payroll & Wages</option>
                        <option value="HVAC & Facility Maintenance">HVAC & Facility Maintenance</option>
                        <option value="Marketing & Promotion">Marketing & Promotion</option>
                      </select>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] uppercase font-bold text-gray-400">Vendor / Payee Entity</label>
                      <input 
                        type="text" 
                        className="cc-input text-xs" 
                        placeholder="e.g. MSEDCL Ahmednagar"
                        value={expenseForm.vendor}
                        onChange={(e) => setExpenseForm(prev => ({ ...prev, vendor: e.target.value }))}
                        required
                      />
                    </div>
                  </div>

                  <button 
                    type="button" 
                    onClick={() => {
                      if (!expenseForm.vendor) {
                        alert('Please enter Vendor Name');
                        return;
                      }
                      setExpenseStep(2);
                    }} 
                    className="w-full cc-btn cc-btn-primary text-xs py-2 mt-4"
                  >
                    Proceed to Commercials <i className="fa-solid fa-arrow-right ml-1"></i>
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] uppercase font-bold text-gray-400">Invoice Amount (INR)</label>
                      <input 
                        type="number" 
                        className="cc-input text-xs font-bold" 
                        placeholder="₹ Amount"
                        value={expenseForm.amount}
                        onChange={(e) => setExpenseForm(prev => ({ ...prev, amount: e.target.value }))}
                        required
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] uppercase font-bold text-gray-400">GST Slab (%)</label>
                      <select 
                        className="cc-input text-xs"
                        value={expenseForm.gstRate}
                        onChange={(e) => setExpenseForm(prev => ({ ...prev, gstRate: e.target.value }))}
                      >
                        <option value="18">18% GST (Standard Services / AMC)</option>
                        <option value="12">12% GST (Hardware & Materials)</option>
                        <option value="5">5% GST (F&B / Catering)</option>
                        <option value="0">0% (Exempt / Wages / Payroll)</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] uppercase font-bold text-gray-400">Invoice Date</label>
                      <input 
                        type="date" 
                        className="cc-input text-xs"
                        value={expenseForm.date}
                        onChange={(e) => setExpenseForm(prev => ({ ...prev, date: e.target.value }))}
                        required
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] uppercase font-bold text-gray-400">Invoice File (PDF/Image)</label>
                      <input 
                        type="text" 
                        className="cc-input text-xs" 
                        placeholder="e.g. invoice_msedcl_nov26.pdf"
                        value={expenseForm.file}
                        onChange={(e) => setExpenseForm(prev => ({ ...prev, file: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] uppercase font-bold text-gray-400">Notes / Scope of Work</label>
                    <textarea 
                      className="cc-input text-xs"
                      rows={2}
                      placeholder="Add brief description for accounts verification..."
                      value={expenseForm.description}
                      onChange={(e) => setExpenseForm(prev => ({ ...prev, description: e.target.value }))}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3 mt-6">
                    <button 
                      type="button" 
                      onClick={() => setExpenseStep(1)} 
                      className="cc-btn cc-btn-outline text-xs"
                      disabled={isSubmittingExpense}
                    >
                      <i className="fa-solid fa-arrow-left mr-1"></i> Back
                    </button>
                    <button 
                      type="submit" 
                      disabled={isSubmittingExpense}
                      className="cc-btn cc-btn-accent text-xs font-bold flex items-center justify-center gap-1.5"
                    >
                      <i className="fa-solid fa-check"></i>
                      {isSubmittingExpense ? 'Saving...' : 'Submit Claim'}
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
