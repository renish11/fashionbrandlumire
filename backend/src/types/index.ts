/* =========================================================
   Lumière — Shared TypeScript Types
   ========================================================= */

// ── Product ────────────────────────────────────────────────

export interface ProductImage {
  id: string;
  src: string;
  alt: string;
  width: number;
  height: number;
}

export interface ProductColor {
  name: string;
  hex: string;
}

export interface ProductVariant {
  id: string;
  size: string;
  color: string;
  stock: number;
  sku: string;
}

export interface ProductReview {
  id: string;
  author: string;
  avatar?: string;
  rating: number; // 1-5
  date: string;
  title: string;
  body: string;
  verified: boolean;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  brand: string;
  description: string;
  longDescription: string;
  price: number;
  compareAtPrice?: number;
  images: ProductImage[];
  category: string;
  subcategory?: string;
  collectionId?: string;
  tags: string[];
  colors: ProductColor[];
  sizes: string[];
  variants: ProductVariant[];
  reviews: ProductReview[];
  rating: number;
  reviewCount: number;
  isFeatured: boolean;
  isNew: boolean;
  isBestseller: boolean;
  stock: number;
  materials: string[];
  care: string[];
  sku: string;
  createdAt: string;
}

// ── Collection ─────────────────────────────────────────────

export interface Collection {
  id: string;
  slug: string;
  name: string;
  description: string;
  image: string;
  productCount: number;
  season?: string;
  year?: number;
}

// ── Category ───────────────────────────────────────────────

export interface Category {
  id: string;
  slug: string;
  name: string;
  image: string;
  productCount: number;
  parent?: string;
}

// ── Cart ───────────────────────────────────────────────────

export interface CartItem {
  id: string;
  productId: string;
  slug: string;
  name: string;
  brand: string;
  image: string;
  price: number;
  compareAtPrice?: number;
  color: string;
  size: string;
  quantity: number;
  maxQuantity: number;
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  discount: number;
  total: number;
  couponCode?: string;
}

// ── Order ──────────────────────────────────────────────────

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "refunded";

export interface OrderItem {
  productId: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  size: string;
  color: string;
}

export interface Address {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  items: OrderItem[];
  shippingAddress: Address;
  billingAddress: Address;
  status: OrderStatus;
  paymentMethod: string;
  subtotal: number;
  shipping: number;
  tax: number;
  discount: number;
  total: number;
  couponCode?: string;
  createdAt: string;
  updatedAt: string;
  estimatedDelivery?: string;
  trackingNumber?: string;
}

// ── Customer / User ────────────────────────────────────────

export interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  avatar?: string;
  addresses: Address[];
  orderCount: number;
  totalSpent: number;
  joinedAt: string;
  lastOrderAt?: string;
  isVip: boolean;
  tags: string[];
}

// ── Auth ───────────────────────────────────────────────────

export interface AuthUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar?: string;
  role: "customer" | "admin";
}

// ── Analytics ─────────────────────────────────────────────

export interface AnalyticsDataPoint {
  date: string;
  revenue: number;
  orders: number;
  visitors: number;
  conversion: number;
}

export interface TopProduct {
  id: string;
  name: string;
  image: string;
  revenue: number;
  unitsSold: number;
  trend: number; // percentage change
}

export interface DashboardStat {
  label: string;
  value: string | number;
  change: number; // percentage
  trend: "up" | "down" | "neutral";
  prefix?: string;
  suffix?: string;
}

// ── CMS / Content ─────────────────────────────────────────

export type ContentBlockType = "hero" | "banner" | "collection" | "text" | "image";

export interface ContentBlock {
  id: string;
  type: ContentBlockType;
  title: string;
  subtitle?: string;
  body?: string;
  image?: string;
  cta?: { label: string; href: string };
  isActive: boolean;
  order: number;
  updatedAt: string;
}

// ── Filters ───────────────────────────────────────────────

export interface FilterOption {
  label: string;
  value: string;
  count?: number;
}

export interface FilterGroup {
  id: string;
  label: string;
  type: "checkbox" | "radio" | "range" | "color";
  options: FilterOption[];
}

export interface ActiveFilters {
  categories: string[];
  colors: string[];
  sizes: string[];
  priceRange: [number, number];
  sortBy: string;
}

// ── UI ────────────────────────────────────────────────────

export type ToastType = "success" | "error" | "warning" | "info";

export interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
}

export type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "gold";
export type ButtonSize = "xs" | "sm" | "md" | "lg";

export type BadgeVariant = "default" | "success" | "warning" | "error" | "gold" | "outline";
