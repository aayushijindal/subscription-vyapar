import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Check } from 'lucide-react';
import { showToast } from '@/hooks/useToasts';

export const Pricing: React.FC = () => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  const plans = [
    {
      name: 'Starter',
      description: 'Ideal for small retail shops and independent operators.',
      price: billingCycle === 'monthly' ? 1200 : 999,
      features: ['Up to 500 invoices / mo', 'Single business warehouse', 'Standard email support', 'GST reports generation']
    },
    {
      name: 'Professional',
      description: 'Perfect for growing wholesalers and multiple warehouses.',
      price: billingCycle === 'monthly' ? 2500 : 1999,
      features: ['Unlimited invoicing', 'Up to 5 warehouses', 'Priority WhatsApp support', 'Automated subscription logs', 'Custom brand themes'],
      popular: true
    },
    {
      name: 'Enterprise',
      description: 'Configured for global chains needing custom integrations.',
      price: billingCycle === 'monthly' ? 6000 : 4999,
      features: ['Unlimited warehouse sync', 'Dedicated account manager', 'Custom API webhooks', 'SLA guaranteed uptime', 'Advanced audit logs']
    }
  ];

  const handleSelectPlan = (planName: string) => {
    showToast('success', `Selected ${planName} Plan`, 'Successfully initialized checkout process.');
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-20 space-y-16 text-center">
      {/* Title */}
      <div className="space-y-4 max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold text-slate-900">Simple, transparent pricing plans</h1>
        <p className="text-slate-500">Pick the plan that works best for your billing scale. Switch or cancel at any time.</p>
      </div>

      {/* Switch billing cycle */}
      <div className="flex items-center justify-center gap-4">
        <span className={`text-sm font-medium ${billingCycle === 'monthly' ? 'text-blue-600' : 'text-slate-500'}`}>Monthly Billing</span>
        <button
          onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
          className="w-12 h-6.5 bg-slate-200 rounded-full p-1 transition-colors duration-200 focus:outline-none relative"
        >
          <div className={`w-4.5 h-4.5 bg-white rounded-full transition-transform duration-200 shadow-md ${
            billingCycle === 'yearly' ? 'translate-x-5.5 bg-blue-600' : 'translate-x-0'
          }`} />
        </button>
        <span className={`text-sm font-medium ${billingCycle === 'yearly' ? 'text-blue-600' : 'text-slate-500'}`}>
          Yearly Billing <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full ml-1 font-semibold">Save 20%</span>
        </span>
      </div>

      {/* Plans Card Deck */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch max-w-6xl mx-auto text-left">
        {plans.map((plan) => (
          <Card 
            key={plan.name}
            className={`flex flex-col justify-between relative border ${
              plan.popular ? 'border-blue-500 ring-2 ring-blue-500/10' : 'border-slate-200'
            }`}
          >
            {plan.popular && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
                Most Popular
              </span>
            )}

            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-slate-900">{plan.name}</h3>
                <p className="text-slate-500 text-sm mt-2">{plan.description}</p>
              </div>

              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold text-slate-900">₹{plan.price}</span>
                <span className="text-slate-500 text-sm">/ month</span>
              </div>

              <hr className="border-slate-100" />

              <ul className="space-y-3.5 text-sm text-slate-600">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-2.5">
                    <Check className="h-4.5 w-4.5 text-blue-600 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <Button 
              onClick={() => handleSelectPlan(plan.name)}
              variant={plan.popular ? 'primary' : 'outline'}
              className="w-full mt-8 rounded-xl py-3 justify-center"
            >
              Get Started
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
};
