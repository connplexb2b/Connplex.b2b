import React, { useState } from 'react';
import { ConnCloudStore, FinanceTransaction } from '../../../lib/conncloudData';

interface FinanceViewProps {
  selectedCinemaId: string;
  selectedDateRange: string;
  triggerNotification: (msg: string) => void;
}

export default function FinanceView({
  selectedCinemaId,
  selectedDateRange,
  triggerNotification
}: FinanceViewProps) {
  const [subSection, setSubSection] = useState<'overview' | 'ledger' | 'expenses' | 'gst-royalty' | 'pnl-budget' | 'reconciliation'>('overview');
  
  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  // Expense Modal State
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [expenseStep, setExpenseStep] = useState(1);
  const [expenseForm, setExpenseForm] = useState({
    category: 'Electricity',
    amount: '',
    vendor: '',
    gstRate: '18',
    file: ''
  });

  // Pull transactions
  const transactions = ConnCloudStore.getFinanceTransactions().filter(t => {
    const cinemaMatch = selectedCinemaId === 'all' || t.cinemaId === selectedCinemaId;
    const statusMatch = statusFilter === 'all' || t.status === statusFilter;
    const searchMatch = searchQuery === '' || 
      t.category.toLowerCase().includes(searchQuery.toLowerCase()) || 
      t.transactionId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.vendor && t.vendor.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return cinemaMatch && statusMatch && searchMatch;
  });

  // Calculations
  const incomeTx = transactions.filter(t => t.type === 'Income');
  const expenseTx = transactions.filter(t => t.type === 'Expense');

  const ticketRev = incomeTx.filter(t => t.category === 'Tickets').reduce((acc, t) => acc + t.amount, 0);
  const fnbRev = incomeTx.filter(t => t.category === 'Food & Beverage').reduce((acc, t) => acc + t.amount, 0);
  const totalRev = ticketRev + fnbRev;

  const grossIncome = incomeTx.reduce((acc, t) => acc + t.amount, 0);
  const totalTaxCollected = incomeTx.reduce((acc, t) => acc + t.tax, 0);
  const netIncome = grossIncome - totalTaxCollected;

  const totalExpense = expenseTx.reduce((acc, t) => acc + t.amount, 0);
  const totalTaxPaid = expenseTx.reduce((acc, t) => acc + t.tax, 0);
  
  const netProfit = netIncome - totalExpense;

  const formatCurrency = (val: number) => {
    if (val >= 10000000) return `₹${(val / 10000000).toFixed(2)}Cr`;
    if (val >= 100000) return `₹${(val / 100000).toFixed(2)}L`;
    return `₹${val.toLocaleString('en-IN')}`;
  };

  // Submit Expense Workflow
  const handleExpenseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!expenseForm.amount || !expenseForm.vendor) {
      alert('Please fill out all fields.');
      return;
    }

    const amt = parseFloat(expenseForm.amount);
    const gstRate = parseFloat(expenseForm.gstRate) / 100;
    const taxVal = Math.round(amt * gstRate);

    // Save transaction
    ConnCloudStore.addExpense({
      type: 'Expense',
      category: expenseForm.category,
      amount: amt,
      tax: taxVal,
      date: new Date().toISOString().split('T')[0],
      cinemaId: selectedCinemaId === 'all' ? 'c1' : selectedCinemaId,
      vendor: expenseForm.vendor,
      approver: 'Rakesh Patel',
      attachment: expenseForm.file || 'invoice_receipt.pdf'
    });

    triggerNotification(`Expense for ${expenseForm.vendor} logged successfully. Pending authorization.`);
    setIsExpenseModalOpen(false);
    setExpenseForm({ category: 'Electricity', amount: '', vendor: '', gstRate: '18', file: '' });
    setExpenseStep(1);
  };

  // Approve expense action
  const handleApprove = (txId: string) => {
    const success = ConnCloudStore.approveTransaction(txId, 'Rakesh Patel');
    if (success) {
      triggerNotification(`Transaction ${txId} approved and recorded in the Ledger.`);
    }
  };

  // Reconciliation State
  const [reconciledItems, setReconciledItems] = useState<string[]>([]);
  const handleReconcile = (id: string) => {
    setReconciledItems(prev => [...prev, id]);
    triggerNotification(`Transaction ${id} matched and reconciled.`);
  };

  return (
    <div className="space-y-6">
      {/* Sub tabs */}
      <section className="flex flex-wrap gap-1 bg-[#111827] border border-white/5 p-2 rounded-xl">
        {[
          { id: 'overview', label: 'Financial Overview' },
          { id: 'ledger', label: 'Invoices & Ledger' },
          { id: 'expenses', label: 'Expenses Manager' },
          { id: 'gst-royalty', label: 'GST & Royalty Reports' },
          { id: 'pnl-budget', label: 'P&L / Budget Limits' },
          { id: 'reconciliation', label: 'Bank Reconciliation' }
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

      {/* 1. FINANCIAL OVERVIEW */}
      {subSection === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="cc-card">
              <span className="text-[10px] text-gray-400 block font-bold uppercase tracking-wider mb-1">Gross Collections</span>
              <span className="text-2xl font-extrabold text-white">{formatCurrency(grossIncome)}</span>
            </div>
            <div className="cc-card border-l-4 border-l-red-500">
              <span className="text-[10px] text-gray-400 block font-bold uppercase tracking-wider mb-1">Gross Expenses</span>
              <span className="text-2xl font-extrabold text-red-400">{formatCurrency(totalExpense)}</span>
            </div>
            <div className="cc-card">
              <span className="text-[10px] text-gray-400 block font-bold uppercase tracking-wider mb-1">GST Pool collected</span>
              <span className="text-2xl font-extrabold text-gray-300">{formatCurrency(totalTaxCollected)}</span>
            </div>
            <div className="cc-card border-l-4 border-l-emerald-500">
              <span className="text-[10px] text-gray-400 block font-bold uppercase tracking-wider mb-1">Operating Net Profit</span>
              <span className="text-2xl font-extrabold text-emerald-400">{formatCurrency(netProfit)}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Income Streams */}
            <div className="cc-card">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-4">Revenue stream contributions</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs font-semibold text-gray-300 mb-1">
                    <span>Ticket Sales Revenue (GST @18%)</span>
                    <span>{formatCurrency(ticketRev)}</span>
                  </div>
                  <div className="w-full bg-white/5 h-1.5 rounded overflow-hidden">
                    <div className="bg-blue-600 h-full" style={{ width: `${(ticketRev / (totalRev || 1)) * 100}%` }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs font-semibold text-gray-300 mb-1">
                    <span>Food & Beverage POS (GST @5%)</span>
                    <span>{formatCurrency(fnbRev)}</span>
                  </div>
                  <div className="w-full bg-white/5 h-1.5 rounded overflow-hidden">
                    <div className="bg-[#f5b041] h-full" style={{ width: `${(fnbRev / (totalRev || 1)) * 100}%` }}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Top Vendors log */}
            <div className="cc-card">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-4">Vendor payout summaries</h3>
              <div className="space-y-3.5">
                {[
                  { name: 'State Power Corporation Ltd', amount: 320000, category: 'Electricity' },
                  { name: 'Clean Corp Ltd', amount: 120000, category: 'Housekeeping' },
                  { name: 'Dolby Services India', amount: 85000, category: 'Equipment maintenance' }
                ].map((vend, idx) => (
                  <div key={idx} className="flex justify-between items-center text-xs p-2.5 rounded bg-black/20 border border-white/5">
                    <div>
                      <span className="font-bold text-white block">{vend.name}</span>
                      <span className="text-[10px] text-gray-400 uppercase mt-0.5">{vend.category}</span>
                    </div>
                    <span className="font-bold text-red-400">{formatCurrency(vend.amount)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. LEDGER */}
      {subSection === 'ledger' && (
        <div className="cc-card">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              <div className="relative w-full sm:w-60">
                <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xs"></i>
                <input 
                  type="text" 
                  className="cc-input pl-9 w-full" 
                  placeholder="Search ledger entries..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <select 
                className="cc-input"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Statuses</option>
                <option value="Settled">Settled</option>
                <option value="Paid">Paid</option>
                <option value="Pending">Pending Approval</option>
              </select>
            </div>
            
            <button onClick={() => setIsExpenseModalOpen(true)} className="cc-btn cc-btn-accent text-xs">
              <i className="fa-solid fa-plus"></i> Submit Invoice / Expense
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-white/10 text-gray-400 font-semibold">
                  <th className="pb-3">Transaction ID</th>
                  <th className="pb-3">Date</th>
                  <th className="pb-3">Type</th>
                  <th className="pb-3">Category</th>
                  <th className="pb-3 text-right">Tax (GST)</th>
                  <th className="pb-3 text-right">Gross Total</th>
                  <th className="pb-3 text-center">Status</th>
                  <th className="pb-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {transactions.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-gray-500">No transaction logs match search parameters.</td>
                  </tr>
                ) : (
                  transactions.map((tx) => (
                    <tr key={tx.transactionId} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="py-3 font-semibold text-gray-300">{tx.transactionId}</td>
                      <td className="py-3 text-gray-400">{tx.date}</td>
                      <td className="py-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          tx.type === 'Income' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
                        }`}>
                          {tx.type}
                        </span>
                      </td>
                      <td className="py-3 font-medium text-white">{tx.category} {tx.vendor && `(${tx.vendor})`}</td>
                      <td className="py-3 text-right text-gray-400">{formatCurrency(tx.tax)}</td>
                      <td className="py-3 text-right font-bold text-white">{formatCurrency(tx.amount)}</td>
                      <td className="py-3 text-center">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                          tx.status === 'Settled' || tx.status === 'Paid' 
                            ? 'bg-emerald-500/10 text-emerald-400' 
                            : (tx.status === 'Pending' ? 'bg-amber-500/10 text-amber-400' : 'bg-red-500/10 text-red-400')
                        }`}>
                          {tx.status}
                        </span>
                      </td>
                      <td className="py-3 text-center">
                        {tx.status === 'Pending' ? (
                          <button 
                            onClick={() => handleApprove(tx.transactionId)}
                            className="px-2 py-1 rounded bg-blue-600 hover:bg-blue-700 text-white font-semibold text-[10px] transition-colors"
                          >
                            Approve
                          </button>
                        ) : (
                          <span className="text-gray-500 text-[10px] font-medium">—</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. EXPENSES MANAGER */}
      {subSection === 'expenses' && (
        <div className="cc-card">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400">Operating Expense Claims</h3>
            <button onClick={() => setIsExpenseModalOpen(true)} className="cc-btn cc-btn-accent text-xs">
              Create Expense Claim
            </button>
          </div>

          <div className="space-y-4">
            {expenseTx.map((tx) => (
              <div key={tx.transactionId} className="p-4 rounded bg-black/25 border border-white/5 hover:border-white/10 transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-sm">{tx.category}</span>
                    <span className="text-[10px] text-gray-400 font-bold uppercase bg-white/5 px-2 py-0.5 rounded">{tx.vendor}</span>
                  </div>
                  <div className="text-xs text-gray-400 mt-1">Claim Date: {tx.date} • Attached Document: <a href="#" className="underline text-blue-400 hover:text-blue-300">{tx.attachment || 'receipt.pdf'}</a></div>
                </div>

                <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
                  <div className="text-right">
                    <span className="text-sm font-extrabold text-white block">{formatCurrency(tx.amount)}</span>
                    <span className="text-[10px] text-gray-500 block">GST Paid: {formatCurrency(tx.tax)}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold ${
                      tx.status === 'Paid' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
                    }`}>
                      {tx.status === 'Paid' ? 'Completed Ledger' : 'Approval Pending'}
                    </span>
                    
                    {tx.status === 'Pending' && (
                      <button 
                        onClick={() => handleApprove(tx.transactionId)}
                        className="cc-btn cc-btn-primary py-1 px-3 text-[10px]"
                      >
                        Approve
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. GST & ROYALTY */}
      {subSection === 'gst-royalty' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="cc-card">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-4">GST Tax Pools</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center bg-black/20 p-3 rounded border border-white/5 text-xs">
                <span className="text-gray-300">GST Collected (Outward)</span>
                <span className="font-bold text-emerald-400">{formatCurrency(totalTaxCollected)}</span>
              </div>
              <div className="flex justify-between items-center bg-black/20 p-3 rounded border border-white/5 text-xs">
                <span className="text-gray-300">GST Paid (Inward Input Credit)</span>
                <span className="font-bold text-red-400">{formatCurrency(totalTaxPaid)}</span>
              </div>
              <div className="flex justify-between items-center bg-black/20 p-3.5 rounded border border-[#f5b041]/20 text-xs">
                <span className="text-gray-100 font-bold">Net GST Payable</span>
                <span className="font-black text-[#f5b041]">{formatCurrency(Math.max(0, totalTaxCollected - totalTaxPaid))}</span>
              </div>
            </div>
            <button 
              onClick={() => triggerNotification('GST Returns spreadsheet prepared.')} 
              className="w-full mt-4 cc-btn cc-btn-outline text-xs"
            >
              Export GSTR Statement
            </button>
          </div>

          <div className="cc-card">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-4">Franchise Royalty Tracker</h3>
            <div className="space-y-4 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-400">Total Royalty Basis (Gross Revenue)</span>
                <span className="font-semibold text-white">{formatCurrency(totalRev)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Contractual Royalty share</span>
                <span className="font-semibold text-[#f5b041]">12.0%</span>
              </div>
              <div className="border-t border-white/5 my-2"></div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-100 font-bold">Net Royalty Payable</span>
                <span className="font-black text-[#f5b041]">{formatCurrency(totalRev * 0.12)}</span>
              </div>
            </div>
            <button 
              onClick={() => triggerNotification('Royalty statement generated.')} 
              className="w-full mt-6 cc-btn cc-btn-primary text-xs"
            >
              Request Statement Statement
            </button>
          </div>
        </div>
      )}

      {/* 5. P&L & BUDGET */}
      {subSection === 'pnl-budget' && (
        <div className="space-y-6">
          <div className="cc-card">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-4">Profit & Loss ledger statement</h3>
            <div className="space-y-2.5 text-xs text-gray-300">
              <div className="flex justify-between font-bold text-white py-1">
                <span>Revenue Accounts</span>
                <span></span>
              </div>
              <div className="flex justify-between pl-4">
                <span>Ticket Sales</span>
                <span>{formatCurrency(ticketRev)}</span>
              </div>
              <div className="flex justify-between pl-4">
                <span>Food & Beverage Collections</span>
                <span>{formatCurrency(fnbRev)}</span>
              </div>
              <div className="flex justify-between pl-4 font-semibold text-emerald-400 border-b border-white/5 pb-2">
                <span>Total Gross Income (Net of Tax)</span>
                <span>{formatCurrency(netIncome)}</span>
              </div>

              <div className="flex justify-between font-bold text-white py-1 mt-4">
                <span>Operational Expenses</span>
                <span></span>
              </div>
              <div className="flex justify-between pl-4 text-red-300">
                <span>Utility & Invoices Outflow</span>
                <span>({formatCurrency(totalExpense)})</span>
              </div>
              <div className="flex justify-between pl-4 text-red-300 border-b border-white/5 pb-2">
                <span>Royalty Obligation (12%)</span>
                <span>({formatCurrency(totalRev * 0.12)})</span>
              </div>

              <div className="flex justify-between font-black text-white text-sm pt-3">
                <span>Franchise Net Operating Profit</span>
                <span className="text-[#f5b041]">{formatCurrency(netIncome - totalExpense - (totalRev * 0.12))}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 6. RECONCILIATION */}
      {subSection === 'reconciliation' && (
        <div className="cc-card">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-2">Automated Bank Reconciliation</h3>
          <p className="text-xs text-gray-500 mb-6">Compare bank deposit logs directly against ConnCloud ticket ledger entries.</p>
          
          <div className="space-y-3">
            {[
              { id: 'rec_1', date: '2026-08-30', externalDesc: 'Razorpay payout settlement ID_82103', systemDesc: 'ConnCloud ticket sales for Aug 29', amount: 185000, mismatch: false },
              { id: 'rec_2', date: '2026-08-29', externalDesc: 'Razorpay payout settlement ID_82098', systemDesc: 'ConnCloud ticket sales for Aug 28', amount: 220000, mismatch: false },
              { id: 'rec_3', date: '2026-08-27', externalDesc: 'Direct cash deposit - Gandhinagar cashbox', systemDesc: 'Counter sales collection cycle #14', amount: 45000, mismatch: true }
            ].map((item) => {
              const isReconciled = reconciledItems.includes(item.id);
              return (
                <div key={item.id} className="p-4 rounded bg-black/20 border border-white/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-xs">{item.id}</span>
                      <span className="text-[10px] text-gray-400">{item.date}</span>
                    </div>
                    <div className="text-xs text-gray-400">External: <span className="text-gray-300 font-semibold">{item.externalDesc}</span></div>
                    <div className="text-xs text-gray-400">ConnCloud Ledger: <span className="text-gray-300 font-semibold">{item.systemDesc}</span></div>
                  </div>
                  <div className="flex items-center gap-4 justify-between w-full sm:w-auto">
                    <span className="text-sm font-extrabold text-white">{formatCurrency(item.amount)}</span>
                    {isReconciled ? (
                      <span className="text-xs font-bold text-emerald-400"><i className="fa-solid fa-circle-check"></i> Matched</span>
                    ) : (
                      <button 
                        onClick={() => handleReconcile(item.id)}
                        className="cc-btn cc-btn-outline py-1 px-3 text-[10px] border-[#f5b041]/30 text-[#f5b041]"
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
      )}

      {/* CREATE EXPENSE MODAL */}
      {isExpenseModalOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-[#111827] border border-white/10 rounded-xl w-full max-w-md overflow-hidden">
            <div className="p-4 border-b border-white/5 flex justify-between items-center">
              <h3 className="font-bold text-sm uppercase tracking-wider text-gray-300">File Operational Expense Claim</h3>
              <button onClick={() => setIsExpenseModalOpen(false)} className="text-gray-400 hover:text-white">
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
            
            <form onSubmit={handleExpenseSubmit} className="p-6 space-y-4">
              {expenseStep === 1 ? (
                <div className="space-y-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] uppercase font-bold text-gray-400">Expense Category</label>
                    <select 
                      className="cc-input"
                      value={expenseForm.category}
                      onChange={(e) => setExpenseForm(prev => ({ ...prev, category: e.target.value }))}
                    >
                      <option value="Electricity">Electricity Utility</option>
                      <option value="Housekeeping Supplies">Housekeeping Supplies</option>
                      <option value="Marketing Materials">Marketing Materials</option>
                      <option value="F&B Stock Refill">F&B Stock Purchase</option>
                      <option value="Hardware Maintenance">Hardware Service Maintenance</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] uppercase font-bold text-gray-400">Vendor / Payee</label>
                    <input 
                      type="text" 
                      className="cc-input" 
                      placeholder="e.g. Blue Star Service Ltd"
                      value={expenseForm.vendor}
                      onChange={(e) => setExpenseForm(prev => ({ ...prev, vendor: e.target.value }))}
                      required
                    />
                  </div>

                  <button 
                    type="button" 
                    onClick={() => setExpenseStep(2)} 
                    className="w-full cc-btn cc-btn-primary"
                    disabled={!expenseForm.vendor}
                  >
                    Next Step <i className="fa-solid fa-arrow-right"></i>
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] uppercase font-bold text-gray-400">Amount (INR)</label>
                      <input 
                        type="number" 
                        className="cc-input" 
                        placeholder="₹ Amount"
                        value={expenseForm.amount}
                        onChange={(e) => setExpenseForm(prev => ({ ...prev, amount: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] uppercase font-bold text-gray-400">GST Slab (%)</label>
                      <select 
                        className="cc-input"
                        value={expenseForm.gstRate}
                        onChange={(e) => setExpenseForm(prev => ({ ...prev, gstRate: e.target.value }))}
                      >
                        <option value="18">18% GST (Standard Services)</option>
                        <option value="5">5% GST (F&B/Catering)</option>
                        <option value="12">12% GST (Maintenance Hardware)</option>
                        <option value="0">Exempt (0%)</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] uppercase font-bold text-gray-400">Attach Invoice Receipt (Filename)</label>
                    <input 
                      type="text" 
                      className="cc-input" 
                      placeholder="e.g. blue_star_receipt_821.pdf"
                      value={expenseForm.file}
                      onChange={(e) => setExpenseForm(prev => ({ ...prev, file: e.target.value }))}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2 mt-6">
                    <button 
                      type="button" 
                      onClick={() => setExpenseStep(1)} 
                      className="cc-btn cc-btn-outline"
                    >
                      <i className="fa-solid fa-arrow-left"></i> Back
                    </button>
                    <button 
                      type="submit" 
                      className="cc-btn cc-btn-accent text-blue-950 font-bold"
                    >
                      Submit Claim
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
