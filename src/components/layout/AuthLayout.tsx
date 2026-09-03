import React from 'react';
import { Outlet } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';

export const AuthLayout: React.FC = () => {
  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-slate-50">
      {/* Left side Form Area */}
      <div className="flex flex-col justify-center px-6 py-12 sm:px-16 lg:px-20 bg-white">
        <div className="mx-auto w-full max-w-md">
          {/* Header/Logo */}
          <div className="flex items-center gap-2 mb-10">
            <div className="bg-blue-600 text-white p-2 rounded-xl">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900">First Computer ERP</span>
          </div>

          <Outlet />
        </div>
      </div>

      {/* Right side Illustration/Promo */}
      <div className="hidden lg:flex flex-col justify-between bg-blue-600 p-16 text-white relative overflow-hidden">
        {/* Abstract shapes for premium graphics feel */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500 rounded-full filter blur-3xl opacity-30 -mr-40 -mt-40" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-400 rounded-full filter blur-3xl opacity-20 -ml-40 -mb-40" />

        <div className="relative z-10">
          <span className="text-sm font-semibold tracking-wider uppercase text-blue-200">First Computer ERP</span>
          <h2 className="text-4xl font-bold leading-tight mt-6 max-w-lg">
            Keep accounting, inventory, sales and purchases moving together.
          </h2>
        </div>

        <div className="relative z-10 space-y-4">
          <blockquote className="text-lg text-blue-100 italic">
            "Switching to First Computer ERP helped our retail business consolidate GST filings and automate customer invoices in minutes."
          </blockquote>
          <div>
            <p className="font-semibold">Sanjay Jindal</p>
            <p className="text-sm text-blue-200">Director, First Computer </p>
          </div>
        </div>
      </div>
    </div>
  );
};


