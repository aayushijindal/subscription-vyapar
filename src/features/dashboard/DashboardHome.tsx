import React from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { 
  DollarSign, 
  TrendingUp, 
  Users, 
  ArrowUpRight, 
  ArrowDownRight,
  Zap,
  ArrowRight
} from 'lucide-react';
import { showToast } from '@/hooks/useToasts';

export const DashboardHome: React.FC = () => {
  const handleUpgrade = () => {
    showToast('info', 'Redirecting to Billing System...', 'Please select custom payment methods.');
  };

  return (
    <div className="space-y-8">
      {/* Top Welcome Notification banner */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-[16px] p-6 text-white flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-md">
        <div className="space-y-1.5 text-left">
          <h2 className="text-xl font-bold">Welcome back, Vikas Sharma!</h2>
          <p className="text-sm text-blue-100">You are currently running on the **Starter Plan**. Renew in 12 days to prevent interruption.</p>
        </div>
        <Button onClick={handleUpgrade} variant="secondary" className="gap-1 bg-white hover:bg-slate-50 text-blue-700 shadow-sm border-0 font-semibold px-5 py-2.5">
          Upgrade Plan <Zap className="h-4 w-4 text-amber-500 fill-amber-500" />
        </Button>
      </div>

      {/* Analytics KPI deck */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="text-left space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm font-semibold text-slate-500">Gross Sales Volume</span>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <DollarSign className="h-4.5 w-4.5" />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-slate-900">₹1,42,890</h3>
            <span className="inline-flex items-center gap-0.5 text-xs font-semibold text-green-600 mt-1">
              <ArrowUpRight className="h-3 w-3" /> +14.2% <span className="text-slate-400 font-normal ml-1">vs last week</span>
            </span>
          </div>
        </Card>

        <Card className="text-left space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm font-semibold text-slate-500">Invoiced Profit</span>
            <div className="p-2 bg-green-50 text-green-600 rounded-lg">
              <TrendingUp className="h-4.5 w-4.5" />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-slate-900">₹45,210</h3>
            <span className="inline-flex items-center gap-0.5 text-xs font-semibold text-green-600 mt-1">
              <ArrowUpRight className="h-3 w-3" /> +8.1% <span className="text-slate-400 font-normal ml-1">vs last week</span>
            </span>
          </div>
        </Card>

        <Card className="text-left space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm font-semibold text-slate-500">Active Subscribers</span>
            <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
              <Users className="h-4.5 w-4.5" />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-slate-900">342</h3>
            <span className="inline-flex items-center gap-0.5 text-xs font-semibold text-red-500 mt-1">
              <ArrowDownRight className="h-3 w-3" /> -1.4% <span className="text-slate-400 font-normal ml-1">vs last week</span>
            </span>
          </div>
        </Card>
      </div>

      {/* SVG Interactive Chart Visual & Recent Activity logs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Chart */}
        <Card className="lg:col-span-2 space-y-4 text-left">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-slate-900 text-base">Weekly Revenue Growth</h3>
            <span className="text-xs text-slate-400 font-medium">Auto-updated 10m ago</span>
          </div>
          <div className="h-64 flex items-end justify-between gap-2.5 pt-4">
            {/* Custom Interactive SVG Chart representation */}
            <div className="flex-1 bg-blue-50/50 hover:bg-blue-100 rounded-lg h-[40%] transition-all group relative cursor-pointer">
              <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] py-1 px-1.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">₹40K</div>
            </div>
            <div className="flex-1 bg-blue-50/50 hover:bg-blue-100 rounded-lg h-[65%] transition-all group relative cursor-pointer">
              <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] py-1 px-1.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">₹65K</div>
            </div>
            <div className="flex-1 bg-blue-50/50 hover:bg-blue-100 rounded-lg h-[50%] transition-all group relative cursor-pointer">
              <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] py-1 px-1.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">₹50K</div>
            </div>
            <div className="flex-1 bg-blue-50/50 hover:bg-blue-100 rounded-lg h-[80%] transition-all group relative cursor-pointer">
              <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] py-1 px-1.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">₹80K</div>
            </div>
            <div className="flex-1 bg-blue-600 rounded-lg h-[95%] transition-all group relative cursor-pointer">
              <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] py-1 px-1.5 rounded opacity-0 group-hover:opacity-100 transition-opacity font-semibold">₹142K</div>
            </div>
          </div>
          <div className="flex justify-between text-[10px] font-semibold text-slate-400 px-1 uppercase tracking-wide">
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
          </div>
        </Card>

        {/* Quick actions / Recent list */}
        <Card className="space-y-6 text-left">
          <h3 className="font-semibold text-slate-900 text-base">Quick Actions</h3>
          <div className="space-y-3">
            <button className="w-full flex items-center justify-between p-3.5 border border-slate-100 hover:border-slate-200 rounded-xl hover:bg-slate-50 transition-colors text-left text-sm font-semibold text-slate-800 cursor-pointer">
              <span>Create New Invoice</span>
              <ArrowRight className="h-4 w-4 text-slate-400" />
            </button>
            <button className="w-full flex items-center justify-between p-3.5 border border-slate-100 hover:border-slate-200 rounded-xl hover:bg-slate-50 transition-colors text-left text-sm font-semibold text-slate-800 cursor-pointer">
              <span>GST Report Export</span>
              <ArrowRight className="h-4 w-4 text-slate-400" />
            </button>
            <button className="w-full flex items-center justify-between p-3.5 border border-slate-100 hover:border-slate-200 rounded-xl hover:bg-slate-50 transition-colors text-left text-sm font-semibold text-slate-800 cursor-pointer">
              <span>Sync Warehouse Stocks</span>
              <ArrowRight className="h-4 w-4 text-slate-400" />
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
};
