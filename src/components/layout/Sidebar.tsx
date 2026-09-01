import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { ChevronDown, ChevronRight, ClipboardList, FileText, Landmark, LayoutDashboard, ReceiptText, Tags, UserRound, X } from 'lucide-react';

interface SidebarProps { isOpen: boolean; setIsOpen: (open: boolean) => void; }
type MenuGroup = { label: string; icon: React.ReactNode; items: string[] };
const groups: MenuGroup[] = [
  { label: 'Master', icon: <UserRound />, items: ['Company Master', 'Financial Year Master', 'Department', 'Sub Department', 'Account Group', 'Account', 'Item Group', 'Items', 'Transport Master'] },
  { label: 'Purchase Management', icon: <ReceiptText />, items: ['Purchase Entry', 'GRN Entry', 'GRN Item List', 'Finish Goods Entry', 'Finish Goods List', 'Purchase Return'] },
  { label: 'Sales Management', icon: <Tags />, items: ['Order Booking', 'Sales Entry', 'Sales Return'] },
  { label: 'Voucher', icon: <ClipboardList />, items: ['Cash Voucher', 'Bank Voucher', 'Contra Voucher', 'Journal Voucher'] },
  { label: 'Reports', icon: <FileText />, items: ['Ledger Statement', 'Finish Stock Statement', 'Raw Stock Statement', 'Book Order', 'Pending Orders', 'Finish Book Order', 'Purchase Statement', 'Sales Statement', 'Party Wise Sales Statement', 'GRN Statement', 'Finish GRN Statement', 'Sales Register', 'Purchase Register'] }
];

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen }) => {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [selected, setSelected] = useState('Dashboard');
  return <>
    {isOpen && <button aria-label="Close navigation" onClick={() => setIsOpen(false)} className="fixed inset-0 z-30 bg-[#12213b]/40 backdrop-blur-sm lg:hidden" />}
    <aside className={`erp-sidebar fixed inset-y-0 left-0 z-40 flex w-[290px] flex-col border-r border-[#dce4ee] bg-white transition-transform duration-300 lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className="flex h-[76px] items-center justify-between border-b border-[#e6ecf3] px-6"><NavLink to="/dashboard" onClick={() => setSelected('Dashboard')} className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#142b4a] text-white shadow-lg shadow-[#142b4a]/20"><Landmark className="h-5 w-5" /></span><span><b className="block text-[15px] tracking-tight text-[#12213b]">First Computer</b><small className="block text-[10px] font-bold tracking-[0.18em] text-[#7890ac]">ERP SYSTEM</small></span></NavLink><button onClick={() => setIsOpen(false)} className="p-1 text-slate-500 lg:hidden"><X className="h-5 w-5" /></button></div>
      <nav className="erp-scroll flex-1 overflow-y-auto px-3 py-5"><NavLink to="/dashboard" end onClick={() => { setSelected('Dashboard'); setIsOpen(false); }} className={({ isActive }) => `mb-2 flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all ${isActive ? 'bg-[#eaf1f9] text-[#163f70]' : 'text-[#526b88] hover:bg-slate-50'}`}><LayoutDashboard className="h-[19px] w-[19px]" /> Dashboard</NavLink>{groups.map(group => <div key={group.label} className="mb-1"><button onClick={() => setExpanded(expanded === group.label ? null : group.label)} className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-semibold transition-all ${expanded === group.label ? 'bg-[#f4f7fb] text-[#132d50]' : 'text-[#526b88] hover:bg-slate-50'}`}><span className="text-[#5376a2] [&>svg]:h-[19px] [&>svg]:w-[19px]">{group.icon}</span>{group.label}{expanded === group.label ? <ChevronDown className="ml-auto h-4 w-4" /> : <ChevronRight className="ml-auto h-4 w-4 text-[#9aacc1]" />}</button>{expanded === group.label && <div className="ml-7 mt-1 border-l border-[#dce7f2] py-1 pl-3 animate-in">{group.items.map(item => <button key={item} onClick={() => { setSelected(item); setIsOpen(false); }} className={`relative block w-full rounded-lg px-4 py-2 text-left text-[13px] font-medium transition-colors ${selected === item ? 'bg-[#f2f6fb] text-[#163f70]' : 'text-[#637b98] hover:bg-slate-50 hover:text-[#163f70]'}`}><span className={`absolute -left-[18px] top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full ${selected === item ? 'bg-[#2b5f9d]' : 'bg-[#c7d6e6]'}`} />{item}</button>)}</div>}</div>)}</nav>
      <div className="m-3 rounded-xl bg-[#f4f7fb] p-4"><p className="text-xs font-bold text-[#223c5b]">Need assistance?</p><p className="mt-1 text-[11px] text-[#7086a0]">Ahmedabad · 9426064310</p></div>
    </aside>
  </>;
};
