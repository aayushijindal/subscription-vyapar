import React, { useState } from 'react';
import { Plus, Search, X, Save, Pencil, Trash2, Download, FileText, Printer, FileSpreadsheet, Upload } from 'lucide-react';
import toast from 'react-hot-toast';
import { purchaseApi } from '../../services/api/purchase';
import { useEffect } from 'react';
export const PurchaseReturnsPage: React.FC = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [parties, setParties] = useState<any>([]);
  const [itemsList, setItemsList] = useState<any>([]);
  const [transports, setTransports] = useState<any>([]);
  const [purchaseReturns, setPurchaseReturns] = useState<any[]>([]);

  const [rcmPurchaseReturn, setRcmPurchaseReturn] = useState('NO');
  const [discountData, setDiscountData] = useState<{type: 'PERCENT' | 'AMOUNT', value: number | ''}>({type: 'PERCENT', value: ''});
  const [freight, setFreight] = useState<number | ''>('');
  const [loadingType, setLoadingType] = useState<'AUTO' | 'MANUAL'>('MANUAL');
  const [loading, setLoading] = useState<number | ''>('');
  const [tdsData, setTdsData] = useState<{type: 'PERCENT' | 'AMOUNT', value: number | ''}>({type: 'PERCENT', value: ''});
  
  // Form specific state mapping
  const [editingId, setEditingId] = useState<number | null>(null);
  const [invoiceNo, setInvoiceNo] = useState('');
  const [partyId, setPartyId] = useState<number | ''>('');

  const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().split('T')[0]);
  const [vehicleNo, setVehicleNo] = useState('');
  const [orderNo, setOrderNo] = useState('');
  const [orderDate, setOrderDate] = useState('');
  const [lrNo, setLrNo] = useState('');
  const [lrDate, setLrDate] = useState('');
  const [despFrom, setDespFrom] = useState('');
  const [despTo, setDespTo] = useState('');
  const [bookName, setBookName] = useState('');
  const [ewayBillNo, setEwayBillNo] = useState('');
  const [billDate, setBillDate] = useState(new Date().toISOString().split('T')[0]);
  const [transport, setTransport] = useState('');
  const [payment, setPayment] = useState('45 Days');
  const [lrWeight, setLrWeight] = useState('0');
  

  useEffect(() => {
    // Fetch master dropdowns
    purchaseApi.getAccounts().then(res => setParties(res.data)).catch(console.error);
    purchaseApi.getItems('RAW').then(res => setItemsList(res.data)).catch(console.error);
    purchaseApi.getTransports().then(res => setTransports(res.data)).catch(console.error);
  }, []);

  useEffect(() => {
    if (!isFormOpen) {
      // Fetch list
      purchaseApi.getPurchaseReturns().then(res => setPurchaseReturns(res.data.results || [])).catch(console.error);
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
  const applicableLoading = rcmPurchaseReturn === 'YES' ? 0 : (loadingType === 'AUTO' ? (totalTaxable * 0.35) : (Number(loading) || 0));
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
        invoice_date: invoiceDate || null,
        vehicle_no: vehicleNo,
        order_no: orderNo,
        order_date: orderDate || null,
        lr_no: lrNo,
        lr_date: lrDate || null,
        desp_from: despFrom,
        desp_to: despTo,
        book_name: bookName,
        eway_bill_no: ewayBillNo,
        bill_date: billDate || null,
        transport: transport,
        payment: payment,
        lr_weight: lrWeight,
        rcm_purchase: rcmPurchaseReturn,
        freight: freight || 0,
        loading_additional: Number(applicableLoading.toFixed(2)),
        discount_percentage: discountData.type === 'PERCENT' ? (discountData.value || 0) : 0,
        discount: discountAmountDisplay || 0,
        tds_percentage: tdsData.type === 'PERCENT' ? (tdsData.value || 0) : 0,
        tds_amount: tdsAmountUsed || 0,
        items: items.map((item: any) => ({
          ...item,
          item_id: item.item_name || item.item_id,
          line_total: item.amount || 0
        })),
        total_taxable: Number(calculateTotalTaxable().toFixed(2)),
        cgst_amount: Number(cgstAmount.toFixed(2)),
        sgst_amount: Number(sgstAmount.toFixed(2)),
        round_off: Number(roundOff.toFixed(2)),
        grand_total: Number(netPayable.toFixed(2))
      };
      
      if (editingId) {
        await purchaseApi.updatePurchaseReturn(editingId, payload);
        toast.success('Purchase Return updated successfully!'); 
      } else {
        await purchaseApi.createPurchaseReturn(payload);
        toast.success('Purchase Return created successfully!'); 
      }
      
      setIsFormOpen(false);
      setEditingId(null);
    } catch (err) {
      toast.error('Error saving purchaseReturn. Please check mandatory fields.');
      console.error(err);
    }
  };

  const handleEdit = async (id: number) => {
    try {
      const res = await purchaseApi.getPurchaseReturn(id);
      const purchaseReturn = res.data;
      
      setEditingId(id);
      setInvoiceNo(purchaseReturn.invoice_no || '');
      setInvoiceDate(purchaseReturn.invoice_date || '');
      setVehicleNo(purchaseReturn.vehicle_no || '');
      setOrderNo(purchaseReturn.order_no || '');
      setOrderDate(purchaseReturn.order_date || '');
      setLrNo(purchaseReturn.lr_no || '');
      setLrDate(purchaseReturn.lr_date || '');
      setDespFrom(purchaseReturn.desp_from || '');
      setDespTo(purchaseReturn.desp_to || '');
      setBookName(purchaseReturn.book_name || '');
      setEwayBillNo(purchaseReturn.eway_bill_no || '');
      setBillDate(purchaseReturn.bill_date || '');
      setTransport(purchaseReturn.transport || '');
      setPayment(purchaseReturn.payment || '');
      setLrWeight(purchaseReturn.lr_weight || '0');
      setRcmPurchaseReturn(purchaseReturn.rcm_purchase || 'NO');
      setFreight(purchaseReturn.freight || '');
      setLoadingType('MANUAL');
      setLoading(purchaseReturn.loading_additional || '');
      setDiscountData({type: 'PERCENT', value: purchaseReturn.discount_percentage || ''});
      setTdsData({type: 'PERCENT', value: purchaseReturn.tds_percentage || ''});
      setPartyId(purchaseReturn.party_id || '');
      
      if (purchaseReturn.items && purchaseReturn.items.length > 0) {
        setItems(purchaseReturn.items);
      } else {
        setItems([{ id: new Date().getTime(), item_name: '', nos: 0, quantity: 0, rate: 0, amount: 0 }]);
      }
      
      setIsFormOpen(true);
    } catch (err) {
      console.error(err);
      toast.error('Error fetching purchaseReturn details');
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this purchaseReturn entry?')) {
      try {
        await purchaseApi.deletePurchaseReturn(id);
        setPurchaseReturns(purchaseReturns.filter(p => p.id !== id));
      } catch (err) {
        console.error(err);
        toast.error('Error deleting purchaseReturn');
      }
    }
  };

  const handleNewEntry = () => {
    setEditingId(null);
    setInvoiceNo('');
    setInvoiceDate(new Date().toISOString().split('T')[0]);
    setVehicleNo('');
    setOrderNo('');
    setOrderDate('');
    setLrNo('');
    setLrDate('');
    setDespFrom('');
    setDespTo('');
    setBookName('');
    setEwayBillNo('');
    setBillDate(new Date().toISOString().split('T')[0]);
    setTransport('');
    setPayment('45 Days');
    setLrWeight('0');
    setRcmPurchaseReturn('NO');
    setFreight('');
    setLoadingType('MANUAL');
    setLoading('');
    setDiscountData({type: 'PERCENT', value: ''});
    setTdsData({type: 'PERCENT', value: ''});
    setPartyId('');
    setItems([{ id: Date.now(), item_name: '', nos: 0, quantity: 0, rate: 0, amount: 0 }]);
    setIsFormOpen(true);
  };

  if (!isFormOpen) {
    return (
      <div className="min-h-screen bg-background p-4 sm:p-6 lg:p-8 font-sans">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-surface rounded-2xl shadow-sm border border-border/60 p-5 mb-6">
          <div>
            <h1 className="text-[18px] font-black text-text-primary tracking-tight uppercase">PURCHASE RETURN LIST</h1>
            <p className="text-[11px] font-bold text-text-muted uppercase mt-0.5">Manage Purchase Returns</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 text-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
              <input type="text" placeholder="Search Invoice..." className="w-[200px] bg-input border border-border focus:border-[#1E293B] focus:bg-surface rounded-xl pl-9 pr-4 py-2 text-[12px] font-medium outline-none transition-all" />
            </div>
            <button className="bg-slate-200 hover:bg-slate-300 text-text-secondary px-4 py-2 rounded-xl text-[12px] font-bold flex items-center gap-1.5 transition-colors">
              <FileSpreadsheet className="w-3.5 h-3.5" /> Excel
            </button>
            <button className="bg-slate-200 hover:bg-slate-300 text-text-secondary px-4 py-2 rounded-xl text-[12px] font-bold flex items-center gap-1.5 transition-colors">
              <FileText className="w-3.5 h-3.5" /> PDF
            </button>
            <button className="bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-xl text-[12px] font-bold flex items-center gap-1.5 transition-colors">
              <Upload className="w-3.5 h-3.5" /> Import
            </button>
            <button onClick={handleNewEntry} className="bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-xl text-[12px] font-bold flex items-center gap-1.5 transition-colors">
              <Plus className="w-4 h-4" /> Add New
            </button>
          </div>
        </div>

        <div className="bg-surface rounded-2xl shadow-sm border border-border/60 overflow-hidden">
          {purchaseReturns.length === 0 ? (
            <div className="p-12 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 bg-input rounded-full flex items-center justify-center mb-4">
                <Search className="w-8 h-8 text-slate-300" />
              </div>
              <h3 className="text-[15px] font-black text-text-secondary uppercase tracking-wide">No Entries Found</h3>
              <p className="text-[13px] text-text-secondary mt-1 max-w-sm">You haven't recorded any entries yet. Click "Add New" to get started.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-[11px] font-bold">
                <thead className="bg-background text-text-secondary uppercase tracking-wider border-b border-border/60">
                  <tr>
                    <th className="py-4 px-4 w-[40px] text-center"><input type="checkbox" className="rounded border-border" /></th>
                    <th className="py-4 px-4">DATE</th>
                    <th className="py-4 px-4">INVOICE NO</th>
                    <th className="py-4 px-4">PARTY</th>
                    <th className="py-4 px-4 text-right">GRAND TOTAL</th>
                    
                    <th className="py-4 px-4 text-center">ACTIONS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {purchaseReturns.map((purchaseReturn) => {
                    const partyName = Array.isArray(parties) ? (parties.find(p => p.id === purchaseReturn.party_id)?.name || parties.find(p => p.id === purchaseReturn.party_id)?.account_name || purchaseReturn.party_id) : purchaseReturn.party_id;
                    const dateStr = purchaseReturn.invoice_date ? new Date(purchaseReturn.invoice_date).toLocaleDateString('en-GB').replace(/\//g, '-') : '-';
                    return (
                    <tr key={purchaseReturn.id} className="hover:bg-input/50 transition-colors">
                      <td className="py-4 px-4 text-center"><input type="checkbox" className="rounded border-border" /></td>
                      <td className="py-4 px-4 text-text-secondary">{dateStr}</td>
                      <td className="py-4 px-4 text-text-primary">{purchaseReturn.invoice_no || '-'}</td>
                      <td className="py-4 px-4 text-text-primary uppercase">{partyName || '-'}</td>
                      <td className="py-4 px-4 text-text-secondary text-right">₹ {purchaseReturn.grand_total ? Number(purchaseReturn.grand_total).toLocaleString('en-IN') : '0'}</td>
                      
                      <td className="py-4 px-4 text-center">
                        <div className="flex justify-center items-center gap-2">
                          <button className="text-emerald-500 hover:text-emerald-600 bg-emerald-50 p-1.5 rounded transition-colors"><Download className="w-3.5 h-3.5" /></button>
                          <button className="text-rose-500 hover:text-rose-600 bg-rose-50 p-1.5 rounded transition-colors"><FileText className="w-3.5 h-3.5" /></button>
                          <button className="text-text-secondary hover:text-text-secondary bg-background p-1.5 rounded transition-colors"><Printer className="w-3.5 h-3.5" /></button>
                          <button onClick={() => handleEdit(purchaseReturn.id)} className="text-primary hover:text-primary bg-primary-light p-1.5 rounded transition-colors"><Pencil className="w-3.5 h-3.5" /></button>
                          <button onClick={() => handleDelete(purchaseReturn.id)} className="text-red-500 hover:text-red-600 bg-red-50 p-1.5 rounded transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
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
    <div className="min-h-screen bg-background p-4 sm:p-6 lg:p-8 font-sans">
      
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => setIsFormOpen(false)} className="text-text-muted hover:text-text-secondary transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
        </button>
        <h1 className="text-[20px] font-black text-text-primary tracking-tight uppercase">{editingId ? 'Edit Purchase Return Entry' : 'Create Purchase Return Entry'}</h1>
      </div>

      <div className="bg-surface rounded-2xl shadow-sm border border-border/60 overflow-hidden mb-6">
        <div className="p-6 sm:p-8">
          
          {/* Top Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-x-6 gap-y-5 mb-10">
            {/* Row 1 */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-text-secondary uppercase tracking-wider">Purchase Return No. (Auto)</label>
              <input type="text" disabled value="AUTO GENERATED" className="w-full bg-input border border-border rounded-lg p-2.5 text-[13px] text-text-muted font-medium cursor-not-allowed" />
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-text-secondary uppercase tracking-wider">Invoice Number</label>
              <input type="text" value={invoiceNo} onChange={(e) => setInvoiceNo(e.target.value)} placeholder="INV NO." className="w-full bg-surface border border-border focus:border-primary focus:ring-1 focus:ring-[#2b5f9d] rounded-lg p-2.5 text-[13px] text-text-secondary transition-all outline-none placeholder:text-slate-300" />
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-text-secondary uppercase tracking-wider">Invoice Date</label>
              <input type="date" className="w-full bg-surface border border-border focus:border-primary focus:ring-1 focus:ring-[#2b5f9d] rounded-lg p-2.5 text-[13px] text-text-secondary transition-all outline-none" value={invoiceDate} onChange={(e) => setInvoiceDate(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-text-secondary uppercase tracking-wider">Vehicle Number</label>
              <input type="text" placeholder="GJ-01-XX-0000" className="w-full bg-surface border border-border focus:border-primary focus:ring-1 focus:ring-[#2b5f9d] rounded-lg p-2.5 text-[13px] text-text-secondary transition-all outline-none placeholder:text-slate-300" value={vehicleNo} onChange={(e) => setVehicleNo(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-text-secondary uppercase tracking-wider">RCM Purchase Return</label>
              <select value={rcmPurchaseReturn} onChange={(e) => setRcmPurchaseReturn(e.target.value)} className="w-full bg-surface border border-border focus:border-primary focus:ring-1 focus:ring-[#2b5f9d] rounded-lg p-2.5 text-[13px] text-text-secondary transition-all outline-none">
                <option>NO</option>
                <option>YES</option>
              </select>
            </div>

            {/* Row 2 */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-text-secondary uppercase tracking-wider">Order No.</label>
              <input type="text" placeholder="ORDER NO." className="w-full bg-surface border border-border focus:border-primary focus:ring-1 focus:ring-[#2b5f9d] rounded-lg p-2.5 text-[13px] text-text-secondary transition-all outline-none placeholder:text-slate-300" value={orderNo} onChange={(e) => setOrderNo(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-text-secondary uppercase tracking-wider">Order Date</label>
              <input type="date" className="w-full bg-surface border border-border focus:border-primary focus:ring-1 focus:ring-[#2b5f9d] rounded-lg p-2.5 text-[13px] text-text-muted transition-all outline-none" value={orderDate} onChange={(e) => setOrderDate(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-text-secondary uppercase tracking-wider">LR No.</label>
              <input type="text" placeholder="LR NO." className="w-full bg-surface border border-border focus:border-primary focus:ring-1 focus:ring-[#2b5f9d] rounded-lg p-2.5 text-[13px] text-text-secondary transition-all outline-none placeholder:text-slate-300" value={lrNo} onChange={(e) => setLrNo(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-text-secondary uppercase tracking-wider">LR Date</label>
              <input type="date" className="w-full bg-surface border border-border focus:border-primary focus:ring-1 focus:ring-[#2b5f9d] rounded-lg p-2.5 text-[13px] text-text-muted transition-all outline-none" value={lrDate} onChange={(e) => setLrDate(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-text-secondary uppercase tracking-wider">Desp From</label>
              <input type="text" placeholder="FROM" className="w-full bg-surface border border-border focus:border-primary focus:ring-1 focus:ring-[#2b5f9d] rounded-lg p-2.5 text-[13px] text-text-secondary transition-all outline-none placeholder:text-slate-300" value={despFrom} onChange={(e) => setDespFrom(e.target.value)} />
            </div>

            {/* Row 3 */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-text-secondary uppercase tracking-wider">Desp To</label>
              <input type="text" placeholder="TO" className="w-full bg-surface border border-border focus:border-primary focus:ring-1 focus:ring-[#2b5f9d] rounded-lg p-2.5 text-[13px] text-text-secondary transition-all outline-none placeholder:text-slate-300" value={despTo} onChange={(e) => setDespTo(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-primary uppercase tracking-wider">Party Name</label>
              <select value={partyId} onChange={(e) => setPartyId(Number(e.target.value))} className="w-full bg-surface border border-border focus:border-primary focus:ring-1 focus:ring-[#2b5f9d] rounded-lg p-2.5 text-[13px] text-primary font-medium transition-all outline-none">
                <option value="">-- SELECT PARTY --</option>
                {(Array.isArray(parties) ? parties : parties?.results || []).map((p: any) => <option key={p.id} value={p.id}>{p.name || p.account_name}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-text-secondary uppercase tracking-wider">Party GSTIN</label>
              <input type="text" placeholder="GSTIN" className="w-full bg-surface border border-border focus:border-primary focus:ring-1 focus:ring-[#2b5f9d] rounded-lg p-2.5 text-[13px] text-text-secondary transition-all outline-none placeholder:text-slate-300" />
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-primary uppercase tracking-wider">Book Name</label>
              <select className="w-full bg-surface border border-border focus:border-primary focus:ring-1 focus:ring-[#2b5f9d] rounded-lg p-2.5 text-[13px] text-text-muted transition-all outline-none">
                <option value="">-- SELECT BOOK --</option>
                {(Array.isArray(parties) ? parties : parties?.results || []).map((p: any) => <option key={p.id} value={p.id}>{p.name || p.account_name}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-text-secondary uppercase tracking-wider">E-Way Bill No.</label>
              <input type="text" placeholder="E-WAY BILL NO." className="w-full bg-surface border border-border focus:border-primary focus:ring-1 focus:ring-[#2b5f9d] rounded-lg p-2.5 text-[13px] text-text-secondary transition-all outline-none placeholder:text-slate-300" value={ewayBillNo} onChange={(e) => setEwayBillNo(e.target.value)} />
            </div>

            {/* Row 4 */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-text-secondary uppercase tracking-wider">Bill Date</label>
              <input type="date" className="w-full bg-surface border border-border focus:border-primary focus:ring-1 focus:ring-[#2b5f9d] rounded-lg p-2.5 text-[13px] text-text-secondary transition-all outline-none" value={billDate} onChange={(e) => setBillDate(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-primary uppercase tracking-wider">Select Transport</label>
              <select className="w-full bg-surface border border-border focus:border-primary focus:ring-1 focus:ring-[#2b5f9d] rounded-lg p-2.5 text-[13px] text-text-muted transition-all outline-none">
                <option value="">-- SELECT TRANSPORT --</option>
                {(Array.isArray(transports) ? transports : transports?.results || []).map((t: any) => <option key={t.id} value={t.id}>{t.name || t.transport_name}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-text-secondary uppercase tracking-wider">Freight</label>
              <input type="text" className="w-full bg-surface border border-border focus:border-primary focus:ring-1 focus:ring-[#2b5f9d] rounded-lg p-2.5 text-[13px] text-text-secondary transition-all outline-none" />
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-text-secondary uppercase tracking-wider">Payment</label>
              <input type="text" className="w-full bg-surface border border-border focus:border-primary focus:ring-1 focus:ring-[#2b5f9d] rounded-lg p-2.5 text-[13px] text-text-secondary transition-all outline-none" value={payment} onChange={(e) => setPayment(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-text-secondary uppercase tracking-wider">LR Weight</label>
              <input type="text" className="w-full bg-surface border border-border focus:border-primary focus:ring-1 focus:ring-[#2b5f9d] rounded-lg p-2.5 text-[13px] text-text-secondary transition-all outline-none" value={lrWeight} onChange={(e) => setLrWeight(e.target.value)} />
            </div>
          </div>

          <hr className="border-border/50 mb-8" />

          {/* Dynamic Items Section */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-[13px] font-black text-text-primary tracking-wide uppercase">Purchase Return Items Listing</h2>
            <button onClick={handleAddItem} className="flex items-center gap-1.5 text-[11px] font-bold text-text-secondary hover:text-primary transition-colors bg-input px-3 py-1.5 rounded-md border border-border hover:border-primary/30">
              <Plus className="w-3 h-3" /> ADD ROW
            </button>
          </div>

          <div className="border border-border/60 rounded-xl overflow-hidden mb-8">
            <table className="w-full text-left text-[12px]">
              <thead className="bg-background text-text-secondary font-bold uppercase tracking-wider border-b border-border/60">
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
              <tbody className="divide-y divide-border">
                {items.map((item, idx) => (
                  <tr key={item.id} className="hover:bg-input/50 transition-colors">
                    <td className="py-3 px-4 text-center font-medium text-text-muted">{idx + 1}</td>
                    <td className="py-3 px-4">
                      <select value={item.item_name} onChange={(e) => handleItemChange(item.id, 'item_name', e.target.value)} className="w-full bg-surface border border-border rounded-md p-2 text-[13px] text-text-secondary outline-none focus:border-primary">
                        <option value="">-- SELECT ITEM --</option>
                        {(Array.isArray(itemsList) ? itemsList : itemsList?.results || []).map((i: any) => <option key={i.id} value={i.id}>{i.item_name || i.name}</option>)}
                      </select>
                    </td>
                    <td className="py-3 px-4">
                      <input type="number" value={item.nos || ''} onChange={(e) => handleItemChange(item.id, 'nos', e.target.value)} placeholder="0" className="w-full bg-surface border border-border rounded-md p-2 text-[13px] text-center text-text-secondary outline-none focus:border-primary" />
                    </td>
                    <td className="py-3 px-4">
                      <input type="number" value={item.quantity || ''} onChange={(e) => handleItemChange(item.id, 'quantity', e.target.value)} placeholder="0" className="w-full bg-surface border border-border rounded-md p-2 text-[13px] text-center text-text-secondary outline-none focus:border-primary" />
                    </td>
                    <td className="py-3 px-4">
                      <input type="number" value={item.rate || ''} onChange={(e) => handleItemChange(item.id, 'rate', e.target.value)} placeholder="0" className="w-full bg-surface border border-border rounded-md p-2 text-[13px] text-center text-text-secondary outline-none focus:border-primary" />
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-text-secondary">
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
            <div className="w-[400px] border border-border/60 rounded-xl overflow-hidden">
              <div className="bg-background py-3 px-5 border-b border-border/60">
                <h3 className="text-[12px] font-black text-text-primary tracking-wide uppercase">Purchase Return Bill Summary</h3>
              </div>
              
              <div className="p-5 space-y-4">
                <div className="flex justify-between items-center text-[12px] font-bold text-text-secondary uppercase">
                  <span>Total Taxable (+)</span>
                  <span className="text-text-primary">₹ {totalTaxable.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between items-center text-[12px] font-bold text-text-secondary uppercase">
                  <span>Cash Discount (-)</span>
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <input type="number" value={discountPercentDisplay} onChange={(e) => setDiscountData({type: 'PERCENT', value: e.target.value === '' ? '' : Number(e.target.value)})} placeholder="0" className="w-16 text-center border border-border rounded p-1 text-[12px] text-red-500 font-bold outline-none focus:border-primary" />
                      <span className="absolute right-2 top-1/2 -translate-y-1/2 text-text-muted">%</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-red-500 font-bold mr-1">- ₹</span>
                      <input type="number" value={discountAmountDisplay} onChange={(e) => setDiscountData({type: 'AMOUNT', value: e.target.value === '' ? '' : Number(e.target.value)})} placeholder="0" className="w-20 text-right border border-border rounded p-1 text-[12px] text-red-500 font-bold outline-none focus:border-primary" />
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center text-[12px] font-bold text-text-secondary uppercase">
                  <span>Freight / Other (+)</span>
                  <input type="number" value={freight} onChange={(e) => setFreight(e.target.value === '' ? '' : Number(e.target.value))} placeholder="0" className="w-24 text-right border border-border rounded p-1.5 text-[12px] outline-none focus:border-primary" />
                </div>

                <div className="flex justify-between items-center text-[12px] font-bold text-text-secondary uppercase">
                  <div className="flex items-center gap-2">
                    <span>Loading (+)</span>
                    <select 
                      value={loadingType} 
                      onChange={(e) => setLoadingType(e.target.value as 'AUTO'|'MANUAL')}
                      className="bg-background border border-border text-text-secondary px-1.5 py-0.5 rounded text-[10px] tracking-wider outline-none"
                    >
                      <option value="MANUAL">MANUAL</option>
                      <option value="AUTO">AUTO</option>
                    </select>
                  </div>
                  <input 
                    type="number" 
                    value={loadingType === 'AUTO' ? (totalTaxable * 0.35).toFixed(2) : loading} 
                    onChange={(e) => loadingType === 'MANUAL' && setLoading(e.target.value === '' ? '' : Number(e.target.value))} 
                    disabled={rcmPurchaseReturn === 'YES' || loadingType === 'AUTO'} 
                    placeholder="0" 
                    className={`w-24 text-right border border-border rounded p-1.5 text-[12px] outline-none ${rcmPurchaseReturn === 'YES' || loadingType === 'AUTO' ? 'bg-background cursor-not-allowed' : 'focus:border-primary'}`} 
                  />
                </div>

                <div className="flex justify-between items-center text-[12px] font-bold text-text-secondary uppercase pt-2 border-t border-border/50">
                  <span>CGST (9%) (+)</span>
                  <span className="text-text-primary">₹ {cgstAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-[12px] font-bold text-text-secondary uppercase">
                  <span>SGST (9%) (+)</span>
                  <span className="text-text-primary">₹ {sgstAmount.toFixed(2)}</span>
                </div>

                <div className="flex justify-between items-center text-[12px] font-bold text-text-secondary uppercase pt-2 border-t border-border/50">
                  <span>TDS (-)</span>
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <input type="number" value={tdsPercentDisplay} onChange={(e) => setTdsData({type: 'PERCENT', value: e.target.value === '' ? '' : Number(e.target.value)})} placeholder="0" className="w-16 text-center border border-border rounded p-1 text-[12px] text-red-500 font-bold outline-none focus:border-primary" />
                      <span className="absolute right-2 top-1/2 -translate-y-1/2 text-text-muted">%</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-red-500 font-bold mr-1">- ₹</span>
                      <input type="number" value={tdsAmountDisplay} onChange={(e) => setTdsData({type: 'AMOUNT', value: e.target.value === '' ? '' : Number(e.target.value)})} placeholder="0" className="w-20 text-right border border-border rounded p-1 text-[12px] text-red-500 font-bold outline-none focus:border-primary" />
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center text-[12px] font-bold text-text-secondary uppercase pt-2 border-t border-border/50">
                  <span>Gross Amount</span>
                  <span className="text-text-primary">₹ {grossAmount.toFixed(2)}</span>
                </div>

                <div className="flex justify-between items-center text-[12px] font-bold text-text-secondary uppercase">
                  <span>Round Off (+/-)</span>
                  <span className="text-text-primary">{roundOff >= 0 ? '+' : '-'} ₹ {Math.abs(roundOff).toFixed(2)}</span>
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-border">
                  <span className="text-[15px] font-black text-text-primary uppercase tracking-wide">Net Payable</span>
                  <span className="text-[18px] font-black text-text-primary">₹ {netPayable.toFixed(2)}</span>
                </div>

                <div className="pt-4 flex items-center justify-end gap-4">
                  <button onClick={() => setIsFormOpen(false)} className="text-[11px] font-bold text-text-muted hover:text-text-secondary uppercase tracking-wider">Cancel</button>
                  <button onClick={handleSubmit} className="bg-primary hover:bg-primary-hover text-white px-6 py-3 rounded-lg text-[12px] font-bold uppercase tracking-wider flex items-center gap-2 transition-colors">
                    <Save className="w-4 h-4" /> {editingId ? 'Update Purchase Return Bill' : 'Post Purchase Return Bill'}
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
