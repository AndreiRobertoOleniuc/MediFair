import React from "react";
import { Toast } from "./Toast";
import { useToast } from "./ToastProvider";

export const ToastContainer: React.FC = () => {
  const {
    visible,
    message,
    variant,
    position,
    duration,
    actionLabel,
    onAction,
    hideToast,
  } = useToast();

  return (
    <Toast
      visible={visible}
      message={message}
      variant={variant}
      position={position}
      duration={duration}
      actionLabel={actionLabel}
      onAction={onAction}
      onDismiss={hideToast}
    />
  );
};
