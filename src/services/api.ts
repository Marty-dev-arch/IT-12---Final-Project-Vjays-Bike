/**
 * API Service - Ready for Laravel backend connection
 * 
 * All endpoints return empty data for now.
 * When Laravel backend is ready, update BASE_URL and 
 * these functions will work with the real API.
 */

const BASE_URL = import.meta.env.VITE_API_URL || '/api';

// Helper for API requests
async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      // Add auth token when Laravel is connected
      // 'Authorization': `Bearer ${getToken()}`,
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`);
  }

  return response.json();
}

// Auth endpoints
export const authApi = {
  login: (pin: string) => request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ pin }),
  }),
  register: (phone: string) => request('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ phone }),
  }),
  createPin: (pin: string) => request('/auth/create-pin', {
    method: 'POST',
    body: JSON.stringify({ pin }),
  }),
  resetPin: (newPin: string, confirmPin: string, phone?: string, code?: string) => request('/auth/reset-pin', {
    method: 'POST',
    body: JSON.stringify({ new_pin: newPin, confirm_pin: confirmPin, phone, code }),
  }),
  // Forgot PIN Phone Verification OTP flow
  forgotPinSendCode: (phone: string) => request<{ success: boolean; message: string; phone: string; code?: string; expires_in?: number }>('/auth/forgot-pin/send-code', {
    method: 'POST',
    body: JSON.stringify({ phone }),
  }),
  forgotPinVerifyCode: (phone: string, code: string) => request<{ success: boolean; message: string }>('/auth/forgot-pin/verify-code', {
    method: 'POST',
    body: JSON.stringify({ phone, code }),
  }),
  forgotPinReset: (data: { phone: string; code: string; new_pin: string; confirm_pin: string }) => request<{ success: boolean; message: string; user?: any }>('/auth/forgot-pin/reset-pin', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
};

// Products endpoints
export const productsApi = {
  getAll: () => request('/products'),
  getByCategory: (category: string) => request(`/products?category=${category}`),
  getById: (id: string) => request(`/products/${id}`),
  create: (data: any) => request('/products', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id: string, data: any) => request(`/products/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id: string, options?: { sku?: string; name?: string }) => {
    const params = new URLSearchParams();
    if (options?.sku) params.append('sku', options.sku);
    if (options?.name) params.append('name', options.name);
    const qs = params.toString() ? `?${params.toString()}` : '';
    return request(`/products/${encodeURIComponent(id)}${qs}`, {
      method: 'DELETE',
    });
  },
  deleteAll: (category?: string) => request(`/products/delete-all${category && category !== 'all' ? `?category=${encodeURIComponent(category)}` : ''}`, {
    method: 'DELETE',
  }),
};

// Stock Movement endpoints
export const stockApi = {
  getMovements: () => request('/stock-movements'),
  stockIn: (productId: string, quantity: number, notes?: string) => request('/stock-movements/in', {
    method: 'POST',
    body: JSON.stringify({ product_id: productId, quantity, notes }),
  }),
  stockOut: (productId: string, quantity: number, notes?: string) => request('/stock-movements/out', {
    method: 'POST',
    body: JSON.stringify({ product_id: productId, quantity, notes }),
  }),
};

// Dashboard endpoints
export const dashboardApi = {
  getStats: () => request('/dashboard/stats'),
  getRestockQueue: () => request('/dashboard/restock-queue'),
  getRecentMovements: () => request('/dashboard/recent-movements'),
};

// Audit Logs endpoints
export const auditApi = {
  getLogs: () => request('/audit-logs'),
  getLogsByDate: (from: string, to: string) => request(`/audit-logs?from=${from}&to=${to}`),
};

// Restock Schedules endpoints (with Automated Restock Execution)
export const schedulesApi = {
  getAll: () => request('/schedules'),
  create: (data: { product_id: string; scheduled_date: string; target_quantity?: number; notes?: string }) => request('/schedules', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  autoProcessDue: () => request('/schedules/process-due', {
    method: 'POST',
  }),
  delete: (id: string, options?: { sku?: string; productName?: string }) => {
    const params = new URLSearchParams();
    if (options?.sku) params.append('sku', options.sku);
    if (options?.productName) params.append('product_name', options.productName);
    const qs = params.toString() ? `?${params.toString()}` : '';
    return request(`/schedules/${encodeURIComponent(id)}${qs}`, {
      method: 'DELETE',
    });
  },
};

