import { useForm } from 'react-hook-form';
import { Button } from './Button';

export type FormFieldType = 'text' | 'email' | 'password' | 'number' | 'date' | 'select' | 'checkbox';

export interface FormField {
  name: string;
  label: string;
  type: FormFieldType;
  options?: { label: string; value: string | number }[]; // For select
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
  defaultValue?: any;
  onChange?: (e: React.ChangeEvent<any>, setValue: any) => void;
}

interface DynamicFormProps {
  fields: FormField[];
  onSubmit: (data: any) => void;
  onCancel?: () => void;
  submitLabel?: string;
  defaultValues?: any;
  isLoading?: boolean;
}

export function DynamicForm({ fields, onSubmit, onCancel, submitLabel = 'Save', defaultValues, isLoading }: DynamicFormProps) {
  const { register, handleSubmit, formState: { errors }, setValue } = useForm({ defaultValues });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {fields.map((field) => (
          <div key={field.name} className={`flex flex-col gap-1.5 ${field.type === 'checkbox' ? 'sm:col-span-2 flex-row items-center gap-3' : ''}`}>
            {field.type !== 'checkbox' && (
              <label className="text-sm font-medium text-slate-700">
                {field.label} {field.required && <span className="text-red-500">*</span>}
              </label>
            )}

            {field.type === 'select' ? (
              <select
                disabled={field.disabled}
                {...register(field.name, { 
                  required: field.required,
                  onChange: field.onChange ? (e) => field.onChange!(e, setValue) : undefined
                })}
                className={`w-full p-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors ${field.disabled ? 'bg-slate-100 text-slate-500 cursor-not-allowed' : 'bg-white'}`}
              >
                <option value="">Select {field.label}</option>
                {field.options?.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            ) : field.type === 'checkbox' ? (
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  disabled={field.disabled}
                  {...register(field.name, { 
                    required: field.required,
                    onChange: field.onChange ? (e) => field.onChange!(e, setValue) : undefined
                  })}
                  className={`w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500/20 ${field.disabled ? 'cursor-not-allowed' : ''}`}
                />
                <span className={`text-sm font-medium ${field.disabled ? 'text-slate-400' : 'text-slate-700'}`}>{field.label}</span>
              </label>
            ) : (
              <input
                type={field.type}
                placeholder={field.placeholder}
                disabled={field.disabled}
                {...register(field.name, { 
                  required: field.required,
                  onChange: field.onChange ? (e) => field.onChange!(e, setValue) : undefined
                })}
                className={`w-full p-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors ${field.disabled ? 'bg-slate-100 text-slate-500 cursor-not-allowed' : 'bg-white'}`}
              />
            )}

            {errors[field.name] && (
              <span className="text-xs text-red-500">This field is required</span>
            )}
          </div>
        ))}
      </div>

      <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" isLoading={isLoading}>
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
