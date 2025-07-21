import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ToastProps {
  id: string;
  title?: string;
  description?: string;
  variant?: 'default' | 'success' | 'error' | 'warning';
  onClose: (id: string) => void;
}

const Toast: React.FC<ToastProps> = ({ id, title, description, variant = 'default', onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(id);
    }, 5000);

    return () => clearTimeout(timer);
  }, [id, onClose]);

  const variantStyles = {
    default: 'bg-white border-gray-200 text-gray-900',
    success: 'bg-green-50 border-green-200 text-green-900',
    error: 'bg-red-50 border-red-200 text-red-900',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-900',
  };

  return (
    <div
      className={cn(
        'fixed top-4 right-4 z-50 max-w-sm sm:w-96 w-[calc(100vw-2rem)] p-3 sm:p-4 border rounded-lg shadow-lg',
        'transform transition-transform duration-300 ease-out',
        'animate-in slide-in-from-right-full',
        variantStyles[variant]
      )}
    >
      <div className="flex justify-between items-start">
        <div className="flex-1 min-w-0 pr-2">
          {title && (
            <h4 className="text-xs sm:text-sm font-semibold mb-1 break-words">{title}</h4>
          )}
          {description && (
            <p className="text-xs sm:text-sm opacity-90 break-words leading-relaxed">{description}</p>
          )}
        </div>
        <button
          onClick={() => onClose(id)}
          className="ml-2 p-1 hover:bg-black/10 rounded-full transition-colors flex-shrink-0"
        >
          <X className="w-3 h-3 sm:w-4 sm:h-4" />
        </button>
      </div>
    </div>
  );
};

// Toast Manager
class ToastManager {
  private toasts: ToastProps[] = [];
  private listeners: Array<(toasts: ToastProps[]) => void> = [];

  subscribe(listener: (toasts: ToastProps[]) => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach(listener => listener(this.toasts));
  }

  add(toast: Omit<ToastProps, 'id' | 'onClose'>) {
    const id = Math.random().toString(36).substring(2);
    const newToast = {
      ...toast,
      id,
      onClose: this.remove.bind(this),
    };
    this.toasts.push(newToast);
    this.notify();
    return id;
  }

  remove(id: string) {
    this.toasts = this.toasts.filter(toast => toast.id !== id);
    this.notify();
  }
}

const toastManager = new ToastManager();

// Hook para usar toast
export const useToast = () => {
  const [toasts, setToasts] = useState<ToastProps[]>([]);

  useEffect(() => {
    return toastManager.subscribe(setToasts);
  }, []);

  return {
    toasts,
    toast: (toast: Omit<ToastProps, 'id' | 'onClose'>) => toastManager.add(toast),
  };
};

// Componente Toaster para renderizar os toasts
export const Toaster: React.FC = () => {
  const { toasts } = useToast();

  return (
    <div className="fixed top-0 right-0 z-50 space-y-2 p-4">
      {toasts.map(toast => (
        <Toast key={toast.id} {...toast} />
      ))}
    </div>
  );
};

// Função global para criar toasts
export const toast = (options: Omit<ToastProps, 'id' | 'onClose'>) => {
  return toastManager.add(options);
};

export { Toast };
