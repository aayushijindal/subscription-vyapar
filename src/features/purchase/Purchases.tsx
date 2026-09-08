import React, { useState } from 'react';
import { Plus, Search, X, Save } from 'lucide-react';
import { purchaseApi } from '../../services/api/purchase';
import { useEffect } from 'react';
export const PurchasesPage: React.FC = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [parties, setParties] = useState<any>([]);
  const [itemsList, setItemsList] = useState<any>([]);
  const [transports, setTransports] = useState<any>([]);
  const [purchases, setPurchases] = useState<any[]>([]);

  const [rcmPurchase, setRcmPurchase] = useState('NO');
  const [discountData, setDiscountData] = useState<{type: 'PERCENT' | 'AMOUNT', value: number | ''}>({type: 'PERCENT', value: ''});
  const [freight, setFreight] = useState<number | ''>('');
  const [loading, setLoading] = useState<number | ''>('');
  const [tdsData, setTdsData] = useState<{type: 'PERCENT' | 'AMOUNT', value: number | ''}>({type: 'PERCENT', value: ''});
  
  // Form specific state mapping
  const [editingId, setEditingId] = useState<number | null>(null);
  const [invoiceNo, setInvoiceNo] = useState('');
  const [partyId, setPartyId] = useState<number | ''>('');

  useEffect(() => {
    // Fetch master dropdowns
    purchaseApi.getAccounts().then(res => setParties(res.data)).catch(console.error);
    purchaseApi.getItems('RAW').then(res => setItemsList(res.data)).catch(console.error);
    purchaseApi.getTransports().then(res => setTransports(res.data)).catch(console.error);
  }, []);

  useEffect(() => {
    if (!isFormOpen) {
      // Fetch list
      purchaseApi.getPurchases().then(res => setPurchases(res.data.results || [])).catch(console.error);
    }
  }, [isFormOpen]);

  const [items, setItems] = useState([{ id: 1, item_name: '', nos: 0, quantity: 0, rate: 0, amount: 0 }]);

  const handleAddItem = () => {
    setItems([...items, { id: Date.now(), item_name: '', nos: 0, quantity: 0, rate: 0, amount: 0 }]);
  };

  const handleRemoveItem = (id: number) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  
  const handleItemChange = (id: number, field: string, value: any) => {
    setItems(items.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value };
        if (field === 'quantity' || field === 'rate') {
          updatedItem.amount = Number(updatedItem.quantity || 0) * Number(updatedItem.rate || 0);
        }
        return updatedItem;
      }
      return item;
    }));
  };

  const calculateTotalTaxable = () => {
    return items.reduce((sum, item) => sum + (Number(item.quantity || 0) * Number(item.rate || 0)), 0);
  };

  const totalTaxable = calculateTotalTaxable();
  
  const discountPercentDisplay = discountData.type === 'PERCENT' ? discountData.value : (totalTaxable > 0 ? Number(((Number(discountData.value) || 0) / totalTaxable * 100).toFixed(2)) : '');
  const discountAmountDisplay = discountData.type === 'AMOUNT' ? discountData.value : Number((totalTaxable * (Number(discountData.value) || 0) / 100).toFixed(2));
  const cashDiscountAmount = Number(discountAmountDisplay) || 0;

  const tdsPercentDisplay = tdsData.type === 'PERCENT' ? tdsData.value : (totalTaxable > 0 ? Number(((Number(tdsData.value) || 0) / totalTaxable * 100).toFixed(2)) : '');
  const tdsAmountDisplay = tdsData.type === 'AMOUNT' ? tdsData.value : Number((totalTaxable * (Number(tdsData.value) || 0) / 100).toFixed(2));
  const tdsAmountUsed = Number(tdsAmountDisplay) || 0;

  const taxableAfterDiscount = totalTaxable - cashDiscountAmount;
  const applicableLoading = rcmPurchase === 'YES' ? 0 : (Number(loading) || 0);
  const gstBase = taxableAfterDiscount + (Number(freight) || 0) + applicableLoading;
  
  const cgstAmount = gstBase * 0.09;
  const sgstAmount = gstBase * 0.09;
  
  const grossAmount = taxableAfterDiscount + (Number(freight) || 0) + applicableLoading + cgstAmount + sgstAmount;
  
  const roundedGross = Math.round(grossAmount);
  const roundOff = roundedGross - grossAmount;
  const netPayable = roundedGross - tdsAmountUsed;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        party_id: partyId || 1,
        invoice_no: invoiceNo,
        items: items,
        total_taxable: calculateTotalTaxable()
      };
      
      if (editingId) {
        await purchaseApi.updatePurchase(editingId, payload);
        alert('Purchase updated successfully!'); 
      } else {
        await purchaseApi.createPurchase(payload);
        alert('Purchase created successfully!'); 
      }
      
      setIsFormOpen(false);
      setEditingId(null);
    } catch (err) {
      alert('Error saving purchase. Please check mandatory fields.');
      console.error(err);
    }
  };

  const handleEdit = async (id: number) => {
    try {
      const res = await purchaseApi.getPurchase(id);
      const purchase = res.data;
      
      setEditingId(id);
      setInvoiceNo(purchase.invoice_no || '');
      setPartyId(purchase.party_id || '');
      
      if (purchase.items && purchase.items.length > 0) {
        setItems(purchase.items);
      } else {
        setItems([{ id: new Date().getTime(), item_name: '', nos: 0, quantity: 0, rate: 0, amount: 0 }]);
      }
      
      setIsFormOpen(true);
    } catch (err) {
      console.error(err);
      alert('Error fetching purchase details');
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this purchase entry?')) {
      try {
        await purchaseApi.deletePurchase(id);
        setPurchases(purchases.filter(p => p.id !== id));
      } catch (err) {
        console.error(err);
        alert('Error deleting purchase');
      }
    }
  };

  const handleNewEntry = () => {
    setEditingId(null);
    setInvoiceNo('');
    setPartyId('');
    setItems([{ id: Date.now(), item_name: '', nos: 0, quantity: 0, rate: 0, amount: 0 }]);
    setIsFormOpen(true);
  };

  if (!isFormOpen) {
    return (
      <div className="min-h-screen bg-[#F8F9FC] p-4 sm:p-6 lg:p-8 font-sans">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white rounded-2xl shadow-sm border border-slate-200/60 p-5 mb-6">
          <div>
            <h1 className="text-[18px] font-black text-[#1E293B] tracking-tight uppercase">Purchase Entries</h1>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Manage all purchase bills</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input type="text" placeholder="Search entries..." className="w-[250px] bg-slate-50 border border-slate-200 focus:border-[#4338CA] focus:bg-white rounded-xl pl-9 pr-4 py-2.5 text-[13px] outline-none transition-all" />
            </div>
            <button onClick={handleNewEntry} className="bg-[#4338CA] hover:bg-[#3730A3] text-white px-5 py-2.5 rounded-xl text-[12px] font-bold uppercase tracking-wider flex items-center gap-2 shadow-sm shadow-indigo-500/20 transition-all">
              <Plus className="w-4 h-4" /> New Entry
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden">
          {purchases.length === 0 ? (
            <div className="p-12 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                <Search className="w-8 h-8 text-slate-300" />
              </div>
              <h3 className="text-[15px] font-black text-slate-700 uppercase tracking-wide">No Entries Found</h3>
              <p className="text-[13px] text-slate-500 mt-1 max-w-sm">You haven't recorded any entries yet. Click "New Entry" to get started.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-[12px]">
                <thead className="bg-[#F8F9FC] text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200/60">
                  <tr>
                    <th className="py-3 px-4">Purchase No</th>
                    <th className="py-3 px-4">Invoice No</th>
                    <th className="py-3 px-4">Party ID</th>
                    <th className="py-3 px-4">Total Taxable</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {purchases.map((purchase) => (
                    <tr key={purchase.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-3 px-4 font-medium text-[#1E293B]">{purchase.purchase_no || '-'}</td>
                      <td className="py-3 px-4 text-slate-600">{purchase.invoice_no || '-'}</td>
                      <td className="py-3 px-4 text-slate-600">{purchase.party_id || '-'}</td>
                      <td className="py-3 px-4 font-bold text-slate-700">₹ {purchase.total_taxable || '0.00'}</td>
                      <td className="py-3 px-4 text-right">
                        <button onClick={() => handleEdit(purchase.id)} className="text-[#4338CA] hover:text-[#3730A3] font-bold mr-3 transition-colors uppercase text-[11px] tracking-wider">Edit</button>
                        <button onClick={() => handleDelete(purchase.id)} className="text-red-500 hover:text-red-700 font-bold transition-colors uppercase text-[11px] tracking-wider">Delete</button>
                      </td>
                    </tr>
                  ))}
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
      
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => setIsFormOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
        </button>
        <h1 className="text-[20px] font-black text-[#1E293B] tracking-tight uppercase">{editingId ? 'Edit Purchase Entry' : 'Create Purchase Entry'}</h1>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden mb-6">
        <div className="p-6 sm:p-8">
          
          {/* Top Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-x-6 gap-y-5 mb-10">
            {/* Row 1 */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Purchase No. (Auto)</label>
              <input type="text" disabled value="AUTO GENERATED" className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-[13px] text-slate-400 font-medium cursor-not-allowed" />
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Invoice Number</label>
              <input type="text" value={invoiceNo} onChange={(e) => setInvoiceNo(e.target.value)} placeholder="INV NO." className="w-full bg-white border border-slate-200 focus:border-[#4338CA] focus:ring-1 focus:ring-[#4338CA] rounded-lg p-2.5 text-[13px] text-slate-700 transition-all outline-none placeholder:text-slate-300" />
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Invoice Date</label>
              <input type="date" className="w-full bg-white border border-slate-200 focus:border-[#4338CA] focus:ring-1 focus:ring-[#4338CA] rounded-lg p-2.5 text-[13px] text-slate-700 transition-all outline-none" defaultValue="2026-09-08" />
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Vehicle Number</label>
              <input type="text" placeholder="GJ-01-XX-0000" className="w-full bg-white border border-slate-200 focus:border-[#4338CA] focus:ring-1 focus:ring-[#4338CA] rounded-lg p-2.5 text-[13px] text-slate-700 transition-all outline-none placeholder:text-slate-300" />
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">RCM Purchase</label>
              <select value={rcmPurchase} onChange={(e) => setRcmPurchase(e.target.value)} className="w-full bg-white border border-slate-200 focus:border-[#4338CA] focus:ring-1 focus:ring-[#4338CA] rounded-lg p-2.5 text-[13px] text-slate-700 transition-all outline-none">
                <option>NO</option>
                <option>YES</option>
              </select>
            </div>

            {/* Row 2 */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Order No.</label>
              <input type="text" placeholder="ORDER NO." className="w-full bg-white border border-slate-200 focus:border-[#4338CA] focus:ring-1 focus:ring-[#4338CA] rounded-lg p-2.5 text-[13px] text-slate-700 transition-all outline-none placeholder:text-slate-300" />
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Order Date</label>
              <input type="date" className="w-full bg-white border border-slate-200 focus:border-[#4338CA] focus:ring-1 focus:ring-[#4338CA] rounded-lg p-2.5 text-[13px] text-slate-400 transition-all outline-none" />
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">LR No.</label>
              <input type="text" placeholder="LR NO." className="w-full bg-white border border-slate-200 focus:border-[#4338CA] focus:ring-1 focus:ring-[#4338CA] rounded-lg p-2.5 text-[13px] text-slate-700 transition-all outline-none placeholder:text-slate-300" />
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">LR Date</label>
              <input type="date" className="w-full bg-white border border-slate-200 focus:border-[#4338CA] focus:ring-1 focus:ring-[#4338CA] rounded-lg p-2.5 text-[13px] text-slate-400 transition-all outline-none" />
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Desp From</label>
              <input type="text" placeholder="FROM" className="w-full bg-white border border-slate-200 focus:border-[#4338CA] focus:ring-1 focus:ring-[#4338CA] rounded-lg p-2.5 text-[13px] text-slate-700 transition-all outline-none placeholder:text-slate-300" />
            </div>

            {/* Row 3 */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Desp To</label>
              <input type="text" placeholder="TO" className="w-full bg-white border border-slate-200 focus:border-[#4338CA] focus:ring-1 focus:ring-[#4338CA] rounded-lg p-2.5 text-[13px] text-slate-700 transition-all outline-none placeholder:text-slate-300" />
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-[#2563EB] uppercase tracking-wider">Party Name</label>
              <select value={partyId} onChange={(e) => setPartyId(Number(e.target.value))} className="w-full bg-white border border-slate-200 focus:border-[#4338CA] focus:ring-1 focus:ring-[#4338CA] rounded-lg p-2.5 text-[13px] text-[#2563EB] font-medium transition-all outline-none">
                <option value="">-- SELECT PARTY --</option>
                {(Array.isArray(parties) ? parties : parties?.results || []).map((p: any) => <option key={p.id} value={p.id}>{p.name || p.account_name}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Party GSTIN</label>
              <input type="text" placeholder="GSTIN" className="w-full bg-white border border-slate-200 focus:border-[#4338CA] focus:ring-1 focus:ring-[#4338CA] rounded-lg p-2.5 text-[13px] text-slate-700 transition-all outline-none placeholder:text-slate-300" />
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-[#2563EB] uppercase tracking-wider">Book Name</label>
              <select className="w-full bg-white border border-slate-200 focus:border-[#4338CA] focus:ring-1 focus:ring-[#4338CA] rounded-lg p-2.5 text-[13px] text-slate-400 transition-all outline-none">
                <option value="">-- SELECT BOOK --</option>
                {(Array.isArray(parties) ? parties : parties?.results || []).map((p: any) => <option key={p.id} value={p.id}>{p.name || p.account_name}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">E-Way Bill No.</label>
              <input type="text" placeholder="E-WAY BILL NO." className="w-full bg-white border border-slate-200 focus:border-[#4338CA] focus:ring-1 focus:ring-[#4338CA] rounded-lg p-2.5 text-[13px] text-slate-700 transition-all outline-none placeholder:text-slate-300" />
            </div>

            {/* Row 4 */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Bill Date</label>
              <input type="date" className="w-full bg-white border border-slate-200 focus:border-[#4338CA] focus:ring-1 focus:ring-[#4338CA] rounded-lg p-2.5 text-[13px] text-slate-700 transition-all outline-none" defaultValue="2026-09-08" />
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-[#2563EB] uppercase tracking-wider">Select Transport</label>
              <select className="w-full bg-white border border-slate-200 focus:border-[#4338CA] focus:ring-1 focus:ring-[#4338CA] rounded-lg p-2.5 text-[13px] text-slate-400 transition-all outline-none">
                <option value="">-- SELECT TRANSPORT --</option>
                {(Array.isArray(transports) ? transports : transports?.results || []).map((t: any) => <option key={t.id} value={t.id}>{t.name || t.transport_name}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Freight</label>
              <input type="text" className="w-full bg-white border border-slate-200 focus:border-[#4338CA] focus:ring-1 focus:ring-[#4338CA] rounded-lg p-2.5 text-[13px] text-slate-700 transition-all outline-none" />
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Payment</label>
              <input type="text" defaultValue="45 Days" className="w-full bg-white border border-slate-200 focus:border-[#4338CA] focus:ring-1 focus:ring-[#4338CA] rounded-lg p-2.5 text-[13px] text-slate-700 transition-all outline-none" />
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">LR Weight</label>
              <input type="text" defaultValue="0" className="w-full bg-white border border-slate-200 focus:border-[#4338CA] focus:ring-1 focus:ring-[#4338CA] rounded-lg p-2.5 text-[13px] text-slate-700 transition-all outline-none" />
            </div>
          </div>

          <hr className="border-slate-100 mb-8" />

          {/* Dynamic Items Section */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-[13px] font-black text-[#1E293B] tracking-wide uppercase">Purchase Items Listing</h2>
            <button onClick={handleAddItem} className="flex items-center gap-1.5 text-[11px] font-bold text-slate-600 hover:text-[#4338CA] transition-colors bg-slate-50 px-3 py-1.5 rounded-md border border-slate-200 hover:border-[#4338CA]/30">
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
                    <td className="py-3 px-4 text-center font-medium text-slate-400">{idx + 1}</td>
                    <td className="py-3 px-4">
                      <select value={item.item_name} onChange={(e) => handleItemChange(item.id, 'item_name', e.target.value)} className="w-full bg-white border border-slate-200 rounded-md p-2 text-[13px] text-slate-500 outline-none focus:border-[#4338CA]">
                        <option value="">-- SELECT ITEM --</option>
                        {(Array.isArray(itemsList) ? itemsList : itemsList?.results || []).map((i: any) => <option key={i.id} value={i.id}>{i.item_name || i.name}</option>)}
                      </select>
                    </td>
                    <td className="py-3 px-4">
                      <input type="number" value={item.nos || ''} onChange={(e) => handleItemChange(item.id, 'nos', e.target.value)} placeholder="0" className="w-full bg-white border border-slate-200 rounded-md p-2 text-[13px] text-center text-slate-700 outline-none focus:border-[#4338CA]" />
                    </td>
                    <td className="py-3 px-4">
                      <input type="number" value={item.quantity || ''} onChange={(e) => handleItemChange(item.id, 'quantity', e.target.value)} placeholder="0" className="w-full bg-white border border-slate-200 rounded-md p-2 text-[13px] text-center text-slate-700 outline-none focus:border-[#4338CA]" />
                    </td>
                    <td className="py-3 px-4">
                      <input type="number" value={item.rate || ''} onChange={(e) => handleItemChange(item.id, 'rate', e.target.value)} placeholder="0" className="w-full bg-white border border-slate-200 rounded-md p-2 text-[13px] text-center text-slate-700 outline-none focus:border-[#4338CA]" />
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-slate-700">
                      ₹ {(Number(item.quantity || 0) * Number(item.rate || 0)).toFixed(2)}
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

          {/* Summary Section */}
          <div className="flex justify-end">
            <div className="w-[400px] border border-slate-200/60 rounded-xl overflow-hidden">
              <div className="bg-[#F8F9FC] py-3 px-5 border-b border-slate-200/60">
                <h3 className="text-[12px] font-black text-[#1E293B] tracking-wide uppercase">Purchase Bill Summary</h3>
              </div>
              
              <div className="p-5 space-y-4">
                <div className="flex justify-between items-center text-[12px] font-bold text-slate-600 uppercase">
                  <span>Total Taxable (+)</span>
                  <span className="text-slate-800">₹ {totalTaxable.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between items-center text-[12px] font-bold text-slate-600 uppercase">
                  <span>Cash Discount (-)</span>
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <input type="number" value={discountPercentDisplay} onChange={(e) => setDiscountData({type: 'PERCENT', value: e.target.value === '' ? '' : Number(e.target.value)})} placeholder="0" className="w-16 text-center border border-slate-200 rounded p-1 text-[12px] text-red-500 font-bold outline-none focus:border-[#4338CA]" />
                      <span className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400">%</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-red-500 font-bold mr-1">- ₹</span>
                      <input type="number" value={discountAmountDisplay} onChange={(e) => setDiscountData({type: 'AMOUNT', value: e.target.value === '' ? '' : Number(e.target.value)})} placeholder="0" className="w-20 text-right border border-slate-200 rounded p-1 text-[12px] text-red-500 font-bold outline-none focus:border-[#4338CA]" />
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center text-[12px] font-bold text-slate-600 uppercase">
                  <span>Freight / Other (+)</span>
                  <input type="number" value={freight} onChange={(e) => setFreight(e.target.value === '' ? '' : Number(e.target.value))} placeholder="0" className="w-24 text-right border border-slate-200 rounded p-1.5 text-[12px] outline-none focus:border-[#4338CA]" />
                </div>

                <div className="flex justify-between items-center text-[12px] font-bold text-slate-600 uppercase">
                  <div className="flex items-center gap-2">
                    <span>Loading (+)</span>
                    <span className="bg-[#10B981]/10 text-[#10B981] px-1.5 py-0.5 rounded text-[9px] tracking-wider">AUTO</span>
                  </div>
                  <input type="number" value={loading} onChange={(e) => setLoading(e.target.value === '' ? '' : Number(e.target.value))} disabled={rcmPurchase === 'YES'} placeholder="0" className={`w-24 text-right border border-slate-200 rounded p-1.5 text-[12px] outline-none ${rcmPurchase === 'YES' ? 'bg-slate-100 cursor-not-allowed' : 'focus:border-[#4338CA]'}`} />
                </div>

                <div className="flex justify-between items-center text-[12px] font-bold text-slate-600 uppercase pt-2 border-t border-slate-100">
                  <span>CGST (9%) (+)</span>
                  <span className="text-slate-800">₹ {cgstAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-[12px] font-bold text-slate-600 uppercase">
                  <span>SGST (9%) (+)</span>
                  <span className="text-slate-800">₹ {sgstAmount.toFixed(2)}</span>
                </div>

                <div className="flex justify-between items-center text-[12px] font-bold text-slate-600 uppercase pt-2 border-t border-slate-100">
                  <span>TDS (-)</span>
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <input type="number" value={tdsPercentDisplay} onChange={(e) => setTdsData({type: 'PERCENT', value: e.target.value === '' ? '' : Number(e.target.value)})} placeholder="0" className="w-16 text-center border border-slate-200 rounded p-1 text-[12px] text-red-500 font-bold outline-none focus:border-[#4338CA]" />
                      <span className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400">%</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-red-500 font-bold mr-1">- ₹</span>
                      <input type="number" value={tdsAmountDisplay} onChange={(e) => setTdsData({type: 'AMOUNT', value: e.target.value === '' ? '' : Number(e.target.value)})} placeholder="0" className="w-20 text-right border border-slate-200 rounded p-1 text-[12px] text-red-500 font-bold outline-none focus:border-[#4338CA]" />
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center text-[12px] font-bold text-slate-600 uppercase pt-2 border-t border-slate-100">
                  <span>Gross Amount</span>
                  <span className="text-slate-800">₹ {grossAmount.toFixed(2)}</span>
                </div>

                <div className="flex justify-between items-center text-[12px] font-bold text-slate-600 uppercase">
                  <span>Round Off (+/-)</span>
                  <span className="text-slate-800">{roundOff >= 0 ? '+' : '-'} ₹ {Math.abs(roundOff).toFixed(2)}</span>
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-slate-200">
                  <span className="text-[15px] font-black text-[#1E293B] uppercase tracking-wide">Net Payable</span>
                  <span className="text-[18px] font-black text-[#1E293B]">₹ {netPayable.toFixed(2)}</span>
                </div>

                <div className="pt-4 flex items-center justify-end gap-4">
                  <button onClick={() => setIsFormOpen(false)} className="text-[11px] font-bold text-slate-400 hover:text-slate-600 uppercase tracking-wider">Cancel</button>
                  <button onClick={handleSubmit} className="bg-[#1E293B] hover:bg-[#0F172A] text-white px-6 py-3 rounded-lg text-[12px] font-bold uppercase tracking-wider flex items-center gap-2 transition-colors">
                    <Save className="w-4 h-4" /> {editingId ? 'Update Purchase Bill' : 'Post Purchase Bill'}
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
