import React from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';
import { Building2, Mail, Phone, User, Eye, EyeOff, Lock } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { showToast } from '@/hooks/useToasts';
import { useRegister } from '@/hooks/useAuthQueries';
const schema = zod.object({ business_name: zod.string().min(2, 'Company name is required'), owner_name: zod.string().min(2, 'Owner name is required'), email: zod.string().email('Enter a valid email address'), mobile: zod.string().min(10, 'Enter a valid mobile number'), business_type: zod.enum(['RETAIL','WHOLESALE','SERVICES','MANUFACTURING','OTHERS']), password: zod.string().min(8, 'Password must contain at least 8 characters'), confirm_password: zod.string() }).refine(data => data.password === data.confirm_password, { message: 'Passwords do not match', path: ['confirm_password'] });
type Inputs = zod.infer<typeof schema>;
export const Register: React.FC = () => {
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const registration = useRegister();
  const { register, handleSubmit, formState: { errors } } = useForm<Inputs>({ resolver: zodResolver(schema), defaultValues: { business_type: 'RETAIL' } });
  
  const onSubmit = (data: Inputs) => {
    // Map form inputs to match the backend registration schema
    const nameParts = data.owner_name.trim().split(' ');
    const first_name = nameParts[0] || '';
    const last_name = nameParts.slice(1).join(' ') || '';

    const payload = {
      username: data.email, // using email as username
      email: data.email,
      password: data.password,
      first_name,
      last_name,
      phone_number: data.mobile,
      business_name: data.business_name,
      business_type: data.business_type
    };

    registration.mutate(payload, {
      onSuccess: () => showToast('success', 'Company registered', 'Your First Computer ERP workspace is ready.'),
      onError: (error: any) => showToast('error', 'Registration failed', error?.response?.data?.message || 'Please review your information and try again.')
    });
  };
  
  const field = 'w-full rounded-xl border border-border py-2.5 pl-10 pr-4 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20';
  
  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-primary">Company onboarding</p>
        <h1 className="mt-2 text-2xl font-bold text-text-primary">Create your ERP workspace</h1>
        <p className="mt-2 text-sm text-text-secondary">Enter your business details to create a secure company account.</p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5 text-left">
            <label className="text-xs font-semibold text-text-secondary">Company name</label>
            <div className="relative">
              <Building2 className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
              <input {...register('business_name')} className={field} />
            </div>
            {errors.business_name && <p className="text-xs text-red-500">{errors.business_name.message}</p>}
          </div>
          <div className="space-y-1.5 text-left">
            <label className="text-xs font-semibold text-text-secondary">Owner name</label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
              <input {...register('owner_name')} className={field} />
            </div>
            {errors.owner_name && <p className="text-xs text-red-500">{errors.owner_name.message}</p>}
          </div>
        </div>
        <div className="space-y-1.5 text-left">
          <label className="text-xs font-semibold text-text-secondary">Business type</label>
          <select {...register('business_type')} className="w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/20">
            <option value="RETAIL">Retail</option>
            <option value="WHOLESALE">Wholesale</option>
            <option value="SERVICES">Services</option>
            <option value="MANUFACTURING">Manufacturing</option>
            <option value="OTHERS">Other</option>
          </select>
        </div>
        <div className="space-y-1.5 text-left">
          <label className="text-xs font-semibold text-text-secondary">Email address</label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
            <input type="email" {...register('email')} className={field} />
          </div>
          {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
        </div>
        <div className="space-y-1.5 text-left">
          <label className="text-xs font-semibold text-text-secondary">Mobile number</label>
          <div className="relative">
            <Phone className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
            <input {...register('mobile')} placeholder="+919876543210" className={field} />
          </div>
          {errors.mobile && <p className="text-xs text-red-500">{errors.mobile.message}</p>}
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5 text-left">
            <label className="text-xs font-semibold text-text-secondary">Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
              <input type={showPassword ? 'text' : 'password'} {...register('password')} className="w-full rounded-xl border border-border py-2.5 pl-10 pr-10 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted">
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
          </div>
          <div className="space-y-1.5 text-left">
            <label className="text-xs font-semibold text-text-secondary">Confirm password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
              <input type={showConfirmPassword ? 'text' : 'password'} {...register('confirm_password')} className="w-full rounded-xl border border-border py-2.5 pl-10 pr-10 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
              <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted">
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.confirm_password && <p className="text-xs text-red-500">{errors.confirm_password.message}</p>}
          </div>
        </div>
        <Button type="submit" isLoading={registration.isPending} className="w-full justify-center py-3">Create company account</Button>
      </form>
      <p className="text-center text-sm text-text-secondary">Already registered? <Link to="/login" className="font-semibold text-primary">Log in</Link></p>
    </div>
  );
};
