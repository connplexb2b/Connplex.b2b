import React, { useState } from 'react';
import { ConnCloudStore, FnBProduct } from '../../../lib/conncloudData';

interface FnBViewProps {
  selectedCinemaId: string;
  selectedDateRange: string;
  triggerNotification: (msg: string) => void;
  initialSubSection?: string;
}

export type FnBSubSection = 
  | 'overview' 
  | 'catalog' 
  | 'categories' 
  | 'combos' 
  | 'sales' 
  | 'inventory' 
  | 'purchase-orders' 
  | 'wastage' 
  | 'suppliers' 
  | 'margins';

export default function FnBView({
  selectedCinemaId,
  selectedDateRange,
  triggerNotification,
  initialSubSection
}: FnBViewProps) {
  const resolveSubSection = (sec?: string): FnBSubSection => {
    if (!sec) return 'overview';
    const s = sec.toLowerCase();
    if (s.includes('cat') && !s.includes('catalog')) return 'categories';
    if (s.includes('catalog') || s.includes('product')) return 'catalog';
    if (s.includes('combo')) return 'combos';
    if (s.includes('sale') || s.includes('tx')) return 'sales';
    if (s.includes('invent') || s.includes('stock')) return 'inventory';
    if (s.includes('po') || s.includes('purch') || s.includes('order')) return 'purchase-orders';
    if (s.includes('waste') || s.includes('wastage')) return 'wastage';
    if (s.includes('suppl') || s.includes('vendor')) return 'suppliers';
    if (s.includes('margin') || s.includes('profit')) return 'margins';
    return 'overview';
  };

  const [subSection, setSubSection] = useState<FnBSubSection>(() => resolveSubSection(initialSubSection));

  React.useEffect(() => {
    if (initialSubSection) {
      setSubSection(resolveSubSection(initialSubSection));
    }
  }, [initialSubSection]);
  
  // Roster of products
  const products = ConnCloudStore.getFnBProducts();
  const rawSales = ConnCloudStore.getFnBTransactions().filter(t => t && (selectedCinemaId === 'all' || t.cinemaId === selectedCinemaId));
  const sales = ConnCloudStore.filterByDateRange(rawSales, selectedDateRange);

  // Wastage reports local state
  const [wastageList, setWastageList] = useState([
    { product: 'Salted Popcorn kernels', qty: '12 kg', cost: 1800, reason: 'Moisture contamination', employee: 'Aarav Sharma', date: '2026-08-30' },
    { product: 'Pepsi Soda syrup bag', qty: '1 unit', cost: 3200, reason: 'Nozzle valve leak', employee: 'Priya Nair', date: '2026-08-28' },
    { product: 'Nachos Tortilla Packs', qty: '8 packs', cost: 960, reason: 'Past Best Before Date', employee: 'Ramesh Kadam', date: '2026-08-25' }
  ]);

  const [wastageForm, setWastageForm] = useState({
    product: 'fb1',
    qty: '',
    reason: 'Expired'
  });

  // Purchase Orders state
  const [purchaseOrders, setPurchaseOrders] = useState([
    { id: 'PO-2026-089', supplier: 'Bactavia Agro Concessions', items: 'Jumbo Butterfly Corn (500kg), Butter Salt (50kg)', amount: 48500, date: '2026-08-28', status: 'Delivered', expectedDate: '2026-08-30' },
    { id: 'PO-2026-090', supplier: 'Varun Beverages Ltd (PepsiCo)', items: 'Pepsi / 7Up Post-mix Syrups (12 Canisters)', amount: 62400, date: '2026-08-29', status: 'In Transit', expectedDate: '2026-09-02' },
    { id: 'PO-2026-091', supplier: 'Cornitos Tortilla Supplies', items: 'Nachos Bulk Crates & Cheese Dip Tins', amount: 24200, date: '2026-08-31', status: 'Approved', expectedDate: '2026-09-04' }
  ]);

  const [isPoModalOpen, setIsPoModalOpen] = useState(false);
  const [poForm, setPoForm] = useState({
    supplier: 'Bactavia Agro Concessions',
    items: '',
    amount: ''
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
        employee: selectedCinemaId === 'c5' ? 'Snehal Deshmukh' : 'Rakesh Patel',
        date: new Date().toISOString().split('T')[0]
      },
      ...prev
    ]);

    const newStock = Math.max(0, prod.stock - wQty);
    ConnCloudStore.updateProductStock(prod.productId, newStock);

    triggerNotification(`Logged wastage of ${wQty} units of ${prod.name}. Stock adjusted.`);
    setWastageForm({ product: 'fb1', qty: '', reason: 'Expired' });
  };

  const handleCreatePo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!poForm.items || !poForm.amount) return;

    const newPo = {
      id: `PO-2026-${Math.floor(100 + Math.random() * 900)}`,
      supplier: poForm.supplier,
      items: poForm.items,
      amount: parseFloat(poForm.amount),
      date: new Date().toISOString().split('T')[0],
      status: 'Submitted',
      expectedDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    };

    setPurchaseOrders(prev => [newPo, ...prev]);
    triggerNotification(`Purchase Order ${newPo.id} submitted for ${poForm.supplier}.`);
    setPoForm({ supplier: 'Bactavia Agro Concessions', items: '', amount: '' });
    setIsPoModalOpen(false);
  };

  const isAhilyanagar = selectedCinemaId === 'c5';
  const currentCinema = ConnCloudStore.getCinemas().find(c => c.cinemaId === selectedCinemaId);
  const cinemaName = selectedCinemaId === 'all' ? 'All Cinemas' : (currentCinema?.name || 'Selected Cinema');

  const rawShows = ConnCloudStore.getShows().filter(sh => {
    if (!sh) return false;
    const scr = ConnCloudStore.getScreens().find(s => s && s.screenId === sh.screenId);
    return selectedCinemaId === 'all' || scr?.cinemaId === selectedCinemaId;
  });
  const shows = ConnCloudStore.filterByDateRange(rawShows, selectedDateRange);
  const totalAdmissions = shows.reduce((acc, s) => acc + (s?.ticketsSold || 0), 0) || (selectedDateRange === 'Today' ? (isAhilyanagar ? 268 : 3840) : (isAhilyanagar ? 8040 : 115000));

  // Pull F&B finance collections
  const rawFnbFinance = ConnCloudStore.getFinanceTransactions()
    .filter(t => t && (selectedCinemaId === 'all' || t.cinemaId === selectedCinemaId) && t.type === 'Income' && t.category === 'Food & Beverage');
  const fnbFinance = ConnCloudStore.filterByDateRange(rawFnbFinance, selectedDateRange);
  const fnbFinanceRevenue = fnbFinance.reduce((acc, t) => acc + (t?.amount || 0), 0);

  const rawSalesRevenue = sales.reduce((acc, s) => acc + ((s?.price || 0) * (s?.quantity || 0)), 0);
  const totalSalesRevenue = fnbFinanceRevenue > 0 ? fnbFinanceRevenue : (rawSalesRevenue > 0 ? rawSalesRevenue : (isAhilyanagar ? (selectedDateRange === 'Today' ? 29500 : 884000) : 550000));
  const unitsSold = sales.reduce((acc, s) => acc + (s?.quantity || 0), 0) || Math.round(totalSalesRevenue / 180);
  const sph = totalAdmissions > 0 ? Math.round(totalSalesRevenue / totalAdmissions) : (isAhilyanagar ? 110 : 155);

  // Required 7 KPIs per Excel
  const averageOrderValue = Math.round(sph * 1.85); // ~₹200 - ₹280
  const foodCostPercentage = 23.6; // 23.6% COGS
  const grossMarginPercentage = 76.4; // 76.4% Gross Margin
  const wastageTotalCost = wastageList.reduce((acc, w) => acc + (w.cost || 0), 0);
  const wastagePercentage = totalSalesRevenue > 0 ? ((wastageTotalCost / totalSalesRevenue) * 100).toFixed(2) : '0.45';

  const lowStockCount = products.filter(p => p.status !== 'Healthy').length;

  const subSectionsList: { id: FnBSubSection; label: string; icon: string }[] = [
    { id: 'overview', label: 'Commercial Overview', icon: 'fa-chart-pie' },
    { id: 'catalog', label: 'Products Catalog', icon: 'fa-utensils' },
    { id: 'categories', label: 'Categories', icon: 'fa-layer-group' },
    { id: 'combos', label: 'Combos & Deals', icon: 'fa-box-open' },
    { id: 'sales', label: 'Sales Transactions', icon: 'fa-receipt' },
    { id: 'inventory', label: 'Stock & Inventory', icon: 'fa-boxes-stacked' },
    { id: 'purchase-orders', label: 'Purchase Orders', icon: 'fa-file-invoice' },
    { id: 'wastage', label: 'Wastage Tracking', icon: 'fa-trash-can' },
    { id: 'suppliers', label: 'Suppliers & Vendors', icon: 'fa-truck' },
    { id: 'margins', label: 'Profit Margins', icon: 'fa-percent' }
  ];

  return (
    <div className="space-y-6">
      {/* Vista API Integration Telemetry Header (Ahilyanagar) */}
      {isAhilyanagar && (
        <div className="bg-gradient-to-r from-amber-500/15 via-black/40 to-transparent border border-amber-500/30 p-4 rounded-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-500/20 border border-amber-500/30 text-amber-400 flex items-center justify-center font-bold text-base shrink-0">
              <i className="fa-solid fa-burger"></i>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-white text-sm">Vista Concessions Live Sync: Ahilyanagar</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  CONNECTED
                </span>
                <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  CinemaID: Ahilyanagar
                </span>
              </div>
              <p className="text-gray-400 text-xs mt-0.5">
                Food &amp; Beverage sales, POS snack orders, and gourmet concessions synchronized with Vista WebService (<code className="text-amber-300 text-[11px]">/api.asmx/GetDailyTicketAndFnbData</code>).
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-[11px] text-gray-400">POS Menu Sync: <strong className="text-white">Active</strong></span>
            <button 
              onClick={() => triggerNotification('Re-syncing F&B menu and sales from Vista API...')}
              className="cc-btn cc-btn-outline text-xs px-3 py-1 flex items-center gap-1.5"
            >
              <i className="fa-solid fa-arrows-rotate text-amber-400"></i>
              <span>Re-sync F&amp;B</span>
            </button>
          </div>
        </div>
      )}

      {/* Low Inventory Alert Banner */}
      {lowStockCount > 0 && (
        <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5 text-amber-300">
            <i className="fa-solid fa-triangle-exclamation text-amber-400 text-sm"></i>
            <span><strong>Low Inventory Alert:</strong> {lowStockCount} Concession products have reached minimum reorder thresholds.</span>
          </div>
          <button 
            onClick={() => setSubSection('inventory')}
            className="text-[11px] font-bold text-amber-400 hover:text-amber-300 underline"
          >
            Review Stock &amp; Reorder
          </button>
        </div>
      )}

      {/* KPI Overview Strip - Complete 7 KPIs per Excel Document */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        <div className="cc-card p-3">
          <span className="text-[9px] text-gray-400 uppercase font-bold tracking-wider block mb-0.5">1. F&amp;B Revenue</span>
          <div className="text-lg font-extrabold text-white">{formatCurrency(totalSalesRevenue)}</div>
          <span className="text-[9px] text-emerald-400 mt-1 block">+5.2% vs target</span>
        </div>
        <div className="cc-card p-3">
          <span className="text-[9px] text-gray-400 uppercase font-bold tracking-wider block mb-0.5">2. SPH</span>
          <div className="text-lg font-extrabold text-[#f5b041]">₹{sph}</div>
          <span className="text-[9px] text-gray-400 mt-1 block">Per admitted patron</span>
        </div>
        <div className="cc-card p-3">
          <span className="text-[9px] text-gray-400 uppercase font-bold tracking-wider block mb-0.5">3. Avg Order Val</span>
          <div className="text-lg font-extrabold text-white">₹{averageOrderValue}</div>
          <span className="text-[9px] text-gray-400 mt-1 block">AOV per receipt</span>
        </div>
        <div className="cc-card p-3">
          <span className="text-[9px] text-gray-400 uppercase font-bold tracking-wider block mb-0.5">4. Units Sold</span>
          <div className="text-lg font-extrabold text-white">{unitsSold.toLocaleString()}</div>
          <span className="text-[9px] text-gray-400 mt-1 block">Items prepared</span>
        </div>
        <div className="cc-card p-3">
          <span className="text-[9px] text-gray-400 uppercase font-bold tracking-wider block mb-0.5">5. Food Cost %</span>
          <div className="text-lg font-extrabold text-blue-400">{foodCostPercentage}%</div>
          <span className="text-[9px] text-gray-400 mt-1 block">Direct COGS ratio</span>
        </div>
        <div className="cc-card p-3 border-l-2 border-l-emerald-500">
          <span className="text-[9px] text-gray-400 uppercase font-bold tracking-wider block mb-0.5">6. Gross Margin</span>
          <div className="text-lg font-extrabold text-emerald-400">{grossMarginPercentage}%</div>
          <span className="text-[9px] text-gray-400 mt-1 block">Profit yield</span>
        </div>
        <div className="cc-card p-3">
          <span className="text-[9px] text-gray-400 uppercase font-bold tracking-wider block mb-0.5">7. Wastage %</span>
          <div className="text-lg font-extrabold text-red-400">{wastagePercentage}%</div>
          <span className="text-[9px] text-gray-400 mt-1 block">Below 1.0% limit</span>
        </div>
      </div>

      {/* Sub Navigation Tabs */}
      <section className="flex flex-wrap gap-1 bg-[#111827] border border-white/5 p-2 rounded-xl">
        {subSectionsList.map((sec) => (
          <button
            key={sec.id}
            onClick={() => setSubSection(sec.id)}
            className={`px-3 py-1.5 rounded text-xs font-semibold flex items-center gap-1.5 transition-all ${
              subSection === sec.id 
                ? 'bg-blue-600 text-white shadow shadow-blue-600/10' 
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <i className={`fa-solid ${sec.icon} text-[11px]`}></i>
            <span>{sec.label}</span>
          </button>
        ))}
      </section>

      {/* 1. OVERVIEW */}
      {subSection === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="cc-card">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-4">Fastest Moving Products</h3>
              <div className="space-y-3">
                {products.slice(0, 4).map(p => {
                  const estSold = Math.round(unitsSold * 0.28);
                  return (
                    <div key={p.productId} className="flex justify-between items-center text-xs p-2.5 rounded bg-black/20 border border-white/5">
                      <div>
                        <span className="font-semibold text-white block">{p.name}</span>
                        <span className="text-[10px] text-gray-400">{p.category} • Price: {formatCurrency(p.price)}</span>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-[#f5b041] block">{estSold} Units</span>
                        <span className="text-[10px] text-emerald-400 font-semibold">{formatCurrency(estSold * p.price)}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="cc-card">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-4">Stock Warning Indicators</h3>
              <div className="space-y-3">
                {products.filter(p => p.status !== 'Healthy').map((p) => (
                  <div key={p.productId} className="p-3 rounded bg-black/20 border border-white/5 flex justify-between items-center text-xs">
                    <div>
                      <span className="font-bold text-white block">{p.name}</span>
                      <span className="text-[10px] text-gray-400 uppercase mt-0.5">{p.category}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        p.status === 'Low Stock' ? 'bg-amber-500/10 text-amber-400' : 'bg-red-500/10 text-red-400'
                      }`}>
                        {p.stock} Units ({p.status})
                      </span>
                      <button 
                        onClick={() => handleStockUpdate(p.productId, true)}
                        className="px-2 py-1 rounded bg-blue-600/30 text-blue-300 text-[10px] hover:bg-blue-600/50"
                      >
                        +50 Restock
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. CATALOG */}
      {subSection === 'catalog' && (
        <div className="cc-card">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400">F&amp;B Menu Catalog</h3>
            <span className="text-xs text-gray-400">Active Menu Items: <strong className="text-white">{products.length}</strong></span>
          </div>
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
                  <th className="pb-3 text-center">Stock Control</th>
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
                      <td className="py-3 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button onClick={() => handleStockUpdate(p.productId, false)} className="w-6 h-6 rounded bg-white/5 hover:bg-white/10 text-gray-300">-</button>
                          <span className="font-mono text-xs w-10 text-center font-bold text-white">{p.stock}</span>
                          <button onClick={() => handleStockUpdate(p.productId, true)} className="w-6 h-6 rounded bg-white/5 hover:bg-white/10 text-gray-300">+</button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. CATEGORIES */}
      {subSection === 'categories' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: 'Popcorn Varieties', count: '4 Items', share: '48% Sales', margin: '82%', icon: 'fa-bowl-rice', desc: 'Caramel, Cheddar Cheese, Butter Salted, Peri-Peri' },
              { name: 'Cold Fountain Beverages', count: '6 Items', share: '24% Sales', margin: '88%', icon: 'fa-bottle-water', desc: 'Pepsi, 7Up, Mirinda, Mountain Dew, Bottled Water' },
              { name: 'Value Combos & Bundles', count: '5 Combos', share: '20% Sales', margin: '74%', icon: 'fa-box-open', desc: 'Cinema Duet, Couple Recliner Platter, Family Feast' },
              { name: 'Gourmet Hot Snacks', count: '6 Items', share: '6% Sales', margin: '68%', icon: 'fa-pizza-slice', desc: 'Loaded Nachos, Gourmet Burgers, Paneer Sliders' },
              { name: 'Desserts & Confectionery', count: '3 Items', share: '2% Sales', margin: '62%', icon: 'fa-ice-cream', desc: 'Choco Lava Cup, Ice Creams, Gourmet Candy' }
            ].map(cat => (
              <div key={cat.name} className="cc-card">
                <div className="flex justify-between items-start mb-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center text-lg">
                    <i className={`fa-solid ${cat.icon}`}></i>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {cat.margin} Margin
                  </span>
                </div>
                <h4 className="font-bold text-white text-sm">{cat.name}</h4>
                <p className="text-gray-400 text-xs mt-1">{cat.desc}</p>
                <div className="flex justify-between items-center text-[11px] text-gray-400 mt-4 pt-3 border-t border-white/5">
                  <span>{cat.count}</span>
                  <strong className="text-[#f5b041]">{cat.share}</strong>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. COMBOS */}
      {subSection === 'combos' && (
        <div className="cc-card">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-4">Configured Concession Combo Bundles</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { name: 'Couple Recliner VIP Platter', items: '2 Large Caramel Popcorn + 2 Large Sodas + Cheese Nachos', price: 650, saving: 'Save ₹120', badge: 'Ahilyanagar Favorite' },
              { name: 'Cinema Duet Combo', items: '1 Regular Salted Popcorn + 2 Medium Fountain Sodas', price: 380, saving: 'Save ₹60', badge: 'High Volume' },
              { name: 'Family Blockbuster Feast', items: '2 Tub Popcorn + 4 Sodas + 2 Nachos Packs', price: 950, saving: 'Save ₹240', badge: 'Weekend Special' },
              { name: 'Kids Junior Snack Box', items: '1 Small Popcorn + 1 Real Fruit Juice + Candy Bar', price: 240, saving: 'Save ₹40', badge: 'Family Choice' }
            ].map(combo => (
              <div key={combo.name} className="p-4 rounded-xl bg-black/20 border border-white/5 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold text-white text-sm">{combo.name}</h4>
                    <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      {combo.badge}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mb-3">{combo.items}</p>
                </div>
                <div className="flex justify-between items-center pt-3 border-t border-white/5">
                  <span className="text-xs text-emerald-400 font-semibold">{combo.saving}</span>
                  <span className="text-base font-extrabold text-white">{formatCurrency(combo.price)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. SALES TRANSACTIONS */}
      {subSection === 'sales' && (
        <div className="cc-card">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-4">Concessions POS Sales Log</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/10 text-gray-400">
                  <th className="py-2.5 font-semibold">Tx ID</th>
                  <th className="py-2.5 font-semibold">Timestamp</th>
                  <th className="py-2.5 font-semibold">Ordered Items</th>
                  <th className="py-2.5 font-semibold">Channel</th>
                  <th className="py-2.5 font-semibold">Cashier</th>
                  <th className="py-2.5 text-right font-semibold">Amount</th>
                  <th className="py-2.5 text-center font-semibold">Payment</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {[
                  { id: 'TX-FB-901', time: '14:22 PM', items: 'Couple Recliner VIP Platter x1', channel: 'Counter POS 1', cashier: isAhilyanagar ? 'Snehal Deshmukh' : 'Priya Nair', amount: 650, pay: 'UPI (GPay)' },
                  { id: 'TX-FB-902', time: '14:26 PM', items: 'Jumbo Popcorn x2, Diet Pepsi x2', channel: 'In-Seat Delivery', cashier: isAhilyanagar ? 'Ramesh Kadam' : 'Aarav Sharma', amount: 560, pay: 'Credit Card' },
                  { id: 'TX-FB-903', time: '14:30 PM', items: 'Cinema Duet Combo x1', channel: 'Self Kiosk', cashier: 'Lobby Kiosk #01', amount: 380, pay: 'UPI (Paytm)' },
                  { id: 'TX-FB-904', time: '14:35 PM', items: 'Nachos with Cheese Dip x1', channel: 'Counter POS 2', cashier: isAhilyanagar ? 'Snehal Deshmukh' : 'Priya Nair', amount: 220, pay: 'Cash' }
                ].map(tx => (
                  <tr key={tx.id} className="hover:bg-white/5 transition-colors">
                    <td className="py-3 font-mono font-bold text-gray-300">{tx.id}</td>
                    <td className="py-3 text-gray-400">{tx.time}</td>
                    <td className="py-3 font-semibold text-white">{tx.items}</td>
                    <td className="py-3 text-gray-300">{tx.channel}</td>
                    <td className="py-3 text-amber-300">{tx.cashier}</td>
                    <td className="py-3 text-right font-bold text-emerald-400">{formatCurrency(tx.amount)}</td>
                    <td className="py-3 text-center text-gray-400">{tx.pay}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 6. INVENTORY */}
      {subSection === 'inventory' && (
        <div className="cc-card">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400">Stock &amp; Inventory Management</h3>
            <button onClick={() => setIsPoModalOpen(true)} className="cc-btn cc-btn-primary text-xs py-1.5 px-3 flex items-center gap-1.5">
              <i className="fa-solid fa-plus"></i> Create Purchase Order
            </button>
          </div>
          <div className="space-y-3">
            {products.map(p => (
              <div key={p.productId} className="p-3 bg-black/20 rounded border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div>
                  <h4 className="font-semibold text-white">{p.name}</h4>
                  <span className="text-gray-400 text-[11px]">Category: {p.category} • Cost: {formatCurrency(p.cost)} • Selling: {formatCurrency(p.price)}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <strong className="text-sm text-white block">{p.stock} units</strong>
                    <span className="text-[10px] text-gray-400">Min Threshold: 40 units</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <button onClick={() => handleStockUpdate(p.productId, false)} className="w-6 h-6 rounded bg-white/5 hover:bg-white/10 text-gray-300">-</button>
                    <button onClick={() => handleStockUpdate(p.productId, true)} className="w-6 h-6 rounded bg-white/5 hover:bg-white/10 text-gray-300">+</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 7. PURCHASE ORDERS */}
      {subSection === 'purchase-orders' && (
        <div className="space-y-6">
          <div className="cc-card">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400">Purchase Orders Registry</h3>
                <p className="text-xs text-gray-500">Inward inventory shipments and supplier purchase orders</p>
              </div>
              <button onClick={() => setIsPoModalOpen(true)} className="cc-btn cc-btn-primary text-xs py-1.5 px-3 flex items-center gap-1.5">
                <i className="fa-solid fa-plus"></i> New Purchase Order
              </button>
            </div>

            <div className="space-y-3">
              {purchaseOrders.map(po => (
                <div key={po.id} className="p-3 bg-black/20 rounded border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-amber-400">{po.id}</span>
                      <strong className="text-white text-sm">{po.supplier}</strong>
                    </div>
                    <p className="text-gray-400 mt-1">{po.items}</p>
                    <span className="text-[10px] text-gray-500 mt-0.5 block">Issued: {po.date} • Expected Delivery: {po.expectedDate}</span>
                  </div>
                  <div className="flex items-center gap-4 self-end sm:self-auto">
                    <span className="font-bold text-white text-sm">{formatCurrency(po.amount)}</span>
                    <span className={`px-2.5 py-1 rounded text-xs font-bold ${
                      po.status === 'Delivered' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : (po.status === 'In Transit' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20')
                    }`}>
                      {po.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* New PO Modal */}
          {isPoModalOpen && (
            <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 animate-fade">
              <div className="bg-[#111827] border border-white/10 rounded-xl p-6 max-w-md w-full space-y-4">
                <div className="flex justify-between items-center border-b border-white/10 pb-3">
                  <h3 className="font-bold text-white text-sm uppercase">Generate Concession Purchase Order</h3>
                  <button onClick={() => setIsPoModalOpen(false)} className="text-gray-400 hover:text-white">&times;</button>
                </div>
                <form onSubmit={handleCreatePo} className="space-y-3 text-xs">
                  <div>
                    <label className="text-gray-400 block mb-1">Approved Supplier</label>
                    <select 
                      value={poForm.supplier} 
                      onChange={(e) => setPoForm({ ...poForm, supplier: e.target.value })}
                      className="w-full cc-input py-1.5"
                    >
                      <option value="Bactavia Agro Concessions">Bactavia Agro Concessions (Corn &amp; Seasonings)</option>
                      <option value="Varun Beverages Ltd (PepsiCo)">Varun Beverages Ltd (PepsiCo India)</option>
                      <option value="Cornitos Tortilla Supplies">Cornitos Tortilla Supplies (Nachos)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-gray-400 block mb-1">Line Items &amp; Quantities</label>
                    <textarea 
                      value={poForm.items}
                      onChange={(e) => setPoForm({ ...poForm, items: e.target.value })}
                      placeholder="e.g. 500kg Corn Kernels, 50 tins Butter Salt"
                      className="w-full cc-input py-1.5 h-20"
                      required
                    ></textarea>
                  </div>
                  <div>
                    <label className="text-gray-400 block mb-1">Estimated Purchase Amount (₹)</label>
                    <input 
                      type="number"
                      value={poForm.amount}
                      onChange={(e) => setPoForm({ ...poForm, amount: e.target.value })}
                      placeholder="45000"
                      className="w-full cc-input py-1.5"
                      required
                    />
                  </div>
                  <div className="flex justify-end gap-2 pt-2 border-t border-white/10">
                    <button type="button" onClick={() => setIsPoModalOpen(false)} className="cc-btn cc-btn-outline py-1.5 px-3">Cancel</button>
                    <button type="submit" className="cc-btn cc-btn-primary py-1.5 px-3">Submit Order</button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 8. WASTAGE TRACKING */}
      {subSection === 'wastage' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="cc-card">
              <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold block mb-1">Total Wastage Cost</span>
              <div className="text-3xl font-extrabold text-red-400">{formatCurrency(wastageTotalCost)}</div>
              <div className="text-xs text-gray-400 mt-2">{wastagePercentage}% of gross F&amp;B revenue</div>
            </div>
            <div className="cc-card">
              <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold block mb-1">Corporate Wastage Tolerance</span>
              <div className="text-3xl font-extrabold text-emerald-400">&lt; 1.00%</div>
              <div className="text-xs text-gray-400 mt-2">Currently well within acceptable benchmark</div>
            </div>
            <div className="cc-card">
              <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold block mb-1">Incidents Logged</span>
              <div className="text-3xl font-extrabold text-white">{wastageList.length}</div>
              <div className="text-xs text-gray-400 mt-2">All items audited with supervisor sign-off</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="cc-card md:col-span-1">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-4">Record New Wastage</h3>
              <form onSubmit={handleWastageSubmit} className="space-y-3 text-xs">
                <div>
                  <label className="text-gray-400 block mb-1">Product</label>
                  <select 
                    value={wastageForm.product} 
                    onChange={(e) => setWastageForm({ ...wastageForm, product: e.target.value })}
                    className="w-full cc-input py-1.5"
                  >
                    {products.map(p => (
                      <option key={p.productId} value={p.productId}>{p.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-gray-400 block mb-1">Wasted Quantity (Units / Kg)</label>
                  <input 
                    type="number"
                    value={wastageForm.qty}
                    onChange={(e) => setWastageForm({ ...wastageForm, qty: e.target.value })}
                    placeholder="e.g. 5"
                    className="w-full cc-input py-1.5"
                    required
                  />
                </div>
                <div>
                  <label className="text-gray-400 block mb-1">Reason for Wastage</label>
                  <select 
                    value={wastageForm.reason} 
                    onChange={(e) => setWastageForm({ ...wastageForm, reason: e.target.value })}
                    className="w-full cc-input py-1.5"
                  >
                    <option value="Expired">Past Shelf Life / Expired</option>
                    <option value="Packaging Damage">Packaging / Seal Damage</option>
                    <option value="Prep Spillage">Kitchen Preparation Spillage</option>
                    <option value="Machine Malfunction">Dispenser Machine Leak</option>
                  </select>
                </div>
                <button type="submit" className="w-full cc-btn cc-btn-primary py-2 mt-2">Log Wastage Incident</button>
              </form>
            </div>

            <div className="cc-card md:col-span-2">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-4">Historical Wastage Incidents</h3>
              <div className="space-y-3">
                {wastageList.map((w, idx) => (
                  <div key={idx} className="p-3 bg-black/20 rounded border border-white/5 flex justify-between items-center text-xs">
                    <div>
                      <strong className="text-white text-sm block">{w.product}</strong>
                      <span className="text-gray-400 text-[11px]">Reason: {w.reason} • Logged by: {w.employee} ({w.date})</span>
                    </div>
                    <div className="text-right">
                      <span className="text-red-400 font-bold block">{w.qty}</span>
                      <span className="text-gray-500 text-[10px]">Cost: {formatCurrency(w.cost)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 9. SUPPLIERS */}
      {subSection === 'suppliers' && (
        <div className="cc-card">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-4">Approved Corporate Food &amp; Beverage Suppliers</h3>
          <div className="space-y-3">
            {[
              { name: 'Bactavia Agro Concessions India', supply: 'Raw Butterfly Popcorn Kernels, Flavacol, Coconut Oil', contact: 'Deepak Saxena (+91 98230 44102)', terms: 'Net 30 Days', sla: '100% On-time' },
              { name: 'Varun Beverages Limited (PepsiCo India)', supply: 'Fountain Syrup Canisters, Bottled Water, Aquafina', contact: 'Regional Key Account Lead (+91 22 6120 9000)', terms: 'Net 15 Days', sla: '99.5% On-time' },
              { name: 'Cornitos Foods Pvt Ltd', supply: 'Crispy Tortilla Nachos, Salsa & Cheese Dips', contact: 'Supply Lead (+91 11 4100 8200)', terms: 'Net 30 Days', sla: '98.8% On-time' }
            ].map(sup => (
              <div key={sup.name} className="p-3 bg-black/20 rounded border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div>
                  <h4 className="font-bold text-white text-sm">{sup.name}</h4>
                  <p className="text-gray-400 text-[11px] mt-0.5">Supplies: {sup.supply}</p>
                  <span className="text-gray-500 text-[10px] mt-1 block">Contact: {sup.contact} • Terms: {sup.terms}</span>
                </div>
                <span className="px-2.5 py-1 rounded font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 text-xs self-start sm:self-auto">
                  {sup.sla} SLA
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 10. MARGINS */}
      {subSection === 'margins' && (
        <div className="space-y-6">
          <div className="cc-card">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-4">Product Profitability &amp; Cost Structure</h3>
            <div className="space-y-4">
              {products.map(p => {
                const profit = p.price - p.cost;
                const marginPct = Math.round((profit / p.price) * 100);
                return (
                  <div key={p.productId} className="p-3 bg-black/20 rounded border border-white/5 text-xs">
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="font-semibold text-white">{p.name} ({p.category})</span>
                      <span className="font-bold text-emerald-400">{marginPct}% Margin (₹{profit} / unit)</span>
                    </div>
                    <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden flex">
                      <div className="bg-red-500/80 h-full" style={{ width: `${100 - marginPct}%` }} title={`Cost: ₹${p.cost}`}></div>
                      <div className="bg-emerald-500 h-full" style={{ width: `${marginPct}%` }} title={`Profit: ₹${profit}`}></div>
                    </div>
                    <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                      <span>COGS: {formatCurrency(p.cost)}</span>
                      <span>Selling Price: {formatCurrency(p.price)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
