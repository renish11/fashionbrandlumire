"use client";

import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle, XCircle, AlertTriangle, Info, X } from "lucide-react";
import { useNotification } from "@/context/NotificationContext";
import type { ToastType } from "@/types";
import styles from "./Toast.module.css";

const icons: Record<ToastType, React.ReactNode> = {
  success: <CheckCircle size={18} />,
  error: <XCircle size={18} />,
  warning: <AlertTriangle size={18} />,
  info: <Info size={18} />,
};

export default function ToastContainer() {
  const { toasts, dismiss } = useNotification();

  return (
    <div className={styles.container} role="region" aria-label="Notifications" aria-live="polite">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            className={[styles.toast, styles[`toast--${toast.type}`]].join(" ")}
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.96 }}
            transition={{ duration: 0.22 }}
            role="alert"
          >
            <span className={[styles.icon, styles[`icon--${toast.type}`]].join(" ")} aria-hidden="true">
              {icons[toast.type]}
            </span>
            <div className={styles.content}>
              <p className={styles.title}>{toast.title}</p>
              {toast.message && <p className={styles.message}>{toast.message}</p>}
            </div>
            <button
              className={styles.close}
              onClick={() => dismiss(toast.id)}
              aria-label="Dismiss notification"
            >
              <X size={16} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
