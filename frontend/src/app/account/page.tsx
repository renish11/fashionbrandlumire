"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  LayoutGrid,
  ShoppingBag,
  Heart,
  MapPin,
  Settings,
  HelpCircle,
  LogOut,
  Truck,
  RotateCcw,
  Sparkles,
  Check,
  X,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useWishlist } from "@/context/WishlistContext";
import { useNotification } from "@/context/NotificationContext";
import { useUser, useClerk } from "@clerk/nextjs";
import styles from "./page.module.css";

type NavTab = "overview" | "orders" | "wishlist" | "addresses" | "settings";

const WISHLIST_ITEMS = [
  {
    id: "wl-1",
    category: "OUTERWEAR",
    name: "Structured Wool Blazer",
    price: 1450,
    image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&h=800&fit=crop",
    href: "/shop",
  },
  {
    id: "wl-2",
    category: "ACCESSORIES",
    name: "Silver Cuff",
    price: 420,
    image: "https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=600&h=800&fit=crop",
    href: "/shop",
  },
  {
    id: "wl-3",
    category: "SHOES",
    name: "Sculptural Leather Boot",
    price: 890,
    image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600&h=800&fit=crop",
    href: "/shop",
  },
  {
    id: "wl-4",
    category: "DRESSES",
    name: "Silk Slip Gown",
    price: 1100,
    image: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=600&h=800&fit=crop",
    href: "/shop",
  },
];

