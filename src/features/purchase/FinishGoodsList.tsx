import React, { useEffect, useState } from 'react';
import { purchaseApi } from '../../services/api/purchase';
import { Table } from '../../components/ui/Table';

export const FinishGoodsListPage: React.FC = () => {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    purchaseApi.getFinishGoodsList().then(res => {
      setData(res.data?.results || res.data || []);
    }).catch(err => {
      console.error(err);
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
        <Table 
          data={data}
          columns={[
            {
              key: 'date',
              header: 'Date',
              render: (item: any) => (
                <div>
                  <div className="font-bold text-[#1E293B]">{item.date || '--'}</div>
                  <div className="text-[10px] text-text-muted mt-0.5">{item.id ? `FG/${item.id}` : '--'}</div>
                </div>
              )
            },
            {
              key: 'party_name',
              header: 'Party & Bill Details',
              render: (item: any) => (
                <div>
                  <div className="font-bold text-[#1E293B]">{item.party_name || '--'}</div>
                  <div className="text-[10px] text-text-muted mt-0.5 uppercase">BILL: {item.bill_no || '--'}</div>
                </div>
              )
            },
            {
              key: 'raw_item_name',
              header: 'Raw Consumed',
              render: (item: any) => <span className="font-bold text-[#E11D48] uppercase">{item.raw_item_name || 'RAW ITEM'}</span>
            },
            {
              key: 'raw_quantity',
              header: 'Qty (Raw)',
              render: (item: any) => <span className="font-black text-[#E11D48]">{item.raw_quantity || '0'}</span>
            },
            {
              key: 'make_item_name',
              header: 'Finish Produced',
              render: (item: any) => <span className="font-bold text-[#10B981] uppercase">{item.make_item_name || 'FINISH ITEM'}</span>
            },
            {
              key: 'make_quantity',
              header: 'Qty (Finish)',
              render: (item: any) => <span className="font-black text-[#10B981]">{item.make_quantity || '0'}</span>
            },
            {
              key: 'scrap_quantity',
              header: 'Scrap',
              render: (item: any) => <span className="font-black text-[#EA580C]">{item.scrap_quantity || '0'}</span>
            },
            {
              key: 'remarks',
              header: 'Remarks',
              render: (item: any) => item.remarks || '--'
            }
          ]}
          exportFilename="Finish_Goods_List" 
          searchKey="remarks" 
          searchPlaceholder="Search Remarks..." 
        />
      </div>

    </div>
  );
};
