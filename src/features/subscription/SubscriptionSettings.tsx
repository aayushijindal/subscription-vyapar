import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Table } from '@/components/ui/Table';
import { Check } from 'lucide-react';
import { showToast } from '@/hooks/useToasts';
import type { Invoice } from '@/types';

export const SubscriptionSettings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'plan' | 'invoices'>('plan');
  const [currentPlan, setCurrentPlan] = useState<'starter' | 'professional' | 'enterprise'>('starter');

  const plans = [
    { id: 'starter', name: 'Starter Plan', price: '₹999', billing: '/mo (billed yearly)' },
    { id: 'professional', name: 'Professional Plan', price: '₹1,999', billing: '/mo (billed yearly)', popular: true },
    { id: 'enterprise', name: 'Enterprise Plan', price: '₹4,999', billing: '/mo (billed yearly)' }
  ];

  const mockInvoices: Invoice[] = [
    { id: '1', invoiceNumber: 'INV-2026-001', date: '2026-06-15', amount: 11988, status: 'paid', planName: 'Starter (Annual)' },
    { id: '2', invoiceNumber: 'INV-2025-001', date: '2025-06-15', amount: 11988, status: 'paid', planName: 'Starter (Annual)' }
  ];

  const handlePlanChange = (planId: any) => {
    setCurrentPlan(planId);
    showToast('success', 'Plan settings updated!', `Switched billing tier to ${planId.toUpperCase()}`);
  };

  const invoiceColumns = [
    { key: 'invoiceNumber', header: 'Invoice Number' },
    { key: 'date', header: 'Billing Date' },
    { key: 'planName', header: 'Plan Name' },
    { 
      key: 'amount', 
      header: 'Amount Paid',
      render: (item: Invoice) => <span>₹{item.amount.toLocaleString()}</span>
    },
    { 
      key: 'status', 
      header: 'Status',
      render: (item: Invoice) => (
        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
          item.status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}>
          {item.status.toUpperCase()}
        </span>
      )
    }
  ];

  return (
    <div className="space-y-8 text-left">
      <div className="flex justify-between items-center border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 font-sans">Subscription & Invoices</h1>
          <p className="text-sm text-slate-500 mt-1">Review active subscriptions, download invoices, or upgrade plans.</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        <button 
          onClick={() => setActiveTab('plan')}
          className={`px-4 py-2 text-sm font-semibold rounded-xl transition-all cursor-pointer ${
            activeTab === 'plan' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Active Plan
        </button>
        <button 
          onClick={() => setActiveTab('invoices')}
          className={`px-4 py-2 text-sm font-semibold rounded-xl transition-all cursor-pointer ${
            activeTab === 'invoices' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Invoice History
        </button>
      </div>

      {/* Active Plan Content */}
      {activeTab === 'plan' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
          {plans.map((p) => {
            const isCurrent = currentPlan === p.id;
            return (
              <Card 
                key={p.id}
                className={`flex flex-col justify-between border relative ${
                  isCurrent ? 'border-blue-500 ring-2 ring-blue-500/10 bg-blue-50/10' : 'border-slate-200'
                }`}
              >
                {p.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[10px] font-semibold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                    Recommended Upgrade
                  </span>
                )}
                
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-lg text-slate-900">{p.name}</h3>
                    {isCurrent && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold">
                        <Check className="h-3.5 w-3.5" /> Current
                      </span>
                    )}
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold text-slate-900">{p.price}</span>
                    <span className="text-slate-400 text-xs">{p.billing}</span>
                  </div>
                </div>

                <Button 
                  onClick={() => !isCurrent && handlePlanChange(p.id)}
                  disabled={isCurrent}
                  variant={isCurrent ? 'outline' : p.popular ? 'primary' : 'outline'}
                  className="w-full mt-6 justify-center"
                >
                  {isCurrent ? 'Active Plan' : 'Select Plan'}
                </Button>
              </Card>
            );
          })}
        </div>
      )}

      {/* Invoices Content */}
      {activeTab === 'invoices' && (
        <Card>
          <Table data={mockInvoices} columns={invoiceColumns} />
        </Card>
      )}
    </div>
  );
};
