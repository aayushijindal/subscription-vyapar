import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { showToast } from '@/hooks/useToasts';

const forgotSchema = zod.object({
  email: zod.string().email('Please enter a valid email address')
});

type ForgotFormInputs = zod.infer<typeof forgotSchema>;

export const ForgotPassword: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<ForgotFormInputs>({
    resolver: zodResolver(forgotSchema)
  });

  const onSubmit = (data: ForgotFormInputs) => {
    console.log(data);
    showToast('success', 'Reset email dispatched!', 'Please check your spam or inbox folders.');
  };

  return (
    <div className="space-y-6 text-left">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-slate-900">Reset password</h1>
        <p className="text-sm text-slate-500">Provide the email registered with your company account.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-700">Email Address</label>
          <input 
            type="email" 
            {...register('email')}
            className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
          {errors.email && <p className="text-xs text-red-500 font-medium">{errors.email.message}</p>}
        </div>

        <Button type="submit" className="w-full py-3 justify-center">Send Instructions</Button>
      </form>

      <div className="text-center">
        <p className="text-sm text-slate-500">
          Remember credentials? <Link to="/login" className="text-blue-600 hover:text-blue-700 font-semibold">Log In</Link>
        </p>
      </div>
    </div>
  );
};
