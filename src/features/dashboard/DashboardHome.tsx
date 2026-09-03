import React from 'react';
import { useProfile } from '@/hooks/useAuthQueries';
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';
import { Building2, Users, Mail, Phone, MapPin, Shield, CheckCircle2 } from 'lucide-react';

export const DashboardHome: React.FC = () => {
  const { data: profileResponse, isLoading } = useProfile();

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto space-y-8">
        <LoadingSkeleton count={1} className="h-20" />
        <LoadingSkeleton count={1} className="h-10 w-64" />
        <div className="grid md:grid-cols-3 gap-6">
          <LoadingSkeleton count={1} className="h-48 md:col-span-2" />
          <LoadingSkeleton count={1} className="h-48" />
        </div>
      </div>
    );
  }

  const user = profileResponse?.data?.user;
  const company = profileResponse?.data?.company;
  const workspace = profileResponse?.data?.workspace;

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in pb-8">
      
      {/* Header */}
      <div>
        <p className="text-[10px] font-bold text-[#688099] tracking-wider uppercase mb-1">Live Company Workspace</p>
        <h1 className="text-3xl font-bold text-[#132f50]">Welcome, {user?.first_name || user?.username}</h1>
        <p className="text-sm text-[#688099] mt-1">This information is loaded directly from your First Computer ERP account.</p>
      </div>

      <div className="space-y-6">
        <div className="grid md:grid-cols-3 gap-6">
          
          {/* Active Company */}
          <div className="md:col-span-2 bg-white rounded-2xl border border-[#e3ebf2] p-6 shadow-sm flex flex-col justify-between">
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 rounded-xl bg-[#eaf2f9] flex items-center justify-center text-[#376fa9] shrink-0">
                <Building2 className="h-6 w-6" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-[#688099] uppercase tracking-wider mb-1">Active Company</p>
                <h3 className="text-xl font-bold text-[#132f50]">{company?.name || 'Not provided'}</h3>
                <p className="text-sm text-[#688099]">Active account</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 mt-8 pt-6 border-t border-[#f4f7fb]">
              <div>
                <p className="text-[10px] font-bold text-[#688099] uppercase tracking-wider mb-1">GSTIN</p>
                <p className="text-sm font-medium text-[#132f50]">{company?.gstin || 'Not provided'}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-[#688099] uppercase tracking-wider mb-1">Bank Name</p>
                <p className="text-sm font-medium text-[#132f50]">{company?.bank_name || 'Not provided'}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-[#688099] uppercase tracking-wider mb-1">Account No</p>
                <p className="text-sm font-medium text-[#132f50]">{company?.account_no || 'Not provided'}</p>
              </div>
            </div>
          </div>

          {/* Company Users */}
          <div className="bg-white rounded-2xl border border-[#e3ebf2] p-6 shadow-sm flex flex-col justify-between">
            <div className="h-10 w-10 rounded-xl bg-[#eef7f2] flex items-center justify-center text-[#238b55] mb-4">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-[#688099] uppercase tracking-wider mb-1">Company Users</p>
              <p className="text-4xl font-bold text-[#132f50] mb-2">{workspace?.total_users || 0}</p>
              <p className="text-xs text-[#688099]">Only showing current session</p>
            </div>
          </div>

        </div>

        <div className="grid md:grid-cols-2 gap-6">
          
          {/* Company Contact Details */}
          <div className="bg-white rounded-2xl border border-[#e3ebf2] p-6 shadow-sm">
            <h3 className="text-base font-bold text-[#132f50] mb-6">Company contact details</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-[#688099]" />
                <span className="text-sm text-[#48647f]">{company?.email || 'Not provided'}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-[#688099]" />
                <span className="text-sm text-[#48647f]">{company?.phone || 'Not provided'}</span>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-[#688099] shrink-0 mt-0.5" />
                <span className="text-sm text-[#48647f]">{company?.address || 'Not provided'}</span>
              </div>
            </div>
          </div>

          {/* Your Access */}
          <div className="bg-white rounded-2xl border border-[#e3ebf2] p-6 shadow-sm">
            <h3 className="text-base font-bold text-[#132f50] mb-6">Your access</h3>
            <div className="flex items-center gap-4 bg-[#f8fafc] p-4 rounded-xl border border-[#e3ebf2]">
              <div className="h-10 w-10 rounded-xl bg-[#eaf2f9] flex items-center justify-center text-[#376fa9]">
                <Shield className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-medium text-[#132f50]">{user?.role_name || user?.role}</p>
                <p className="text-xs text-[#688099]">{user?.email}</p>
              </div>
            </div>
          </div>

        </div>

        {/* Team Members Table */}
        <div className="bg-white rounded-2xl border border-[#e3ebf2] shadow-sm overflow-hidden">
          <div className="p-6 border-b border-[#e3ebf2]">
            <h3 className="text-base font-bold text-[#132f50]">Team members</h3>
            <p className="text-xs text-[#688099] mt-1">Currently active session.</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-[#48647f]">
              <thead className="bg-[#f8fafc] text-[10px] font-bold text-[#688099] uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">NAME</th>
                  <th className="px-6 py-4">EMAIL</th>
                  <th className="px-6 py-4">ROLE</th>
                  <th className="px-6 py-4">STATUS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e3ebf2]">
                {workspace?.team_members?.map((member: any) => (
                  <tr key={member.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-[#132f50]">
                      {member.name || member.username}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-[#688099]">
                      {member.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-[#688099]">
                      {member.role_name || 'User'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#238b55]">
                        <CheckCircle2 className="h-3 w-3" />
                        {member.status || 'Active'}
                      </span>
                    </td>
                  </tr>
                ))}
                {(!workspace?.team_members || workspace.team_members.length === 0) && (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-[#688099]">
                      No team members found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};

