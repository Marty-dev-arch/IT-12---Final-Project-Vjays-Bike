import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import SlideOver from '../../components/ui/SlideOver';
import PartImagePicker from '../../components/ui/PartImagePicker';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import ImageZoomModal from '../../components/ui/ImageZoomModal';
import { useInventory } from '../../context/InventoryContext';
import type { Product } from '../../types';
import {
  HiOutlinePlus,
  HiOutlineMagnifyingGlass,
  HiOutlineArchiveBox,
  HiOutlineTrash,
  HiOutlineTag,
  HiOutlineBuildingStorefront,
  HiOutlineCube,
  HiOutlineViewfinderCircle,
  HiOutlineMagnifyingGlassPlus,
} from 'react-icons/hi2';

const categoryLabels: Record<string, string> = {
  'braking-system': 'Braking system',
  'drivetrain-chains': 'Drivetrain & chains',
  'handle-bar-handle-grip': 'Handle Bar & Handle Grip',
  'gears-sprockets': 'Handle Bar & Handle Grip',
};

const ProductsPage: React.FC = () => {
  const { category = 'braking-system' } = useParams<{ category?: string }>();
  const { products, addProduct, updateProduct, deleteProduct, deleteProductsByCategory, stockIn, stockOut } = useInventory();

  const [searchQuery, setSearchQuery] = useState('');
  const [addDrawerOpen, setAddDrawerOpen] = useState(false);
  const [stockInDrawerOpen, setStockInDrawerOpen] = useState(false);
  const [stockOutDrawerOpen, setStockOutDrawerOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState('');
  const [deleteTargetProduct, setDeleteTargetProduct] = useState<Product | null>(null);
  const [deleteAllModalOpen, setDeleteAllModalOpen] = useState(false);
  const [zoomProduct, setZoomProduct] = useState<Product | null>(null);
  const [sortBy, setSortBy] = useState<'name' | 'price' | 'quantity'>('name');

  // Stock In / Out form state
  const [opQuantity, setOpQuantity] = useState<number | ''>('');
  const [stockInNotes, setStockInNotes] = useState('');
  const [stockOutReason, setStockOutReason] = useState('Workshop repair');
  const [stockOutNotes, setStockOutNotes] = useState('');
  const [actionError, setActionError] = useState('');

  // Add Product form state (category is automatic from current page route)
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    category: category,
    brand: '',
    price: '',
    costPrice: '',
    quantity: '',
    minStock: '5',
    maxCapacity: '30',
    location: 'Warehouse shelf a1',
    image: '',
  });
  const [addError, setAddError] = useState('');

  const pageTitle = categoryLabels[category] || 'Braking system';

  const selectedProduct = products.find((p) => p.id === selectedProductId);

  // Filter products by current active category and search
  const filteredProducts = products
    .filter((p) => {
      if (p.category !== category) return false;
      if (!searchQuery) return true;
      const query = searchQuery.toLowerCase();
      return (
        p.name.toLowerCase().includes(query) ||
        p.sku.toLowerCase().includes(query) ||
        p.brand.toLowerCase().includes(query)
      );
    })
    .sort((a, b) => {
      if (sortBy === 'price') return b.price - a.price;
      if (sortBy === 'quantity') return b.quantity - a.quantity;
      return a.name.localeCompare(b.name);
    });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAddError('');
    if (!formData.name.trim() || !formData.sku.trim()) {
      setAddError('Please enter both part name and sku');
      return;
    }

    const initialUnits = Number(formData.quantity) || 0;
    // Capacity matches initial units (e.g. 5 initial units -> 5 capacity, 5/5 stock)
    const capacityLevel = initialUnits > 0 ? initialUnits : 5;

    addProduct({
      name: formData.name.trim(),
      sku: formData.sku.trim(),
      category: category, // Auto-categorized based on current page
      brand: formData.brand.trim() || 'Generic',
      price: Number(formData.price) || 0,
      costPrice: Number(formData.costPrice) || 0,
      quantity: initialUnits,
      minStock: Number(formData.minStock) || 5,
      maxCapacity: capacityLevel,
      location: formData.location.trim() || 'Warehouse shelf a1',
      image: formData.image || undefined,
    });

    setAddDrawerOpen(false);
    setFormData({
      name: '',
      sku: '',
      category: category,
      brand: '',
      price: '',
      costPrice: '',
      quantity: '',
      minStock: '5',
      maxCapacity: '',
      location: 'Warehouse shelf a1',
      image: '',
    });
  };

  // Stock In submission (Guaranteed overflow prevention)
  const handleStockInSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setActionError('');
    if (!selectedProductId) {
      setActionError('Please select a part');
      return;
    }
    if (!opQuantity || Number(opQuantity) <= 0) {
      setActionError('Please enter a valid quantity greater than 0');
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
      if (targetProduct.quantity + Number(opQuantity) > capacity) {
        const remaining = capacity - targetProduct.quantity;
        setActionError(
          `Cannot stock in ${opQuantity} units. Only ${remaining} unit(s) remaining before reaching maximum capacity (${capacity}).`
        );
        return;
      }
    }

    const success = stockIn(selectedProductId, Number(opQuantity), stockInNotes);
    if (success) {
      setStockInDrawerOpen(false);
      setSelectedProductId('');
      setOpQuantity('');
      setStockInNotes('');
    } else {
      setActionError('Failed to process stock in. Capacity limit reached.');
    }
  };

  // Stock Out submission
  const handleStockOutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setActionError('');
    if (!selectedProductId) {
      setActionError('Please select a part');
      return;
    }
    if (!opQuantity || Number(opQuantity) <= 0) {
      setActionError('Please enter a valid quantity greater than 0');
      return;
    }

    const product = products.find((p) => p.id === selectedProductId);
    if (product && product.quantity < Number(opQuantity)) {
      setActionError(`Insufficient stock! Available units: ${product.quantity}`);
      return;
    }

    const success = stockOut(selectedProductId, Number(opQuantity), stockOutReason, stockOutNotes);
    if (success) {
      setStockOutDrawerOpen(false);
      setSelectedProductId('');
      setOpQuantity('');
      setStockOutNotes('');
    } else {
      setActionError('Failed to process stock out');
    }
  };

  const getStatusBadge = (status: string, quantity: number) => {
    if (quantity === 0 || status === 'out-of-stock') {
      return (
        <span className="px-2.5 py-1 text-[11px] font-medium rounded-full bg-red-100 dark:bg-red-500/10 text-red-700 dark:text-red-400 border border-transparent dark:border-red-500/20">
          Out of stock
        </span>
      );
    }
    if (status === 'critical') {
      return (
        <span className="px-2.5 py-1 text-[11px] font-medium rounded-full bg-orange-100 dark:bg-[#1A120E] text-orange-800 dark:text-[#FB714B] border border-transparent dark:border-[#FB714B]/30">
          Critical stock
        </span>
      );
    }
    if (status === 'low-stock') {
      return (
        <span className="px-2.5 py-1 text-[11px] font-medium rounded-full bg-yellow-100 dark:bg-yellow-500/10 text-yellow-800 dark:text-yellow-400 border border-transparent dark:border-yellow-500/20">
          Low stock
        </span>
      );
    }
    return (
      <span className="px-2.5 py-1 text-[11px] font-medium rounded-full bg-green-100 dark:bg-emerald-500/10 text-green-700 dark:text-emerald-400 border border-transparent dark:border-emerald-500/20">
        In stock
      </span>
    );
  };

  // Stock Capacity calculation: Low stock, Moderate, Optimal, Full stock
  const getStockCapacityInfo = (quantity: number, minStock: number, maxCapacity?: number) => {
    // Dynamic capacity adjustment: if quantity reaches or exceeds nominal capacity (e.g. 2 + 10 = 12),
    // capacity dynamically matches so it displays cleanly as 12 / 12 units (100% Full stock) instead of 12 / 5
    const baseCapacity = maxCapacity && maxCapacity > 0 ? maxCapacity : Math.max(quantity, 1);
    const capacity = Math.max(baseCapacity, quantity);
    const percentage = Math.min(100, Math.round((quantity / capacity) * 100));

    // 1. Low stock / Out of stock: RED
    if (quantity <= 0) {
      return {
        capacity,
        percentage: 0,
        label: 'Low stock',
        textColor: 'text-red-600 dark:text-red-400',
        barColor: 'bg-red-600 dark:bg-red-500',
        barWidth: '0%',
        isFull: false,
      };
    }
    if (quantity <= minStock || percentage < 35) {
      return {
        capacity,
        percentage,
        label: 'Low stock',
        textColor: 'text-red-600 dark:text-red-400',
        barColor: 'bg-red-600 dark:bg-red-500',
        barWidth: `${Math.max(percentage, 8)}%`,
        isFull: false,
      };
    }

    // 2. Moderate stock: AMBER / ORANGE
    if (percentage < 70) {
      return {
        capacity,
        percentage,
        label: 'Moderate',
        textColor: 'text-[#E65100] dark:text-[#FB714B]',
        barColor: 'bg-[#E98B3A] dark:bg-[#FB714B]',
        barWidth: `${percentage}%`,
        isFull: false,
      };
    }

    // 3. Optimal stock: GREEN
    if (quantity < capacity && percentage < 100) {
      return {
        capacity,
        percentage,
        label: 'Optimal',
        textColor: 'text-[#2E7D32] dark:text-emerald-400',
        barColor: 'bg-[#2E7D32] dark:bg-emerald-500',
        barWidth: `${percentage}%`,
        isFull: false,
      };
    }

    // 4. Full stock: EMERALD
    return {
      capacity,
      percentage: 100,
      label: 'Full stock',
      textColor: 'text-[#1B5E20] dark:text-emerald-300',
      barColor: 'bg-[#1B5E20] dark:bg-emerald-400',
      barWidth: '100%',
      isFull: true,
    };
  };

  return (
    <div className="p-3.5 sm:p-6 lg:p-8 font-poppins pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 mb-5 sm:mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-neutral-900 dark:text-[#EDEDED] text-xl sm:text-3xl font-bold tracking-tight">
              {pageTitle}
            </h1>
            <span className="text-neutral-400 dark:text-[#737373] text-xs sm:text-sm font-normal">
              ({filteredProducts.length} items)
            </span>
          </div>
          <p className="text-neutral-500 dark:text-[#A1A1A1] text-xs sm:text-sm mt-0.5 sm:mt-1">
            Manage, update, and inspect your bicycle parts inventory
          </p>
        </div>

        {/* Action Button Group: Delete all & Add Part */}
        <div className="flex items-center justify-end gap-2 w-full sm:w-auto self-end sm:self-auto">
          {filteredProducts.length > 0 && (
            <button
              onClick={() => setDeleteAllModalOpen(true)}
              className="btn-adapt adapt-mobile inline-flex items-center justify-center bg-white dark:bg-[#121212] text-neutral-800 dark:text-[#EDEDED] border border-brand-border dark:border-[#262626] active:border-red-500 hover:bg-neutral-50 dark:hover:bg-[#1A1A1A] py-1.5 px-3 gap-1.5 rounded-lg text-[11px] sm:text-xs font-semibold cursor-pointer shadow-none active:scale-[0.98] transition-all"
              title="Delete all products in this category"
            >
              <HiOutlineTrash className="w-3.5 h-3.5 text-neutral-600 dark:text-[#A1A1A1]" />
              Delete all
            </button>
          )}

          {/* Add Part Button: Opens right-side Slide-Over */}
          <button
            onClick={() => {
              setAddError('');
              setFormData((prev) => ({ ...prev, category }));
              setAddDrawerOpen(true);
            }}
            className="btn-adapt adapt-mobile inline-flex items-center justify-center bg-[#121212] dark:bg-white text-white dark:text-[#000000] hover:bg-neutral-800 dark:hover:bg-neutral-200 py-1.5 px-3 rounded-lg font-semibold text-[11px] sm:text-xs shadow-none cursor-pointer border border-transparent active:border-red-500 active:scale-[0.98] transition-all"
          >
            <HiOutlinePlus className="w-3.5 h-3.5 mr-1" />
            Add new part
          </button>
        </div>
      </div>

      {/* Filter and Clean Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 mb-3.5 sm:mb-5">
        {/* Clean Search Bar */}
        <div className="w-full sm:w-72 flex items-center bg-white dark:bg-[#121212] rounded-xl border border-brand-border dark:border-[#262626] px-3 py-2 sm:px-3.5 sm:py-2.5 gap-2 focus-within:border-brand-orange dark:focus-within:border-[#FB714B] shadow-xs">
          <HiOutlineMagnifyingGlass className="w-3.5 h-3.5 text-neutral-400 dark:text-[#737373] shrink-0" />
          <input
            type="text"
            placeholder="Search parts, sku..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="adapt-mobile w-full text-xs text-neutral-800 dark:text-[#EDEDED] bg-transparent border-0 focus:outline-none placeholder:text-neutral-400 dark:placeholder:text-[#737373] font-poppins"
          />
        </div>

        {/* Sort selector */}
        <div className="flex items-center justify-between sm:justify-start gap-2">
          <span className="text-[11px] sm:text-xs text-neutral-500 dark:text-[#A1A1A1] font-medium">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="adapt-mobile bg-white dark:bg-[#121212] border border-brand-border dark:border-[#262626] text-xs rounded-xl py-2 px-3 text-neutral-700 dark:text-[#EDEDED] font-medium focus:outline-none focus:border-brand-orange dark:focus:border-[#FB714B] cursor-pointer shadow-xs"
          >
            <option value="name">Name (A-Z)</option>
            <option value="price">Price (High to Low)</option>
            <option value="quantity">Units in stock</option>
          </select>
        </div>
      </div>

      {/* Products Catalog - Minimal Border Layout */}
      <div className="minimal-inventory-container rounded-xl overflow-hidden shadow-xs">
        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-sm font-poppins border-collapse">
            <thead>
              <tr className="minimal-table-header">
                <th className="py-3 px-6 text-neutral-800 dark:text-[#EDEDED] font-semibold text-xs">Part details</th>
                <th className="py-3 px-4 text-neutral-800 dark:text-[#EDEDED] font-semibold text-xs">Storage bin</th>
                <th className="py-3 px-4 text-neutral-800 dark:text-[#EDEDED] font-semibold text-xs minimal-v-divider">Brand</th>
                <th className="py-3 px-4 text-neutral-800 dark:text-[#EDEDED] font-semibold text-xs">Selling price</th>
                <th className="py-3 px-4 text-neutral-800 dark:text-[#EDEDED] font-semibold text-xs">Cost price</th>
                <th className="py-3 px-4 text-neutral-800 dark:text-[#EDEDED] font-semibold text-xs min-w-[210px]">Stock capacity</th>
                <th className="py-3 px-6 text-neutral-800 dark:text-[#EDEDED] font-semibold text-xs text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-neutral-400 dark:text-[#737373]">
                    <div className="flex flex-col items-center justify-center">
                      <HiOutlineArchiveBox className="w-10 h-10 stroke-1 mb-2 text-neutral-300 dark:text-[#737373]" />
                      <p className="text-sm font-semibold text-neutral-700 dark:text-[#EDEDED]">
                        No parts in {pageTitle}
                      </p>
                      <p className="text-xs text-neutral-400 dark:text-[#A1A1A1] mt-1 max-w-sm">
                        {searchQuery
                          ? 'No products matched your search keyword.'
                          : `There are currently no items under ${pageTitle}. Click "+ Add new part" to register parts.`}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => {
                  const cap = getStockCapacityInfo(p.quantity, p.minStock, p.maxCapacity);
                  const isFull = p.quantity >= (p.maxCapacity || p.quantity || 1);
                  return (
                    <tr key={p.id} className="minimal-row">
                      <td className="py-3.5 px-6">
                        <div className="flex items-center gap-3">
                          {p.image ? (
                            <div
                              onClick={() => setZoomProduct(p)}
                              className="relative group cursor-pointer shrink-0"
                              title="Click to zoom image"
                            >
                              <img
                                src={p.image}
                                alt={p.name}
                                className="w-10 h-10 rounded-lg object-contain p-0 bg-transparent shrink-0 transition-transform duration-200 group-hover:scale-105"
                              />
                            </div>
                          ) : (
                            <div className="w-10 h-10 rounded-lg bg-neutral-100 dark:bg-[#161616] flex items-center justify-center shrink-0 text-neutral-400">
                              <HiOutlineCube className="w-5 h-5 stroke-1" />
                            </div>
                          )}
                          <div className="min-w-0">
                            <div className="font-semibold text-neutral-900 dark:text-[#EDEDED] text-sm truncate max-w-xs">
                              {p.name}
                            </div>
                            <div className="text-xs text-neutral-500 dark:text-[#A1A1A1] font-mono mt-0.5">
                              Sku: {p.sku}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-xs text-neutral-600 dark:text-[#A1A1A1]">
                        <span className="inline-flex items-center gap-1">
                          <HiOutlineBuildingStorefront className="w-3.5 h-3.5 text-neutral-400 dark:text-[#737373]" />
                          {p.location}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-medium text-xs text-neutral-800 dark:text-[#EDEDED] minimal-v-divider">
                        {p.brand}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-xs text-neutral-900 dark:text-[#EDEDED]">
                        ₱{p.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-3.5 px-4 text-xs text-neutral-500 dark:text-[#A1A1A1]">
                        ₱{p.costPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-3.5 px-4 min-w-[210px]">
                        <div className="flex flex-col gap-1 w-full max-w-[200px]">
                          <div className="flex items-center justify-between text-[11px]">
                            <span className={`font-semibold ${cap.textColor}`}>
                              {p.quantity} / {cap.capacity} units
                            </span>
                            <span className={`text-[10px] font-bold ${cap.textColor}`}>
                              {cap.percentage}% {cap.label}
                            </span>
                          </div>
                          <div className="w-full bg-[#EAE7E7] dark:bg-[#262626] h-[5px] rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-300 ${cap.barColor}`}
                              style={{ width: cap.barWidth }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-6 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Stock In Button */}
                          <button
                            onClick={() => {
                              setSelectedProductId(p.id);
                              if (isFull) {
                                setActionError(`Stock capacity full (${p.quantity}/${cap.capacity}). Stock out first.`);
                              } else {
                                setActionError('');
                              }
                              setStockInDrawerOpen(true);
                            }}
                            className={`btn-adapt adapt-mobile px-2 py-1 text-[11px] font-bold rounded-md transition-colors ${isFull
                                ? 'bg-neutral-200 dark:bg-[#222222] text-neutral-400 dark:text-[#666666] cursor-not-allowed'
                                : 'bg-[#121212] dark:bg-white text-white dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-200 cursor-pointer'
                              }`}
                            title="Stock in"
                          >
                            + In
                          </button>
                          {/* Stock Out Button */}
                          <button
                            onClick={() => {
                              setSelectedProductId(p.id);
                              setActionError('');
                              setStockOutDrawerOpen(true);
                            }}
                            className="btn-adapt adapt-mobile px-2 py-1 bg-white dark:bg-[#161616] border border-neutral-300 dark:border-[#262626] text-neutral-800 dark:text-[#EDEDED] text-[11px] font-bold rounded-md cursor-pointer hover:bg-neutral-50 dark:hover:bg-[#222] transition-colors"
                            title="Stock out"
                          >
                            - Out
                          </button>
                          {/* Delete Button */}
                          <button
                            onClick={() => setDeleteTargetProduct(p)}
                            className="p-1 text-neutral-400 dark:text-[#737373] hover:text-red-600 dark:hover:text-red-400 rounded transition-colors cursor-pointer border-0 bg-transparent"
                            title="Delete part"
                          >
                            <HiOutlineTrash className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Minimal List View (Clean & Minimal Divider Layout — NOT A CARD) */}
        <div className="block md:hidden">
          {filteredProducts.length === 0 ? (
            <div className="py-10 px-4 text-center text-neutral-400 dark:text-[#737373]">
              <HiOutlineArchiveBox className="w-8 h-8 stroke-1 mx-auto mb-2 text-neutral-300 dark:text-[#737373]" />
              <p className="text-xs font-semibold text-neutral-700 dark:text-[#EDEDED]">
                No parts in {pageTitle}
              </p>
            </div>
          ) : (
            filteredProducts.map((p) => {
              const cap = getStockCapacityInfo(p.quantity, p.minStock, p.maxCapacity);
              const isFull = p.quantity >= (p.maxCapacity || p.quantity || 1);
              return (
                <div key={p.id} className="minimal-row py-3 px-3 flex flex-col gap-2">
                  {/* Top info row */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                      {p.image ? (
                        <img
                          src={p.image}
                          alt={p.name}
                          onClick={() => setZoomProduct(p)}
                          className="w-9 h-9 rounded-lg object-contain shrink-0 cursor-pointer"
                        />
                      ) : (
                        <div className="w-9 h-9 rounded-lg bg-neutral-100 dark:bg-[#161616] flex items-center justify-center shrink-0 text-neutral-400">
                          <HiOutlineCube className="w-4 h-4 stroke-1" />
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <div className="font-semibold text-xs text-neutral-900 dark:text-[#EDEDED] truncate">
                          {p.name}
                        </div>
                        <div className="text-[10px] sm:text-[10.5px] text-neutral-500 dark:text-[#A1A1A1] flex items-center gap-1.5 mt-0.5">
                          <span className="font-mono whitespace-nowrap font-medium text-neutral-700 dark:text-[#D4D4D8]">Sku: {p.sku}</span>
                          <span>•</span>
                          <span className="truncate">{p.brand}</span>
                        </div>
                        <div className="flex flex-wrap items-center gap-1.5 mt-1">
                          <span className="inline-flex items-center gap-1 text-[9.5px] sm:text-[10px] text-neutral-700 dark:text-[#D4D4D8] bg-neutral-100 dark:bg-[#1A1A1A] px-1.5 py-0.5 rounded font-medium border border-neutral-200 dark:border-[#262626]">
                            <HiOutlineBuildingStorefront className="w-3 h-3 text-neutral-400 dark:text-[#737373] shrink-0" />
                            Storage: {p.location || 'Warehouse bin'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0 minimal-v-divider pl-2">
                      <div className="text-xs font-bold text-neutral-900 dark:text-[#EDEDED]">
                        ₱{p.price.toLocaleString()}
                      </div>
                      <div className="text-[9.5px] text-neutral-400 dark:text-[#737373]">
                        Cost: ₱{p.costPrice.toLocaleString()}
                      </div>
                    </div>
                  </div>

                  {/* Stock capacity line + Compact buttons row */}
                  <div className="flex items-center justify-between gap-1.5 pt-0.5">
                    {/* Capacity mini bar */}
                    <div className="flex items-center gap-1.5 min-w-0 flex-1">
                      <span className={`text-[10.5px] font-bold ${cap.textColor} shrink-0`}>
                        {p.quantity}/{cap.capacity}
                      </span>
                      <div className="w-12 xs:w-16 bg-[#EAE7E7] dark:bg-[#262626] h-[4px] rounded-full overflow-hidden shrink-0">
                        <div
                          className={`h-full rounded-full ${cap.barColor}`}
                          style={{ width: cap.barWidth }}
                        />
                      </div>
                      <span className={`text-[9.5px] font-semibold ${cap.textColor} shrink-0`}>
                        {cap.isFull ? 'Full' : `${cap.percentage}%`}
                      </span>
                    </div>

                    {/* Compact action buttons */}
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => {
                          setSelectedProductId(p.id);
                          if (isFull) {
                            setActionError(`Stock capacity is full (${p.quantity}/${cap.capacity}). Stock out first.`);
                          } else {
                            setActionError('');
                          }
                          setStockInDrawerOpen(true);
                        }}
                        className={`btn-adapt adapt-mobile px-2 py-0.5 text-[10px] font-bold rounded-md transition-colors ${isFull
                            ? 'bg-neutral-200 dark:bg-[#222222] text-neutral-400 cursor-not-allowed'
                            : 'bg-[#121212] dark:bg-white text-white dark:text-neutral-900 hover:bg-neutral-800'
                          }`}
                      >
                        + In
                      </button>
                      <button
                        onClick={() => {
                          setSelectedProductId(p.id);
                          setActionError('');
                          setStockOutDrawerOpen(true);
                        }}
                        className="btn-adapt adapt-mobile px-2 py-0.5 bg-white dark:bg-[#161616] border border-neutral-300 dark:border-[#262626] text-neutral-800 dark:text-[#EDEDED] text-[10px] font-bold rounded-md cursor-pointer"
                      >
                        - Out
                      </button>
                      <button
                        onClick={() => setDeleteTargetProduct(p)}
                        className="p-1 text-neutral-400 hover:text-red-500 rounded cursor-pointer border-0 bg-transparent"
                        title="Delete part"
                      >
                        <HiOutlineTrash className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>


      {/* ========================================================================= */}
      {/* 1. REGISTER NEW BIKE PART SLIDE-OVER DRAWER (RIGHT SIDE)                  */}
      {/* ========================================================================= */}
      <SlideOver
        isOpen={addDrawerOpen}
        onClose={() => setAddDrawerOpen(false)}
        title="Register new bike part"
        subtitle={`Adding part directly to ${pageTitle}`}
        side="right"
        widthClass="w-full md:w-[50vw] md:max-w-[50vw]"
      >
        <form onSubmit={handleAddSubmit} className="flex flex-col gap-6">
          {addError && (
            <div className="py-2 bg-transparent text-red-600 dark:text-red-400 text-xs font-semibold">
              {addError}
            </div>
          )}

          {/* Interactive Bike Part Image Library with Google Lens Zoom */}
          <PartImagePicker
            selectedImage={formData.image}
            onSelectImage={(imageUrl, template) => {
              setFormData((prev) => ({
                ...prev,
                image: imageUrl,
                name: prev.name.trim() ? prev.name : (template ? template.name : prev.name),
                sku: prev.sku.trim() ? prev.sku : (template?.suggestedSku ? template.suggestedSku : prev.sku),
                brand: prev.brand.trim() ? prev.brand : (template?.suggestedBrand ? template.suggestedBrand : prev.brand),
              }));
            }}
            onRemoveImage={() => setFormData((prev) => ({ ...prev, image: '' }))}
          />

          {/* Part Name (No asterisk) */}
          <div className="flex flex-col gap-2">
            <label className="text-neutral-700 dark:text-[#EDEDED] text-sm font-semibold">
              Part name
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Shimano Hydraulic Caliper"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full py-3.5 px-4 rounded-xl border border-neutral-300 dark:border-[#262626] bg-white dark:bg-[#121212] text-neutral-900 dark:text-[#EDEDED] text-base focus:outline-none focus:border-brand-orange dark:focus:border-[#FB714B] shadow-xs"
            />
          </div>

          {/* Sku & Brand Row (No Category dropdown, No asterisk) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-neutral-700 dark:text-[#EDEDED] text-sm font-semibold">
                Sku / part number
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Brk-sh-001"
                value={formData.sku}
                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                className="w-full py-3.5 px-4 rounded-xl border border-neutral-300 dark:border-[#262626] bg-white dark:bg-[#121212] text-neutral-900 dark:text-[#EDEDED] text-sm focus:outline-none focus:border-brand-orange dark:focus:border-[#FB714B] shadow-xs"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-neutral-700 dark:text-[#EDEDED] text-sm font-semibold">
                Brand / manufacturer
              </label>
              <input
                type="text"
                placeholder="e.g. Shimano, Sram, Kmc"
                value={formData.brand}
                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                className="w-full py-3.5 px-4 rounded-xl border border-neutral-300 dark:border-[#262626] bg-white dark:bg-[#121212] text-neutral-900 dark:text-[#EDEDED] text-sm focus:outline-none focus:border-brand-orange dark:focus:border-[#FB714B] shadow-xs"
              />
            </div>
          </div>

          {/* Selling Price & Cost Price & Initial Units (No asterisk) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-neutral-700 dark:text-[#EDEDED] text-sm font-semibold">
                Selling price (₱)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                required
                className="w-full py-3.5 px-4 rounded-xl border border-neutral-300 dark:border-[#262626] bg-white dark:bg-[#121212] text-neutral-900 dark:text-[#EDEDED] text-sm focus:outline-none focus:border-brand-orange dark:focus:border-[#FB714B] shadow-xs"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-neutral-700 dark:text-[#EDEDED] text-sm font-semibold">
                Cost price (₱)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={formData.costPrice}
                onChange={(e) => setFormData({ ...formData, costPrice: e.target.value })}
                required
                className="w-full py-3.5 px-4 rounded-xl border border-neutral-300 dark:border-[#262626] bg-white dark:bg-[#121212] text-neutral-900 dark:text-[#EDEDED] text-sm focus:outline-none focus:border-brand-orange dark:focus:border-[#FB714B] shadow-xs"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-neutral-700 dark:text-[#EDEDED] text-sm font-semibold">
                Stock Units
              </label>
              <input
                type="number"
                min="0"
                placeholder="0"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                className="w-full py-3.5 px-4 rounded-xl border border-neutral-300 dark:border-[#262626] bg-white dark:bg-[#121212] text-neutral-900 dark:text-[#EDEDED] text-sm focus:outline-none focus:border-brand-orange dark:focus:border-[#FB714B] shadow-xs"
              />
            </div>
          </div>

          {/* Safety Buffer & Storage Bin (No asterisk) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-neutral-700 dark:text-[#EDEDED] text-sm font-semibold">
                Safety Min Stock level
              </label>
              <input
                type="number"
                min="1"
                placeholder="5"
                value={formData.minStock}
                onChange={(e) => setFormData({ ...formData, minStock: e.target.value })}
                className="w-full py-3.5 px-4 rounded-xl border border-neutral-300 dark:border-[#262626] bg-white dark:bg-[#121212] text-neutral-900 dark:text-[#EDEDED] text-sm focus:outline-none focus:border-brand-orange dark:focus:border-[#FB714B] shadow-xs"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-neutral-700 dark:text-[#EDEDED] text-sm font-semibold">
                Storage bin / rack
              </label>
              <input
                type="text"
                placeholder="e.g. Warehouse shelf a1"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full py-3.5 px-4 rounded-xl border border-neutral-300 dark:border-[#262626] bg-white dark:bg-[#121212] text-neutral-900 dark:text-[#EDEDED] text-sm focus:outline-none focus:border-brand-orange dark:focus:border-[#FB714B] shadow-xs"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="pt-4 flex items-center gap-3">
            <button
              type="submit"
              className="flex-1 bg-[#121212] dark:bg-white hover:bg-neutral-800 dark:hover:bg-neutral-200 text-white dark:text-[#000000] py-3.5 px-6 rounded-xl font-bold text-sm border-2 border-transparent cursor-pointer shadow-sm active:border-[#FB714B] active:ring-2 active:ring-[#FB714B]/30 focus:outline-none transition-all"
            >
              Save part to inventory
            </button>
            <button
              type="button"
              onClick={() => setAddDrawerOpen(false)}
              className="px-5 py-3.5 rounded-xl border border-neutral-300 dark:border-[#262626] text-neutral-700 dark:text-[#EDEDED] hover:bg-neutral-50 dark:hover:bg-[#1C1C1C] text-sm font-semibold cursor-pointer transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </SlideOver>

      {/* ========================================================================= */}
      {/* 2. STOCK IN SLIDE-OVER DRAWER (RIGHT SIDE)                               */}
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
                    {p.name} (Sku: {p.sku}) — Current stock: {p.quantity}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Selected Part Preview & Image Display */}
          {selectedProduct && (
            <div className="p-4 rounded-2xl bg-brand-cream/80 dark:bg-[#121212] border border-brand-border dark:border-[#262626] flex flex-col sm:flex-row items-start sm:items-center gap-4">
              {selectedProduct.image ? (
                <div
                  onClick={() => setZoomProduct(selectedProduct)}
                  className="relative group cursor-pointer shrink-0"
                  title="Click to zoom part image"
                >
                  <img
                    src={selectedProduct.image}
                    alt={selectedProduct.name}
                    className="w-20 h-20 rounded-xl object-contain p-0 bg-transparent border-0 shadow-none shrink-0 transition-transform group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/20 rounded-xl opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white pointer-events-none">
                    <HiOutlineMagnifyingGlassPlus className="w-5 h-5 drop-shadow" />
                  </div>
                </div>
              ) : (
                <div className="w-20 h-20 rounded-xl bg-white dark:bg-[#0A0A0A] border border-neutral-200 dark:border-[#262626] flex items-center justify-center text-neutral-400 shrink-0">
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
                    Stock capacity: <b className="text-neutral-900 dark:text-white">{selectedProduct.quantity} / {selectedProduct.maxCapacity || selectedProduct.quantity || 1} units</b>
                  </span>
                  <span className="bg-white dark:bg-[#1A1A1A] px-2.5 py-0.5 rounded-md border border-neutral-200 dark:border-[#262626]">
                    Min buffer: {selectedProduct.minStock}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Full Capacity Warning Banner */}
          {selectedProduct && selectedProduct.quantity >= (selectedProduct.maxCapacity || selectedProduct.quantity || 1) && (
            <div className="py-2 bg-transparent text-amber-600 dark:text-amber-400 text-xs flex flex-col gap-1 font-medium">
              <span className="font-bold">Stock capacity is full ({selectedProduct.quantity}/{selectedProduct.maxCapacity || selectedProduct.quantity || 1} units)</span>
              <span>You cannot stock in right now. You need to stock out first before you can stock in to prevent overflowing the capacity level.</span>
            </div>
          )}

          {/* Units to Receive (No asterisk) */}
          <div className="flex flex-col gap-2">
            <label className="text-neutral-700 dark:text-[#EDEDED] text-sm font-semibold">
              Units to receive
            </label>
            <input
              type="number"
              min="1"
              value={opQuantity}
              onChange={(e) => setOpQuantity(e.target.value ? Number(e.target.value) : '')}
              placeholder="e.g. 25"
              required
              disabled={selectedProduct ? selectedProduct.quantity >= (selectedProduct.maxCapacity || selectedProduct.quantity || 1) : false}
              className="w-full py-3.5 px-4 rounded-xl border border-neutral-300 dark:border-[#262626] bg-white dark:bg-[#121212] text-neutral-900 dark:text-[#EDEDED] text-base focus:outline-none focus:border-brand-orange dark:focus:border-[#FB714B] shadow-xs disabled:opacity-50 disabled:cursor-not-allowed"
            />
            {/* Quick add increment buttons */}
            <div className="flex items-center gap-2 pt-1">
              <span className="text-xs text-neutral-400 dark:text-[#737373]">Quick add:</span>
              {[5, 10, 25, 50].map((num) => (
                <button
                  key={num}
                  type="button"
                  disabled={selectedProduct ? selectedProduct.quantity >= (selectedProduct.maxCapacity || selectedProduct.quantity || 1) : false}
                  onClick={() => setOpQuantity((prev) => (Number(prev) || 0) + num)}
                  className="px-2.5 py-1 text-xs rounded-lg border border-neutral-200 dark:border-[#262626] bg-white dark:bg-[#121212] hover:bg-neutral-50 dark:hover:bg-[#1C1C1C] text-neutral-700 dark:text-[#EDEDED] cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  +{num}
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 flex items-center gap-3">
            <button
              type="submit"
              disabled={
                products.length === 0 ||
                (selectedProduct ? selectedProduct.quantity >= (selectedProduct.maxCapacity || selectedProduct.quantity || 1) : false)
              }
              className="flex-1 bg-[#121212] dark:bg-white hover:bg-neutral-800 dark:hover:bg-neutral-200 text-white dark:text-neutral-900 py-3.5 px-6 rounded-xl font-bold text-sm border-2 border-transparent cursor-pointer shadow-sm active:border-[#FB714B] active:ring-2 active:ring-[#FB714B]/30 focus:outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
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
      {/* 3. STOCK OUT SLIDE-OVER DRAWER (RIGHT SIDE)                              */}
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
                <div
                  onClick={() => setZoomProduct(selectedProduct)}
                  className="relative group cursor-pointer shrink-0"
                  title="Click to zoom part image"
                >
                  <img
                    src={selectedProduct.image}
                    alt={selectedProduct.name}
                    className="w-20 h-20 rounded-xl object-contain p-0 bg-transparent border-0 shadow-none shrink-0 transition-transform group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/20 rounded-xl opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white pointer-events-none">
                    <HiOutlineMagnifyingGlassPlus className="w-5 h-5 drop-shadow" />
                  </div>
                </div>
              ) : (
                <div className="w-20 h-20 rounded-xl bg-white dark:bg-[#0A0A0A] border border-neutral-200 dark:border-[#262626] flex items-center justify-center text-neutral-400 shrink-0">
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

          {/* Units to Dispatch (No asterisk) */}
          <div className="flex flex-col gap-2">
            <label className="text-neutral-700 dark:text-[#EDEDED] text-sm font-semibold">
              Units to dispatch
            </label>
            <input
              type="number"
              min="1"
              max={selectedProduct ? selectedProduct.quantity : undefined}
              value={opQuantity}
              onChange={(e) => setOpQuantity(e.target.value ? Number(e.target.value) : '')}
              placeholder="e.g. 5"
              required
              className="w-full py-3.5 px-4 rounded-xl border border-neutral-300 dark:border-[#262626] bg-white dark:bg-[#121212] text-neutral-900 dark:text-[#EDEDED] text-base focus:outline-none focus:border-brand-orange dark:focus:border-[#FB714B] shadow-xs"
            />
          </div>

          {/* Dispatch Reason (Plain typing text input) */}
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

          {/* Notes */}
          <div className="flex flex-col gap-2">
            <label className="text-neutral-700 dark:text-[#EDEDED] text-sm font-semibold">
              Customer or work order reference (optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Work order #1042 or customer name..."
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
              className="flex-1 bg-[#121212] dark:bg-white hover:bg-neutral-800 dark:hover:bg-neutral-200 text-white dark:text-neutral-900 py-3.5 px-6 rounded-xl font-bold text-sm border-2 border-transparent cursor-pointer shadow-sm active:border-[#FB714B] active:ring-2 active:ring-[#FB714B]/30 focus:outline-none transition-all disabled:opacity-50"
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

      {/* Delete Single Product Confirmation Dialog (Pixel-matched with Reference Screenshot 1) */}
      <ConfirmDialog
        isOpen={!!deleteTargetProduct}
        onClose={() => setDeleteTargetProduct(null)}
        onConfirm={() => {
          if (deleteTargetProduct) {
            deleteProduct(deleteTargetProduct.id);
            setDeleteTargetProduct(null);
          }
        }}
        title={
          <>
            Delete the <span className="text-[#DC2626] dark:text-[#EF4444] font-bold">{deleteTargetProduct?.name}</span>?
          </>
        }
        description="The bike part will be permanently deleted. All related stock movements and audit logs for this part will also be deleted."
        confirmLabel="Delete"
        cancelLabel="Cancel"
        isDestructive={true}
      />

      {/* Delete All Products Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteAllModalOpen}
        onClose={() => setDeleteAllModalOpen(false)}
        onConfirm={() => {
          deleteProductsByCategory(category);
          setDeleteAllModalOpen(false);
        }}
        title={
          <>
            Delete all parts in <span className="text-[#DC2626] dark:text-[#EF4444] font-bold">{pageTitle}</span>?
          </>
        }
        description={`All ${filteredProducts.length} bike parts in this section will be permanently deleted from the catalog and database. All related stock movements and audit records will also be removed. This action cannot be undone.`}
        confirmLabel="Delete all"
        cancelLabel="Cancel"
        isDestructive={true}
      />

      {/* Part Image Zoom Lightbox Modal */}
      {zoomProduct && (
        <ImageZoomModal
          isOpen={!!zoomProduct}
          onClose={() => setZoomProduct(null)}
          imageUrl={zoomProduct.image || ''}
          title={zoomProduct.name}
          brand={zoomProduct.brand}
          sku={zoomProduct.sku}
          price={zoomProduct.price}
        />
      )}
    </div>
  );
};

export default ProductsPage;
