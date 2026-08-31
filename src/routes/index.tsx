import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { AuthLayout } from '@/components/layout/AuthLayout';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';

// Lazy load feature components
const Home = lazy(() => import('@/features/landing/Home').then(m => ({ default: m.Home })));
const Pricing = lazy(() => import('@/features/landing/Pricing').then(m => ({ default: m.Pricing })));
const About = lazy(() => import('@/features/landing/About').then(m => ({ default: m.About })));
const Contact = lazy(() => import('@/features/landing/Contact').then(m => ({ default: m.Contact })));
const Terms = lazy(() => import('@/features/landing/Terms').then(m => ({ default: m.Terms })));
const Privacy = lazy(() => import('@/features/landing/Privacy').then(m => ({ default: m.Privacy })));
const Refund = lazy(() => import('@/features/landing/Refund').then(m => ({ default: m.Refund })));

const Login = lazy(() => import('@/features/auth/Login').then(m => ({ default: m.Login })));
const Register = lazy(() => import('@/features/auth/Register').then(m => ({ default: m.Register })));
const ForgotPassword = lazy(() => import('@/features/auth/ForgotPassword').then(m => ({ default: m.ForgotPassword })));

const DashboardHome = lazy(() => import('@/features/dashboard/DashboardHome').then(m => ({ default: m.DashboardHome })));
const SubscriptionSettings = lazy(() => import('@/features/subscription/SubscriptionSettings').then(m => ({ default: m.SubscriptionSettings })));
const UserProfile = lazy(() => import('@/features/profile/UserProfile').then(m => ({ default: m.UserProfile })));

const AppLoader = () => (
  <div className="min-h-screen flex items-center justify-center p-8">
    <div className="w-full max-w-md space-y-4">
      <LoadingSkeleton count={3} />
    </div>
  </div>
);

export const AppRoutes: React.FC = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={<AppLoader />}>
        <Routes>
          {/* Public Routes */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/refund" element={<Refund />} />
          </Route>

          {/* Guest/Auth Routes */}
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
          </Route>

          {/* Protected Console Dashboard */}
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<DashboardHome />} />
            <Route path="subscription" element={<SubscriptionSettings />} />
            <Route path="profile" element={<UserProfile />} />
          </Route>

          {/* Fallback navigation redirects */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};
export default AppRoutes;
