import React from 'react';
import { Users, Building2, Activity, Globe, Loader2, MessageSquare, CheckCircle2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { superAdminApi } from '@/services/api/superAdmin';

export const SuperAdminDashboard: React.FC = () => {
  const { data: statsData, isLoading: isLoadingStats } = useQuery({
    queryKey: ['superAdminDashboardStats'],
    queryFn: () => superAdminApi.getDashboardStats()
  });

  // Map the new API schema to our UI cards
  const stats = [
    { 
      title: 'Total Companies', 
      value: statsData?.total_companies || '0', 
      change: 'Active: ' + (statsData?.active_companies || '0'), 
      isPositive: true, 
      icon: Building2, 
      bg: 'bg-primary/10', 
      iconColor: 'text-primary' 
    },
    { 
      title: 'Active Users', 
      value: statsData?.active_users || '0', 
      change: 'Total: ' + (statsData?.total_users || '0'), 
      isPositive: true, 
      icon: Users, 
      bg: 'bg-primary/10', 
      iconColor: 'text-primary' 
    },
    { 
      title: 'New Inquiries', 
      value: statsData?.new_inquiries || '0', 
      change: 'Requires Attention', 
      isPositive: false, 
      icon: MessageSquare, 
      bg: 'bg-warning-bg', 
      iconColor: 'text-warning' 
    },
    { 
      title: 'Resolved Inquiries', 
      value: statsData?.resolved_inquiries || '0', 
      change: 'Handled Successfully', 
      isPositive: true, 
      icon: CheckCircle2, 
      bg: 'bg-success-bg', 
      iconColor: 'text-success' 
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header section */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-[24px] font-bold text-text-primary tracking-tight">Platform Overview</h1>
          <p className="text-[14px] text-text-secondary mt-1">Here's what's happening across the ERP platform.</p>
        </div>
        <div className="flex items-center gap-2.5 bg-surface-soft border border-border px-4 py-2 rounded-[10px]">
          <Globe className="w-[18px] h-[18px] text-primary" />
          <span className="text-[13px] font-medium text-text-secondary">Global Control Center</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div 
              key={index}
              className="bg-surface border border-border rounded-[16px] p-6 shadow-[0_4px_18px_rgba(40,45,70,0.04)] relative overflow-hidden"
            >
              {isLoadingStats && (
                <div className="absolute inset-0 bg-surface/80 flex items-center justify-center z-10 backdrop-blur-[1px]">
                  <Loader2 className="w-5 h-5 text-primary animate-spin" />
                </div>
              )}
              <div className="flex justify-between items-start mb-5">
                <div className={`p-3 rounded-[12px] ${stat.bg} ${stat.iconColor}`}>
                  <Icon className="w-[22px] h-[22px]" />
                </div>
                <div className={`flex items-center gap-1 text-[12px] font-bold px-2.5 py-1 rounded-full ${
                  stat.isPositive ? 'bg-success-bg text-success' : 'bg-warning-bg text-warning'
                }`}>
                  {stat.change}
                </div>
              </div>
              
              <div>
                <h3 className="text-[14px] font-medium text-text-secondary">{stat.title}</h3>
                <p className="text-[28px] font-bold text-text-primary mt-1 tracking-tight">{stat.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Revenue Chart Area (Aesthetic Placeholder as no API provided yet) */}
        <div className="lg:col-span-2 bg-surface border border-border rounded-[16px] p-7 shadow-[0_4px_18px_rgba(40,45,70,0.04)] flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-[18px] font-bold text-text-primary">Platform Growth</h3>
            <select className="bg-surface-soft border border-border text-[13px] font-medium text-text-secondary rounded-[10px] px-3 py-2 outline-none focus:border-[#6C63D9] transition-colors cursor-pointer">
              <option>Last 30 Days</option>
              <option>This Year</option>
            </select>
          </div>
          
          <div className="flex-1 min-h-[300px] w-full relative">
            <div className="absolute inset-0 flex flex-col justify-between pt-2 pb-8 pointer-events-none">
              {[1, 2, 3, 4, 5].map((line) => (
                <div key={line} className="w-full border-t border-border border-dashed" />
              ))}
            </div>
            
            <div className="absolute inset-x-0 bottom-8 top-2 flex items-end">
              <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
                <defs>
                  <linearGradient id="chart-gradient" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#FF6B21" stopOpacity="0.15" />
                    <stop offset="100%" stopColor="#FF6B21" stopOpacity="0.01" />
                  </linearGradient>
                </defs>
                <path 
                  d="M0,100 L0,70 Q10,60 20,65 T40,40 T60,50 T80,30 T100,10 L100,100 Z" 
                  fill="url(#chart-gradient)" 
                />
                <path 
                  d="M0,70 Q10,60 20,65 T40,40 T60,50 T80,30 T100,10" 
                  fill="none" 
                  stroke="#FF6B21" 
                  strokeWidth="2.5" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                />
              </svg>
            </div>
          </div>
          
          <div className="flex justify-between mt-2 text-[12px] font-medium text-text-muted px-2">
            <span>Jan</span>
            <span>Feb</span>
            <span>Mar</span>
            <span>Apr</span>
            <span>May</span>
            <span>Jun</span>
            <span>Jul</span>
            <span>Aug</span>
            <span>Sep</span>
            <span>Oct</span>
            <span>Nov</span>
            <span>Dec</span>
          </div>
        </div>

        {/* Activity Feed (Placeholder as no API provided) */}
        <div className="bg-surface border border-border rounded-[16px] p-7 flex flex-col shadow-[0_4px_18px_rgba(40,45,70,0.04)]">
          <h3 className="text-[18px] font-bold text-text-primary mb-8">Recent Activity</h3>
          <div className="flex-1 flex flex-col items-center justify-center text-center pb-10">
            <div className="w-16 h-16 bg-background border border-border rounded-full flex items-center justify-center mb-4">
               <Activity className="w-8 h-8 text-text-muted" />
            </div>
            <p className="text-[14px] font-medium text-text-secondary">No recent activity feed available</p>
            <p className="text-[13px] text-text-muted mt-1 max-w-[200px]">System logs and activity will appear here once enabled.</p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default SuperAdminDashboard;
