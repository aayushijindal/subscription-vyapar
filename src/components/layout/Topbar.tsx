import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, Bell, LogOut, Settings, Search } from 'lucide-react';
import { showToast } from '@/hooks/useToasts';

interface TopbarProps {
  onMenuClick: () => void;
}

export const Topbar: React.FC<TopbarProps> = ({ onMenuClick }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    showToast('success', 'Logged out successfully');
    navigate('/login');
  };

  return (
    <header className="h-16 border-b border-slate-200 bg-white sticky top-0 z-20 flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        {/* Toggle Menu Button for mobile screens */}
        <button 
          onClick={onMenuClick}
          className="lg:hidden p-2 text-slate-500 hover:text-slate-900 rounded-lg hover:bg-slate-50 cursor-pointer"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Search */}
        <div className="relative hidden sm:block w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search transactions, sales..."
            className="w-full pl-9 pr-4 py-1.5 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Alerts Button */}
        <button className="p-2 text-slate-500 hover:text-slate-900 rounded-lg hover:bg-slate-50 relative cursor-pointer">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-blue-600 rounded-full" />
        </button>

        {/* User profile Menu dropdown */}
        <div className="relative">
          <button 
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2.5 cursor-pointer focus:outline-none"
          >
            <div className="h-9 w-9 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm shadow-inner">
              VS
            </div>
          </button>

          {dropdownOpen && (
            <>
              <div 
                onClick={() => setDropdownOpen(false)}
                className="fixed inset-0 z-10"
              />
              <div className="absolute right-0 mt-2.5 w-52 bg-white border border-slate-200 rounded-xl shadow-lg py-1.5 z-20">
                <div className="px-4 py-2 border-b border-slate-100">
                  <p className="text-sm font-semibold text-slate-900">Vikas Sharma</p>
                  <p className="text-xs text-slate-500">vikas@retailer.com</p>
                </div>
                <button 
                  onClick={() => { setDropdownOpen(false); navigate('/dashboard/profile'); }}
                  className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
                >
                  <Settings className="h-4 w-4" /> Settings
                </button>
                <button 
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 border-t border-slate-100 cursor-pointer"
                >
                  <LogOut className="h-4 w-4" /> Logout
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
