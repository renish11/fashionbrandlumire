/* =========================================================
   Lumière — Constants
   ========================================================= */

export const SITE_NAME = "Lumière";
export const SITE_URL = "https://lumiere.fashion";
export const SITE_DESCRIPTION =
  "Discover timeless luxury fashion at Lumière. Curated collections of premium clothing, accessories, and more.";

export const CURRENCY = "USD";
export const CURRENCY_SYMBOL = "$";

export const TAX_RATE = 0.08; // 8%
export const FREE_SHIPPING_THRESHOLD = 150;
export const SHIPPING_COST = 12;

export const PRODUCTS_PER_PAGE = 12;

export const SIZES = ["XXS", "XS", "S", "M", "L", "XL", "XXL"];

export const SIZE_GUIDE = [
  { size: "XXS", chest: "30-31", waist: "22-23", hips: "32-33" },
  { size: "XS", chest: "32-33", waist: "24-25", hips: "34-35" },
  { size: "S", chest: "34-35", waist: "26-27", hips: "36-37" },
  { size: "M", chest: "36-37", waist: "28-29", hips: "38-39" },
  { size: "L", chest: "38-40", waist: "30-32", hips: "40-42" },
  { size: "XL", chest: "41-43", waist: "33-35", hips: "43-45" },
  { size: "XXL", chest: "44-46", waist: "36-38", hips: "46-48" },
];

export const NAV_LINKS = [
  {
    label: "Collections",
    href: "/shop",
    children: [
      { label: "Spring / Summer 2026", href: "/shop?collection=ss26" },
      { label: "Autumn / Winter 2025", href: "/shop?collection=aw25" },
      { label: "Resort 2026", href: "/shop?collection=resort26" },
      { label: "View All Collections", href: "/shop" },
    ],
  },
  {
    label: "Women",
    href: "/shop?category=women",
    children: [
      { label: "Dresses", href: "/shop?category=dresses" },
      { label: "Tops", href: "/shop?category=tops" },
      { label: "Trousers", href: "/shop?category=trousers" },
      { label: "Outerwear", href: "/shop?category=outerwear" },
      { label: "Accessories", href: "/shop?category=accessories" },
    ],
  },
  {
    label: "Men",
    href: "/shop?category=men",
    children: [
      { label: "Shirts", href: "/shop?category=shirts" },
      { label: "Suits", href: "/shop?category=suits" },
      { label: "Trousers", href: "/shop?category=men-trousers" },
      { label: "Outerwear", href: "/shop?category=men-outerwear" },
    ],
  },
  { label: "New Arrivals", href: "/shop?filter=new" },
  { label: "Sale", href: "/shop?filter=sale" },
];

export const SORT_OPTIONS = [
  { label: "Featured", value: "featured" },
  { label: "Newest First", value: "newest" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
  { label: "Best Selling", value: "bestselling" },
  { label: "Highest Rated", value: "rating" },
];

export const ORDER_STATUS_LABELS: Record<string, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  processing: "Processing",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
  refunded: "Refunded",
};

export const ORDER_STATUS_COLORS: Record<string, string> = {
  pending: "warning",
  confirmed: "info",
  processing: "info",
  shipped: "success",
  delivered: "success",
  cancelled: "error",
  refunded: "error",
};

export const COUNTRIES = [
  "United States",
  "United Kingdom",
  "Canada",
  "Australia",
  "France",
  "Germany",
  "Italy",
  "Japan",
  "UAE",
];

export const PAYMENT_METHODS = [
  { id: "card", label: "Credit / Debit Card" },
  { id: "paypal", label: "PayPal" },
  { id: "apple_pay", label: "Apple Pay" },
];

export const ADMIN_NAV = [
  { label: "Dashboard", href: "/admin", icon: "LayoutDashboard" },
  { label: "Products", href: "/admin/products", icon: "Package" },
  { label: "Orders", href: "/admin/orders", icon: "ShoppingBag" },
  { label: "Customers", href: "/admin/customers", icon: "Users" },
  { label: "Analytics", href: "/admin/analytics", icon: "BarChart2" },
  { label: "CMS", href: "/admin/cms", icon: "FileText" },
  { label: "Settings", href: "/admin/settings", icon: "Settings" },
];
