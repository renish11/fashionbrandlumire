"use client";

import Link from "next/link";
import { ShieldCheck, Truck } from "lucide-react";
import { useCart } from "@/context/CartContext";
import Button from "@/components/ui/Button";
import { CURRENCY_SYMBOL, FREE_SHIPPING_THRESHOLD } from "@/constants";
import styles from "./CartSummary.module.css";

export default function CartSummary() {
  const { subtotal, shipping, tax, discount, total, totalItems } = useCart();

  const toFreeShipping = FREE_SHIPPING_THRESHOLD - subtotal;
  const freeShippingProgress = Math.min((subtotal / FREE_SHIPPING_THRESHOLD) * 100, 100);

  return (
    <aside className={styles.summary} aria-label="Order summary">
      <h2 className={styles.heading}>Order Summary</h2>

      {/* Free shipping progress */}
      {subtotal < FREE_SHIPPING_THRESHOLD && subtotal > 0 && (
        <div className={styles.shippingProgress}>
          <p className={styles.shippingMsg}>
            Add{" "}
            <strong>
              {CURRENCY_SYMBOL}{toFreeShipping.toFixed(2)}
            </strong>{" "}
            more for free shipping
          </p>
          <div className={styles.progressBar} role="progressbar" aria-valuenow={freeShippingProgress} aria-valuemin={0} aria-valuemax={100}>
            <div
              className={styles.progressFill}
              style={{ width: `${freeShippingProgress}%` }}
            />
          </div>
        </div>
      )}

      {subtotal >= FREE_SHIPPING_THRESHOLD && subtotal > 0 && (
        <div className={styles.freeShipping}>
          <Truck size={16} aria-hidden="true" />
          <span>You&apos;ve unlocked free shipping!</span>
        </div>
      )}

      {/* Line items */}
      <dl className={styles.lines}>
        <div className={styles.line}>
          <dt>Subtotal ({totalItems} {totalItems === 1 ? "item" : "items"})</dt>
          <dd>{CURRENCY_SYMBOL}{subtotal.toFixed(2)}</dd>
        </div>

        {discount > 0 && (
          <div className={[styles.line, styles["line--discount"]].join(" ")}>
            <dt>Discount</dt>
            <dd>−{CURRENCY_SYMBOL}{discount.toFixed(2)}</dd>
          </div>
        )}

        <div className={styles.line}>
          <dt>Shipping</dt>
          <dd>{shipping === 0 ? <span className={styles.free}>Free</span> : `${CURRENCY_SYMBOL}${shipping.toFixed(2)}`}</dd>
        </div>

        <div className={styles.line}>
          <dt>Estimated Tax</dt>
          <dd>{CURRENCY_SYMBOL}{tax.toFixed(2)}</dd>
        </div>

        <div className={[styles.line, styles["line--total"]].join(" ")}>
          <dt>Total</dt>
          <dd>{CURRENCY_SYMBOL}{total.toFixed(2)}</dd>
        </div>
      </dl>

      {/* CTA */}
      <Link href="/checkout" className={styles.checkoutLink}>
        <Button variant="primary" size="lg" fullWidth>
          Proceed to Checkout
        </Button>
      </Link>

      <Link href="/shop" className={styles.continueLink}>
        Continue Shopping
      </Link>

      {/* Trust signals */}
      <div className={styles.trust}>
        <div className={styles.trustItem}>
          <ShieldCheck size={16} aria-hidden="true" />
          <span>Secure checkout with SSL encryption</span>
        </div>
        <div className={styles.trustItem}>
          <Truck size={16} aria-hidden="true" />
          <span>Free returns within 30 days</span>
        </div>
      </div>
    </aside>
  );
}
