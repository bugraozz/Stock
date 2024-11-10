


import React from 'react';
import { Route, Routes, Navigate, useLocation } from 'react-router-dom';
import AdminPage from './Pages/AdminPage';
import HomePage from './Pages/HomePage';
import StockPage from './Pages/StockPage';
import ProductSell from './Pages/ProductSell';
import CustomerPage from './Pages/CustomerPage';
import Invoice from './Pages/Invoice';
import ReportPage from './Pages/ReportPage';
import InvoicePDF from './Pages/InvoicePDF';
import InvoiceList from './Pages/InvoiceList';
import InvoiceDetail from './Pages/InvoiceDetail';
import { useRole, RoleProvider } from './Pages/Role';
import LoginPage from './Pages/LoginPage';
import SalesChart from './Pages/SalesChart';
import BarcodeSales from './Pages/BarcodeSales';
import ThemeController from './component/ThemeController';
import './App.css';

const ProtectedRoute = ({ element, requiredRoles }) => {
  const { role } = useRole();
  return requiredRoles.includes(role) ? element : <Navigate to="/" />;
};

function App() {
  const location = useLocation();

  return (
    <RoleProvider>
      <div>
       
        <div className="fixed top-4  left-1 z-50">
          <ThemeController />
        </div>

        <Routes>
          <Route path="/" element={<LoginPage setShowForm={() => {}} />} />
          <Route path="/admin" element={<ProtectedRoute element={<AdminPage />} requiredRoles={['admin']} />} />
          <Route path="/home" element={<ProtectedRoute element={<HomePage />} requiredRoles={['admin', 'user', 'executive']} />} />
          <Route path="/stock" element={<ProtectedRoute element={<StockPage />} requiredRoles={['admin', 'user', 'executive']} />} />
          <Route path="/sell" element={<ProtectedRoute element={<ProductSell />} requiredRoles={['admin', 'user']} />} />
          <Route path="/customer" element={<ProtectedRoute element={<CustomerPage />} requiredRoles={['admin']} />} />
          <Route path="/invoice" element={<ProtectedRoute element={<Invoice />} requiredRoles={['admin', 'executive']} />} />
          <Route path="/report" element={<ProtectedRoute element={<ReportPage />} requiredRoles={['admin', 'executive']} />} />
          <Route path="/pdf" element={<ProtectedRoute element={<InvoicePDF />} requiredRoles={['admin', 'user']} />} />
          <Route path="/pdflist" element={<ProtectedRoute element={<InvoiceList />} requiredRoles={['admin', 'user']} />} />
          <Route path="/invoices/:id" element={<ProtectedRoute element={<InvoiceDetail />} requiredRoles={['admin', 'user']} />} />
          <Route path="/chart" element={<ProtectedRoute element={<SalesChart />} requiredRoles={['admin', 'executive']} />} />
          <Route path="/barcodesales" element={<ProtectedRoute element={<BarcodeSales />} requiredRoles={['admin', 'user']} />} />
        </Routes>
      </div>
    </RoleProvider>
  );
}

export default App;


