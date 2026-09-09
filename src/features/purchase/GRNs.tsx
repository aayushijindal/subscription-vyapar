import { useState, useEffect } from 'react';
import { Plus, Search, X, Save, Pencil, Trash2, Download, FileText, Printer, FileSpreadsheet, Upload } from 'lucide-react';
import toast from 'react-hot-toast';
import { purchaseApi } from '@/services/api/purchase';

export const GRNsPage = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [purchasesList, setPurchasesList] = useState<any[]>([]);
  const [parties, setParties] = useState<any[]>([]);
  const [itemsList, setItemsList] = useState<any[]>([]);
  const [grnsList, setGrnsList] = useState<any[]>([]);

  // Form State
  const [purchaseId, setPurchaseId] = useState('');
  const [challanNo, setChallanNo] = useState('');
  const [grnDate, setGrnDate] = useState(new Date().toISOString().split('T')[0]);
  const [partyId, setPartyId] = useState('');
  const [vehicleNo, setVehicleNo] = useState('');
  const [items, setItems] = useState<any[]>([{ id: 1, item_id: '', nos: 0, quantity: 0, rate: 0, amount: 0 }]);

  const fetchData = async () => {
    try {
      const [pRes, aRes, iRes, gRes] = await Promise.all([
        purchaseApi.getPurchases(),
        purchaseApi.getAccounts(),
        purchaseApi.getItems('RAW'),
        purchaseApi.getGRNs()
      ]);
      setPurchasesList(pRes.data?.results || pRes.data || []);
      setParties(aRes.data?.results || aRes.data || []);
      setItemsList(iRes.data?.results || iRes.data || []);
      setGrnsList(gRes.data?.results || gRes.data || []);
    } catch (err) {
      console.error(err);
      toast.error('Error fetching data');
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react/set-state-in-effect
    void fetchData();
  }, []);

  const handleAddItem = () => {
    setItems([...items, { id: Date.now(), item_id: '', nos: 0, quantity: 0, rate: 0, amount: 0 }]);
  };

  const handleRemoveItem = (id: number) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  const updateItem = (id: number, field: string, value: any) => {
    setItems(items.map(item => {
      if (item.id === id) {
        const updated = { ...item, [field]: value };
        if (field === 'quantity' || field === 'rate') {
          updated.amount = Number((updated.quantity * updated.rate).toFixed(2));
        }
        return updated;
      }
      return item;
    }));
  };

  const handleNewEntry = () => {
    setEditingId(null);
    setPurchaseId('');
    setChallanNo('');
    setGrnDate(new Date().toISOString().split('T')[0]);
    setPartyId('');
    setVehicleNo('');
    setItems([{ id: 1, item_id: '', nos: 0, quantity: 0, rate: 0, amount: 0 }]);
    setIsFormOpen(true);
  };

  const handleEdit = async (id: number) => {
    try {
      const res = await purchaseApi.getGRN(id);
      const grn = res.data;
      setEditingId(id);
      setPurchaseId(grn.purchase_id || grn.purchase || '');
      setChallanNo(grn.grn_no || grn.challan_no || '');
      setGrnDate(grn.grn_date || grn.date || '');
      setPartyId(grn.party_id || grn.party || '');
      setVehicleNo(grn.vehicle_no || '');
      if (grn.items && grn.items.length > 0) {
        setItems(grn.items.map((i: any) => ({ ...i, id: i.id || Date.now() + Math.random(), item_id: i.item_id || i.item })));
      } else {
        setItems([{ id: 1, item_id: '', nos: 0, quantity: 0, rate: 0, amount: 0 }]);
      }
      setIsFormOpen(true);
    } catch (err) {
      console.error(err);
      toast.error('Error fetching GRN details');
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this GRN?')) {
      try {
        await purchaseApi.deleteGRN(id);
        toast.success('GRN deleted successfully');
        fetchData();
      } catch (err) {
        console.error(err);
        toast.error('Error deleting GRN');
      }
    }
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        purchase: purchaseId || null,
        grn_no: challanNo,
        grn_date: grnDate,
        party: partyId,
        vehicle_no: vehicleNo,
        items: items.map(i => ({
          item: i.item_id,
          nos: Number(i.nos) || 0,
          quantity: Number(i.quantity) || 0,
          rate: Number(i.rate) || 0,
          amount: Number(i.amount) || 0
        }))
      };

      if (editingId) {
        await purchaseApi.updateGRN(editingId, payload);
        toast.success('GRN updated successfully');
      } else {
        await purchaseApi.createGRN(payload);
        toast.success('GRN created successfully');
      }
      setIsFormOpen(false);
      fetchData();
    } catch (err) {
      console.error(err);
      toast.error('Error saving GRN. Check details.');
    }
  };

  if (!isFormOpen) {
    return (
      <div className="min-h-screen bg-[#F8F9FC] p-4 sm:p-6 lg:p-8 font-sans">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white rounded-2xl shadow-sm border border-slate-200/60 p-5 mb-6">
          <div>
            <h1 className="text-[18px] font-black text-[#1E293B] tracking-tight uppercase">GRN ENTRY LIST</h1>
            <p className="text-[11px] font-bold text-slate-400 uppercase mt-0.5">Manage goods receipt notes</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input type="text" placeholder="Search GRN..." className="w-[200px] bg-slate-50 border border-slate-200 focus:border-[#1E293B] focus:bg-white rounded-xl pl-9 pr-4 py-2 text-[12px] font-medium outline-none transition-all" />
            </div>
            <button className="bg-slate-200 hover:bg-slate-300 text-slate-700 px-4 py-2 rounded-xl text-[12px] font-bold flex items-center gap-1.5 transition-colors">
              <FileSpreadsheet className="w-3.5 h-3.5" /> Excel
            </button>
            <button className="bg-slate-200 hover:bg-slate-300 text-slate-700 px-4 py-2 rounded-xl text-[12px] font-bold flex items-center gap-1.5 transition-colors">
              <FileText className="w-3.5 h-3.5" /> PDF
            </button>
            <button className="bg-[#1E293B] hover:bg-[#0F172A] text-white px-4 py-2 rounded-xl text-[12px] font-bold flex items-center gap-1.5 transition-colors">
              <Upload className="w-3.5 h-3.5" /> Import
            </button>
            <button onClick={handleNewEntry} className="bg-[#1E293B] hover:bg-[#0F172A] text-white px-4 py-2 rounded-xl text-[12px] font-bold flex items-center gap-1.5 transition-colors">
              <Plus className="w-4 h-4" /> Add New
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden">
          {grnsList.length === 0 ? (
            <div className="p-12 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                <Search className="w-8 h-8 text-slate-300" />
              </div>
              <h3 className="text-[15px] font-black text-slate-700 uppercase tracking-wide">No Entries Found</h3>
              <p className="text-[13px] text-slate-500 mt-1 max-w-sm">You haven't recorded any entries yet. Click "Add New" to get started.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-[11px] font-bold">
                <thead className="bg-[#F8F9FC] text-slate-500 uppercase tracking-wider border-b border-slate-200/60">
                  <tr>
                    <th className="py-4 px-4 w-[40px] text-center"><input type="checkbox" className="rounded border-slate-300" /></th>
                    <th className="py-4 px-4">DATE</th>
                    <th className="py-4 px-4">PURCHASE BILL NO</th>
                    <th className="py-4 px-4">CHALLAN NO</th>
                    <th className="py-4 px-4">PARTY</th>
                    <th className="py-4 px-4 text-center">ACTIONS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {grnsList.map((grn) => {
                    const partyId = grn.party_id || grn.party;
                    const partyName = grn.party_name || (Array.isArray(parties) ? (parties.find(p => p.id === partyId)?.name || parties.find(p => p.id === partyId)?.account_name || partyId) : partyId);
                    const dateStr = grn.grn_date || grn.date ? new Date(grn.grn_date || grn.date).toLocaleDateString('en-GB').replace(/\//g, '-') : '-';
                    return (
                    <tr key={grn.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-4 px-4 text-center"><input type="checkbox" className="rounded border-slate-300" /></td>
                      <td className="py-4 px-4 text-slate-500">{dateStr}</td>
                      <td className="py-4 px-4 font-bold text-[#4338CA]">{grn.purchase_no_display || '-'}</td>
                      <td className="py-4 px-4 text-[#1E293B]">{grn.grn_no || grn.challan_no || '-'}</td>
                      <td className="py-4 px-4 text-[#1E293B] uppercase">{partyName || '-'}</td>
                      <td className="py-4 px-4 text-center">
                        <div className="flex justify-center items-center gap-2">
                          <button className="text-emerald-500 hover:text-emerald-600 bg-emerald-50 p-1.5 rounded transition-colors"><Download className="w-3.5 h-3.5" /></button>
                          <button className="text-rose-500 hover:text-rose-600 bg-rose-50 p-1.5 rounded transition-colors"><FileText className="w-3.5 h-3.5" /></button>
                          <button className="text-slate-500 hover:text-slate-600 bg-slate-100 p-1.5 rounded transition-colors"><Printer className="w-3.5 h-3.5" /></button>
                          <button onClick={() => handleEdit(grn.id)} className="text-blue-500 hover:text-blue-600 bg-blue-50 p-1.5 rounded transition-colors"><Pencil className="w-3.5 h-3.5" /></button>
                          <button onClick={() => handleDelete(grn.id)} className="text-red-500 hover:text-red-600 bg-red-50 p-1.5 rounded transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
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
      <div className="flex justify-between items-center bg-white rounded-xl shadow-sm border border-slate-200/60 p-4 mb-6">
        <div className="flex items-center gap-3">
          <button onClick={() => setIsFormOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
          <h1 className="text-[18px] font-black text-[#1E293B] tracking-tight uppercase">{editingId ? 'Edit GRN Entry' : 'New GRN Entry'}</h1>
        </div>
        <div className="text-[10px] font-bold text-red-500 bg-red-50 px-3 py-1.5 rounded-md border border-red-100 uppercase tracking-wider">
          (*) REQUIRED FIELDS
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden mb-6">
        <div className="p-6 sm:p-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6 mb-10">
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-[#1E293B] uppercase tracking-wider">Purchase Bill No</label>
              <select value={purchaseId} onChange={(e) => setPurchaseId(e.target.value)} className="w-full bg-white border border-slate-200 focus:border-[#4338CA] focus:ring-1 focus:ring-[#4338CA] rounded-lg p-2.5 text-[13px] text-slate-500 transition-all outline-none">
                <option value="">SELECT BILL</option>
                {purchasesList.map((p: any) => <option key={p.id} value={p.id}>{p.invoice_no || p.purchase_no}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-[#1E293B] uppercase tracking-wider">Challan No <span className="text-red-500">*</span></label>
              <input type="text" value={challanNo} onChange={(e) => setChallanNo(e.target.value)} placeholder="CHALLAN NO" className="w-full bg-white border border-slate-200 focus:border-[#4338CA] focus:ring-1 focus:ring-[#4338CA] rounded-lg p-2.5 text-[13px] text-slate-700 transition-all outline-none placeholder:text-slate-300" />
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-[#1E293B] uppercase tracking-wider">Date <span className="text-red-500">*</span></label>
              <input type="date" value={grnDate} onChange={(e) => setGrnDate(e.target.value)} className="w-full bg-white border border-slate-200 focus:border-[#4338CA] focus:ring-1 focus:ring-[#4338CA] rounded-lg p-2.5 text-[13px] text-slate-700 transition-all outline-none" />
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-[#1E293B] uppercase tracking-wider">Party <span className="text-red-500">*</span></label>
              <select value={partyId} onChange={(e) => setPartyId(e.target.value)} className="w-full bg-white border border-slate-200 focus:border-[#4338CA] focus:ring-1 focus:ring-[#4338CA] rounded-lg p-2.5 text-[13px] text-slate-500 transition-all outline-none">
                <option value="">SELECT PARTY</option>
                {parties.map((p: any) => <option key={p.id} value={p.id}>{p.name || p.account_name}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-[#1E293B] uppercase tracking-wider">Vehicle No</label>
              <input type="text" value={vehicleNo} onChange={(e) => setVehicleNo(e.target.value)} placeholder="GJ-01-XX-0000" className="w-full bg-[#F8F9FC] border border-slate-200 focus:border-[#4338CA] focus:ring-1 focus:ring-[#4338CA] rounded-lg p-2.5 text-[13px] text-slate-700 transition-all outline-none placeholder:text-slate-400" />
            </div>
          </div>

          <hr className="border-slate-100 mb-8" />

          {/* Dynamic Items Section */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-[14px] font-black text-[#1E293B] tracking-wide uppercase">GRN Items</h2>
            <button onClick={handleAddItem} className="flex items-center gap-1.5 text-[11px] font-bold text-slate-600 hover:text-[#4338CA] transition-colors bg-slate-50 px-3 py-1.5 rounded-md border border-slate-200 hover:border-[#4338CA]/30">
              <Plus className="w-3 h-3" /> ADD ROW
            </button>
          </div>

          <div className="border border-slate-200/60 rounded-xl overflow-hidden mb-12">
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
                    <td className="py-3 px-4 text-center font-medium text-[#4338CA]">{idx + 1}</td>
                    <td className="py-3 px-4">
                      <select value={item.item_id || item.item || ''} onChange={(e) => updateItem(item.id, 'item_id', e.target.value)} className="w-full bg-white border border-slate-200 rounded-md p-2 text-[13px] text-slate-500 outline-none focus:border-[#4338CA]">
                        <option value="">-- SELECT ITEM --</option>
                        {itemsList.map((i: any) => <option key={i.id} value={i.id}>{i.item_name || i.name}</option>)}
                      </select>
                    </td>
                    <td className="py-3 px-4">
                      <input type="number" value={item.nos || ''} onChange={(e) => updateItem(item.id, 'nos', e.target.value)} className="w-full bg-white border border-slate-200 rounded-md p-2 text-[13px] text-center text-slate-700 outline-none focus:border-[#4338CA]" />
                    </td>
                    <td className="py-3 px-4">
                      <input type="number" value={item.quantity || ''} onChange={(e) => updateItem(item.id, 'quantity', e.target.value)} className="w-full bg-white border border-slate-200 rounded-md p-2 text-[13px] text-center text-slate-700 outline-none focus:border-[#4338CA]" />
                    </td>
                    <td className="py-3 px-4">
                      <input type="number" value={item.rate || ''} onChange={(e) => updateItem(item.id, 'rate', e.target.value)} className="w-full bg-white border border-slate-200 rounded-md p-2 text-[13px] text-center text-slate-700 outline-none focus:border-[#4338CA]" />
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-slate-700">
                      ₹ {item.amount || 0}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button onClick={() => handleRemoveItem(item.id)} className="text-slate-300 hover:text-red-500 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-end gap-4 pt-6 border-t border-slate-100">
            <button onClick={() => setIsFormOpen(false)} className="text-[12px] font-bold text-slate-500 hover:text-slate-700 uppercase tracking-wider px-4 py-2">
              Cancel
            </button>
            <button onClick={handleSubmit} className="bg-[#0F172A] hover:bg-black text-white px-8 py-3 rounded-lg text-[12px] font-bold uppercase tracking-wider flex items-center gap-2 shadow-sm transition-colors">
              <Save className="w-4 h-4" /> {editingId ? 'Update GRN' : 'Save GRN'}
            </button>
          </div>
          
        </div>
      </div>
    </div>
  );
};
