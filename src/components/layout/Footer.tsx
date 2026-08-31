import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Mail, Phone, MapPin } from 'lucide-react';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Brand */}
        <div className="space-y-4">
          <Link to="/" className="flex items-center gap-2 text-white">
            <div className="bg-blue-600 text-white p-2 rounded-xl">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <span className="text-xl font-bold tracking-tight">VyaparERP</span>
          </Link>
          <p className="text-sm text-slate-400 leading-relaxed">
            Enterprise grade subscription billing & ERP system customized for retail shops, wholesalers, and modern commerce.
          </p>
        </div>

        {/* Company */}
        <div>
          <h4 className="text-white font-semibold text-sm mb-4">Company</h4>
          <ul className="space-y-2.5 text-sm">
            <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
            <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
            <li><Link to="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
          </ul>
        </div>

        {/* Support & Legal */}
        <div>
          <h4 className="text-white font-semibold text-sm mb-4">Legal & Support</h4>
          <ul className="space-y-2.5 text-sm">
            <li><Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
            <li><Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
            <li><Link to="/refund" className="hover:text-white transition-colors">Refund Policy</Link></li>
          </ul>
        </div>

        {/* Newsletter / Contact */}
        <div className="space-y-4">
          <h4 className="text-white font-semibold text-sm mb-4">Contact Info</h4>
          <ul className="space-y-3 text-sm">
            <li className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-blue-500" />
              <span>support@vyaparerp.com</span>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-blue-500" />
              <span>+1 (555) 019-2834</span>
            </li>
            <li className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-blue-500" />
              <span>San Francisco, CA</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6 border-t border-slate-800/80 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs">
        <span>&copy; {currentYear} VyaparERP Inc. All rights reserved.</span>
        <div className="flex gap-4">
          <a href="#" className="hover:text-white transition-colors">Twitter</a>
          <a href="#" className="hover:text-white transition-colors">GitHub</a>
          <a href="#" className="hover:text-white transition-colors">LinkedIn</a>
        </div>
      </div>
    </footer>
  );
};
