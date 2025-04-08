import React, { createContext, useContext, useState, ReactNode } from "react";

type ToastVariant = "default" | "success" | "error" | "warning" | "info";
type ToastPosition = "top" | "bottom";

export interface ToastOptions {
  message: string;
  variant?: ToastVariant;
  position?: ToastPosition;
  duration?: number;
  actionLabel?: string;
  onAction?: () => void;
}

interface ToastContextType {
  toast: (options: ToastOptions) => void;
  hideToast: () => void;
  visible: boolean;
  message: string;
  variant: ToastVariant;
  position: ToastPosition;
  duration: number;
  actionLabel?: string;
  onAction?: () => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState("");
  const [variant, setVariant] = useState<ToastVariant>("default");
  const [position, setPosition] = useState<ToastPosition>("bottom");
  const [duration, setDuration] = useState(3000);
  const [actionLabel, setActionLabel] = useState<string | undefined>(undefined);
  const [onAction, setOnAction] = useState<(() => void) | undefined>(undefined);

  const toast = ({
    message,
    variant = "default",
    position = "bottom",
    duration = 3000,
    actionLabel,
    onAction,
  }: ToastOptions) => {
    setMessage(message);
    setVariant(variant);
    setPosition(position);
    setDuration(duration);
    setActionLabel(actionLabel);
    setOnAction(onAction); // Fixed: removed unnecessary function wrapper
    setVisible(true);
  };

  const hideToast = () => {
    setVisible(false);
  };

  return (
    <ToastContext.Provider
      value={{
        toast,
        hideToast,
        visible,
        message,
        variant,
        position,
        duration,
        actionLabel,
        onAction,
      }}
    >
      {children}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};
