import React, { useState } from 'react';
import { Search, Filter, Users as UsersIcon, CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { superAdminApi, type User } from '@/services/api/superAdmin';

export const SuperAdminUsers: React.FC = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');

  const { data: usersResponse, isLoading } = useQuery({
    queryKey: ['superAdminUsers', searchTerm],
    queryFn: () => superAdminApi.getUsers(searchTerm ? { search: searchTerm } : {})
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<User> }) => 
      superAdminApi.updateUser(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['superAdminUsers'] });
    }
  });

  const handleToggleStatus = (user: User) => {
    updateMutation.mutate({
      id: user.id,
      data: { is_active: !user.is_active }
    });
  };

  const users = usersResponse?.results || [];
  const totalCount = usersResponse?.count || 0;

  return (
    <div className="space-y-6 animate-fade-in">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-[24px] font-bold text-text-primary tracking-tight">Global Users Directory</h1>
          <p className="text-[14px] text-text-secondary mt-1">Cross-company overview of all registered users on the platform.</p>
        </div>
        
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-text-muted" />
            <input 
              type="text" 
              placeholder="Search users..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-surface border border-border text-[14px] text-text-primary rounded-[10px] pl-10 pr-4 py-2.5 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-text-muted"
            />
          </div>
          <button className="flex items-center justify-center gap-2 bg-surface-soft text-text-secondary rounded-[10px] px-4 py-2.5 hover:bg-input transition-colors shrink-0 font-medium text-[14px]">
            <Filter className="w-[18px] h-[18px]" />
            <span className="hidden sm:inline">Filter</span>
          </button>
        </div>
      </div>

      <div className="bg-surface border border-border rounded-[16px] overflow-hidden shadow-[0_4px_18px_rgba(40,45,70,0.04)]">
        <div className="overflow-x-auto min-h-[300px]">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-background">
                <th className="px-6 py-4 text-[12px] font-semibold text-text-secondary uppercase tracking-wide border-b border-border">User</th>
                <th className="px-6 py-4 text-[12px] font-semibold text-text-secondary uppercase tracking-wide border-b border-border">Company</th>
                <th className="px-6 py-4 text-[12px] font-semibold text-text-secondary uppercase tracking-wide border-b border-border">Role</th>
                <th className="px-6 py-4 text-[12px] font-semibold text-text-secondary uppercase tracking-wide border-b border-border">Status</th>
                <th className="px-6 py-4 text-[12px] font-semibold text-text-secondary uppercase tracking-wide border-b border-border">Last Login</th>
                <th className="px-6 py-4 text-right text-[12px] font-semibold text-text-secondary uppercase tracking-wide border-b border-border">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-20 text-center">
                    <Loader2 className="w-8 h-8 text-primary animate-spin mx-auto mb-4" />
                    <p className="text-text-secondary text-[14px]">Loading users...</p>
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-20 text-center">
                    <div className="w-16 h-16 bg-background rounded-[16px] flex items-center justify-center mx-auto mb-4 border border-border">
                      <UsersIcon className="w-8 h-8 text-text-muted" />
                    </div>
                    <p className="text-text-primary font-bold text-[16px] mb-1">No Users Found</p>
                    <p className="text-text-secondary text-[14px]">There are no users matching your search.</p>
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="hover:bg-input transition-colors group bg-surface">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-[14px]">
                          {user.first_name[0]}{user.last_name ? user.last_name[0] : ''}
                        </div>
                        <div>
                          <p className="font-semibold text-text-primary text-[14px]">{user.first_name} {user.last_name}</p>
                          <p className="text-[12px] font-medium text-text-secondary mt-0.5">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-[13px] font-semibold text-text-primary">{user.company_name}</p>
                      <p className="text-[12px] font-medium text-text-muted">{user.company_code}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-[13px] font-medium text-text-secondary bg-surface-soft px-3 py-1.5 rounded-[8px]">
                        {user.role_name}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-bold ${
                        user.is_active ? 'bg-success-bg text-success' : 'bg-danger-bg text-danger'
                      }`}>
                        {user.is_active ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                        {user.is_active ? 'Active' : 'Suspended'}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-[13px] font-medium text-text-secondary">
                      {user.last_login ? new Date(user.last_login).toLocaleDateString() : 'Never'}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => handleToggleStatus(user)}
                        disabled={updateMutation.isPending}
                        className={`text-[12px] font-semibold px-3 py-1.5 rounded-[8px] transition-colors border ${
                          user.is_active 
                            ? 'text-danger bg-surface border-danger/20 hover:bg-danger-bg'
                            : 'text-success bg-surface border-success/20 hover:bg-success-bg'
                        }`}
                      >
                        {user.is_active ? 'Suspend' : 'Reactivate'}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        {!isLoading && users.length > 0 && (
          <div className="px-6 py-4 border-t border-border bg-surface flex items-center justify-between">
            <p className="text-[13px] font-medium text-text-secondary">Showing <span className="text-text-primary font-bold">1</span> to <span className="text-text-primary font-bold">{users.length}</span> of <span className="text-text-primary font-bold">{totalCount}</span> users</p>
            <div className="flex gap-2">
              <button className="px-4 py-2 text-[13px] font-medium bg-surface text-text-muted rounded-[8px] hover:bg-background hover:text-text-primary transition-colors border border-border disabled:opacity-50">Prev</button>
              <button className="px-4 py-2 text-[13px] font-medium bg-surface text-text-secondary rounded-[8px] hover:bg-background hover:text-text-primary transition-colors border border-border">Next</button>
            </div>
          </div>
        )}
      </div>

    </div>
  );
};

export default SuperAdminUsers;
