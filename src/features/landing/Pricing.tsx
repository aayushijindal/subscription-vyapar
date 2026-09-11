import { Check } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export const Pricing: React.FC = () => {
  return (
    <div className="min-h-screen pt-28 pb-20 bg-background relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-[600px] bg-gradient-to-b from-surface-soft to-transparent -z-10" />

      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16 animate-rise">
          <h1 className="text-4xl md:text-5xl font-bold text-text-primary tracking-tight mb-4">
            Simple, transparent <span className="text-primary">pricing.</span>
          </h1>
          <p className="text-lg text-text-secondary">
            No hidden fees. Choose the plan that best fits your business size and needs.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Starter Plan */}
          <div className="bg-surface rounded-[32px] p-8 border border-border shadow-xl shadow-none animate-rise" style={{ animationDelay: '100ms' }}>
            <h3 className="text-xl font-bold text-text-primary">Starter</h3>
            <p className="text-sm text-text-secondary mt-2">Perfect for small trading businesses.</p>
            <div className="my-6">
              <span className="text-4xl font-bold text-text-primary">Custom</span>
            </div>
            <ul className="space-y-4 mb-8">
              {['Single User', 'Accounting & Vouchers', 'Basic Inventory', 'Standard Reports', 'Email Support'].map((f, i) => (
                <li key={i} className="flex items-center gap-3 text-sm text-text-secondary">
                  <div className="h-5 w-5 rounded-full bg-surface-soft flex items-center justify-center">
                    <Check className="h-3 w-3 text-primary" />
                  </div>
                  {f}
                </li>
              ))}
            </ul>
            <Button variant="outline" className="w-full justify-center py-6 rounded-2xl text-base">Get Started</Button>
          </div>

          {/* Premium Plan */}
          <div className="bg-surface rounded-[32px] p-8 shadow-2xl shadow-premium border border-primary/20 animate-rise relative overflow-hidden" style={{ animationDelay: '200ms' }}>
            <div className="absolute top-0 right-0 p-8">
              <span className="inline-flex items-center rounded-full bg-primary px-3 py-1 text-xs font-bold text-white">Most Popular</span>
            </div>
            <h3 className="text-xl font-bold text-white">Premium</h3>
            <p className="text-sm text-text-muted mt-2">For growing manufacturing & wholesale.</p>
            <div className="my-6">
              <span className="text-4xl font-bold text-white">Custom</span>
            </div>
            <ul className="space-y-4 mb-8">
              {['Unlimited Users', 'Advanced Inventory (GRN, Multi-size)', 'Finish Goods Conversion', 'E-Way Bill & E-Invoice', 'Priority Phone Support'].map((f, i) => (
                <li key={i} className="flex items-center gap-3 text-sm text-white">
                  <div className="h-5 w-5 rounded-full bg-primary flex items-center justify-center">
                    <Check className="h-3 w-3 text-white" />
                  </div>
                  {f}
                </li>
              ))}
            </ul>
            <Button className="w-full justify-center py-6 rounded-2xl text-base bg-primary text-white hover:bg-primary-hover border-none">Contact Sales</Button>
          </div>
        </div>
      </div>
    </div>
  );
};
