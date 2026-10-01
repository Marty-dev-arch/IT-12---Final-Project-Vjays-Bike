import React, { useState } from 'react';
import SlideOver from '../../components/ui/SlideOver';
import StatsCard from '../../components/ui/StatsCard';
import { useInventory } from '../../context/InventoryContext';
import {
  HiOutlineArrowDownTray,
  HiOutlineArrowUpTray,
  HiOutlineArrowsRightLeft,
  HiOutlineMagnifyingGlass,
  HiOutlineArchiveBox,
  HiOutlineCube,
  HiOutlinePhoto,
  HiOutlineTag,
  HiOutlineBuildingStorefront,
} from 'react-icons/hi2';

const categoryLabels: Record<string, string> = {
  'braking-system': 'Braking system',
  'drivetrain-chains': 'Drivetrain & chains',
  'handle-bar-handle-grip': 'Handle Bar & Handle Grip',
  'gears-sprockets': 'Handle Bar & Handle Grip',
};

const FALLBACK_BIKE_IMAGES: Record<string, string> = {
  'bld-180-01': '/images/products/bolids-disc-brake-caliper.jpg',
  'pad-dsk-01': '/images/products/universal-disc-brake-pads.jpg',
  'cn-hg53-01': '/images/products/shimano-cn-hg53-chain.jpg',
  'bck-cas-01': '/images/products/bucklos-bicycle-cassette.jpg',
  'mrc-13t-01': '/images/products/meroca-13t-jockey-wheel.jpg',
  'rgs-r500-01': '/images/products/ragusa-r500-crankset.jpg',
  'insp-hb-01': '/images/products/inspeed-alloy-handlebar.jpg',
  'grp-lck-prp-01': '/images/products/universal-purple-lock-on-grips.jpg',
};

const formatMovementDateTime = (timestampStr: string) => {
  try {
    const d = new Date(timestampStr);
    if (!isNaN(d.getTime())) {
      const dateStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      const timeStr = d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
      return { dateStr, timeStr };
    }
  } catch (e) {}
  return { dateStr: timestampStr || 'Today', timeStr: '' };
};

