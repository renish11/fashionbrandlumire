"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Breadcrumb from "@/components/ui/Breadcrumb";
import EmptyState from "@/components/ui/EmptyState";
import Button from "@/components/ui/Button";
import CheckoutForm from "@/components/checkout/CheckoutForm";
import OrderSummary from "@/components/checkout/OrderSummary";
import { useCart } from "@/context/CartContext";
import styles from "./page.module.css";

export default function CheckoutPage() {
  const { items } = useCart();
  const router = useRouter();

  // Redirect to cart if empty (only if not currently navigating to order confirmation)
  useEffect(() => {
    if (items.length === 0) {
      if (typeof window !== "undefined") {
        const orderPlaced = sessionStorage.getItem("lumiere_order_placed");
        if (orderPlaced) return;
      }
      router.replace("/cart");
    }
  }, [items.length, router]);

  if (items.length === 0) {
    return (
      <>
        <Navbar />
        <main className={styles.main}>
          <div className={styles.container}>
            <EmptyState
              icon={<ShoppingBag size={48} strokeWidth={1} />}
              title="Your cart is empty"
              description="Add some items before proceeding to checkout."
              action={
                <Link href="/shop">
                  <Button variant="primary" size="lg">Browse Collections</Button>
                </Link>
              }
            />
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className={styles.main}>
        <div className={styles.container}>
          <Breadcrumb
            items={[
              { label: "Home", href: "/" },
              { label: "Cart", href: "/cart" },
              { label: "Checkout" },
            ]}
          />

          <h1 className={styles.title}>Checkout</h1>

          <div className={styles.layout}>
            <div className={styles.formCol}>
              <CheckoutForm />
            </div>
            <div className={styles.summaryCol}>
              <OrderSummary />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
