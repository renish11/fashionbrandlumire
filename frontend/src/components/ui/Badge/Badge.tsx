import type { BadgeVariant } from "@/types";
import styles from "./Badge.module.css";

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

export default function Badge({ children, variant = "default", className = "" }: BadgeProps) {
  return (
    <span className={[styles.badge, styles[`badge--${variant}`], className].filter(Boolean).join(" ")}>
      {children}
    </span>
  );
}