const StockMovementPage: React.FC = () => {
  const { products, movements, stockIn, stockOut, updateProduct } = useInventory();

  const resolveMovementProduct = (mov: StockMovement) => {
    return products.find(
      (p) =>
        String(p.id) === String(mov.productId) ||
        (mov.sku && p.sku?.trim().toLowerCase() === mov.sku?.trim().toLowerCase()) ||
        (mov.productName && p.name?.trim().toLowerCase() === mov.productName?.trim().toLowerCase())
    );
  };

  const resolveMovementImage = (mov: StockMovement, prod?: Product) => {
    if (mov.image) return mov.image;
    if (prod?.image) return prod.image;
    const skuKey = (mov.sku || '').toLowerCase().trim();
    return FALLBACK_BIKE_IMAGES[skuKey] || '';
  };

  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'in' | 'out'>('all');
  const [stockInDrawerOpen, setStockInDrawerOpen] = useState(false);
  const [stockOutDrawerOpen, setStockOutDrawerOpen] = useState(false);

  // Form states
  const [selectedProductId, setSelectedProductId] = useState('');
  const [quantity, setQuantity] = useState<number | ''>('');
  const [stockInNotes, setStockInNotes] = useState('');
  const [stockOutReason, setStockOutReason] = useState('');
  const [stockOutNotes, setStockOutNotes] = useState('');
  const [actionError, setActionError] = useState('');

  const todayStr = new Date().toDateString();
  const validMovements = movements.filter((mov) =>
    products.some(
      (p) =>
        String(p.id) === String(mov.productId) ||
        (mov.sku && p.sku?.trim().toLowerCase() === mov.sku?.trim().toLowerCase()) ||
        (mov.productName && p.name?.trim().toLowerCase() === mov.productName?.trim().toLowerCase())
    )
  );

  const totalStockInToday = validMovements
    .filter((m) => m.type === 'in' && new Date(m.timestamp).toDateString() === todayStr)
    .reduce((sum, m) => sum + m.quantity, 0);

  const totalStockOutToday = validMovements
    .filter((m) => m.type === 'out' && new Date(m.timestamp).toDateString() === todayStr)
    .reduce((sum, m) => sum + m.quantity, 0);

  const netMovement = totalStockInToday - totalStockOutToday;

  const selectedProduct = products.find((p) => p.id === selectedProductId);

  const filteredMovements = validMovements.filter((mov) => {
    if (filterType !== 'all' && mov.type !== filterType) return false;
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      mov.productName.toLowerCase().includes(q) ||
      mov.sku.toLowerCase().includes(q) ||
      (mov.notes && mov.notes.toLowerCase().includes(q))
    );
  });

  const handleStockInSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setActionError('');
    if (!selectedProductId) {
      setActionError('Please select a part');
      return;
    }
    if (!quantity || Number(quantity) <= 0) {
      setActionError('Please specify a quantity greater than 0');
      return;
    }

    const targetProduct = products.find((p) => p.id === selectedProductId);
    if (targetProduct) {
      const capacity = targetProduct.maxCapacity || targetProduct.quantity || 1;
      if (targetProduct.quantity >= capacity) {
        setActionError(
          `Stock capacity is at maximum (${targetProduct.quantity}/${capacity} units). You need to stock out first before you can stock in to prevent overflow.`
        );
        return;
      }
      if (targetProduct.quantity + Number(quantity) > capacity) {
        const remaining = capacity - targetProduct.quantity;
        setActionError(
          `Cannot stock in ${quantity} units. Only ${remaining} unit(s) remaining before reaching maximum capacity (${capacity}).`
        );
        return;
      }
    }

    const success = stockIn(selectedProductId, Number(quantity), stockInNotes);
    if (success) {
      setStockInDrawerOpen(false);
      setSelectedProductId('');
      setQuantity('');
      setStockInNotes('');
    } else {
      setActionError('Stock in failed. Capacity limit reached.');
    }
  };

  const handleStockOutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setActionError('');
    if (!selectedProductId) {
      setActionError('Please select a part');
      return;
    }
    if (!quantity || Number(quantity) <= 0) {
      setActionError('Please specify a quantity greater than 0');
      return;
    }

    const product = products.find((p) => p.id === selectedProductId);
    if (product && product.quantity < Number(quantity)) {
      setActionError(`Insufficient inventory! Available units: ${product.quantity}`);
      return;
    }

    const success = stockOut(selectedProductId, Number(quantity), stockOutReason || 'General dispatch', stockOutNotes);
    if (success) {
      setStockOutDrawerOpen(false);
      setSelectedProductId('');
      setQuantity('');
      setStockOutReason('');
      setStockOutNotes('');
    } else {
      setActionError('Stock out failed. Insufficient stock or invalid item.');
    }
  };

  // Attach photo to selected product
  const handleAttachImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedProductId) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      updateProduct(selectedProductId, { image: reader.result as string });
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="p-3.5 sm:p-6 lg:p-8 font-poppins pb-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-5">
        <div>
          <h1 className="text-neutral-900 dark:text-[#EDEDED] text-xl sm:text-3xl font-bold tracking-tight">
            Stock movement
          </h1>
          <p className="text-neutral-500 dark:text-[#A1A1A1] text-xs sm:text-sm mt-0.5">
            Track and record floor inventory intake and dispatch transactions
          </p>
        </div>
        <div className="flex items-center justify-end gap-2 w-full sm:w-auto self-end sm:self-auto">
          {/* Stock In Button: Opens right-side SlideOver */}
          <button
            onClick={() => {
              setActionError('');
              setStockInDrawerOpen(true);
            }}
            className="btn-adapt adapt-mobile flex items-center justify-center bg-[#121212] dark:bg-white text-white dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-200 py-2 px-3 sm:py-2.5 sm:px-4 gap-1.5 rounded-lg text-xs font-bold border border-transparent cursor-pointer active:border-red-500 active:scale-[0.98] transition-all"
          >
            <HiOutlineArrowDownTray className="w-3.5 h-3.5" />
            Stock in
          </button>
          {/* Stock Out Button: Opens right-side SlideOver */}
          <button
            onClick={() => {
              setActionError('');
              setStockOutDrawerOpen(true);
            }}
            className="btn-adapt adapt-mobile flex items-center justify-center bg-white dark:bg-[#121212] text-neutral-800 dark:text-[#EDEDED] border border-brand-border dark:border-[#262626] active:border-red-500 hover:bg-neutral-50 dark:hover:bg-[#1A1A1A] py-2 px-3 sm:py-2.5 sm:px-4 gap-1.5 rounded-lg text-xs font-bold cursor-pointer active:scale-[0.98] transition-all"
          >
            <HiOutlineArrowUpTray className="w-3.5 h-3.5 text-neutral-600 dark:text-[#A1A1A1]" />
            Stock out
          </button>
        </div>
      </div>

      {/* Summary Metrics - Dashboard Card Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-5 mb-5 sm:mb-6">
        <StatsCard
          label="Total stock in today"
          value={`${totalStockInToday} units`}
          subtitle="Recorded incoming parts"
          icon={<HiOutlineArrowDownTray className="w-5 h-5 text-neutral-600 dark:text-[#A1A1A1]" />}
        />
        <StatsCard
          label="Total stock out today"
          value={`${totalStockOutToday} units`}
          subtitle="Dispatched from inventory"
          icon={<HiOutlineArrowUpTray className="w-5 h-5 text-neutral-600 dark:text-[#A1A1A1]" />}
        />
        <StatsCard
          label="Net movement"
          value={`${netMovement >= 0 ? `+${netMovement}` : netMovement} units`}
          subtitle="Daily net volume shift"
          icon={<HiOutlineArrowsRightLeft className="w-5 h-5 text-neutral-600 dark:text-[#A1A1A1]" />}
        />
      </div>

      {/* Filter and Clean Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 mb-3.5 sm:mb-5">
        {/* Clean Search Bar */}
        <div className="w-full sm:w-72 flex items-center bg-white dark:bg-[#121212] rounded-xl border border-brand-border dark:border-[#262626] px-3 py-2 sm:px-3.5 sm:py-2.5 gap-2 focus-within:border-brand-orange dark:focus-within:border-[#FB714B] shadow-xs">
          <HiOutlineMagnifyingGlass className="w-3.5 h-3.5 text-neutral-400 dark:text-[#737373] shrink-0" />
          <input
            type="text"
            placeholder="Search movements..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="adapt-mobile w-full text-xs text-neutral-800 dark:text-[#EDEDED] bg-transparent border-0 focus:outline-none placeholder:text-neutral-400 dark:placeholder:text-[#737373] font-poppins"
          />
        </div>

        {/* Filter buttons */}
        <div className="flex items-center justify-between sm:justify-start bg-white dark:bg-[#121212] rounded-xl border border-brand-border dark:border-[#262626] p-1 shadow-xs">
          {(['all', 'in', 'out'] as const).map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`btn-adapt adapt-mobile flex-1 sm:flex-none py-1 px-2.5 sm:px-3 text-[11px] sm:text-xs font-medium rounded-lg transition-all border-0 cursor-pointer ${
                filterType === type
                  ? 'bg-[#FFF5ED] dark:bg-[#1A120E] text-[#C25E00] dark:text-[#FB714B] font-semibold'
                  : 'text-neutral-600 dark:text-[#A1A1A1] hover:text-neutral-900 dark:hover:text-[#EDEDED] bg-transparent'
              }`}
            >
              {type === 'all' ? 'All' : type === 'in' ? 'Stock in' : 'Stock out'}
            </button>
          ))}
        </div>
      </div>


      {/* Movements Table / Minimal Border Layout */}
      <div className="minimal-inventory-container rounded-xl overflow-hidden shadow-xs">
        {filteredMovements.length === 0 ? (
          <div className="py-12 px-4 text-center text-neutral-400 dark:text-[#737373]">
            <HiOutlineArchiveBox className="w-10 h-10 stroke-1 mx-auto mb-2 text-neutral-300 dark:text-[#737373]" />
            <p className="text-sm font-semibold text-neutral-700 dark:text-[#EDEDED]">No movements recorded</p>
            <p className="text-xs text-neutral-400 dark:text-[#A1A1A1] mt-1">
              Use Stock in or Stock out to track parts movement on the floor.
            </p>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-sm font-poppins border-collapse">
                <thead>
                  <tr className="minimal-table-header">
                    <th className="py-3 px-6 text-neutral-800 dark:text-[#EDEDED] font-semibold text-xs">Part details</th>
                    <th className="py-3 px-4 text-neutral-800 dark:text-[#EDEDED] font-semibold text-xs minimal-v-divider">Transaction type</th>
                    <th className="py-3 px-4 text-neutral-800 dark:text-[#EDEDED] font-semibold text-xs text-center">Units moved</th>
                    <th className="py-3 px-4 text-neutral-800 dark:text-[#EDEDED] font-semibold text-xs">Storage / Brand</th>
                    <th className="py-3 px-6 text-neutral-800 dark:text-[#EDEDED] font-semibold text-xs">Reference / Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMovements.map((mov) => {
                    const prod = resolveMovementProduct(mov);
                    const imgUrl = resolveMovementImage(mov, prod);
                    return (
                      <tr key={mov.id} className="minimal-row">
                        <td className="py-3.5 px-6">
                          <div className="flex items-center gap-3">
                            <div className="relative w-9 h-9 shrink-0 flex items-center justify-center">
                              {imgUrl ? (
                                <img
                                  src={imgUrl}
                                  alt={mov.productName}
                                  className="w-9 h-9 rounded-lg object-contain bg-transparent shrink-0"
                                  onError={(e) => {
                                    (e.currentTarget as HTMLElement).style.display = 'none';
                                    const fallback = e.currentTarget.parentElement?.querySelector('.fallback-cube');
                                    if (fallback) (fallback as HTMLElement).classList.remove('hidden');
                                  }}
                                />
                              ) : null}
                              <div
                                className={`fallback-cube w-9 h-9 rounded-lg bg-neutral-100 dark:bg-[#161616] flex items-center justify-center shrink-0 text-neutral-400 ${
                                  imgUrl ? 'hidden' : ''
                                }`}
                              >
                                <HiOutlineCube className="w-4 h-4 stroke-1" />
                              </div>
                            </div>
                            <div className="min-w-0">
                              <span className="font-semibold text-neutral-900 dark:text-[#EDEDED] text-xs sm:text-sm block truncate">
                                {mov.productName}
                              </span>
                              <span className="text-xs font-mono text-neutral-500 dark:text-[#A1A1A1]">
                                Sku: {mov.sku}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 minimal-v-divider">
                          {mov.type === 'in' ? (
                            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-green-700 dark:text-emerald-400">
                              <HiOutlineArrowDownTray className="w-3.5 h-3.5" />
                              Stock in
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-orange-dark dark:text-[#FB714B]">
                              <HiOutlineArrowUpTray className="w-3.5 h-3.5" />
                              Stock out
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <span
                            className={`font-bold text-xs sm:text-sm ${
                              mov.type === 'in' ? 'text-green-600 dark:text-emerald-400' : 'text-neutral-900 dark:text-[#EDEDED]'
                            }`}
                          >
                            {mov.type === 'in' ? `+${mov.quantity}` : `-${mov.quantity}`}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="text-xs text-neutral-700 dark:text-[#EDEDED] font-medium block">
                            {prod?.brand || 'Generic'}
                          </span>
                          <span className="text-[11px] text-neutral-500 dark:text-[#A1A1A1]">
                            {prod?.location || 'Warehouse bin'}
                          </span>
                        </td>
                        <td className="py-3.5 px-6 text-xs text-neutral-600 dark:text-[#A1A1A1]">
                          {mov.notes || '—'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Minimal List (No Cards, Clean Border-b Rows) */}
            <div className="block md:hidden">
              {filteredMovements.map((mov) => {
                const prod = resolveMovementProduct(mov);
                const imgUrl = resolveMovementImage(mov, prod);
                const dt = formatMovementDateTime(mov.timestamp);
                return (
                  <div key={mov.id} className="minimal-row py-3 px-3 flex flex-col gap-2">
                    <div className="flex items-start justify-between gap-2.5">
                      <div className="flex items-center gap-2.5 min-w-0 flex-1">
                        <div className="relative w-9 h-9 shrink-0 flex items-center justify-center">
                          {imgUrl ? (
                            <img
                              src={imgUrl}
                              alt={mov.productName}
                              className="w-9 h-9 rounded-lg object-contain shrink-0"
                              onError={(e) => {
                                (e.currentTarget as HTMLElement).style.display = 'none';
                                const fallback = e.currentTarget.parentElement?.querySelector('.fallback-cube');
                                if (fallback) (fallback as HTMLElement).classList.remove('hidden');
                              }}
                            />
                          ) : null}
                          <div
                            className={`fallback-cube w-9 h-9 rounded-lg bg-neutral-100 dark:bg-[#161616] flex items-center justify-center shrink-0 text-neutral-400 ${
                              imgUrl ? 'hidden' : ''
                            }`}
                          >
                            <HiOutlineCube className="w-4 h-4 stroke-1" />
                          </div>
                        </div>
                        <div className="min-w-0 flex-1">
                          <span className="font-semibold text-xs text-neutral-900 dark:text-[#EDEDED] block truncate">
                            {mov.productName}
                          </span>
                          <div className="text-[10px] sm:text-[10.5px] text-neutral-500 dark:text-[#A1A1A1] flex items-center gap-1.5 mt-0.5">
                            <span className="font-mono whitespace-nowrap font-medium text-neutral-700 dark:text-[#D4D4D8]">Sku: {mov.sku}</span>
                            <span>•</span>
                            <span className="truncate">{prod?.brand || 'Generic'}</span>
                            {dt.dateStr && (
                              <>
                                <span>•</span>
                                <span className="whitespace-nowrap text-neutral-400 dark:text-neutral-500">{dt.dateStr}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Units moved & Price */}
                      <div className="text-right shrink-0 minimal-v-divider pl-2">
                        <span
                          className={`font-bold text-xs block ${
                            mov.type === 'in' ? 'text-green-600 dark:text-emerald-400' : 'text-brand-orange-dark dark:text-[#FB714B]'
                          }`}
                        >
                          {mov.type === 'in' ? `+${mov.quantity} In` : `-${mov.quantity} Out`}
                        </span>
                        <span className="text-[10.5px] font-bold text-neutral-800 dark:text-[#EDEDED] block mt-0.5">
                          ₱{prod?.price ? prod.price.toLocaleString() : '—'}
                        </span>
                      </div>
                    </div>

                    {/* Metadata Badges: Storage */}
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="inline-flex items-center gap-1 text-[9.5px] sm:text-[10px] text-neutral-700 dark:text-[#D4D4D8] bg-neutral-100 dark:bg-[#1A1A1A] px-1.5 py-0.5 rounded font-medium border border-neutral-200 dark:border-[#262626]">
                        <HiOutlineBuildingStorefront className="w-3 h-3 text-neutral-400 dark:text-[#737373] shrink-0" />
                        Storage: {prod?.location || 'Warehouse bin'}
                      </span>
                    </div>

                    {mov.notes && (
                      <div className="text-[11px] text-neutral-500 dark:text-[#A1A1A1] bg-neutral-50 dark:bg-[#121212] px-2 py-1 rounded">
                        Ref: {mov.notes}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 1. STOCK IN SLIDE-OVER DRAWER (RIGHT SIDE)                               */}
      {/* ========================================================================= */}
      <SlideOver
        isOpen={stockInDrawerOpen}
        onClose={() => setStockInDrawerOpen(false)}
        title="Stock in"
        subtitle="Record incoming bicycle parts and intake deliveries into inventory"
        side="right"
        widthClass="w-full md:w-[50vw] md:max-w-[50vw]"
      >
        <form onSubmit={handleStockInSubmit} className="flex flex-col gap-6">
          {actionError && (
            <div className="py-2 bg-transparent text-red-600 dark:text-red-400 text-xs font-semibold">
              {actionError}
            </div>
          )}

          {/* Select Part Section */}
          <div className="flex flex-col gap-2">
            <label className="text-neutral-700 dark:text-[#EDEDED] text-sm font-semibold">
              Select part
            </label>
            {products.length === 0 ? (
              <div className="py-2 bg-transparent text-amber-600 dark:text-amber-400 text-xs font-semibold">
                No parts registered yet. Please add a part first.
              </div>
            ) : (
              <select
                value={selectedProductId}
                onChange={(e) => setSelectedProductId(e.target.value)}
                required
                className="w-full py-3.5 px-4 rounded-xl border border-neutral-300 dark:border-[#262626] bg-white dark:bg-[#121212] text-neutral-900 dark:text-[#EDEDED] text-sm focus:outline-none focus:border-brand-orange dark:focus:border-[#FB714B] shadow-xs cursor-pointer"
              >
                <option value="">-- Choose a part from catalog --</option>
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} (Sku: {p.sku}) — In stock: {p.quantity}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Selected Part Preview & Image Display */}
          {selectedProduct && (
            <div className="p-4 rounded-2xl bg-brand-cream/80 dark:bg-[#121212] border border-brand-border dark:border-[#262626] flex flex-col sm:flex-row items-start sm:items-center gap-4">
              {selectedProduct.image ? (
                <div className="relative group shrink-0">
                  <img
                    src={selectedProduct.image}
                    alt={selectedProduct.name}
                    className="w-20 h-20 rounded-xl object-contain bg-transparent border-0 shadow-none shrink-0"
                  />
                  <label className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 rounded-xl flex flex-col items-center justify-center text-white text-[10px] cursor-pointer transition-opacity">
                    <HiOutlinePhoto className="w-4 h-4 mb-0.5" />
                    <span>Change</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAttachImage}
                      className="hidden"
                    />
                  </label>
                </div>
              ) : (
                <label className="w-20 h-20 rounded-xl border-2 border-dashed border-neutral-300 dark:border-[#262626] flex flex-col items-center justify-center text-neutral-400 hover:text-neutral-700 dark:hover:text-[#EDEDED] hover:border-neutral-400 dark:hover:border-[#404040] cursor-pointer transition-colors shrink-0 bg-white dark:bg-[#0A0A0A]">
                  <HiOutlinePhoto className="w-6 h-6 stroke-1 mb-1" />
                  <span className="text-[9px] font-medium text-center px-1">Add photo</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAttachImage}
                    className="hidden"
                  />
                </label>
              )}

              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-bold text-neutral-900 dark:text-[#EDEDED] truncate">
                  {selectedProduct.name}
                </h4>
                <div className="flex flex-wrap items-center gap-2 mt-1.5 text-xs text-neutral-600 dark:text-[#A1A1A1]">
                  <span className="bg-white dark:bg-[#1A1A1A] px-2.5 py-0.5 rounded-md border border-neutral-200 dark:border-[#262626] font-medium">
                    Sku: {selectedProduct.sku}
                  </span>
                  <span className="bg-white dark:bg-[#1A1A1A] px-2.5 py-0.5 rounded-md border border-neutral-200 dark:border-[#262626]">
                    Current stock: <b className="text-neutral-900 dark:text-white">{selectedProduct.quantity}</b>
                  </span>
                  <span className="bg-white dark:bg-[#1A1A1A] px-2.5 py-0.5 rounded-md border border-neutral-200 dark:border-[#262626]">
                    Min buffer: {selectedProduct.minStock}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Units to Receive */}
          <div className="flex flex-col gap-2">
            <label className="text-neutral-700 dark:text-[#EDEDED] text-sm font-semibold">
              Units to receive
            </label>
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value ? Number(e.target.value) : '')}
              placeholder="e.g. 50"
              required
              className="w-full py-3.5 px-4 rounded-xl border border-neutral-300 dark:border-[#262626] bg-white dark:bg-[#121212] text-neutral-900 dark:text-[#EDEDED] text-base focus:outline-none focus:border-brand-orange dark:focus:border-[#FB714B] shadow-xs"
            />
            {/* Quick add increment buttons */}
            <div className="flex items-center gap-2 pt-1">
              <span className="text-xs text-neutral-400 dark:text-[#737373]">Quick add:</span>
              {[5, 10, 25, 50].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setQuantity((prev) => (Number(prev) || 0) + num)}
                  className="px-2.5 py-1 text-xs rounded-lg border border-neutral-200 dark:border-[#262626] bg-white dark:bg-[#121212] hover:bg-neutral-50 dark:hover:bg-[#1C1C1C] text-neutral-700 dark:text-[#EDEDED] cursor-pointer"
                >
                  +{num}
                </button>
              ))}
            </div>
          </div>

          {/* Supplier Reference / Notes */}
          <div className="flex flex-col gap-2">
            <label className="text-neutral-700 dark:text-[#EDEDED] text-sm font-semibold">
              Supplier reference / notes (optional)
            </label>
            <textarea
              placeholder="Supplier invoice reference, po number, batch info..."
              value={stockInNotes}
              onChange={(e) => setStockInNotes(e.target.value)}
              rows={3}
              className="w-full py-3 px-4 rounded-xl border border-neutral-300 dark:border-[#262626] bg-white dark:bg-[#121212] text-neutral-900 dark:text-[#EDEDED] text-sm focus:outline-none focus:border-brand-orange dark:focus:border-[#FB714B] resize-none shadow-xs"
            />
          </div>

          {/* Action Buttons */}
          <div className="pt-4 flex items-center gap-3">
            <button
              type="submit"
              disabled={products.length === 0}
              className="flex-1 bg-[#121212] dark:bg-white hover:bg-neutral-800 dark:hover:bg-neutral-200 text-white dark:text-[#000000] py-3.5 px-6 rounded-xl font-bold text-sm border-2 border-transparent cursor-pointer shadow-sm active:border-[#FB714B] active:ring-2 active:ring-[#FB714B]/30 focus:outline-none transition-all disabled:opacity-50"
            >
              Confirm stock in
            </button>
            <button
              type="button"
              onClick={() => setStockInDrawerOpen(false)}
              className="px-5 py-3.5 rounded-xl border border-neutral-300 dark:border-[#262626] text-neutral-700 dark:text-[#EDEDED] hover:bg-neutral-50 dark:hover:bg-[#1C1C1C] text-sm font-semibold cursor-pointer transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </SlideOver>

      {/* ========================================================================= */}
      {/* 2. STOCK OUT SLIDE-OVER DRAWER (RIGHT SIDE)                              */}
      {/* ========================================================================= */}
      <SlideOver
        isOpen={stockOutDrawerOpen}
        onClose={() => setStockOutDrawerOpen(false)}
        title="Stock out"
        subtitle="Dispatch parts for workshop repairs, customer sales, or inventory adjustments"
        side="right"
        widthClass="w-full md:w-[50vw] md:max-w-[50vw]"
      >
        <form onSubmit={handleStockOutSubmit} className="flex flex-col gap-6">
          {actionError && (
            <div className="py-2 bg-transparent text-red-600 dark:text-red-400 text-xs font-semibold">
              {actionError}
            </div>
          )}

          {/* Select Part Section */}
          <div className="flex flex-col gap-2">
            <label className="text-neutral-700 dark:text-[#EDEDED] text-sm font-semibold">
              Select part
            </label>
            {products.length === 0 ? (
              <div className="py-2 bg-transparent text-amber-600 dark:text-amber-400 text-xs font-semibold">
                No parts registered yet. Please add a part first.
              </div>
            ) : (
              <select
                value={selectedProductId}
                onChange={(e) => setSelectedProductId(e.target.value)}
                required
                className="w-full py-3.5 px-4 rounded-xl border border-neutral-300 dark:border-[#262626] bg-white dark:bg-[#121212] text-neutral-900 dark:text-[#EDEDED] text-sm focus:outline-none focus:border-brand-orange dark:focus:border-[#FB714B] shadow-xs cursor-pointer"
              >
                <option value="">-- Choose a part from catalog --</option>
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} (Sku: {p.sku}) — Available: {p.quantity}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Selected Part Preview & Image Display */}
          {selectedProduct && (
            <div className="p-4 rounded-2xl bg-brand-cream/80 dark:bg-[#121212] border border-brand-border dark:border-[#262626] flex flex-col sm:flex-row items-start sm:items-center gap-4">
              {selectedProduct.image ? (
                <img
                  src={selectedProduct.image}
                  alt={selectedProduct.name}
                  className="w-20 h-20 rounded-xl object-contain bg-transparent border-0 shadow-none shrink-0"
                />
              ) : (
                <div className="w-20 h-20 rounded-xl bg-transparent border-0 flex items-center justify-center text-neutral-400 shrink-0">
                  <HiOutlineCube className="w-8 h-8 stroke-1" />
                </div>
              )}

              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-bold text-neutral-900 dark:text-[#EDEDED] truncate">
                  {selectedProduct.name}
                </h4>
                <div className="flex flex-wrap items-center gap-2 mt-1.5 text-xs text-neutral-600 dark:text-[#A1A1A1]">
                  <span className="bg-white dark:bg-[#1A1A1A] px-2.5 py-0.5 rounded-md border border-neutral-200 dark:border-[#262626] font-medium">
                    Sku: {selectedProduct.sku}
                  </span>
                  <span className="bg-white dark:bg-[#1A1A1A] px-2.5 py-0.5 rounded-md border border-neutral-200 dark:border-[#262626]">
                    Available: <b className="text-neutral-900 dark:text-white">{selectedProduct.quantity}</b>
                  </span>
                  <span className="bg-white dark:bg-[#1A1A1A] px-2.5 py-0.5 rounded-md border border-neutral-200 dark:border-[#262626]">
                    Unit price: ₱{selectedProduct.price.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Units to Dispatch */}
          <div className="flex flex-col gap-2">
            <label className="text-neutral-700 dark:text-[#EDEDED] text-sm font-semibold">
              Units to dispatch
            </label>
            <input
              type="number"
              min="1"
              max={selectedProduct ? selectedProduct.quantity : undefined}
              value={quantity}
              onChange={(e) => setQuantity(e.target.value ? Number(e.target.value) : '')}
              placeholder="e.g. 5"
              required
              className="w-full py-3.5 px-4 rounded-xl border border-neutral-300 dark:border-[#262626] bg-white dark:bg-[#121212] text-neutral-900 dark:text-[#EDEDED] text-base focus:outline-none focus:border-brand-orange dark:focus:border-[#FB714B] shadow-xs"
            />
          </div>

          {/* Reason */}
          <div className="flex flex-col gap-2">
            <label className="text-neutral-700 dark:text-[#EDEDED] text-sm font-semibold">
              Dispatch reason
            </label>
            <input
              type="text"
              placeholder="e.g. Workshop repair, sold to customer, transfer..."
              value={stockOutReason}
              onChange={(e) => setStockOutReason(e.target.value)}
              className="w-full py-3.5 px-4 rounded-xl border border-neutral-300 dark:border-[#262626] bg-white dark:bg-[#121212] text-neutral-900 dark:text-[#EDEDED] text-sm focus:outline-none focus:border-brand-orange dark:focus:border-[#FB714B] shadow-xs"
            />
          </div>

          {/* Customer / Reference */}
          <div className="flex flex-col gap-2">
            <label className="text-neutral-700 dark:text-[#EDEDED] text-sm font-semibold">
              Customer or work order reference (optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Work order #204, Customer: Juan..."
              value={stockOutNotes}
              onChange={(e) => setStockOutNotes(e.target.value)}
              className="w-full py-3.5 px-4 rounded-xl border border-neutral-300 dark:border-[#262626] bg-white dark:bg-[#121212] text-neutral-900 dark:text-[#EDEDED] text-sm focus:outline-none focus:border-brand-orange dark:focus:border-[#FB714B] shadow-xs"
            />
          </div>

          {/* Action Buttons */}
          <div className="pt-4 flex items-center gap-3">
            <button
              type="submit"
              disabled={products.length === 0}
              className="flex-1 bg-[#121212] dark:bg-white hover:bg-neutral-800 dark:hover:bg-neutral-200 text-white dark:text-[#000000] py-3.5 px-6 rounded-xl font-bold text-sm border-2 border-transparent cursor-pointer shadow-sm active:border-[#FB714B] active:ring-2 active:ring-[#FB714B]/30 focus:outline-none transition-all disabled:opacity-50"
            >
              Confirm stock out
            </button>
            <button
              type="button"
              onClick={() => setStockOutDrawerOpen(false)}
              className="px-5 py-3.5 rounded-xl border border-neutral-300 dark:border-[#262626] text-neutral-700 dark:text-[#EDEDED] hover:bg-neutral-50 dark:hover:bg-[#1C1C1C] text-sm font-semibold cursor-pointer transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </SlideOver>
    </div>
  );
};

export default StockMovementPage;
