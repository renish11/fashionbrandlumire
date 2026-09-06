"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import type { Toast, ToastType } from "@/types";

interface NotificationContextValue {
  toasts: Toast[];
  notify: (type: ToastType, title: string, message?: string, duration?: number) => void;
  dismiss: (id: string) => void;
  success: (title: string, message?: string) => void;
  error: (title: string, message?: string) => void;
  warning: (title: string, message?: string) => void;
  info: (title: string, message?: string) => void;
}

const NotificationContext = createContext<NotificationContextValue | null>(null);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const notify = useCallback(
    (type: ToastType, title: string, message?: string, duration = 4000) => {
      const id = `toast-${Date.now()}-${Math.random()}`;
      const toast: Toast = { id, type, title, message, duration };
      setToasts((prev) => [...prev, toast]);
      setTimeout(() => dismiss(id), duration);
    },
    [dismiss]
  );

  const success = useCallback(
    (title: string, message?: string) => notify("success", title, message),
    [notify]
  );
  const error = useCallback(
    (title: string, message?: string) => notify("error", title, message),
    [notify]
  );
  const warning = useCallback(
    (title: string, message?: string) => notify("warning", title, message),
    [notify]
  );
  const info = useCallback(
    (title: string, message?: string) => notify("info", title, message),
    [notify]
  );

  return (
    <NotificationContext.Provider
      value={{ toasts, notify, dismiss, success, error, warning, info }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotification(): NotificationContextValue {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error("useNotification must be used within NotificationProvider");
  return ctx;
}
