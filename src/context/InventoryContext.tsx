import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { Product, StockMovement, AuditLog, DashboardStats, RestockSchedule, AppNotification } from '../types';
import { playNotificationChime } from '../utils/audio';
import { productsApi, stockApi, schedulesApi, auditApi } from '../services/api';

interface InventoryContextType {
  products: Product[];
  movements: StockMovement[];
  auditLogs: AuditLog[];
  schedules: RestockSchedule[];
  notifications: AppNotification[];
  unreadNotificationsCount: number;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  addProduct: (data: {
    name: string;
    sku: string;
    category: string;
    brand: string;
    price: number;
    costPrice: number;
    quantity: number;
    minStock: number;
    maxCapacity?: number;
    location: string;
    image?: string;
  }) => Product;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  deleteProductsByCategory: (category: string) => void;
  deleteAllProducts: () => void;
  stockIn: (productId: string, quantity: number, notes?: string) => boolean;
  stockOut: (productId: string, quantity: number, reason?: string, notes?: string) => boolean;
  addSchedule: (data: {
    productId: string;
    scheduledDate: string;
    targetQuantity?: number;
    notes?: string;
  }) => RestockSchedule;
  deleteSchedule: (id: string) => void;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  clearAllNotifications: () => void;
  getStats: () => DashboardStats;
  getRestockQueue: () => Product[];
  exportLogsToCSV: () => void;
  clearMovements: () => void;
  clearAllData: () => void;
  alertModalData: AlertModalConfig | null;
  showAlertModal: (config: Omit<AlertModalConfig, 'isOpen'>) => void;
  closeAlertModal: () => void;
}

export interface AlertModalConfig {
  isOpen: boolean;
  title: string;
  message: string;
  buttonText?: string;
  timestamp?: string;
  onConfirm?: () => void;
}

const InventoryContext = createContext<InventoryContextType | undefined>(undefined);

const computeStatus = (quantity: number, minStock: number): Product['status'] => {
  if (quantity <= 0) return 'out-of-stock';
  if (quantity <= Math.ceil(minStock * 0.5)) return 'critical';
  if (quantity <= minStock) return 'low-stock';
  return 'in-stock';
};

