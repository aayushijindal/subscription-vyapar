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
const ProfilePage = lazy(() => import('@/features/auth/Profile').then(m => ({ default: m.ProfilePage })));

const DashboardHome = lazy(() => import('@/features/dashboard/DashboardHome').then(m => ({ default: m.DashboardHome })));

// Master Pages
const AccountsPage = lazy(() => import('@/features/master/Accounts').then(m => ({ default: m.AccountsPage })));
const ItemsPage = lazy(() => import('@/features/master/Items').then(m => ({ default: m.ItemsPage })));
const CompaniesPage = lazy(() => import('@/features/master/Companies').then(m => ({ default: m.CompaniesPage })));
const FinancialYearsPage = lazy(() => import('@/features/master/FinancialYears').then(m => ({ default: m.FinancialYearsPage })));
const DepartmentsPage = lazy(() => import('@/features/master/Departments').then(m => ({ default: m.DepartmentsPage })));
const SubDepartmentsPage = lazy(() => import('@/features/master/SubDepartments').then(m => ({ default: m.SubDepartmentsPage })));
const AccountGroupsPage = lazy(() => import('@/features/master/AccountGroups').then(m => ({ default: m.AccountGroupsPage })));
const ItemGroupsPage = lazy(() => import('@/features/master/ItemGroups').then(m => ({ default: m.ItemGroupsPage })));
const TransportsPage = lazy(() => import('@/features/master/Transports').then(m => ({ default: m.TransportsPage })));

// Purchase Pages
const PurchasesPage = lazy(() => import('@/features/purchase/Purchases').then(m => ({ default: m.PurchasesPage })));
const GRNsPage = lazy(() => import('@/features/purchase/GRNs').then(m => ({ default: m.GRNsPage })));
const GRNItemsPage = lazy(() => import('@/features/purchase/GRNItems').then(m => ({ default: m.GRNItemsPage })));
const FinishGoodsPage = lazy(() => import('@/features/purchase/FinishGoods').then(m => ({ default: m.FinishGoodsPage })));
const FinishGoodsListPage = lazy(() => import('@/features/purchase/FinishGoodsList').then(m => ({ default: m.FinishGoodsListPage })));
const PurchaseReturnsPage = lazy(() => import('@/features/purchase/PurchaseReturns').then(m => ({ default: m.PurchaseReturnsPage })));

// Sales Pages
const SalesPage = lazy(() => import('@/features/sales/Sales').then(m => ({ default: m.SalesPage })));
const OrderBookingPage = lazy(() => import('@/features/sales/OrderBooking').then(m => ({ default: m.OrderBookingPage })));
const SalesReturnsPage = lazy(() => import('@/features/sales/SalesReturns').then(m => ({ default: m.SalesReturnsPage })));

// Voucher Pages
const CashVouchersPage = lazy(() => import('@/features/vouchers/CashVouchers').then(m => ({ default: m.CashVouchersPage })));
const BankVouchersPage = lazy(() => import('@/features/vouchers/BankVouchers').then(m => ({ default: m.BankVouchersPage })));
const ContraVouchersPage = lazy(() => import('@/features/vouchers/ContraVouchers').then(m => ({ default: m.ContraVouchersPage })));
const JournalVouchersPage = lazy(() => import('@/features/vouchers/JournalVouchers').then(m => ({ default: m.JournalVouchersPage })));

// Reports
const LedgerPage = lazy(() => import('@/features/reports/Ledger').then(m => ({ default: m.LedgerPage })));
const FinishStockPage = lazy(() => import('@/features/reports/FinishStock').then(m => ({ default: m.FinishStockPage })));
const RawStockPage = lazy(() => import('@/features/reports/RawStock').then(m => ({ default: m.RawStockPage })));
const BookOrderPage = lazy(() => import('@/features/reports/BookOrder').then(m => ({ default: m.BookOrderPage })));
const PendingOrdersPage = lazy(() => import('@/features/reports/PendingOrders').then(m => ({ default: m.PendingOrdersPage })));
const FinishBookOrderPage = lazy(() => import('@/features/reports/FinishBookOrder').then(m => ({ default: m.FinishBookOrderPage })));
const PurchaseStatementPage = lazy(() => import('@/features/reports/PurchaseStatement').then(m => ({ default: m.PurchaseStatementPage })));
const SalesStatementPage = lazy(() => import('@/features/reports/SalesStatement').then(m => ({ default: m.SalesStatementPage })));
const PartyWiseSalesPage = lazy(() => import('@/features/reports/PartyWiseSales').then(m => ({ default: m.PartyWiseSalesPage })));
const GRNStatementPage = lazy(() => import('@/features/reports/GRNStatement').then(m => ({ default: m.GRNStatementPage })));
const FinishGRNPage = lazy(() => import('@/features/reports/FinishGRN').then(m => ({ default: m.FinishGRNPage })));
const SalesRegisterPage = lazy(() => import('@/features/reports/SalesRegister').then(m => ({ default: m.SalesRegisterPage })));
const PurchaseRegisterPage = lazy(() => import('@/features/reports/PurchaseRegister').then(m => ({ default: m.PurchaseRegisterPage })));


