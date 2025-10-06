import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
} from 'react';

import { Toast } from './ui/toast';

type ToastType = 'success' | 'error' | 'info';

interface ToastOptions {
  type?: ToastType;
  message: string;
  duration?: number;
}

interface ToastContextType {
  showToast: (options: ToastOptions) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used inside ToastProvider');
  return context;
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [toast, setToast] = useState<ToastOptions | null>(null);

  const showToast = useCallback((options: ToastOptions) => {
    setToast(options);
  }, []);

  const hideToast = () => {
    setToast(null);
  };

  const values = useMemo(() => ({ showToast }), [showToast]);

  return (
    <ToastContext.Provider value={values}>
      {children}
      <Toast
        message={toast?.message}
        type={toast?.type}
        visible={!!toast}
        onHide={hideToast}
        duration={toast?.duration}
      />
    </ToastContext.Provider>
  );
};
