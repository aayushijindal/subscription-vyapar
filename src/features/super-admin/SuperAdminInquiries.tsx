import React, { useState } from 'react';
import { Mail, Search, MessageSquare, CheckCircle2, X, Loader2 } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { superAdminApi, type Inquiry } from '@/services/api/superAdmin';

export const SuperAdminInquiries: React.FC = () => {
  const queryClient = useQueryClient();
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [replyText, setReplyText] = useState('');

  // Fetch inquiries
  const { data: inquiriesResponse, isLoading } = useQuery({
    queryKey: ['superAdminInquiries', searchTerm],
    queryFn: () => superAdminApi.getInquiries(searchTerm ? { search: searchTerm } : {})
  });

  const inquiries = inquiriesResponse?.results || [];

  // Mutate inquiry
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Inquiry> }) => 
      superAdminApi.updateInquiry(id, data),
    onSuccess: (updatedInquiry) => {
      queryClient.invalidateQueries({ queryKey: ['superAdminInquiries'] });
      // Update selected inquiry state if it's the one we just edited
      if (selectedInquiry?.id === updatedInquiry.id) {
        setSelectedInquiry(updatedInquiry);
      }
    }
  });

  const handleMarkResolved = () => {
    if (!selectedInquiry) return;
    updateMutation.mutate({ 
      id: selectedInquiry.id, 
      data: { status: 'RESOLVED', is_resolved: true } 
    });
  };

  const handleSaveNote = () => {
    if (!selectedInquiry || !replyText.trim()) return;
    updateMutation.mutate({ 
      id: selectedInquiry.id, 
      data: { admin_notes: replyText } 
    }, {
      onSuccess: () => {
        setReplyText('');
      }
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  const unreadCount = inquiries.filter((i: Inquiry) => i.status === 'NEW').length;

  return (
    <div className="space-y-6 animate-fade-in relative h-full">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-[24px] font-bold text-text-primary tracking-tight">Support Inquiries</h1>
          <p className="text-[14px] text-text-secondary mt-1">Messages received from the public Contact Us form.</p>
        </div>
        
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-[280px]">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-text-muted" />
            <input 
              type="text" 
              placeholder="Search messages..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-surface border border-border text-[14px] text-text-primary rounded-[10px] pl-10 pr-4 py-2.5 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-text-muted"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-220px)] min-h-[500px]">
        
        {/* Inbox List */}
        <div className="lg:col-span-1 bg-surface border border-border rounded-[16px] flex flex-col overflow-hidden shadow-[0_4px_18px_rgba(40,45,70,0.04)]">
          <div className="p-5 border-b border-border bg-background flex justify-between items-center">
            <h3 className="font-bold text-text-primary flex items-center gap-2.5 text-[14px]">
              <Mail className="w-[18px] h-[18px] text-primary" /> Inbox
            </h3>
            <span className="bg-primary/10 text-primary text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-primary/20">
              {unreadCount} New
            </span>
          </div>
          <div className="flex-1 overflow-y-auto overflow-x-hidden bg-surface">
            {isLoading ? (
              <div className="flex justify-center py-10">
                <Loader2 className="w-6 h-6 text-text-muted animate-spin" />
              </div>
            ) : inquiries.length === 0 ? (
              <div className="p-8 text-center text-text-muted text-sm">No inquiries found.</div>
            ) : (
              inquiries.map((inq: Inquiry) => (
                <div 
                  key={inq.id}
                  onClick={() => {
                    setSelectedInquiry(inq);
                    setReplyText('');
                  }}
                  className={`p-5 border-b border-border cursor-pointer transition-all hover:bg-input ${
                    selectedInquiry?.id === inq.id ? 'bg-primary/10/60 border-l-[3px] border-l-primary' : 'border-l-[3px] border-l-transparent'
                  }`}
                >
                  <div className="flex justify-between items-start mb-1.5">
                    <h4 className={`text-[14px] font-bold truncate pr-2 ${inq.status === 'NEW' ? 'text-text-primary' : 'text-text-secondary'}`}>
                      {inq.first_name} {inq.last_name || ''}
                    </h4>
                    <span className="text-[11px] font-medium text-text-muted whitespace-nowrap">
                      {formatDate(inq.created_at)}
                    </span>
                  </div>
                  <p className={`text-[13px] mb-3 truncate ${inq.status === 'NEW' ? 'text-text-primary font-semibold' : 'text-text-secondary'}`}>
                    {inq.subject || 'No Subject'}
                  </p>
                  <div className="flex items-center gap-2">
                    <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                      inq.status === 'NEW' ? 'bg-primary/10 text-primary' :
                      inq.status === 'IN_PROGRESS' ? 'bg-primary/10 text-primary' :
                      inq.status === 'RESOLVED' ? 'bg-success-bg text-success' :
                      'bg-danger-bg text-danger'
                    }`}>
                      {inq.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Message Detail */}
        <div className="lg:col-span-2 bg-surface border border-border rounded-[16px] flex flex-col overflow-hidden shadow-[0_4px_18px_rgba(40,45,70,0.04)] relative">
          {selectedInquiry ? (
            <>
              <div className="p-7 border-b border-border bg-background">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-[20px] font-bold text-text-primary mb-4">{selectedInquiry.subject || 'No Subject'}</h2>
                    <div className="flex items-center gap-3.5 text-[14px]">
                      <div className="w-[42px] h-[42px] rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-[16px]">
                        {selectedInquiry.first_name[0].toUpperCase()}
                      </div>
                      <div>
                        <p className="font-bold text-text-primary">{selectedInquiry.first_name} {selectedInquiry.last_name || ''}</p>
                        <p className="text-[13px] font-medium text-text-secondary mt-0.5">{selectedInquiry.email}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {selectedInquiry.status !== 'RESOLVED' && (
                      <button 
                        title="Mark as Resolved"
                        onClick={handleMarkResolved}
                        disabled={updateMutation.isPending}
                        className="p-2 bg-surface hover:bg-input text-text-muted hover:text-success rounded-[10px] transition-colors border border-border shadow-[0_2px_5px_rgba(40,45,70,0.02)]"
                      >
                        {updateMutation.isPending ? <Loader2 className="w-[18px] h-[18px] animate-spin" /> : <CheckCircle2 className="w-[18px] h-[18px]" />}
                      </button>
                    )}
                    <button 
                      onClick={() => setSelectedInquiry(null)}
                      className="p-2 bg-surface hover:bg-input text-text-muted hover:text-text-primary rounded-[10px] transition-colors border border-border shadow-[0_2px_5px_rgba(40,45,70,0.02)] lg:hidden"
                    >
                      <X className="w-[18px] h-[18px]" />
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="p-8 flex-1 overflow-y-auto bg-surface">
                <div className="prose max-w-none text-text-secondary text-[14px] leading-relaxed whitespace-pre-wrap">
                  {selectedInquiry.message}
                </div>
                
                {selectedInquiry.admin_notes && (
                  <div className="mt-8 p-4 bg-warning-bg border border-warning/20 rounded-[12px]">
                    <h4 className="text-[12px] font-bold text-warning uppercase tracking-wider mb-2">Admin Notes</h4>
                    <p className="text-[13px] text-warning">{selectedInquiry.admin_notes}</p>
                  </div>
                )}
              </div>
              
              <div className="p-5 border-t border-border bg-background">
                <div className="flex gap-3">
                  <textarea 
                    placeholder="Add an admin note... (Visible only to super admins)"
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    className="flex-1 bg-surface border border-border text-[14px] text-text-primary rounded-[10px] p-3 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-text-muted resize-none h-[48px]"
                  />
                  <button 
                    onClick={handleSaveNote}
                    disabled={updateMutation.isPending || !replyText.trim()}
                    className="bg-primary hover:bg-primary-hover disabled:opacity-50 text-white px-6 py-2.5 rounded-[10px] font-medium text-[14px] transition-colors flex items-center justify-center gap-2"
                  >
                    {updateMutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />} Save Note
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-text-muted p-8 text-center h-full bg-surface">
              <div className="w-[72px] h-[72px] rounded-[20px] bg-background border border-border flex items-center justify-center mb-5">
                <MessageSquare className="w-[32px] h-[32px] text-text-muted" />
              </div>
              <h3 className="text-[16px] font-bold text-text-secondary mb-2">No Inquiry Selected</h3>
              <p className="text-[14px] max-w-[250px]">Select an inquiry from the inbox to read the full message and update notes.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default SuperAdminInquiries;
