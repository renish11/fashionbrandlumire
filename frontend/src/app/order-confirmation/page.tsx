"use client";

import { Suspense, useEffect, useState, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Check } from "lucide-react";
import { useCart } from "@/context/CartContext";
import styles from "./page.module.css";

// Fallback curated products matching the user's reference image
const CURATED_ITEMS = [
  {
    id: "cur-1",
    name: "Ivory Leather Tote",
    price: 950,
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&h=750&fit=crop",
    href: "/shop",
  },
  {
    id: "cur-2",
    name: "Solitaire Pendant",
    price: 1400,
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&h=750&fit=crop",
    href: "/shop",
  },
  {
    id: "cur-3",
    name: "Cashmere Knit",
    price: 650,
    image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&h=750&fit=crop",
    href: "/shop",
  },
  {
    id: "cur-4",
    name: "Silver Hoops",
    price: 450,
    image: "https://images.unsplash.com/photo-1630019852942-f89202989a59?w=600&h=750&fit=crop",
    href: "/shop",
  },
];

interface SnapshotData {
  orderNumber?: string;
  items?: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
    size?: string;
    color?: string;
    image?: string;
  }>;
  subtotal?: number;
  shipping?: number;
  tax?: number;
  discount?: number;
  total?: number;
  shippingMethod?: string;
  address?: {
    firstName: string;
    lastName: string;
    address1: string;
    address2?: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  paymentMethod?: string;
}

function OrderConfirmationContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { clearCart } = useCart();

  const urlOrder = searchParams.get("order");
  const [orderSnapshot, setOrderSnapshot] = useState<SnapshotData | null>(null);
  const [subscribed, setSubscribed] = useState(false);
  const [emailInput, setEmailInput] = useState("");

  // Load snapshot and clear cart
  useEffect(() => {
    // Clear cart once confirmation page is reached
    clearCart();

    try {
      const raw =
        sessionStorage.getItem("lumiere_order_snapshot") ||
        localStorage.getItem("lumiere_order_snapshot");
      if (raw) {
        setOrderSnapshot(JSON.parse(raw));
      }
    } catch {}

    // Clean up temporary order flag after arrival
    const t = setTimeout(() => {
      try {
        sessionStorage.removeItem("lumiere_order_placed");
      } catch {}
    }, 1500);

    return () => clearTimeout(t);
  }, [clearCart]);

  // 5-second automatic countdown redirect to home page in background
  useEffect(() => {
    const timer = setTimeout(() => {
      window.location.href = "/";
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  // Dynamic calculated date for "Expected by Friday, Oct 24"
  const expectedDate = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 5);
    return d.toLocaleDateString("en-US", {
      weekday: "long",
      month: "short",
      day: "numeric",
    });
  }, []);

  const orderNumber =
    urlOrder || orderSnapshot?.orderNumber || "LM-82934";

  // Use snapshot items or luxury defaults from reference image
  const displayItems =
    orderSnapshot?.items && orderSnapshot.items.length > 0
      ? orderSnapshot.items
      : [
          {
            id: "default-1",
            name: "Noir Silk Gown",
            price: 1250,
            quantity: 1,
            size: "S",
            color: "NOIR",
            image:
              "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=600&h=750&fit=crop",
          },
          {
            id: "default-2",
            name: "Stiletto Pumps",
            price: 850,
            quantity: 1,
            size: "38",
            color: "NOIR",
            image:
              "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600&h=750&fit=crop",
          },
        ];

  const subtotal =
    orderSnapshot?.subtotal ??
    displayItems.reduce((acc, it) => acc + it.price * (it.quantity || 1), 0);
  const shipping = orderSnapshot?.shipping ?? 0;
  const tax = orderSnapshot?.tax ?? Math.round(subtotal * 0.08);
  const total = orderSnapshot?.total ?? subtotal + shipping + tax;

  const address = orderSnapshot?.address || {
    firstName: "Eleanor",
    lastName: "Vance",
    address1: "123 Luxury Lane, Suite 400",
    address2: "",
    city: "New York",
    state: "NY",
    zip: "10001",
    country: "United States",
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (emailInput.trim()) {
      setSubscribed(true);
    }
  };

  return (
    <div className={styles.page}>


      {/* ── Top Header with Centered LUMIÈRE Logo ───────── */}
      <header className={styles.header}>
        <Link href="/" className={styles.logo}>
          LUMIÈRE
        </Link>
      </header>

      {/* ── Main Confirmation Content ───────────────────── */}
      <main className={styles.main}>
        {/* Checkmark Icon */}
        <div className={styles.checkCircle}>
          <Check size={20} strokeWidth={2.5} />
        </div>

        {/* Title */}
        <h1 className={styles.title}>
          Thank you for your
          <br />
          order.
        </h1>

        {/* Subtitle */}
        <p className={styles.subtitle}>
          Order #{orderNumber}. A confirmation email has been sent to your inbox.
        </p>

        {/* Preparing for Shipment Card */}
        <div className={styles.shipmentCard}>
          <div className={styles.shipmentInfo}>
            <h2 className={styles.shipmentTitle}>Preparing for shipment</h2>
            <p className={styles.shipmentDate}>Expected by {expectedDate}</p>
          </div>
          <Link href="/account?tab=orders" className={styles.trackOrderBtn}>
            TRACK MY ORDER
          </Link>
        </div>

        {/* Order Summary Heading */}
        <h2 className={styles.orderSummaryHeading}>Order Summary</h2>

        {/* Items List */}
        <div className={styles.itemsList}>
          {displayItems.map((item, idx) => (
            <div key={item.id || idx} className={styles.itemRow}>
              <div className={styles.itemImgWrapper}>
                <Image
                  src={
                    item.image ||
                    "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=600&h=750&fit=crop"
                  }
                  alt={item.name}
                  fill
                  sizes="80px"
                  className={styles.itemImg}
                />
              </div>
              <div className={styles.itemInfo}>
                <h3 className={styles.itemName}>{item.name}</h3>
                <p className={styles.itemMeta}>
                  {item.size ? `SIZE: ${item.size}` : ""}
                  {item.size && item.color ? " | " : ""}
                  {item.color ? `COLOR: ${item.color.toUpperCase()}` : ""}
                  {item.quantity && item.quantity > 1 ? ` | QTY: ${item.quantity}` : ""}
                </p>
              </div>
              <div className={styles.itemPrice}>
                ${(item.price * (item.quantity || 1)).toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Financial Breakdown */}
        <div className={styles.breakdown}>
          <div className={styles.breakdownRow}>
            <span>Subtotal</span>
            <span>
              ${subtotal.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
          </div>
          <div className={styles.breakdownRow}>
            <span>Shipping</span>
            <span>{shipping === 0 ? "Complimentary" : `$${shipping.toFixed(2)}`}</span>
          </div>
          <div className={styles.breakdownRow}>
            <span>Taxes</span>
            <span>
              ${tax.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
          </div>
          <div className={styles.totalRow}>
            <span>Total</span>
            <span className={styles.totalAmount}>
              ${total.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
          </div>
        </div>

        {/* Addresses */}
        <div className={styles.addressSection}>
          <div className={styles.addressCol}>
            <h4 className={styles.addressColHeading}>SHIPPING ADDRESS</h4>
            <div className={styles.addressContent}>
              <p className={styles.addressName}>
                {address.firstName} {address.lastName}
              </p>
              <p>{address.address1}</p>
              {address.address2 ? <p>{address.address2}</p> : null}
              <p>
                {address.city}, {address.state} {address.zip}
              </p>
              <p>{address.country}</p>
            </div>
          </div>

          <div className={styles.addressCol}>
            <h4 className={styles.addressColHeading}>BILLING ADDRESS</h4>
            <div className={styles.addressContent}>
              <p>Same as shipping address.</p>
            </div>
          </div>
        </div>

        {/* Centered Action Links */}
        <nav className={styles.actionLinks} aria-label="Order support links">
          <Link href="/account?tab=orders" className={styles.actionLink}>
            Manage Order
          </Link>
          <Link href="/account" className={styles.actionLink}>
            Returns Policy
          </Link>
          <Link href="/account" className={styles.actionLink}>
            Contact Support
          </Link>
        </nav>
      </main>

      {/* ── Curated For You Section ─────────────────────── */}
      <section className={styles.curatedSection}>
        <h2 className={styles.curatedHeading}>Curated For You</h2>
        <div className={styles.curatedGrid}>
          {CURATED_ITEMS.map((prod) => (
            <Link key={prod.id} href={prod.href} className={styles.curatedCard}>
              <div className={styles.curatedImgWrapper}>
                <Image
                  src={prod.image}
                  alt={prod.name}
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className={styles.curatedImg}
                />
              </div>
              <h3 className={styles.curatedName}>{prod.name}</h3>
              <p className={styles.curatedPrice}>${prod.price.toLocaleString("en-US", { minimumFractionDigits: 2 })}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Exclusive Access Newsletter ─────────────────── */}
      <section className={styles.newsletterSection}>
        <div className={styles.newsletterBox}>
          <h2 className={styles.newsletterHeading}>Exclusive Access</h2>
          <p className={styles.newsletterText}>
            Join our newsletter to receive curated selections and early access to new collections.
          </p>
          {subscribed ? (
            <p className={styles.subscribeSuccess}>
              Thank you for subscribing to Lumière updates.
            </p>
          ) : (
            <form onSubmit={handleSubscribe} className={styles.newsletterForm}>
              <input
                type="email"
                required
                placeholder="Email Address"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                className={styles.newsletterInput}
              />
              <button type="submit" className={styles.newsletterBtn}>
                SUBSCRIBE
              </button>
            </form>
          )}
        </div>
      </section>

      {/* ── Black Luxury Footer ─────────────────────────── */}
      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <div className={styles.footerBrandCol}>
            <div className={styles.footerLogo}>LUMIÈRE</div>
            <p className={styles.copyright}>
              © 2024 LUMIÈRE LUXE. ALL RIGHTS RESERVED.
            </p>
          </div>

          <div className={styles.footerLinksGrid}>
            <div className={styles.footerLinksCol}>
              <Link href="/about" className={styles.footerLink}>Sustainability</Link>
              <Link href="/contact" className={styles.footerLink}>Contact Us</Link>
            </div>
            <div className={styles.footerLinksCol}>
              <Link href="/shipping" className={styles.footerLink}>Shipping & Returns</Link>
              <Link href="/stores" className={styles.footerLink}>Store Locator</Link>
            </div>
            <div className={styles.footerLinksCol}>
              <Link href="/privacy" className={styles.footerLink}>Privacy Policy</Link>
              <Link href="/terms" className={styles.footerLink}>Terms of Service</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function OrderConfirmationPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: "100vh", background: "#fcfbf9" }} />}>
      <OrderConfirmationContent />
    </Suspense>
  );
}
