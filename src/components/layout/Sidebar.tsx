import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { ChevronDown, ChevronRight, ClipboardList, FileText, Landmark, LayoutDashboard, ReceiptText, Tags, UserRound, X } from 'lucide-react';

interface SidebarProps { isOpen: boolean; setIsOpen: (open: boolean) => void; }
type MenuGroup = { label: string; icon: React.ReactNode; items: { label: string; path: string }[] };
const groups: MenuGroup[] = [
  { label: 'Master', icon: <UserRound />, items: [
    { label: 'Financial Year Master', path: '/dashboard/financial-years' },
    { label: 'Department', path: '/dashboard/departments' },
    { label: 'Sub Department', path: '/dashboard/sub-departments' },
    { label: 'Account Group', path: '/dashboard/account-groups' },
    { label: 'Account', path: '/dashboard/accounts' },
    { label: 'Item Group', path: '/dashboard/item-groups' },
    { label: 'Items', path: '/dashboard/items' },
    { label: 'Transport Master', path: '/dashboard/transports' }
  ]},
  { label: 'Purchase Management', icon: <ReceiptText />, items: [
    { label: 'Purchase Entry', path: '/dashboard/purchases' },
    { label: 'GRN Entry', path: '/dashboard/grns' },
    { label: 'GRN Item List', path: '/dashboard/grn-items' },
    { label: 'Finish Goods Entry', path: '/dashboard/finish-goods' },
    { label: 'Purchase Return', path: '/dashboard/purchase-returns' }
  ]},
  { label: 'Sales Management', icon: <Tags />, items: [
    { label: 'Order Booking', path: '/dashboard/order-booking' },
    { label: 'Sales Entry', path: '/dashboard/sales' },
    { label: 'Sales Return', path: '/dashboard/sales-returns' }
  ]},
  { label: 'Voucher', icon: <ClipboardList />, items: [
    { label: 'Cash Voucher', path: '/dashboard/cash-vouchers' },
    { label: 'Bank Voucher', path: '/dashboard/bank-vouchers' },
    { label: 'Contra Voucher', path: '/dashboard/contra-vouchers' },
    { label: 'Journal Voucher', path: '/dashboard/journal-vouchers' }
  ]},
  { label: 'Reports', icon: <FileText />, items: [
    { label: 'Ledger Statement', path: '/dashboard/ledger' },
    { label: 'Finish Stock Statement', path: '/dashboard/reports/finish-stock' },
    { label: 'Raw Stock Statement', path: '/dashboard/reports/raw-stock' },
    { label: 'Book Order', path: '/dashboard/reports/book-order' },
    { label: 'Pending Orders', path: '/dashboard/reports/pending-orders' },
    { label: 'Finish Book Order', path: '/dashboard/reports/finish-book-order' },
    { label: 'Purchase Statement', path: '/dashboard/reports/purchase-statement' },
    { label: 'Sales Statement', path: '/dashboard/reports/sales-statement' },
    { label: 'Party Wise Sales Statement', path: '/dashboard/reports/party-wise-sales' },
    { label: 'GRN Statement', path: '/dashboard/reports/grn-statement' },
    { label: 'Finish GRN Statement', path: '/dashboard/reports/finish-grn' },
    { label: 'Sales Register', path: '/dashboard/reports/sales-register' },
    { label: 'Purchase Register', path: '/dashboard/reports/purchase-register' }
  ]}
];

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen }) => {
  const [expanded, setExpanded] = useState<string | null>(null);
  return <>
    {isOpen && <button aria-label="Close navigation" onClick={() => setIsOpen(false)} className="fixed inset-0 z-30 bg-dark/40 backdrop-blur-sm lg:hidden" />}
    <aside className={`erp-sidebar fixed inset-y-0 left-0 z-40 flex w-[290px] flex-col border-r border-border bg-dark transition-transform duration-300 lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className="flex h-[76px] items-center justify-between border-b border-border px-6"><NavLink to="/dashboard" className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white shadow-lg shadow-primary/20"><Landmark className="h-5 w-5" /></span><span><b className="block text-[15px] tracking-tight text-text-primary">First Computer</b><small className="block text-[10px] font-bold tracking-[0.18em] text-text-muted">ERP SYSTEM</small></span></NavLink><button onClick={() => setIsOpen(false)} className="p-1 text-text-secondary lg:hidden"><X className="h-5 w-5" /></button></div>
      <nav className="erp-scroll flex-1 overflow-y-auto px-3 py-5"><NavLink to="/dashboard" end onClick={() => { setIsOpen(false); }} className={({ isActive }: { isActive: boolean }) => `mb-2 flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all ${isActive ? 'bg-primary/10 text-text-primary [&>svg]:text-primary border-l-2 border-primary' : 'text-text-secondary hover:bg-surface-soft hover:text-text-primary'}`}><LayoutDashboard className="h-[19px] w-[19px]" /> Dashboard</NavLink>{groups.map(group => <div key={group.label} className="mb-1"><button onClick={() => setExpanded(expanded === group.label ? null : group.label)} className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-semibold transition-all ${expanded === group.label ? 'bg-surface text-text-primary' : 'text-text-secondary hover:bg-surface-soft hover:text-text-primary'}`}><span className={`${expanded === group.label ? 'text-primary' : 'text-text-secondary'} [&>svg]:h-[19px] [&>svg]:w-[19px]`}>{group.icon}</span>{group.label}{expanded === group.label ? <ChevronDown className="ml-auto h-4 w-4 text-text-secondary" /> : <ChevronRight className="ml-auto h-4 w-4 text-text-muted" />}</button>{expanded === group.label && <div className="ml-7 mt-1 border-l border-border py-1 pl-3 animate-in">{group.items.map(item => <NavLink key={item.label} to={item.path} onClick={() => setIsOpen(false)} className={({ isActive }: { isActive: boolean }) => `relative block w-full rounded-lg px-4 py-2 text-left text-[13px] font-medium transition-colors ${isActive ? 'bg-primary/10 text-text-primary font-semibold' : 'text-text-secondary hover:bg-surface-soft hover:text-text-primary'}`}>{({ isActive }: { isActive: boolean }) => <><span className={`absolute -left-[18px] top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full transition-colors ${isActive ? 'bg-primary' : 'bg-border'}`} />{item.label}</>}</NavLink>)}</div>}</div>)}</nav>
      <div className="m-3 rounded-xl bg-surface p-4"><p className="text-xs font-bold text-text-primary">Need assistance?</p><p className="mt-1 text-[11px] text-text-secondary">Ahmedabad · 9426064310</p></div>
    </aside>
  </>;
};
