import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export const Contact: React.FC = () => {
  return (
    <div className="min-h-screen pt-28 pb-20 bg-slate-50 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-100/40 rounded-full blur-[120px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
        <div className="animate-rise">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight mb-6">
            Let's get in <span className="text-blue-600">touch.</span>
          </h1>
          <p className="text-lg text-slate-600 mb-10 max-w-lg">
            Have questions about First Computer ERP? Our team is here to help you set up your workspace and scale your operations.
          </p>

          <div className="space-y-8">
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 rounded-2xl bg-blue-100 flex items-center justify-center flex-shrink-0">
                <Phone className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900">Phone Support</h3>
                <p className="text-slate-600 mt-1">+91 94260 64310</p>
                <p className="text-sm text-slate-400">Mon-Sat, 9am to 6pm IST</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="h-12 w-12 rounded-2xl bg-blue-100 flex items-center justify-center flex-shrink-0">
                <Mail className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900">Email</h3>
                <p className="text-slate-600 mt-1">sanjay_zindal@rediffmail.com</p>
                <p className="text-sm text-slate-400">We aim to reply within 2 hours</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="h-12 w-12 rounded-2xl bg-blue-100 flex items-center justify-center flex-shrink-0">
                <MapPin className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900">Office</h3>
                <p className="text-slate-600 mt-1">Ahmedabad, Gujarat, India</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-[32px] p-8 md:p-10 border border-slate-200/60 shadow-2xl shadow-slate-200/40 animate-rise" style={{ animationDelay: '200ms' }}>
          <h3 className="text-2xl font-bold text-slate-900 mb-6">Send a message</h3>
          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">First Name</label>
                <input type="text" className="w-full rounded-xl border border-slate-200 py-3 px-4 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 bg-slate-50/50" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Last Name</label>
                <input type="text" className="w-full rounded-xl border border-slate-200 py-3 px-4 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 bg-slate-50/50" />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Email Address</label>
              <input type="email" className="w-full rounded-xl border border-slate-200 py-3 px-4 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 bg-slate-50/50" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Message</label>
              <textarea rows={4} className="w-full rounded-xl border border-slate-200 py-3 px-4 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 bg-slate-50/50 resize-none"></textarea>
            </div>
            <Button className="w-full py-3.5 rounded-xl gap-2 mt-4">
              Send Message <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};
