import React, { useState } from 'react';
import { ChevronDown, Menu } from 'lucide-react';
import { useAuth } from '@/context/authHelpers';
import { useLogout } from '@/hooks/useAuthQueries';

export const Topbar: React.FC<{ onMenuClick: () => void }> = ({ onMenuClick }) => {
  const [menu, setMenu] = useState(false); 
  const { user } = useAuth(); 
  const logout = useLogout();
  
  const label = user ? `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.email : '';
  const initials = label.split(/\\s+/).filter(Boolean).map(part => part[0]).join('').slice(0, 2).toUpperCase() || 'U';

  return (
    <header className="sticky top-0 z-20 flex h-[76px] items-center justify-between border-b border-[#e3eaf1] bg-white/90 px-5 backdrop-blur md:px-8">
      <div className="flex items-center gap-4">
        <button onClick={onMenuClick} className="rounded-lg p-2 text-[#48647f] lg:hidden">
          <Menu className="h-5 w-5" />
        </button>
      </div>
      
      <div className="flex items-center gap-3 md:gap-5">
        <div className="relative">
          <button onClick={() => setMenu(!menu)} className="flex items-center gap-2 rounded-xl p-1.5 hover:bg-[#f4f7fb]">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#dbe7f4] text-xs font-bold text-[#214a78]">
              {initials}
            </span>
            <span className="hidden text-left sm:block">
              <b className="block max-w-32 truncate text-xs text-[#213b5a]">
                {label}
              </b>
              <small className="block text-[10px] text-[#8193a8]">{user?.role}</small>
            </span>
            <ChevronDown className="h-3.5 w-3.5 text-[#8093a9]" />
          </button>
          
          {menu && (
            <div className="absolute right-0 mt-2 w-44 rounded-xl border border-[#e1e8f0] bg-white p-1.5 shadow-xl">
              <button onClick={() => logout.mutate()} className="w-full rounded-lg px-3 py-2 text-left text-xs font-medium text-[#435e7a] hover:bg-slate-50">
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
