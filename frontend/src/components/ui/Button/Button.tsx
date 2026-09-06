"use client";

import { forwardRef, type ButtonHTMLAttributes } from "react";
import { motion } from "framer-motion";
import type { ButtonVariant, ButtonSize } from "@/types";
import styles from "./Button.module.css";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  fullWidth?: boolean;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = "primary",
      size = "md",
      loading = false,
      fullWidth = false,
      icon,
      iconPosition = "left",
      className = "",
      disabled,
      ...props
    },
    ref
  ) => {
    const classes = [
      styles.btn,
      styles[`btn--${variant}`],
      styles[`btn--${size}`],
      fullWidth ? styles["btn--full"] : "",
      loading ? styles["btn--loading"] : "",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <motion.button
        ref={ref}
        className={classes}
        disabled={disabled || loading}
        whileTap={{ scale: disabled || loading ? 1 : 0.97 }}
        {...(props as React.ComponentProps<typeof motion.button>)}
      >
        {loading && (
          <span className={styles.spinner} aria-hidden="true" />
        )}
        {!loading && icon && iconPosition === "left" && (
          <span className={styles.icon}>{icon}</span>
        )}
        {children && <span className={styles.label}>{children}</span>}
        {!loading && icon && iconPosition === "right" && (
          <span className={styles.icon}>{icon}</span>
        )}
      </motion.button>
    );
  }
);

Button.displayName = "Button";
export default Button;
