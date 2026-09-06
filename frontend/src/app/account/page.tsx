"use client";

import { useState, useEffect } from "react";
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
  Camera,
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
import { useUser, useClerk } from "@clerk/nextjs";
import { CURRENCY_SYMBOL, ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from "@/constants";
import { fetchOrders } from "@/lib/api";
import type { BadgeVariant, Order } from "@/types";
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
  const { user: clerkUser, isLoaded, isSignedIn } = useUser();
  const { signOut } = useClerk();
  const { user: legacyUser, logout } = useAuth();
  const { items: wishlistItems } = useWishlist();
  const { success } = useNotification();
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [orders, setOrders] = useState<Order[]>([]);

  const activeUser = isSignedIn && clerkUser
    ? {
        id: clerkUser.id,
        firstName: clerkUser.firstName || "Customer",
        lastName: clerkUser.lastName || "",
        email: clerkUser.primaryEmailAddress?.emailAddress || "",
        avatar: clerkUser.imageUrl,
        role: "member",
      }
    : legacyUser;

  useEffect(() => {
    if (activeUser) {
      fetchOrders()
        .then(setOrders)
        .catch(() => setOrders([]));
    }
  }, [!!activeUser]);

  if (!isLoaded) {
    return (
      <>
        <Navbar />
        <main className={styles.main}>
          <div className={styles.container}>
            <div className={styles.guestWrap}>
              <div className={styles.guestCard}>
                <div style={{ width: 48, height: 48, borderRadius: "50%", background: "#e5e5e5" }} />
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (!activeUser) {
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
                  <Link href="/sign-in" className="w-full">
                    <Button variant="primary" size="lg" fullWidth>
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/sign-up" className="w-full">
                    <Button variant="outline" size="lg" fullWidth>
                      Create Account
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const userOrders = orders.filter((o) => o.customerId === activeUser.id || !o.customerId);

  const handleLogout = async () => {
    if (isSignedIn) await signOut();
    logout();
    success("Signed out", "You have been signed out successfully.");
  };

  const fullName = `${activeUser.firstName} ${activeUser.lastName}`.trim();
  const initials = `${activeUser.firstName?.[0] || ""}${activeUser.lastName?.[0] || ""}`.toUpperCase();

  return (
    <>
      <Navbar />
      <main className={styles.main}>
        <div className={styles.container}>
          <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "My Account" }]} />

          <div className={styles.layout}>
            {/* ── Sidebar ── */}
            <aside className={styles.sidebar} aria-label="Account navigation">

              {/* Profile card */}
              <div className={styles.profileCard}>
                <div className={styles.avatarWrap}>
                  {activeUser.avatar ? (
                    <img
                      src={activeUser.avatar}
                      alt={fullName}
                      width={72}
                      height={72}
                      className={styles.avatar}
                    />
                  ) : (
                    <div className={styles.avatarFallback} aria-hidden="true">
                      {initials || <User size={28} />}
                    </div>
                  )}
                </div>
                <p className={styles.profileName}>{fullName}</p>
                <p className={styles.profileEmail}>{activeUser.email}</p>
                <span className={styles.profileBadge}>
                  {activeUser.role === "admin" ? "Admin" : "Member"}
                </span>
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

            {/* ── Content ── */}
            <div className={styles.content}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                >

                  {/* ── Overview ── */}
                  {activeTab === "overview" && (
                    <div className={styles.section}>
                      <h2 className={styles.sectionTitle}>Welcome back, {activeUser.firstName} 👋</h2>
                      <p className={styles.sectionSubtitle}>Here's a snapshot of your account.</p>

                      <div className={styles.statsGrid}>
                        <div className={styles.statCard}>
                          <ShoppingBag size={22} className={styles.statIcon} />
                          <p className={styles.statValue}>{userOrders.length}</p>
                          <p className={styles.statLabel}>Orders</p>
                        </div>
                        <div className={styles.statCard}>
                          <Heart size={22} className={styles.statIcon} />
                          <p className={styles.statValue}>{wishlistItems.length}</p>
                          <p className={styles.statLabel}>Wishlist</p>
                        </div>
                        <div className={styles.statCard}>
                          <Star size={22} className={styles.statIcon} />
                          <p className={styles.statValue}>{activeUser.role === "admin" ? "Admin" : "Member"}</p>
                          <p className={styles.statLabel}>Status</p>
                        </div>
                      </div>

                      {userOrders.length > 0 && (
                        <div className={styles.recentOrders}>
                          <div className={styles.recentHeader}>
                            <h3 className={styles.recentTitle}>Recent Orders</h3>
                            <button className={styles.viewAllLink} onClick={() => setActiveTab("orders")}>
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

                      {userOrders.length === 0 && (
                        <div className={styles.emptyOrders}>
                          <Package size={40} strokeWidth={1} style={{ color: "#D4AF37", marginBottom: 12 }} />
                          <p style={{ fontWeight: 500, marginBottom: 4 }}>No orders yet</p>
                          <p style={{ fontSize: 13, color: "#71717a", marginBottom: 16 }}>
                            Start shopping to see your orders here.
                          </p>
                          <Link href="/shop">
                            <Button variant="primary" size="sm">Browse Collections</Button>
                          </Link>
                        </div>
                      )}
                    </div>
                  )}

                  {/* ── Orders ── */}
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

                  {/* ── Wishlist ── */}
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

                  {/* ── Addresses ── */}
                  {activeTab === "addresses" && (
                    <div className={styles.section}>
                      <h2 className={styles.sectionTitle}>Saved Addresses</h2>
                      <EmptyState
                        icon={<MapPin size={48} strokeWidth={1} />}
                        title="No saved addresses"
                        description="Addresses you save during checkout will appear here."
                        action={<Button variant="outline">Add Address</Button>}
                      />
                    </div>
                  )}

                  {/* ── Settings ── */}
                  {activeTab === "settings" && (
                    <div className={styles.section}>
                      <h2 className={styles.sectionTitle}>Account Settings</h2>

                      {/* Profile picture */}
                      <div className={styles.settingsAvatarRow}>
                        <div className={styles.settingsAvatarWrap}>
                          {activeUser.avatar ? (
                            <img
                              src={activeUser.avatar}
                              alt={fullName}
                              width={80}
                              height={80}
                              style={{ borderRadius: "50%", objectFit: "cover", width: 80, height: 80 }}
                            />
                          ) : (
                            <div className={styles.avatarFallback} style={{ width: 80, height: 80, fontSize: 24 }}>
                              {initials}
                            </div>
                          )}
                          <button className={styles.cameraBtn} aria-label="Change profile picture">
                            <Camera size={14} />
                          </button>
                        </div>
                        <div>
                          <p style={{ fontWeight: 600, fontSize: 15 }}>{fullName}</p>
                          <p style={{ fontSize: 13, color: "#71717a" }}>{activeUser.email}</p>
                        </div>
                      </div>

                      <form
                        className={styles.settingsForm}
                        onSubmit={(e) => {
                          e.preventDefault();
                          success("Saved", "Your changes have been saved.");
                        }}
                      >
                        <div className={styles.settingsRow}>
                          <div className={styles.settingsField}>
                            <label className={styles.settingsLabel} htmlFor="firstName">First Name</label>
                            <input
                              id="firstName"
                              className={styles.settingsInput}
                              defaultValue={activeUser.firstName}
                              autoComplete="given-name"
                            />
                          </div>
                          <div className={styles.settingsField}>
                            <label className={styles.settingsLabel} htmlFor="lastName">Last Name</label>
                            <input
                              id="lastName"
                              className={styles.settingsInput}
                              defaultValue={activeUser.lastName}
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
                            defaultValue={activeUser.email}
                            autoComplete="email"
                            readOnly={!!isSignedIn}
                            style={isSignedIn ? { opacity: 0.6, cursor: "not-allowed" } : {}}
                          />
                          {isSignedIn && (
                            <p style={{ fontSize: 11, color: "#a1a1aa", marginTop: 4 }}>
                              Email is managed by your sign-in provider.
                            </p>
                          )}
                        </div>
                        {!isSignedIn && (
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
                        )}
                        <div className={styles.settingsActions}>
                          <Button type="submit" variant="primary">Save Changes</Button>
                        </div>
                      </form>

                      <div className={styles.dangerZone}>
                        <h3 className={styles.dangerTitle}>Sign Out</h3>
                        <p className={styles.dangerDesc}>Sign out of your account on this device.</p>
                        <Button variant="outline" onClick={handleLogout}>
                          <LogOut size={15} style={{ marginRight: 6 }} />
                          Sign Out
                        </Button>
                      </div>
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
