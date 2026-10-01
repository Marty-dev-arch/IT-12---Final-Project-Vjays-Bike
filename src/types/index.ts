export interface Product {
  id: string;
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
  status: 'in-stock' | 'low-stock' | 'critical' | 'out-of-stock';
  image?: string;
  createdAt: string;
  updatedAt: string;
}

export interface StockMovement {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  image?: string;
  type: 'in' | 'out';
  quantity: number;
  timestamp: string;
  notes?: string;
}

export interface AuditLog {
  id: string;
  action: string;
  productName: string;
  sku: string;
  brand?: string;
  category?: string;
  details: string;
  user: string;
  timestamp: string;
  type: 'stock-in' | 'stock-out' | 'adjustment' | 'verification';
}

export interface DashboardStats {
  stockValuation: number;
  catalogBreadth: number;
  physicalStockVolume: number;
  maxCapacity: number;
  inflowToday: number;
  dispatchedToday: number;
}

export interface User {
  id: string;
  name: string;
  phone: string;
  role: 'owner' | 'staff';
}

export type ProductCategory = 
  | 'all'
  | 'braking-system'
  | 'drivetrain-chains'
  | 'handle-bar-handle-grip'
  | 'gears-sprockets'
  | 'wheels-tires'
  | 'accessories';

export interface RestockSchedule {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  targetQuantity: number;
  scheduledDate: string; // YYYY-MM-DD
  notes?: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  createdAt: string;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'restock' | 'stock-out' | 'capacity' | 'info';
  timestamp: string;
  read: boolean;
  scheduleId?: string;
  productId?: string;
}
