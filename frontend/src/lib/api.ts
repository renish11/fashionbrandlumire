/* =========================================================
   Lumière Frontend — API Client
   Thin fetch wrapper for calling the backend API
   ========================================================= */

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  if (!res.ok) {
    const errorBody = await res.text().catch(() => "Unknown error");
    throw new Error(`API Error ${res.status}: ${errorBody}`);
  }

  return res.json() as Promise<T>;
}

// ── Products ──────────────────────────────────────────────

import type { Product } from "@/types";

export async function fetchProducts(): Promise<Product[]> {
  return apiFetch<Product[]>("/api/products");
}

export async function fetchProductBySlug(slug: string): Promise<Product | null> {
  try {
    return await apiFetch<Product>(`/api/products/${slug}`);
  } catch {
    return null;
  }
}

export async function fetchFeaturedProducts(): Promise<Product[]> {
  return apiFetch<Product[]>("/api/products?filter=featured");
}

export async function fetchNewProducts(): Promise<Product[]> {
  return apiFetch<Product[]>("/api/products?filter=new");
}

export async function fetchBestsellerProducts(): Promise<Product[]> {
  return apiFetch<Product[]>("/api/products?filter=bestseller");
}

// ── Orders ────────────────────────────────────────────────

import type { Order } from "@/types";

export async function fetchOrders(): Promise<Order[]> {
  return apiFetch<Order[]>("/api/orders");
}

export async function updateOrderStatus(orderId: string, status: Order["status"]): Promise<Order> {
  return apiFetch<Order>(`/api/orders/${orderId}`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}

// ── Coupons ───────────────────────────────────────────────

export async function validateCoupon(
  code: string
): Promise<{ valid: boolean; discount: number }> {
  return apiFetch<{ valid: boolean; discount: number }>("/api/coupons/validate", {
    method: "POST",
    body: JSON.stringify({ code }),
  });
}

// ── Payment (Razorpay) ───────────────────────────────────

export interface CreateOrderResponse {
  orderId: string;
  amount: number;
  currency: string;
  key: string;
}

export async function createPaymentOrder(
  amount: number,
  receipt: string
): Promise<CreateOrderResponse> {
  return apiFetch<CreateOrderResponse>("/api/payment/create-order", {
    method: "POST",
    body: JSON.stringify({ amount, receipt }),
  });
}

export interface VerifyPaymentPayload {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

export async function verifyPayment(
  payload: VerifyPaymentPayload
): Promise<{ verified: boolean }> {
  return apiFetch<{ verified: boolean }>("/api/payment/verify", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
