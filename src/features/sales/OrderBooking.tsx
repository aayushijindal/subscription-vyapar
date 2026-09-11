import React, { useState, useEffect } from 'react';
import { Plus, Search, X, Save, Pencil, Trash2, FileText, Printer, FileSpreadsheet, Upload, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import { purchaseApi } from '../../services/api/purchase';
import { salesApi } from '../../services/api/sales';

export const OrderBookingPage: React.FC = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [parties, setParties] = useState<any>([]);
  const [itemsList, setItemsList] = useState<any>([]);
  const [orders, setOrders] = useState<any[]>([]);

  // Form State
  const [editingId, setEditingId] = useState<number | null>(null);
  const [bookingDate, setBookingDate] = useState(new Date().toISOString().split('T')[0]);
  const [orderNo, setOrderNo] = useState('');
  const [partyId, setPartyId] = useState<number | ''>('');
  const [vehicleNo, setVehicleNo] = useState('');

  const [items, setItems] = useState(() => [{ id: Date.now(), item_id: '', pcs_kg: '0', pcs: 0, quantity: 0, rate: 0, scrap: 0, net_amount: 0 }]);

  useEffect(() => {
    // Fetch dropdown data
    purchaseApi.getAccounts().then(res => setParties(res.data)).catch(console.error);
    purchaseApi.getItems().then(res => setItemsList(res.data)).catch(console.error);
  }, []);

  useEffect(() => {
    if (!isFormOpen) {
      salesApi.orderBooking.list().then(res => setOrders(Array.isArray(res) ? res : (res.results || []))).catch(console.error);
    }
  }, [isFormOpen]);

  const handleAddItem = () => {
    setItems([...items, { id: Date.now(), item_id: '', pcs_kg: '0', pcs: 0, quantity: 0, rate: 0, scrap: 0, net_amount: 0 }]);
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
        if (field === 'quantity' || field === 'rate' || field === 'scrap') {
          const qty = Number(updated.quantity || 0);
          const rate = Number(updated.rate || 0);
          const scrap = Number(updated.scrap || 0);
          updated.net_amount = (qty * rate) - scrap;
        }
        return updated;
      }
      return item;
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!partyId) {
      toast.error('Party / Supplier is mandatory');
      return;
    }
    try {
      const payload = {
        date: bookingDate,
        order_no: orderNo,
        party_id: partyId,
        vehicle_no: vehicleNo,
        items: items.map(item => ({
          item_id: item.item_id,
          pcs_kg: item.pcs_kg,
          pcs: item.pcs,
          quantity: item.quantity,
          rate: item.rate,
          scrap: item.scrap,
          net_amount: item.net_amount
        }))
      };

      if (editingId) {
        await salesApi.orderBooking.update(editingId, payload);
        toast.success('Order Booking updated successfully!');
      } else {
        await salesApi.orderBooking.create(payload);
        toast.success('Order Booking created successfully!');
      }

      setIsFormOpen(false);
      setEditingId(null);
    } catch (err) {
      toast.error('Error saving order booking. Please check mandatory fields.');
      console.error(err);
    }
  };

  const handleEdit = async (id: number) => {
    try {
      const order = await salesApi.orderBooking.get(id);
      
      setEditingId(id);
      setBookingDate(order.date || new Date().toISOString().split('T')[0]);
      setOrderNo(order.order_no || '');
      setPartyId(order.party_id || '');
      setVehicleNo(order.vehicle_no || '');
      
      if (order.items && order.items.length > 0) {
        setItems(order.items.map((i: any) => ({ ...i, id: i.id || Date.now() + Math.random() })));
      } else {
        setItems([{ id: 1, item_id: '', pcs_kg: '0', pcs: 0, quantity: 0, rate: 0, scrap: 0, net_amount: 0 }]);
      }
      
      setIsFormOpen(true);
    } catch (err) {
      console.error(err);
      toast.error('Error fetching order details');
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      try {
        await salesApi.orderBooking.delete(id);
        setOrders(orders.filter(o => o.id !== id));
        toast.success('Order deleted successfully');
      } catch (err) {
        console.error(err);
        toast.error('Error deleting order');
      }
    }
  };

  const handleNewEntry = () => {
    setEditingId(null);
    setBookingDate(new Date().toISOString().split('T')[0]);
    setOrderNo('');
    setPartyId('');
    setVehicleNo('');
    setItems([{ id: Date.now(), item_id: '', pcs_kg: '0', pcs: 0, quantity: 0, rate: 0, scrap: 0, net_amount: 0 }]);
    setIsFormOpen(true);
  };

  if (!isFormOpen) {
    return (
      <div className="min-h-screen bg-background p-4 sm:p-6 lg:p-8 font-sans">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-surface rounded-2xl shadow-sm border border-border/60 p-5 mb-6">
          <div>
            <h1 className="text-[20px] font-black text-text-primary tracking-tight uppercase">BOOK ORDER LIST</h1>
            <p className="text-[11px] font-bold text-text-secondary uppercase mt-0.5 tracking-wider">SALES MANAGEMENT</p>
          </div>
          <div className="flex flex-wrap items-center gap-3 mt-4 sm:mt-0">
            <button className="text-emerald-500 hover:text-emerald-600 bg-emerald-50 p-2.5 rounded-xl transition-colors border border-emerald-100">
              <FileSpreadsheet className="w-4 h-4" />
            </button>
            <button className="text-rose-500 hover:text-rose-600 bg-rose-50 p-2.5 rounded-xl transition-colors border border-rose-100">
              <FileText className="w-4 h-4" />
            </button>
            <button className="text-text-secondary hover:text-text-secondary bg-input p-2.5 rounded-xl transition-colors border border-border">
              <Printer className="w-4 h-4" />
            </button>
            <button className="bg-background hover:bg-slate-200 text-text-primary px-4 py-2.5 rounded-xl text-[12px] font-bold flex items-center gap-2 transition-colors border border-border uppercase tracking-wider">
              <Upload className="w-4 h-4" /> Import
            </button>
            <button onClick={handleNewEntry} className="bg-primary hover:bg-primary-hover text-white px-5 py-2.5 rounded-xl text-[12px] font-bold flex items-center gap-2 transition-colors uppercase tracking-wider">
              <Plus className="w-4 h-4" /> Add New
            </button>
          </div>
        </div>

        {/* Filters Section */}
        <div className="bg-surface rounded-2xl shadow-sm border border-border/60 p-5 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Search className="w-4 h-4 text-primary" />
            <h2 className="text-[12px] font-black text-text-primary uppercase tracking-wider">ADVANCED SEARCH & FILTERS</h2>
          </div>
          <div className="flex flex-wrap items-end gap-4">
            <div className="flex-1 min-w-[140px]">
              <label className="block text-[10px] font-bold text-text-secondary uppercase tracking-wider mb-1.5 flex items-center gap-1"><Search className="w-3 h-3"/> GLOBAL SEARCH</label>
              <input type="text" placeholder="Search anything..." className="w-full bg-input border border-border focus:border-primary rounded-lg px-3 py-2 text-[13px] text-text-primary outline-none transition-colors" />
            </div>
            <div className="flex-1 min-w-[140px]">
              <label className="block text-[10px] font-bold text-text-secondary uppercase tracking-wider mb-1.5 flex items-center gap-1">PARTY FILTER</label>
              <select className="w-full bg-input border border-border focus:border-primary rounded-lg px-3 py-2 text-[13px] text-text-primary outline-none transition-colors">
                <option>All Parties</option>
                {(Array.isArray(parties) ? parties : parties?.results || []).map((p: any) => <option key={p.id} value={p.id}>{p.name || p.account_name}</option>)}
              </select>
            </div>
            <div className="flex-1 min-w-[140px]">
              <label className="block text-[10px] font-bold text-text-secondary uppercase tracking-wider mb-1.5 flex items-center gap-1">ITEM FILTER</label>
              <select className="w-full bg-input border border-border focus:border-primary rounded-lg px-3 py-2 text-[13px] text-text-primary outline-none transition-colors">
                <option>All Items</option>
                {(Array.isArray(itemsList) ? itemsList : itemsList?.results || []).map((i: any) => <option key={i.id} value={i.id}>{i.item_name || i.name}</option>)}
              </select>
            </div>
            <div className="flex-1 min-w-[140px]">
              <label className="block text-[10px] font-bold text-text-secondary uppercase tracking-wider mb-1.5 flex items-center gap-1"># ORDER NO.</label>
              <input type="text" placeholder="SEARCH ORDER #" className="w-full bg-input border border-border focus:border-primary rounded-lg px-3 py-2 text-[13px] text-text-primary outline-none transition-colors" />
            </div>
            <div className="flex-none w-full sm:w-auto sm:flex-1 min-w-[280px]">
              <label className="block text-[10px] font-bold text-text-secondary uppercase tracking-wider mb-1.5 flex items-center gap-1">DATE RANGE</label>
              <div className="flex items-center gap-2">
                <input type="date" className="w-full bg-input border border-border focus:border-primary rounded-lg px-2 py-2 text-[12px] text-text-primary outline-none transition-colors" />
                <span className="text-text-muted">-</span>
                <input type="date" className="w-full bg-input border border-border focus:border-primary rounded-lg px-2 py-2 text-[12px] text-text-primary outline-none transition-colors" />
              </div>
            </div>
          </div>
        </div>

        {/* Table Section */}
        <div className="bg-surface rounded-2xl shadow-sm border border-border/60 overflow-hidden">
          {orders.length === 0 ? (
            <div className="p-12 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 bg-input rounded-full flex items-center justify-center mb-4">
                <Search className="w-8 h-8 text-slate-300" />
              </div>
              <h3 className="text-[15px] font-black text-text-primary uppercase tracking-wide">No Orders Found</h3>
              <p className="text-[13px] text-text-secondary mt-1 max-w-sm">No bookings match your current criteria. Click "Add New" to create one.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-[12px] font-bold">
                <thead className="bg-background text-text-secondary uppercase tracking-wider border-b border-border/60">
                  <tr>
                    <th className="py-4 px-5 w-[40px] text-center"><input type="checkbox" className="rounded border-border" /></th>
                    <th className="py-4 px-5">DATE</th>
                    <th className="py-4 px-5">ORDER NO.</th>
                    <th className="py-4 px-5">PARTY</th>
                    <th className="py-4 px-5">VEHICLE NO.</th>
                    <th className="py-4 px-5 text-center">STATUS</th>
                    <th className="py-4 px-5 text-center">ACTIONS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {orders.map((order) => {
                    const partyName = Array.isArray(parties) ? (parties.find(p => p.id === order.party_id)?.name || parties.find(p => p.id === order.party_id)?.account_name || order.party_id) : order.party_id;
                    const dateStr = order.date ? new Date(order.date).toLocaleDateString('en-GB').replace(/\//g, '-') : '-';
                    // Pseudo status logic
                    const isCompleted = order.status === 'COMPLETED';
                    return (
                      <tr key={order.id} className="hover:bg-input/50 transition-colors">
                        <td className="py-4 px-5 text-center"><input type="checkbox" className="rounded border-border" /></td>
                        <td className="py-4 px-5 text-text-secondary">{dateStr}</td>
                        <td className="py-4 px-5 text-text-primary">{order.order_no || '--'}</td>
                        <td className="py-4 px-5 text-text-primary uppercase">{partyName || '--'}</td>
                        <td className="py-4 px-5 text-text-secondary">{order.vehicle_no || '--'}</td>
                        <td className="py-4 px-5 text-center">
                          {isCompleted ? (
                            <span className="px-2.5 py-1 text-[10px] border border-emerald-500 text-emerald-600 rounded bg-emerald-50 font-black uppercase tracking-wider">COMPLETED</span>
                          ) : (
                            <span className="px-2.5 py-1 text-[10px] border border-primary/50 text-primary rounded bg-primary-light font-black uppercase tracking-wider">PENDING</span>
                          )}
                        </td>
                        <td className="py-4 px-5 text-center">
                          <div className="flex justify-center items-center gap-2">
                            <button onClick={() => handleEdit(order.id)} className="text-primary hover:text-primary bg-primary-light p-1.5 rounded border border-primary/20 transition-colors"><Pencil className="w-3.5 h-3.5" /></button>
                            <button onClick={() => handleDelete(order.id)} className="text-red-500 hover:text-red-600 bg-red-50 p-1.5 rounded border border-red-100 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
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
      <div className="flex items-center justify-between mb-6 bg-surface rounded-2xl shadow-sm border border-border/60 p-4">
        <div className="flex items-center gap-3">
          <button onClick={() => setIsFormOpen(false)} className="text-text-muted hover:text-text-secondary transition-colors ml-2">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-[18px] font-black text-text-primary tracking-tight uppercase">{editingId ? 'EDIT ORDER ENTRY' : 'BOOK ORDER ENTRY'}</h1>
        </div>
        <div className="bg-red-50 border border-red-100 text-red-500 text-[10px] font-bold px-3 py-1.5 rounded uppercase tracking-wider">
          (*) MANDATORY FIELDS
        </div>
      </div>

      <div className="bg-surface rounded-2xl shadow-sm border border-border/60 overflow-hidden mb-6 p-6 sm:p-8">
        {/* Top Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6 mb-10">
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-text-secondary uppercase tracking-wider">DATE <span className="text-red-500">*</span></label>
            <input type="date" className="w-full bg-surface border border-border focus:border-primary rounded-lg p-2.5 text-[13px] text-text-primary transition-all outline-none" value={bookingDate} onChange={(e) => setBookingDate(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-text-secondary uppercase tracking-wider">BOOKING ORDER NO.</label>
            <input type="text" placeholder="ORDER NO." className="w-full bg-input border border-border focus:border-primary rounded-lg p-2.5 text-[13px] text-text-primary transition-all outline-none placeholder:text-text-muted" value={orderNo} onChange={(e) => setOrderNo(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-text-secondary uppercase tracking-wider">PARTY / SUPPLIER <span className="text-red-500">*</span></label>
            <select value={partyId} onChange={(e) => setPartyId(Number(e.target.value))} className="w-full bg-surface border border-border focus:border-primary rounded-lg p-2.5 text-[13px] text-text-primary transition-all outline-none">
              <option value="">-- SELECT PARTY --</option>
              {(Array.isArray(parties) ? parties : parties?.results || []).map((p: any) => <option key={p.id} value={p.id}>{p.name || p.account_name}</option>)}
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-text-secondary uppercase tracking-wider">VEHICLE NO.</label>
            <input type="text" placeholder="VEHICLE NO." className="w-full bg-input border border-border focus:border-primary rounded-lg p-2.5 text-[13px] text-text-primary transition-all outline-none placeholder:text-text-muted" value={vehicleNo} onChange={(e) => setVehicleNo(e.target.value)} />
          </div>
        </div>

        <hr className="border-border/50 mb-8" />

        {/* Items Listing */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-[13px] font-black text-text-primary tracking-wide uppercase">ORDER ITEMS LISTING</h2>
          <button onClick={handleAddItem} className="flex items-center gap-1.5 text-[11px] font-bold text-text-secondary hover:text-primary transition-colors bg-input px-3 py-1.5 rounded-md border border-border hover:border-primary/30">
            <Plus className="w-3 h-3" /> ADD ROW
          </button>
        </div>

        <div className="border border-border rounded-xl overflow-x-auto mb-8">
          <table className="w-full min-w-[900px] text-left text-[12px]">
            <thead className="bg-primary text-white font-black uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4 w-[25%] rounded-tl-xl">ITEM NAME</th>
                <th className="py-3 px-4 w-[10%] text-center">PCS/KG</th>
                <th className="py-3 px-4 w-[10%] text-center">PCS</th>
                <th className="py-3 px-4 w-[10%] text-center">QUANTITY</th>
                <th className="py-3 px-4 w-[12%] text-center">RATE</th>
                <th className="py-3 px-4 w-[12%] text-center">SCRAP (-)</th>
                <th className="py-3 px-4 w-[15%] text-right">NET AMOUNT</th>
                <th className="py-3 px-4 w-[5%] text-center rounded-tr-xl">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {items.map((item) => (
                <tr key={item.id} className="hover:bg-input transition-colors">
                  <td className="py-3 px-4">
                    <select value={item.item_id} onChange={(e) => handleItemChange(item.id, 'item_id', e.target.value)} className="w-full bg-surface border border-border rounded p-2 text-[13px] text-text-secondary outline-none focus:border-primary">
                      <option value="">-- ITEM --</option>
                      {(Array.isArray(itemsList) ? itemsList : itemsList?.results || []).map((i: any) => <option key={i.id} value={i.id}>{i.item_name || i.name}</option>)}
                    </select>
                  </td>
                  <td className="py-3 px-4">
                    <input type="text" value={item.pcs_kg || '0'} onChange={(e) => handleItemChange(item.id, 'pcs_kg', e.target.value)} className="w-full bg-input border border-border rounded p-2 text-[13px] text-center text-text-primary outline-none focus:border-primary" />
                  </td>
                  <td className="py-3 px-4">
                    <input type="number" value={item.pcs || ''} onChange={(e) => handleItemChange(item.id, 'pcs', e.target.value)} placeholder="0" className="w-full bg-input border border-border rounded p-2 text-[13px] text-center text-text-primary outline-none focus:border-primary" />
                  </td>
                  <td className="py-3 px-4">
                    <input type="number" value={item.quantity || ''} onChange={(e) => handleItemChange(item.id, 'quantity', e.target.value)} placeholder="0" className="w-full bg-input border border-border rounded p-2 text-[13px] text-center text-text-primary outline-none focus:border-primary" />
                  </td>
                  <td className="py-3 px-4">
                    <input type="number" value={item.rate || ''} onChange={(e) => handleItemChange(item.id, 'rate', e.target.value)} placeholder="0" className="w-full bg-input border border-border rounded p-2 text-[13px] text-center text-text-primary outline-none focus:border-primary" />
                  </td>
                  <td className="py-3 px-4">
                    <input type="number" value={item.scrap || ''} onChange={(e) => handleItemChange(item.id, 'scrap', e.target.value)} placeholder="0" className="w-full bg-input border border-border rounded p-2 text-[13px] text-center text-text-primary outline-none focus:border-primary" />
                  </td>
                  <td className="py-3 px-4 text-right font-black text-text-primary">
                    ₹ {(Number(item.net_amount) || 0).toFixed(2)}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <button onClick={() => handleRemoveItem(item.id)} className="text-slate-300 hover:text-red-500 transition-colors p-1">
                      <X className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Form Actions */}
        <div className="flex items-center justify-center gap-4">
          <button onClick={handleSubmit} className="bg-primary hover:bg-primary-hover text-white px-8 py-3 rounded-xl text-[13px] font-black uppercase tracking-wider flex items-center gap-2 transition-colors shadow-sm">
            <Save className="w-4 h-4" /> SUBMIT ORDER
          </button>
          <button onClick={() => setIsFormOpen(false)} className="bg-background hover:bg-slate-200 text-text-primary px-8 py-3 rounded-xl text-[13px] font-black uppercase tracking-wider transition-colors shadow-sm">
            CANCEL
          </button>
        </div>

      </div>
    </div>
  );
};
