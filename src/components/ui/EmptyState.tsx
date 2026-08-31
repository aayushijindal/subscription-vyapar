import React from 'react';
import { Package2 } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  action?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No Data Found',
  description = 'There are no active records in this section yet.',
  action
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 border border-dashed border-slate-200 rounded-[16px] text-center bg-slate-50/30">
      <div className="p-3.5 bg-blue-50 text-blue-600 rounded-2xl mb-4">
        <Package2 className="h-6 w-6" />
      </div>
      <h3 className="text-base font-semibold text-slate-900 mb-1">{title}</h3>
      <p className="text-sm text-slate-500 max-w-sm mb-5 leading-relaxed">{description}</p>
      {action && <div>{action}</div>}
    </div>
  );
};
