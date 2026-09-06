"use client";

import { useState } from "react";
import { Tag, X } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useNotification } from "@/context/NotificationContext";
import Button from "@/components/ui/Button";
import styles from "./CouponInput.module.css";

export default function CouponInput() {
  const { applyCoupon, removeCoupon, couponCode } = useCart();
  const { success, error } = useNotification();
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;
    setLoading(true);
    // Simulate async validation
    await new Promise((r) => setTimeout(r, 500));
    const applied = applyCoupon(code.trim());
    setLoading(false);
    if (applied) {
      success("Coupon applied!", `Code "${code.toUpperCase()}" has been applied.`);
      setCode("");
    } else {
      error("Invalid coupon", "This code is not valid or has expired.");
    }
  };

  const handleRemove = () => {
    removeCoupon();
    success("Coupon removed", "The discount has been removed from your order.");
  };

  if (couponCode) {
    return (
      <div className={styles.applied} role="status">
        <Tag size={16} aria-hidden="true" />
        <span className={styles.appliedCode}>{couponCode}</span>
        <span className={styles.appliedLabel}>applied</span>
        <button
          className={styles.removeBtn}
          onClick={handleRemove}
          aria-label="Remove coupon"
        >
          <X size={14} />
        </button>
      </div>
    );
  }

  return (
    <form className={styles.form} onSubmit={handleApply} aria-label="Apply coupon code">
      <div className={styles.inputGroup}>
        <Tag size={16} className={styles.inputIcon} aria-hidden="true" />
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          placeholder="Coupon code"
          className={styles.input}
          aria-label="Coupon code"
          maxLength={20}
          autoComplete="off"
        />
      </div>
      <Button
        type="submit"
        variant="outline"
        size="sm"
        loading={loading}
        disabled={!code.trim()}
      >
        Apply
      </Button>
    </form>
  );
}