const cleanDuplicateMovements = (items: StockMovement[]): StockMovement[] => {
  const seen = new Set<string>();
  return items.filter((item) => {
    const key = `${item.productId}_${item.type}_${item.quantity}_${item.timestamp}_${item.notes}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

const cleanDuplicateAuditLogs = (items: AuditLog[]): AuditLog[] => {
  const seen = new Set<string>();
  return items.filter((item) => {
    const key = `${item.action}_${item.sku}_${item.details}_${item.timestamp}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

const DEFAULT_PRODUCTS: Product[] = [
  {
    id: 'prod_bolids_caliper',
    name: 'Mechanical Disc Brake Caliper',
    sku: 'BLD-180-01',
    category: 'braking-system',
    brand: 'BOLIDS',
    price: 650,
    costPrice: 420,
    quantity: 12,
    minStock: 5,
    maxCapacity: 25,
    location: 'Warehouse shelf a1',
    status: 'in-stock',
    image: '/images/products/bolids-disc-brake-caliper.jpg',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod_universal_pads',
    name: 'Disc Brake Pads with Spring',
    sku: 'PAD-DSK-01',
    category: 'braking-system',
    brand: 'Universal',
    price: 180,
    costPrice: 95,
    quantity: 24,
    minStock: 8,
    maxCapacity: 50,
    location: 'Warehouse shelf a2',
    status: 'in-stock',
    image: '/images/products/universal-disc-brake-pads.jpg',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod_shimano_chain',
    name: 'CN-HG53 9-Speed Chain (116L)',
    sku: 'CN-HG53-01',
    category: 'drivetrain-chains',
    brand: 'Shimano',
    price: 400,
    costPrice: 280,
    quantity: 15,
    minStock: 5,
    maxCapacity: 30,
    location: 'Warehouse shelf b1',
    status: 'in-stock',
    image: '/images/products/shimano-cn-hg53-chain.jpg',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod_bucklos_cassette',
    name: 'Bicycle Cassette',
    sku: 'BCK-CAS-01',
    category: 'drivetrain-chains',
    brand: 'BUCKLOS',
    price: 850,
    costPrice: 560,
    quantity: 8,
    minStock: 4,
    maxCapacity: 20,
    location: 'Warehouse shelf b2',
    status: 'in-stock',
    image: '/images/products/bucklos-bicycle-cassette.jpg',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod_meroca_pulley',
    name: '13T CNC Jockey Wheel Pulley',
    sku: 'MRC-13T-01',
    category: 'drivetrain-chains',
    brand: 'MEROCA',
    price: 165,
    costPrice: 90,
    quantity: 20,
    minStock: 6,
    maxCapacity: 40,
    location: 'Warehouse shelf b3',
    status: 'in-stock',
    image: '/images/products/meroca-13t-jockey-wheel.jpg',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod_ragusa_crankset',
    name: 'R-500 1x Crankset with Chainring',
    sku: 'RGS-R500-01',
    category: 'drivetrain-chains',
    brand: 'RAGUSA',
    price: 1250,
    costPrice: 850,
    quantity: 12,
    minStock: 4,
    maxCapacity: 25,
    location: 'Warehouse shelf b4',
    status: 'in-stock',
    image: '/images/products/ragusa-r500-crankset.jpg',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod_inspeed_handlebar',
    name: '6061-T6 Alloy Handlebar (31.8mm)',
    sku: 'INSP-HB-01',
    category: 'handle-bar-handle-grip',
    brand: 'INSPEED',
    price: 650,
    costPrice: 420,
    quantity: 14,
    minStock: 5,
    maxCapacity: 30,
    location: 'Warehouse shelf c1',
    status: 'in-stock',
    image: '/images/products/inspeed-alloy-handlebar.jpg',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod_purple_lockon_grips',
    name: 'Dual Lock-On Handlebar Grips (Purple)',
    sku: 'GRP-LCK-PRP-01',
    category: 'handle-bar-handle-grip',
    brand: 'Universal',
    price: 280,
    costPrice: 150,
    quantity: 22,
    minStock: 8,
    maxCapacity: 45,
    location: 'Warehouse shelf c2',
    status: 'in-stock',
    image: '/images/products/universal-purple-lock-on-grips.jpg',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const stripBrandFromPartName = (p: Product): Product => {
  let cat = p.category as string;
  if (cat === 'gears-sprockets') cat = 'handle-bar-handle-grip';

  // Strip leading brand name if present in name so brand stays in its dedicated column
  const brandPatterns = /^(BOLIDS|Shimano|BUCKLOS|MEROCA|RAGUSA|INSPEED|Universal|Sram|Spank|ODI)\s+/i;
  const cleanName = (p.name || '').replace(brandPatterns, '').trim();

  return {
    ...p,
    name: cleanName || p.name,
    category: cat,
  };
};

export const InventoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('vjays_products');
    if (saved !== null) {
      try {
        const parsed: Product[] = JSON.parse(saved);
        return parsed.map(stripBrandFromPartName);
      } catch {
        return [];
      }
    }
    return DEFAULT_PRODUCTS.map(stripBrandFromPartName);
  });

  const [movements, setMovements] = useState<StockMovement[]>(() => {
    const saved = localStorage.getItem('vjays_movements');
    return saved ? cleanDuplicateMovements(JSON.parse(saved)) : [];
  });

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    const saved = localStorage.getItem('vjays_audit_logs');
    return saved ? cleanDuplicateAuditLogs(JSON.parse(saved)) : [];
  });

  const [schedules, setSchedules] = useState<RestockSchedule[]>(() => {
    const saved = localStorage.getItem('vjays_schedules');
    return saved ? JSON.parse(saved) : [];
  });

  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    const saved = localStorage.getItem('vjays_notifications');
    return saved ? JSON.parse(saved) : [];
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [alertModalData, setAlertModalData] = useState<AlertModalConfig | null>(null);

  const showAlertModal = useCallback((config: Omit<AlertModalConfig, 'isOpen'>) => {
    setAlertModalData({ ...config, isOpen: true });
  }, []);

  const closeAlertModal = useCallback(() => {
    setAlertModalData(null);
  }, []);

  useEffect(() => {
    localStorage.setItem('vjays_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('vjays_movements', JSON.stringify(movements));
  }, [movements]);

  useEffect(() => {
    localStorage.setItem('vjays_audit_logs', JSON.stringify(auditLogs));
  }, [auditLogs]);

  useEffect(() => {
    localStorage.setItem('vjays_schedules', JSON.stringify(schedules));
  }, [schedules]);

  useEffect(() => {
    localStorage.setItem('vjays_notifications', JSON.stringify(notifications));
  }, [notifications]);

  // Auto-clean orphaned stock movements and audit logs whose products were deleted
  useEffect(() => {
    if (products.length === 0) {
      setMovements((prev) => {
        if (prev.length > 0) {
          localStorage.removeItem('vjays_movements');
          return [];
        }
        return prev;
      });
      setAuditLogs((prev) => {
        if (prev.length > 0) {
          localStorage.removeItem('vjays_audit_logs');
          return [];
        }
        return prev;
      });
      return;
    }

    const activeIds = new Set(products.map((p) => String(p.id)));
    const activeSkus = new Set(products.map((p) => (p.sku || '').trim().toLowerCase()).filter(Boolean));
    const activeNames = new Set(products.map((p) => (p.name || '').trim().toLowerCase()).filter(Boolean));

    setMovements((prev) => {
      const valid = prev.filter(
        (m) =>
          activeIds.has(String(m.productId)) ||
          (m.sku && activeSkus.has(m.sku.trim().toLowerCase())) ||
          (m.productName && activeNames.has(m.productName.trim().toLowerCase()))
      );
      if (valid.length !== prev.length) {
        localStorage.setItem('vjays_movements', JSON.stringify(valid));
        return valid;
      }
      return prev;
    });

    setAuditLogs((prev) => {
      const valid = prev.filter((log) => {
        // Exclude deletion action logs from frontend history view
        if (
          log.action === 'Deleted Product' ||
          log.action === 'Deleted All Products' ||
          log.action === 'Deleted Category Products'
        ) {
          return false;
        }
        const skuMatch = log.sku && activeSkus.has(log.sku.trim().toLowerCase());
        const nameMatch = log.productName && activeNames.has(log.productName.trim().toLowerCase());
        return skuMatch || nameMatch;
      });
      if (valid.length !== prev.length) {
        localStorage.setItem('vjays_audit_logs', JSON.stringify(valid));
        return valid;
      }
      return prev;
    });
  }, [products]);

  // Check for restock schedules that are active today or due, and AUTOMATICALLY RESTOCK THEM!
  useEffect(() => {
    const todayStr = new Date().toISOString().slice(0, 10);
    const dueSchedules = schedules.filter(
      (s) => s.status === 'scheduled' && s.scheduledDate <= todayStr
    );

    if (dueSchedules.length > 0) {
      dueSchedules.forEach((sched) => {
        const prod = products.find((p) => p.id === sched.productId);
        if (!prod) return;

        const qty = sched.targetQuantity && sched.targetQuantity > 0 ? sched.targetQuantity : 2;
        const newQty = prod.quantity + qty;
        const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        const updatedProd: Product = {
          ...prod,
          quantity: newQty,
          maxCapacity: Math.max(prod.maxCapacity || 0, newQty),
          status: computeStatus(newQty, prod.minStock),
          updatedAt: new Date().toISOString(),
        };

        const mov: StockMovement = {
          id: `mov_${Date.now()}_${sched.id}`,
          productId: prod.id,
          productName: prod.name,
          sku: prod.sku,
          image: prod.image,
          type: 'in',
          quantity: qty,
          timestamp: new Date().toLocaleString(),
          notes: `Automated scheduled restock intake (+${qty} units)`,
        };

        const log: AuditLog = {
          id: `log_${Date.now()}_${sched.id}`,
          action: 'Auto Restock Executed',
          productName: prod.name,
          sku: prod.sku,
          details: `Your restocking schedule is going on now. Automatically restocked +${qty} units into inventory. Stock adjusted to ${newQty}.`,
          user: 'System (Auto-Restock)',
          timestamp: new Date().toLocaleString(),
          type: 'stock-in',
        };

        // Update product stock, movements, and audit logs
        setProducts((prev) => prev.map((p) => (p.id === prod.id ? updatedProd : p)));
        setMovements((prev) => cleanDuplicateMovements([mov, ...prev]));
        setAuditLogs((prev) => cleanDuplicateAuditLogs([log, ...prev]));

        // Mark schedule as completed so it does not auto-restock again
        setSchedules((prev) =>
          prev.map((s) => (s.id === sched.id ? { ...s, status: 'completed' } : s))
        );

        playNotificationChime();
        setNotifications((prev) => [
          {
            id: `notif_${Date.now()}_${sched.id}`,
            title: 'Restocking schedule alert',
            message: `Your restocking schedule is going on now. Automatically restocked ${qty} units of ${prod.name}.`,
            type: 'restock',
            timestamp: timeStr,
            read: false,
            scheduleId: sched.id,
            productId: sched.productId,
          },
          ...prev,
        ]);

        showAlertModal({
          title: 'Restocking schedule alert',
          message: `Your restocking schedule is going on now! The system has automatically restocked ${qty} ${qty === 1 ? 'unit' : 'units'} of ${prod.name} (SKU: ${prod.sku}) on its own. Current stock is now updated to ${newQty} units.`,
          buttonText: 'Okay, I Understand',
          timestamp: timeStr,
        });
      });

      // Notify backend database to process due schedules
      schedulesApi.autoProcessDue().catch(() => { });
    }
  }, [schedules, products, showAlertModal]);

  // Check for low stock items (quantity <= minStock) and generate alert notifications like schedule alerting
  useEffect(() => {
    products.forEach((p) => {
      if (p.quantity <= p.minStock) {
        setNotifications((prev) => {
          const exists = prev.some((n) => n.productId === p.id && n.title.includes('Low stock') && !n.read);
          if (!exists) {
            playNotificationChime();
            return [
              {
                id: `notif_low_${Date.now()}_${p.id}`,
                title: 'Low stock alert',
                message: `${p.name} is running low (${p.quantity} units remaining, min safety buffer is ${p.minStock}). Please restock now.`,
                type: 'restock',
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                read: false,
                productId: p.id,
              },
              ...prev,
            ];
          }
          return prev;
        });
      }
    });
  }, [products]);

  const unreadNotificationsCount = notifications.filter((n) => !n.read).length;

  const addProduct = useCallback(
    (data: {
      name: string;
      sku: string;
      category: string;
      brand: string;
      price: number;
      costPrice: number;
      quantity: number;
      minStock: number;
      maxCapacity?: number;
      location: string;
      image?: string;
    }): Product => {
      const now = new Date().toISOString();
      const status = computeStatus(data.quantity, data.minStock);
      const capacity =
        data.maxCapacity && data.maxCapacity > 0
          ? data.maxCapacity
          : (data.quantity > 0 ? data.quantity : 5);
      const newProduct: Product = {
        id: `prod_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        name: data.name,
        sku: data.sku,
        category: data.category,
        brand: data.brand,
        price: data.price,
        costPrice: data.costPrice,
        quantity: data.quantity,
        minStock: data.minStock,
        maxCapacity: capacity,
        location: data.location || 'Warehouse A',
        status,
        image: data.image,
        createdAt: now,
        updatedAt: now,
      };

      setProducts((prev) => [newProduct, ...prev]);

      // Save data directly to backend database server
      productsApi.create({
        name: newProduct.name,
        sku: newProduct.sku,
        category: newProduct.category,
        brand: newProduct.brand,
        price: newProduct.price,
        cost_price: newProduct.costPrice,
        quantity: newProduct.quantity,
        min_stock: newProduct.minStock,
        location: newProduct.location,
        image: newProduct.image,
      })
        .then((created: any) => {
          if (created && created.id) {
            setProducts((prev) =>
              prev.map((p) => (p.sku === newProduct.sku ? { ...p, id: String(created.id) } : p))
            );
          }
        })
        .catch((err) => {
          console.warn('Database server offline, saved in local state:', err);
        });

      // Add audit log
      const newLog: AuditLog = {
        id: `log_${Date.now()}`,
        action: 'Created Product',
        productName: newProduct.name,
        sku: newProduct.sku,
        brand: newProduct.brand,
        category: newProduct.category,
        details: `Initial stock: ${newProduct.quantity} units, Unit Price: ₱${newProduct.price}`,
        user: 'Vjay (Owner)',
        timestamp: new Date().toLocaleString(),
        type: 'verification',
      };
      setAuditLogs((prev) => [newLog, ...prev]);

      // If initial quantity > 0, create stock movement
      if (data.quantity > 0) {
        const movement: StockMovement = {
          id: `mov_${Date.now()}`,
          productId: newProduct.id,
          productName: newProduct.name,
          sku: newProduct.sku,
          image: newProduct.image,
          type: 'in',
          quantity: data.quantity,
          timestamp: new Date().toLocaleString(),
          notes: 'Initial inventory intake',
        };
        setMovements((prev) => [movement, ...prev]);
      }

      return newProduct;
    },
    []
  );

  const updateProduct = useCallback((id: string, updates: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const updated = { ...item, ...updates, updatedAt: new Date().toISOString() };
          updated.status = computeStatus(updated.quantity, updated.minStock);
          return updated;
        }
        return item;
      })
    );

    productsApi.update(id, {
      ...updates,
      cost_price: updates.costPrice,
      min_stock: updates.minStock,
    }).catch((err) => {
      console.warn('Database server offline, updated in local state:', err);
    });
  }, []);

  const deleteProduct = useCallback(
    (id: string) => {
      const target = products.find(
        (p) =>
          String(p.id) === String(id) ||
          (p.sku && p.sku.trim().toLowerCase() === String(id).trim().toLowerCase()) ||
          (p.name && p.name.trim().toLowerCase() === String(id).trim().toLowerCase())
      );

      const targetSku = (target?.sku || '').trim().toLowerCase();
      const targetName = (target?.name || '').trim().toLowerCase();
      const targetId = String(target?.id || id);

      setProducts((prev) =>
        prev.filter(
          (p) =>
            String(p.id) !== targetId &&
            (!targetSku || (p.sku || '').trim().toLowerCase() !== targetSku) &&
            (!targetName || (p.name || '').trim().toLowerCase() !== targetName)
        )
      );

      setMovements((prev) =>
        prev.filter(
          (m) =>
            String(m.productId) !== targetId &&
            (!targetSku || (m.sku || '').trim().toLowerCase() !== targetSku) &&
            (!targetName || (m.productName || '').trim().toLowerCase() !== targetName)
        )
      );

      // Remove logs for this deleted product from the frontend view (database retains full history)
      setAuditLogs((prev) =>
        prev.filter(
          (log) =>
            (!targetSku || (log.sku || '').trim().toLowerCase() !== targetSku) &&
            (!targetName || (log.productName || '').trim().toLowerCase() !== targetName) &&
            (!targetName || !log.details.toLowerCase().includes(targetName)) &&
            (!targetSku || !log.details.toLowerCase().includes(targetSku))
        )
      );

      setSchedules((prev) =>
        prev.filter(
          (s) =>
            String(s.productId) !== targetId &&
            (!targetSku || (s.sku || '').trim().toLowerCase() !== targetSku) &&
            (!targetName || (s.productName || '').trim().toLowerCase() !== targetName)
        )
      );

      setNotifications((prev) =>
        prev.filter(
          (n) =>
            String(n.productId) !== targetId &&
            (!targetName || !n.message.toLowerCase().includes(targetName))
        )
      );

      productsApi.delete(targetId, { sku: targetSku, name: targetName }).catch((err) => {
        console.warn('Database delete failed or offline:', err);
      });
    },
    [products]
  );

  const deleteProductsByCategory = useCallback(
    (category?: string) => {
      const cat = category || 'all';

      // Pre-compute targeted items synchronously from current products
      const targets = products.filter((p) => cat === 'all' || p.category === cat);
      const deletedIds = new Set(targets.map((p) => String(p.id)));
      const deletedSkus = new Set(targets.map((p) => (p.sku || '').trim().toLowerCase()).filter(Boolean));
      const deletedNames = new Set(targets.map((p) => (p.name || '').trim().toLowerCase()).filter(Boolean));

      setProducts((prev) => prev.filter((p) => cat !== 'all' && p.category !== cat));

      if (cat === 'all') {
        setMovements([]);
        setSchedules([]);
        setNotifications([]);
        setAuditLogs([]);
        localStorage.removeItem('vjays_products');
        localStorage.removeItem('vjays_movements');
        localStorage.removeItem('vjays_schedules');
        localStorage.removeItem('vjays_notifications');
        localStorage.removeItem('vjays_audit_logs');
      } else {
        setMovements((prev) =>
          prev.filter(
            (m) =>
              !deletedIds.has(String(m.productId)) &&
              (!m.sku || !deletedSkus.has(m.sku.trim().toLowerCase())) &&
              (!m.productName || !deletedNames.has(m.productName.trim().toLowerCase()))
          )
        );

        setSchedules((prev) =>
          prev.filter(
            (s) =>
              !deletedIds.has(String(s.productId)) &&
              (!s.sku || !deletedSkus.has(s.sku.trim().toLowerCase())) &&
              (!s.productName || !deletedNames.has(s.productName.trim().toLowerCase()))
          )
        );

        setNotifications((prev) =>
          prev.filter((n) => !n.productId || !deletedIds.has(String(n.productId)))
        );

        // Remove category products' logs from frontend view
        setAuditLogs((prev) =>
          prev.filter(
            (log) =>
              (!log.sku || !deletedSkus.has(log.sku.trim().toLowerCase())) &&
              (!log.productName || !deletedNames.has(log.productName.trim().toLowerCase())) &&
              (!log.category || log.category !== cat)
          )
        );
      }

      productsApi.deleteAll(cat).catch((err) => {
        console.warn('Database server offline, deleted in local state:', err);
      });
    },
    [products]
  );

  const deleteAllProducts = useCallback(() => {
    deleteProductsByCategory('all');
  }, [deleteProductsByCategory]);

  const addSchedule = useCallback(
    (data: {
      productId: string;
      scheduledDate: string;
      targetQuantity?: number;
      notes?: string;
    }): RestockSchedule => {
      const prod = products.find((p) => p.id === data.productId);
      const restockQty = data.targetQuantity && data.targetQuantity > 0 ? data.targetQuantity : 2;
      const todayStr = new Date().toISOString().slice(0, 10);
      const isDueNow = data.scheduledDate <= todayStr;
      const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      const newSchedule: RestockSchedule = {
        id: `sched_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        productId: data.productId,
        productName: prod ? prod.name : 'Selected part',
        sku: prod ? prod.sku : 'N/A',
        targetQuantity: restockQty,
        scheduledDate: data.scheduledDate,
        notes: data.notes || '',
        status: isDueNow ? 'completed' : 'scheduled',
        createdAt: new Date().toISOString(),
      };

      setSchedules((prev) => [newSchedule, ...prev]);

      // Dynamic stock capacity expansion logic:
      // When adding a restocking schedule (e.g. current stock is 2, planned restock is 10),
      // the product's stock capacity level expands to 2 + 10 = 12 so that restocked units fit cleanly
      // (moving with 12/12 instead of remaining 5 and causing 12/5).
      const plannedCapacity = prod ? prod.quantity + restockQty : restockQty;
      const newCapacity = prod ? Math.max(prod.maxCapacity || 0, plannedCapacity) : restockQty;

      if (isDueNow && prod) {
        // AUTOMATICALLY RESTOCK BY THEIR OWN!
        const newQty = prod.quantity + restockQty;
        const updatedProd: Product = {
          ...prod,
          quantity: newQty,
          maxCapacity: Math.max(newCapacity, newQty),
          status: computeStatus(newQty, prod.minStock),
          updatedAt: new Date().toISOString(),
        };

        const movId = `mov_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
        const logId = `log_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;

        const mov: StockMovement = {
          id: movId,
          productId: prod.id,
          productName: prod.name,
          sku: prod.sku,
          image: prod.image,
          type: 'in',
          quantity: restockQty,
          timestamp: new Date().toLocaleString(),
          notes: `Automated scheduled restock (+${restockQty} units)`,
        };

        const log: AuditLog = {
          id: logId,
          action: 'Auto Restock Executed',
          productName: prod.name,
          sku: prod.sku,
          details: `Your restocking schedule is going on now. Automatically restocked +${restockQty} units into inventory. Stock adjusted to ${newQty}.`,
          user: 'System (Auto-Restock)',
          timestamp: new Date().toLocaleString(),
          type: 'stock-in',
        };

        setProducts((prev) => prev.map((p) => (p.id === prod.id ? updatedProd : p)));
        setMovements((prev) => cleanDuplicateMovements([mov, ...prev]));
        setAuditLogs((prev) => cleanDuplicateAuditLogs([log, ...prev]));

        playNotificationChime();
        setNotifications((prev) => [
          {
            id: `notif_${Date.now()}_${newSchedule.id}`,
            title: 'Restocking schedule alert',
            message: `Your restocking schedule is going on now. Automatically restocked ${restockQty} units of ${prod.name}.`,
            type: 'restock',
            timestamp: timeStr,
            read: false,
            scheduleId: newSchedule.id,
            productId: data.productId,
          },
          ...prev,
        ]);

        showAlertModal({
          title: 'Restocking schedule alert',
          message: `Your restocking schedule is going on now! The system has automatically restocked ${restockQty} ${restockQty === 1 ? 'unit' : 'units'} of ${prod.name} (SKU: ${prod.sku}) on its own. Current stock is now updated to ${newQty} units.`,
          buttonText: 'Okay, I Understand',
          timestamp: timeStr,
        });

        // Forward to backend
        schedulesApi.create({
          product_id: data.productId,
          scheduled_date: data.scheduledDate,
          target_quantity: restockQty,
          notes: data.notes,
        }).catch((err) => {
          console.warn('Backend database offline, schedule & auto-restock recorded in local state:', err);
        });
      } else {
        // Scheduled for future date: expand product capacity level now to accommodate restock
        if (prod) {
          const updatedProd: Product = {
            ...prod,
            maxCapacity: newCapacity,
            updatedAt: new Date().toISOString(),
          };
          setProducts((prev) => prev.map((p) => (p.id === prod.id ? updatedProd : p)));
        }

        setNotifications((prev) => [
          {
            id: `notif_${Date.now()}_${newSchedule.id}`,
            title: 'Restocking scheduled',
            message: `Restock of ${restockQty} units for ${prod ? prod.name : 'part'} scheduled for ${data.scheduledDate}.`,
            type: 'restock',
            timestamp: timeStr,
            read: false,
            scheduleId: newSchedule.id,
            productId: data.productId,
          },
          ...prev,
        ]);

        showAlertModal({
          title: 'Restocking scheduled',
          message: `Restock schedule for ${prod ? prod.name : 'bicycle part'} (${restockQty} units) has been recorded for ${data.scheduledDate}. The system will automatically restock on its own when this date arrives.`,
          buttonText: 'Okay, I Understand',
          timestamp: timeStr,
        });

        schedulesApi.create({
          product_id: data.productId,
          scheduled_date: data.scheduledDate,
          target_quantity: restockQty,
          notes: data.notes,
        }).catch((err) => {
          console.warn('Backend database offline, schedule recorded in local state:', err);
        });
      }

      return newSchedule;
    },
    [products, showAlertModal]
  );

  const deleteSchedule = useCallback((id: string) => {
    const target = schedules.find((s) => s.id === id);
    const targetSku = target?.sku;
    const targetName = target?.productName;

    setSchedules((prev) => prev.filter((s) => s.id !== id));
    setNotifications((prev) => prev.filter((n) => n.scheduleId !== id));

    schedulesApi.delete(id, { sku: targetSku, productName: targetName }).catch((err) => {
      console.warn('Database delete schedule failed or offline:', err);
    });
  }, [schedules]);

  const markNotificationAsRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }, []);

  const markAllNotificationsAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  const stockIn = useCallback(
    (productId: string, quantity: number, notes?: string): boolean => {
      if (quantity <= 0) return false;

      const target = products.find((p) => p.id === productId);
      if (!target) return false;

      const capacity = target.maxCapacity || target.quantity || 1;
      // Prevent stock capacity overflow
      if (target.quantity >= capacity || target.quantity + quantity > capacity) {
        return false;
      }

      const newQty = target.quantity + quantity;
      const updated: Product = {
        ...target,
        quantity: newQty,
        maxCapacity: Math.max(capacity, newQty),
        status: computeStatus(newQty, target.minStock),
        updatedAt: new Date().toISOString(),
      };

      const movId = `mov_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
      const logId = `log_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
      const timeStr = new Date().toLocaleString();

      const mov: StockMovement = {
        id: movId,
        productId: target.id,
        productName: target.name,
        sku: target.sku,
        image: target.image,
        type: 'in',
        quantity,
        timestamp: timeStr,
        notes: notes || 'Floor restock intake',
      };

      const log: AuditLog = {
        id: logId,
        action: 'Stock Received',
        productName: target.name,
        sku: target.sku,
        details: `Received +${quantity} units. Stock adjusted to ${newQty}. Notes: ${notes || 'N/A'}`,
        user: 'Vjay (Owner)',
        timestamp: timeStr,
        type: 'stock-in',
      };

      setProducts((prev) => prev.map((p) => (p.id === productId ? updated : p)));
      setMovements((prev) => cleanDuplicateMovements([mov, ...prev]));
      setAuditLogs((prev) => cleanDuplicateAuditLogs([log, ...prev]));

      // Save stock intake in backend database
      stockApi.stockIn(productId, quantity, notes).catch((err) => {
        console.warn('Database server offline, stock-in saved in local state:', err);
      });

      return true;
    },
    [products]
  );

  const stockOut = useCallback(
    (productId: string, quantity: number, reason?: string, notes?: string): boolean => {
      if (quantity <= 0) return false;

      const target = products.find((p) => p.id === productId);
      if (!target || target.quantity < quantity) {
        return false;
      }

      const newQty = target.quantity - quantity;
      const updated: Product = {
        ...target,
        quantity: newQty,
        status: computeStatus(newQty, target.minStock),
        updatedAt: new Date().toISOString(),
      };

      const movId = `mov_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
      const logId = `log_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
      const timeStr = new Date().toLocaleString();

      const mov: StockMovement = {
        id: movId,
        productId: target.id,
        productName: target.name,
        sku: target.sku,
        image: target.image,
        type: 'out',
        quantity,
        timestamp: timeStr,
        notes: `${reason ? `[${reason.toUpperCase()}] ` : ''}${notes || 'Dispatched for repairs/sale'}`,
      };

      const log: AuditLog = {
        id: logId,
        action: 'Stock Dispatched',
        productName: target.name,
        sku: target.sku,
        details: `Dispatched -${quantity} units (${reason || 'Customer sale'}). Stock adjusted to ${newQty}.`,
        user: 'Vjay (Owner)',
        timestamp: timeStr,
        type: 'stock-out',
      };

      setProducts((prev) => prev.map((p) => (p.id === productId ? updated : p)));
      setMovements((prev) => cleanDuplicateMovements([mov, ...prev]));
      setAuditLogs((prev) => cleanDuplicateAuditLogs([log, ...prev]));

      // Save stock dispatch in backend database
      stockApi.stockOut(productId, quantity, notes || reason).catch((err) => {
        console.warn('Database server offline, stock-out saved in local state:', err);
      });

      // Low stock alerting: if quantity drops to or below minStock, trigger alert chime, notification, and popup modal alert
      if (newQty <= target.minStock) {
        playNotificationChime();
        const lowNotifId = `notif_low_${Date.now()}_${target.id}`;
        const lowNotif: AppNotification = {
          id: lowNotifId,
          title: 'Low stock alert',
          message: `${target.name} is running low (${newQty} units remaining, min safety buffer is ${target.minStock}). Please restock soon.`,
          type: 'restock',
          timestamp: timeStr,
          read: false,
          productId: target.id,
        };
        setNotifications((prev) => [lowNotif, ...prev]);

        showAlertModal({
          title: 'Low stock alert',
          message: `Warning: ${target.name} has dropped below the safety buffer threshold! Only ${newQty} ${newQty === 1 ? 'unit remains' : 'units remain'} in stock (Minimum safety buffer is ${target.minStock} units). Please restock soon to prevent catalog shortages.`,
          buttonText: 'Check Restock Schedule',
          timestamp: timeStr,
          onConfirm: () => {
            window.location.href = '/dashboard';
          },
        });
      }

      return true;
    },
    [products]
  );

  // Initial attempt to fetch products from backend database if available
  useEffect(() => {
    productsApi.getAll()
      .then((data: any) => {
        if (Array.isArray(data)) {
          if (data.length > 0) {
            const mapped: Product[] = data.map((d: any) => ({
              id: String(d.id),
              name: d.name,
              sku: d.sku,
              category: d.category,
              brand: d.brand || '',
              price: Number(d.price),
              costPrice: Number(d.cost_price ?? d.costPrice ?? 0),
              quantity: Number(d.quantity ?? 0),
              minStock: Number(d.min_stock ?? d.minStock ?? 5),
              maxCapacity: d.max_capacity ?? d.maxCapacity,
              location: d.location || 'Warehouse Shelf A1',
              status: d.status || computeStatus(Number(d.quantity ?? 0), Number(d.min_stock ?? 5)),
              image: d.image || '',
              createdAt: d.created_at || new Date().toISOString(),
              updatedAt: d.updated_at || new Date().toISOString(),
            }));
            setProducts(mapped);
          } else {
            // If the MySQL database is online and genuinely empty, reflect empty catalog
            setProducts([]);
          }
        }
      })
      .catch(() => {
        // Fallback to local state if database server is not yet running
      });
  }, []);

  const getStats = useCallback((): DashboardStats => {
    const stockValuation = products.reduce((sum, p) => sum + p.costPrice * p.quantity, 0);
    const catalogBreadth = products.length;
    const physicalStockVolume = products.reduce((sum, p) => sum + p.quantity, 0);

    const todayStr = new Date().toDateString();
    const inflowToday = movements
      .filter((m) => m.type === 'in' && new Date(m.timestamp).toDateString() === todayStr)
      .reduce((sum, m) => sum + m.quantity, 0);

    const dispatchedToday = movements
      .filter((m) => m.type === 'out' && new Date(m.timestamp).toDateString() === todayStr)
      .reduce((sum, m) => sum + m.quantity, 0);

    return {
      stockValuation,
      catalogBreadth,
      physicalStockVolume,
      maxCapacity: Math.max(100, physicalStockVolume + 50),
      inflowToday,
      dispatchedToday,
    };
  }, [products, movements]);

  const getRestockQueue = useCallback((): Product[] => {
    return products.filter((p) => p.quantity <= p.minStock);
  }, [products]);

  const exportLogsToCSV = useCallback(() => {
    if (auditLogs.length === 0) {
      alert('No audit logs available to export.');
      return;
    }
    const headers = ['ID', 'Action', 'Product Name', 'SKU', 'Type', 'Details', 'User', 'Timestamp'];
    const rows = auditLogs.map((log) => [
      log.id,
      `"${log.action.replace(/"/g, '""')}"`,
      `"${log.productName.replace(/"/g, '""')}"`,
      log.sku,
      log.type,
      `"${log.details.replace(/"/g, '""')}"`,
      `"${log.user.replace(/"/g, '""')}"`,
      `"${log.timestamp.replace(/"/g, '""')}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `vjays_audit_logs_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [auditLogs]);

  const clearMovements = useCallback(() => {
    localStorage.removeItem('vjays_movements');
    setMovements([]);
  }, []);

  const clearAllData = useCallback(() => {
    localStorage.removeItem('vjays_products');
    localStorage.removeItem('vjays_movements');
    localStorage.removeItem('vjays_schedules');
    localStorage.removeItem('vjays_notifications');
    setProducts([]);
    setMovements([]);
    setSchedules([]);
    setNotifications([]);
  }, []);

  return (
    <InventoryContext.Provider
      value={{
        products,
        movements,
        auditLogs,
        schedules,
        notifications,
        unreadNotificationsCount,
        searchQuery,
        setSearchQuery,
        addProduct,
        updateProduct,
        deleteProduct,
        deleteProductsByCategory,
        deleteAllProducts,
        stockIn,
        stockOut,
        addSchedule,
        deleteSchedule,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        clearAllNotifications,
        getStats,
        getRestockQueue,
        exportLogsToCSV,
        clearMovements,
        clearAllData,
        alertModalData,
        showAlertModal,
        closeAlertModal,
      }}
    >
      {children}
    </InventoryContext.Provider>
  );
};

export const useInventory = (): InventoryContextType => {
  const context = useContext(InventoryContext);
  if (!context) {
    throw new Error('useInventory must be used within an InventoryProvider');
  }
  return context;
};
