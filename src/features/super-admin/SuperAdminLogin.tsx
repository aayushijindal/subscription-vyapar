import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/authHelpers';
import { Shield, Loader2 } from 'lucide-react';
import { superAdminApi } from '@/services/api/superAdmin';

export const SuperAdminLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth(); // Assume standard auth handler

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await superAdminApi.login({ email, password });
      
      // Store token depending on how auth flow works. Assuming standard response format.
      if (response.access || response.data?.access) {
        localStorage.setItem('access_token', response.access || response.data?.access);
        if (response.refresh || response.data?.refresh) {
          localStorage.setItem('refresh_token', response.refresh || response.data?.refresh);
        }
        // Force auth state update
        login(response.access || response.data?.access, response.refresh || response.data?.refresh);
        navigate('/super-admin');
      } else {
        throw new Error('Invalid token received from server');
      }
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message || 'Login failed. Please verify your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F6F7FB] flex items-center justify-center p-4">
      <div className="w-full max-w-[440px] bg-[#FFFFFF] rounded-[24px] shadow-[0_8px_30px_rgba(40,45,70,0.06)] border border-[#E8EAF1] overflow-hidden">
        <div className="p-10">
          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-16 h-16 rounded-[16px] bg-[#F0EEFF] flex items-center justify-center mb-4">
              <Shield className="w-8 h-8 text-[#6C63D9]" />
            </div>
            <h1 className="text-[24px] font-bold text-[#25283A] tracking-tight">Super Admin Login</h1>
            <p className="text-[14px] text-[#687085] mt-2">Access the central control panel for First Computer ERP</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-3 rounded-[10px] bg-[#FCEEEF] text-[#D96F75] text-[13px] font-medium text-center border border-[#F9D6D8]">
                {error}
              </div>
            )}
            
            <div className="space-y-1.5">
              <label className="text-[13px] font-semibold text-[#25283A]">Email Address</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-[#FFFFFF] border border-[#DFE3EC] text-[14px] text-[#25283A] rounded-[10px] p-3 outline-none focus:border-[#8B83E5] focus:ring-2 focus:ring-[#8B83E5]/20 transition-all placeholder:text-[#9299AA]"
                placeholder="admin@firstcomputererp.com"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[13px] font-semibold text-[#25283A]">Password</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-[#FFFFFF] border border-[#DFE3EC] text-[14px] text-[#25283A] rounded-[10px] p-3 outline-none focus:border-[#8B83E5] focus:ring-2 focus:ring-[#8B83E5]/20 transition-all placeholder:text-[#9299AA]"
                placeholder="••••••••"
              />
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-[#6C63D9] hover:bg-[#5E56B7] disabled:opacity-50 text-white rounded-[10px] py-3.5 text-[14px] font-bold transition-colors mt-2 flex justify-center items-center gap-2"
            >
              {isLoading ? <><Loader2 className="w-5 h-5 animate-spin" /> Authenticating...</> : 'Sign In'}
            </button>
          </form>
        </div>
        <div className="bg-[#F8F9FC] border-t border-[#E8EAF1] p-5 text-center">
          <p className="text-[12px] font-medium text-[#9299AA]">
            Protected Area. Only authorized personnel may login.
          </p>
        </div>
      </div>
    </div>
  );
};
