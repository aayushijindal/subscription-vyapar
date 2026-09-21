import React, { useState, useEffect } from 'react';
import { Plus, Search, X, Save, Pencil, Trash2, ArrowLeft, Download, Eye } from 'lucide-react';
import toast from 'react-hot-toast';
import { salesApi } from '../../services/api/sales';
import { masterApi } from '../../services/api/master';

export const SalesReturnsPage: React.FC = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [accounts, setAccounts] = useState<any[]>([]);
  const [itemsList, setItemsList] = useState<any[]>([]);
  const [returns, setReturns] = useState<any[]>([]);

  // Form State
  const [editingId, setEditingId] = useState<number | null>(null);
  
  const [invoiceNo, setInvoiceNo] = useState('');
  const [returnDate, setReturnDate] = useState(new Date().toISOString().split('T')[0]);
  const [buyerId, setBuyerId] = useState<number | ''>('');

  // Items State
  const [items, setItems] = useState(() => [{ id: Date.now(), item_id: '', quantity: 0, rate: 0, amount: 0 }]);

  useEffect(() => {
    if (!isFormOpen) {
      salesApi.salesReturn.list().then(res => setReturns(Array.isArray(res) ? res : (res as any).results || [])).catch(console.error);
    }
  }, [isFormOpen]);

  useEffect(() => {
    masterApi.accounts.list().then(res => setAccounts(Array.isArray(res) ? res : (res as any)?.results || [])).catch(console.error);
    masterApi.items.list().then(res => setItemsList(Array.isArray(res) ? res : (res as any)?.results || [])).catch(console.error);
  }, []);

  const handleAddItem = () => {
    setItems([...items, { id: Date.now(), item_id: '', quantity: 0, rate: 0, amount: 0 }]);
  };

  const handleRemoveItem = (id: number) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  const handleItemChange = (id: number, field: string, value: any) => {
    setItems(items.map(item => {
      if (item.id === id) {
        const updated = { ...item, [field]: value };
        if (field === 'quantity' || field === 'rate') {
          const qty = Number(updated.quantity || 0);
          const rate = Number(updated.rate || 0);
          updated.amount = qty * rate;
        }
        return updated;
      }
      return item;
    }));
  };

  const totalTaxable = items.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
  
  const buyerGstin = buyerId ? (accounts.find(a => a.id === buyerId)?.gst_number || accounts.find(a => a.id === buyerId)?.gstin || '') : '';
  const isIntrastate = buyerGstin.startsWith('24');
  const cgstAmount = isIntrastate ? totalTaxable * 0.09 : 0;
  const sgstAmount = isIntrastate ? totalTaxable * 0.09 : 0;
  const igstAmount = !isIntrastate ? totalTaxable * 0.18 : 0;
  
  const grossAmount = totalTaxable + cgstAmount + sgstAmount + igstAmount;
  const netPayable = Math.round(grossAmount);
  const roundOff = netPayable - grossAmount;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!invoiceNo || !returnDate || !buyerId) {
      toast.error('Please fill in all mandatory fields.');
      return;
    }

    try {
      const payload = {
        invoice_no: invoiceNo,
        invoice_date: returnDate,
        buyer: buyerId,
        items: items.map((item: any) => ({
          item: item.item_id,
          quantity: item.quantity,
          rate: item.rate,
          amount: item.amount || 0
        })),
        total_amount: Number(totalTaxable.toFixed(2)),
        cgst_amount: Number(cgstAmount.toFixed(2)),
        sgst_amount: Number(sgstAmount.toFixed(2)),
        igst_amount: Number(igstAmount.toFixed(2)),
        round_off: Number(roundOff.toFixed(2)),
        grand_total: Number(netPayable.toFixed(2))
      };
      
      if (editingId) {
        await salesApi.salesReturn.update(editingId, payload);
        toast.success('Sales Return updated successfully!'); 
      } else {
        await salesApi.salesReturn.create(payload);
        toast.success('Sales Return created successfully!'); 
      }
      
      setIsFormOpen(false);
      setEditingId(null);
    } catch (err) {
      toast.error('Error saving return. Please check mandatory fields.');
      console.error(err);
    }
  };

  const handleEdit = async (id: number) => {
    try {
      const ret = await salesApi.salesReturn.get(id);
      
      setEditingId(id);
      setInvoiceNo(ret.invoice_no || '');
      setReturnDate(ret.date || ret.invoice_date || '');
      setBuyerId(ret.buyer || ret.buyer_id || ret.party_id || '');
      
      if (ret.items && ret.items.length > 0) {
        setItems(ret.items.map((i: any) => ({
          id: i.id || Date.now() + Math.random(),
          item_id: i.item || i.item_id || '',
          quantity: i.quantity || 0,
          rate: i.rate || 0,
          amount: i.amount || i.line_total || 0
        })));
      } else {
        setItems([{ id: 1, item_id: '', quantity: 0, rate: 0, amount: 0 }]);
      }
      
      setIsFormOpen(true);
    } catch {
      toast.error('Error fetching details');
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this return?')) {
      try {
        await salesApi.salesReturn.delete(id);
        setReturns(returns.filter(r => r.id !== id));
        toast.success('Deleted successfully');
      } catch {
        toast.error('Error deleting record');
      }
    }
  };

  const handleNew = () => {
    setEditingId(null);
    setInvoiceNo('');
    setReturnDate(new Date().toISOString().split('T')[0]);
    setBuyerId('');
    setItems([{ id: Date.now(), item_id: '', quantity: 0, rate: 0, amount: 0 }]);
    setIsFormOpen(true);
  };

  if (!isFormOpen) {
    return (
      <div className="min-h-screen bg-background p-4 sm:p-6 lg:p-8 font-sans">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-surface rounded-2xl shadow-sm border border-border/60 p-5 mb-6">
          <div>
            <h1 className="text-[20px] font-black text-text-primary tracking-tight uppercase">SALES RETURN LIST</h1>
            <p className="text-[11px] font-bold text-text-secondary uppercase mt-0.5 tracking-wider">Manage Returns</p>
          </div>
          <div className="flex flex-wrap items-center gap-3 mt-4 sm:mt-0">
            <div className="relative">
              <Search className="w-4 h-4 text-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
              <input type="text" placeholder="Search Invoice..." className="pl-9 pr-4 py-2 bg-input border border-border rounded-lg text-sm focus:outline-none focus:border-primary" />
            </div>
            <button className="bg-primary hover:bg-primary-hover text-white px-4 py-2.5 rounded-xl text-[12px] font-bold flex items-center gap-2 transition-colors">
               <Download className="w-4 h-4" /> Import Excel
            </button>
            <button onClick={handleNew} className="bg-primary hover:bg-primary-hover text-white px-5 py-2.5 rounded-xl text-[12px] font-bold flex items-center gap-2 transition-colors">
              <Plus className="w-4 h-4" /> Add New
            </button>
          </div>
        </div>

        <div className="bg-surface rounded-2xl shadow-sm border border-border/60 overflow-x-auto">
          <table className="w-full text-left text-[12px] font-bold">
            <thead className="bg-background text-text-secondary uppercase tracking-wider border-b border-border/60">
              <tr>
                <th className="py-4 px-5 w-[40px] text-center"><input type="checkbox" className="rounded border-border" /></th>
                <th className="py-4 px-5">DATE</th>
                <th className="py-4 px-5">INVOICE NO</th>
                <th className="py-4 px-5">BUYER</th>
                <th className="py-4 px-5">TOTAL</th>
                <th className="py-4 px-5 text-center">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {returns.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-text-secondary font-medium">No sales returns found.</td>
                </tr>
              ) : returns.map((ret: any) => {
                const buyerId = ret.buyer || ret.buyer_id || ret.party_id;
                const partyName = accounts.find(p => p.id === buyerId)?.name || accounts.find(p => p.id === buyerId)?.account_name || 'UNKNOWN';
                const dateStr = ret.date || ret.invoice_date ? new Date(ret.date || ret.invoice_date).toLocaleDateString('en-GB').replace(/\//g, '-') : '-';
                return (
                  <tr key={ret.id} className="hover:bg-input/50 transition-colors">
                    <td className="py-4 px-5 text-center"><input type="checkbox" className="rounded border-border" /></td>
                    <td className="py-4 px-5 text-text-secondary">{dateStr}</td>
                    <td className="py-4 px-5 text-text-primary text-[13px]">{ret.invoice_no || '--'}</td>
                    <td className="py-4 px-5 text-text-primary uppercase">{partyName}</td>
                    <td className="py-4 px-5 text-text-primary">₹ {Number(ret.grand_total || 0).toLocaleString()}</td>
                    <td className="py-4 px-5 text-center">
                      <div className="flex justify-center items-center gap-2">
                        <button onClick={() => handleEdit(ret.id)} className="text-text-muted hover:text-text-secondary p-1.5 rounded border border-border transition-colors"><Eye className="w-3.5 h-3.5" /></button>
                        <button onClick={() => handleEdit(ret.id)} className="text-primary hover:text-primary bg-primary-light p-1.5 rounded border border-primary/20 transition-colors"><Pencil className="w-3.5 h-3.5" /></button>
                        <button onClick={() => handleDelete(ret.id)} className="text-red-500 hover:text-red-600 bg-red-50 p-1.5 rounded border border-red-100 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  const inputClass = "w-full bg-input border border-border focus:border-primary rounded-lg p-2.5 text-[12px] text-text-primary transition-all outline-none";
  const labelClass = "text-[10px] font-bold text-text-secondary uppercase tracking-wider mb-1.5 block";

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 lg:p-8 font-sans pb-20">
      
      <div className="flex items-center justify-between mb-6 bg-surface rounded-2xl shadow-sm border border-border/60 p-4">
        <div className="flex items-center gap-3">
          <button onClick={() => setIsFormOpen(false)} className="text-text-muted hover:text-text-secondary transition-colors ml-2">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-[18px] font-black text-text-primary tracking-tight uppercase">{editingId ? 'EDIT RETURN' : 'NEW RETURN'}</h1>
        </div>
      </div>

      <div className="bg-surface rounded-2xl shadow-sm border border-border/60 p-6 sm:p-8 mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6 mb-8">
          <div>
            <label className={labelClass}>INVOICE NO <span className="text-red-500">*</span></label>
            <input type="text" value={invoiceNo} onChange={e => setInvoiceNo(e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>DATE <span className="text-red-500">*</span></label>
            <input type="date" value={returnDate} onChange={e => setReturnDate(e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>BUYER <span className="text-red-500">*</span></label>
            <select value={buyerId} onChange={e => setBuyerId(Number(e.target.value))} className={inputClass}>
              <option value="">-- SELECT --</option>
              {accounts.map(a => <option key={a.id} value={a.id}>{a.name || a.account_name}</option>)}
            </select>
          </div>
        </div>

        <hr className="border-border/50 mb-8" />

        <div className="flex justify-between items-center mb-4">
          <h2 className="text-[13px] font-black text-text-primary tracking-wide uppercase">ITEMS</h2>
          <button onClick={handleAddItem} className="flex items-center gap-1.5 text-[11px] font-bold text-text-secondary hover:text-primary transition-colors bg-input px-3 py-1.5 rounded-md border border-border hover:border-primary/30">
            <Plus className="w-3 h-3" /> ADD ITEM
          </button>
        </div>

        <div className="border border-border rounded-xl overflow-x-auto mb-8">
          <table className="w-full min-w-[700px] text-left text-[12px]">
            <thead className="bg-background text-text-secondary font-black uppercase tracking-wider border-b border-border">
              <tr>
                <th className="py-3 px-4 w-[5%] text-center rounded-tl-xl">#</th>
                <th className="py-3 px-4 w-[45%]">ITEM NAME</th>
                <th className="py-3 px-4 w-[15%] text-center">QUANTITY</th>
                <th className="py-3 px-4 w-[15%] text-center">RATE</th>
                <th className="py-3 px-4 w-[20%] text-right rounded-tr-xl">LINE TOTAL</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {items.map((item, idx) => (
                <tr key={item.id} className="hover:bg-input/50 transition-colors group relative">
                  <td className="py-3 px-4 text-center text-text-muted font-bold">{idx + 1}</td>
                  <td className="py-3 px-4">
                    <select value={item.item_id} onChange={(e) => handleItemChange(item.id, 'item_id', e.target.value)} className={`${inputClass} !bg-surface`}>
                      <option value="">-- SELECT --</option>
                      {itemsList.map(i => <option key={i.id} value={i.id}>{i.item_name || i.name}</option>)}
                    </select>
                  </td>
                  <td className="py-3 px-4">
                    <input type="number" value={item.quantity || ''} onChange={(e) => handleItemChange(item.id, 'quantity', e.target.value)} className={`${inputClass} !bg-surface text-center`} />
                  </td>
                  <td className="py-3 px-4">
                    <input type="number" value={item.rate || ''} onChange={(e) => handleItemChange(item.id, 'rate', e.target.value)} className={`${inputClass} !bg-surface text-center`} />
                  </td>
                  <td className="py-3 px-4 text-right font-black text-text-primary">
                    ₹ {(Number(item.amount) || 0).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits:2})}
                    <button onClick={() => handleRemoveItem(item.id)} className="absolute right-[-10px] top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 text-slate-300 hover:text-red-500 transition-all p-1 bg-surface border border-border rounded shadow-sm">
                      <X className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Simple Summary Box */}
        <div className="bg-background border border-border rounded-xl p-5 mb-8">
           <div className="flex flex-col gap-3">
              <div className="flex justify-between items-center text-[13px] font-bold text-text-secondary">
                 <span>TOTAL TAXABLE</span>
                 <span className="text-text-primary">₹ {totalTaxable.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
              </div>
              {isIntrastate ? (
                <>
                  <div className="flex justify-between items-center text-[13px] font-bold text-text-secondary">
                     <span>CGST (9%)</span>
                     <span className="text-text-primary">₹ {cgstAmount.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                  </div>
                  <div className="flex justify-between items-center text-[13px] font-bold text-text-secondary">
                     <span>SGST (9%)</span>
                     <span className="text-text-primary">₹ {sgstAmount.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                  </div>
                </>
              ) : (
                <div className="flex justify-between items-center text-[13px] font-bold text-text-secondary">
                   <span>IGST (18%)</span>
                   <span className="text-text-primary">₹ {igstAmount.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                </div>
              )}
              <div className="flex justify-between items-center text-[13px] font-bold text-text-secondary">
                 <span>ROUND OFF (+/-)</span>
                 <span className={roundOff >= 0 ? "text-emerald-500" : "text-red-500"}>{roundOff > 0 ? '+' : ''} ₹ {Math.abs(roundOff).toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-[15px] font-black text-text-primary uppercase tracking-wider mt-2 pt-3 border-t border-border">
                 <span>NET PAYABLE</span>
                 <span className="text-[20px]">₹ {netPayable.toLocaleString()}</span>
              </div>
           </div>
        </div>

        <div className="flex items-center gap-4">
           <button onClick={handleSubmit} className="flex-1 bg-primary hover:bg-primary-hover text-white py-3.5 rounded-lg text-[13px] font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-colors shadow-sm">
              <Save className="w-4 h-4" /> SAVE RETURN
           </button>
           <button onClick={() => setIsFormOpen(false)} className="px-10 bg-surface border border-border hover:bg-input text-text-primary py-3.5 rounded-lg text-[13px] font-black uppercase tracking-wider transition-colors shadow-sm">
              CANCEL
           </button>
        </div>

      </div>
    </div>
  );
};
