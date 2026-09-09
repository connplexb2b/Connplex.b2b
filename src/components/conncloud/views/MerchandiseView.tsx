import React, { useState } from 'react';
import Image from 'next/image';
import { ConnCloudStore, MerchandiseProduct, MerchandiseOrder } from '../../../lib/conncloudData';

interface MerchandiseViewProps {
  selectedCinemaId: string;
  selectedDateRange: string;
  triggerNotification: (msg: string) => void;
}

export default function MerchandiseView({
  selectedCinemaId,
  selectedDateRange,
  triggerNotification
}: MerchandiseViewProps) {
  const [subSection, setSubSection] = useState<'catalog' | 'orders' | 'inventory'>('catalog');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Data from store
  const isAhilyanagar = selectedCinemaId === 'c5';
  const [products, setProducts] = useState<MerchandiseProduct[]>(ConnCloudStore.getMerchandiseProducts());
  const [orders, setOrders] = useState<MerchandiseOrder[]>(() => {
    return ConnCloudStore.getMerchandiseOrders().filter(o => 
      selectedCinemaId === 'all' || o.cinemaId === selectedCinemaId
    );
  });

  React.useEffect(() => {
    setOrders(ConnCloudStore.getMerchandiseOrders().filter(o => 
      selectedCinemaId === 'all' || o.cinemaId === selectedCinemaId
    ));
  }, [selectedCinemaId]);

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isStockModalOpen, setIsStockModalOpen] = useState(false);
  const [activeProductForStock, setActiveProductForStock] = useState<MerchandiseProduct | null>(null);
  const [newStockValue, setNewStockValue] = useState<number>(0);

  // Add product form state
  const [addForm, setAddForm] = useState({
    name: '',
    sku: '',
    category: 'Collectibles' as MerchandiseProduct['category'],
    price: '',
    costPrice: '',
    stock: '',
    minStock: '10',
    description: '',
    image: '/merchandise/icon_1.png'
  });

  const categories: string[] = ['all', 'Drinkware', 'Stationery', 'Collectibles', 'Tech', 'Apparel'];

  // Currency formatter
  const formatCurrency = (val: number) => {
    return `₹${val.toLocaleString('en-IN')}`;
  };

  // Filtered products
  const filteredProducts = products.filter(p => {
    const matchesCat = selectedCategory === 'all' || p.category === selectedCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  // Financial KPI calculations
  const totalCatalogItems = products.length;
  const totalUnitsSold = products.reduce((acc, p) => acc + p.salesCount, 0);
  const totalStockValue = products.reduce((acc, p) => acc + (p.stock * p.price), 0);
  const totalRevenue = orders.reduce((acc, o) => acc + o.totalAmount, 0);
  const lowStockCount = products.filter(p => p.status === 'Low Stock' || p.status === 'Out of Stock').length;

  // Handle Add Product Submit
  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addForm.name || !addForm.price || !addForm.stock) return;

    const price = parseFloat(addForm.price);
    const costPrice = parseFloat(addForm.costPrice) || Math.round(price * 0.4);
    const stock = parseInt(addForm.stock, 10);
    const minStock = parseInt(addForm.minStock, 10) || 10;
    const sku = addForm.sku || `CX-MER-${Math.floor(100 + Math.random() * 900)}`;

    const newProd = ConnCloudStore.addMerchandiseProduct({
      name: addForm.name.toUpperCase(),
      sku,
      category: addForm.category,
      price,
      costPrice,
      stock,
      minStock,
      image: addForm.image || '/merchandise/icon_1.png',
      status: stock === 0 ? 'Out of Stock' : (stock <= minStock ? 'Low Stock' : 'In Stock'),
      description: addForm.description || 'Exclusive cinema branded merchandise.'
    });

    setProducts(ConnCloudStore.getMerchandiseProducts());
    setIsAddModalOpen(false);
    setAddForm({
      name: '',
      sku: '',
      category: 'Collectibles',
      price: '',
      costPrice: '',
      stock: '',
      minStock: '10',
      description: '',
      image: '/merchandise/icon_1.png'
    });
    triggerNotification(`Added new merchandise item: ${newProd.name}`);
  };

  // Open stock adjustment modal
  const openStockModal = (product: MerchandiseProduct) => {
    setActiveProductForStock(product);
    setNewStockValue(product.stock);
    setIsStockModalOpen(true);
  };

  // Handle Stock Update
  const handleSaveStock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeProductForStock) return;

    ConnCloudStore.updateMerchandiseStock(activeProductForStock.productId, newStockValue);
    setProducts(ConnCloudStore.getMerchandiseProducts());
    setIsStockModalOpen(false);
    triggerNotification(`Updated inventory for ${activeProductForStock.name}: ${newStockValue} units.`);
  };

  // Quick Counter Sale simulation
  const handleQuickSale = (prod: MerchandiseProduct) => {
    if (prod.stock <= 0) {
      triggerNotification(`Cannot sell: ${prod.name} is currently out of stock.`);
      return;
    }

    // Deduct 1 stock
    ConnCloudStore.updateMerchandiseStock(prod.productId, prod.stock - 1);
    
    // Create quick order
    const newOrd = ConnCloudStore.createMerchandiseOrder({
      date: new Date().toISOString().replace('T', ' ').substring(0, 16),
      customerName: 'Counter Guest',
      cinemaId: selectedCinemaId === 'all' ? 'c1' : selectedCinemaId,
      items: [{ productId: prod.productId, name: prod.name, quantity: 1, price: prod.price }],
      totalAmount: prod.price,
      channel: 'Counter',
      paymentMethod: 'UPI',
      status: 'Fulfilled'
    });

    setProducts(ConnCloudStore.getMerchandiseProducts());
    setOrders(prev => [newOrd, ...prev]);
    triggerNotification(`Counter POS Sale: 1x ${prod.name} (₹${prod.price}) fulfilled!`);
  };

  return (
    <div className="space-y-6">
      {/* Ahilyanagar Merchandise Banner */}
      {isAhilyanagar && (
        <div className="p-4 rounded-xl bg-gradient-to-r from-amber-900/30 via-orange-900/15 to-transparent border border-amber-500/30 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
          <div className="flex items-start md:items-center gap-3">
            <span className="relative flex h-3 w-3 mt-0.5 md:mt-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
            </span>
            <div>
              <span className="font-bold text-amber-300 uppercase tracking-wider text-[11px] block">
                Ahilyanagar Concession & Retail Store Active
              </span>
              <span className="text-gray-300 text-[11px]">
                Auditorium Foyer Retail: Premium Tumblers, NFC Metal VIP Founder Cards & Collectibles • Orders linked to Ahilyanagar Counter POS
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 self-start md:self-auto font-mono text-[11px] text-amber-300 bg-amber-950/60 px-2.5 py-1 rounded border border-amber-500/30">
            <span>AHILYA STORE ONLINE</span>
          </div>
        </div>
      )}

      {/* Top Banner & KPI Section */}
      <section className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[#111827] border border-white/5 p-6 rounded-xl">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#f5b041]/10 text-[#f5b041] border border-[#f5b041]/20 uppercase tracking-wide">
              <i className="fa-solid fa-store text-[10px]"></i>
              Retail & Store Operations
            </span>
            {lowStockCount > 0 && (
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                {lowStockCount} Re-order Alert{lowStockCount > 1 ? 's' : ''}
              </span>
            )}
          </div>
          <h1 className="text-2xl font-bold mt-2 tracking-tight text-white">Merchandise & Store Management</h1>
          <p className="text-xs text-gray-400 mt-1">
            Manage cinema souvenirs, apparel, collector reels, inventory tracking, and POS retail checkouts.
          </p>
        </div>

        <div className="flex gap-2.5">
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="cc-btn cc-btn-accent text-xs"
          >
            <i className="fa-solid fa-plus"></i> Add Merchandise Item
          </button>
          <button 
            onClick={() => triggerNotification('Exporting Retail Sales & Inventory Ledger...')}
            className="cc-btn cc-btn-outline text-xs"
          >
            <i className="fa-solid fa-download"></i> Export Inventory
          </button>
        </div>
      </section>

      {/* KPI Stats Grid */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="cc-card">
          <div className="flex justify-between items-center mb-1">
            <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Catalog SKUs</span>
            <i className="fa-solid fa-boxes-stacked text-blue-400 text-xs"></i>
          </div>
          <div className="text-xl font-bold text-white">{totalCatalogItems} Products</div>
          <div className="text-[10px] text-gray-400 mt-1">Across 5 distinct product lines</div>
        </div>

        <div className="cc-card">
          <div className="flex justify-between items-center mb-1">
            <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Total Units Sold</span>
            <i className="fa-solid fa-cart-shopping text-emerald-400 text-xs"></i>
          </div>
          <div className="text-xl font-bold text-emerald-400">{totalUnitsSold.toLocaleString('en-IN')} Units</div>
          <div className="text-[10px] text-emerald-400/80 mt-1">+14.2% vs previous period</div>
        </div>

        <div className="cc-card">
          <div className="flex justify-between items-center mb-1">
            <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Store Retail Revenue</span>
            <i className="fa-solid fa-indian-rupee-sign text-[#f5b041] text-xs"></i>
          </div>
          <div className="text-xl font-bold text-[#f5b041]">{formatCurrency(totalRevenue || 28450)}</div>
          <div className="text-[10px] text-gray-400 mt-1">Counter + Online + Kiosks</div>
        </div>

        <div className="cc-card">
          <div className="flex justify-between items-center mb-1">
            <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Inventory Value</span>
            <i className="fa-solid fa-warehouse text-purple-400 text-xs"></i>
          </div>
          <div className="text-xl font-bold text-white">{formatCurrency(totalStockValue)}</div>
          <div className="text-[10px] text-gray-400 mt-1">Total retail shelf valuation</div>
        </div>
      </section>

      {/* Tabs */}
      <section className="flex flex-wrap gap-1 bg-[#111827] border border-white/5 p-2 rounded-xl">
        <button
          onClick={() => setSubSection('catalog')}
          className={`px-3 py-1.5 rounded text-xs font-semibold transition-all ${
            subSection === 'catalog'
              ? 'bg-blue-600 text-white shadow shadow-blue-600/10'
              : 'text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <i className="fa-solid fa-grid-2 mr-1.5"></i> Store Catalog & POS
        </button>
        <button
          onClick={() => setSubSection('orders')}
          className={`px-3 py-1.5 rounded text-xs font-semibold transition-all ${
            subSection === 'orders'
              ? 'bg-blue-600 text-white shadow shadow-blue-600/10'
              : 'text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <i className="fa-solid fa-receipt mr-1.5"></i> Retail Orders Ledger
        </button>
        <button
          onClick={() => setSubSection('inventory')}
          className={`px-3 py-1.5 rounded text-xs font-semibold transition-all ${
            subSection === 'inventory'
              ? 'bg-blue-600 text-white shadow shadow-blue-600/10'
              : 'text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <i className="fa-solid fa-boxes-packing mr-1.5"></i> Inventory & Stock Health
        </button>
      </section>

      {/* 1. CATALOG & POS TAB */}
      {subSection === 'catalog' && (
        <div className="space-y-4">
          {/* Controls: Search and Category Filter */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-[#111827]/60 p-3 rounded-lg border border-white/5">
            {/* Category Pills */}
            <div className="flex flex-wrap gap-1.5">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-2.5 py-1 rounded text-xs font-medium capitalize transition-all ${
                    selectedCategory === cat
                      ? 'bg-white/10 text-white border border-white/20'
                      : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-64">
              <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xs"></i>
              <input
                type="text"
                placeholder="Search merchandise or SKU..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="cc-input pl-9 w-full text-xs"
              />
            </div>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filteredProducts.map((product) => {
              const margin = Math.round(((product.price - product.costPrice) / product.price) * 100);
              return (
                <div 
                  key={product.productId}
                  className="cc-card p-4 flex flex-col justify-between group hover:border-[#f5b041]/40 transition-all bg-[#111827] border border-white/5 rounded-xl"
                >
                  <div>
                    {/* Image Container with official Connplex assets */}
                    <div className="relative w-full h-36 bg-black/40 rounded-lg overflow-hidden border border-white/5 flex items-center justify-center p-3 mb-3 group-hover:scale-[1.02] transition-transform">
                      <Image 
                        src={product.image}
                        alt={product.name}
                        width={120}
                        height={120}
                        className="object-contain max-h-full"
                        priority={false}
                      />
                      {/* Status Tag */}
                      <span className={`absolute top-2 right-2 px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wider ${
                        product.status === 'In Stock'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : (product.status === 'Low Stock' 
                              ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                              : 'bg-red-500/20 text-red-400 border border-red-500/30')
                      }`}>
                        {product.status}
                      </span>
                    </div>

                    {/* Meta info */}
                    <div className="flex items-center justify-between text-[10px] text-gray-400 mb-1">
                      <span className="font-mono">{product.sku}</span>
                      <span className="bg-white/5 px-1.5 py-0.5 rounded text-gray-300">{product.category}</span>
                    </div>

                    <h3 className="text-xs font-bold text-white tracking-tight line-clamp-1 group-hover:text-[#f5b041] transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-[10px] text-gray-400 mt-1 line-clamp-2 h-7">
                      {product.description}
                    </p>

                    {/* Price and Margin */}
                    <div className="flex items-baseline justify-between mt-3 pt-2 border-t border-white/5">
                      <div>
                        <span className="text-base font-bold text-white">{formatCurrency(product.price)}</span>
                        <span className="text-[10px] text-gray-500 block">Cost: {formatCurrency(product.costPrice)}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-emerald-400 font-semibold">{margin}% Margin</span>
                        <span className="text-[10px] text-gray-400 block font-mono">{product.stock} in stock</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="grid grid-cols-2 gap-2 mt-4">
                    <button
                      onClick={() => handleQuickSale(product)}
                      disabled={product.stock <= 0}
                      className={`py-1.5 px-2 rounded text-[11px] font-bold flex items-center justify-center gap-1 transition-colors ${
                        product.stock > 0 
                          ? 'bg-blue-600 hover:bg-blue-500 text-white' 
                          : 'bg-gray-800 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      <i className="fa-solid fa-cart-plus text-[10px]"></i> Sell POS
                    </button>
                    <button
                      onClick={() => openStockModal(product)}
                      className="py-1.5 px-2 rounded text-[11px] font-semibold bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10 flex items-center justify-center gap-1"
                    >
                      <i className="fa-solid fa-pen-to-square text-[10px]"></i> Stock
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-12 cc-card">
              <i className="fa-solid fa-store-slash text-3xl text-gray-600 mb-2"></i>
              <p className="text-sm text-gray-400">No merchandise found matching your search.</p>
              <button 
                onClick={() => { setSelectedCategory('all'); setSearchQuery(''); }}
                className="mt-3 cc-btn cc-btn-outline text-xs"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      )}

      {/* 2. ORDERS LEDGER TAB */}
      {subSection === 'orders' && (
        <div className="cc-card">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400">
              Retail Sales Ledger & Invoices
            </h3>
            <span className="text-xs text-gray-400 font-mono">
              {orders.length} Completed / In-progress Transactions
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-white/10 text-gray-400">
                  <th className="pb-3 font-semibold">Order ID</th>
                  <th className="pb-3 font-semibold">Date & Time</th>
                  <th className="pb-3 font-semibold">Guest / Purchaser</th>
                  <th className="pb-3 font-semibold">Items Purchased</th>
                  <th className="pb-3 font-semibold">Channel</th>
                  <th className="pb-3 font-semibold">Payment</th>
                  <th className="pb-3 font-semibold text-right">Total Amount</th>
                  <th className="pb-3 font-semibold text-center">Status</th>
                  <th className="pb-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((ord) => (
                  <tr key={ord.orderId} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="py-3 font-mono font-bold text-blue-400">{ord.orderId}</td>
                    <td className="py-3 text-gray-400 font-mono text-[11px]">{ord.date}</td>
                    <td className="py-3 text-white font-medium">{ord.customerName}</td>
                    <td className="py-3 text-gray-300">
                      {ord.items.map((it, idx) => (
                        <span key={idx} className="block text-[11px]">
                          {it.quantity}x {it.name}
                        </span>
                      ))}
                    </td>
                    <td className="py-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-white/5 text-gray-300 border border-white/10">
                        {ord.channel}
                      </span>
                    </td>
                    <td className="py-3 text-gray-400 font-mono">{ord.paymentMethod}</td>
                    <td className="py-3 text-right font-bold text-emerald-400 font-mono">
                      {formatCurrency(ord.totalAmount)}
                    </td>
                    <td className="py-3 text-center">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        ord.status === 'Fulfilled' 
                          ? 'bg-emerald-500/10 text-emerald-400' 
                          : 'bg-amber-500/10 text-amber-400'
                      }`}>
                        {ord.status}
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      <button 
                        onClick={() => triggerNotification(`Printing tax invoice receipt for order #${ord.orderId}...`)}
                        className="text-gray-400 hover:text-white p-1 rounded hover:bg-white/5 transition-colors"
                        title="Print / View Receipt"
                      >
                        <i className="fa-solid fa-print"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. INVENTORY & STOCK HEALTH TAB */}
      {subSection === 'inventory' && (
        <div className="cc-card">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400">
                Inventory Health & Reorder Thresholds
              </h3>
              <p className="text-xs text-gray-500">Automated safety buffer tracking across cinema warehouses.</p>
            </div>
            <button 
              onClick={() => triggerNotification('Automated restock purchase orders triggered to central commissary.')}
              className="cc-btn cc-btn-primary text-xs"
            >
              <i className="fa-solid fa-truck-ramp-box"></i> Order Commissary Restock
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-white/10 text-gray-400">
                  <th className="pb-3 font-semibold">SKU & Item Name</th>
                  <th className="pb-3 font-semibold">Category</th>
                  <th className="pb-3 font-semibold text-right">Retail Price</th>
                  <th className="pb-3 font-semibold text-right">Cost Price</th>
                  <th className="pb-3 font-semibold text-center">Safety Min</th>
                  <th className="pb-3 font-semibold text-center">Current Stock</th>
                  <th className="pb-3 font-semibold text-center">Health Status</th>
                  <th className="pb-3 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.productId} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded bg-black/40 border border-white/5 p-1 flex items-center justify-center flex-shrink-0">
                          <Image src={p.image} alt={p.name} width={28} height={28} className="object-contain" />
                        </div>
                        <div>
                          <span className="font-bold text-white block">{p.name}</span>
                          <span className="text-[10px] text-gray-400 font-mono">{p.sku}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 text-gray-300">{p.category}</td>
                    <td className="py-3 text-right font-mono font-semibold text-white">{formatCurrency(p.price)}</td>
                    <td className="py-3 text-right font-mono text-gray-400">{formatCurrency(p.costPrice)}</td>
                    <td className="py-3 text-center font-mono text-gray-400">{p.minStock}</td>
                    <td className="py-3 text-center font-mono font-bold text-white">{p.stock}</td>
                    <td className="py-3 text-center">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        p.status === 'In Stock' 
                          ? 'bg-emerald-500/10 text-emerald-400' 
                          : (p.status === 'Low Stock' ? 'bg-amber-500/10 text-amber-400' : 'bg-red-500/10 text-red-400')
                      }`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      <button
                        onClick={() => openStockModal(p)}
                        className="cc-btn cc-btn-outline py-1 px-2.5 text-[10px]"
                      >
                        Adjust Stock
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL: ADD MERCHANDISE ITEM */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-[#111827] border border-white/10 rounded-xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="p-4 border-b border-white/5 flex justify-between items-center bg-black/30">
              <h3 className="font-bold text-sm uppercase tracking-wider text-white flex items-center gap-2">
                <i className="fa-solid fa-shirt text-[#f5b041]"></i> Add Merchandise SKU
              </h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-gray-400 hover:text-white">
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            <form onSubmit={handleAddProduct} className="p-6 space-y-4 text-xs">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase font-bold text-gray-400">Product Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Connplex Cinema Mug"
                  value={addForm.name}
                  onChange={(e) => setAddForm(prev => ({ ...prev, name: e.target.value }))}
                  className="cc-input"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] uppercase font-bold text-gray-400">SKU Code</label>
                  <input
                    type="text"
                    placeholder="Auto-generated if blank"
                    value={addForm.sku}
                    onChange={(e) => setAddForm(prev => ({ ...prev, sku: e.target.value }))}
                    className="cc-input font-mono"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] uppercase font-bold text-gray-400">Category</label>
                  <select
                    value={addForm.category}
                    onChange={(e) => setAddForm(prev => ({ ...prev, category: e.target.value as any }))}
                    className="cc-input"
                  >
                    <option value="Drinkware">Drinkware</option>
                    <option value="Stationery">Stationery</option>
                    <option value="Collectibles">Collectibles</option>
                    <option value="Tech">Tech</option>
                    <option value="Apparel">Apparel</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] uppercase font-bold text-gray-400">Retail Price (₹)</label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 799"
                    value={addForm.price}
                    onChange={(e) => setAddForm(prev => ({ ...prev, price: e.target.value }))}
                    className="cc-input"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] uppercase font-bold text-gray-400">Cost Price (₹)</label>
                  <input
                    type="number"
                    placeholder="e.g. 280"
                    value={addForm.costPrice}
                    onChange={(e) => setAddForm(prev => ({ ...prev, costPrice: e.target.value }))}
                    className="cc-input"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] uppercase font-bold text-gray-400">Initial Stock</label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 50"
                    value={addForm.stock}
                    onChange={(e) => setAddForm(prev => ({ ...prev, stock: e.target.value }))}
                    className="cc-input"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] uppercase font-bold text-gray-400">Min Safety Stock</label>
                  <input
                    type="number"
                    placeholder="e.g. 10"
                    value={addForm.minStock}
                    onChange={(e) => setAddForm(prev => ({ ...prev, minStock: e.target.value }))}
                    className="cc-input"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase font-bold text-gray-400">Description</label>
                <textarea
                  rows={2}
                  placeholder="Brief item description..."
                  value={addForm.description}
                  onChange={(e) => setAddForm(prev => ({ ...prev, description: e.target.value }))}
                  className="cc-input"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="cc-btn cc-btn-outline py-2 px-4"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="cc-btn cc-btn-accent py-2 px-4"
                >
                  Save to Catalog
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: STOCK ADJUSTMENT */}
      {isStockModalOpen && activeProductForStock && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-[#111827] border border-white/10 rounded-xl w-full max-w-sm overflow-hidden shadow-2xl">
            <div className="p-4 border-b border-white/5 flex justify-between items-center bg-black/30">
              <h3 className="font-bold text-sm uppercase tracking-wider text-white">
                Adjust Stock: {activeProductForStock.name}
              </h3>
              <button onClick={() => setIsStockModalOpen(false)} className="text-gray-400 hover:text-white">
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            <form onSubmit={handleSaveStock} className="p-6 space-y-4 text-xs">
              <div className="flex items-center gap-3 p-3 rounded bg-black/40 border border-white/5">
                <div className="w-10 h-10 rounded bg-black/50 p-1 flex items-center justify-center">
                  <Image src={activeProductForStock.image} alt={activeProductForStock.name} width={36} height={36} className="object-contain" />
                </div>
                <div>
                  <div className="font-bold text-white">{activeProductForStock.name}</div>
                  <div className="text-[10px] text-gray-400 font-mono">Current Stock: {activeProductForStock.stock} units</div>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase font-bold text-gray-400">New Physical Count</label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setNewStockValue(prev => Math.max(0, prev - 5))}
                    className="cc-btn cc-btn-outline px-3 py-1.5 text-xs font-bold"
                  >
                    -5
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewStockValue(prev => Math.max(0, prev - 1))}
                    className="cc-btn cc-btn-outline px-3 py-1.5 text-xs font-bold"
                  >
                    -1
                  </button>
                  <input
                    type="number"
                    min={0}
                    value={newStockValue}
                    onChange={(e) => setNewStockValue(parseInt(e.target.value, 10) || 0)}
                    className="cc-input text-center font-bold text-base w-full"
                  />
                  <button
                    type="button"
                    onClick={() => setNewStockValue(prev => prev + 1)}
                    className="cc-btn cc-btn-outline px-3 py-1.5 text-xs font-bold"
                  >
                    +1
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewStockValue(prev => prev + 10)}
                    className="cc-btn cc-btn-outline px-3 py-1.5 text-xs font-bold"
                  >
                    +10
                  </button>
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => setIsStockModalOpen(false)}
                  className="cc-btn cc-btn-outline py-2 px-4"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="cc-btn cc-btn-primary py-2 px-4"
                >
                  Save Stock
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
