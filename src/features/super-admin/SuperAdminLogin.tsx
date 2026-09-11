import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/authHelpers';
import { Shield, Loader2, Eye, EyeOff } from 'lucide-react';
import { superAdminApi } from '@/services/api/superAdmin';

export const SuperAdminLogin: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth(); // Assume standard auth handler

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await superAdminApi.login({ username, password });
      
      // Store token depending on how auth flow works. Assuming standard response format.
      if (response.access) {
        
        // Force auth state update
        login(response);
        navigate('/super-admin');
      } else {
        throw new Error('Invalid token received from server');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.response?.data?.detail || err.response?.data?.error || 'Invalid credentials. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-[440px] bg-surface rounded-[24px] shadow-[0_8px_30px_rgba(40,45,70,0.06)] border border-border overflow-hidden">
        <div className="p-10">
          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-16 h-16 rounded-[16px] bg-primary/10 flex items-center justify-center mb-4">
              <Shield className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-[24px] font-bold text-text-primary tracking-tight">Super Admin Login</h1>
            <p className="text-[14px] text-text-secondary mt-2">Access the central control panel for First Computer ERP</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-3 rounded-[10px] bg-danger/10 text-danger text-[13px] font-medium text-center border border-danger/20">
                {error}
              </div>
            )}
            
            <div className="space-y-1.5">
              <label className="text-[13px] font-semibold text-text-primary">Username</label>
              <input 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full bg-surface border border-border text-[14px] text-text-primary rounded-[10px] p-3 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-text-muted"
                placeholder="admin"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[13px] font-semibold text-text-primary">Password</label>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"} 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full bg-surface border border-border text-[14px] text-text-primary rounded-[10px] py-3 pl-3 pr-10 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-text-muted"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary focus:outline-none transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-primary hover:bg-primary-hover disabled:opacity-50 text-white rounded-[10px] py-3.5 text-[14px] font-bold transition-colors mt-2 flex justify-center items-center gap-2"
            >
              {isLoading ? <><Loader2 className="w-5 h-5 animate-spin" /> Authenticating...</> : 'Sign In'}
            </button>
          </form>
        </div>
        <div className="bg-background border-t border-border p-5 text-center">
          <p className="text-[12px] font-medium text-text-muted">
            Protected Area. Only authorized personnel may login.
          </p>
        </div>
      </div>
    </div>
  );
};
