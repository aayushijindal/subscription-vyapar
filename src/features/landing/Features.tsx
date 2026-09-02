import { ShieldCheck, BarChart3, Boxes, ReceiptIndianRupee, Lock, Zap, FileCheck2 } from 'lucide-react';

const features = [
  { icon: ReceiptIndianRupee, title: 'Accounts & Vouchers', text: 'Maintain cash, bank, contra and journal vouchers with complete control. Automated ledger balancing.' },
  { icon: Boxes, title: 'Inventory Management', text: 'Track raw material, finished goods, GRN and purchase activity in one place with real-time stock levels.' },
  { icon: BarChart3, title: 'Business Reports', text: 'Make better decisions with sales, purchase, stock and ledger statements available instantly.' },
  { icon: Lock, title: 'Secure & Reliable', text: 'Role-based access control, encrypted backups, and industry-standard security protocols.' },
  { icon: Zap, title: 'Lightning Fast', text: 'Optimized for speed. Load thousands of inventory items and generate reports in milliseconds.' },
  { icon: FileCheck2, title: 'E-Way & E-Invoice', text: 'Generate IRN and E-Way bills directly from the software with a single click.' },
];

export const Features: React.FC = () => {
  return (
    <div className="min-h-screen pt-28 pb-20 bg-slate-50 overflow-hidden relative">
      {/* Background aesthetics */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-blue-100/50 rounded-full blur-[100px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16 animate-rise">
          <span className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-600 mb-4">
            <ShieldCheck className="h-3.5 w-3.5" /> Powerful Capabilities
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight mb-4">
            Everything you need to <span className="text-blue-600">run your business.</span>
          </h1>
          <p className="text-lg text-slate-600">
            First Computer ERP is packed with features designed specifically for modern trading and manufacturing operations.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <div 
                key={i} 
                className="bg-white rounded-[24px] p-8 border border-slate-200/60 shadow-xl shadow-slate-200/20 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 animate-rise group"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="h-14 w-14 rounded-2xl bg-blue-50 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-blue-600 transition-all duration-300">
                  <Icon className="h-6 w-6 text-blue-600 group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed">{feature.text}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
