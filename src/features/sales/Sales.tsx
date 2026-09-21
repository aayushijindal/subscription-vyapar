import React, { useState, useEffect } from 'react';
import { Plus, Search, X, Save, Pencil, Trash2, ArrowLeft, Download, FileText, Printer, FileSpreadsheet, Eye } from 'lucide-react';
import toast from 'react-hot-toast';
import { salesApi } from '../../services/api/sales';
import { masterApi } from '../../services/api/master';

export const SalesPage: React.FC = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [accounts, setAccounts] = useState<any[]>([]);
  const [itemsList, setItemsList] = useState<any[]>([]);
  const [transports, setTransports] = useState<any[]>([]);
  const [sales, setSales] = useState<any[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Form State
  const [editingId, setEditingId] = useState<number | null>(null);
  
  // Header Fields
  const [invoiceNo, setInvoiceNo] = useState('');
  const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().split('T')[0]);
  const [vehicleNo, setVehicleNo] = useState('');
  const [orderNo, setOrderNo] = useState('');
  const [orderDate, setOrderDate] = useState('');
  const [lrNo, setLrNo] = useState('');
  const [lrDate, setLrDate] = useState('');
  const [despFrom, setDespFrom] = useState('');
  const [despTo, setDespTo] = useState('');
  const [pincode, setPincode] = useState('');
  const [buyerId, setBuyerId] = useState<number | ''>('');
  const [consigneeId, setConsigneeId] = useState<number | ''>('');
  const [bookName, setBookName] = useState('');
  const [ewayBillNo, setEwayBillNo] = useState('');
  const [billDate, setBillDate] = useState('');
  const [transport, setTransport] = useState('');
  const [distance, setDistance] = useState('');
  const [vehicleType, setVehicleType] = useState('R');

  // Computed
  const buyerGstin = buyerId ? (accounts.find(a => a.id === buyerId)?.gst_number || accounts.find(a => a.id === buyerId)?.gstin || '') : '';

  // Items State
  const [items, setItems] = useState(() => [{ id: Date.now(), item_id: '', nos: 1, quantity: 0, rate: 0, amount: 0 }]);

  // Summary State
  const [discountPercent, setDiscountPercent] = useState('0.00');
  const [freight, setFreight] = useState('0.00');
  const [loadingType, setLoadingType] = useState<'AUTO'|'MANUAL'>('MANUAL');
  const [loadingAmt, setLoadingAmt] = useState('0.00');

  const fetchSales = async () => {
    await Promise.resolve(); // Defer state update to avoid sync state update within effect
    setIsLoading(true);
    try {
      const res = await salesApi.sales.list();
      setSales(Array.isArray(res) ? res : (res as any).results || []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Initial fetch
    if (!isFormOpen) {
      setTimeout(() => {
        fetchSales();
      }, 0);
    }
  }, [isFormOpen]);

  useEffect(() => {
    masterApi.accounts.list().then(res => setAccounts(Array.isArray(res) ? res : (res as any)?.results || [])).catch(console.error);
    masterApi.items.list().then(res => setItemsList(Array.isArray(res) ? res : (res as any)?.results || [])).catch(console.error);
    masterApi.transports.list().then(res => setTransports(Array.isArray(res) ? res : (res as any)?.results || [])).catch(console.error);
  }, []);

  const handleAddItem = () => {
    setItems([...items, { id: Date.now(), item_id: '', nos: 1, quantity: 0, rate: 0, amount: 0 }]);
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

  // Calculations
  const calculateTotalTaxable = () => items.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
  
  const totalTaxable = calculateTotalTaxable();
  
  // If loading is AUTO, it is 0.35 * totalTaxable
  const applicableLoading = loadingType === 'AUTO' ? (totalTaxable * 0.35) : Number(loadingAmt || 0);
  
  const discountAmt = totalTaxable * (Number(discountPercent || 0) / 100);
  const freightAmt = Number(freight || 0);
  
  // Tax calculation on (Taxable + Freight + Loading - Discount)
  const taxableForGst = totalTaxable + freightAmt + applicableLoading - discountAmt;
  
  const isIntrastate = buyerGstin.startsWith('24');
  const cgstAmount = isIntrastate ? taxableForGst * 0.09 : 0;
  const sgstAmount = isIntrastate ? taxableForGst * 0.09 : 0;
  const igstAmount = !isIntrastate ? taxableForGst * 0.18 : 0;
  
  const grossAmount = taxableForGst + cgstAmount + sgstAmount + igstAmount;
  const netPayable = Math.round(grossAmount);
  const roundOff = netPayable - grossAmount;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!invoiceNo || !invoiceDate || !buyerId) {
      toast.error('Please fill in Invoice No, Date, and Buyer.');
      return;
    }
    try {
      const payload = {
        invoice_no: invoiceNo,
        invoice_date: invoiceDate || null,
        vehicle_no: vehicleNo,
        order_no: orderNo,
        order_date: orderDate || null,
        lr_no: lrNo,
        lr_date: lrDate || null,
        desp_from: despFrom,
        desp_to: despTo,
        pincode: pincode,
        buyer: buyerId || 1,
        consignee: consigneeId,
        book_name: bookName,
        eway_bill_no: ewayBillNo,
        bill_date: billDate || null,
        transport: transport,
        distance_km: distance,
        vehicle_type: vehicleType,
        freight: freightAmt,
        loading_additional: Number(applicableLoading.toFixed(2)),
        discount_percentage: Number(discountPercent || 0),
        discount_amount: Number(discountAmt.toFixed(2)),
        items: items.map((item: any) => ({
          item: item.item_id,
          nos: item.nos,
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
        await salesApi.sales.update(editingId, payload);
        toast.success('Sales updated successfully!'); 
      } else {
        await salesApi.sales.create(payload);
        toast.success('Sales created successfully!'); 
      }
      
      setIsFormOpen(false);
      setEditingId(null);
    } catch (err) {
      toast.error('Error saving sales entry. Please check mandatory fields.');
      console.error(err);
    }
  };

  const handleEdit = async (id: number) => {
    try {
      const sale = await salesApi.sales.get(id);
      
      setEditingId(id);
      setInvoiceNo(sale.invoice_no || '');
      setInvoiceDate(sale.invoice_date || '');
      setVehicleNo(sale.vehicle_no || '');
      setOrderNo(sale.order_no || '');
      setOrderDate(sale.order_date || '');
      setLrNo(sale.lr_no || '');
      setLrDate(sale.lr_date || '');
      setDespFrom(sale.desp_from || '');
      setDespTo(sale.desp_to || '');
      setPincode(sale.pincode || '');
      setBuyerId(sale.buyer || sale.party_id || sale.buyer_id || '');
      setConsigneeId(sale.consignee || sale.consignee_id || '');
      setBookName(sale.book_name || '');
      setEwayBillNo(sale.eway_bill_no || '');
      setBillDate(sale.bill_date || '');
      setTransport(sale.transport || '');
      setDistance(sale.distance_km || '');
      setVehicleType(sale.vehicle_type || 'R');
      
      setFreight(sale.freight?.toString() || '0.00');
      
      // We'll set it to manual and just put the number, logic will pick it up
      setLoadingType('MANUAL');
      setLoadingAmt(sale.loading_additional?.toString() || '0.00');
      setDiscountPercent(sale.discount_percentage?.toString() || '0.00');
      
      if (sale.items && sale.items.length > 0) {
        setItems(sale.items.map((i: any) => ({
          id: i.id || Date.now() + Math.random(),
          item_id: i.item || i.item_id || '',
          nos: i.nos || 1,
          quantity: i.quantity || 0,
          rate: i.rate || 0,
          amount: i.amount || i.line_total || 0
        })));
      } else {
        setItems([{ id: 1, item_id: '', nos: 1, quantity: 0, rate: 0, amount: 0 }]);
      }
      
      setIsFormOpen(true);
    } catch {
      toast.error('Error fetching details');
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this invoice?')) {
      try {
        await salesApi.sales.delete(id);
        setSales(sales.filter(s => s.id !== id));
        toast.success('Deleted successfully');
      } catch {
        toast.error('Error deleting record');
      }
    }
  };

  const handleNew = () => {
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
    setPincode('');
    setBuyerId('');
    setConsigneeId('');
    setBookName('');
    setEwayBillNo('');
    setBillDate('');
    setTransport('');
    setDistance('');
    setVehicleType('R');
    
    setFreight('0.00');
    setLoadingAmt('0.00');
    setDiscountPercent('0.00');
    setLoadingType('MANUAL');
    setItems([{ id: Date.now(), item_id: '', nos: 1, quantity: 0, rate: 0, amount: 0 }]);
    
    setIsFormOpen(true);
  };

  if (!isFormOpen) {
    return (
      <div className="min-h-screen bg-background p-4 sm:p-6 lg:p-8 font-sans">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-surface rounded-2xl shadow-sm border border-border/60 p-5 mb-6">
          <div>
            <h1 className="text-[20px] font-black text-text-primary tracking-tight uppercase">SALES ENTRY LIST</h1>
            <p className="text-[11px] font-bold text-text-secondary uppercase mt-0.5 tracking-wider">Manage Sales Invoices</p>
          </div>
          <div className="flex flex-wrap items-center gap-3 mt-4 sm:mt-0">
            <div className="relative">
              <Search className="w-4 h-4 text-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
              <input type="text" placeholder="Search Invoice..." className="pl-9 pr-4 py-2 bg-input border border-border rounded-lg text-sm focus:outline-none focus:border-primary" />
            </div>
            <button onClick={() => toast.success(`Exporting ${selectedIds.length} items to Excel (In Dev)`)} disabled={selectedIds.length === 0} className={`px-4 py-2.5 rounded-xl text-[12px] font-bold flex items-center gap-2 transition-colors border border-border ${selectedIds.length ? 'bg-input hover:bg-border/30 text-text-primary' : 'bg-input text-text-muted opacity-50 cursor-not-allowed'}`}>
               <FileSpreadsheet className="w-4 h-4" /> Excel
            </button>
            <button onClick={() => toast.success(`Exporting ${selectedIds.length} items to PDF (In Dev)`)} disabled={selectedIds.length === 0} className={`px-4 py-2.5 rounded-xl text-[12px] font-bold flex items-center gap-2 transition-colors border border-border ${selectedIds.length ? 'bg-input hover:bg-border/30 text-text-primary' : 'bg-input text-text-muted opacity-50 cursor-not-allowed'}`}>
               <FileText className="w-4 h-4" /> PDF
            </button>
            <button className="bg-primary hover:bg-primary-hover text-white px-4 py-2.5 rounded-xl text-[12px] font-bold flex items-center gap-2 transition-colors">
               <Download className="w-4 h-4" /> Import
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
                <th className="py-4 px-5 w-[40px] text-center">
                  <input type="checkbox" checked={sales.length > 0 && selectedIds.length === sales.length} onChange={(e) => setSelectedIds(e.target.checked ? sales.map(s => s.id) : [])} className="rounded border-border" />
                </th>
                <th className="py-4 px-5">DATE</th>
                <th className="py-4 px-5">INVOICE NO</th>
                <th className="py-4 px-5">BUYER</th>
                <th className="py-4 px-5">GRAND TOTAL</th>
                <th className="py-4 px-5 text-center">E-INVOICE</th>
                <th className="py-4 px-5 text-center">E-WAY BILL</th>
                <th className="py-4 px-5 text-center">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-text-secondary font-medium">Loading sales entries...</td>
                </tr>
              ) : sales.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-text-secondary font-medium">No sales found.</td>
                </tr>
              ) : sales.map((sale) => {
                const buyerId = sale.buyer || sale.buyer_id || sale.party_id;
                const partyName = accounts.find(p => p.id === buyerId)?.name || accounts.find(p => p.id === buyerId)?.account_name || 'UNKNOWN';
                const dateStr = sale.invoice_date ? new Date(sale.invoice_date).toLocaleDateString('en-GB').replace(/\//g, '-') : '-';
                
                const eInvoiceActive = sale.irn && sale.irn.length > 5;
                const ewbActive = sale.eway_bill_no && sale.eway_bill_no.length > 2;
                return (
                  <tr key={sale.id} className="hover:bg-input/50 transition-colors">
                    <td className="py-4 px-5 text-center">
                      <input type="checkbox" checked={selectedIds.includes(sale.id)} onChange={() => setSelectedIds(prev => prev.includes(sale.id) ? prev.filter(id => id !== sale.id) : [...prev, sale.id])} className="rounded border-border" />
                    </td>
                    <td className="py-4 px-5 text-text-secondary">{dateStr}</td>
                    <td className="py-4 px-5 text-text-primary text-[13px]">{sale.invoice_no || '--'}</td>
                    <td className="py-4 px-5 text-text-primary uppercase">{partyName}</td>
                    <td className="py-4 px-5 text-text-primary">₹ {Number(sale.grand_total || 0).toLocaleString()}</td>
                    <td className="py-4 px-5 text-center">
                      {eInvoiceActive ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 text-[10px] border border-emerald-400 text-emerald-600 rounded-full bg-emerald-50 font-black uppercase tracking-wider">
                          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span> ACTIVE
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 text-[10px] border border-border text-text-secondary rounded-full bg-input font-black uppercase tracking-wider">
                           NOT GENERATED
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-5 text-center flex flex-col items-center justify-center gap-1">
                      {ewbActive ? (
                        <>
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 text-[10px] border border-emerald-400 text-emerald-600 rounded-full bg-emerald-50 font-black uppercase tracking-wider">
                            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span> ACTIVE
                          </span>
                          <span className="text-[10px] text-primary flex items-center gap-1 cursor-pointer hover:underline bg-primary-light px-2 py-0.5 rounded border border-primary/20">
                            <Printer className="w-3 h-3"/> Print
                          </span>
                        </>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 text-[10px] border border-border text-text-secondary rounded-full bg-input font-black uppercase tracking-wider">
                           NOT GENERATED
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-5 text-center">
                      <div className="flex justify-center items-center gap-2">
                        <button onClick={() => handleEdit(sale.id)} className="text-text-muted hover:text-text-secondary p-1.5 rounded border border-border transition-colors"><Eye className="w-3.5 h-3.5" /></button>
                        <button className="text-emerald-500 hover:text-emerald-600 bg-emerald-50 p-1.5 rounded border border-emerald-100 transition-colors"><Download className="w-3.5 h-3.5" /></button>
                        <button className="text-rose-500 hover:text-rose-600 bg-rose-50 p-1.5 rounded border border-rose-100 transition-colors"><FileText className="w-3.5 h-3.5" /></button>
                        <button className="text-text-secondary hover:text-text-secondary bg-input p-1.5 rounded border border-border transition-colors"><Printer className="w-3.5 h-3.5" /></button>
                        <button onClick={() => handleEdit(sale.id)} className="text-primary hover:text-primary bg-primary-light p-1.5 rounded border border-primary/20 transition-colors"><Pencil className="w-3.5 h-3.5" /></button>
                        <button onClick={() => handleDelete(sale.id)} className="text-red-500 hover:text-red-600 bg-red-50 p-1.5 rounded border border-red-100 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
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

  // Common input class
  const inputClass = "w-full bg-input border border-border focus:border-primary rounded-lg p-2.5 text-[12px] text-text-primary transition-all outline-none";
  const labelClass = "text-[10px] font-bold text-text-secondary uppercase tracking-wider mb-1.5 block";

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 lg:p-8 font-sans pb-20">
      
      <div className="flex items-center justify-between mb-6 bg-surface rounded-2xl shadow-sm border border-border/60 p-4">
        <div className="flex items-center gap-3">
          <button onClick={() => setIsFormOpen(false)} className="text-text-muted hover:text-text-secondary transition-colors ml-2">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-[18px] font-black text-text-primary tracking-tight uppercase">{editingId ? 'EDIT SALES ENTRY' : 'ADD SALES ENTRY'}</h1>
        </div>
      </div>

      <div className="bg-surface rounded-2xl shadow-sm border border-border/60 p-6 sm:p-8 mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-5 mb-8">
          <div>
            <label className={labelClass}>INVOICE NUMBER <span className="text-red-500">*</span></label>
            <input type="text" value={invoiceNo} onChange={e => setInvoiceNo(e.target.value)} className={inputClass} required />
          </div>
          <div>
            <label className={labelClass}>INVOICE DATE <span className="text-red-500">*</span></label>
            <input type="date" value={invoiceDate} onChange={e => setInvoiceDate(e.target.value)} className={inputClass} required />
          </div>
          <div>
            <label className={labelClass}>VEHICLE NUMBER</label>
            <input type="text" placeholder="GJ-01-XX-0000" value={vehicleNo} onChange={e => setVehicleNo(e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>ORDER NO.</label>
            <input type="text" placeholder="ORDER NO." value={orderNo} onChange={e => setOrderNo(e.target.value)} className={inputClass} />
          </div>

          <div>
            <label className={labelClass}>ORDER DATE</label>
            <input type="date" value={orderDate} onChange={e => setOrderDate(e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>LR NO.</label>
            <input type="text" placeholder="LR NO." value={lrNo} onChange={e => setLrNo(e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>LR DATE</label>
            <input type="date" value={lrDate} onChange={e => setLrDate(e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>DESP FROM</label>
            <input type="text" placeholder="CITY" value={despFrom} onChange={e => setDespFrom(e.target.value)} className={inputClass} />
          </div>

          <div>
            <label className={labelClass}>DESP TO</label>
            <input type="text" placeholder="TO" value={despTo} onChange={e => setDespTo(e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>PINCODE</label>
            <input type="text" placeholder="PIN NO." value={pincode} onChange={e => setPincode(e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>BUYER <span className="text-red-500">*</span></label>
            <select value={buyerId} onChange={e => setBuyerId(Number(e.target.value))} className={inputClass} required>
              <option value="">-- SELECT BUYER --</option>
              {accounts.map(a => <option key={a.id} value={a.id}>{a.name || a.account_name}</option>)}
            </select>
          </div>
          <div>
            <label className={labelClass}>BUYER GSTIN</label>
            <input type="text" value={buyerGstin} readOnly className={`${inputClass} bg-background text-text-secondary`} />
          </div>

          <div>
            <label className={labelClass}>CONSIGNEE</label>
            <select value={consigneeId} onChange={e => setConsigneeId(Number(e.target.value))} className={inputClass}>
              <option value="">-- SELECT CONSIGNEE --</option>
              {accounts.map(a => <option key={a.id} value={a.id}>{a.name || a.account_name}</option>)}
            </select>
          </div>
          <div>
            <label className={labelClass}>BOOK NAME</label>
            <select value={bookName} onChange={e => setBookName(e.target.value)} className={inputClass}>
              <option value="">-- SELECT BOOK --</option>
              <option value="book1">Book 1</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>E WAY BILL NO.</label>
            <input type="text" placeholder="E-WAY BILL NO." value={ewayBillNo} onChange={e => setEwayBillNo(e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>BILL DATE</label>
            <input type="date" value={billDate} onChange={e => setBillDate(e.target.value)} className={inputClass} />
          </div>

          <div>
            <label className={labelClass}>TRANSPORT</label>
            <select value={transport} onChange={e => setTransport(e.target.value)} className={inputClass}>
              <option value="">-- SELECT TRANSPORT --</option>
              {transports.map(t => <option key={t.id} value={t.id}>{t.name || t.transport_name}</option>)}
            </select>
          </div>
          <div>
            <label className={labelClass}>DISTANCE (KM)</label>
            <input type="text" value={distance} onChange={e => setDistance(e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>VEHICLE TYPE</label>
            <select value={vehicleType} onChange={e => setVehicleType(e.target.value)} className={inputClass}>
              <option value="R">Regular</option>
              <option value="O">Over Dimensional Cargo (ODC)</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-surface rounded-2xl shadow-sm border border-border/60 p-6 sm:p-8 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-[13px] font-black text-text-primary tracking-wide uppercase">SALES ITEMS LISTING</h2>
          <button onClick={handleAddItem} className="flex items-center gap-1.5 text-[11px] font-bold text-text-secondary hover:text-primary transition-colors bg-input px-3 py-1.5 rounded-md border border-border hover:border-primary/30">
            <Plus className="w-3 h-3" /> ADD ROW
          </button>
        </div>

        <div className="border border-border rounded-xl overflow-x-auto mb-8">
          <table className="w-full min-w-[900px] text-left text-[12px]">
            <thead className="bg-background text-text-secondary font-black uppercase tracking-wider border-b border-border">
              <tr>
                <th className="py-3 px-4 w-[5%] text-center rounded-tl-xl">#</th>
                <th className="py-3 px-4 w-[35%]">ITEM NAME</th>
                <th className="py-3 px-4 w-[12%] text-center">NOS</th>
                <th className="py-3 px-4 w-[15%] text-center">QUANTITY</th>
                <th className="py-3 px-4 w-[15%] text-center">RATE</th>
                <th className="py-3 px-4 w-[15%] text-right rounded-tr-xl">AMOUNT</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {items.map((item, idx) => (
                <tr key={item.id} className="hover:bg-input/50 transition-colors group relative">
                  <td className="py-3 px-4 text-center text-text-muted font-bold">{idx + 1}</td>
                  <td className="py-3 px-4">
                    <div className="relative">
                      <select value={item.item_id} onChange={(e) => handleItemChange(item.id, 'item_id', e.target.value)} className={`${inputClass} !bg-surface`}>
                        <option value="">-- ITEM --</option>
                        {itemsList.map(i => <option key={i.id} value={i.id}>{i.item_name || i.name}</option>)}
                      </select>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <input type="number" value={item.nos || ''} onChange={(e) => handleItemChange(item.id, 'nos', e.target.value)} className={`${inputClass} !bg-surface text-center`} />
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
        
        {/* Summary Box */}
        <div className="flex justify-end">
          <div className="w-full lg:w-[450px] border border-border rounded-xl overflow-hidden shadow-sm">
            <div className="bg-background px-5 py-3 border-b border-border">
              <h3 className="text-[12px] font-black text-text-primary tracking-wider uppercase">SALE BILL SUMMARY</h3>
            </div>
            <div className="p-5 space-y-3 bg-surface text-[12px] font-bold">
              <div className="flex justify-between items-center text-text-secondary">
                <span>TOTAL TAXABLE (+)</span>
                <span className="text-text-primary">₹ {totalTaxable.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
              </div>
              
              <div className="flex justify-between items-center border-t border-border/50 pt-3">
                <span className="text-text-secondary">CASH DISCOUNT (-)</span>
                <div className="flex items-center gap-4">
                  <div className="flex items-center border border-border rounded overflow-hidden w-24">
                    <input type="number" value={discountPercent} onChange={e => setDiscountPercent(e.target.value)} className="w-full px-2 py-1 text-center text-text-primary bg-input outline-none text-[11px]" />
                    <span className="bg-background px-2 py-1 text-text-secondary border-l border-border">%</span>
                  </div>
                  <span className="text-red-500 w-24 text-right">- ₹ {discountAmt.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                </div>
              </div>

              <div className="flex justify-between items-center border-t border-border/50 pt-3">
                <span className="text-text-secondary">FREIGHT / OTHER (+)</span>
                <input type="number" value={freight} onChange={e => setFreight(e.target.value)} className="w-24 px-2 py-1 text-right border border-border rounded outline-none focus:border-primary text-text-primary" />
              </div>

              <div className="flex justify-between items-center border-t border-border/50 pt-3">
                <div className="flex items-center gap-3">
                  <span className="text-text-secondary">LOADING (+)</span>
                  <button onClick={() => setLoadingType(t => t === 'AUTO' ? 'MANUAL' : 'AUTO')} className={`text-[9px] px-2 py-0.5 rounded border uppercase tracking-wider ${loadingType === 'AUTO' ? 'bg-emerald-50 border-emerald-200 text-emerald-600' : 'bg-input border-border text-text-secondary'}`}>
                    {loadingType}
                  </button>
                </div>
                {loadingType === 'AUTO' ? (
                  <span className="text-text-primary w-24 text-right">₹ {applicableLoading.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                ) : (
                  <input type="number" value={loadingAmt} onChange={e => setLoadingAmt(e.target.value)} className="w-24 px-2 py-1 text-right border border-border rounded outline-none focus:border-primary text-text-primary" />
                )}
              </div>

              {isIntrastate ? (
                <>
                  <div className="flex justify-between items-center border-t border-border/50 pt-3 text-text-secondary">
                    <span>CGST (9%) (+)</span>
                    <span className="text-text-primary">₹ {cgstAmount.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                  </div>
                  <div className="flex justify-between items-center border-t border-border/50 pt-3 text-text-secondary">
                    <span>SGST (9%) (+)</span>
                    <span className="text-text-primary">₹ {sgstAmount.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                  </div>
                </>
              ) : (
                <div className="flex justify-between items-center border-t border-border/50 pt-3 text-text-secondary">
                  <span>IGST (18%) (+)</span>
                  <span className="text-text-primary">₹ {igstAmount.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                </div>
              )}

              <div className="flex justify-between items-center border-t border-border/50 pt-3 text-text-secondary">
                <span>GROSS AMOUNT</span>
                <span className="text-text-primary">₹ {grossAmount.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
              </div>
              
              <div className="flex justify-between items-center border-t border-border/50 pt-3 text-text-secondary">
                <span>ROUND OFF (+/-)</span>
                <span className={roundOff >= 0 ? "text-emerald-500" : "text-red-500"}>{roundOff > 0 ? '+' : ''} ₹ {Math.abs(roundOff).toFixed(2)}</span>
              </div>

              <div className="flex justify-between items-center border-t border-border pt-4 mt-2">
                <span className="text-[14px] font-black text-text-primary tracking-wider uppercase">NET PAYABLE</span>
                <span className="text-[22px] font-black text-text-primary">₹ {netPayable.toLocaleString()}</span>
              </div>

              <div className="pt-4 flex gap-3">
                 <button onClick={handleSubmit} className="flex-1 bg-primary hover:bg-primary-hover text-white py-3 rounded-lg text-[11px] font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-colors">
                    <Save className="w-4 h-4" /> {editingId ? 'UPDATE ENTRY' : 'SAVE ENTRY'}
                 </button>
                 <button onClick={() => setIsFormOpen(false)} className="px-6 bg-background hover:bg-slate-200 text-text-primary py-3 rounded-lg text-[11px] font-black uppercase tracking-wider transition-colors">
                    CANCEL
                 </button>
              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
