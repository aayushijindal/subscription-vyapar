import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  CreditCard, 
  UserCircle, 
  Building,
  ShieldCheck
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen }) => {
  const menuItems = [
    { label: 'Dashboard', to: '/dashboard', icon: <LayoutDashboard className="h-5 w-5" /> },
    { label: 'Subscription', to: '/dashboard/subscription', icon: <CreditCard className="h-5 w-5" /> },
    { label: 'Profile Settings', to: '/dashboard/profile', icon: <UserCircle className="h-5 w-5" /> }
  ];

  return (
    <>
      {/* Sidebar background overlay for mobile screens */}
      {isOpen && (
        <div 
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-30 bg-slate-900/30 backdrop-blur-sm lg:hidden"
        />
      )}

      <aside className={`fixed inset-y-0 left-0 z-30 flex flex-col w-64 border-r border-slate-200 bg-white transition-transform duration-250 lg:translate-x-0 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        {/* Brand/Logo Area */}
        <div className="h-16 flex items-center gap-2 px-6 border-b border-slate-100">
          <div className="bg-blue-600 text-white p-1.5 rounded-lg">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <span className="text-lg font-bold tracking-tight text-slate-900">VyaparERP</span>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 py-6 px-4 space-y-1.5">
          {menuItems.map((item) => (
            <NavLink
              key={item.label}
              to={item.to}
              end={item.to === '/dashboard'}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) => 
                `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  isActive 
                    ? 'bg-blue-50 text-blue-600' 
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`
              }
            >
              {item.icon}
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Company Footer Widget */}
        <div className="p-4 border-t border-slate-100">
          <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
            <div className="bg-slate-200 p-2 rounded-lg text-slate-600">
              <Building className="h-4 w-4" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-slate-800 truncate">Vikas Retailers Ltd</p>
              <p className="text-[10px] text-slate-500 font-medium">GSTIN: 27AAAAA1111A1Z1</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
