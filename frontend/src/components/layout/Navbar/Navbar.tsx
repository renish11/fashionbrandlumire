"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ShoppingBag, Heart, User, Menu, X, ChevronDown } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { NAV_LINKS } from "@/constants";
import styles from "./Navbar.module.css";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);
  const { totalItems } = useCart();
  const { items: wishlistItems } = useWishlist();
  const { isSignedIn, isLoaded, user: clerkUser } = useUser();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (searchOpen) {
      setTimeout(() => searchRef.current?.focus(), 100);
    }
  }, [searchOpen]);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const handleMenuEnter = (label: string) => setActiveMenu(label);
  const handleMenuLeave = () => setActiveMenu(null);

  return (
    <>
      {/* Announcement bar */}
      <div className={styles.announcement} aria-label="Promotions">
        <div className={styles.marqueeTrack} aria-hidden="true">
          {/* Render twice for seamless loop */}
          {[...Array(2)].map((_, setIdx) => (
            <span key={setIdx} style={{ display: "inline-flex", alignItems: "center" }}>
              {[
                "Complimentary Shipping on Orders Over $150",
                "Free Returns Within 30 Days",
                "New Spring / Summer 2026 Collection — Now Live",
                "Exclusive Members-Only Drops",
                "Bespoke Styling Concierge Available",
                "Sustainable Luxury — Responsibly Made",
              ].map((msg, i) => (
                <span key={i} className={styles.marqueeItem}>
                  <span className={styles.marqueeDot} />
                  {msg}
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>

      <header
        className={[styles.header, scrolled ? styles["header--scrolled"] : ""].join(" ")}
        role="banner"
      >
        <div className={styles.container}>
          {/* Mobile menu toggle */}
          <button
            className={styles.menuToggle}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>

          {/* Logo */}
          <Link href="/" className={styles.logo} aria-label="Lumière Home">
            <span className={styles.logoText}>Lumière</span>
          </Link>

          {/* Desktop nav */}
          <nav className={styles.nav} aria-label="Main navigation">
            <ul className={styles.navList} role="menubar">
              {NAV_LINKS.map((link) => (
                <li
                  key={link.label}
                  className={[
                    styles.navItem,
                    link.children ? styles["navItem--dropdown"] : "",
                  ].join(" ")}
                  onMouseEnter={() => link.children && handleMenuEnter(link.label)}
                  onMouseLeave={handleMenuLeave}
                  role="none"
                >
                  <Link
                    href={link.href}
                    className={[
                      styles.navLink,
                      activeMenu === link.label ? styles["navLink--active"] : "",
                    ].join(" ")}
                    role="menuitem"
                    aria-haspopup={link.children ? "true" : undefined}
                    aria-expanded={activeMenu === link.label ? "true" : undefined}
                  >
                    {link.label}
                    {link.children && (
                      <ChevronDown size={14} className={styles.chevron} aria-hidden="true" />
                    )}
                  </Link>

                  {/* Mega menu */}
                  {link.children && (
                    <AnimatePresence>
                      {activeMenu === link.label && (
                        <motion.div
                          className={styles.megaMenu}
                          initial={{ opacity: 0, y: -8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -8 }}
                          transition={{ duration: 0.18 }}
                          role="menu"
                          aria-label={`${link.label} submenu`}
                        >
                          <ul className={styles.megaList}>
                            {link.children.map((child) => (
                              <li key={child.label} role="none">
                                <Link
                                  href={child.href}
                                  className={styles.megaLink}
                                  role="menuitem"
                                  onClick={() => setActiveMenu(null)}
                                >
                                  {child.label}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          {/* Actions */}
          <div className={styles.actions}>
            <button
              className={styles.actionBtn}
              onClick={() => setSearchOpen(!searchOpen)}
              aria-label="Search"
              aria-expanded={searchOpen}
            >
              <Search size={20} />
            </button>

            {isLoaded && isSignedIn ? (
              <Link href="/account" className={styles.actionBtn} aria-label="My Account">
                {clerkUser?.imageUrl ? (
                  <img
                    src={clerkUser.imageUrl}
                    alt={clerkUser.firstName || "Profile"}
                    width={28}
                    height={28}
                    style={{ borderRadius: "50%", objectFit: "cover", border: "1.5px solid #D4AF37" }}
                  />
                ) : (
                  <User size={20} />
                )}
              </Link>
            ) : (
              <Link href="/sign-in" className={styles.actionBtn} aria-label="Sign In">
                <User size={20} />
              </Link>
            )}

            <Link href="/account#wishlist" className={[styles.actionBtn, styles.actionBtnBadge].join(" ")} aria-label={`Wishlist (${wishlistItems.length} items)`}>
              <Heart size={20} />
              {wishlistItems.length > 0 && (
                <span className={styles.badge} aria-hidden="true">
                  {wishlistItems.length}
                </span>
              )}
            </Link>

            <Link href="/cart" className={[styles.actionBtn, styles.actionBtnBadge].join(" ")} aria-label={`Cart (${totalItems} items)`}>
              <ShoppingBag size={20} />
              {totalItems > 0 && (
                <motion.span
                  key={totalItems}
                  className={styles.badge}
                  initial={{ scale: 0.5 }}
                  animate={{ scale: 1 }}
                  aria-hidden="true"
                >
                  {totalItems}
                </motion.span>
              )}
            </Link>
          </div>
        </div>

        {/* Search bar */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              className={styles.searchBar}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className={styles.searchInner}>
                <Search size={18} className={styles.searchIcon} aria-hidden="true" />
                <input
                  ref={searchRef}
                  type="search"
                  placeholder="Search for pieces..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={styles.searchInput}
                  aria-label="Search products"
                />
                <button
                  className={styles.searchClose}
                  onClick={() => { setSearchOpen(false); setSearchQuery(""); }}
                  aria-label="Close search"
                >
                  <X size={18} />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              className={styles.overlay}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              aria-hidden="true"
            />
            <motion.nav
              className={styles.mobileNav}
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              aria-label="Mobile navigation"
            >
              <div className={styles.mobileHeader}>
                <span className={styles.logoText}>Lumière</span>
                <button onClick={() => setMobileOpen(false)} aria-label="Close menu">
                  <X size={22} />
                </button>
              </div>
              <ul className={styles.mobileList}>
                {NAV_LINKS.map((link) => (
                  <li key={link.label} className={styles.mobileItem}>
                    <Link
                      href={link.href}
                      className={styles.mobileLink}
                      onClick={() => setMobileOpen(false)}
                    >
                      {link.label}
                    </Link>
                    {link.children && (
                      <ul className={styles.mobileSubList}>
                        {link.children.map((child) => (
                          <li key={child.label}>
                            <Link
                              href={child.href}
                              className={styles.mobileSubLink}
                              onClick={() => setMobileOpen(false)}
                            >
                              {child.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ul>
              <div className={styles.mobileActions}>
                {isLoaded && isSignedIn ? (
                  <Link href="/account" className={styles.mobileActionLink} onClick={() => setMobileOpen(false)}>
                    <User size={18} /> My Account
                  </Link>
                ) : (
                  <Link href="/sign-in" className={styles.mobileActionLink} onClick={() => setMobileOpen(false)}>
                    <User size={18} /> Sign In / Register
                  </Link>
                )}
                <Link href="/account#wishlist" className={styles.mobileActionLink} onClick={() => setMobileOpen(false)}>
                  <Heart size={18} /> Wishlist
                </Link>
                <Link href="/cart" className={styles.mobileActionLink} onClick={() => setMobileOpen(false)}>
                  <ShoppingBag size={18} /> Cart {totalItems > 0 && `(${totalItems})`}
                </Link>
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
