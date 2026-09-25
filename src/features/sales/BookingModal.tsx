import React, { useState, useEffect } from 'react';
import { X, Save, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { salesApi } from '../../services/api/sales';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  buyerId: number | '';
  itemsList: any[];
  onSubmit: (selectedBookings: any[]) => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({ isOpen, onClose, buyerId, itemsList, onSubmit }) => {
  const [loading, setLoading] = useState(false);
  const [bookings, setBookings] = useState<any[]>([]);
  
  // Track selected IDs
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  // Track user-adjusted values
  const [adjustments, setAdjustments] = useState<Record<number, { sellPcs: number, sellQty: number }>>({});

  useEffect(() => {
    if (isOpen && buyerId) {
      const fetchBookings = async () => {
        setLoading(true);
        try {
          // Fetch Bookings and Sales simultaneously
          const [bookingsRes, salesRes] = await Promise.all([
            salesApi.orderBooking.list(),
            salesApi.sales.list()
          ]);
          
          const allOrders = Array.isArray(bookingsRes) ? bookingsRes : (bookingsRes as any).results || [];
          const buyerOrders = allOrders.filter((o: any) => o.party === buyerId || o.party_id === buyerId);
          
          const allSales = Array.isArray(salesRes) ? salesRes : (salesRes as any).results || [];
          
          // Map consumed quantities and pcs by order_booking_item id
          const consumedMap: Record<number, { qty: number, pcs: number }> = {};
          
          allSales.forEach((sale: any) => {
            if (sale.items) {
               sale.items.forEach((si: any) => {
                 const obi_id = si.order_booking_item || si.order_booking_item_id;
                 if (obi_id) {
                    if (!consumedMap[obi_id]) consumedMap[obi_id] = { qty: 0, pcs: 0 };
                    consumedMap[obi_id].qty += Number(si.quantity || 0);
                    consumedMap[obi_id].pcs += Number(si.nos || si.pcs || 0);
                 }
               });
            }
          });
          
          const flattened: any[] = [];
          buyerOrders.forEach((o: any) => {
            if (o.items) {
               o.items.forEach((i: any) => {
                 const origQty = Number(i.quantity || 0);
                 const origPcs = Number(i.pcs || 0);
                 
                 const consumed = consumedMap[i.id] || { qty: 0, pcs: 0 };
                 
                 // If the backend magically sends remaining_quantity, we can prefer it.
                 // Otherwise, we calculate mathematically: orig - consumed
                 const remQty = i.remaining_quantity !== undefined ? Number(i.remaining_quantity) : Math.max(0, origQty - consumed.qty);
                 const remPcs = i.remaining_pcs !== undefined ? Number(i.remaining_pcs) : Math.max(0, origPcs - consumed.pcs);
                 
                 // Only show items with pending quantity
                 if (remQty > 0) {
                   flattened.push({
                     id: i.id, // order_booking_item id
                     order_no: o.booking_order_no || o.order_no,
                     date: o.date,
                     item_id: i.item,
                     item_name: itemsList.find(x => x.id === i.item)?.item_name || itemsList.find(x => x.id === i.item)?.name || i.item,
                     orig_pcs: origPcs,
                     orig_qty: origQty,
                     rem_pcs: remPcs,
                     rem_qty: remQty,
                     rate: Number(i.rate || 0),
                     amount: Number(i.amount || 0)
                   });
                 }
               });
            }
          });
          setBookings(flattened);
          setSelectedIds(new Set());
          
          const initialAdj: Record<number, { sellPcs: number, sellQty: number }> = {};
          flattened.forEach(b => {
             initialAdj[b.id] = { sellPcs: b.rem_pcs, sellQty: b.rem_qty };
          });
          setAdjustments(initialAdj);
        } catch (err) {
          console.error(err);
          toast.error('Failed to load pending bookings');
        } finally {
          setLoading(false);
        }
      };
      fetchBookings();
    }
  }, [isOpen, buyerId, itemsList]);

  if (!isOpen) return null;

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(new Set(bookings.map(b => b.id)));
    } else {
      setSelectedIds(new Set());
    }
  };

  const handleSelect = (id: number, checked: boolean) => {
    const newSet = new Set(selectedIds);
    if (checked) newSet.add(id);
    else newSet.delete(id);
    setSelectedIds(newSet);
  };

  const handleAdjust = (id: number, field: 'sellPcs' | 'sellQty', value: string) => {
    let numVal = Number(value);
    if (numVal < 0) numVal = 0;
    
    // Check validation
    const booking = bookings.find(b => b.id === id);
    if (booking) {
      const maxVal = field === 'sellQty' ? booking.rem_qty : booking.rem_pcs;
      if (numVal > maxVal) {
         toast.error(`Cannot exceed remaining ${field === 'sellQty' ? 'quantity' : 'pcs'} of ${maxVal}`);
         numVal = maxVal;
      }
    }

    setAdjustments(prev => ({
      ...prev,
      [id]: { ...prev[id], [field]: numVal }
    }));
  };

  const handleSubmit = () => {
    if (selectedIds.size === 0) {
      toast.error('Please select at least one booking item.');
      return;
    }
    
    const selected = bookings.filter(b => selectedIds.has(b.id)).map(b => {
      const adj = adjustments[b.id];
      return {
        ...b,
        sell_pcs: adj.sellPcs,
        sell_qty: adj.sellQty
      };
    });
    
    onSubmit(selected);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 min-w-[760px]">
      <div className="bg-background w-full max-w-6xl rounded-2xl shadow-2xl flex flex-col max-h-[90vh]">
        <div className="flex justify-between items-center p-6 border-b border-border/60">
           <div>
             <h2 className="text-[18px] font-black tracking-tight text-text-primary uppercase">ITEM BOOKING DETAILS</h2>
             <p className="text-[11px] font-bold text-text-secondary uppercase mt-1 tracking-wider">SELECT AND MANAGE BOOKINGS FOR THE BUYER</p>
           </div>
           <button type="button" onClick={onClose} className="p-2 text-text-muted hover:text-text-primary transition-colors">
              <X className="w-6 h-6" />
           </button>
        </div>
        
        <div className="overflow-auto p-4 sm:p-6 bg-surface flex-1">
          {loading ? (
             <div className="flex flex-col items-center justify-center py-20 gap-3">
               <Loader2 className="w-10 h-10 animate-spin text-primary" />
               <span className="text-[12px] font-bold text-text-secondary uppercase">Fetching Bookings...</span>
             </div>
          ) : bookings.length === 0 ? (
             <div className="flex justify-center py-20 text-text-secondary font-bold text-[13px] uppercase tracking-wider">
                NO PENDING BOOKINGS FOUND FOR THIS BUYER
             </div>
          ) : (
            <div className="border border-border/60 rounded-xl overflow-x-auto bg-background">
              <table className="w-full text-left text-[11px] whitespace-nowrap min-w-[1000px]">
                <thead className="bg-[#1E293B] text-white font-black uppercase tracking-wider">
                  <tr>
                    <th className="py-4 px-4 w-[40px] text-center">
                      <input type="checkbox" checked={selectedIds.size === bookings.length && bookings.length > 0} onChange={handleSelectAll} className="w-4 h-4 rounded cursor-pointer accent-primary" />
                    </th>
                    <th className="py-4 px-4 min-w-[100px]">ORDER NO.</th>
                    <th className="py-4 px-4 min-w-[100px]">DATE</th>
                    <th className="py-4 px-4 min-w-[200px]">ITEM NAME</th>
                    <th className="py-4 px-4 w-[110px] text-center text-blue-300">REM. SELL PCS</th>
                    <th className="py-4 px-4 w-[110px] text-center text-blue-300">REM. SELL QTY</th>
                    <th className="py-4 px-4 w-[90px] text-center text-slate-400">ORIG. PCS</th>
                    <th className="py-4 px-4 w-[90px] text-center text-slate-400">ORIG. QTY</th>
                    <th className="py-4 px-4 w-[100px] text-right">RATE</th>
                    <th className="py-4 px-4 w-[100px] text-right">AMOUNT</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {bookings.map(book => (
                    <tr key={book.id} className="hover:bg-input/50 transition-colors">
                      <td className="py-3 px-4 text-center border-r border-border/30">
                        <input type="checkbox" checked={selectedIds.has(book.id)} onChange={e => handleSelect(book.id, e.target.checked)} className="w-4 h-4 rounded cursor-pointer accent-primary" />
                      </td>
                      <td className="py-3 px-4 font-black text-text-primary">{book.order_no}</td>
                      <td className="py-3 px-4 text-text-secondary">{book.date ? new Date(book.date).toLocaleDateString('en-GB').replace(/\//g, '-') : '-'}</td>
                      <td className="py-3 px-4 font-bold text-text-primary whitespace-normal">{book.item_name}</td>
                      <td className="py-2 px-3">
                         <input type="number" 
                           value={adjustments[book.id]?.sellPcs === 0 ? '' : adjustments[book.id]?.sellPcs} 
                           onChange={e => handleAdjust(book.id, 'sellPcs', e.target.value)}
                           className={`w-full bg-input border ${selectedIds.has(book.id) ? 'border-primary shadow-sm' : 'border-border'} focus:border-primary rounded p-2 text-center font-bold outline-none text-[12px] text-text-primary transition-all`}
                           disabled={!selectedIds.has(book.id)}
                           min={0}
                           max={book.rem_pcs}
                         />
                      </td>
                      <td className="py-2 px-3 border-r border-border/30">
                         <input type="number" 
                           value={adjustments[book.id]?.sellQty === 0 ? '' : adjustments[book.id]?.sellQty} 
                           onChange={e => handleAdjust(book.id, 'sellQty', e.target.value)}
                           className={`w-full bg-input border ${selectedIds.has(book.id) ? 'border-primary shadow-sm' : 'border-border'} focus:border-primary rounded p-2 text-center font-bold outline-none text-[12px] text-text-primary transition-all`}
                           disabled={!selectedIds.has(book.id)}
                           min={0}
                           max={book.rem_qty}
                         />
                      </td>
                      <td className="py-3 px-4 text-center text-text-secondary font-bold">{book.orig_pcs}</td>
                      <td className="py-3 px-4 text-center text-text-secondary font-bold">{book.orig_qty}</td>
                      <td className="py-3 px-4 text-right font-medium text-text-secondary">₹{book.rate.toFixed(2)}</td>
                      <td className="py-3 px-4 text-right font-black text-text-primary">₹{book.amount.toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        
        <div className="p-6 border-t border-border/60 flex flex-col items-center bg-background rounded-b-2xl">
           <button type="button" onClick={handleSubmit} disabled={loading || bookings.length === 0} className="w-[180px] bg-primary hover:bg-[#2b5f9d] text-white py-3 rounded-lg text-[12px] font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-sm disabled:opacity-50">
             <Save className="w-4 h-4"/> SUBMIT
           </button>
           <button type="button" onClick={onClose} className="text-[11px] font-bold text-slate-400 hover:text-slate-600 uppercase tracking-wider transition-colors mt-3">
              CLOSE MODAL
           </button>
        </div>
      </div>
    </div>
  );
};
