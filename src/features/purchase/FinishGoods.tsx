import { useState, useEffect } from 'react';
import { Plus, Search, Save, Pencil, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { purchaseApi } from '../../services/api/purchase';

export const FinishGoodsPage = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [finishGoodsList, setFinishGoodsList] = useState<any[]>([]);
  const [rawReceipts, setRawReceipts] = useState<any[]>([]);
  const [items, setItems] = useState<any[]>([]);

  // Form State
  const [rawReceiptId, setRawReceiptId] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [rawQuantity, setRawQuantity] = useState('');
  const [makeItemId, setMakeItemId] = useState('');
  const [makeQuantity, setMakeQuantity] = useState('');
  const [scrapQuantity, setScrapQuantity] = useState('');
  const [remarks, setRemarks] = useState('');

  const fetchData = async () => {
    try {
      const [fgRes, rrRes, itemsRes] = await Promise.all([
        purchaseApi.getFinishGoodsList(),
        purchaseApi.getAvailableRawReceipts(),
        purchaseApi.getItems('FINISH') // or any if not strictly typed
      ]);
      setFinishGoodsList(fgRes.data?.results || fgRes.data || []);
      setRawReceipts(rrRes.data || []);
      setItems(itemsRes.data?.results || itemsRes.data || []);
    } catch (err) {
      console.error(err);
      toast.error('Error fetching data');
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react/set-state-in-effect
    void fetchData();
  }, []);

  // Also fetch all items if FINISH isn't enough, just to be safe
  useEffect(() => {
    purchaseApi.getItems().then(res => setItems(res.data?.results || res.data || [])).catch(console.error);
  }, []);

  const handleRawReceiptChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value;
    setRawReceiptId(selectedId);
    if (selectedId) {
      const selectedReceipt = rawReceipts.find(rr => rr.id == selectedId);
      if (selectedReceipt) {
        setRawQuantity(selectedReceipt.remaining_quantity?.toString() || '');
        setMakeQuantity('');
        setScrapQuantity('');
      }
    } else {
      setRawQuantity('');
      setMakeQuantity('');
      setScrapQuantity('');
    }
  };

  const handleMakeQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setMakeQuantity(val);
    
    const consumed = Number(rawQuantity) || 0;
    const produced = Number(val) || 0;
    
    if (produced > consumed) {
      toast.error('Produced quantity cannot exceed consumed quantity.');
      setScrapQuantity('0');
    } else {
      setScrapQuantity(val === '' ? '' : (consumed - produced).toString());
    }
  };

  const handleNewEntry = () => {
    setEditingId(null);
    setRawReceiptId('');
    setDate(new Date().toISOString().split('T')[0]);
    setRawQuantity('');
    setMakeItemId('');
    setMakeQuantity('');
    setScrapQuantity('');
    setRemarks('');
    setIsFormOpen(true);
  };

  const handleEdit = async (id: number) => {
    try {
      const res = await purchaseApi.getFinishGoods(id);
      const fg = res.data;
      setEditingId(id);
      setRawReceiptId(fg.raw_receipt || '');
      setDate(fg.date || '');
      setRawQuantity(fg.raw_quantity || '');
      setMakeItemId(fg.make_item || '');
      setMakeQuantity(fg.make_quantity || '');
      setScrapQuantity(fg.scrap_quantity || '');
      setRemarks(fg.remarks || '');
      setIsFormOpen(true);
    } catch (err) {
      console.error(err);
      toast.error('Error fetching Finish Goods details');
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this entry?')) {
      try {
        await purchaseApi.deleteFinishGoods(id);
        toast.success('Finish Goods deleted successfully');
        fetchData();
      } catch (err) {
        console.error(err);
        toast.error('Error deleting Finish Goods');
      }
    }
  };

  const handleSubmit = async () => {
    // 1. Core Validations
    if (!rawReceiptId) return toast.error('Raw material receipt is required.');
    if (!date) return toast.error('Production date is required.');
    if (!makeItemId) return toast.error('Finished good item is required.');

    const consumed = Number(rawQuantity);
    const produced = Number(makeQuantity);
    const scrap = Number(scrapQuantity) || 0;

    if (consumed <= 0) return toast.error('Consumed quantity must be greater than 0.');
    if (produced <= 0) return toast.error('Produced quantity must be greater than 0.');
    if (produced > consumed) return toast.error('Produced quantity cannot be greater than consumed quantity.');
    if (scrap < 0) return toast.error('Scrap quantity cannot be negative.');

    // 2. Inventory Check
    const selectedReceipt = rawReceipts.find(rr => rr.id == rawReceiptId);
    if (!editingId && selectedReceipt) {
      // NOTE: We rely on the backend for atomic lock, but do a preliminary frontend check
      if (consumed > Number(selectedReceipt.remaining_quantity)) {
        return toast.error(`Insufficient raw material. Only ${selectedReceipt.remaining_quantity} available.`);
      }
    }

    try {
      const payload = {
        raw_receipt: rawReceiptId || null,
        date: date,
        raw_quantity: consumed,
        make_item: makeItemId || null,
        make_quantity: produced,
        scrap_quantity: scrap,
        remarks: remarks
      };

      if (editingId) {
        await purchaseApi.updateFinishGoods(editingId, payload);
        toast.success('Production entry updated successfully');
      } else {
        await purchaseApi.createFinishGoods(payload);
        toast.success('Production entry recorded successfully');
      }
      setIsFormOpen(false);
      fetchData();
    } catch (err: any) {
      console.error(err);
      toast.error(err?.response?.data?.error || err?.response?.data?.details?.non_field_errors?.[0] || 'Error recording production transaction');
    }
  };

  if (!isFormOpen) {
    return (
      <div className="min-h-screen bg-[#F8F9FC] p-4 sm:p-6 lg:p-8 font-sans">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white rounded-2xl shadow-sm border border-slate-200/60 p-5 mb-6">
          <div>
            <h1 className="text-[18px] font-black text-[#12213b] tracking-tight uppercase">Finish Goods List</h1>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Manage Production Entries</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input type="text" placeholder="Search entries..." className="w-[250px] bg-slate-50 border border-slate-200 focus:border-[#2b5f9d] focus:bg-white rounded-xl pl-9 pr-4 py-2.5 text-[13px] outline-none transition-all" />
            </div>
            <button onClick={handleNewEntry} className="bg-[#4338CA] hover:bg-[#3730A3] text-white px-5 py-2.5 rounded-xl text-[12px] font-bold uppercase tracking-wider flex items-center gap-2 shadow-sm shadow-indigo-500/20 transition-all">
              <Plus className="w-4 h-4" /> New Entry
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden">
          {finishGoodsList.length === 0 ? (
            <div className="p-12 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                <Search className="w-8 h-8 text-slate-300" />
              </div>
              <h3 className="text-[15px] font-black text-slate-700 uppercase tracking-wide">No Entries Found</h3>
              <p className="text-[13px] text-slate-500 mt-1 max-w-sm">You haven't recorded any entries yet. Click "New Entry" to get started.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-[11px] font-bold">
                <thead className="bg-[#F8F9FC] text-slate-500 uppercase tracking-wider border-b border-slate-200/60">
                  <tr>
                    <th className="py-4 px-4 w-[40px] text-center"><input type="checkbox" className="rounded border-slate-300" /></th>
                    <th className="py-4 px-4">DATE</th>
                    <th className="py-4 px-4">ENTRY NO</th>
                    <th className="py-4 px-4">RAW ITEM</th>
                    <th className="py-4 px-4">MAKE ITEM</th>
                    <th className="py-4 px-4 text-center">ACTIONS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {finishGoodsList.map((fg) => {
                    const dateStr = fg.date ? new Date(fg.date).toLocaleDateString('en-GB').replace(/\//g, '-') : '-';
                    return (
                      <tr key={fg.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-4 px-4 text-center"><input type="checkbox" className="rounded border-slate-300" /></td>
                        <td className="py-4 px-4 text-slate-500">{dateStr}</td>
                        <td className="py-4 px-4 font-bold text-[#4338CA]">{fg.entry_no || '-'}</td>
                        <td className="py-4 px-4 text-[#12213b]">{fg.raw_item_name || '-'} ({fg.raw_quantity || 0})</td>
                        <td className="py-4 px-4 text-[#12213b] uppercase">{fg.make_item_name || '-'} ({fg.make_quantity || 0})</td>
                        <td className="py-4 px-4 text-center">
                          <div className="flex justify-center items-center gap-2">
                            <button onClick={() => handleEdit(fg.id)} className="text-blue-500 hover:text-blue-600 bg-blue-50 p-1.5 rounded transition-colors"><Pencil className="w-3.5 h-3.5" /></button>
                            <button onClick={() => handleDelete(fg.id)} className="text-red-500 hover:text-red-600 bg-red-50 p-1.5 rounded transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FC] p-4 sm:p-6 lg:p-8 font-sans">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button onClick={() => setIsFormOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
          </button>
          <div className="w-10 h-10 bg-[#10B981]/10 rounded-lg flex items-center justify-center text-[#10B981]">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
          </div>
          <div>
            <h1 className="text-[16px] font-black text-[#12213b] tracking-tight uppercase">{editingId ? 'Edit Finish Goods' : 'Finish Goods Entry'}</h1>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Record Production From Raw Receipts</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden mb-6">
        <div className="p-8">
          
          {/* Section 1: Source */}
          <div className="mb-10">
            <div className="flex items-center gap-2 mb-6">
              <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-bold flex items-center justify-center">1</span>
              <h2 className="text-[13px] font-black text-[#12213b] uppercase tracking-wide">Source (Raw Material)</h2>
            </div>
            
            <div className="pl-7 space-y-6">
              <div className="space-y-1.5 w-full">
                <label className="text-[11px] font-bold text-[#12213b] uppercase tracking-wider">Select Available Raw Receipt <span className="text-red-500">*</span></label>
                <select value={rawReceiptId} onChange={handleRawReceiptChange} className="w-full bg-white border border-slate-200 focus:border-[#2b5f9d] focus:ring-1 focus:ring-[#2b5f9d] rounded-lg p-3 text-[13px] text-slate-500 transition-all outline-none shadow-sm">
                  <option value="">-- SELECT RECEIPT --</option>
                  {rawReceipts.map(rr => (
                    <option key={rr.id} value={rr.id}>{rr.grn_no} - {rr.raw_item_name} (Remaining: {rr.remaining_quantity})</option>
                  ))}
                  {editingId && rawReceiptId && !rawReceipts.find(rr => rr.id == rawReceiptId) && (
                    <option value={rawReceiptId}>Receipt #{rawReceiptId}</option>
                  )}
                </select>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-red-600 uppercase tracking-wider">Production Date <span className="text-red-500">*</span></label>
                  <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full bg-white border border-slate-200 focus:border-[#2b5f9d] focus:ring-1 focus:ring-[#2b5f9d] rounded-lg p-3 text-[13px] text-slate-700 transition-all outline-none" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-red-600 uppercase tracking-wider">Consumed Quantity <span className="text-red-500">*</span></label>
                  <input type="number" value={rawQuantity} disabled className="w-full bg-slate-100 border border-slate-200 rounded-lg p-3 text-[13px] text-slate-500 cursor-not-allowed outline-none" placeholder="Auto-filled" />
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
                  <select value={makeItemId} onChange={(e) => setMakeItemId(e.target.value)} className="w-full bg-white border border-[#10B981]/30 focus:border-[#10B981] focus:ring-1 focus:ring-[#10B981] rounded-lg p-3 text-[13px] text-slate-500 transition-all outline-none">
                    <option value="">-- SELECT FINISH GOOD --</option>
                    {items.map(i => (
                      <option key={i.id} value={i.id}>{i.item_name || i.name}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-[#10B981] uppercase tracking-wider">Produced Quantity <span className="text-red-500">*</span></label>
                  <input type="number" value={makeQuantity} onChange={handleMakeQuantityChange} placeholder="e.g. 980.00" className="w-full bg-[#10B981]/5 border border-[#10B981]/30 focus:border-[#10B981] focus:ring-1 focus:ring-[#10B981] rounded-lg p-3 text-[13px] text-[#10B981] font-bold transition-all outline-none" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Scrap Quantity</label>
                  <input type="number" value={scrapQuantity} disabled className="w-full bg-slate-100 border border-slate-200 rounded-lg p-3 text-[13px] text-slate-500 cursor-not-allowed outline-none" placeholder="Auto-calculated" />
                </div>
              </div>
              
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Remarks</label>
                <input type="text" value={remarks} onChange={(e) => setRemarks(e.target.value)} placeholder="Optional production remarks or batch identifiers..." className="w-full bg-slate-50 border border-slate-200 focus:border-[#2b5f9d] focus:ring-1 focus:ring-[#2b5f9d] rounded-lg p-3 text-[13px] text-slate-700 transition-all outline-none" />
              </div>

              {rawQuantity && makeQuantity && Number(makeQuantity) <= Number(rawQuantity) && (
                <div className="mt-4 bg-slate-50 border border-slate-200 rounded-lg p-4 font-mono text-[13px] text-slate-600 max-w-sm">
                  <div className="flex justify-between py-1"><span>Consumed:</span> <span>{rawQuantity}</span></div>
                  <div className="flex justify-between py-1"><span>Produced:</span> <span>{makeQuantity}</span></div>
                  <div className="flex justify-between py-1 border-t border-slate-200 mt-1 font-bold text-slate-800"><span>Scrap:</span> <span>{scrapQuantity}</span></div>
                </div>
              )}
            </div>
          </div>
          
        </div>
        
        <div className="bg-slate-50 p-6 flex justify-end border-t border-slate-200/60">
          <button onClick={handleSubmit} className="bg-[#10B981] hover:bg-[#059669] text-white px-8 py-3 rounded-lg text-[13px] font-bold uppercase tracking-wider flex items-center gap-2 shadow-sm shadow-[#10B981]/30 transition-colors">
            <Save className="w-4 h-4" /> {editingId ? 'Update Conversion' : 'Process Conversion'}
          </button>
        </div>

      </div>
    </div>
  );
};
