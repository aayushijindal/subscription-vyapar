import React, { useState } from 'react';
import { Search, Filter, Users as UsersIcon, CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { superAdminApi, User } from '@/services/api/superAdmin';

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
          <h1 className="text-[24px] font-bold text-[#25283A] tracking-tight">Global Users Directory</h1>
          <p className="text-[14px] text-[#687085] mt-1">Cross-company overview of all registered users on the platform.</p>
        </div>
        
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-[#9299AA]" />
            <input 
              type="text" 
              placeholder="Search users..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#FFFFFF] border border-[#DFE3EC] text-[14px] text-[#25283A] rounded-[10px] pl-10 pr-4 py-2.5 outline-none focus:border-[#8B83E5] focus:ring-2 focus:ring-[#8B83E5]/20 transition-all placeholder:text-[#9299AA]"
            />
          </div>
          <button className="flex items-center justify-center gap-2 bg-[#F5F6FA] text-[#4D5568] rounded-[10px] px-4 py-2.5 hover:bg-[#E8EAF1] transition-colors shrink-0 font-medium text-[14px]">
            <Filter className="w-[18px] h-[18px]" />
            <span className="hidden sm:inline">Filter</span>
          </button>
        </div>
      </div>

      <div className="bg-[#FFFFFF] border border-[#E8EAF1] rounded-[16px] overflow-hidden shadow-[0_4px_18px_rgba(40,45,70,0.04)]">
        <div className="overflow-x-auto min-h-[300px]">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-[#F8F9FC]">
                <th className="px-6 py-4 text-[12px] font-semibold text-[#687085] uppercase tracking-wide border-b border-[#E8EAF1]">User</th>
                <th className="px-6 py-4 text-[12px] font-semibold text-[#687085] uppercase tracking-wide border-b border-[#E8EAF1]">Company</th>
                <th className="px-6 py-4 text-[12px] font-semibold text-[#687085] uppercase tracking-wide border-b border-[#E8EAF1]">Role</th>
                <th className="px-6 py-4 text-[12px] font-semibold text-[#687085] uppercase tracking-wide border-b border-[#E8EAF1]">Status</th>
                <th className="px-6 py-4 text-[12px] font-semibold text-[#687085] uppercase tracking-wide border-b border-[#E8EAF1]">Last Login</th>
                <th className="px-6 py-4 text-right text-[12px] font-semibold text-[#687085] uppercase tracking-wide border-b border-[#E8EAF1]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8EAF1]">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-20 text-center">
                    <Loader2 className="w-8 h-8 text-[#6C63D9] animate-spin mx-auto mb-4" />
                    <p className="text-[#687085] text-[14px]">Loading users...</p>
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-20 text-center">
                    <div className="w-16 h-16 bg-[#F8F9FC] rounded-[16px] flex items-center justify-center mx-auto mb-4 border border-[#E8EAF1]">
                      <UsersIcon className="w-8 h-8 text-[#9299AA]" />
                    </div>
                    <p className="text-[#25283A] font-bold text-[16px] mb-1">No Users Found</p>
                    <p className="text-[#687085] text-[14px]">There are no users matching your search.</p>
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="hover:bg-[#FAFAFD] transition-colors group bg-[#FFFFFF]">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#F0EEFF] flex items-center justify-center text-[#6C63D9] font-bold text-[14px]">
                          {user.first_name[0]}{user.last_name ? user.last_name[0] : ''}
                        </div>
                        <div>
                          <p className="font-semibold text-[#25283A] text-[14px]">{user.first_name} {user.last_name}</p>
                          <p className="text-[12px] font-medium text-[#687085] mt-0.5">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-[13px] font-semibold text-[#25283A]">{user.company_name}</p>
                      <p className="text-[12px] font-medium text-[#9299AA]">{user.company_code}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-[13px] font-medium text-[#4D5568] bg-[#F5F6FA] px-3 py-1.5 rounded-[8px]">
                        {user.role_name}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-bold ${
                        user.is_active ? 'bg-[#EAF7F1] text-[#27815D]' : 'bg-[#FCEEEF] text-[#D96F75]'
                      }`}>
                        {user.is_active ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                        {user.is_active ? 'Active' : 'Suspended'}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-[13px] font-medium text-[#687085]">
                      {user.last_login ? new Date(user.last_login).toLocaleDateString() : 'Never'}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => handleToggleStatus(user)}
                        disabled={updateMutation.isPending}
                        className={`text-[12px] font-semibold px-3 py-1.5 rounded-[8px] transition-colors border ${
                          user.is_active 
                            ? 'text-[#D96F75] bg-[#FFFFFF] border-[#F9D6D8] hover:bg-[#FCEEEF]'
                            : 'text-[#27815D] bg-[#FFFFFF] border-[#C2E5D6] hover:bg-[#EAF7F1]'
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
          <div className="px-6 py-4 border-t border-[#E8EAF1] bg-[#FFFFFF] flex items-center justify-between">
            <p className="text-[13px] font-medium text-[#687085]">Showing <span className="text-[#25283A] font-bold">1</span> to <span className="text-[#25283A] font-bold">{users.length}</span> of <span className="text-[#25283A] font-bold">{totalCount}</span> users</p>
            <div className="flex gap-2">
              <button className="px-4 py-2 text-[13px] font-medium bg-[#FFFFFF] text-[#9299AA] rounded-[8px] hover:bg-[#F8F9FC] hover:text-[#25283A] transition-colors border border-[#E8EAF1] disabled:opacity-50">Prev</button>
              <button className="px-4 py-2 text-[13px] font-medium bg-[#FFFFFF] text-[#687085] rounded-[8px] hover:bg-[#F8F9FC] hover:text-[#25283A] transition-colors border border-[#E8EAF1]">Next</button>
            </div>
          </div>
        )}
      </div>

    </div>
  );
};

export default SuperAdminUsers;
