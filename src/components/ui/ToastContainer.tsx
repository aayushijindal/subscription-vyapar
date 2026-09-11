import React from 'react';
import { useToasts } from '@/hooks/useToasts';
import type { ToastMessage } from '@/hooks/useToasts';
import { CheckCircle2, XCircle, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const ToastContainer: React.FC = () => {
  const activeToasts = useToasts();

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none">
      <AnimatePresence>
        {activeToasts.map((toast: ToastMessage) => {
          const icons: Record<'success' | 'error' | 'info', React.ReactNode> = {
            success: <CheckCircle2 className="h-5 w-5 text-green-600" />,
            error: <XCircle className="h-5 w-5 text-red-600" />,
            info: <Info className="h-5 w-5 text-primary" />
          };

          const backgrounds: Record<'success' | 'error' | 'info', string> = {
            success: 'bg-green-50 border-green-100',
            error: 'bg-red-50 border-red-100',
            info: 'bg-primary-light border-primary/20'
          };

          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 15, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`p-4 rounded-xl border shadow-md flex items-start gap-3 pointer-events-auto ${backgrounds[toast.type]}`}
            >
              <div className="mt-0.5">{icons[toast.type]}</div>
              <div className="flex-1">
                <h4 className="text-sm font-semibold text-text-primary">{toast.title}</h4>
                {toast.message && <p className="text-xs text-text-secondary mt-0.5">{toast.message}</p>}
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};
