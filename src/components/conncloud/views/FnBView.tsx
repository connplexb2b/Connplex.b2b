import React, { useState } from 'react';
import { ConnCloudStore, FnBProduct } from '../../../lib/conncloudData';

interface FnBViewProps {
  selectedCinemaId: string;
  selectedDateRange: string;
  triggerNotification: (msg: string) => void;
}

export default function FnBView({
  selectedCinemaId,
  selectedDateRange,
  triggerNotification
}: FnBViewProps) {
  const [subSection, setSubSection] = useState<'overview' | 'catalog' | 'combos' | 'inventory' | 'wastage'>('overview');
  
  // Roster of products
  const products = ConnCloudStore.getFnBProducts();
  const sales = ConnCloudStore.getFnBTransactions().filter(t => selectedCinemaId === 'all' || t.cinemaId === selectedCinemaId);

  // Wastage reports local state
  const [wastageList, setWastageList] = useState([
    { product: 'Salted Popcorn kernels', qty: '12 kg', cost: 1800, reason: 'Moisture contamination', employee: 'Aarav Sharma', date: '2026-08-30' },
    { product: 'Pepsi Soda syrup bag', qty: '1 unit', cost: 3200, reason: 'Nozzle valve leak', employee: 'Priya Nair', date: '2026-08-28' }
  ]);

  const [wastageForm, setWastageForm] = useState({
    product: 'fb1',
    qty: '',
    reason: 'Expired'
  });

  const formatCurrency = (val: number) => {
    return `₹${val.toLocaleString('en-IN')}`;
  };

  const handleStockUpdate = (productId: string, increment: boolean) => {
    const prod = products.find(p => p.productId === productId);
    if (prod) {
      const delta = increment ? 50 : -50;
      const newStock = Math.max(0, prod.stock + delta);
      ConnCloudStore.updateProductStock(productId, newStock);
      triggerNotification(`Inventory for ${prod.name} updated to ${newStock} units.`);
    }
  };

  const handleWastageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!wastageForm.qty) return;

    const prod = products.find(p => p.productId === wastageForm.product);
    if (!prod) return;

    const wQty = parseInt(wastageForm.qty);
    const itemCost = Math.round(prod.cost * wQty);

    setWastageList(prev => [
      {
        product: prod.name,
        qty: `${wQty} units`,
        cost: itemCost,
        reason: wastageForm.reason,
        employee: 'Rakesh Patel',
        date: new Date().toISOString().split('T')[0]
      },
      ...prev
    ]);

    // Mutate inventory status accordingly
    const newStock = Math.max(0, prod.stock - wQty);
    ConnCloudStore.updateProductStock(prod.productId, newStock);

    triggerNotification(`Logged wastage of ${wQty} units of ${prod.name}. Stock adjusted.`);
    setWastageForm({ product: 'fb1', qty: '', reason: 'Expired' });
  };

  // Calculation summaries
  const totalSalesRevenue = sales.reduce((acc, s) => acc + (s.price * s.quantity), 0);
  const unitsSold = sales.reduce((acc, s) => acc + s.quantity, 0);
  
  // SPH (Spend Per Head) for F&B
  const totalAdmissions = 3842; // Seeded benchmark
  const sph = totalAdmissions > 0 ? (totalSalesRevenue / totalAdmissions).toFixed(1) : '0';

  return (
    <div className="space-y-6">
      {/* Sub tabs */}
      <section className="flex flex-wrap gap-1 bg-[#111827] border border-white/5 p-2 rounded-xl">
        {[
          { id: 'overview', label: 'Commercial Overview' },
          { id: 'catalog', label: 'Products Catalog' },
          { id: 'combos', label: 'Combos Configurator' },
          { id: 'inventory', label: 'Stock & Inventory' },
          { id: 'wastage', label: 'Wastage Tracking' }
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

      {/* 1. OVERVIEW */}
      {subSection === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="cc-card">
              <span className="text-[10px] text-gray-400 block font-bold uppercase tracking-wider mb-1">F&B Total Revenue</span>
              <span className="text-2xl font-extrabold text-white">{formatCurrency(totalSalesRevenue)}</span>
            </div>
            <div className="cc-card">
              <span className="text-[10px] text-gray-400 block font-bold uppercase tracking-wider mb-1">Average SPH</span>
              <span className="text-2xl font-extrabold text-[#f5b041]">₹{sph}</span>
            </div>
            <div className="cc-card">
              <span className="text-[10px] text-gray-400 block font-bold uppercase tracking-wider mb-1">Units Sold</span>
              <span className="text-2xl font-extrabold text-white">{unitsSold.toLocaleString()}</span>
            </div>
            <div className="cc-card border-l-4 border-l-emerald-500">
              <span className="text-[10px] text-gray-400 block font-bold uppercase tracking-wider mb-1">Avg Gross Profit Margin</span>
              <span className="text-2xl font-extrabold text-emerald-400">76.4%</span>
            </div>
          </div>

          <div className="cc-card">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-4">Stock Warning Indicators</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {products.filter(p => p.status !== 'Healthy').map((p) => (
                <div key={p.productId} className="p-4 rounded bg-black/20 border border-white/5 flex justify-between items-center text-xs">
                  <div>
                    <span className="font-bold text-white block">{p.name}</span>
                    <span className="text-[10px] text-gray-500 uppercase mt-0.5">{p.category}</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    p.status === 'Low Stock' ? 'bg-amber-500/10 text-amber-400' : 'bg-red-500/10 text-red-400'
                  }`}>
                    {p.stock} Units ({p.status})
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 2. CATALOG */}
      {subSection === 'catalog' && (
        <div className="cc-card">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-4">F&B Menu Catalog</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-white/10 text-gray-400 font-bold">
                  <th className="pb-3">Menu Product</th>
                  <th className="pb-3">Category</th>
                  <th className="pb-3 text-right">Selling Price</th>
                  <th className="pb-3 text-right">Unit Cost</th>
                  <th className="pb-3 text-right">Gross Margin</th>
                  <th className="pb-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => {
                  const profit = p.price - p.cost;
                  const marginPct = ((profit / p.price) * 100).toFixed(0);
                  return (
                    <tr key={p.productId} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="py-3 font-semibold text-white">{p.name}</td>
                      <td className="py-3 text-gray-400">{p.category}</td>
                      <td className="py-3 text-right font-bold text-gray-300">{formatCurrency(p.price)}</td>
                      <td className="py-3 text-right text-gray-400">{formatCurrency(p.cost)}</td>
                      <td className="py-3 text-right text-emerald-400 font-semibold">{marginPct}% (₹{profit})</td>
                      <td className="py-3 text-center">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          p.status === 'Healthy' ? 'bg-emerald-500/10 text-emerald-400' : (p.status === 'Low Stock' ? 'bg-amber-500/10 text-amber-400' : 'bg-red-500/10 text-red-400')
                        }`}>
                          {p.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. COMBOS */}
      {subSection === 'combos' && (
        <div className="cc-card">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-4">Configured Meal Combos</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { name: 'Blockbuster Combo Set', items: '1x Salted Popcorn (L) + 2x Pepsi XL Sodas', price: 320, cost: 70, margin: '78%' },
              { name: 'Solo Movie Snacker Combo', items: '1x Salted Popcorn (M) + 1x Pepsi Soda (L)', price: 210, cost: 45, margin: '79%' },
              { name: 'Trio Treat Party Basket', items: '2x Large Popcorns + 3x Drinks + 1x Nachos box', price: 540, cost: 130, margin: '76%' }
            ].map((combo, idx) => (
              <div key={idx} className="p-4 rounded bg-black/25 border border-white/5 flex justify-between items-start text-xs">
                <div className="space-y-1">
                  <h4 className="font-bold text-white text-sm">{combo.name}</h4>
                  <p className="text-gray-400 mt-1.5">{combo.items}</p>
                </div>
                <div className="text-right">
                  <span className="text-sm font-black text-[#f5b041] block">{formatCurrency(combo.price)}</span>
                  <span className="text-[10px] text-emerald-400 font-bold block mt-1">Margin: {combo.margin}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. INVENTORY */}
      {subSection === 'inventory' && (
        <div className="cc-card">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-4">Stock inventory & replenishment</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-white/10 text-gray-400 font-bold">
                  <th className="pb-3">Product</th>
                  <th className="pb-3">Category</th>
                  <th className="pb-3 text-center">Remaining Stock</th>
                  <th className="pb-3 text-center">Min Threshold</th>
                  <th className="pb-3 text-center">Status</th>
                  <th className="pb-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.productId} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="py-3 font-semibold text-white">{p.name}</td>
                    <td className="py-3 text-gray-400">{p.category}</td>
                    <td className="py-3 text-center text-gray-300 font-mono">{p.stock}</td>
                    <td className="py-3 text-center text-gray-400 font-mono">{p.minStock}</td>
                    <td className="py-3 text-center">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        p.status === 'Healthy' ? 'bg-emerald-500/10 text-emerald-400' : (p.status === 'Low Stock' ? 'bg-amber-500/10 text-amber-400' : 'bg-red-500/10 text-red-400')
                      }`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="py-3 text-center">
                      <div className="flex justify-center gap-1">
                        <button 
                          onClick={() => handleStockUpdate(p.productId, true)}
                          className="px-2 py-0.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-[10px] font-bold transition-colors"
                        >
                          +50
                        </button>
                        <button 
                          onClick={() => handleStockUpdate(p.productId, false)}
                          className="px-2 py-0.5 bg-gray-700 hover:bg-gray-600 text-white rounded text-[10px] font-bold transition-colors"
                          disabled={p.stock < 50}
                        >
                          -50
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 5. WASTAGE */}
      {subSection === 'wastage' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Wastage list log */}
          <div className="lg:col-span-2 cc-card">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-4">Wastage Log Report</h3>
            <div className="space-y-3.5">
              {wastageList.map((item, idx) => (
                <div key={idx} className="p-3 bg-black/20 border border-white/5 rounded text-xs flex justify-between items-center">
                  <div>
                    <span className="font-bold text-white block">{item.product}</span>
                    <div className="text-[10px] text-gray-400 mt-1">Logged by: {item.employee} • Reason: {item.reason}</div>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-red-400 block">-{formatCurrency(item.cost)}</span>
                    <span className="text-[10px] text-gray-400 font-mono mt-0.5 block">{item.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Log Wastage Form */}
          <div className="cc-card">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-4">Log Wastage Audit</h3>
            <form onSubmit={handleWastageSubmit} className="space-y-4 text-xs">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase font-bold text-gray-400">Select Product</label>
                <select 
                  className="cc-input"
                  value={wastageForm.product}
                  onChange={(e) => setWastageForm(prev => ({ ...prev, product: e.target.value }))}
                >
                  {products.map(p => (
                    <option key={p.productId} value={p.productId}>{p.name}</option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase font-bold text-gray-400">Wastage Quantity (Units)</label>
                <input 
                  type="number" 
                  className="cc-input" 
                  placeholder="e.g. 5"
                  value={wastageForm.qty}
                  onChange={(e) => setWastageForm(prev => ({ ...prev, qty: e.target.value }))}
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase font-bold text-gray-400">Wastage Reason</label>
                <select 
                  className="cc-input"
                  value={wastageForm.reason}
                  onChange={(e) => setWastageForm(prev => ({ ...prev, reason: e.target.value }))}
                >
                  <option value="Expired">Product Expired</option>
                  <option value="Spillage">Spillage / Damage</option>
                  <option value="Hygiene Fail">Hygiene Compliance Sweep</option>
                </select>
              </div>

              <button type="submit" className="w-full cc-btn cc-btn-accent text-blue-950 font-bold mt-4">
                Record Wastage Outflow
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
