import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProfile, useUpdateProfile, useChangePassword } from '@/hooks/useAuthQueries';
import { showToast } from '@/hooks/useToasts';
import { Button } from '@/components/ui/Button';
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';
import { ArrowLeft, User, Shield, Building2, Users, Mail, Phone, MapPin, CheckCircle2 } from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { data: profileResponse, isLoading } = useProfile();
  const updateProfile = useUpdateProfile();
  const changePassword = useChangePassword();

  const [activeTab, setActiveTab] = useState<'workspace' | 'settings'>('workspace');

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone_number: '',
  });

  const [passwordData, setPasswordData] = useState({
    old_password: '',
    new_password: '',
    confirm_password: '',
  });

  const [companyData, setCompanyData] = useState({
    name: '',
    gstin: '',
    bank_name: '',
    account_no: '',
    ifsc_code: '',
    branch: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pin_code: '',
    country: '',
  });

  useEffect(() => {
    if (profileResponse?.data?.user) {
      // eslint-disable-next-line react/set-state-in-effect
      setFormData({
        first_name: profileResponse.data.user.first_name || '',
        last_name: profileResponse.data.user.last_name || '',
        email: profileResponse.data.user.email || '',
        phone_number: profileResponse.data.user.phone_number || '',
      });
    }
    if (profileResponse?.data?.company) {
      const comp = profileResponse.data.company;
      // eslint-disable-next-line react/set-state-in-effect
      setCompanyData({
        name: comp.name === 'Not provided' ? '' : (comp.name || ''),
        gstin: comp.gstin === 'Not provided' ? '' : (comp.gstin || ''),
        bank_name: comp.bank_name === 'Not provided' ? '' : (comp.bank_name || ''),
        account_no: comp.account_no === 'Not provided' ? '' : (comp.account_no || ''),
        ifsc_code: comp.ifsc_code === 'Not provided' ? '' : (comp.ifsc_code || ''),
        branch: comp.branch === 'Not provided' ? '' : (comp.branch || ''),
        email: comp.email === 'Not provided' ? '' : (comp.email || ''),
        phone: comp.phone === 'Not provided' ? '' : (comp.phone || ''),
        address: comp.address === 'Not provided' ? '' : (comp.address || ''),
        city: comp.city || '',
        state: comp.state || '',
        pin_code: comp.pin_code || '',
        country: comp.country || 'India',
      });
    }
  }, [profileResponse]);

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCompanyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCompanyData({ ...companyData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const onProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile.mutate({ user: formData, company: companyData }, {
      onSuccess: () => showToast('success', 'Profile and Company updated successfully'),
      onError: (error: any) => {
        const msg = error?.response?.data?.error || error.message || 'Failed to update profile';
        showToast('error', 'Update Failed', msg);
      }
    });
  };

  const onPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.new_password !== passwordData.confirm_password) {
      showToast('error', 'Validation Error', 'New passwords do not match');
      return;
    }
    
    changePassword.mutate(passwordData, {
      onSuccess: () => {
        showToast('success', 'Password changed successfully');
        setPasswordData({ old_password: '', new_password: '', confirm_password: '' });
      },
      onError: (error: any) => {
        const msg = error?.response?.data?.error || error.message || 'Failed to change password';
        showToast('error', 'Change Failed', msg);
      }
    });
  };

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto p-6 md:p-8 space-y-8">
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
    <div className="max-w-6xl mx-auto p-6 md:p-8 space-y-8 animate-fade-in">
      
      {/* Header */}
      <div className="flex items-start gap-4">
        <button 
          onClick={() => navigate(-1)} 
          className="mt-1 p-2 hover:bg-[#eaf2f9] rounded-full transition-colors shrink-0 text-[#376fa9]"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <p className="text-[10px] font-bold text-[#688099] tracking-wider uppercase mb-1">Live Company Workspace</p>
          <h1 className="text-3xl font-bold text-[#132f50]">Welcome, {user?.first_name || user?.username}</h1>
          <p className="text-sm text-[#688099] mt-1">This information is loaded directly from your First Computer ERP account.</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-6 border-b border-[#e3ebf2]">
        <button
          onClick={() => setActiveTab('workspace')}
          className={`pb-3 text-sm font-medium transition-colors relative ${activeTab === 'workspace' ? 'text-[#376fa9]' : 'text-[#688099] hover:text-[#1c3a59]'}`}
        >
          Workspace Overview
          {activeTab === 'workspace' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#376fa9] rounded-t-full" />}
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          className={`pb-3 text-sm font-medium transition-colors relative ${activeTab === 'settings' ? 'text-[#376fa9]' : 'text-[#688099] hover:text-[#1c3a59]'}`}
        >
          Account Settings
          {activeTab === 'settings' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#376fa9] rounded-t-full" />}
        </button>
      </div>

      {activeTab === 'workspace' && (
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
                  {workspace?.team_members?.map((member) => (
                    <tr key={member.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap font-medium text-[#132f50]">
                        {member.name || member.username}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-[#688099]">
                        {member.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-[#688099]">
                        {member.role_name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#238b55]">
                          <CheckCircle2 className="h-3 w-3" />
                          {member.status}
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
      )}

      {activeTab === 'settings' && (
        <div className="space-y-8">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Profile Settings Card */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
              <div className="px-8 py-6 flex items-center gap-4 bg-gradient-to-r from-blue-50/50 to-transparent">
                <div className="h-12 w-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center shadow-sm">
                  <User className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-800">Personal Information</h2>
                  <p className="text-xs text-slate-500 mt-0.5">Update your personal details here.</p>
                </div>
              </div>
              
              <form onSubmit={onProfileSubmit} className="p-8 pt-4 space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">First Name</label>
                    <input
                      type="text"
                      name="first_name"
                      value={formData.first_name}
                      onChange={handleProfileChange}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Last Name</label>
                    <input
                      type="text"
                      name="last_name"
                      value={formData.last_name}
                      onChange={handleProfileChange}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleProfileChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Phone Number</label>
                  <input
                    type="text"
                    name="phone_number"
                    value={formData.phone_number}
                    onChange={handleProfileChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none"
                  />
                </div>

                <div className="pt-2">
                  <Button type="submit" isLoading={updateProfile.isPending} className="w-full rounded-xl py-2.5 shadow-md shadow-blue-500/20">
                    Save Changes
                  </Button>
                </div>
              </form>
            </div>

            {/* Security Settings Card */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] h-fit">
              <div className="px-8 py-6 flex items-center gap-4 bg-gradient-to-r from-red-50/50 to-transparent">
                <div className="h-12 w-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center shadow-sm">
                  <Shield className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-800">Security</h2>
                  <p className="text-xs text-slate-500 mt-0.5">Manage your password.</p>
                </div>
              </div>
              
              <form onSubmit={onPasswordSubmit} className="p-8 pt-4 space-y-5">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Current Password</label>
                  <input
                    type="password"
                    name="old_password"
                    value={passwordData.old_password}
                    onChange={handlePasswordChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm focus:bg-white focus:border-red-500 focus:ring-4 focus:ring-red-500/10 transition-all outline-none"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">New Password</label>
                  <input
                    type="password"
                    name="new_password"
                    value={passwordData.new_password}
                    onChange={handlePasswordChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm focus:bg-white focus:border-red-500 focus:ring-4 focus:ring-red-500/10 transition-all outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Confirm New Password</label>
                  <input
                    type="password"
                    name="confirm_password"
                    value={passwordData.confirm_password}
                    onChange={handlePasswordChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm focus:bg-white focus:border-red-500 focus:ring-4 focus:ring-red-500/10 transition-all outline-none"
                    required
                  />
                </div>

                <div className="pt-2">
                  <Button type="submit" variant="secondary" isLoading={changePassword.isPending} className="w-full rounded-xl py-2.5">
                    Change Password
                  </Button>
                </div>
              </form>
            </div>
          </div>

          {/* Company Settings Card */}
          <div className="bg-white rounded-3xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
            <div className="px-8 py-6 flex items-center gap-4 bg-gradient-to-r from-indigo-50/50 to-transparent">
              <div className="h-12 w-12 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center shadow-sm">
                <Building2 className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-800">Company Information</h2>
                <p className="text-xs text-slate-500 mt-0.5">Update your business details.</p>
              </div>
            </div>
            
            <form onSubmit={onProfileSubmit} className="p-8 pt-4 space-y-5">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Company Name</label>
                  <input
                    type="text"
                    name="name"
                    value={companyData.name}
                    onChange={handleCompanyChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">GSTIN</label>
                  <input
                    type="text"
                    name="gstin"
                    value={companyData.gstin}
                    onChange={handleCompanyChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-6">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Bank Name</label>
                  <input
                    type="text"
                    name="bank_name"
                    value={companyData.bank_name}
                    onChange={handleCompanyChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Account No</label>
                  <input
                    type="text"
                    name="account_no"
                    value={companyData.account_no}
                    onChange={handleCompanyChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">IFSC Code</label>
                  <input
                    type="text"
                    name="ifsc_code"
                    value={companyData.ifsc_code}
                    onChange={handleCompanyChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Company Email</label>
                  <input
                    type="email"
                    name="email"
                    value={companyData.email}
                    onChange={handleCompanyChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Company Phone</label>
                  <input
                    type="text"
                    name="phone"
                    value={companyData.phone}
                    onChange={handleCompanyChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Full Address</label>
                <input
                  type="text"
                  name="address"
                  value={companyData.address}
                  onChange={handleCompanyChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-6">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">City</label>
                  <input
                    type="text"
                    name="city"
                    value={companyData.city}
                    onChange={handleCompanyChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">State</label>
                  <input
                    type="text"
                    name="state"
                    value={companyData.state}
                    onChange={handleCompanyChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">PIN Code</label>
                  <input
                    type="text"
                    name="pin_code"
                    value={companyData.pin_code}
                    onChange={handleCompanyChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none"
                  />
                </div>
              </div>

              <div className="pt-2">
                <Button type="submit" isLoading={updateProfile.isPending} className="w-full rounded-xl py-2.5 shadow-md shadow-indigo-500/20 bg-indigo-600 hover:bg-indigo-700">
                  Save Company Details
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
