import { useState, useEffect } from 'react';
import { Plus, X, Save, Pencil, Trash2, Upload, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { purchaseApi } from '@/services/api/purchase';
import { Table } from '../../components/ui/Table';

export const GRNsPage = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [purchasesList, setPurchasesList] = useState<any[]>([]);
  const [parties, setParties] = useState<any[]>([]);
  const [itemsList, setItemsList] = useState<any[]>([]);
  const [grnsList, setGrnsList] = useState<any[]>([]);

  const [isTableLoading, setIsTableLoading] = useState(false);
  const [isMasterLoading, setIsMasterLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [purchaseId, setPurchaseId] = useState('');
  const [challanNo, setChallanNo] = useState('');
  const [grnDate, setGrnDate] = useState(new Date().toISOString().split('T')[0]);
  const [partyId, setPartyId] = useState('');
  const [vehicleNo, setVehicleNo] = useState('');
  const [items, setItems] = useState<any[]>([{ id: 1, item_id: '', nos: 0, quantity: 0, rate: 0, amount: 0 }]);

  const fetchData = async () => {
    setIsTableLoading(true);
    setIsMasterLoading(true);
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
    } finally {
      setIsTableLoading(false);
      setIsMasterLoading(false);
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
    setIsSubmitting(true);
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
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isFormOpen) {
    return (
      <div className="min-h-screen bg-background p-4 sm:p-6 lg:p-8 font-sans">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-surface rounded-2xl shadow-sm border border-border/60 p-5 mb-6">
          <div>
            <h1 className="text-[18px] font-black text-[#1E293B] tracking-tight uppercase">GRN ENTRY LIST</h1>
            <p className="text-[11px] font-bold text-text-muted uppercase mt-0.5">Manage goods receipt notes</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="bg-[#1E293B] hover:bg-[#0F172A] text-white px-4 py-2 rounded-xl text-[12px] font-bold flex items-center gap-1.5 transition-colors">
              <Upload className="w-3.5 h-3.5" /> Import
            </button>
            <button onClick={handleNewEntry} className="bg-[#1E293B] hover:bg-[#0F172A] text-white px-4 py-2 rounded-xl text-[12px] font-bold flex items-center gap-1.5 transition-colors">
              <Plus className="w-4 h-4" /> Add New
            </button>
          </div>
        </div>

        <div className="bg-surface rounded-2xl shadow-sm border border-border/60 overflow-hidden">
          <Table 
            data={grnsList} 
            isLoading={isTableLoading}
            columns={[
              {
                key: 'grn_date',
                header: 'DATE',
                render: (grn: any) => grn.grn_date || grn.date ? new Date(grn.grn_date || grn.date).toLocaleDateString('en-GB').replace(/\//g, '-') : '-'
              },
              {
                key: 'purchase_no_display',
                header: 'PURCHASE BILL NO',
                render: (grn: any) => <span className="font-bold text-[#4338CA]">{grn.purchase_no_display || '-'}</span>
              },
              {
                key: 'grn_no',
                header: 'CHALLAN NO',
                render: (grn: any) => grn.grn_no || grn.challan_no || '-'
              },
              {
                key: 'party_name',
                header: 'PARTY',
                render: (grn: any) => {
                  const partyId = grn.party_id || grn.party;
                  const partyName = grn.party_name || (Array.isArray(parties) ? (parties.find(p => p.id === partyId)?.name || parties.find(p => p.id === partyId)?.account_name || partyId) : partyId);
                  return <span className="uppercase">{partyName || '-'}</span>;
                }
              },
              {
                key: 'actions',
                header: 'ACTIONS',
                exportable: false,
                render: (grn: any) => (
                  <div className="flex justify-center items-center gap-2">
                    <button onClick={() => handleEdit(grn.id)} className="text-primary hover:text-primary bg-primary-light p-1.5 rounded transition-colors"><Pencil className="w-3.5 h-3.5" /></button>
                    <button onClick={() => handleDelete(grn.id)} className="text-red-500 hover:text-red-600 bg-red-50 p-1.5 rounded transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                  </div>
                )
              }
            ]}
            exportFilename="GRN_List" 
            searchKey="grn_no" 
            searchPlaceholder="Search Challan No..." 
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 lg:p-8 font-sans">
      <div className="flex justify-between items-center bg-surface rounded-xl shadow-sm border border-border/60 p-4 mb-6">
        <div className="flex items-center gap-3">
          <button onClick={() => setIsFormOpen(false)} className="text-text-muted hover:text-text-secondary transition-colors">
            <X className="w-5 h-5" />
          </button>
          <h1 className="text-[18px] font-black text-[#1E293B] tracking-tight uppercase">{editingId ? 'Edit GRN Entry' : 'New GRN Entry'}</h1>
        </div>
        <div className="text-[10px] font-bold text-red-500 bg-red-50 px-3 py-1.5 rounded-md border border-red-100 uppercase tracking-wider">
          (*) REQUIRED FIELDS
        </div>
      </div>

      <div className="bg-surface rounded-2xl shadow-sm border border-border/60 overflow-hidden mb-6">
        <div className="p-6 sm:p-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6 mb-10">
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-[#1E293B] uppercase tracking-wider">Purchase Bill No</label>
              <select disabled={isMasterLoading} value={purchaseId} onChange={(e) => setPurchaseId(e.target.value)} className="w-full bg-surface border border-border focus:border-[#4338CA] focus:ring-1 focus:ring-[#4338CA] rounded-lg p-2.5 text-[13px] text-text-secondary transition-all outline-none">
                <option value="">{isMasterLoading ? 'Loading...' : 'SELECT BILL'}</option>
                {purchasesList.map((p: any) => <option key={p.id} value={p.id}>{p.invoice_no || p.purchase_no}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-[#1E293B] uppercase tracking-wider">Challan No <span className="text-red-500">*</span></label>
              <input type="text" value={challanNo} onChange={(e) => setChallanNo(e.target.value)} placeholder="CHALLAN NO" className="w-full bg-surface border border-border focus:border-[#4338CA] focus:ring-1 focus:ring-[#4338CA] rounded-lg p-2.5 text-[13px] text-text-secondary transition-all outline-none placeholder:text-slate-300" />
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-[#1E293B] uppercase tracking-wider">Date <span className="text-red-500">*</span></label>
              <input type="date" value={grnDate} onChange={(e) => setGrnDate(e.target.value)} className="w-full bg-surface border border-border focus:border-[#4338CA] focus:ring-1 focus:ring-[#4338CA] rounded-lg p-2.5 text-[13px] text-text-secondary transition-all outline-none" />
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-[#1E293B] uppercase tracking-wider">Party <span className="text-red-500">*</span></label>
              <select disabled={isMasterLoading} value={partyId} onChange={(e) => setPartyId(e.target.value)} className="w-full bg-surface border border-border focus:border-[#4338CA] focus:ring-1 focus:ring-[#4338CA] rounded-lg p-2.5 text-[13px] text-text-secondary transition-all outline-none">
                <option value="">{isMasterLoading ? 'Loading...' : 'SELECT PARTY'}</option>
                {parties.map((p: any) => <option key={p.id} value={p.id}>{p.name || p.account_name}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-[#1E293B] uppercase tracking-wider">Vehicle No</label>
              <input type="text" value={vehicleNo} onChange={(e) => setVehicleNo(e.target.value)} placeholder="GJ-01-XX-0000" className="w-full bg-background border border-border focus:border-[#4338CA] focus:ring-1 focus:ring-[#4338CA] rounded-lg p-2.5 text-[13px] text-text-secondary transition-all outline-none placeholder:text-text-muted" />
            </div>
          </div>

          <hr className="border-border/50 mb-8" />

          {/* Dynamic Items Section */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-[14px] font-black text-[#1E293B] tracking-wide uppercase">GRN Items</h2>
            <button onClick={handleAddItem} className="flex items-center gap-1.5 text-[11px] font-bold text-text-secondary hover:text-[#4338CA] transition-colors bg-input px-3 py-1.5 rounded-md border border-border hover:border-[#4338CA]/30">
              <Plus className="w-3 h-3" /> ADD ROW
            </button>
          </div>

          <div className="border border-border/60 rounded-xl overflow-hidden mb-12">
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
                    <td className="py-3 px-4 text-center font-medium text-[#4338CA]">{idx + 1}</td>
                    <td className="py-3 px-4">
                      <select disabled={isMasterLoading} value={item.item_id || item.item || ''} onChange={(e) => updateItem(item.id, 'item_id', e.target.value)} className="w-full bg-surface border border-border rounded-md p-2 text-[13px] text-text-secondary outline-none focus:border-[#4338CA]">
                        <option value="">{isMasterLoading ? 'Loading...' : '-- SELECT ITEM --'}</option>
                        {itemsList.map((i: any) => <option key={i.id} value={i.id}>{i.item_name || i.name}</option>)}
                      </select>
                    </td>
                    <td className="py-3 px-4">
                      <input type="number" value={item.nos || ''} onChange={(e) => updateItem(item.id, 'nos', e.target.value)} className="w-full bg-surface border border-border rounded-md p-2 text-[13px] text-center text-text-secondary outline-none focus:border-[#4338CA]" />
                    </td>
                    <td className="py-3 px-4">
                      <input type="number" value={item.quantity || ''} onChange={(e) => updateItem(item.id, 'quantity', e.target.value)} className="w-full bg-surface border border-border rounded-md p-2 text-[13px] text-center text-text-secondary outline-none focus:border-[#4338CA]" />
                    </td>
                    <td className="py-3 px-4">
                      <input type="number" value={item.rate || ''} onChange={(e) => updateItem(item.id, 'rate', e.target.value)} className="w-full bg-surface border border-border rounded-md p-2 text-[13px] text-center text-text-secondary outline-none focus:border-[#4338CA]" />
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-text-secondary">
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

          <div className="flex items-center justify-end gap-4 pt-6 border-t border-border/50">
            <button onClick={() => setIsFormOpen(false)} disabled={isSubmitting} className="text-[12px] font-bold text-text-secondary hover:text-text-secondary uppercase tracking-wider px-4 py-2 disabled:opacity-50">
              Cancel
            </button>
            <button onClick={handleSubmit} disabled={isSubmitting} className="bg-[#0F172A] hover:bg-black text-white px-8 py-3 rounded-lg text-[12px] font-bold uppercase tracking-wider flex items-center gap-2 shadow-sm transition-colors disabled:opacity-50">
              {isSubmitting ? <><Loader2 className="w-4 h-4 animate-spin" /> SAVING...</> : <><Save className="w-4 h-4" /> {editingId ? 'Update GRN' : 'Save GRN'}</>}
            </button>
          </div>
          
        </div>
      </div>
    </div>
  );
};
