"use client";

import Image from "next/image";
import { ShieldCheck, Truck } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { CURRENCY_SYMBOL, FREE_SHIPPING_THRESHOLD } from "@/constants";
import styles from "./OrderSummary.module.css";

export default function OrderSummary() {
  const { items, subtotal, shipping, tax, discount, total, couponCode, totalItems } = useCart();

  return (
    <aside className={styles.summary} aria-label="Order summary">
      <h2 className={styles.heading}>Your Order</h2>

      {/* Items list */}
      <ul className={styles.items} aria-label="Cart items">
        {items.map((item) => (
          <li key={item.id} className={styles.item}>
            <div className={styles.imageWrapper}>
              <Image
                src={item.image}
                alt={item.name}
                fill
                sizes="64px"
                style={{ objectFit: "cover" }}
                className={styles.image}
              />
              <span className={styles.qtyBadge} aria-label={`Quantity: ${item.quantity}`}>
                {item.quantity}
              </span>
            </div>
            <div className={styles.itemInfo}>
              <p className={styles.itemName}>{item.name}</p>
              <p className={styles.itemVariant}>
                {item.size} / {item.color}
              </p>
            </div>
            <p className={styles.itemPrice}>
              {CURRENCY_SYMBOL}{(item.price * item.quantity).toFixed(2)}
            </p>
          </li>
        ))}
      </ul>

      {/* Divider */}
      <hr className={styles.divider} />

      {/* Totals */}
      <dl className={styles.lines}>
        <div className={styles.line}>
          <dt>Subtotal ({totalItems} {totalItems === 1 ? "item" : "items"})</dt>
          <dd>{CURRENCY_SYMBOL}{subtotal.toFixed(2)}</dd>
        </div>

        {discount > 0 && (
          <div className={[styles.line, styles["line--discount"]].join(" ")}>
            <dt>Coupon {couponCode && `(${couponCode})`}</dt>
            <dd>−{CURRENCY_SYMBOL}{discount.toFixed(2)}</dd>
          </div>
        )}

        <div className={styles.line}>
          <dt>Shipping</dt>
          <dd>
            {shipping === 0
              ? <span className={styles.free}>Free</span>
              : `${CURRENCY_SYMBOL}${shipping.toFixed(2)}`}
          </dd>
        </div>

        <div className={styles.line}>
          <dt>Tax (8%)</dt>
          <dd>{CURRENCY_SYMBOL}{tax.toFixed(2)}</dd>
        </div>

        <div className={[styles.line, styles["line--total"]].join(" ")}>
          <dt>Total</dt>
          <dd>{CURRENCY_SYMBOL}{total.toFixed(2)}</dd>
        </div>
      </dl>

      {subtotal < FREE_SHIPPING_THRESHOLD && subtotal > 0 && (
        <p className={styles.shippingNote}>
          Add {CURRENCY_SYMBOL}{(FREE_SHIPPING_THRESHOLD - subtotal).toFixed(2)} more for free shipping
        </p>
      )}

      {/* Trust badges */}
      <div className={styles.trust}>
        <div className={styles.trustItem}>
          <ShieldCheck size={15} aria-hidden="true" />
          <span>Secure SSL checkout</span>
        </div>
        <div className={styles.trustItem}>
          <Truck size={15} aria-hidden="true" />
          <span>Free returns within 30 days</span>
        </div>
      </div>
    </aside>
  );
}
