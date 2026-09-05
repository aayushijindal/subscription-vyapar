import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Building2, MessageSquare, Users, LogOut, ArrowLeft, Shield } from 'lucide-react';
import { useAuth } from '@/context/authHelpers';

export const SuperAdminLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItems = [
    { name: 'Overview', path: '/super-admin', icon: LayoutDashboard },
    { name: 'Companies', path: '/super-admin/companies', icon: Building2 },
    { name: 'Users Directory', path: '/super-admin/users', icon: Users },
    { name: 'Inquiries', path: '/super-admin/inquiries', icon: MessageSquare },
  ];

  return (
    <div className="flex h-screen bg-[#F6F7FB] overflow-hidden font-inter text-[#687085]">
      
      {/* Sidebar (Premium SaaS Look) */}
      <aside className="w-72 flex flex-col h-full bg-[#FFFFFF] border-r border-[#E8EAF1] z-20">
        
        <div className="p-8">
          <Link to="/super-admin" className="flex items-center gap-3 group">
            <div className="p-2.5 bg-[#F0EEFF] rounded-xl transition-colors">
              <Shield className="w-6 h-6 text-[#6C63D9]" />
            </div>
            <div>
              <h1 className="text-[17px] font-bold text-[#25283A] tracking-tight">Super Admin</h1>
              <p className="text-[10px] uppercase tracking-widest text-[#9299AA] font-semibold mt-0.5">Control Center</p>
            </div>
          </Link>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-[10px] transition-all duration-200 relative group ${
                  isActive
                    ? 'bg-[#F1EFFF] text-[#5E56B7] font-medium'
                    : 'text-[#697386] hover:text-[#25283A] hover:bg-[#F7F6FC]'
                }`}
              >
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-[#6C63D9] rounded-r-full" />
                )}
                <Icon className={`w-[22px] h-[22px] transition-colors duration-200 ${isActive ? 'text-[#6C63D9]' : 'text-[#9299AA] group-hover:text-[#6C63D9]'}`} />
                <span className="text-[14px]">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-6 mt-auto">
          {/* User profile card */}
          <div className="bg-[#F8F8FC] rounded-[12px] p-4 mb-4 border border-[#E8EAF1]/50">
            <p className="text-[11px] text-[#9299AA] mb-2 font-medium uppercase tracking-wider">Logged in as</p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#EAF2FF] flex items-center justify-center text-[15px] font-bold text-[#5B8DEF]">
                SA
              </div>
              <div className="overflow-hidden">
                <p className="text-[14px] font-bold text-[#25283A] truncate">System Admin</p>
                <p className="text-[12px] text-[#8A91A0] truncate">admin@firstcomputererp.com</p>
              </div>
            </div>
          </div>
          
          <div className="space-y-1">
            <button 
              onClick={handleLogout}
              className="flex items-center gap-3 w-full px-4 py-2.5 rounded-[10px] text-[13px] font-medium text-[#687085] hover:text-[#D96F75] hover:bg-[#FCEEEF] transition-colors"
            >
              <LogOut className="w-[18px] h-[18px]" />
              Sign Out
            </button>
            
            <Link to="/" className="flex items-center gap-3 w-full px-4 py-2.5 rounded-[10px] text-[13px] font-medium text-[#9299AA] hover:text-[#25283A] hover:bg-[#F7F6FC] transition-colors">
              <ArrowLeft className="w-[18px] h-[18px]" />
              Back to Site
            </Link>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        
        {/* Top Header */}
        <header className="h-[76px] border-b border-[#E8EAF1] bg-[#FFFFFF] flex items-center px-8 z-10 shrink-0">
          <h2 className="text-[18px] font-bold text-[#25283A]">
            {navItems.find(item => item.path === location.pathname)?.name || 'Dashboard'}
          </h2>
          <div className="ml-auto flex items-center gap-4">
            <div className="text-[#27815D] text-[13px] font-medium flex items-center gap-2 bg-[#EAF7F1] px-3 py-1.5 rounded-full">
              <span className="text-[10px] leading-none">-?</span>
              System Online
            </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-auto z-10 p-[32px]">
          <div className="max-w-[1400px] mx-auto min-h-full animate-fade-in pb-12">
            <Outlet />
          </div>
        </div>
      </main>

    </div>
  );
};

export default SuperAdminLayout;