// Super Admin Pages

const SuperAdminLogin = lazy(() => import('@/features/super-admin/SuperAdminLogin').then(m => ({ default: m.SuperAdminLogin })));
const SuperAdminProtectedRoute = lazy(() => import('@/features/super-admin/SuperAdminProtectedRoute').then(m => ({ default: m.SuperAdminProtectedRoute })));
const SuperAdminLayout = lazy(() => import('@/components/layout/SuperAdminLayout').then(m => ({ default: m.SuperAdminLayout })));
const SuperAdminDashboard = lazy(() => import('@/features/super-admin/SuperAdminDashboard').then(m => ({ default: m.SuperAdminDashboard })));
const SuperAdminCompanies = lazy(() => import('@/features/super-admin/SuperAdminCompanies').then(m => ({ default: m.SuperAdminCompanies })));
const SuperAdminInquiries = lazy(() => import('@/features/super-admin/SuperAdminInquiries').then(m => ({ default: m.SuperAdminInquiries })));

const AppLoader = () => <div className="min-h-screen p-8"><LoadingSkeleton count={3} /></div>;

export const AppRoutes: React.FC = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={<AppLoader />}>
        <Routes>
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/features" element={<Features />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/contact" element={<Contact />} />
          </Route>
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
          </Route>
          
          {/* Super Admin Routes */}
          <Route path="/super-admin/login" element={<SuperAdminLogin />} />
          <Route element={<SuperAdminProtectedRoute />}>
            <Route path="/super-admin" element={<SuperAdminLayout />}>
              <Route index element={<SuperAdminDashboard />} />
              <Route path="companies" element={<SuperAdminCompanies />} />
              <Route path="inquiries" element={<SuperAdminInquiries />} />
            </Route>
          </Route>

          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route index element={<DashboardHome />} />
              <Route path="profile" element={<ProfilePage />} />
              
              {/* Master */}
              <Route path="accounts" element={<AccountsPage />} />
              <Route path="items" element={<ItemsPage />} />
              <Route path="companies" element={<CompaniesPage />} />
              <Route path="financial-years" element={<FinancialYearsPage />} />
              <Route path="departments" element={<DepartmentsPage />} />
              <Route path="sub-departments" element={<SubDepartmentsPage />} />
              <Route path="account-groups" element={<AccountGroupsPage />} />
              <Route path="item-groups" element={<ItemGroupsPage />} />
              <Route path="transports" element={<TransportsPage />} />
              
              {/* Purchase */}
              <Route path="purchases" element={<PurchasesPage />} />
              <Route path="grns" element={<GRNsPage />} />
              <Route path="grn-items" element={<GRNItemsPage />} />
              <Route path="finish-goods" element={<FinishGoodsPage />} />
              <Route path="finish-goods-list" element={<FinishGoodsListPage />} />
              <Route path="purchase-returns" element={<PurchaseReturnsPage />} />
              
              {/* Sales */}
              <Route path="sales" element={<SalesPage />} />
              <Route path="order-booking" element={<OrderBookingPage />} />
              <Route path="sales-returns" element={<SalesReturnsPage />} />
              
              {/* Vouchers */}
              <Route path="cash-vouchers" element={<CashVouchersPage />} />
              <Route path="bank-vouchers" element={<BankVouchersPage />} />
              <Route path="contra-vouchers" element={<ContraVouchersPage />} />
              <Route path="journal-vouchers" element={<JournalVouchersPage />} />
              
              {/* Reports */}
              <Route path="ledger" element={<LedgerPage />} />
              <Route path="reports/finish-stock" element={<FinishStockPage />} />
              <Route path="reports/raw-stock" element={<RawStockPage />} />
              <Route path="reports/book-order" element={<BookOrderPage />} />
              <Route path="reports/pending-orders" element={<PendingOrdersPage />} />
              <Route path="reports/finish-book-order" element={<FinishBookOrderPage />} />
              <Route path="reports/purchase-statement" element={<PurchaseStatementPage />} />
              <Route path="reports/sales-statement" element={<SalesStatementPage />} />
              <Route path="reports/party-wise-sales" element={<PartyWiseSalesPage />} />
              <Route path="reports/grn-statement" element={<GRNStatementPage />} />
              <Route path="reports/finish-grn" element={<FinishGRNPage />} />
              <Route path="reports/sales-register" element={<SalesRegisterPage />} />
              <Route path="reports/purchase-register" element={<PurchaseRegisterPage />} />
            </Route>
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default AppRoutes;
