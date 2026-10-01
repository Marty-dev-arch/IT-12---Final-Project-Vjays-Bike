import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { InventoryProvider } from './context/InventoryContext';

// Layout
import DashboardLayout from './components/layout/DashboardLayout';

// Auth Pages
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import CreatePinPage from './pages/auth/CreatePinPage';
import ResetPinPage from './pages/auth/ResetPinPage';

// Main Pages
import DashboardPage from './pages/dashboard/DashboardPage';
import ProductsPage from './pages/products/ProductsPage';
import StockMovementPage from './pages/operations/StockMovementPage';
import AuditLogsPage from './pages/operations/AuditLogsPage';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <InventoryProvider>
          <Routes>
            {/* Auth Routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/create-pin" element={<CreatePinPage />} />
            <Route path="/reset-pin" element={<ResetPinPage />} />

            {/* Application Dashboard Routes with Shared Layout */}
            <Route element={<DashboardLayout />}>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              {/* Removed "All Parts" catalog: /products redirects to braking-system */}
              <Route path="/products" element={<Navigate to="/products/braking-system" replace />} />
              <Route path="/products/:category" element={<ProductsPage />} />
              <Route path="/stock-movement" element={<StockMovementPage />} />
              <Route path="/audit-logs" element={<AuditLogsPage />} />
            </Route>

            {/* Legacy Stitch Routes / Redirects for backward compatibility */}
            <Route path="/products/gears-sprockets" element={<Navigate to="/products/handle-bar-handle-grip" replace />} />
            <Route path="/AuditLogsInventoryVerificationLedger" element={<Navigate to="/audit-logs" replace />} />
            <Route path="/BrakingSystemProducts" element={<Navigate to="/products/braking-system" replace />} />
            <Route path="/GearsSprocketsProducts" element={<Navigate to="/products/handle-bar-handle-grip" replace />} />
            <Route path="/Create" element={<Navigate to="/create-pin" replace />} />
            <Route path="/Login" element={<Navigate to="/login" replace />} />
            <Route path="/Register" element={<Navigate to="/register" replace />} />
            <Route path="/Register2" element={<Navigate to="/create-pin" replace />} />
            <Route path="/OwnerDashboardVjaySBikeParts" element={<Navigate to="/dashboard" replace />} />
            <Route path="/MODALADDPARTS" element={<Navigate to="/products/braking-system" replace />} />
            <Route path="/StockInStockOutMovementVjaySBikeParts" element={<Navigate to="/stock-movement" replace />} />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </InventoryProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;