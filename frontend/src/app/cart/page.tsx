"use client";

import { AnimatePresence } from "framer-motion";
import { ShoppingBag } from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Breadcrumb from "@/components/ui/Breadcrumb";
import EmptyState from "@/components/ui/EmptyState";
import Button from "@/components/ui/Button";
import CartItem from "@/components/cart/CartItem";
import CartSummary from "@/components/cart/CartSummary";
import { useCart } from "@/context/CartContext";
import styles from "./page.module.css";

export default function CartPage() {
  const { items, clearCart } = useCart();

  return (
    <>
      <Navbar />
      <main className={styles.main}>
        <div className={styles.container}>
          {/* Breadcrumb */}
          <Breadcrumb
            items={[
              { label: "Home", href: "/" },
              { label: "Cart" },
            ]}
          />

          <div className={styles.header}>
            <h1 className={styles.title}>Shopping Cart</h1>
            {items.length > 0 && (
              <button
                className={styles.clearBtn}
                onClick={clearCart}
                aria-label="Clear cart"
              >
                Clear all
              </button>
            )}
          </div>

          {items.length === 0 ? (
            <div className={styles.emptyWrapper}>
              <EmptyState
                icon={<ShoppingBag size={48} strokeWidth={1} />}
                title="Your cart is empty"
                description="Looks like you haven't added anything yet. Explore our collections and find something you love."
                action={
                  <Link href="/shop">
                    <Button variant="primary" size="lg">
                      Browse Collections
                    </Button>
                  </Link>
                }
              />
            </div>
          ) : (
            <div className={styles.layout}>
              {/* Items column */}
              <div className={styles.itemsCol}>
                <ul className={styles.itemsList} aria-label="Cart items">
                  <AnimatePresence mode="popLayout">
                    {items.map((item) => (
                      <li key={item.id}>
                        <CartItem item={item} />
                      </li>
                    ))}
                  </AnimatePresence>
                </ul>

                {/* Coupon below items */}
                <div className={styles.couponRow} style={{ display: 'none' }}>
                </div>
              </div>

              {/* Summary column */}
              <div className={styles.summaryCol}>
                <CartSummary />
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
