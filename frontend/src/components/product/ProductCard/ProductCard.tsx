"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Heart, ShoppingBag, Star } from "lucide-react";
import Badge from "@/components/ui/Badge";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";
import { useNotification } from "@/context/NotificationContext";
import type { Product } from "@/types";
import { CURRENCY_SYMBOL } from "@/constants";
import styles from "./ProductCard.module.css";

interface ProductCardProps {
  product: Product;
  variant?: "default" | "compact";
}

export default function ProductCard({ product, variant = "default" }: ProductCardProps) {
  const [hoveredImage, setHoveredImage] = useState(0);
  const { toggle, isInWishlist } = useWishlist();
  const { addItem } = useCart();
  const { success } = useNotification();
  const inWishlist = isInWishlist(product.id);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const defaultVariant = product.variants[0];
    if (!defaultVariant) return;
    addItem({
      id: `${product.id}-${defaultVariant.size}-${defaultVariant.color}`,
      productId: product.id,
      slug: product.slug,
      name: product.name,
      brand: product.brand,
      image: product.images[0].src,
      price: product.price,
      compareAtPrice: product.compareAtPrice,
      color: defaultVariant.color,
      size: defaultVariant.size,
      quantity: 1,
      maxQuantity: defaultVariant.stock,
    });
    success("Added to cart", `${product.name} — ${defaultVariant.size} / ${defaultVariant.color}`);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggle(product);
  };

  const discount = product.compareAtPrice
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : 0;

  return (
    <motion.article
      className={[styles.card, styles[`card--${variant}`]].join(" ")}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.25 }}
    >
      <Link href={`/product/${product.slug}`} className={styles.imageLink} tabIndex={0} aria-label={product.name}>
        <div
          className={styles.imageWrapper}
          onMouseEnter={() => product.images.length > 1 && setHoveredImage(1)}
          onMouseLeave={() => setHoveredImage(0)}
        >
          <Image
            src={product.images[hoveredImage]?.src ?? product.images[0].src}
            alt={product.images[hoveredImage]?.alt ?? product.images[0].alt}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className={styles.image}
            style={{ objectFit: "cover" }}
          />

          {/* Badges */}
          <div className={styles.badges}>
            {product.isNew && <Badge variant="gold">New</Badge>}
            {product.isBestseller && <Badge variant="default">Bestseller</Badge>}
            {discount > 0 && <Badge variant="error">-{discount}%</Badge>}
          </div>

          {/* Actions */}
          <div className={styles.actions}>
            <motion.button
              className={[styles.actionBtn, inWishlist ? styles["actionBtn--active"] : ""].join(" ")}
              onClick={handleWishlist}
              aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
              aria-pressed={inWishlist}
              whileTap={{ scale: 0.9 }}
            >
              <Heart size={18} fill={inWishlist ? "currentColor" : "none"} />
            </motion.button>

            <motion.button
              className={styles.actionBtn}
              onClick={handleQuickAdd}
              aria-label={`Quick add ${product.name} to cart`}
              whileTap={{ scale: 0.9 }}
            >
              <ShoppingBag size={18} />
            </motion.button>
          </div>
        </div>
      </Link>

      <div className={styles.info}>
        <div className={styles.meta}>
          <p className={styles.brand}>{product.brand}</p>
          <Link href={`/product/${product.slug}`} className={styles.name}>
            {product.name}
          </Link>
        </div>

        <div className={styles.pricing}>
          <div className={styles.priceRow}>
            <span className={styles.price}>
              {CURRENCY_SYMBOL}{product.price.toLocaleString()}
            </span>
            {product.compareAtPrice && (
              <span className={styles.comparePrice}>
                {CURRENCY_SYMBOL}{product.compareAtPrice.toLocaleString()}
              </span>
            )}
          </div>

          {variant === "default" && product.reviewCount > 0 && (
            <div className={styles.rating} aria-label={`Rating: ${product.rating} out of 5`}>
              <Star size={12} fill="currentColor" className={styles.star} aria-hidden="true" />
              <span className={styles.ratingValue}>{product.rating}</span>
              <span className={styles.reviewCount}>({product.reviewCount})</span>
            </div>
          )}
        </div>

        {variant === "default" && product.colors.length > 1 && (
          <div className={styles.colors} aria-label="Available colors">
            {product.colors.slice(0, 5).map((color) => (
              <span
                key={color.name}
                className={styles.colorSwatch}
                style={{ backgroundColor: color.hex }}
                title={color.name}
                aria-label={color.name}
              />
            ))}
            {product.colors.length > 5 && (
              <span className={styles.moreColors}>+{product.colors.length - 5}</span>
            )}
          </div>
        )}
      </div>
    </motion.article>
  );
}
