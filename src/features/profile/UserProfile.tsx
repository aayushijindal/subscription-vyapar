import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { showToast } from '@/hooks/useToasts';

const profileSchema = zod.object({
  ownerName: zod.string().min(2, 'Name is required'),
  email: zod.string().email('Please enter a valid email address'),
  companyName: zod.string().min(2, 'Company name is required'),
  gstNumber: zod.string().optional()
});

type ProfileFormInputs = zod.infer<typeof profileSchema>;

export const UserProfile: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<ProfileFormInputs>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      ownerName: 'Vikas Sharma',
      email: 'vikas@retailer.com',
      companyName: 'Vikas Retailers Ltd',
      gstNumber: '27AAAAA1111A1Z1'
    }
  });

  const onSubmit = (data: ProfileFormInputs) => {
    console.log('Update profile payload:', data);
    showToast('success', 'Profile Saved!', 'Business credentials updated successfully.');
  };

  return (
    <div className="max-w-3xl space-y-8 text-left">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Profile & Organization</h1>
        <p className="text-sm text-text-secondary mt-1">Manage user contact details, company information, and regional GST values.</p>
      </div>

      <Card>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Owner Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-text-secondary">Owner Full Name</label>
              <input 
                type="text" 
                {...register('ownerName')}
                className="w-full border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
              {errors.ownerName && <p className="text-xs text-red-500">{errors.ownerName.message}</p>}
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-text-secondary">Contact Email</label>
              <input 
                type="email" 
                {...register('email')}
                className="w-full border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
              {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
            </div>

            {/* Company Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-text-secondary">Company Name</label>
              <input 
                type="text" 
                {...register('companyName')}
                className="w-full border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none"
              />
              {errors.companyName && <p className="text-xs text-red-500">{errors.companyName.message}</p>}
            </div>

            {/* GSTIN */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-text-secondary">GSTIN Number</label>
              <input 
                type="text" 
                {...register('gstNumber')}
                className="w-full border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none"
              />
            </div>
          </div>

          <hr className="border-border/50" />

          <div className="flex justify-end">
            <Button type="submit" className="px-6 py-2.5">Save Changes</Button>
          </div>
        </form>
      </Card>
    </div>
  );
};
