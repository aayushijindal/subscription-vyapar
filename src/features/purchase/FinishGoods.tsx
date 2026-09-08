import React, { useState } from 'react';
import { Search, Plus, Save } from 'lucide-react';

export const FinishGoodsPage: React.FC = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);

  if (!isFormOpen) {
    return (
      <div className="min-h-screen bg-[#F8F9FC] p-4 sm:p-6 lg:p-8 font-sans">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white rounded-2xl shadow-sm border border-slate-200/60 p-5 mb-6">
          <div>
            <h1 className="text-[18px] font-black text-[#1E293B] tracking-tight uppercase">Finish Goods Conversions</h1>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Manage production from raw materials</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input type="text" placeholder="Search entries..." className="w-[250px] bg-slate-50 border border-slate-200 focus:border-[#4338CA] focus:bg-white rounded-xl pl-9 pr-4 py-2.5 text-[13px] outline-none transition-all" />
            </div>
            <button onClick={() => setIsFormOpen(true)} className="bg-[#4338CA] hover:bg-[#3730A3] text-white px-5 py-2.5 rounded-xl text-[12px] font-bold uppercase tracking-wider flex items-center gap-2 shadow-sm shadow-indigo-500/20 transition-all">
              <Plus className="w-4 h-4" /> New Entry
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden">
          <div className="p-12 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
              <Search className="w-8 h-8 text-slate-300" />
            </div>
            <h3 className="text-[15px] font-black text-slate-700 uppercase tracking-wide">No Entries Found</h3>
            <p className="text-[13px] text-slate-500 mt-1 max-w-sm">You haven't recorded any entries yet. Click "New Entry" to get started.</p>
          </div>
        </div>
      </div>
    );
  }

  
  return (
    <div className="min-h-screen bg-[#F8F9FC] p-4 sm:p-6 lg:p-8 font-sans">
      
      {/* Header */}
      <div className="flex items-center gap-3 bg-white rounded-xl shadow-sm border border-slate-200/60 p-5 mb-6">
        <div className="w-10 h-10 bg-[#10B981]/10 rounded-lg flex items-center justify-center text-[#10B981]">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
        </div>
        <div>
          <h1 className="text-[16px] font-black text-[#1E293B] tracking-tight uppercase">Finish Goods Entry</h1>
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Record Production From Raw Receipts</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden mb-6">
        <div className="p-8">
          
          {/* Section 1: Source */}
          <div className="mb-10">
            <div className="flex items-center gap-2 mb-6">
              <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-bold flex items-center justify-center">1</span>
              <h2 className="text-[13px] font-black text-[#1E293B] uppercase tracking-wide">Source (Raw Material)</h2>
            </div>
            
            <div className="pl-7 space-y-6">
              <div className="space-y-1.5 w-full">
                <label className="text-[11px] font-bold text-[#1E293B] uppercase tracking-wider">Select Available Raw Receipt <span className="text-red-500">*</span></label>
                <select className="w-full bg-white border border-slate-200 focus:border-[#4338CA] focus:ring-1 focus:ring-[#4338CA] rounded-lg p-3 text-[13px] text-slate-500 transition-all outline-none shadow-sm">
                  <option>-- SELECT RECEIPT --</option>
                </select>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-red-600 uppercase tracking-wider">Production Date <span className="text-red-500">*</span></label>
                  <input type="date" className="w-full bg-white border border-slate-200 focus:border-[#4338CA] focus:ring-1 focus:ring-[#4338CA] rounded-lg p-3 text-[13px] text-slate-700 transition-all outline-none" defaultValue="2026-09-08" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-red-600 uppercase tracking-wider">Consumed Quantity (વપરાયેલ જથ્થો) <span className="text-red-500">*</span></label>
                  <input type="text" placeholder="e.g. 1000.00" className="w-full bg-white border border-slate-200 focus:border-[#4338CA] focus:ring-1 focus:ring-[#4338CA] rounded-lg p-3 text-[13px] text-slate-700 transition-all outline-none" />
                  <p className="text-[11px] text-red-500 mt-1 font-medium">જેટલો રૉ માલ વપરાયો</p>
                </div>
              </div>
            </div>
          </div>

          <hr className="border-slate-100 mb-8" />

          {/* Section 2: Output */}
          <div className="mb-10">
            <div className="flex items-center gap-2 mb-6">
              <span className="w-5 h-5 rounded-full bg-[#10B981]/20 text-[#10B981] text-[10px] font-bold flex items-center justify-center">2</span>
              <h2 className="text-[13px] font-black text-[#10B981] uppercase tracking-wide">Output (Finish Goods)</h2>
            </div>
            
            <div className="pl-7 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-[#10B981] uppercase tracking-wider">Make Item Name <span className="text-red-500">*</span></label>
                  <input type="text" placeholder="SEARCH AND SELECT FINISH GOOD..." className="w-full bg-white border border-[#10B981]/30 focus:border-[#10B981] focus:ring-1 focus:ring-[#10B981] rounded-lg p-3 text-[13px] text-slate-700 transition-all outline-none" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-[#10B981] uppercase tracking-wider">Produced Quantity (તૈયાર માલ) <span className="text-red-500">*</span></label>
                  <input type="text" placeholder="e.g. 980.00" className="w-full bg-[#10B981]/5 border border-[#10B981]/30 focus:border-[#10B981] focus:ring-1 focus:ring-[#10B981] rounded-lg p-3 text-[13px] text-[#10B981] font-bold transition-all outline-none" />
                  <p className="text-[11px] text-[#10B981] mt-1 font-medium">જેટલો તૈયાર માલ બન્યો</p>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Scrap Quantity (સ્ક્રેપ)</label>
                  <input type="text" placeholder="e.g. 20.00" className="w-full bg-slate-50 border border-slate-200 focus:border-[#4338CA] focus:ring-1 focus:ring-[#4338CA] rounded-lg p-3 text-[13px] text-slate-700 transition-all outline-none" />
                  <p className="text-[11px] text-slate-400 mt-1 font-medium">જેટલો માલ વેસ્ટ ગયો</p>
                </div>
              </div>
              
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Remarks</label>
                <input type="text" placeholder="Optional production remarks or batch identifiers..." className="w-full bg-slate-50 border border-slate-200 focus:border-[#4338CA] focus:ring-1 focus:ring-[#4338CA] rounded-lg p-3 text-[13px] text-slate-700 transition-all outline-none" />
              </div>
            </div>
          </div>
          
        </div>
        
        <div className="bg-slate-50 p-6 flex justify-end border-t border-slate-200/60">
          <button className="bg-[#10B981] hover:bg-[#059669] text-white px-8 py-3 rounded-lg text-[13px] font-bold uppercase tracking-wider flex items-center gap-2 shadow-sm shadow-[#10B981]/30 transition-colors">
            <Save className="w-4 h-4" /> Process Conversion
          </button>
        </div>

      </div>
    </div>
  );
};
