"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CreditCard, Wallet, ChevronDown, ChevronUp, Lock, ShieldCheck } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useNotification } from "@/context/NotificationContext";
import Input from "@/components/forms/Input";
import Button from "@/components/ui/Button";
import { COUNTRIES, PAYMENT_METHODS } from "@/constants";
import { createPaymentOrder, verifyPayment } from "@/lib/api";
import styles from "./CheckoutForm.module.css";

// ── Validation schema ──────────────────────────────────────
const schema = z.object({
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  email: z.string().email("Enter a valid email"),
  phone: z.string().min(7, "Enter a valid phone number"),
  address1: z.string().min(5, "Address is required"),
  address2: z.string().optional(),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State / Province is required"),
  zip: z.string().min(3, "ZIP / Postal code is required"),
  country: z.string().min(1, "Country is required"),
  paymentMethod: z.string().min(1, "Select a payment method"),
  shippingMethod: z.string().min(1, "Select a shipping method"),
  sameAsBilling: z.boolean().optional(),
});

type FormValues = z.infer<typeof schema>;

const paymentIcons: Record<string, React.ReactNode> = {
  razorpay: <CreditCard size={18} />,
  cod: <Wallet size={18} />,
};

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === "undefined") return resolve(false);
    if ((window as any).Razorpay) return resolve(true);

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export default function CheckoutForm() {
  const router = useRouter();
  const { clearCart, total, items, setShippingMethod, subtotal, shipping, tax, discount, shippingMethod: cartShippingMethod } = useCart();
  const { success, error } = useNotification();
  const [shippingOpen, setShippingOpen] = useState(true);
  const [shippingMethodOpen, setShippingMethodOpen] = useState(true);
  const [paymentOpen, setPaymentOpen] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      country: "United States",
      paymentMethod: "razorpay",
      shippingMethod: "standard",
      sameAsBilling: true,
    },
  });

  const paymentMethod = watch("paymentMethod");
  const shippingMethod = watch("shippingMethod");

  // Sync shipping method with global cart state for total calculations
  
  useEffect(() => {
    setShippingMethod(shippingMethod);
  }, [shippingMethod, setShippingMethod]);

  // Save order snapshot to sessionStorage and localStorage so the confirmation page can display it
  const saveOrderSnapshot = (data: FormValues, orderNumber: string) => {
    try {
      const snapshot = {
        orderNumber,
        items: items.length > 0 ? items : undefined,
        subtotal: subtotal > 0 ? subtotal : undefined,
        shipping: shipping,
        tax: tax > 0 ? tax : undefined,
        discount: discount > 0 ? discount : undefined,
        total: total > 0 ? total : undefined,
        shippingMethod: cartShippingMethod || "standard",
        address: {
          firstName: data.firstName || "Eleanor",
          lastName: data.lastName || "Vance",
          address1: data.address1 || "123 Luxury Lane, Suite 400",
          address2: data.address2 || "",
          city: data.city || "New York",
          state: data.state || "NY",
          zip: data.zip || "10001",
          country: data.country || "United States",
        },
        paymentMethod: data.paymentMethod,
      };
      sessionStorage.setItem("lumiere_order_snapshot", JSON.stringify(snapshot));
      sessionStorage.setItem("lumiere_order_placed", "true");
      localStorage.setItem("lumiere_order_snapshot", JSON.stringify(snapshot));
    } catch {}
  };

  const onSubmit = async (data: FormValues) => {
    setSubmitting(true);
    const orderNumber = `LM-${Date.now().toString().slice(-5)}`;

    // ── Flow 1: Cash on Delivery ──────────────────────────
    if (data.paymentMethod === "cod") {
      try {
        await new Promise((r) => setTimeout(r, 400));
        saveOrderSnapshot(data, orderNumber);
        success(
          "Order Confirmed!",
          `Order #${orderNumber} placed successfully with Cash on Delivery.`
        );
        // Guaranteed navigation to order confirmation page
        window.location.href = `/order-confirmation?order=${orderNumber}`;
      } catch {
        error("Order placement failed", "Something went wrong. Please try again.");
        setSubmitting(false);
      }
      return;
    }

    // ── Flow 2: Razorpay Payment Gateway ──────────────────
    try {
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        error("Razorpay Error", "Could not load Razorpay SDK. Please check your internet connection.");
        setSubmitting(false);
        return;
      }

      // 1. Create order on backend API
      const orderRes = await createPaymentOrder(total, orderNumber);

      // 2. Configure Razorpay modal
      const options = {
        key: orderRes.key || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_51AbCdEfGhIjKl",
        amount: orderRes.amount,
        currency: orderRes.currency || "INR",
        name: "Lumière Luxury Fashion",
        description: `Order ${orderNumber}`,
        image: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=120&h=120&fit=crop",
        order_id: orderRes.orderId,
        prefill: {
          name: `${data.firstName} ${data.lastName}`,
          email: data.email,
          contact: data.phone,
        },
        theme: {
          color: "#D4AF37",
        },
        handler: async function (response: any) {
          try {
            // 3. Verify server-side signature
            const verifyRes = await verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            if (verifyRes.verified) {
              saveOrderSnapshot(data, orderNumber);
              success(
                "Payment Confirmed!",
                `Your order ${orderNumber} has been successfully verified and confirmed.`
              );
              window.location.href = `/order-confirmation?order=${orderNumber}`;
            } else {
              error("Payment verification failed", "Please contact support if funds were deducted.");
              setSubmitting(false);
            }
          } catch (err: any) {
            error("Verification error", err?.message || "Could not verify transaction.");
            setSubmitting(false);
          }
        },
        modal: {
          ondismiss: function () {
            setSubmitting(false);
          },
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on("payment.failed", function (response: any) {
        error("Payment failed", response.error?.description || "Transaction was declined.");
        setSubmitting(false);
      });
      rzp.open();
    } catch (err: any) {
      error("Payment error", err?.message || "Could not initialize Razorpay checkout.");
      setSubmitting(false);
    }
  };

  return (
    <form
      className={styles.form}
      onSubmit={handleSubmit(onSubmit)}
      aria-label="Checkout form"
      noValidate
    >
      {/* ── Shipping address ──────────────────────────────── */}
      <section className={styles.section}>
        <button
          type="button"
          className={styles.sectionHeader}
          onClick={() => setShippingOpen((v) => !v)}
          aria-expanded={shippingOpen}
        >
          <div className={styles.sectionTitle}>
            <span className={styles.sectionNumber}>1</span>
            <h2>Shipping Address</h2>
          </div>
          {shippingOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>

        {shippingOpen && (
          <div className={styles.sectionBody}>
            <div className={styles.row}>
              <Input
                label="First Name"
                required
                autoComplete="given-name"
                error={errors.firstName?.message}
                {...register("firstName")}
              />
              <Input
                label="Last Name"
                required
                autoComplete="family-name"
                error={errors.lastName?.message}
                {...register("lastName")}
              />
            </div>

            <div className={styles.row}>
              <Input
                label="Email"
                type="email"
                required
                autoComplete="email"
                error={errors.email?.message}
                {...register("email")}
              />
              <Input
                label="Phone"
                type="tel"
                required
                autoComplete="tel"
                error={errors.phone?.message}
                {...register("phone")}
              />
            </div>

            <Input
              label="Street Address"
              required
              autoComplete="address-line1"
              error={errors.address1?.message}
              {...register("address1")}
            />

            <Input
              label="Apartment, suite, etc. (optional)"
              autoComplete="address-line2"
              {...register("address2")}
            />

            <div className={styles.row3}>
              <Input
                label="City"
                required
                autoComplete="address-level2"
                error={errors.city?.message}
                {...register("city")}
              />
              <Input
                label="State / Province"
                required
                autoComplete="address-level1"
                error={errors.state?.message}
                {...register("state")}
              />
              <Input
                label="ZIP / Postal Code"
                required
                autoComplete="postal-code"
                error={errors.zip?.message}
                {...register("zip")}
              />
            </div>

            <div className={styles.field}>
              <label className={styles.selectLabel} htmlFor="country-select">
                Country
              </label>
              <select
                id="country-select"
                className={styles.select}
                {...register("country")}
              >
                {COUNTRIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              {errors.country && (
                <p className={styles.fieldError} role="alert">{errors.country.message}</p>
              )}
            </div>
          </div>
        )}
      </section>

      {/* ── Shipping Method ───────────────────────────────── */}
      <section className={styles.section}>
        <button
          type="button"
          className={styles.sectionHeader}
          onClick={() => setShippingMethodOpen((v) => !v)}
          aria-expanded={shippingMethodOpen}
        >
          <div className={styles.sectionTitle}>
            <span className={styles.sectionNumber}>2</span>
            <h2>Shipping method</h2>
          </div>
          {shippingMethodOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>

        {shippingMethodOpen && (
          <div className={styles.sectionBody}>
            <div className={styles.paymentMethods} role="radiogroup" aria-label="Shipping method">
              <label
                className={[
                  styles.paymentMethod,
                  shippingMethod === "standard" ? styles["paymentMethod--selected"] : "",
                ].join(" ")}
              >
                <input
                  type="radio"
                  value="standard"
                  className={styles.paymentRadio}
                  {...register("shippingMethod")}
                />
                <div className={styles.shippingMethodInfo}>
                  <span className={styles.paymentLabel}>Standard Shipping</span>
                  <span className={styles.shippingTime}>3-5 business days</span>
                </div>
                <span className={styles.shippingPrice}>Free</span>
              </label>

              <label
                className={[
                  styles.paymentMethod,
                  shippingMethod === "express" ? styles["paymentMethod--selected"] : "",
                ].join(" ")}
              >
                <input
                  type="radio"
                  value="express"
                  className={styles.paymentRadio}
                  {...register("shippingMethod")}
                />
                <div className={styles.shippingMethodInfo}>
                  <span className={styles.paymentLabel}>Express Shipping</span>
                  <span className={styles.shippingTime}>1-2 business days</span>
                </div>
                <span className={styles.shippingPrice}>$25.00</span>
              </label>
            </div>
          </div>
        )}
      </section>


      {/* ── Payment ───────────────────────────────────────── */}
      <section className={styles.section}>
        <button
          type="button"
          className={styles.sectionHeader}
          onClick={() => setPaymentOpen((v) => !v)}
          aria-expanded={paymentOpen}
        >
          <div className={styles.sectionTitle}>
            <span className={styles.sectionNumber}>3</span>
            <h2>Payment Method</h2>
          </div>
          {paymentOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>

        {paymentOpen && (
          <div className={styles.sectionBody}>
            {/* Payment method selector */}
            <div className={styles.paymentMethods} role="radiogroup" aria-label="Payment method">
              {PAYMENT_METHODS.map((m) => (
                <label
                  key={m.id}
                  className={[
                    styles.paymentMethod,
                    paymentMethod === m.id ? styles["paymentMethod--selected"] : "",
                  ].join(" ")}
                >
                  <input
                    type="radio"
                    value={m.id}
                    className={styles.paymentRadio}
                    aria-label={m.label}
                    {...register("paymentMethod")}
                  />
                  <span className={styles.paymentIcon}>{paymentIcons[m.id]}</span>
                  <span className={styles.paymentLabel}>{m.label}</span>
                </label>
              ))}
            </div>

            {/* Razorpay Explanatory Box */}
            {paymentMethod === "razorpay" && (
              <div className={styles.altPayment}>
                <p>
                  You will be securely redirected to the <strong>Razorpay Checkout</strong> popup to complete your payment using Credit/Debit Cards, UPI, NetBanking, or Wallets with end-to-end 256-bit encryption.
                </p>
              </div>
            )}

            {/* COD Explanatory Box */}
            {paymentMethod === "cod" && (
              <div className={styles.altPayment}>
                <p>
                  Pay in cash upon doorstep delivery of your luxury order. Please keep the exact amount ready for seamless verification.
                </p>
              </div>
            )}

            {/* Billing address */}
            <label className={styles.checkboxRow}>
              <input
                type="checkbox"
                className={styles.checkbox}
                {...register("sameAsBilling")}
              />
              <span className={styles.checkboxLabel}>Billing address same as shipping</span>
            </label>
          </div>
        )}
      </section>

      {/* ── Submit ────────────────────────────────────────── */}
      <div className={styles.submitWrapper}>
        <Button
          type="submit"
          variant="gold"
          size="lg"
          fullWidth
          loading={submitting}
          icon={<Lock size={16} />}
          iconPosition="left"
        >
          {paymentMethod === "razorpay"
            ? `Pay $${total.toFixed(2)} with Razorpay`
            : `Confirm Order with COD ($${total.toFixed(2)})`}
        </Button>
        <p className={styles.secureNote}>
          <ShieldCheck size={12} aria-hidden="true" />
          Secured by 256-bit SSL & server-verified signatures
        </p>
      </div>
    </form>
  );
}
