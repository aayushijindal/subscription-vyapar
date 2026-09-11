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
        <p className="text-[10px] font-bold text-text-secondary tracking-wider uppercase mb-1">Live Company Workspace</p>
        <h1 className="text-3xl font-bold text-text-primary">Welcome, {user?.first_name || user?.username}</h1>
        <p className="text-sm text-text-secondary mt-1">This information is loaded directly from your First Computer ERP account.</p>
      </div>

      <div className="space-y-6">
        <div className="grid md:grid-cols-3 gap-6">
          
          {/* Active Company */}
          <div className="md:col-span-2 bg-surface rounded-2xl border border-border p-6 shadow-sm flex flex-col justify-between">
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 rounded-xl bg-surface-soft flex items-center justify-center text-primary shrink-0">
                <Building2 className="h-6 w-6" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-text-secondary uppercase tracking-wider mb-1">Active Company</p>
                <h3 className="text-xl font-bold text-text-primary">{company?.name || 'Not provided'}</h3>
                <p className="text-sm text-text-secondary">Active account</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 mt-8 pt-6 border-t border-border">
              <div>
                <p className="text-[10px] font-bold text-text-secondary uppercase tracking-wider mb-1">GSTIN</p>
                <p className="text-sm font-medium text-text-primary">{company?.gstin || 'Not provided'}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-text-secondary uppercase tracking-wider mb-1">Bank Name</p>
                <p className="text-sm font-medium text-text-primary">{company?.bank_name || 'Not provided'}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-text-secondary uppercase tracking-wider mb-1">Account No</p>
                <p className="text-sm font-medium text-text-primary">{company?.account_no || 'Not provided'}</p>
              </div>
            </div>
          </div>

          {/* Company Users */}
          <div className="bg-surface rounded-2xl border border-border p-6 shadow-sm flex flex-col justify-between">
            <div className="h-10 w-10 rounded-xl bg-success-bg flex items-center justify-center text-success mb-4">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-text-secondary uppercase tracking-wider mb-1">Company Users</p>
              <p className="text-4xl font-bold text-text-primary mb-2">{workspace?.total_users || 0}</p>
              <p className="text-xs text-text-secondary">Only showing current session</p>
            </div>
          </div>

        </div>

        <div className="grid md:grid-cols-2 gap-6">
          
          {/* Company Contact Details */}
          <div className="bg-surface rounded-2xl border border-border p-6 shadow-sm">
            <h3 className="text-base font-bold text-text-primary mb-6">Company contact details</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-text-secondary" />
                <span className="text-sm text-text-secondary">{company?.email || 'Not provided'}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-text-secondary" />
                <span className="text-sm text-text-secondary">{company?.phone || 'Not provided'}</span>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-text-secondary shrink-0 mt-0.5" />
                <span className="text-sm text-text-secondary">{company?.address || 'Not provided'}</span>
              </div>
            </div>
          </div>

          {/* Your Access */}
          <div className="bg-surface rounded-2xl border border-border p-6 shadow-sm">
            <h3 className="text-base font-bold text-text-primary mb-6">Your access</h3>
            <div className="flex items-center gap-4 bg-surface-soft p-4 rounded-xl border border-border">
              <div className="h-10 w-10 rounded-xl bg-surface-soft flex items-center justify-center text-primary">
                <Shield className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-medium text-text-primary">{user?.role_name || user?.role}</p>
                <p className="text-xs text-text-secondary">{user?.email}</p>
              </div>
            </div>
          </div>

        </div>

        {/* Team Members Table */}
        <div className="bg-surface rounded-2xl border border-border shadow-sm overflow-hidden">
          <div className="p-6 border-b border-border">
            <h3 className="text-base font-bold text-text-primary">Team members</h3>
            <p className="text-xs text-text-secondary mt-1">Currently active session.</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-text-secondary">
              <thead className="bg-surface-soft text-[10px] font-bold text-text-secondary uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">NAME</th>
                  <th className="px-6 py-4">EMAIL</th>
                  <th className="px-6 py-4">ROLE</th>
                  <th className="px-6 py-4">STATUS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {workspace?.team_members?.map((member: any) => (
                  <tr key={member.id} className="hover:bg-input transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-text-primary">
                      {member.name || member.username}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-text-secondary">
                      {member.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-text-secondary">
                      {member.role_name || 'User'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-success">
                        <CheckCircle2 className="h-3 w-3" />
                        {member.status || 'Active'}
                      </span>
                    </td>
                  </tr>
                ))}
                {(!workspace?.team_members || workspace.team_members.length === 0) && (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-text-secondary">
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

