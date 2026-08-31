import React from 'react';
import { ArrowRight, TrendingUp, ShieldCheck, Zap, Layers, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

export const Home: React.FC = () => {
  return (
    <div className="space-y-24 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-16 lg:pt-28">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 text-left">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 text-blue-600 text-xs font-semibold">
              <Zap className="h-3.5 w-3.5" /> Next Gen ERP Software
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 leading-tight">
              Manage your business subscription and <span className="text-blue-600">billing automate</span>.
            </h1>
            <p className="text-lg text-slate-500 leading-relaxed max-w-xl">
              VyaparERP is designed for scaling shops, wholesalers, and retail operators. Track profit margins, simplify inventory sync, and file GST with zero manual effort.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/register">
                <Button className="px-6 py-3 rounded-xl gap-2 text-base">
                  Get Started Free <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Link to="/pricing">
                <Button variant="outline" className="px-6 py-3 rounded-xl text-base">
                  View Pricing
                </Button>
              </Link>
            </div>
          </div>

          {/* Premium Visual / Mockup Placeholder */}
          <div className="relative">
            <div className="absolute inset-0 bg-blue-500 rounded-full filter blur-3xl opacity-10 -m-8" />
            <Card className="relative overflow-hidden border border-slate-200 shadow-xl p-0.5 rounded-[16px] bg-slate-900">
              <div className="bg-slate-800 p-3 rounded-t-[14px] flex items-center gap-1.5 border-b border-slate-700">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <div className="h-4 bg-slate-700/80 rounded-md w-40 ml-3" />
              </div>
              <div className="p-4 bg-slate-900 text-slate-400 space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-slate-800 p-4 rounded-xl space-y-2">
                    <div className="h-2 w-12 bg-slate-700 rounded" />
                    <div className="h-4 w-20 bg-blue-500 rounded" />
                  </div>
                  <div className="bg-slate-800 p-4 rounded-xl space-y-2">
                    <div className="h-2 w-12 bg-slate-700 rounded" />
                    <div className="h-4 w-16 bg-green-500 rounded" />
                  </div>
                  <div className="bg-slate-800 p-4 rounded-xl space-y-2">
                    <div className="h-2 w-12 bg-slate-700 rounded" />
                    <div className="h-4 w-18 bg-yellow-500 rounded" />
                  </div>
                </div>
                <div className="h-32 bg-slate-800/50 border border-dashed border-slate-700 rounded-xl flex items-center justify-center">
                  <TrendingUp className="h-10 w-10 text-blue-500 animate-pulse" />
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="bg-white py-12 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-8">Trusted by growing Indian enterprises</p>
          <div className="flex flex-wrap justify-center items-center gap-12 sm:gap-20 opacity-50">
            <span className="text-xl font-bold text-slate-700 tracking-wider">TALLYCORP</span>
            <span className="text-xl font-bold text-slate-700 tracking-wider">VYAPARSYS</span>
            <span className="text-xl font-bold text-slate-700 tracking-wider">RETAILZONE</span>
            <span className="text-xl font-bold text-slate-700 tracking-wider">ZOHOBOOKS</span>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="max-w-7xl mx-auto px-6 space-y-12">
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900">Features designed for modern business</h2>
          <p className="text-slate-500">Every tool you need to streamline invoicing, track inventory stock metrics, and manage subscriptions.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card hoverEffect className="space-y-4 text-left">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl w-fit">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900">Secure Billing</h3>
            <p className="text-slate-500 text-sm leading-relaxed">
              Create GST-compliant invoices immediately. Safe backups guard your financial logs.
            </p>
          </Card>

          <Card hoverEffect className="space-y-4 text-left">
            <div className="p-3 bg-green-50 text-green-600 rounded-xl w-fit">
              <Layers className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900">Subscription Sync</h3>
            <p className="text-slate-500 text-sm leading-relaxed">
              Automate customer subscription billing schedules, renewals, and invoice tracking instantly.
            </p>
          </Card>

          <Card hoverEffect className="space-y-4 text-left">
            <div className="p-3 bg-purple-50 text-purple-600 rounded-xl w-fit">
              <RefreshCw className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900">Real-time Stock Monitor</h3>
            <p className="text-slate-500 text-sm leading-relaxed">
              Monitor inventory balances and alerts automatically when levels drop below customized safety limits.
            </p>
          </Card>
        </div>
      </section>
    </div>
  );
};
