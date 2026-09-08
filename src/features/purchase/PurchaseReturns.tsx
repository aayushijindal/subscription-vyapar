import React, { useState } from 'react';
import { Plus, X, Save, Search, ArrowLeft } from 'lucide-react';

export const PurchaseReturnsPage: React.FC = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [items, setItems] = useState([{ id: 1, item_name: '', nos: 0, quantity: 0, rate: 0, amount: 0 }]);

  const handleAddItem = () => setItems([...items, { id: Date.now(), item_name: '', nos: 0, quantity: 0, rate: 0, amount: 0 }]);
  const handleRemoveItem = (id: number) => { if (items.length > 1) setItems(items.filter(item => item.id !== id)); };

  if (!isFormOpen) {
    return (
      <div className="min-h-screen bg-[#F8F9FC] p-4 sm:p-6 lg:p-8 font-sans">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white rounded-2xl shadow-sm border border-slate-200/60 p-5 mb-6">
          <div>
            <h1 className="text-[18px] font-black text-[#1E293B] tracking-tight uppercase">Purchase Returns</h1>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Manage returned purchases</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input type="text" placeholder="Search entries..." className="w-[250px] bg-slate-50 border border-slate-200 focus:border-[#4338CA] focus:bg-white rounded-xl pl-9 pr-4 py-2.5 text-[13px] outline-none transition-all" />
            </div>
            <button onClick={() => setIsFormOpen(true)} className="bg-[#4338CA] hover:bg-[#3730A3] text-white px-5 py-2.5 rounded-xl text-[12px] font-bold uppercase tracking-wider flex items-center gap-2 shadow-sm shadow-indigo-500/20 transition-all">
              <Plus className="w-4 h-4" /> New Return
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden">
          <div className="p-12 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
              <Search className="w-8 h-8 text-slate-300" />
            </div>
            <h3 className="text-[15px] font-black text-slate-700 uppercase tracking-wide">No Returns Found</h3>
            <p className="text-[13px] text-slate-500 mt-1 max-w-sm">You haven't recorded any purchase returns yet. Click "New Return" to get started.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FC] p-4 sm:p-6 lg:p-8 font-sans">
      <div className="flex items-center gap-4 mb-6 bg-white p-4 rounded-2xl shadow-sm border border-slate-200/60">
        <button onClick={() => setIsFormOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-50 text-slate-400 hover:text-[#4338CA] hover:bg-indigo-50 transition-all">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-[16px] font-black text-[#1E293B] tracking-tight uppercase">Create Purchase Return</h1>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden mb-6">
        <div className="p-6 sm:p-8">
          
          {/* Top Grid - Matches Screenshot but prettier */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-x-6 gap-y-5 mb-10">
            {/* Row 1 */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Purchase No. (Auto)</label>
              <input type="text" disabled value="AUTO GENERATED" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-[13px] text-slate-400 font-bold cursor-not-allowed" />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Invoice Number</label>
              <input type="text" placeholder="INV NO." className="w-full bg-slate-50/50 border border-slate-200 focus:bg-white focus:border-[#4338CA] focus:ring-2 focus:ring-[#4338CA]/20 rounded-xl p-3 text-[13px] text-slate-700 transition-all outline-none placeholder:text-slate-300" />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Invoice Date</label>
              <input type="date" className="w-full bg-slate-50/50 border border-slate-200 focus:bg-white focus:border-[#4338CA] focus:ring-2 focus:ring-[#4338CA]/20 rounded-xl p-3 text-[13px] text-slate-700 transition-all outline-none" defaultValue="2026-09-08" />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Vehicle Number</label>
              <input type="text" placeholder="GJ-01-XX-0000" className="w-full bg-slate-50/50 border border-slate-200 focus:bg-white focus:border-[#4338CA] focus:ring-2 focus:ring-[#4338CA]/20 rounded-xl p-3 text-[13px] text-slate-700 transition-all outline-none placeholder:text-slate-300" />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">RCM Purchase</label>
              <select className="w-full bg-slate-50/50 border border-slate-200 focus:bg-white focus:border-[#4338CA] focus:ring-2 focus:ring-[#4338CA]/20 rounded-xl p-3 text-[13px] text-slate-700 transition-all outline-none">
                <option>NO</option>
                <option>YES</option>
              </select>
            </div>

            {/* Row 2 */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Order No.</label>
              <input type="text" placeholder="ORDER NO." className="w-full bg-slate-50/50 border border-slate-200 focus:bg-white focus:border-[#4338CA] focus:ring-2 focus:ring-[#4338CA]/20 rounded-xl p-3 text-[13px] text-slate-700 transition-all outline-none placeholder:text-slate-300" />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Order Date</label>
              <input type="date" className="w-full bg-slate-50/50 border border-slate-200 focus:bg-white focus:border-[#4338CA] focus:ring-2 focus:ring-[#4338CA]/20 rounded-xl p-3 text-[13px] text-slate-400 transition-all outline-none" />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">LR No.</label>
              <input type="text" placeholder="LR NO." className="w-full bg-slate-50/50 border border-slate-200 focus:bg-white focus:border-[#4338CA] focus:ring-2 focus:ring-[#4338CA]/20 rounded-xl p-3 text-[13px] text-slate-700 transition-all outline-none placeholder:text-slate-300" />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">LR Date</label>
              <input type="date" className="w-full bg-slate-50/50 border border-slate-200 focus:bg-white focus:border-[#4338CA] focus:ring-2 focus:ring-[#4338CA]/20 rounded-xl p-3 text-[13px] text-slate-400 transition-all outline-none" />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Desp From</label>
              <input type="text" placeholder="FROM" className="w-full bg-slate-50/50 border border-slate-200 focus:bg-white focus:border-[#4338CA] focus:ring-2 focus:ring-[#4338CA]/20 rounded-xl p-3 text-[13px] text-slate-700 transition-all outline-none placeholder:text-slate-300" />
            </div>

            {/* Row 3 */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Desp To</label>
              <input type="text" placeholder="TO" className="w-full bg-slate-50/50 border border-slate-200 focus:bg-white focus:border-[#4338CA] focus:ring-2 focus:ring-[#4338CA]/20 rounded-xl p-3 text-[13px] text-slate-700 transition-all outline-none placeholder:text-slate-300" />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-[#4338CA] uppercase tracking-wider">Party Name</label>
              <select className="w-full bg-indigo-50/50 border border-indigo-200 focus:bg-white focus:border-[#4338CA] focus:ring-2 focus:ring-[#4338CA]/20 rounded-xl p-3 text-[13px] text-[#4338CA] font-bold transition-all outline-none">
                <option>-- SELECT PARTY --</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Party GSTIN</label>
              <input type="text" placeholder="GSTIN" className="w-full bg-slate-50/50 border border-slate-200 focus:bg-white focus:border-[#4338CA] focus:ring-2 focus:ring-[#4338CA]/20 rounded-xl p-3 text-[13px] text-slate-700 transition-all outline-none placeholder:text-slate-300" />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-[#4338CA] uppercase tracking-wider">Book Name</label>
              <select className="w-full bg-slate-50/50 border border-slate-200 focus:bg-white focus:border-[#4338CA] focus:ring-2 focus:ring-[#4338CA]/20 rounded-xl p-3 text-[13px] text-slate-500 transition-all outline-none">
                <option>-- SELECT BOOK --</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">E-Way Bill No.</label>
              <input type="text" placeholder="E-WAY BILL NO." className="w-full bg-slate-50/50 border border-slate-200 focus:bg-white focus:border-[#4338CA] focus:ring-2 focus:ring-[#4338CA]/20 rounded-xl p-3 text-[13px] text-slate-700 transition-all outline-none placeholder:text-slate-300" />
            </div>

            {/* Row 4 */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Bill Date</label>
              <input type="date" className="w-full bg-slate-50/50 border border-slate-200 focus:bg-white focus:border-[#4338CA] focus:ring-2 focus:ring-[#4338CA]/20 rounded-xl p-3 text-[13px] text-slate-700 transition-all outline-none" defaultValue="2026-09-08" />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-[#4338CA] uppercase tracking-wider">Select Transport</label>
              <select className="w-full bg-slate-50/50 border border-slate-200 focus:bg-white focus:border-[#4338CA] focus:ring-2 focus:ring-[#4338CA]/20 rounded-xl p-3 text-[13px] text-slate-500 transition-all outline-none">
                <option>-- SELECT TRANSPORT --</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Freight</label>
              <input type="text" className="w-full bg-slate-50/50 border border-slate-200 focus:bg-white focus:border-[#4338CA] focus:ring-2 focus:ring-[#4338CA]/20 rounded-xl p-3 text-[13px] text-slate-700 transition-all outline-none" />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Payment</label>
              <input type="text" defaultValue="45 Days" className="w-full bg-slate-50/50 border border-slate-200 focus:bg-white focus:border-[#4338CA] focus:ring-2 focus:ring-[#4338CA]/20 rounded-xl p-3 text-[13px] text-slate-700 transition-all outline-none" />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">LR Weight</label>
              <input type="text" defaultValue="0" className="w-full bg-slate-50/50 border border-slate-200 focus:bg-white focus:border-[#4338CA] focus:ring-2 focus:ring-[#4338CA]/20 rounded-xl p-3 text-[13px] text-slate-700 transition-all outline-none" />
            </div>
          </div>

          <hr className="border-slate-100 mb-8" />

          {/* Dynamic Items Section */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-[13px] font-black text-[#1E293B] tracking-wide uppercase">Purchase Items Listing</h2>
            <button onClick={handleAddItem} className="flex items-center gap-1.5 text-[11px] font-bold text-[#4338CA] hover:text-white hover:bg-[#4338CA] transition-all bg-indigo-50 px-3 py-2 rounded-lg">
              <Plus className="w-3 h-3" /> ADD ROW
            </button>
          </div>

          <div className="border border-slate-200/60 rounded-xl overflow-hidden mb-8">
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
                    <td className="py-3 px-4 text-center font-bold text-[#4338CA]">{idx + 1}</td>
                    <td className="py-3 px-4">
                      <select className="w-full bg-slate-50/50 border border-slate-200 rounded-lg p-2.5 text-[13px] text-slate-600 outline-none focus:border-[#4338CA] focus:bg-white focus:ring-2 focus:ring-[#4338CA]/20 transition-all">
                        <option>-- SELECT ITEM --</option>
                      </select>
                    </td>
                    <td className="py-3 px-4">
                      <input type="number" defaultValue="0" className="w-full bg-slate-50/50 border border-slate-200 rounded-lg p-2.5 text-[13px] text-center text-slate-700 outline-none focus:border-[#4338CA] focus:bg-white focus:ring-2 focus:ring-[#4338CA]/20 transition-all" />
                    </td>
                    <td className="py-3 px-4">
                      <input type="number" defaultValue="0" className="w-full bg-slate-50/50 border border-slate-200 rounded-lg p-2.5 text-[13px] text-center text-slate-700 outline-none focus:border-[#4338CA] focus:bg-white focus:ring-2 focus:ring-[#4338CA]/20 transition-all" />
                    </td>
                    <td className="py-3 px-4">
                      <input type="number" defaultValue="0" className="w-full bg-slate-50/50 border border-slate-200 rounded-lg p-2.5 text-[13px] text-center text-slate-700 outline-none focus:border-[#4338CA] focus:bg-white focus:ring-2 focus:ring-[#4338CA]/20 transition-all" />
                    </td>
                    <td className="py-3 px-4 text-right font-black text-slate-700 text-[13px]">
                      ₹ 0.00
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button onClick={() => handleRemoveItem(item.id)} className="text-slate-300 hover:text-red-500 hover:bg-red-50 p-1.5 rounded-md transition-all">
                        <X className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Summary Section */}
          <div className="flex justify-end">
            <div className="w-full max-w-[400px] border border-slate-200/60 rounded-2xl overflow-hidden shadow-sm">
              <div className="bg-[#F8F9FC] py-4 px-6 border-b border-slate-200/60">
                <h3 className="text-[12px] font-black text-[#1E293B] tracking-wide uppercase">Purchase Bill Summary</h3>
              </div>
              
              <div className="p-6 space-y-4">
                <div className="flex justify-between items-center text-[12px] font-bold text-slate-500 uppercase">
                  <span>Total Taxable (+)</span>
                  <span className="text-slate-800 text-[13px]">₹ 0</span>
                </div>
                
                <div className="flex justify-between items-center text-[12px] font-bold text-slate-500 uppercase">
                  <span>Cash Discount (-)</span>
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <input type="text" defaultValue="0" className="w-16 text-center bg-slate-50/50 border border-slate-200 rounded-lg p-2 text-[12px] text-[#E11D48] font-black outline-none focus:border-[#E11D48] focus:ring-2 focus:ring-[#E11D48]/20 transition-all" />
                      <span className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 font-medium">%</span>
                    </div>
                    <span className="text-[#E11D48] font-black w-12 text-right">- ₹ 0</span>
                  </div>
                </div>

                <div className="flex justify-between items-center text-[12px] font-bold text-slate-500 uppercase">
                  <span>Freight / Other (+)</span>
                  <input type="text" defaultValue="0" className="w-24 text-right bg-slate-50/50 border border-slate-200 rounded-lg p-2 text-[12px] text-slate-700 outline-none focus:border-[#4338CA] focus:ring-2 focus:ring-[#4338CA]/20 transition-all" />
                </div>

                <div className="flex justify-between items-center text-[12px] font-bold text-slate-500 uppercase">
                  <div className="flex items-center gap-2">
                    <span>Loading (+)</span>
                    <span className="bg-[#10B981]/10 text-[#10B981] px-1.5 py-0.5 rounded text-[9px] font-black tracking-wider border border-[#10B981]/20">AUTO</span>
                  </div>
                  <input type="text" defaultValue="0" className="w-24 text-right bg-slate-50/50 border border-slate-200 rounded-lg p-2 text-[12px] text-slate-700 outline-none focus:border-[#4338CA] focus:ring-2 focus:ring-[#4338CA]/20 transition-all" />
                </div>

                <div className="flex justify-between items-center text-[12px] font-bold text-slate-500 uppercase pt-3 border-t border-slate-100">
                  <span>CGST (0%) (+)</span>
                  <span className="text-slate-800 text-[13px]">₹ 0</span>
                </div>
                <div className="flex justify-between items-center text-[12px] font-bold text-slate-500 uppercase">
                  <span>SGST (0%) (+)</span>
                  <span className="text-slate-800 text-[13px]">₹ 0</span>
                </div>

                <div className="flex justify-between items-center text-[12px] font-bold text-slate-500 uppercase pt-3 border-t border-slate-100">
                  <span>TDS (-)</span>
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <input type="text" defaultValue="0" className="w-16 text-center bg-slate-50/50 border border-slate-200 rounded-lg p-2 text-[12px] text-[#E11D48] font-black outline-none focus:border-[#E11D48] focus:ring-2 focus:ring-[#E11D48]/20 transition-all" />
                      <span className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 font-medium">%</span>
                    </div>
                    <input type="text" defaultValue="0" className="w-24 text-right bg-slate-50/50 border border-slate-200 rounded-lg p-2 text-[12px] text-slate-700 outline-none focus:border-[#4338CA] focus:ring-2 focus:ring-[#4338CA]/20 transition-all" />
                  </div>
                </div>

                <div className="flex justify-between items-center text-[12px] font-bold text-slate-500 uppercase pt-3 border-t border-slate-100">
                  <span>Gross Amount</span>
                  <span className="text-slate-800 text-[13px]">₹ 0.00</span>
                </div>

                <div className="flex justify-between items-center text-[12px] font-bold text-slate-500 uppercase">
                  <span>Round Off (+/-)</span>
                  <span className="text-slate-800 text-[13px]">₹ 0.00</span>
                </div>

                <div className="flex justify-between items-center pt-5 mt-2 border-t border-slate-200">
                  <span className="text-[14px] font-black text-[#1E293B] uppercase tracking-wide">Net Payable</span>
                  <span className="text-[20px] font-black text-[#4338CA]">₹ 0</span>
                </div>

                <div className="pt-6 flex items-center justify-end gap-3">
                  <button onClick={() => setIsFormOpen(false)} className="text-[11px] font-bold text-slate-400 hover:text-slate-600 uppercase tracking-wider px-4 py-3 transition-colors">Cancel</button>
                  <button className="bg-[#1E293B] hover:bg-black text-white px-6 py-3.5 rounded-xl text-[12px] font-bold uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-slate-200 transition-all">
                    <Save className="w-4 h-4" /> Post Purchase Bill
                  </button>
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};
