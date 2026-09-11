import React, { useState } from 'react';
import { ChevronDown, Menu, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/authHelpers';
import { useLogout } from '@/hooks/useAuthQueries';
import { useIsFetching, useIsMutating } from '@tanstack/react-query';

export const Topbar: React.FC<{ onMenuClick: () => void }> = ({ onMenuClick }) => {
  const [menu, setMenu] = useState(false); 
  const { user } = useAuth(); 
  const logout = useLogout();
  
  const isFetching = useIsFetching();
  const isMutating = useIsMutating();
  const isApiLoading = isFetching > 0 || isMutating > 0;
  
  const label = user ? `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.email : '';
  const initials = label.split(/\s+/).filter(Boolean).map(part => part[0]).join('').slice(0, 2).toUpperCase() || 'U';

  return (
    <header className="sticky top-0 z-20 flex h-[68px] items-center justify-between bg-[#1B242D]/95 px-5 backdrop-blur md:px-8 shadow-sm">
      <div className="flex items-center gap-4">
        <button onClick={onMenuClick} className="rounded-lg p-2 text-text-secondary hover:text-text-primary hover:bg-surface-soft lg:hidden transition-colors">
          <Menu className="h-5 w-5" />
        </button>
      </div>
      
      <div className="flex items-center gap-3 md:gap-5">
        {isApiLoading && (
          <div className="flex items-center text-primary bg-primary/10 px-3 py-1.5 rounded-full transition-all duration-300">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="hidden sm:inline-block ml-2 text-xs font-semibold uppercase tracking-wider">Syncing</span>
          </div>
        )}
        <div className="relative">
          <button onClick={() => setMenu(!menu)} className="flex items-center gap-2 rounded-xl p-1.5 hover:bg-surface-soft transition-colors">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#D9E5F2] text-xs font-bold text-[#17324D]">
              {initials}
            </span>
            <span className="hidden text-left sm:block">
              <b className="block max-w-32 truncate text-xs text-text-primary font-medium">
                {label}
              </b>
              <small className="block text-[10px] text-text-muted">{user?.role}</small>
            </span>
            <ChevronDown className="h-3.5 w-3.5 text-text-secondary" />
          </button>
          
          {menu && (
            <div className="absolute right-0 mt-2 w-44 rounded-xl border border-border bg-surface p-1.5 shadow-premium">
              <Link to="/dashboard/profile" onClick={() => setMenu(false)} className="block w-full rounded-lg px-3 py-2 text-left text-xs font-medium text-text-secondary hover:text-text-primary hover:bg-surface-soft transition-colors">
                My Profile
              </Link>
              <button 
                onClick={() => logout.mutate()} 
                disabled={logout.isPending}
                className="w-full flex items-center gap-2 rounded-lg px-3 py-2 text-left text-xs font-medium text-text-secondary hover:text-text-primary hover:bg-surface-soft disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {logout.isPending ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
                    Signing out...
                  </>
                ) : (
                  'Sign out'
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
