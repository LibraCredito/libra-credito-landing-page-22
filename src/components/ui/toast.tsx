// Toast simples usando nosso sistema customizado
export {
  Toast,
  Toaster,
  useToast,
  toast
} from './simple-toast';

// Exports para manter compatibilidade com componentes existentes
export const ToastProvider = ({ children }: { children: React.ReactNode }) => children;
export const ToastViewport = () => null;
export const ToastTitle = ({ children }: { children: React.ReactNode }) => <>{children}</>;
export const ToastDescription = ({ children }: { children: React.ReactNode }) => <>{children}</>;
export const ToastClose = () => null;
export const ToastAction = () => null;

export type ToastProps = import("./simple-toast").ToastProps;
export type ToastActionElement = React.ReactElement;
