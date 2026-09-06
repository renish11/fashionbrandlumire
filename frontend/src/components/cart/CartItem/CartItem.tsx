"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useCart } from "@/context/CartContext";
import type { CartItem as CartItemType } from "@/types";
import { CURRENCY_SYMBOL } from "@/constants";
import styles from "./CartItem.module.css";

interface CartItemProps {
  item: CartItemType;
}

export default function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeItem } = useCart();

  const lineTotal = item.price * item.quantity;
  const savings = item.compareAtPrice
    ? (item.compareAtPrice - item.price) * item.quantity
    : 0;

  return (
    <motion.article
      className={styles.item}
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -24, scale: 0.97 }}
      transition={{ duration: 0.22 }}
    >
      {/* Image */}
      <Link href={`/product/${item.slug}`} className={styles.imageLink} tabIndex={0}>
        <div className={styles.imageWrapper}>
          <Image
            src={item.image}
            alt={item.name}
            fill
            sizes="(max-width: 640px) 80px, 100px"
            style={{ objectFit: "cover" }}
            className={styles.image}
          />
        </div>
      </Link>

      {/* Info */}
      <div className={styles.info}>
        <div className={styles.top}>
          <div>
            <p className={styles.brand}>{item.brand}</p>
            <Link href={`/product/${item.slug}`} className={styles.name}>
              {item.name}
            </Link>
            <p className={styles.variant}>
              {item.size} / {item.color}
            </p>
          </div>

          <button
            className={styles.removeBtn}
            onClick={() => removeItem(item.id)}
            aria-label={`Remove ${item.name} from cart`}
          >
            <Trash2 size={16} />
          </button>
        </div>

        <div className={styles.bottom}>
          {/* Quantity stepper */}
          <div className={styles.stepper} role="group" aria-label="Quantity">
            <button
              className={styles.stepBtn}
              onClick={() => updateQuantity(item.id, item.quantity - 1)}
              aria-label="Decrease quantity"
              disabled={item.quantity <= 1}
            >
              <Minus size={14} />
            </button>
            <span className={styles.qty} aria-live="polite">{item.quantity}</span>
            <button
              className={styles.stepBtn}
              onClick={() => updateQuantity(item.id, item.quantity + 1)}
              aria-label="Increase quantity"
              disabled={item.quantity >= item.maxQuantity}
            >
              <Plus size={14} />
            </button>
          </div>

          {/* Price */}
          <div className={styles.pricing}>
            {item.compareAtPrice && (
              <span className={styles.comparePrice}>
                {CURRENCY_SYMBOL}{(item.compareAtPrice * item.quantity).toLocaleString()}
              </span>
            )}
            <span className={styles.price}>
              {CURRENCY_SYMBOL}{lineTotal.toLocaleString()}
            </span>
            {savings > 0 && (
              <span className={styles.savings}>
                Save {CURRENCY_SYMBOL}{savings.toLocaleString()}
              </span>
            )}
          </div>
        </div>

        {item.quantity >= item.maxQuantity && (
          <p className={styles.stockWarning} role="alert">
            Maximum stock reached
          </p>
        )}
      </div>
    </motion.article>
  );
}
