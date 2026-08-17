import { Routes, Route, Navigate } from 'react-router-dom';
import PublicLayout from '../components/layout/PublicLayout';
import AdminLayout from '../components/admin/AdminLayout';
import AdminRoute from './AdminRoute';

import HomePage from '../pages/public/HomePage';
import AboutPage from '../pages/public/AboutPage';
import ServicesPage from '../pages/public/ServicesPage';
import ProductsPage from '../pages/public/ProductsPage';
import ContactPage from '../pages/public/ContactPage';
import LoginPage from '../pages/public/LoginPage';
import RegisterPage from '../pages/public/RegisterPage';
import ForgotPasswordPage from '../pages/public/ForgotPasswordPage';
import UnauthorizedPage from '../pages/public/UnauthorizedPage';
import NotFoundPage from '../pages/public/NotFoundPage';

import DashboardPage from '../pages/admin/DashboardPage';
import ServicesManagementPage from '../pages/admin/ServicesManagementPage';
import ProductsManagementPage from '../pages/admin/ProductsManagementPage';
import MessagesManagementPage from '../pages/admin/MessagesManagementPage';
import UsersManagementPage from '../pages/admin/UsersManagementPage';
import SettingsPage from '../pages/admin/SettingsPage';

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public site */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>

      {/* Admin dashboard - every nested route requires role === "admin" */}
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="services" element={<ServicesManagementPage />} />
        <Route path="products" element={<ProductsManagementPage />} />
        <Route path="messages" element={<MessagesManagementPage />} />
        <Route path="users" element={<UsersManagementPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>
    </Routes>
  );
}