export default function AccountPage() {
  const { user: clerkUser, isSignedIn } = useUser();
  const { signOut } = useClerk();
  const { logout } = useAuth();
  const { success } = useNotification();
  const [activeTab, setActiveTab] = useState<NavTab>("overview");
  const [stylingModalOpen, setStylingModalOpen] = useState(false);
  const [stylingBooked, setStylingBooked] = useState(false);

  // User display info (falls back to Eleanor Vance from reference image)
  const userName =
    isSignedIn && clerkUser
      ? `${clerkUser.firstName || "Eleanor"} ${clerkUser.lastName || "Vance"}`.trim()
      : "Eleanor Vance";

  const userAvatar =
    isSignedIn && clerkUser?.imageUrl
      ? clerkUser.imageUrl
      : "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop";

  const handleLogout = async () => {
    if (isSignedIn) {
      await signOut();
    } else {
      logout();
    }
    success("Logged Out", "You have been logged out of your member account.");
  };

  const handleBookStyling = (e: React.FormEvent) => {
    e.preventDefault();
    setStylingBooked(true);
    setTimeout(() => {
      setStylingBooked(false);
      setStylingModalOpen(false);
      success("Styling Session Requested", "A private concierge stylist will contact you within 2 hours.");
    }, 1500);
  };

  return (
    <div className={styles.pageWrap}>
      {/* ── Left Fixed Sidebar ─────────────────────────────── */}
      <aside className={styles.sidebar}>
        {/* Brand */}
        <div className={styles.sidebarBrand}>
          <Link href="/" className={styles.logo}>
            LUMIÈRE
          </Link>
          <span className={styles.memberTag}>PRIVATE MEMBER</span>
        </div>

        {/* Navigation Items */}
        <nav className={styles.navMenu}>
          <button
            type="button"
            className={`${styles.navItem} ${activeTab === "overview" ? styles.navItemActive : ""}`}
            onClick={() => setActiveTab("overview")}
          >
            <LayoutGrid size={16} />
            <span>OVERVIEW</span>
          </button>

          <button
            type="button"
            className={`${styles.navItem} ${activeTab === "orders" ? styles.navItemActive : ""}`}
            onClick={() => setActiveTab("orders")}
          >
            <ShoppingBag size={16} />
            <span>ORDER HISTORY</span>
          </button>

          <button
            type="button"
            className={`${styles.navItem} ${activeTab === "wishlist" ? styles.navItemActive : ""}`}
            onClick={() => setActiveTab("wishlist")}
          >
            <Heart size={16} />
            <span>WISHLIST</span>
          </button>

          <button
            type="button"
            className={`${styles.navItem} ${activeTab === "addresses" ? styles.navItemActive : ""}`}
            onClick={() => setActiveTab("addresses")}
          >
            <MapPin size={16} />
            <span>ADDRESSES</span>
          </button>

          <button
            type="button"
            className={`${styles.navItem} ${activeTab === "settings" ? styles.navItemActive : ""}`}
            onClick={() => setActiveTab("settings")}
          >
            <Settings size={16} />
            <span>ACCOUNT SETTINGS</span>
          </button>
        </nav>

        {/* CTA Button */}
        <div className={styles.stylingBtnWrap}>
          <button
            type="button"
            className={styles.stylingBtn}
            onClick={() => setStylingModalOpen(true)}
          >
            BOOK PRIVATE STYLING
          </button>
        </div>

        {/* Bottom Support / Logout */}
        <div className={styles.sidebarBottom}>
          <Link href="/contact" className={styles.bottomLink}>
            <HelpCircle size={15} />
            <span>SUPPORT</span>
          </Link>
          <button type="button" onClick={handleLogout} className={styles.bottomLink}>
            <LogOut size={15} />
            <span>LOG OUT</span>
          </button>
        </div>
      </aside>

      {/* ── Main Workspace Content ─────────────────────────── */}
      <div className={styles.contentWrap}>
        <main className={styles.main}>
          {/* Breadcrumb */}
          <nav className={styles.breadcrumb} aria-label="Breadcrumb">
            <Link href="/" className={styles.bcLink}>
              HOME
            </Link>
            <span className={styles.bcSep}>/</span>
            <span className={styles.bcCurrent}>MY ACCOUNT</span>
          </nav>

          {/* Profile Header */}
          <header className={styles.profileHeader}>
            <div className={styles.avatarImgWrap}>
              <Image
                src={userAvatar}
                alt={userName}
                fill
                priority
                unoptimized
                sizes="88px"
                className={styles.avatarImg}
              />
            </div>
            <div className={styles.profileMeta}>
              <h1 className={styles.profileName}>{userName}</h1>
              <div className={styles.badgesRow}>
                <span className={styles.eliteBadge}>ELITE MEMBER</span>
                <span className={styles.pointsBadge}>
                  <Sparkles size={11} className={styles.pointsStar} />
                  1,250 POINTS
                </span>
              </div>
            </div>
          </header>

          {/* 4 Stat Cards */}
          <section className={styles.statsGrid}>
            <div className={styles.statCard}>
              <div className={styles.statTop}>
                <ShoppingBag size={18} className={styles.statIcon} />
                <span className={styles.statNumber}>12</span>
              </div>
              <span className={styles.statLabel}>TOTAL ORDERS</span>
            </div>

            <div className={styles.statCard}>
              <div className={styles.statTop}>
                <Heart size={18} className={styles.statIcon} />
                <span className={styles.statNumber}>8</span>
              </div>
              <span className={styles.statLabel}>WISHLIST</span>
            </div>

            <div className={styles.statCard}>
              <div className={styles.statTop}>
                <MapPin size={18} className={styles.statIcon} />
                <span className={styles.statNumber}>2</span>
              </div>
              <span className={styles.statLabel}>SAVED ADDRESSES</span>
            </div>

            <div className={styles.statCard}>
              <div className={styles.statTop}>
                <RotateCcw size={18} className={styles.statIcon} />
                <span className={styles.statNumber}>1</span>
              </div>
              <span className={styles.statLabel}>PENDING RETURNS</span>
            </div>
          </section>

          {/* ── Active Tab Contents ─────────────────────────── */}
          {activeTab === "overview" && (
            <>
              {/* Recent Orders Section */}
              <section className={styles.section}>
                <div className={styles.sectionHeader}>
                  <h2 className={styles.sectionTitle}>Recent Orders</h2>
                  <button
                    type="button"
                    className={styles.viewAllBtn}
                    onClick={() => setActiveTab("orders")}
                  >
                    VIEW ALL
                  </button>
                </div>

                <div className={styles.orderCard}>
                  <div className={styles.orderLeft}>
                    <div className={styles.orderThumbWrap}>
                      <Image
                        src="https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=300&h=300&fit=crop"
                        alt="Order Item"
                        fill
                        sizes="68px"
                        className={styles.orderThumb}
                      />
                    </div>
                    <div className={styles.orderInfo}>
                      <span className={styles.orderNumber}>ORDER #LM-82934</span>
                      <span className={styles.orderPrice}>$2,268.00</span>
                      <div className={styles.orderStatus}>
                        <Truck size={14} className={styles.truckIcon} />
                        <span>IN TRANSIT • OCT 20, 2024</span>
                      </div>
                    </div>
                  </div>

                  <div className={styles.orderActions}>
                    <Link href="/order-confirmation?order=LM-82934" className={styles.trackBtn}>
                      TRACK ORDER
                    </Link>
                    <Link href="/order-confirmation?order=LM-82934" className={styles.detailsBtn}>
                      DETAILS
                    </Link>
                  </div>
                </div>
              </section>

              {/* Wishlist Preview Section */}
              <section className={styles.section}>
                <div className={styles.sectionHeader}>
                  <h2 className={styles.sectionTitle}>Wishlist Preview</h2>
                  <button
                    type="button"
                    className={styles.viewAllBtn}
                    onClick={() => setActiveTab("wishlist")}
                  >
                    VIEW ALL (8)
                  </button>
                </div>

                <div className={styles.wishlistGrid}>
                  {WISHLIST_ITEMS.map((item) => (
                    <Link key={item.id} href={item.href} className={styles.wishlistCard}>
                      <div className={styles.wishlistImgWrap}>
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          unoptimized
                          sizes="(max-width: 768px) 50vw, 25vw"
                          className={styles.wishlistImg}
                        />
                      </div>
                      <span className={styles.itemCategory}>{item.category}</span>
                      <h3 className={styles.itemName}>{item.name}</h3>
                      <span className={styles.itemPrice}>
                        ${item.price.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                      </span>
                    </Link>
                  ))}
                </div>
              </section>
            </>
          )}

          {activeTab === "orders" && (
            <section className={styles.section}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>Order History</h2>
              </div>
              <div className={styles.orderCard}>
                <div className={styles.orderLeft}>
                  <div className={styles.orderThumbWrap}>
                    <Image
                      src="https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=300&h=300&fit=crop"
                      alt="Order Item"
                      fill
                      sizes="68px"
                      className={styles.orderThumb}
                    />
                  </div>
                  <div className={styles.orderInfo}>
                    <span className={styles.orderNumber}>ORDER #LM-82934</span>
                    <span className={styles.orderPrice}>$2,268.00</span>
                    <div className={styles.orderStatus}>
                      <Truck size={14} className={styles.truckIcon} />
                      <span>IN TRANSIT • OCT 20, 2024</span>
                    </div>
                  </div>
                </div>
                <div className={styles.orderActions}>
                  <Link href="/order-confirmation?order=LM-82934" className={styles.trackBtn}>
                    TRACK ORDER
                  </Link>
                  <Link href="/order-confirmation?order=LM-82934" className={styles.detailsBtn}>
                    DETAILS
                  </Link>
                </div>
              </div>
            </section>
          )}

          {activeTab === "wishlist" && (
            <section className={styles.section}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>My Wishlist (8 items)</h2>
              </div>
              <div className={styles.wishlistGrid}>
                {WISHLIST_ITEMS.map((item) => (
                  <Link key={item.id} href={item.href} className={styles.wishlistCard}>
                    <div className={styles.wishlistImgWrap}>
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        unoptimized
                        sizes="(max-width: 768px) 50vw, 25vw"
                        className={styles.wishlistImg}
                      />
                    </div>
                    <span className={styles.itemCategory}>{item.category}</span>
                    <h3 className={styles.itemName}>{item.name}</h3>
                    <span className={styles.itemPrice}>
                      ${item.price.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                    </span>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {activeTab === "addresses" && (
            <section className={styles.section}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>Saved Addresses</h2>
              </div>
              <div className={styles.addressList}>
                <div className={styles.addressCard}>
                  <span className={styles.addressBadge}>DEFAULT SHIPPING</span>
                  <h3 className={styles.addressName}>Eleanor Vance</h3>
                  <p className={styles.addressText}>
                    123 Luxury Lane, Suite 400<br />
                    New York, NY 10001<br />
                    United States
                  </p>
                </div>
                <div className={styles.addressCard}>
                  <span className={styles.addressBadge}>BILLING ADDRESS</span>
                  <h3 className={styles.addressName}>Eleanor Vance</h3>
                  <p className={styles.addressText}>
                    123 Luxury Lane, Suite 400<br />
                    New York, NY 10001<br />
                    United States
                  </p>
                </div>
              </div>
            </section>
          )}

          {activeTab === "settings" && (
            <section className={styles.section}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>Account Settings</h2>
              </div>
              <div className={styles.settingsForm}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Full Name</label>
                  <input type="text" defaultValue={userName} className={styles.formInput} />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Email Address</label>
                  <input type="email" defaultValue="eleanor.vance@lumiere.com" className={styles.formInput} />
                </div>
                <button type="button" className={styles.saveSettingsBtn}>
                  Save Profile Changes
                </button>
              </div>
            </section>
          )}
        </main>

        {/* ── Luxury Black Footer ────────────────────────────── */}
        <footer className={styles.footer}>
          <div className={styles.footerInner}>
            <div className={styles.footerBrand}>
              <span className={styles.footerLogo}>LUMIÈRE</span>
            </div>

            <div className={styles.footerLinksGrid}>
              <div className={styles.footerCol}>
                <Link href="/privacy" className={styles.footerLink}>
                  PRIVACY POLICY
                </Link>
                <Link href="/shipping" className={styles.footerLink}>
                  SHIPPING & RETURNS
                </Link>
              </div>
              <div className={styles.footerCol}>
                <Link href="/terms" className={styles.footerLink}>
                  TERMS OF SERVICE
                </Link>
                <Link href="/contact" className={styles.footerLink}>
                  CONTACT US
                </Link>
              </div>
            </div>

            <div className={styles.footerRight}>
              <p className={styles.copyright}>
                © 2024 LUMIÈRE ÉDITIONS. ALL RIGHTS RESERVED.
              </p>
            </div>
          </div>
        </footer>
      </div>

      {/* ── Private Styling Booking Modal ──────────────────── */}
      {stylingModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalCard}>
            <button
              type="button"
              className={styles.modalClose}
              onClick={() => setStylingModalOpen(false)}
            >
              <X size={18} />
            </button>
            <h2 className={styles.modalTitle}>Private Styling Concierge</h2>
            <p className={styles.modalSubtitle}>
              Reserve an exclusive one-on-one consultation with a senior Lumière wardrobe stylist in Paris, New York, or via private virtual appointment.
            </p>

            {stylingBooked ? (
              <div className={styles.bookedSuccess}>
                <Check size={28} className={styles.checkIcon} />
                <p>Thank you, {userName}. Your private appointment request is submitted.</p>
              </div>
            ) : (
              <form onSubmit={handleBookStyling} className={styles.modalForm}>
                <div>
                  <label className={styles.modalLabel}>Preferred Format</label>
                  <select className={styles.modalSelect}>
                    <option>Virtual Private Video Suite</option>
                    <option>Paris Flagship Atelier (Rue du Faubourg)</option>
                    <option>New York Suite (Madison Avenue)</option>
                  </select>
                </div>
                <div>
                  <label className={styles.modalLabel}>Styling Objective</label>
                  <input
                    type="text"
                    placeholder="e.g. Black Tie Gala, Capsule Wardrobe Curation"
                    className={styles.modalInput}
                    required
                  />
                </div>
                <button type="submit" className={styles.modalSubmitBtn}>
                  Request Private Appointment
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
