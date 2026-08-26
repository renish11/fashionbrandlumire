"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CreditCard, Smartphone, Wallet, ChevronDown, ChevronUp, Lock } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useNotification } from "@/context/NotificationContext";
import Input from "@/components/forms/Input";
import Button from "@/components/ui/Button";
import { COUNTRIES, PAYMENT_METHODS } from "@/constants";
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
  // Card fields (only validated when card is selected)
  cardNumber: z.string().optional(),
  cardExpiry: z.string().optional(),
  cardCvc: z.string().optional(),
  nameOnCard: z.string().optional(),
  sameAsBilling: z.boolean().optional(),
});

type FormValues = z.infer<typeof schema>;

const paymentIcons: Record<string, React.ReactNode> = {
  card: <CreditCard size={18} />,
  paypal: <Wallet size={18} />,
  apple_pay: <Smartphone size={18} />,
};

export default function CheckoutForm() {
  const router = useRouter();
  const { clearCart, total } = useCart();
  const { success, error } = useNotification();
  const [shippingOpen, setShippingOpen] = useState(true);
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
      paymentMethod: "card",
      sameAsBilling: true,
    },
  });

  const paymentMethod = watch("paymentMethod");

  const onSubmit = async (_data: FormValues) => {
    setSubmitting(true);
    try {
      // Simulate payment processing
      await new Promise((r) => setTimeout(r, 1800));
      const orderNumber = `LUM-${Date.now().toString().slice(-6)}`;
      clearCart();
      success(
        "Order placed!",
        `Your order ${orderNumber} has been confirmed. Check your email for details.`
      );
      router.push(`/account?tab=orders&order=${orderNumber}`);
    } catch {
      error("Payment failed", "Something went wrong. Please try again.");
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
              label="Address"
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

            <div className={styles.row}>
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
              <label className={styles.selectLabel} htmlFor="country">
                Country <span className={styles.required}>*</span>
              </label>
              <select
                id="country"
                className={[styles.select, errors.country ? styles["select--error"] : ""].join(" ")}
                autoComplete="country-name"
                aria-invalid={errors.country ? "true" : undefined}
                {...register("country")}
              >
                {COUNTRIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              {errors.country && (
                <p className={styles.fieldError} role="alert">{errors.country.message}</p>
              )}
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
            <span className={styles.sectionNumber}>2</span>
            <h2>Payment</h2>
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

            {/* Card fields */}
            {paymentMethod === "card" && (
              <div className={styles.cardFields}>
                <Input
                  label="Name on Card"
                  required
                  autoComplete="cc-name"
                  placeholder="As it appears on your card"
                  error={errors.nameOnCard?.message}
                  {...register("nameOnCard")}
                />
                <Input
                  label="Card Number"
                  required
                  autoComplete="cc-number"
                  placeholder="1234 5678 9012 3456"
                  maxLength={19}
                  error={errors.cardNumber?.message}
                  suffix={<CreditCard size={16} />}
                  {...register("cardNumber")}
                />
                <div className={styles.row}>
                  <Input
                    label="Expiry Date"
                    required
                    autoComplete="cc-exp"
                    placeholder="MM / YY"
                    maxLength={7}
                    error={errors.cardExpiry?.message}
                    {...register("cardExpiry")}
                  />
                  <Input
                    label="CVC"
                    required
                    autoComplete="cc-csc"
                    placeholder="123"
                    maxLength={4}
                    error={errors.cardCvc?.message}
                    hint="3 or 4 digits on the back of your card"
                    {...register("cardCvc")}
                  />
                </div>
              </div>
            )}

            {paymentMethod !== "card" && (
              <div className={styles.altPayment}>
                <p>You will be redirected to {PAYMENT_METHODS.find((m) => m.id === paymentMethod)?.label} to complete your purchase.</p>
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
          Pay ${total.toFixed(2)}
        </Button>
        <p className={styles.secureNote}>
          <Lock size={12} aria-hidden="true" />
          Your payment is encrypted and secure
        </p>
      </div>
    </form>
  );
}
