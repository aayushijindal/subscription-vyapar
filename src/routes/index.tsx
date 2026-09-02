import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthLayout } from '@/components/layout/AuthLayout';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';
const Home = lazy(() => import('@/features/landing/Home').then(m => ({ default: m.Home })));
const Features = lazy(() => import('@/features/landing/Features').then(m => ({ default: m.Features })));
const Pricing = lazy(() => import('@/features/landing/Pricing').then(m => ({ default: m.Pricing })));
const Contact = lazy(() => import('@/features/landing/Contact').then(m => ({ default: m.Contact })));

const Login = lazy(() => import('@/features/auth/Login').then(m => ({ default: m.Login })));
const Register = lazy(() => import('@/features/auth/Register').then(m => ({ default: m.Register })));
const ForgotPassword = lazy(() => import('@/features/auth/ForgotPassword').then(m => ({ default: m.ForgotPassword })));
const DashboardHome = lazy(() => import('@/features/dashboard/DashboardHome').then(m => ({ default: m.DashboardHome })));
const AccountsPage = lazy(() => import('@/features/master/Accounts').then(m => ({ default: m.AccountsPage })));
const ItemsPage = lazy(() => import('@/features/master/Items').then(m => ({ default: m.ItemsPage })));
const CompaniesPage = lazy(() => import('@/features/master/Companies').then(m => ({ default: m.CompaniesPage })));
const FinancialYearsPage = lazy(() => import('@/features/master/FinancialYears').then(m => ({ default: m.FinancialYearsPage })));
const DepartmentsPage = lazy(() => import('@/features/master/Departments').then(m => ({ default: m.DepartmentsPage })));
const SubDepartmentsPage = lazy(() => import('@/features/master/SubDepartments').then(m => ({ default: m.SubDepartmentsPage })));
const AccountGroupsPage = lazy(() => import('@/features/master/AccountGroups').then(m => ({ default: m.AccountGroupsPage })));
const ItemGroupsPage = lazy(() => import('@/features/master/ItemGroups').then(m => ({ default: m.ItemGroupsPage })));
const TransportsPage = lazy(() => import('@/features/master/Transports').then(m => ({ default: m.TransportsPage })));
const GRNsPage = lazy(() => import('@/features/purchase/GRNs').then(m => ({ default: m.GRNsPage })));
const SalesPage = lazy(() => import('@/features/sales/Sales').then(m => ({ default: m.SalesPage })));

const AppLoader = () => <div className="min-h-screen p-8"><LoadingSkeleton count={3} /></div>;
export const AppRoutes: React.FC = () => <BrowserRouter><Suspense fallback={<AppLoader />}><Routes><Route element={<PublicLayout />}><Route path="/" element={<Home />} /><Route path="/features" element={<Features />} /><Route path="/pricing" element={<Pricing />} /><Route path="/contact" element={<Contact />} /></Route><Route element={<AuthLayout />}><Route path="/login" element={<Login />} /><Route path="/register" element={<Register />} /><Route path="/forgot-password" element={<ForgotPassword />} /></Route><Route element={<ProtectedRoute />}><Route path="/dashboard" element={<DashboardLayout />}><Route index element={<DashboardHome />} /><Route path="accounts" element={<AccountsPage />} /><Route path="items" element={<ItemsPage />} /><Route path="companies" element={<CompaniesPage />} /><Route path="financial-years" element={<FinancialYearsPage />} /><Route path="departments" element={<DepartmentsPage />} /><Route path="sub-departments" element={<SubDepartmentsPage />} /><Route path="account-groups" element={<AccountGroupsPage />} /><Route path="item-groups" element={<ItemGroupsPage />} /><Route path="transports" element={<TransportsPage />} /><Route path="grns" element={<GRNsPage />} /><Route path="sales" element={<SalesPage />} /></Route></Route><Route path="*" element={<Navigate to="/" replace />} /></Routes></Suspense></BrowserRouter>;
export default AppRoutes;

