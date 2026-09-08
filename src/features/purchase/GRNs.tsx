import { useState, useEffect } from 'react';
import { Plus, Search, X, Save } from 'lucide-react';
import { purchaseApi } from '@/services/api/purchase';

export const GRNsPage = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);

  const [purchasesList, setPurchasesList] = useState<any[]>([]);
  const [parties, setParties] = useState<any[]>([]);
  const [itemsList, setItemsList] = useState<any[]>([]);
    const [items, setItems] = useState([{ id: 1, item_name: '', nos: 0, quantity: 0, rate: 0, amount: 0 }]);

  const handleAddItem = () => {
    setItems([...items, { id: Date.now(), item_name: '', nos: 0, quantity: 0, rate: 0, amount: 0 }]);
  };

  const handleRemoveItem = (id: number) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id));
    }
  };


  useEffect(() => {
    purchaseApi.getPurchases().then(res => setPurchasesList(res.data?.results || res.data || [])).catch(console.error);
    purchaseApi.getAccounts().then(res => setParties(res.data?.results || res.data || [])).catch(console.error);
    purchaseApi.getItems('RAW').then(res => setItemsList(res.data?.results || res.data || [])).catch(console.error);
  }, []);

  if (!isFormOpen) {
    return (
      <div className="min-h-screen bg-[#F8F9FC] p-4 sm:p-6 lg:p-8 font-sans">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white rounded-2xl shadow-sm border border-slate-200/60 p-5 mb-6">
          <div>
            <h1 className="text-[18px] font-black text-[#1E293B] tracking-tight uppercase">GRN Entries</h1>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Manage goods receipt notes</p>
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
      <div className="flex justify-between items-center bg-white rounded-xl shadow-sm border border-slate-200/60 p-4 mb-6">
        <div className="flex items-center gap-3">
          <button onClick={() => setIsFormOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
          </button>
          <h1 className="text-[18px] font-black text-[#1E293B] tracking-tight uppercase">New GRN Entry</h1>
        </div>
        <div className="text-[10px] font-bold text-red-500 bg-red-50 px-3 py-1.5 rounded-md border border-red-100 uppercase tracking-wider">
          (*) REQUIRED FIELDS
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden mb-6">
        <div className="p-6 sm:p-8">
          
          {/* Top Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6 mb-10">
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-[#1E293B] uppercase tracking-wider">Purchase Bill No</label>
              <select className="w-full bg-white border border-slate-200 focus:border-[#4338CA] focus:ring-1 focus:ring-[#4338CA] rounded-lg p-2.5 text-[13px] text-slate-500 transition-all outline-none"><option value="">SELECT BILL</option>{purchasesList.map((p: any) => <option key={p.id} value={p.id}>{p.invoice_no}</option>)}</select>
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-[#1E293B] uppercase tracking-wider">Challan No <span className="text-red-500">*</span></label>
              <input type="text" placeholder="CHALLAN NO" className="w-full bg-white border border-slate-200 focus:border-[#4338CA] focus:ring-1 focus:ring-[#4338CA] rounded-lg p-2.5 text-[13px] text-slate-700 transition-all outline-none placeholder:text-slate-300" />
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-[#1E293B] uppercase tracking-wider">Date <span className="text-red-500">*</span></label>
              <input type="date" className="w-full bg-white border border-slate-200 focus:border-[#4338CA] focus:ring-1 focus:ring-[#4338CA] rounded-lg p-2.5 text-[13px] text-slate-700 transition-all outline-none" defaultValue="2026-09-08" />
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-[#1E293B] uppercase tracking-wider">Party <span className="text-red-500">*</span></label>
              <select className="w-full bg-white border border-slate-200 focus:border-[#4338CA] focus:ring-1 focus:ring-[#4338CA] rounded-lg p-2.5 text-[13px] text-slate-500 transition-all outline-none"><option value="">SELECT PARTY</option>{parties.map((p: any) => <option key={p.id} value={p.id}>{p.name || p.account_name}</option>)}</select>
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-[#1E293B] uppercase tracking-wider">Vehicle No</label>
              <input type="text" placeholder="GJ-01-XX-0000" className="w-full bg-[#F8F9FC] border border-slate-200 focus:border-[#4338CA] focus:ring-1 focus:ring-[#4338CA] rounded-lg p-2.5 text-[13px] text-slate-700 transition-all outline-none placeholder:text-slate-400" />
            </div>
          </div>

          <hr className="border-slate-100 mb-8" />

          {/* Dynamic Items Section */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-[14px] font-black text-[#1E293B] tracking-wide uppercase">GRN Items</h2>
            <button onClick={handleAddItem} className="flex items-center gap-1.5 text-[11px] font-bold text-slate-600 hover:text-[#4338CA] transition-colors bg-slate-50 px-3 py-1.5 rounded-md border border-slate-200 hover:border-[#4338CA]/30">
              <Plus className="w-3 h-3" /> ADD ROW
            </button>
          </div>

          <div className="border border-slate-200/60 rounded-xl overflow-hidden mb-12">
            <table className="w-full text-left text-[12px]">
              <thead className="bg-[#F8F9FC] text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200/60">
                <tr>
                  <th className="py-3 px-4 w-[50px] text-center">#</th>
                  <th className="py-3 px-4">Item Name</th>
                  <th className="py-3 px-4 w-[120px] text-center">Nos</th>
                  <th className="py-3 px-4 w-[120px] text-center">Quantity</th>
                  <th className="py-3 px-4 w-[120px] text-center">Rate</th>
                  <th className="py-3 px-4 w-[140px] text-right">Amount</th>
                  <th className="py-3 px-4 w-[50px]"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {items.map((item, idx) => (
                  <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3 px-4 text-center font-medium text-[#4338CA]">{idx + 1}</td>
                    <td className="py-3 px-4">
                      <select className="w-full bg-white border border-slate-200 rounded-md p-2 text-[13px] text-slate-500 outline-none focus:border-[#4338CA]"><option value="">-- SELECT ITEM --</option>{itemsList.map((i: any) => <option key={i.id} value={i.id}>{i.item_name || i.name}</option>)}</select>
                    </td>
                    <td className="py-3 px-4">
                      <input type="number" className="w-full bg-white border border-slate-200 rounded-md p-2 text-[13px] text-center text-slate-700 outline-none focus:border-[#4338CA]" />
                    </td>
                    <td className="py-3 px-4">
                      <input type="number" className="w-full bg-white border border-slate-200 rounded-md p-2 text-[13px] text-center text-slate-700 outline-none focus:border-[#4338CA]" />
                    </td>
                    <td className="py-3 px-4">
                      <input type="number" className="w-full bg-white border border-slate-200 rounded-md p-2 text-[13px] text-center text-slate-700 outline-none focus:border-[#4338CA]" />
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-slate-700">
                      ₹ {(Number(item.quantity) * Number(item.rate)) || 0}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button onClick={() => handleRemoveItem(item.id)} className="text-slate-300 hover:text-red-500 transition-colors">
                        <X className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-end gap-4 pt-6 border-t border-slate-100">
            <button onClick={() => setIsFormOpen(false)} className="text-[12px] font-bold text-slate-500 hover:text-slate-700 uppercase tracking-wider px-4 py-2">
              Cancel
            </button>
            <button className="bg-[#0F172A] hover:bg-black text-white px-8 py-3 rounded-lg text-[12px] font-bold uppercase tracking-wider flex items-center gap-2 shadow-sm transition-colors">
              <Save className="w-4 h-4" /> Save GRN
            </button>
          </div>
          
        </div>
      </div>
    </div>
  );
};
