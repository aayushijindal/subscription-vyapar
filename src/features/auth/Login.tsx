import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';
import { Eye, EyeOff, Lock, User } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { showToast } from '@/hooks/useToasts';
import { useLogin } from '@/hooks/useAuthQueries';

const schema = zod.object({ 
  username: zod.string().min(1, 'Username is required'), 
  password: zod.string().min(1, 'Password is required') 
});
type Inputs = zod.infer<typeof schema>;

export const Login: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false); 
  const login = useLogin();
  const { register, handleSubmit, formState: { errors } } = useForm<Inputs>({ resolver: zodResolver(schema) });
  
  const onSubmit = (data: Inputs) => login.mutate(data, { 
    onSuccess: () => showToast('success', 'Welcome back', 'Your company workspace is ready.'), 
    onError: (error: any) => showToast('error', 'Unable to log in', error?.response?.data?.message || 'Please check your username and password.') 
  });
  
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-text-primary">Log in to your workspace</h1>
        <p className="text-sm text-text-secondary">Use the username and password registered for your company.</p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-1.5 text-left">
          <label className="text-xs font-semibold text-text-secondary">Username</label>
          <div className="relative">
            <User className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
            <input type="text" {...register('username')} placeholder="admin" className="w-full rounded-xl border border-border py-2.5 pl-10 pr-4 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
          </div>
          {errors.username && <p className="text-xs text-red-500">{errors.username.message}</p>}
        </div>
        <div className="space-y-1.5 text-left">
          <div className="flex justify-between">
            <label className="text-xs font-semibold text-text-secondary">Password</label>
            <Link to="/forgot-password" className="text-xs font-medium text-primary">Forgot Password?</Link>
          </div>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
            <input type={showPassword ? 'text' : 'password'} {...register('password')} className="w-full rounded-xl border border-border py-2.5 pl-10 pr-10 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted">
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
        </div>
        <Button type="submit" isLoading={login.isPending} className="w-full justify-center py-3">Log In</Button>
      </form>
      <p className="text-center text-sm text-text-secondary">New to First Computer ERP? <Link to="/register" className="font-semibold text-primary">Register Company</Link></p>
    </div>
  );
};

