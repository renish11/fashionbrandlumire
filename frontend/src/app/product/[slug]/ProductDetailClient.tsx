"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart,
  ShoppingBag,
  Star,
  ChevronDown,
  ChevronUp,
  Truck,
  RotateCcw,
  ShieldCheck,
  CheckCircle,
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Breadcrumb from "@/components/ui/Breadcrumb";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import ProductCard from "@/components/product/ProductCard";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useNotification } from "@/context/NotificationContext";
import { CURRENCY_SYMBOL } from "@/constants";
import type { Product } from "@/types";
import styles from "./page.module.css";

interface ProductDetailClientProps {
  product: Product;
  related: Product[];
}

export default function ProductDetailClient({ product, related }: ProductDetailClientProps) {
  const { addItem, isInCart } = useCart();
  const { toggle, isInWishlist } = useWishlist();
  const { success, error } = useNotification();

  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [activeImage, setActiveImage] = useState(0);
  const [qty, setQty] = useState(1);
  const [accordionOpen, setAccordionOpen] = useState<string | null>("description");
  const [adding, setAdding] = useState(false);

  const inWishlist = isInWishlist(product.id);
  const selectedVariant = product.variants.find(
    (v) => v.color === selectedColor.name && v.size === selectedSize
  );
  const variantsForColor = product.variants.filter(
    (v) => v.color === selectedColor.name
  );
  const alreadyInCart =
    selectedVariant && isInCart(product.id, selectedColor.name, selectedSize ?? "");

  const discount = product.compareAtPrice
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : 0;

  const handleAddToCart = async () => {
    if (!selectedSize) {
      error("Select a size", "Please choose a size before adding to cart.");
      return;
    }
    if (!selectedVariant || selectedVariant.stock === 0) {
      error("Out of stock", "This variant is currently unavailable.");
      return;
    }
    setAdding(true);
    await new Promise((r) => setTimeout(r, 300));
    addItem({
      id: `${product.id}-${selectedSize}-${selectedColor.name}`,
      productId: product.id,
      slug: product.slug,
      name: product.name,
      brand: product.brand,
      image: product.images[0].src,
      price: product.price,
      compareAtPrice: product.compareAtPrice,
      color: selectedColor.name,
      size: selectedSize,
      quantity: qty,
      maxQuantity: selectedVariant.stock,
    });
    success("Added to cart", `${product.name} — ${selectedSize} / ${selectedColor.name}`);
    setAdding(false);
  };

  const accordions = [
    {
      id: "description",
      label: "Description",
      content: product.longDescription,
    },
    {
      id: "materials",
      label: "Materials & Care",
      content: (
        <div className={styles.materialsContent}>
          <p className={styles.materialsLabel}>Materials</p>
          <ul className={styles.bulletList}>
            {product.materials.map((m) => <li key={m}>{m}</li>)}
          </ul>
          <p className={styles.materialsLabel} style={{ marginTop: "var(--space-4)" }}>Care</p>
          <ul className={styles.bulletList}>
            {product.care.map((c) => <li key={c}>{c}</li>)}
          </ul>
        </div>
      ),
    },
    {
      id: "shipping",
      label: "Shipping & Returns",
      content: (
        <div className={styles.shippingContent}>
          <div className={styles.shippingRow}>
            <Truck size={16} aria-hidden="true" />
            <span>Free shipping on orders over $150 — delivered in 3–5 business days</span>
          </div>
          <div className={styles.shippingRow}>
            <RotateCcw size={16} aria-hidden="true" />
            <span>Free returns within 30 days of purchase</span>
          </div>
          <div className={styles.shippingRow}>
            <ShieldCheck size={16} aria-hidden="true" />
            <span>2-year quality guarantee on all pieces</span>
          </div>
        </div>
      ),
    },
  ];

  return (
    <>
      <Navbar />
      <main className={styles.main}>
        <div className={styles.container}>
          {/* Breadcrumb */}
          <Breadcrumb
            items={[
              { label: "Home", href: "/" },
              { label: "Shop", href: "/shop" },
              { label: product.category, href: `/shop?category=${product.category}` },
              { label: product.name },
            ]}
          />

          <div className={styles.product}>
            {/* ── Gallery ──────────────────────────────────── */}
            <div className={styles.gallery}>
              {/* Thumbnails */}
              <div className={styles.thumbs} role="listbox" aria-label="Product images">
                {product.images.map((img, i) => (
                  <button
                    key={img.id}
                    className={[
                      styles.thumb,
                      activeImage === i ? styles["thumb--active"] : "",
                    ].join(" ")}
                    onClick={() => setActiveImage(i)}
                    aria-label={img.alt}
                    aria-selected={activeImage === i}
                    role="option"
                  >
                    <Image
                      src={img.src}
                      alt={img.alt}
                      fill
                      sizes="80px"
                      style={{ objectFit: "cover" }}
                    />
                  </button>
                ))}
              </div>

              {/* Main image */}
              <div className={styles.mainImageWrapper}>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeImage}
                    className={styles.mainImage}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Image
                      src={product.images[activeImage]?.src ?? product.images[0].src}
                      alt={product.images[activeImage]?.alt ?? product.images[0].alt}
                      fill
                      sizes="(max-width: 768px) 100vw, 55vw"
                      style={{ objectFit: "cover" }}
                      priority
                    />
                  </motion.div>
                </AnimatePresence>

                {/* Image badges */}
                <div className={styles.imageBadges}>
                  {product.isNew && <Badge variant="gold">New</Badge>}
                  {product.isBestseller && <Badge variant="default">Bestseller</Badge>}
                  {discount > 0 && <Badge variant="error">-{discount}%</Badge>}
                </div>

                {/* Wishlist btn overlay */}
                <button
                  className={[
                    styles.wishlistBtn,
                    inWishlist ? styles["wishlistBtn--active"] : "",
                  ].join(" ")}
                  onClick={() => toggle(product)}
                  aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
                  aria-pressed={inWishlist}
                >
                  <Heart size={20} fill={inWishlist ? "currentColor" : "none"} />
                </button>
              </div>
            </div>

            {/* ── Info panel ───────────────────────────────── */}
            <div className={styles.info}>
              <p className={styles.brand}>{product.brand}</p>
              <h1 className={styles.name}>{product.name}</h1>

              {/* Rating */}
              {product.reviewCount > 0 && (
                <div className={styles.rating} aria-label={`${product.rating} out of 5 stars, ${product.reviewCount} reviews`}>
                  <div className={styles.stars} aria-hidden="true">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        size={14}
                        fill={i < Math.round(product.rating) ? "currentColor" : "none"}
                        className={i < Math.round(product.rating) ? styles.starFilled : styles.starEmpty}
                      />
                    ))}
                  </div>
                  <span className={styles.ratingValue}>{product.rating}</span>
                  <a href="#reviews" className={styles.reviewCount}>
                    ({product.reviewCount} reviews)
                  </a>
                </div>
              )}

              {/* Price */}
              <div className={styles.pricing}>
                <span className={styles.price}>
                  {CURRENCY_SYMBOL}{product.price.toLocaleString()}
                </span>
                {product.compareAtPrice && (
                  <span className={styles.comparePrice}>
                    {CURRENCY_SYMBOL}{product.compareAtPrice.toLocaleString()}
                  </span>
                )}
                {discount > 0 && (
                  <span className={styles.discountBadge}>Save {discount}%</span>
                )}
              </div>

              <p className={styles.shortDesc}>{product.description}</p>

              {/* Color selector */}
              <div className={styles.optionGroup}>
                <p className={styles.optionLabel}>
                  Colour: <strong>{selectedColor.name}</strong>
                </p>
                <div className={styles.colorOptions} role="radiogroup" aria-label="Select colour">
                  {product.colors.map((color) => (
                    <label
                      key={color.name}
                      className={[
                        styles.colorOption,
                        selectedColor.name === color.name ? styles["colorOption--selected"] : "",
                      ].join(" ")}
                      title={color.name}
                    >
                      <input
                        type="radio"
                        name="color"
                        value={color.name}
                        checked={selectedColor.name === color.name}
                        onChange={() => {
                          setSelectedColor(color);
                          setSelectedSize(null);
                        }}
                        className={styles.srOnly}
                        aria-label={color.name}
                      />
                      <span
                        className={styles.colorSwatch}
                        style={{ backgroundColor: color.hex }}
                      />
                    </label>
                  ))}
                </div>
              </div>

              {/* Size selector */}
              <div className={styles.optionGroup}>
                <div className={styles.sizeHeader}>
                  <p className={styles.optionLabel}>
                    Size{selectedSize ? `: ${selectedSize}` : ""}
                  </p>
                  <Link href="#size-guide" className={styles.sizeGuideLink}>
                    Size guide
                  </Link>
                </div>
                <div className={styles.sizeOptions} role="radiogroup" aria-label="Select size">
                  {product.sizes.map((size) => {
                    const variant = variantsForColor.find((v) => v.size === size);
                    const outOfStock = !variant || variant.stock === 0;
                    return (
                      <label
                        key={size}
                        className={[
                          styles.sizeOption,
                          selectedSize === size ? styles["sizeOption--selected"] : "",
                          outOfStock ? styles["sizeOption--disabled"] : "",
                        ].join(" ")}
                      >
                        <input
                          type="radio"
                          name="size"
                          value={size}
                          checked={selectedSize === size}
                          onChange={() => !outOfStock && setSelectedSize(size)}
                          disabled={outOfStock}
                          className={styles.srOnly}
                          aria-label={`${size}${outOfStock ? " — out of stock" : ""}`}
                        />
                        {size}
                        {outOfStock && <span className={styles.strikethrough} aria-hidden="true" />}
                      </label>
                    );
                  })}
                </div>
                {!selectedSize && (
                  <p className={styles.sizeHint}>Please select a size</p>
                )}
              </div>

              {/* Quantity */}
              <div className={styles.optionGroup}>
                <p className={styles.optionLabel}>Quantity</p>
                <div className={styles.qtyStepper} role="group" aria-label="Quantity">
                  <button
                    className={styles.qtyBtn}
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    aria-label="Decrease quantity"
                    disabled={qty <= 1}
                  >
                    −
                  </button>
                  <span className={styles.qtyValue} aria-live="polite">{qty}</span>
                  <button
                    className={styles.qtyBtn}
                    onClick={() => setQty((q) => Math.min(selectedVariant?.stock ?? 10, q + 1))}
                    aria-label="Increase quantity"
                    disabled={qty >= (selectedVariant?.stock ?? 10)}
                  >
                    +
                  </button>
                </div>
                {selectedVariant && selectedVariant.stock <= 3 && selectedVariant.stock > 0 && (
                  <p className={styles.lowStock} role="status">
                    Only {selectedVariant.stock} left in stock
                  </p>
                )}
              </div>

              {/* Add to cart */}
              <div className={styles.actions}>
                <Button
                  variant="primary"
                  size="lg"
                  fullWidth
                  loading={adding}
                  onClick={handleAddToCart}
                  icon={alreadyInCart ? <CheckCircle size={18} /> : <ShoppingBag size={18} />}
                  iconPosition="left"
                  aria-label={alreadyInCart ? "Already in cart" : "Add to cart"}
                >
                  {alreadyInCart ? "In Cart — Add Again" : "Add to Cart"}
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  fullWidth
                  onClick={() => toggle(product)}
                  icon={<Heart size={18} fill={inWishlist ? "currentColor" : "none"} />}
                  iconPosition="left"
                  aria-pressed={inWishlist}
                  aria-label={inWishlist ? "Remove from wishlist" : "Save to wishlist"}
                >
                  {inWishlist ? "Saved" : "Save to Wishlist"}
                </Button>
              </div>

              {/* Trust strip */}
              <div className={styles.trust}>
                <div className={styles.trustItem}>
                  <Truck size={15} aria-hidden="true" />
                  <span>Free shipping over $150</span>
                </div>
                <div className={styles.trustItem}>
                  <RotateCcw size={15} aria-hidden="true" />
                  <span>30-day returns</span>
                </div>
                <div className={styles.trustItem}>
                  <ShieldCheck size={15} aria-hidden="true" />
                  <span>2-year guarantee</span>
                </div>
              </div>

              {/* Accordions */}
              <div className={styles.accordions}>
                {accordions.map((acc) => (
                  <div key={acc.id} className={styles.accordion}>
                    <button
                      className={styles.accordionTrigger}
                      onClick={() =>
                        setAccordionOpen((o) => (o === acc.id ? null : acc.id))
                      }
                      aria-expanded={accordionOpen === acc.id}
                    >
                      <span>{acc.label}</span>
                      {accordionOpen === acc.id ? (
                        <ChevronUp size={16} aria-hidden="true" />
                      ) : (
                        <ChevronDown size={16} aria-hidden="true" />
                      )}
                    </button>
                    <AnimatePresence>
                      {accordionOpen === acc.id && (
                        <motion.div
                          className={styles.accordionBody}
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.22 }}
                          style={{ overflow: "hidden" }}
                        >
                          <div className={styles.accordionContent}>
                            {typeof acc.content === "string" ? (
                              <p className={styles.accordionText}>{acc.content}</p>
                            ) : (
                              acc.content
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Reviews ─────────────────────────────────── */}
          {product.reviews.length > 0 && (
            <section className={styles.reviews} id="reviews" aria-labelledby="reviews-heading">
              <h2 className={styles.sectionTitle} id="reviews-heading">
                Customer Reviews
              </h2>
              <div className={styles.reviewsMeta}>
                <div className={styles.reviewsRating}>
                  <span className={styles.bigRating}>{product.rating}</span>
                  <div>
                    <div className={styles.stars} aria-hidden="true">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          size={16}
                          fill={i < Math.round(product.rating) ? "currentColor" : "none"}
                          className={i < Math.round(product.rating) ? styles.starFilled : styles.starEmpty}
                        />
                      ))}
                    </div>
                    <p className={styles.reviewsCount}>Based on {product.reviewCount} reviews</p>
                  </div>
                </div>
              </div>
              <div className={styles.reviewsGrid}>
                {product.reviews.map((review) => (
                  <article key={review.id} className={styles.reviewCard}>
                    <div className={styles.reviewHeader}>
                      <div>
                        <p className={styles.reviewAuthor}>{review.author}</p>
                        <time className={styles.reviewDate} dateTime={review.date}>
                          {new Date(review.date).toLocaleDateString("en-US", {
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </time>
                      </div>
                      <div className={styles.stars} aria-label={`${review.rating} out of 5`}>
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            size={13}
                            fill={i < review.rating ? "currentColor" : "none"}
                            className={i < review.rating ? styles.starFilled : styles.starEmpty}
                          />
                        ))}
                      </div>
                    </div>
                    <p className={styles.reviewTitle}>{review.title}</p>
                    <p className={styles.reviewBody}>{review.body}</p>
                    {review.verified && (
                      <div className={styles.verifiedBadge}>
                        <CheckCircle size={13} aria-hidden="true" />
                        <span>Verified purchase</span>
                      </div>
                    )}
                  </article>
                ))}
              </div>
            </section>
          )}

          {/* ── Related products ────────────────────────── */}
          {related.length > 0 && (
            <section className={styles.related} aria-labelledby="related-heading">
              <h2 className={styles.sectionTitle} id="related-heading">
                You May Also Like
              </h2>
              <div className={styles.relatedGrid}>
                {related.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
