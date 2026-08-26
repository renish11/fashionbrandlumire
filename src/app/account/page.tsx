"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  ShoppingBag,
  Heart,
  MapPin,
  Settings,
  LogOut,
  Package,
  ChevronRight,
  Star,
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Breadcrumb from "@/components/ui/Breadcrumb";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import EmptyState from "@/components/ui/EmptyState";
import ProductCard from "@/components/product/ProductCard";
import { useAuth } from "@/context/AuthContext";
import { useWishlist } from "@/context/WishlistContext";
import { useNotification } from "@/context/NotificationContext";
import { CURRENCY_SYMBOL, ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from "@/constants";
import { orders } from "@/data/orders";
import type { BadgeVariant } from "@/types";
import styles from "./page.module.css";

type Tab = "overview" | "orders" | "wishlist" | "addresses" | "settings";

const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: "overview", label: "Overview", icon: <User size={18} /> },
  { id: "orders", label: "Orders", icon: <ShoppingBag size={18} /> },
  { id: "wishlist", label: "Wishlist", icon: <Heart size={18} /> },
  { id: "addresses", label: "Addresses", icon: <MapPin size={18} /> },
  { id: "settings", label: "Settings", icon: <Settings size={18} /> },
];

export default function AccountPage() {
  const { user, logout } = useAuth();
  const { items: wishlistItems } = useWishlist();
  const { success } = useNotification();
  const [activeTab, setActiveTab] = useState<Tab>("overview");

  // Guest state
  if (!user) {
    return (
      <>
        <Navbar />
        <main className={styles.main}>
          <div className={styles.container}>
            <div className={styles.guestWrap}>
              <div className={styles.guestCard}>
                <User size={48} strokeWidth={1} className={styles.guestIcon} />
                <h1 className={styles.guestTitle}>Sign in to your account</h1>
                <p className={styles.guestDesc}>
                  Access your orders, wishlist, and personal details.
                </p>
                <div className={styles.guestActions}>
                  <Button variant="primary" size="lg" fullWidth>
                    Sign In
                  </Button>
                  <Button variant="outline" size="lg" fullWidth>
                    Create Account
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const userOrders = orders.filter((o) => o.customerId === user.id);

  const handleLogout = () => {
    logout();
    success("Signed out", "You have been signed out successfully.");
  };

  return (
    <>
      <Navbar />
      <main className={styles.main}>
        <div className={styles.container}>
          <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "My Account" }]} />

          <div className={styles.layout}>
            {/* ── Sidebar ──────────────────────────────── */}
            <aside className={styles.sidebar} aria-label="Account navigation">
              {/* Profile card */}
              <div className={styles.profileCard}>
                {user.avatar ? (
                  <Image
                    src={user.avatar}
                    alt={`${user.firstName} ${user.lastName}`}
                    width={64}
                    height={64}
                    className={styles.avatar}
                  />
                ) : (
                  <div className={styles.avatarFallback} aria-hidden="true">
                    {user.firstName[0]}{user.lastName[0]}
                  </div>
                )}
                <div>
                  <p className={styles.profileName}>{user.firstName} {user.lastName}</p>
                  <p className={styles.profileEmail}>{user.email}</p>
                </div>
              </div>

              {/* Nav */}
              <nav aria-label="Account sections">
                <ul className={styles.navList}>
                  {TABS.map((tab) => (
                    <li key={tab.id}>
                      <button
                        className={[
                          styles.navItem,
                          activeTab === tab.id ? styles["navItem--active"] : "",
                        ].join(" ")}
                        onClick={() => setActiveTab(tab.id)}
                        aria-current={activeTab === tab.id ? "page" : undefined}
                      >
                        <span className={styles.navIcon}>{tab.icon}</span>
                        {tab.label}
                        <ChevronRight size={14} className={styles.navChevron} aria-hidden="true" />
                      </button>
                    </li>
                  ))}
                  <li>
                    <button
                      className={[styles.navItem, styles["navItem--danger"]].join(" ")}
                      onClick={handleLogout}
                    >
                      <span className={styles.navIcon}><LogOut size={18} /></span>
                      Sign Out
                    </button>
                  </li>
                </ul>
              </nav>
            </aside>

            {/* ── Content ──────────────────────────────── */}
            <div className={styles.content}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                >
                  {/* Overview */}
                  {activeTab === "overview" && (
                    <div className={styles.section}>
                      <h2 className={styles.sectionTitle}>Welcome back, {user.firstName}</h2>
                      <div className={styles.statsGrid}>
                        <div className={styles.statCard}>
                          <ShoppingBag size={24} className={styles.statIcon} aria-hidden="true" />
                          <p className={styles.statValue}>{userOrders.length}</p>
                          <p className={styles.statLabel}>Orders</p>
                        </div>
                        <div className={styles.statCard}>
                          <Heart size={24} className={styles.statIcon} aria-hidden="true" />
                          <p className={styles.statValue}>{wishlistItems.length}</p>
                          <p className={styles.statLabel}>Wishlist</p>
                        </div>
                        <div className={styles.statCard}>
                          <Star size={24} className={styles.statIcon} aria-hidden="true" />
                          <p className={styles.statValue}>{user.role === "admin" ? "Admin" : "Member"}</p>
                          <p className={styles.statLabel}>Status</p>
                        </div>
                      </div>

                      {/* Recent orders */}
                      {userOrders.length > 0 && (
                        <div className={styles.recentOrders}>
                          <div className={styles.recentHeader}>
                            <h3 className={styles.recentTitle}>Recent Orders</h3>
                            <button
                              className={styles.viewAllLink}
                              onClick={() => setActiveTab("orders")}
                            >
                              View all
                            </button>
                          </div>
                          {userOrders.slice(0, 2).map((order) => (
                            <div key={order.id} className={styles.orderRow}>
                              <div>
                                <p className={styles.orderNumber}>{order.orderNumber}</p>
                                <p className={styles.orderDate}>
                                  {new Date(order.createdAt).toLocaleDateString("en-US", {
                                    month: "short", day: "numeric", year: "numeric",
                                  })}
                                </p>
                              </div>
                              <Badge variant={ORDER_STATUS_COLORS[order.status] as BadgeVariant}>
                                {ORDER_STATUS_LABELS[order.status]}
                              </Badge>
                              <p className={styles.orderTotal}>
                                {CURRENCY_SYMBOL}{order.total.toFixed(2)}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Orders */}
                  {activeTab === "orders" && (
                    <div className={styles.section}>
                      <h2 className={styles.sectionTitle}>My Orders</h2>
                      {userOrders.length === 0 ? (
                        <EmptyState
                          icon={<Package size={48} strokeWidth={1} />}
                          title="No orders yet"
                          description="When you place your first order, it will appear here."
                          action={
                            <Link href="/shop">
                              <Button variant="primary">Start Shopping</Button>
                            </Link>
                          }
                        />
                      ) : (
                        <div className={styles.ordersList}>
                          {userOrders.map((order) => (
                            <article key={order.id} className={styles.orderCard}>
                              <div className={styles.orderCardHeader}>
                                <div>
                                  <p className={styles.orderNumber}>{order.orderNumber}</p>
                                  <p className={styles.orderDate}>
                                    Placed{" "}
                                    {new Date(order.createdAt).toLocaleDateString("en-US", {
                                      month: "long", day: "numeric", year: "numeric",
                                    })}
                                  </p>
                                </div>
                                <div className={styles.orderCardMeta}>
                                  <Badge variant={ORDER_STATUS_COLORS[order.status] as BadgeVariant}>
                                    {ORDER_STATUS_LABELS[order.status]}
                                  </Badge>
                                  <p className={styles.orderTotal}>
                                    {CURRENCY_SYMBOL}{order.total.toFixed(2)}
                                  </p>
                                </div>
                              </div>
                              <div className={styles.orderItems}>
                                {order.items.map((item, i) => (
                                  <div key={i} className={styles.orderItem}>
                                    <div className={styles.orderItemImage}>
                                      <Image
                                        src={item.image}
                                        alt={item.name}
                                        fill
                                        sizes="56px"
                                        style={{ objectFit: "cover" }}
                                      />
                                    </div>
                                    <div>
                                      <p className={styles.orderItemName}>{item.name}</p>
                                      <p className={styles.orderItemVariant}>
                                        {item.size} / {item.color} × {item.quantity}
                                      </p>
                                    </div>
                                    <p className={styles.orderItemPrice}>
                                      {CURRENCY_SYMBOL}{(item.price * item.quantity).toFixed(2)}
                                    </p>
                                  </div>
                                ))}
                              </div>
                              {order.trackingNumber && (
                                <p className={styles.trackingNum}>
                                  Tracking: <strong>{order.trackingNumber}</strong>
                                </p>
                              )}
                            </article>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Wishlist */}
                  {activeTab === "wishlist" && (
                    <div className={styles.section}>
                      <h2 className={styles.sectionTitle}>My Wishlist</h2>
                      {wishlistItems.length === 0 ? (
                        <EmptyState
                          icon={<Heart size={48} strokeWidth={1} />}
                          title="Your wishlist is empty"
                          description="Save your favourite pieces and find them here."
                          action={
                            <Link href="/shop">
                              <Button variant="primary">Browse Collections</Button>
                            </Link>
                          }
                        />
                      ) : (
                        <div className={styles.wishlistGrid}>
                          {wishlistItems.map((product) => (
                            <ProductCard key={product.id} product={product} />
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Addresses */}
                  {activeTab === "addresses" && (
                    <div className={styles.section}>
                      <h2 className={styles.sectionTitle}>Saved Addresses</h2>
                      <EmptyState
                        icon={<MapPin size={48} strokeWidth={1} />}
                        title="No saved addresses"
                        description="Addresses you save during checkout will appear here."
                        action={
                          <Button variant="outline">Add Address</Button>
                        }
                      />
                    </div>
                  )}

                  {/* Settings */}
                  {activeTab === "settings" && (
                    <div className={styles.section}>
                      <h2 className={styles.sectionTitle}>Account Settings</h2>
                      <form className={styles.settingsForm} onSubmit={(e) => { e.preventDefault(); success("Saved", "Your changes have been saved."); }}>
                        <div className={styles.settingsRow}>
                          <div className={styles.settingsField}>
                            <label className={styles.settingsLabel} htmlFor="firstName">First Name</label>
                            <input
                              id="firstName"
                              className={styles.settingsInput}
                              defaultValue={user.firstName}
                              autoComplete="given-name"
                            />
                          </div>
                          <div className={styles.settingsField}>
                            <label className={styles.settingsLabel} htmlFor="lastName">Last Name</label>
                            <input
                              id="lastName"
                              className={styles.settingsInput}
                              defaultValue={user.lastName}
                              autoComplete="family-name"
                            />
                          </div>
                        </div>
                        <div className={styles.settingsField}>
                          <label className={styles.settingsLabel} htmlFor="email">Email</label>
                          <input
                            id="email"
                            type="email"
                            className={styles.settingsInput}
                            defaultValue={user.email}
                            autoComplete="email"
                          />
                        </div>
                        <div className={styles.settingsField}>
                          <label className={styles.settingsLabel} htmlFor="newPassword">New Password</label>
                          <input
                            id="newPassword"
                            type="password"
                            className={styles.settingsInput}
                            placeholder="Leave blank to keep current"
                            autoComplete="new-password"
                          />
                        </div>
                        <div className={styles.settingsActions}>
                          <Button type="submit" variant="primary">Save Changes</Button>
                        </div>
                      </form>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
