import React, { useEffect, useState } from 'react';
import { purchaseApi } from '../../services/api/purchase';

export const GRNItemsPage: React.FC = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    purchaseApi.getGRNs().then(res => {
      // Assuming the API returns GRNs and we extract items, or we just map GRNs
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
          <h1 className="text-[18px] font-black text-[#1E293B] tracking-tight uppercase">GRN Item Ledger</h1>
          <p className="text-[11px] font-bold text-text-muted uppercase tracking-widest mt-0.5">Line-By-Line View Of All Materials Received</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <input type="text" placeholder="Search challan, party, item..." className="w-[250px] bg-input border border-border focus:border-[#4338CA] focus:bg-surface rounded-lg pl-9 pr-4 py-2.5 text-[12px] outline-none transition-all" />
            <svg className="w-4 h-4 text-text-muted absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
          </div>
        </div>
      </div>

      <div className="bg-surface rounded-xl shadow-sm border border-border/60 overflow-hidden">
        <table className="w-full text-left text-[11px]">
          <thead className="bg-[#0F172A] text-white font-bold uppercase tracking-wider">
            <tr>
              <th className="py-4 px-5">Challan No.</th>
              <th className="py-4 px-5">Purchase Bill No.</th>
              <th className="py-4 px-5">Date</th>
              <th className="py-4 px-5">Supplier / Party Name</th>
              <th className="py-4 px-5">Raw Item (GRN)</th>
              <th className="py-4 px-5 text-center">Size</th>
              <th className="py-4 px-5 text-right">Quantity</th>
              <th className="py-4 px-5 text-right">Vehicle No.</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {loading ? (
              <tr><td colSpan={8} className="py-8 text-center text-text-secondary">Loading data...</td></tr>
            ) : data.length === 0 ? (
              <tr><td colSpan={8} className="py-8 text-center text-text-secondary">No GRN items found.</td></tr>
            ) : (
              data.flatMap((grn: any) => 
                (grn.items || []).map((item: any, idx: number) => (
                  <tr key={`${grn.id}-${idx}`} className="hover:bg-input/50 transition-colors">
                    <td className="py-4 px-5 text-text-secondary uppercase">{grn.grn_no || `GRN-${grn.id}`}</td>
                    <td className="py-4 px-5 font-bold text-[#1E293B]">{grn.purchase_no || '--'}</td>
                    <td className="py-4 px-5 text-text-secondary">{grn.date || '--'}</td>
                    <td className="py-4 px-5 font-bold text-[#1E293B]">{grn.party_name || '--'}</td>
                    <td className="py-4 px-5 font-bold text-[#E11D48] uppercase">{item.item_name || 'ITEM'}</td>
                    <td className="py-4 px-5 text-center text-text-muted">---</td>
                    <td className="py-4 px-5 text-right font-black text-[#E11D48]">{item.quantity || '0.00'}</td>
                    <td className="py-4 px-5 text-right text-[10px] text-text-muted font-medium">{grn.vehicle_no || '--'}</td>
                  </tr>
                ))
              )
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
};
