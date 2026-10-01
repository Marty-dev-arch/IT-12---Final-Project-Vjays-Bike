import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import StatsCard from '../../components/ui/StatsCard';
import SlideOver from '../../components/ui/SlideOver';
import PartImagePicker from '../../components/ui/PartImagePicker';
import { useInventory } from '../../context/InventoryContext';
import {
  MinimalStockChart,
  type StockDataPoint,
} from '@/components/ui/animated-card-chart';
import CategoryRadarChart from '../../components/ui/CategoryRadarChart';
import { NotificationAlertModal } from '../../components/ui/NotificationAlertModal';
import { WarehouseIntakeCalendar } from '../../components/ui/WarehouseIntakeCalendar';
import {
  HiOutlineCube,
  HiOutlineArchiveBox,
  HiOutlineArrowDownTray,
  HiOutlineArrowUpTray,
  HiOutlineExclamationTriangle,
  HiOutlineChevronRight,
  HiOutlinePlus,
  HiOutlinePhoto,
  HiOutlineTrash,
  HiOutlineMagnifyingGlass,
  HiOutlineXMark,
  HiOutlineTag,
  HiOutlineMapPin,
  HiOutlineCurrencyDollar,
} from 'react-icons/hi2';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    products,
    movements,
    schedules,
    stockIn,
    stockOut,
    addProduct,
    updateProduct,
    addSchedule,
    deleteSchedule,
    getStats,
    getRestockQueue,
    searchQuery,
    setSearchQuery,
  } = useInventory();

  // Slide-over drawers
  const [stockInDrawerOpen, setStockInDrawerOpen] = useState(false);
  const [stockOutDrawerOpen, setStockOutDrawerOpen] = useState(false);
  const [addPartDrawerOpen, setAddPartDrawerOpen] = useState(false);
  const [scheduleDrawerOpen, setScheduleDrawerOpen] = useState(false);
  const [chartPeriod, setChartPeriod] = useState<'daily' | 'weekly' | 'monthly'>('weekly');

  // Schedule Restock form state
  const [scheduledProductId, setScheduledProductId] = useState('');
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTargetQty, setScheduledTargetQty] = useState<number | ''>(10);
  const [scheduledNotes, setScheduledNotes] = useState('');
  const [scheduleError, setScheduleError] = useState('');
  const [alertModalData, setAlertModalData] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    buttonText?: string;
  }>({
    isOpen: false,
    title: '',
    message: '',
    buttonText: 'Okay, I Understand',
  });

  // Stock In / Out forms
  const [selectedProductId, setSelectedProductId] = useState('');
  const [quantity, setQuantity] = useState<number | ''>('');
  const [stockInNotes, setStockInNotes] = useState('');
  const [stockOutReason, setStockOutReason] = useState('Workshop repair');
  const [stockOutNotes, setStockOutNotes] = useState('');
  const [actionError, setActionError] = useState('');

  // Add Part drawer form state
  const [newPartName, setNewPartName] = useState('');
  const [newPartSku, setNewPartSku] = useState('');
  const [newPartCategory, setNewPartCategory] = useState('braking-system');
  const [newPartBrand, setNewPartBrand] = useState('');
  const [newPartPrice, setNewPartPrice] = useState<number | ''>('');
  const [newPartCostPrice, setNewPartCostPrice] = useState<number | ''>('');
  const [newPartQuantity, setNewPartQuantity] = useState<number | ''>('');
  const [newPartMinStock, setNewPartMinStock] = useState<number | ''>(5);
  const [newPartMaxCapacity, setNewPartMaxCapacity] = useState<number | ''>(30);
  const [newPartLocation, setNewPartLocation] = useState('Warehouse shelf a1');
  const [newPartImage, setNewPartImage] = useState<string>('');
  const [partFormError, setPartFormError] = useState('');

  const stats = getStats();
  const restockQueue = getRestockQueue();
  const recentMovements = movements.slice(0, 5);

  const selectedProduct = products.find((p) => p.id === selectedProductId);

  // Search results for header search bar
  const searchResults = searchQuery.trim()
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const today = new Date();
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const currentDayIndex = today.getDay();

  const formatLocalDate = (d: Date) => {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const getWeekDates = () => {
    const dates = [];
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - currentDayIndex + 1);
    for (let i = 0; i < 6; i++) {
      const d = new Date(startOfWeek);
      d.setDate(startOfWeek.getDate() + i);
      const isoDate = formatLocalDate(d);
      const daySchedules = schedules.filter((s) => s.scheduledDate === isoDate);
      dates.push({
        day: weekDays[d.getDay()],
        date: d.getDate(),
        isoDate,
        isToday: d.toDateString() === today.toDateString(),
        isRestockDay: d.getDay() === 2 || d.getDay() === 4 || daySchedules.length > 0,
        schedules: daySchedules,
      });
    }
    return dates;
  };

  // Stock Velocity calculation logic (how many days until stock runs out)
  const velocityInfo = useMemo(() => {
    const outMovements = movements.filter((m) => m.type === 'out');
    const totalOutUnits = outMovements.reduce((sum, m) => sum + m.quantity, 0);

    const now = Date.now();
    const sevenDaysAgo = now - 7 * 24 * 60 * 60 * 1000;
    const recentOut = outMovements.filter((m) => new Date(m.timestamp).getTime() >= sevenDaysAgo);
    const recentOutUnits = recentOut.reduce((sum, m) => sum + m.quantity, 0);

    // Units dispatched per day
    const dailyBurnRate = recentOutUnits > 0 ? recentOutUnits / 7 : (totalOutUnits > 0 ? totalOutUnits / 14 : 0);
    const physicalStock = products.reduce((sum, p) => sum + p.quantity, 0);

    let daysUntilStockout: number | null = null;
    let statusLabel = 'No activity';

    if (dailyBurnRate > 0) {
      daysUntilStockout = Number((physicalStock / dailyBurnRate).toFixed(1));
      if (daysUntilStockout <= 3) {
        statusLabel = 'Critical runway';
      } else if (daysUntilStockout <= 7) {
        statusLabel = 'Rapid depletion';
      } else {
        statusLabel = 'Standard turnaround';
      }
    } else if (physicalStock > 0) {
      if (stats.dispatchedToday > 0) {
        daysUntilStockout = Number((physicalStock / stats.dispatchedToday).toFixed(1));
        statusLabel = 'Active turnaround';
      } else {
        statusLabel = 'Stable stock';
      }
    }

    // Individual parts nearing exhaustion or zero
    const productRunways = products.map((p) => {
      const pOut = outMovements
        .filter((m) => m.productId === p.id)
        .reduce((sum, m) => sum + m.quantity, 0);
      const pDaily = pOut > 0 ? pOut / 7 : 0;
      const daysLeft = pDaily > 0 ? Number((p.quantity / pDaily).toFixed(1)) : (p.quantity <= p.minStock ? 2.5 : 999);
      return {
        product: p,
        daysLeft,
        isLow: p.quantity <= p.minStock,
      };
    }).sort((a, b) => a.daysLeft - b.daysLeft);

    const criticalItems = productRunways.filter((r) => r.isLow || r.daysLeft <= 7);

    return {
      dailyBurnRate,
      daysUntilStockout,
      statusLabel,
      criticalItems: criticalItems.slice(0, 3),
      physicalStock,
    };
  }, [products, movements, stats.dispatchedToday]);

  // Financial Inventory Valuation Breakdown by Product Category
  const categoryValuations = useMemo(() => {
    const categoryDefs = [
      { id: 'braking-system', label: 'Braking system' },
      { id: 'drivetrain-chains', label: 'Drivetrain & chains' },
      { id: 'handle-bar-handle-grip', label: 'Handle Bar & Handle Grip' },
    ];

    const known = new Set(categoryDefs.map((c) => c.id));
    products.forEach((p) => {
      if (!known.has(p.category)) {
        categoryDefs.push({
          id: p.category,
          label: p.category.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()),
        });
        known.add(p.category);
      }
    });

    return categoryDefs.map((cat) => {
      const catProducts = products.filter((p) => p.category === cat.id);
      const skuCount = catProducts.length;
      const totalUnits = catProducts.reduce((sum, p) => sum + p.quantity, 0);
      const costBasis = catProducts.reduce((sum, p) => sum + p.quantity * p.costPrice, 0);
      const sellingBasis = catProducts.reduce((sum, p) => sum + p.quantity * p.price, 0);
      const potentialProfit = sellingBasis - costBasis;
      const profitMarginPercent = sellingBasis > 0 ? (potentialProfit / sellingBasis) * 100 : 0;

      return {
        id: cat.id,
        label: cat.label,
        skuCount,
        totalUnits,
        costBasis,
        sellingBasis,
        potentialProfit,
        profitMarginPercent,
      };
    });
  }, [products]);

  const valuationTotals = useMemo(() => {
    const totalSkus = categoryValuations.reduce((sum, c) => sum + c.skuCount, 0);
    const totalUnits = categoryValuations.reduce((sum, c) => sum + c.totalUnits, 0);
    const totalCostBasis = categoryValuations.reduce((sum, c) => sum + c.costBasis, 0);
    const totalSellingBasis = categoryValuations.reduce((sum, c) => sum + c.sellingBasis, 0);
    const totalProfit = totalSellingBasis - totalCostBasis;
    const totalMargin = totalSellingBasis > 0 ? (totalProfit / totalSellingBasis) * 100 : 0;

    return {
      totalSkus,
      totalUnits,
      totalCostBasis,
      totalSellingBasis,
      totalProfit,
      totalMargin,
    };
  }, [categoryValuations]);

  // Generate dynamic stock in/out points for Daily, Weekly, and Monthly periods
  const getPeriodData = (): {
    data: StockDataPoint[];
    totalIn: number;
    totalOut: number;
    periodLabel: string;
  } => {
    if (chartPeriod === 'daily') {
      const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      const currentDay = today.getDay();
      const mondayOffset = currentDay === 0 ? -6 : 1 - currentDay;
      const monday = new Date(today);
      monday.setDate(today.getDate() + mondayOffset);

      let totalIn = 0;
      let totalOut = 0;

      const data: StockDataPoint[] = dayNames.map((name, i) => {
        const d = new Date(monday);
        d.setDate(monday.getDate() + i);
        const dateStr = d.toDateString();

        const dayIn = movements
          .filter((m) => m.type === 'in' && new Date(m.timestamp).toDateString() === dateStr)
          .reduce((sum, m) => sum + m.quantity, 0);

        const dayOut = movements
          .filter((m) => m.type === 'out' && new Date(m.timestamp).toDateString() === dateStr)
          .reduce((sum, m) => sum + m.quantity, 0);

        totalIn += dayIn;
        totalOut += dayOut;

        return {
          label: name,
          stockIn: dayIn,
          stockOut: dayOut,
        };
      });

      return { data, totalIn, totalOut, periodLabel: 'This week' };
    }

    if (chartPeriod === 'weekly') {
      const currentMonth = today.getMonth();
      const currentYear = today.getFullYear();
      const weekRanges = [
        { label: 'Week 1', start: 1, end: 7 },
        { label: 'Week 2', start: 8, end: 14 },
        { label: 'Week 3', start: 15, end: 21 },
        { label: 'Week 4', start: 22, end: 31 },
      ];

      let totalIn = 0;
      let totalOut = 0;

      const data: StockDataPoint[] = weekRanges.map((range) => {
        const weekIn = movements
          .filter((m) => {
            if (m.type !== 'in') return false;
            const md = new Date(m.timestamp);
            return (
              md.getMonth() === currentMonth &&
              md.getFullYear() === currentYear &&
              md.getDate() >= range.start &&
              md.getDate() <= range.end
            );
          })
          .reduce((sum, m) => sum + m.quantity, 0);

        const weekOut = movements
          .filter((m) => {
            if (m.type !== 'out') return false;
            const md = new Date(m.timestamp);
            return (
              md.getMonth() === currentMonth &&
              md.getFullYear() === currentYear &&
              md.getDate() >= range.start &&
              md.getDate() <= range.end
            );
          })
          .reduce((sum, m) => sum + m.quantity, 0);

        totalIn += weekIn;
        totalOut += weekOut;

        return {
          label: range.label,
          stockIn: weekIn,
          stockOut: weekOut,
        };
      });

      return { data, totalIn, totalOut, periodLabel: 'This month' };
    }

    // Monthly: Last 6 months
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthsData: StockDataPoint[] = [];
    let totalIn = 0;
    let totalOut = 0;

    for (let i = 5; i >= 0; i--) {
      const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const mIdx = d.getMonth();
      const y = d.getFullYear();

      const mIn = movements
        .filter((m) => {
          if (m.type !== 'in') return false;
          const md = new Date(m.timestamp);
          return md.getMonth() === mIdx && md.getFullYear() === y;
        })
        .reduce((sum, m) => sum + m.quantity, 0);

      const mOut = movements
        .filter((m) => {
          if (m.type !== 'out') return false;
          const md = new Date(m.timestamp);
          return md.getMonth() === mIdx && md.getFullYear() === y;
        })
        .reduce((sum, m) => sum + m.quantity, 0);

      totalIn += mIn;
      totalOut += mOut;

      monthsData.push({
        label: monthNames[mIdx],
        stockIn: mIn,
        stockOut: mOut,
      });
    }

    return { data: monthsData, totalIn, totalOut, periodLabel: 'Last 6 months' };
  };

  const {
    data: periodChartData,
    totalIn: periodTotalIn,
    totalOut: periodTotalOut,
  } = getPeriodData();

  // Stock In submission
  const handleStockInSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setActionError('');
    if (!selectedProductId) {
      setActionError('Please select a part');
      return;
    }
    if (!quantity || Number(quantity) <= 0) {
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
    if (!quantity || Number(quantity) <= 0) {
      setActionError('Please enter a valid quantity greater than 0');
      return;
    }

    const product = products.find((p) => p.id === selectedProductId);
    if (product && product.quantity < Number(quantity)) {
      setActionError(`Insufficient stock! Available units: ${product.quantity}`);
      return;
    }

    const success = stockOut(selectedProductId, Number(quantity), stockOutReason, stockOutNotes);
    if (success) {
      setStockOutDrawerOpen(false);
      setSelectedProductId('');
      setQuantity('');
      setStockOutNotes('');
    } else {
      setActionError('Failed to process stock out');
    }
  };

  // Add Part image file upload
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setPartFormError('Image size exceeds 5 mb limit');
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setNewPartImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Attach/update image for existing selected product in Stock In/Out
  const handleAttachImageToSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedProductId) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      updateProduct(selectedProductId, { image: reader.result as string });
    };
    reader.readAsDataURL(file);
  };

  // Add Part submission
  const handleAddPartSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPartFormError('');
    if (!newPartName.trim()) {
      setPartFormError('Please enter a part name');
      return;
    }
    if (!newPartSku.trim()) {
      setPartFormError('Please enter a sku');
      return;
    }

    const created = addProduct({
      name: newPartName.trim(),
      sku: newPartSku.trim(),
      category: newPartCategory,
      brand: newPartBrand.trim() || 'Generic',
      price: Number(newPartPrice) || 0,
      costPrice: Number(newPartCostPrice) || 0,
      quantity: Number(newPartQuantity) || 0,
      minStock: Number(newPartMinStock) || 5,
      maxCapacity: Number(newPartMaxCapacity) || 30,
      location: newPartLocation.trim() || 'Warehouse shelf a1',
      image: newPartImage || undefined,
    });

    if (created) {
      setAddPartDrawerOpen(false);
      setNewPartName('');
      setNewPartSku('');
      setNewPartCategory('braking-system');
      setNewPartBrand('');
      setNewPartPrice('');
      setNewPartCostPrice('');
      setNewPartQuantity('');
      setNewPartMinStock(5);
      setNewPartMaxCapacity(30);
      setNewPartLocation('Warehouse shelf a1');
      setNewPartImage('');
    }
  };

  // Schedule Restock submission
  const handleScheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setScheduleError('');
    if (!scheduledProductId) {
      setScheduleError('Please select a bike part to restock');
      return;
    }
    const targetDate = scheduledDate || formatLocalDate(new Date());
    if (!scheduledTargetQty || Number(scheduledTargetQty) <= 0) {
      setScheduleError('Please enter a valid planned quantity');
      return;
    }

    addSchedule({
      productId: scheduledProductId,
      scheduledDate: targetDate,
      targetQuantity: Number(scheduledTargetQty),
      notes: scheduledNotes.trim(),
    });

    setScheduleDrawerOpen(false);
    setScheduledProductId('');
    setScheduledNotes('');
    setScheduledTargetQty(10);
  };

  return (
    <div className="p-3.5 sm:p-6 lg:p-8 font-poppins pb-8">
      <div className="flex flex-col gap-5 sm:gap-6">
        {/* Welcome Banner */}
        <div className="flex flex-col gap-0.5 sm:gap-1">
          <h1 className="text-neutral-900 dark:text-[#EDEDED] text-2xl sm:text-3xl font-semibold tracking-tight">
            {getGreeting()}, Vjay
          </h1>
          <p className="text-neutral-500 dark:text-[#A1A1A1] text-xs sm:text-sm">
            Here's your inventory overview for today.
          </p>
        </div>

        {/* Live Search Results (Activated by Header Search Bar) */}
        {searchQuery.trim().length > 0 && (
          <div className="bg-white dark:bg-[#0A0A0A] p-4 sm:p-6 rounded-2xl border border-brand-border dark:border-[#262626] shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <HiOutlineMagnifyingGlass className="w-5 h-5 text-brand-orange-dark dark:text-[#FB714B]" />
                <h2 className="text-sm sm:text-base font-bold text-neutral-900 dark:text-[#EDEDED]">
                  Search results for "{searchQuery}"
                </h2>
                <span className="text-xs text-neutral-500 dark:text-[#A1A1A1]">
                  ({searchResults.length} {searchResults.length === 1 ? 'part found' : 'parts found'})
                </span>
              </div>
              <button
                onClick={() => setSearchQuery('')}
                className="text-xs text-neutral-500 hover:text-neutral-900 dark:hover:text-[#EDEDED] flex items-center gap-1 cursor-pointer bg-transparent border-0"
              >
                <HiOutlineXMark className="w-4 h-4" />
                Clear search
              </button>
            </div>

            {searchResults.length === 0 ? (
              <p className="text-xs text-neutral-500 dark:text-[#737373] py-4 text-center">
                No matching parts found for "{searchQuery}". Try searching by part name, sku, or brand.
              </p>
            ) : (
              <div className="flex flex-col border-t border-brand-border dark:border-[#262626]">
                {searchResults.map((item) => (
                  <div
                    key={item.id}
                    className="py-2.5 px-2 border-b border-brand-border/70 dark:border-[#222222] flex items-center justify-between gap-3 hover:bg-neutral-50/50 dark:hover:bg-[#141414]/50 transition-colors"
                  >
                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-9 h-9 rounded-lg object-contain bg-transparent shrink-0"
                        />
                      ) : (
                        <div className="w-9 h-9 rounded-lg bg-neutral-100 dark:bg-[#161616] flex items-center justify-center shrink-0 text-neutral-400">
                          <HiOutlineCube className="w-4 h-4 stroke-1" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <span className="text-xs font-bold text-neutral-900 dark:text-[#EDEDED] truncate block">
                          {item.name}
                        </span>
                        <span className="text-[11px] text-neutral-500 dark:text-[#A1A1A1] block truncate">
                          Sku: {item.sku} • Stock: <b className="text-neutral-900 dark:text-[#EDEDED]">{item.quantity}</b>
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0 minimal-v-divider pl-2.5">
                      <button
                        onClick={() => {
                          setSelectedProductId(item.id);
                          setStockInDrawerOpen(true);
                        }}
                        className="btn-adapt adapt-mobile px-2 py-1 bg-[#121212] dark:bg-white text-white dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-200 text-[11px] font-bold rounded cursor-pointer transition-colors"
                      >
                        Stock in
                      </button>
                      <button
                        onClick={() => {
                          setSelectedProductId(item.id);
                          setStockOutDrawerOpen(true);
                        }}
                        className="btn-adapt adapt-mobile px-2 py-1 bg-white dark:bg-[#1A1A1A] border border-neutral-300 dark:border-[#262626] text-neutral-800 dark:text-[#EDEDED] text-[11px] font-bold rounded cursor-pointer hover:bg-neutral-50 dark:hover:bg-[#222] transition-colors"
                      >
                        Stock out
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Stats Row - 2x2 grid on mobile, 4 columns on desktop */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
          <StatsCard
            label="Catalog breadth"
            value={stats.catalogBreadth}
            subtitle="Active skus cataloged"
            icon={<HiOutlineCube className="w-5 h-5 text-neutral-600 dark:text-[#A1A1A1]" />}
          />
          <StatsCard
            label="Physical stock volume"
            value={stats.physicalStockVolume}
            subtitle="Units across shelves"
            icon={<HiOutlineArchiveBox className="w-5 h-5 text-neutral-600 dark:text-[#A1A1A1]" />}
          />
          <StatsCard
            label="Floor intake today"
            value={stats.inflowToday}
            subtitle="Logged into stock"
            icon={<HiOutlineArrowDownTray className="w-5 h-5 text-neutral-600 dark:text-[#A1A1A1]" />}
          />
          <StatsCard
            label="Dispatched today"
            value={stats.dispatchedToday}
            subtitle="Dispatched for orders"
            icon={<HiOutlineArrowUpTray className="w-5 h-5 text-neutral-600 dark:text-[#A1A1A1]" />}
          />
        </div>

        {/* Main 2-Column Content */}
        <div className="flex flex-col lg:flex-row gap-5 sm:gap-6">
          {/* Right Column - Operations + Restock (Order-first on mobile for immediate thumb reach!) */}
          <div className="w-full lg:w-[320px] flex flex-col gap-4 sm:gap-5 order-first lg:order-last">
            {/* Direct Floor Operations Buttons */}
            <div className="flex flex-col bg-white dark:bg-[#0A0A0A] p-4 sm:p-6 gap-3 sm:gap-3.5 rounded-2xl border border-brand-border dark:border-[#262626] shadow-xs">
              <span className="text-[#6F6F6F] dark:text-[#A1A1A1] text-[11px] font-semibold">Direct floor operations</span>
              <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
                {/* Stock In - Opens Slide-over Screen */}
                {/* Stock In - Opens Slide-over Screen */}
                <button
                  onClick={() => {
                    setActionError('');
                    setStockInDrawerOpen(true);
                  }}
                  className="btn-adapt adapt-mobile flex items-center justify-center bg-[#121212] dark:bg-white hover:bg-neutral-800 dark:hover:bg-neutral-200 text-white dark:text-neutral-900 py-2 sm:py-2.5 px-3 gap-1.5 rounded-lg font-bold text-xs border border-transparent active:border-red-500 cursor-pointer shadow-none active:scale-[0.98] focus:outline-none transition-all"
                >
                  <HiOutlineArrowDownTray className="w-3.5 h-3.5" />
                  Stock in
                </button>
                {/* Stock Out - Opens Slide-over Screen */}
                <button
                  onClick={() => {
                    setActionError('');
                    setStockOutDrawerOpen(true);
                  }}
                  className="btn-adapt adapt-mobile flex items-center justify-center bg-brand-cream dark:bg-[#121212] text-neutral-900 dark:text-[#EDEDED] border border-brand-border dark:border-[#262626] active:border-red-500 py-2 sm:py-2.5 px-3 gap-1.5 rounded-lg font-bold text-xs cursor-pointer shadow-none active:scale-[0.98] focus:outline-none transition-all"
                >
                  <HiOutlineArrowUpTray className="w-3.5 h-3.5 text-neutral-700 dark:text-[#EDEDED]" />
                  Stock out
                </button>
              </div>

              {/* Add Part Shortcut */}
              <button
                onClick={() => {
                  setPartFormError('');
                  setAddPartDrawerOpen(true);
                }}
                className="btn-adapt adapt-mobile flex items-center justify-center w-full py-2 px-3 rounded-lg border border-dashed border-neutral-300 dark:border-[#262626] active:border-red-500 text-neutral-800 dark:text-[#EDEDED] hover:border-neutral-400 dark:hover:border-[#404040] text-xs font-semibold cursor-pointer active:scale-[0.98] focus:outline-none transition-all"
              >
                <HiOutlinePlus className="w-3.5 h-3.5 mr-1" />
                Add part
              </button>
            </div>

            {/* Restock Queue */}
            <div className="flex flex-col bg-white dark:bg-[#0A0A0A] p-4 sm:p-6 gap-3.5 sm:gap-4 rounded-2xl border border-brand-border dark:border-[#262626] shadow-xs">
              {/* Alert Banner */}
              <div
                onClick={() => {
                  if (restockQueue.length > 0) {
                    setAlertModalData({
                      isOpen: true,
                      title: "Don't miss your restock",
                      message: `You have ${restockQueue.length} ${
                        restockQueue.length === 1 ? 'part' : 'parts'
                      } currently below safety buffer: ${restockQueue
                        .map((p) => `${p.name} (${p.quantity} left)`)
                        .join(', ')}. Better to restock early to prevent catalog shortages.`,
                      buttonText: 'Okay, I Understand',
                    });
                  } else {
                    setAlertModalData({
                      isOpen: true,
                      title: 'Inventory levels optimal',
                      message:
                        'All registered bicycle parts are safely stocked above minimum safety buffer thresholds. No urgent restock needed.',
                      buttonText: 'Okay, I Understand',
                    });
                  }
                }}
                className={`flex items-center p-3 gap-2.5 sm:gap-3 rounded-xl border cursor-pointer hover:opacity-95 transition-all select-none ${
                  restockQueue.length > 0
                    ? 'bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-900/50'
                    : 'bg-[#FFF8E1] dark:bg-[#121212] border-[#E6510033] dark:border-[#262626]'
                }`}
              >
                <HiOutlineExclamationTriangle
                  className={`w-5 h-5 shrink-0 ${
                    restockQueue.length > 0 ? 'text-red-600 dark:text-red-400' : 'text-[#E65100] dark:text-[#FB714B]'
                  }`}
                />
                <div className="flex-1 min-w-0">
                  <span
                    className={`text-xs font-bold block truncate ${
                      restockQueue.length > 0 ? 'text-red-700 dark:text-red-300' : 'text-[#E65100] dark:text-[#FB714B]'
                    }`}
                  >
                    {restockQueue.length} {restockQueue.length === 1 ? 'item requires restocking' : 'items require restocking'}
                  </span>
                  <span className="text-neutral-500 dark:text-[#A1A1A1] text-[10px] sm:text-[11px] block truncate">
                    {restockQueue.length > 0
                      ? 'Immediate intake needed'
                      : 'All items above safety buffer'}
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-neutral-900 dark:text-[#EDEDED] text-sm sm:text-base font-bold">Restock queue</span>
                <span className="text-brand-orange-dark dark:text-[#FB714B] text-[11px] sm:text-xs font-bold">
                  {restockQueue.length} pending
                </span>
              </div>

              {/* Minimalist Restock Parts List */}
              <div className="flex flex-col gap-2 max-h-60 overflow-y-auto">
                {restockQueue.length === 0 ? (
                  <div className="py-4 text-center text-xs text-neutral-400 dark:text-[#737373]">
                    No items requiring restock right now.
                  </div>
                ) : (
                  restockQueue.map((item) => (
                    <div
                      key={item.id}
                      className="py-2.5 px-1 border-b border-brand-border/70 dark:border-[#222222] last:border-b-0 flex items-center justify-between gap-2.5 hover:bg-neutral-50/50 dark:hover:bg-[#141414]/50 transition-colors"
                    >
                      <div className="flex items-center gap-2.5 min-w-0 flex-1">
                        {item.image ? (
                          <div className="w-9 h-9 shrink-0 bg-transparent flex items-center justify-center">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-contain"
                            />
                          </div>
                        ) : (
                          <div className="w-9 h-9 shrink-0 bg-neutral-100 dark:bg-[#161616] rounded-md flex items-center justify-center text-neutral-400">
                            <HiOutlineCube className="w-4 h-4 stroke-1" />
                          </div>
                        )}
                        <div className="min-w-0 flex-1">
                          <span className="text-xs font-bold text-neutral-900 dark:text-[#EDEDED] block truncate">
                            {item.name}
                          </span>
                          <span className="text-[11px] text-neutral-500 dark:text-[#A1A1A1] block truncate mt-0.5">
                            {item.brand && <span className="font-semibold text-neutral-800 dark:text-neutral-200">{item.brand} • </span>}
                            <b className="text-red-600 dark:text-red-400 font-bold">{item.quantity}</b> in stock (min: {item.minStock})
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          setSelectedProductId(item.id);
                          setStockInDrawerOpen(true);
                        }}
                        className="btn-adapt adapt-mobile px-2.5 py-1 bg-[#121212] dark:bg-white text-white dark:text-neutral-900 text-[11px] font-bold rounded cursor-pointer shrink-0 hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-colors"
                      >
                        Restock
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Left Column - Schedule, Stock Flow, Charts */}
          <div className="flex-1 flex flex-col gap-5 sm:gap-6 min-w-0">
            {/* Top row: Operational Restock Schedule & Radar */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
              {/* Warehouse Intake Calendar */}
              <WarehouseIntakeCalendar
                schedules={schedules}
                onAddSchedule={(dateStr) => {
                  setScheduledDate(dateStr);
                  setScheduleDrawerOpen(true);
                }}
              />

              {/* Category Radar Chart */}
              <CategoryRadarChart categories={categoryValuations} />
            </div>

            {/* Minimalist Stock Flow Animated Chart */}
            <MinimalStockChart
              period={chartPeriod}
              onPeriodChange={setChartPeriod}
              data={periodChartData}
              totalIn={periodTotalIn}
              totalOut={periodTotalOut}
              title="Stock flow distribution"
              description="Real-time stock in and out flow"
            />
          </div>
        </div>
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
                <div className="relative group shrink-0">
                  <img
                    src={selectedProduct.image}
                    alt={selectedProduct.name}
                    className="w-20 h-20 rounded-xl object-contain bg-transparent border-0 shadow-none"
                  />
                  <label className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 rounded-xl flex flex-col items-center justify-center text-white text-[10px] cursor-pointer transition-opacity">
                    <HiOutlinePhoto className="w-4 h-4 mb-0.5" />
                    <span>Change</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAttachImageToSelected}
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
                    onChange={handleAttachImageToSelected}
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
                  onClick={() => setQuantity((prev) => (Number(prev) || 0) + num)}
                  className="px-2.5 py-1 text-xs rounded-lg border border-neutral-200 dark:border-[#262626] bg-white dark:bg-[#121212] hover:bg-neutral-50 dark:hover:bg-[#1C1C1C] text-neutral-700 dark:text-[#EDEDED] cursor-pointer"
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
              disabled={products.length === 0 || (selectedProduct ? selectedProduct.quantity >= (selectedProduct.maxCapacity || selectedProduct.quantity || 1) : false)}
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
                    Available stock: <b className="text-neutral-900 dark:text-white">{selectedProduct.quantity}</b>
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

          {/* Customer / Reference Note */}
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
              className="flex-1 bg-[#121212] dark:bg-white hover:bg-neutral-800 dark:hover:bg-neutral-200 text-white dark:text-neutral-900 py-3.5 px-6 rounded-xl font-bold text-sm border-2 border-transparent cursor-pointer shadow-sm active:border-[#FB714B] active:ring-2 active:ring-[#FB714B]/30 focus:outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
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

      {/* ========================================================================= */}
      {/* 3. ADD PART SLIDE-OVER DRAWER (RIGHT SIDE)                               */}
      {/* ========================================================================= */}
      <SlideOver
        isOpen={addPartDrawerOpen}
        onClose={() => setAddPartDrawerOpen(false)}
        title="Add new part"
        subtitle="Register a new bicycle part or accessory into shop catalog"
        side="right"
        widthClass="w-full md:w-[50vw] md:max-w-[50vw]"
      >
        <form onSubmit={handleAddPartSubmit} className="flex flex-col gap-6">
          {partFormError && (
            <div className="py-2 bg-transparent text-red-600 dark:text-red-400 text-xs font-semibold">
              {partFormError}
            </div>
          )}

          {/* Interactive Bike Part Image Library with Google Lens Zoom */}
          <PartImagePicker
            selectedImage={newPartImage}
            onSelectImage={(imageUrl, template) => {
              setNewPartImage(imageUrl);
              if (!newPartName.trim()) setNewPartName(template?.name || '');
              if (!newPartSku.trim()) setNewPartSku(template?.suggestedSku || '');
              if (!newPartBrand.trim()) setNewPartBrand(template?.suggestedBrand || '');
            }}
            onRemoveImage={() => setNewPartImage('')}
          />

          {/* Part Name */}
          <div className="flex flex-col gap-2">
            <label className="text-neutral-700 dark:text-[#EDEDED] text-sm font-semibold">
              Part name
            </label>
            <input
              type="text"
              required
              value={newPartName}
              onChange={(e) => setNewPartName(e.target.value)}
              placeholder="e.g. Shimano Deore hydraulic disc brake"
              className="w-full py-3.5 px-4 rounded-xl border border-neutral-300 dark:border-[#262626] bg-white dark:bg-[#121212] text-neutral-900 dark:text-[#EDEDED] text-base focus:outline-none focus:border-brand-orange dark:focus:border-[#FB714B] shadow-xs"
            />
          </div>

          {/* Sku & Brand Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-neutral-700 dark:text-[#EDEDED] text-sm font-semibold">
                Sku
              </label>
              <input
                type="text"
                required
                value={newPartSku}
                onChange={(e) => setNewPartSku(e.target.value)}
                placeholder="e.g. Brk-shm-01"
                className="w-full py-3.5 px-4 rounded-xl border border-neutral-300 dark:border-[#262626] bg-white dark:bg-[#121212] text-neutral-900 dark:text-[#EDEDED] text-sm focus:outline-none focus:border-brand-orange dark:focus:border-[#FB714B] shadow-xs"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-neutral-700 dark:text-[#EDEDED] text-sm font-semibold">
                Brand
              </label>
              <input
                type="text"
                value={newPartBrand}
                onChange={(e) => setNewPartBrand(e.target.value)}
                placeholder="e.g. Shimano, Sram, Kmc"
                className="w-full py-3.5 px-4 rounded-xl border border-neutral-300 dark:border-[#262626] bg-white dark:bg-[#121212] text-neutral-900 dark:text-[#EDEDED] text-sm focus:outline-none focus:border-brand-orange dark:focus:border-[#FB714B] shadow-xs"
              />
            </div>
          </div>

          {/* Category */}
          <div className="flex flex-col gap-2">
            <label className="text-neutral-700 dark:text-[#EDEDED] text-sm font-semibold">
              Category
            </label>
            <select
              value={newPartCategory}
              onChange={(e) => setNewPartCategory(e.target.value)}
              className="w-full py-3.5 px-4 rounded-xl border border-neutral-300 dark:border-[#262626] bg-white dark:bg-[#121212] text-neutral-900 dark:text-[#EDEDED] text-sm focus:outline-none focus:border-brand-orange dark:focus:border-[#FB714B] shadow-xs cursor-pointer"
            >
              <option value="braking-system">Braking system</option>
              <option value="drivetrain-chains">Drivetrain & chains</option>
              <option value="handle-bar-handle-grip">Handle Bar & Handle Grip</option>
              <option value="suspension-forks">Suspension & forks</option>
              <option value="tires-tubes">Tires & tubes</option>
              <option value="cockpit-handlebars">Cockpit & handlebars</option>
              <option value="accessories-lights">Accessories & lights</option>
            </select>
          </div>

          {/* Selling Price & Cost Price Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-neutral-700 dark:text-[#EDEDED] text-sm font-semibold">
                Selling price (₱)
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                required
                value={newPartPrice}
                onChange={(e) => setNewPartPrice(e.target.value ? Number(e.target.value) : '')}
                placeholder="e.g. 1850"
                className="w-full py-3.5 px-4 rounded-xl border border-neutral-300 dark:border-[#262626] bg-white dark:bg-[#121212] text-neutral-900 dark:text-[#EDEDED] text-sm focus:outline-none focus:border-brand-orange dark:focus:border-[#FB714B] shadow-xs"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-neutral-700 dark:text-[#EDEDED] text-sm font-semibold">
                Cost price (₱)
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={newPartCostPrice}
                onChange={(e) => setNewPartCostPrice(e.target.value ? Number(e.target.value) : '')}
                placeholder="e.g. 1200"
                className="w-full py-3.5 px-4 rounded-xl border border-neutral-300 dark:border-[#262626] bg-white dark:bg-[#121212] text-neutral-900 dark:text-[#EDEDED] text-sm focus:outline-none focus:border-brand-orange dark:focus:border-[#FB714B] shadow-xs"
              />
            </div>
          </div>

          {/* Initial Stock, Safety Buffer & Max Shelf Capacity */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-neutral-700 dark:text-[#EDEDED] text-sm font-semibold">
                Stock Units
              </label>
              <input
                type="number"
                min="0"
                required
                value={newPartQuantity}
                onChange={(e) => setNewPartQuantity(e.target.value ? Number(e.target.value) : '')}
                placeholder="e.g. 15"
                className="w-full py-3.5 px-4 rounded-xl border border-neutral-300 dark:border-[#262626] bg-white dark:bg-[#121212] text-neutral-900 dark:text-[#EDEDED] text-sm focus:outline-none focus:border-brand-orange dark:focus:border-[#FB714B] shadow-xs"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-neutral-700 dark:text-[#EDEDED] text-sm font-semibold">
                Safety Min Stock level
              </label>
              <input
                type="number"
                min="1"
                required
                value={newPartMinStock}
                onChange={(e) => setNewPartMinStock(e.target.value ? Number(e.target.value) : '')}
                placeholder="e.g. 5"
                className="w-full py-3.5 px-4 rounded-xl border border-neutral-300 dark:border-[#262626] bg-white dark:bg-[#121212] text-neutral-900 dark:text-[#EDEDED] text-sm focus:outline-none focus:border-brand-orange dark:focus:border-[#FB714B] shadow-xs"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-neutral-700 dark:text-[#EDEDED] text-sm font-semibold">
                Max shelf capacity
              </label>
              <input
                type="number"
                min="1"
                value={newPartMaxCapacity}
                onChange={(e) => setNewPartMaxCapacity(e.target.value ? Number(e.target.value) : '')}
                placeholder="e.g. 30"
                className="w-full py-3.5 px-4 rounded-xl border border-neutral-300 dark:border-[#262626] bg-white dark:bg-[#121212] text-neutral-900 dark:text-[#EDEDED] text-sm focus:outline-none focus:border-brand-orange dark:focus:border-[#FB714B] shadow-xs"
              />
            </div>
          </div>

          {/* Storage Bin Location */}
          <div className="flex flex-col gap-2">
            <label className="text-neutral-700 dark:text-[#EDEDED] text-sm font-semibold">
              Storage bin location
            </label>
            <input
              type="text"
              value={newPartLocation}
              onChange={(e) => setNewPartLocation(e.target.value)}
              placeholder="e.g. Warehouse shelf a1, Bins rack 4"
              className="w-full py-3.5 px-4 rounded-xl border border-neutral-300 dark:border-[#262626] bg-white dark:bg-[#121212] text-neutral-900 dark:text-[#EDEDED] text-sm focus:outline-none focus:border-brand-orange dark:focus:border-[#FB714B] shadow-xs"
            />
          </div>

          {/* Action Buttons */}
          <div className="pt-4 flex items-center gap-3">
            <button
              type="submit"
              className="flex-1 bg-[#121212] dark:bg-white hover:bg-neutral-800 dark:hover:bg-neutral-200 text-white dark:text-neutral-900 py-3.5 px-6 rounded-xl font-bold text-sm border-2 border-transparent cursor-pointer shadow-sm active:border-[#FB714B] active:ring-2 active:ring-[#FB714B]/30 focus:outline-none transition-all"
            >
              Save part
            </button>
            <button
              type="button"
              onClick={() => setAddPartDrawerOpen(false)}
              className="px-5 py-3.5 rounded-xl border border-neutral-300 dark:border-[#262626] text-neutral-700 dark:text-[#EDEDED] hover:bg-neutral-50 dark:hover:bg-[#1C1C1C] text-sm font-semibold cursor-pointer transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </SlideOver>

      {/* ========================================================================= */}
      {/* 4. SCHEDULE RESTOCK SLIDE-OVER DRAWER (RIGHT SIDE)                        */}
      {/* ========================================================================= */}
      <SlideOver
        isOpen={scheduleDrawerOpen}
        onClose={() => setScheduleDrawerOpen(false)}
        title="Schedule part restock"
        subtitle="Plan and schedule warehouse intake delivery dates for bicycle parts"
        side="right"
        widthClass="w-full md:w-[50vw] md:max-w-[50vw]"
      >
        <form onSubmit={handleScheduleSubmit} className="flex flex-col gap-6">
          {scheduleError && (
            <div className="py-2 bg-transparent text-red-600 dark:text-red-400 text-xs font-semibold">
              {scheduleError}
            </div>
          )}

          {/* Select Part Section */}
          <div className="flex flex-col gap-2">
            <label className="text-neutral-700 dark:text-[#EDEDED] text-sm font-semibold">
              Select part to restock
            </label>
            {products.length === 0 ? (
              <div className="py-2 bg-transparent text-amber-600 dark:text-amber-400 text-xs font-semibold">
                No parts registered yet. Please add a part first.
              </div>
            ) : (
              <select
                value={scheduledProductId}
                onChange={(e) => setScheduledProductId(e.target.value)}
                required
                className="w-full py-3.5 px-4 rounded-xl border border-neutral-300 dark:border-[#262626] bg-white dark:bg-[#121212] text-neutral-900 dark:text-[#EDEDED] text-sm focus:outline-none focus:border-brand-orange dark:focus:border-[#FB714B] shadow-xs cursor-pointer"
              >
                <option value="">-- Choose a part from catalog --</option>
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} (Sku: {p.sku}) — Stock: {p.quantity} / Buffer: {p.minStock}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Selected Part Preview */}
          {scheduledProductId && (() => {
            const prod = products.find((p) => p.id === scheduledProductId);
            if (!prod) return null;
            return (
              <div className="p-4 rounded-2xl bg-brand-cream/80 dark:bg-[#121212] border border-brand-border dark:border-[#262626] flex items-center gap-4">
                {prod.image ? (
                  <img
                    src={prod.image}
                    alt={prod.name}
                    className="w-14 h-14 rounded-xl object-contain bg-transparent border-0 shrink-0"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-xl bg-transparent border-0 flex items-center justify-center shrink-0 text-neutral-400">
                    <HiOutlineCube className="w-6 h-6 stroke-1" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold text-neutral-900 dark:text-[#EDEDED] truncate">
                    {prod.name}
                  </h4>
                  <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-neutral-500 dark:text-[#A1A1A1]">
                    <span>Sku: {prod.sku}</span>
                    <span>•</span>
                    <span>Current units: <b className="text-neutral-900 dark:text-white">{prod.quantity}</b></span>
                    <span>•</span>
                    <span>Min buffer: {prod.minStock}</span>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* Scheduled Date (Set directly from calendar selection) */}
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-brand-cream/80 dark:bg-[#121212] border border-brand-border dark:border-[#262626]">
            <span className="text-xs text-neutral-500 dark:text-[#A1A1A1]">Target intake date:</span>
            <span className="text-xs font-bold text-neutral-900 dark:text-[#EDEDED]">{scheduledDate}</span>
          </div>

          {/* Planned Quantity */}
          <div className="flex flex-col gap-2">
            <label className="text-neutral-700 dark:text-[#EDEDED] text-sm font-semibold">
              Planned restock quantity (units)
            </label>
            <input
              type="number"
              min="1"
              required
              value={scheduledTargetQty}
              onChange={(e) => setScheduledTargetQty(e.target.value ? Number(e.target.value) : '')}
              placeholder="e.g. 10"
              className="w-full py-3.5 px-4 rounded-xl border border-neutral-300 dark:border-[#262626] bg-white dark:bg-[#121212] text-neutral-900 dark:text-[#EDEDED] text-sm focus:outline-none focus:border-brand-orange dark:focus:border-[#FB714B] shadow-xs"
            />
          </div>



          {/* Action Buttons */}
          <div className="pt-4 flex items-center gap-3">
            <button
              type="submit"
              className="flex-1 bg-[#121212] dark:bg-white hover:bg-neutral-800 dark:hover:bg-neutral-200 text-white dark:text-neutral-900 py-3.5 px-6 rounded-xl font-bold text-sm border-2 border-transparent cursor-pointer shadow-sm active:border-[#FB714B] active:ring-2 active:ring-[#FB714B]/30 focus:outline-none transition-all"
            >
              Confirm schedule
            </button>
            <button
              type="button"
              onClick={() => setScheduleDrawerOpen(false)}
              className="px-5 py-3.5 rounded-xl border border-neutral-300 dark:border-[#262626] text-neutral-700 dark:text-[#EDEDED] hover:bg-neutral-50 dark:hover:bg-[#1C1C1C] text-sm font-semibold cursor-pointer transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </SlideOver>

      {/* Alert / Notification Message Modal (Matching reference layout with project UI styling) */}
      <NotificationAlertModal
        isOpen={alertModalData.isOpen}
        onClose={() => setAlertModalData((prev) => ({ ...prev, isOpen: false }))}
        title={alertModalData.title}
        message={alertModalData.message}
        buttonText={alertModalData.buttonText || 'Okay, I Understand'}
      />
    </div>
  );
};

const HiOutlineCalendarIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
    />
  </svg>
);

export default DashboardPage;
