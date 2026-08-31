import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';
import { Button } from '@/components/ui/Button';
import { showToast } from '@/hooks/useToasts';
import { Check, User, Building2, MapPin } from 'lucide-react';

const ownerSchema = zod.object({
  ownerName: zod.string().min(2, 'Name must be at least 2 characters'),
  mobile: zod.string().min(10, 'Enter a valid 10-digit mobile number'),
  email: zod.string().email('Enter a valid email address'),
  password: zod.string().min(6, 'Password must be at least 6 characters')
});

const companySchema = zod.object({
  companyName: zod.string().min(2, 'Company name is required'),
  gstNumber: zod.string().optional(),
  businessType: zod.string().min(2, 'Select a business type')
});

const locationSchema = zod.object({
  country: zod.string().min(2, 'Country is required'),
  state: zod.string().min(2, 'State is required'),
  city: zod.string().min(2, 'City is required')
});

export const Register: React.FC = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({});
  const navigate = useNavigate();

  // Separate forms for steps
  const { register: registerOwner, handleSubmit: handleOwnerSubmit, formState: { errors: ownerErrors } } = useForm({
    resolver: zodResolver(ownerSchema)
  });

  const { register: registerCompany, handleSubmit: handleCompanySubmit, formState: { errors: companyErrors } } = useForm({
    resolver: zodResolver(companySchema)
  });

  const { register: registerLocation, handleSubmit: handleLocationSubmit, formState: { errors: locationErrors } } = useForm({
    resolver: zodResolver(locationSchema)
  });

  const onStep1Submit = (data: any) => {
    setFormData({ ...formData, ...data });
    setStep(2);
  };

  const onStep2Submit = (data: any) => {
    setFormData({ ...formData, ...data });
    setStep(3);
  };

  const onStep3Submit = async (data: any) => {
    const finalData = { ...formData, ...data };
    console.log('Final Registration Payload:', finalData);
    showToast('success', 'Onboarding Complete!', 'Your company account was created.');
    navigate('/dashboard');
  };

  const stepsInfo = [
    { num: 1, label: 'Owner Details', icon: <User className="h-4 w-4" /> },
    { num: 2, label: 'Company Info', icon: <Building2 className="h-4 w-4" /> },
    { num: 3, label: 'Location', icon: <MapPin className="h-4 w-4" /> }
  ];

  return (
    <div className="space-y-8">
      {/* Stepper Header */}
      <div className="flex justify-between items-center relative">
        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-100 -translate-y-1/2 z-0" />
        {stepsInfo.map((s) => (
          <div key={s.num} className="relative z-10 flex flex-col items-center gap-1.5 bg-white px-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center border font-semibold text-xs transition-colors ${
              step >= s.num 
                ? 'bg-blue-600 border-blue-600 text-white' 
                : 'bg-white border-slate-200 text-slate-400'
            }`}>
              {step > s.num ? <Check className="h-4 w-4" /> : s.num}
            </div>
            <span className={`text-[10px] font-semibold tracking-wide uppercase ${
              step >= s.num ? 'text-blue-600' : 'text-slate-400'
            }`}>{s.label}</span>
          </div>
        ))}
      </div>

      <hr className="border-slate-100" />

      {/* Step Form 1: Owner Info */}
      {step === 1 && (
        <form onSubmit={handleOwnerSubmit(onStep1Submit)} className="space-y-4 text-left">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">Full Name</label>
            <input type="text" {...registerOwner('ownerName')} className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
            {ownerErrors.ownerName && <p className="text-xs text-red-500">{ownerErrors.ownerName.message as string}</p>}
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">Mobile Number</label>
            <input type="text" {...registerOwner('mobile')} className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
            {ownerErrors.mobile && <p className="text-xs text-red-500">{ownerErrors.mobile.message as string}</p>}
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">Email Address</label>
            <input type="email" {...registerOwner('email')} className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
            {ownerErrors.email && <p className="text-xs text-red-500">{ownerErrors.email.message as string}</p>}
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">Password</label>
            <input type="password" {...registerOwner('password')} className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
            {ownerErrors.password && <p className="text-xs text-red-500">{ownerErrors.password.message as string}</p>}
          </div>
          <Button type="submit" className="w-full py-3 justify-center">Continue</Button>
        </form>
      )}

      {/* Step Form 2: Company Details */}
      {step === 2 && (
        <form onSubmit={handleCompanySubmit(onStep2Submit)} className="space-y-4 text-left">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">Company / Business Name</label>
            <input type="text" {...registerCompany('companyName')} className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
            {companyErrors.companyName && <p className="text-xs text-red-500">{companyErrors.companyName.message as string}</p>}
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">GSTIN Number (Optional)</label>
            <input type="text" {...registerCompany('gstNumber')} placeholder="e.g. 27AAAAA1111A1Z1" className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">Business Sector</label>
            <select {...registerCompany('businessType')} className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 bg-white">
              <option value="">Choose Industry</option>
              <option value="retail">Retail Shop</option>
              <option value="wholesale">Wholesaler / Distributor</option>
              <option value="manufacturing">Manufacturing Unit</option>
            </select>
            {companyErrors.businessType && <p className="text-xs text-red-500">{companyErrors.businessType.message as string}</p>}
          </div>
          <div className="flex gap-3">
            <Button type="button" variant="outline" onClick={() => setStep(1)} className="flex-1">Back</Button>
            <Button type="submit" className="flex-1">Continue</Button>
          </div>
        </form>
      )}

      {/* Step Form 3: Location */}
      {step === 3 && (
        <form onSubmit={handleLocationSubmit(onStep3Submit)} className="space-y-4 text-left">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">Country</label>
            <input type="text" {...registerLocation('country')} defaultValue="India" className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none" />
            {locationErrors.country && <p className="text-xs text-red-500">{locationErrors.country.message as string}</p>}
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">State</label>
            <input type="text" {...registerLocation('state')} className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none" />
            {locationErrors.state && <p className="text-xs text-red-500">{locationErrors.state.message as string}</p>}
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">City</label>
            <input type="text" {...registerLocation('city')} className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none" />
            {locationErrors.city && <p className="text-xs text-red-500">{locationErrors.city.message as string}</p>}
          </div>
          <div className="flex gap-3">
            <Button type="button" variant="outline" onClick={() => setStep(2)} className="flex-1">Back</Button>
            <Button type="submit" className="flex-1">Finish Onboarding</Button>
          </div>
        </form>
      )}
    </div>
  );
};
