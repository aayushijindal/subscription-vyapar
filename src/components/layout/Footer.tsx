import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Mail, Phone, MapPin } from 'lucide-react';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-dark text-text-muted">
      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16">
        {/* Brand */}
        <div className="space-y-6">
          <Link to="/" className="flex items-center gap-2 text-white">
            <div className="bg-primary text-white p-2 rounded-xl">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <span className="text-xl font-bold tracking-tight">First Computer ERP</span>
          </Link>
          <p className="text-sm text-text-muted leading-relaxed max-w-xs">
            A comprehensive, modern ERP system designed to streamline your accounting, inventory, and operations.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-white font-semibold text-sm mb-6 uppercase tracking-wider">Quick Links</h4>
          <ul className="space-y-3.5 text-sm">
            <li><Link to="/features" className="hover:text-white transition-colors">Features</Link></li>
            <li><Link to="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
            <li><Link to="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
            <li><Link to="/login" className="hover:text-white transition-colors">Log In</Link></li>
            <li><Link to="/register" className="hover:text-white transition-colors">Create Account</Link></li>
          </ul>
        </div>

        

        {/* Contact Info */}
        <div className="space-y-4">
          <h4 className="text-white font-semibold text-sm mb-6 uppercase tracking-wider">Contact Us</h4>
          <ul className="space-y-4 text-sm">
            <li className="flex items-start gap-3">
              <Mail className="h-4.5 w-4.5 text-primary mt-0.5" />
              <span className="hover:text-white transition-colors cursor-pointer">sanjay_zindal@rediffmail.com</span>
            </li>
            <li className="flex items-start gap-3">
              <Phone className="h-4.5 w-4.5 text-primary mt-0.5" />
              <span className="hover:text-white transition-colors cursor-pointer">+91 94260 64310</span>
            </li>
            <li className="flex items-start gap-3">
              <MapPin className="h-4.5 w-4.5 text-primary mt-0.5" />
              <span>Ahmedabad, Gujarat<br/>India</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-text-secondary">
        <span>&copy; {currentYear} First Computer ERP Inc. All rights reserved.</span>
        <div className="flex gap-4">
          <span className="flex items-center gap-1">Designed with <span className="text-red-500">♥</span> in India</span>
        </div>
      </div>
    </footer>
  );
};
