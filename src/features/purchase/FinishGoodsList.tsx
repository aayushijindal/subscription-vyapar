import React, { useEffect, useState } from 'react';
import { purchaseApi } from '../../services/api/purchase';

export const FinishGoodsListPage: React.FC = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    purchaseApi.getFinishGoodsList().then(res => {
      setData(res.data?.results || res.data || []);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, []);
  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 lg:p-8 font-sans">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-surface rounded-xl shadow-sm border border-border/60 p-5 mb-6">
        <div>
          <h1 className="text-[18px] font-black text-[#1E293B] tracking-tight uppercase">Finish Goods List</h1>
          <p className="text-[11px] font-bold text-text-muted uppercase tracking-widest mt-0.5">Manufacturing Ledger Entries</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <input type="text" placeholder="Search item or remarks..." className="w-[250px] bg-input border border-border focus:border-[#4338CA] focus:bg-surface rounded-lg pl-9 pr-4 py-2.5 text-[12px] outline-none transition-all" />
            <svg className="w-4 h-4 text-text-muted absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
          </div>
          <button className="bg-[#0F172A] hover:bg-black text-white px-5 py-2.5 rounded-lg text-[11px] font-bold uppercase tracking-wider flex items-center gap-2 shadow-sm transition-colors">
            <span className="text-lg leading-none mb-0.5">+</span> New Entry
          </button>
        </div>
      </div>

      <div className="bg-surface rounded-xl shadow-sm border border-border/60 overflow-hidden">
        <table className="w-full text-left text-[11px]">
          <thead className="bg-background text-text-secondary font-bold uppercase tracking-wider border-b border-border/60">
            <tr>
              <th className="py-4 px-5 w-[140px]">Date</th>
              <th className="py-4 px-5 w-[180px]">Party & Bill Details</th>
              <th className="py-4 px-5 text-[#E11D48] flex items-center gap-2"><svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg> Raw Consumed</th>
              <th className="py-4 px-5 w-[100px] text-center text-[#E11D48]">Qty</th>
              <th className="py-4 px-5 text-[#10B981] flex items-center gap-2"><svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"></path></svg> Finish Produced</th>
              <th className="py-4 px-5 w-[100px] text-center text-[#10B981]">Qty</th>
              <th className="py-4 px-5 w-[100px] text-center text-[#EA580C]">Scrap</th>
              <th className="py-4 px-5 w-[250px]">Remarks</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {loading ? (
              <tr><td colSpan={8} className="py-8 text-center text-text-secondary">Loading data...</td></tr>
            ) : data.length === 0 ? (
              <tr><td colSpan={8} className="py-8 text-center text-text-secondary">No finish goods entries found.</td></tr>
            ) : (
              data.map((item: any, i: number) => (
                <tr key={item.id || i} className="hover:bg-input/50 transition-colors">
                  <td className="py-4 px-5">
                    <div className="font-bold text-[#1E293B]">{item.date || '--'}</div>
                    <div className="text-[10px] text-text-muted mt-0.5">{item.id ? `FG/${item.id}` : '--'}</div>
                  </td>
                  <td className="py-4 px-5">
                    <div className="font-bold text-[#1E293B]">{item.party_name || '--'}</div>
                    <div className="text-[10px] text-text-muted mt-0.5 uppercase">BILL: {item.bill_no || '--'}</div>
                  </td>
                  <td className="py-4 px-5 font-bold text-[#E11D48] uppercase">{item.raw_item_name || 'RAW ITEM'}</td>
                  <td className="py-4 px-5 text-center font-black text-[#E11D48]">{item.raw_quantity || '0'}</td>
                  <td className="py-4 px-5 font-bold text-[#10B981] uppercase">{item.make_item_name || 'FINISH ITEM'}</td>
                  <td className="py-4 px-5 text-center font-black text-[#10B981]">{item.make_quantity || '0'}</td>
                  <td className="py-4 px-5 text-center font-black text-[#EA580C]">{item.scrap_quantity || '0'}</td>
                  <td className="py-4 px-5 text-text-secondary">{item.remarks || '--'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
};
