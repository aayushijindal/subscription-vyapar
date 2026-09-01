import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthLayout } from '@/components/layout/AuthLayout';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';
const Home = lazy(() => import('@/features/landing/Home').then(m => ({ default: m.Home })));
const Login = lazy(() => import('@/features/auth/Login').then(m => ({ default: m.Login })));
const Register = lazy(() => import('@/features/auth/Register').then(m => ({ default: m.Register })));
const ForgotPassword = lazy(() => import('@/features/auth/ForgotPassword').then(m => ({ default: m.ForgotPassword })));
const DashboardHome = lazy(() => import('@/features/dashboard/DashboardHome').then(m => ({ default: m.DashboardHome })));
const AppLoader = () => <div className="min-h-screen p-8"><LoadingSkeleton count={3} /></div>;
export const AppRoutes: React.FC = () => <BrowserRouter><Suspense fallback={<AppLoader />}><Routes><Route element={<PublicLayout />}><Route path="/" element={<Home />} /></Route><Route element={<AuthLayout />}><Route path="/login" element={<Login />} /><Route path="/register" element={<Register />} /><Route path="/forgot-password" element={<ForgotPassword />} /></Route><Route element={<ProtectedRoute />}><Route path="/dashboard" element={<DashboardLayout />}><Route index element={<DashboardHome />} /></Route></Route><Route path="*" element={<Navigate to="/" replace />} /></Routes></Suspense></BrowserRouter>;
export default AppRoutes;

