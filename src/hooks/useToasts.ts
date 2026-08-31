import { useState, useEffect } from 'react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  title: string;
  message?: string;
}

let toastListeners: Array<(messages: ToastMessage[]) => void> = [];
let toasts: ToastMessage[] = [];

export const showToast = (type: 'success' | 'error' | 'info', title: string, message?: string) => {
  const id = Math.random().toString(36).substring(2, 9);
  const newToast: ToastMessage = { id, type, title, message };
  toasts = [...toasts, newToast];
  toastListeners.forEach(listener => listener(toasts));

  setTimeout(() => {
    toasts = toasts.filter(t => t.id !== id);
    toastListeners.forEach(listener => listener(toasts));
  }, 4000);
};

export const useToasts = () => {
  const [activeToasts, setActiveToasts] = useState<ToastMessage[]>(toasts);

  useEffect(() => {
    const handleUpdate = (updated: ToastMessage[]) => setActiveToasts(updated);
    toastListeners.push(handleUpdate);
    return () => {
      toastListeners = toastListeners.filter(l => l !== handleUpdate);
    };
  }, []);

  return activeToasts;
};
