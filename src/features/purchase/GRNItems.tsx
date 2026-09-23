import React, { useEffect, useState, useMemo } from 'react';
import { purchaseApi } from '../../services/api/purchase';
import { Table } from '../../components/ui/Table';

export const GRNItemsPage: React.FC = () => {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    purchaseApi.getGRNs().then(res => {
      // Assuming the API returns GRNs and we extract items, or we just map GRNs
      setData(res.data?.results || res.data || []);
    }).catch(err => {
      console.error(err);
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
        <Table 
          data={useMemo(() => data.flatMap((grn: any) => (grn.items || []).map((item: any, idx: number) => ({ ...grn, item, _id: `${grn.id}-${idx}` }))), [data])} 
          rowKey={(row: any) => row._id}
          columns={[
            {
              key: 'grn_no_display',
              header: 'Challan No.',
              render: (row: any) => <span className="uppercase">{row.grn_no || `GRN-${row.id}`}</span>
            },
            {
              key: 'purchase_no',
              header: 'Purchase Bill No.',
              render: (row: any) => <span className="font-bold text-[#1E293B]">{row.purchase_no || '--'}</span>
            },
            {
              key: 'date',
              header: 'Date',
              render: (row: any) => row.date || '--'
            },
            {
              key: 'party_name',
              header: 'Supplier / Party Name',
              render: (row: any) => <span className="font-bold text-[#1E293B]">{row.party_name || '--'}</span>
            },
            {
              key: 'item_name',
              header: 'Raw Item (GRN)',
              render: (row: any) => <span className="font-bold text-[#E11D48] uppercase">{row.item?.item_name || 'ITEM'}</span>
            },
            {
              key: 'size',
              header: 'Size',
              render: () => <span className="text-text-muted">---</span>
            },
            {
              key: 'quantity',
              header: 'Quantity',
              render: (row: any) => <span className="font-black text-[#E11D48]">{row.item?.quantity || '0.00'}</span>
            },
            {
              key: 'vehicle_no',
              header: 'Vehicle No.',
              render: (row: any) => <span className="text-[10px] text-text-muted font-medium">{row.vehicle_no || '--'}</span>
            }
          ]}
          exportFilename="GRN_Item_Ledger" 
          searchKey="party_name" 
          searchPlaceholder="Search Party..." 
        />
      </div>

    </div>
  );
};
