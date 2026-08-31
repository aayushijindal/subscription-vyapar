import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { showToast } from '@/hooks/useToasts';

const contactSchema = zod.object({
  name: zod.string().min(2, 'Name must be at least 2 characters'),
  email: zod.string().email('Invalid email address'),
  message: zod.string().min(10, 'Message must be at least 10 characters')
});

type ContactFormInputs = zod.infer<typeof contactSchema>;

export const Contact: React.FC = () => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<ContactFormInputs>({
    resolver: zodResolver(contactSchema)
  });

  const onSubmit = (data: ContactFormInputs) => {
    console.log(data);
    showToast('success', 'Message sent successfully!', 'Our team will contact you within 24 hours.');
    reset();
  };

  return (
    <div className="max-w-xl mx-auto px-6 py-20">
      <Card className="space-y-8 text-left">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Get in touch</h1>
          <p className="text-slate-500 text-sm mt-2">Have a question or request? Submit the form below.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">Full Name</label>
            <input 
              type="text" 
              {...register('name')}
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
            {errors.name && <p className="text-xs text-red-500 font-medium">{errors.name.message}</p>}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">Email Address</label>
            <input 
              type="email" 
              {...register('email')}
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
            {errors.email && <p className="text-xs text-red-500 font-medium">{errors.email.message}</p>}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">Message</label>
            <textarea 
              rows={4}
              {...register('message')}
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
            {errors.message && <p className="text-xs text-red-500 font-medium">{errors.message.message}</p>}
          </div>

          <Button type="submit" className="w-full justify-center py-3">Send Message</Button>
        </form>
      </Card>
    </div>
  );
};
