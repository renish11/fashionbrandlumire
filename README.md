# Lumière — Luxury Women's Fashion Monorepo

Welcome to the restructured **Lumière** luxury e-commerce platform. The project has been refactored into a high-performance, women's-only fashion store powered by two decoupled **Next.js 15 (App Router)** applications with **Razorpay** payment gateway integration.

---

## 🏛️ Architecture Overview

```
fashionbrandlumire/
├── frontend/               # Customer-Facing Storefront (Port 3000)
│   ├── src/
│   │   ├── app/            # Pages: Home, Shop, Product, Cart, Checkout, Account
│   │   ├── components/     # UI, Layout, Product, Forms, Checkout components
│   │   ├── context/        # Cart, Wishlist, Auth, Notification contexts
│   │   ├── lib/api.ts      # Typed API client calling the backend
│   │   └── types/          # Shared TypeScript interfaces
│   ├── .env.local          # Port 3000 config + Razorpay public key
│   └── package.json
│
├── backend/                # Admin Dashboard + API Engine (Port 4000)
│   ├── src/
│   │   ├── app/
│   │   │   ├── admin/      # Admin Console: Overview, Products, Orders, Analytics, Login
│   │   │   └── api/        # REST Endpoints: Products, Orders, Coupons, Payments
│   │   ├── data/           # Products, Orders, Analytics, Collections data
│   │   ├── lib/            # Razorpay SDK client & signature verification
│   │   └── types/          # Backend TypeScript interfaces
│   ├── .env.local          # Port 4000 config + Admin credentials + Razorpay secret
│   └── package.json
│
├── package.json            # Root workspace scripts
└── README.md
```

---

## 🚀 Quick Start

### 1. Install Dependencies

Dependencies have been installed in both sub-projects. If cloning anew:

```bash
cd frontend && npm install
cd ../backend && npm install
```

### 2. Start Both Servers

You can run both concurrently from the root directory:

**Terminal 1 (Backend API & Admin Portal — Port 4000):**

```bash
npm run dev:backend
# or: cd backend && npm run dev
```

**Terminal 2 (Customer Storefront — Port 3000):**

```bash
npm run dev:frontend
# or: cd frontend && npm run dev
```

- **Customer Storefront:** [http://localhost:3000](http://localhost:3000)
- **Admin Dashboard:** [http://localhost:4000/admin](http://localhost:4000/admin)
- **Backend API Base:** [http://localhost:4000/api](http://localhost:4000/api)

---

## 💳 Razorpay Payment Gateway Integration

The checkout system supports **Razorpay Checkout** (Cards, UPI, NetBanking, Wallets) along with **Cash on Delivery (COD)**:

1. **Frontend Checkout Flow:**
   - User inputs delivery details and selects **Razorpay** or **Cash on Delivery**.
   - For Razorpay, frontend calls `POST /api/payment/create-order` on the backend.
   - Razorpay's official Checkout modal opens with branded gold/black theme.
   - Upon successful payment in the modal, frontend submits the payment payload to `POST /api/payment/verify`.
   - Backend performs HMAC-SHA256 signature verification (`orderId|paymentId` vs `signature`).
   - If verified, the cart is cleared and user is redirected to their confirmed order page.

2. **Test Credentials (Default):**
   - Key ID: `rzp_test_51AbCdEfGhIjKl`
   - Key Secret: `rzp_test_secret_placeholder`
   - Replace in `backend/.env.local` and `frontend/.env.local` with your own Razorpay Dashboard API keys.

---

## 🔒 Admin Dashboard

- **Login URL:** [http://localhost:4000/admin/login](http://localhost:4000/admin/login)
- **Default Credentials:**
  - **Username:** `admin`
  - **Password:** `lumiere2026`
- **Features:**
  - **Overview (`/admin`):** Key metrics (Total Revenue, Orders, AOV), recent orders table, and top-selling pieces.
  - **Products (`/admin/products`):** Interactive catalog table with live category filter, search by piece/SKU, inventory badges, and live preview links.
  - **Orders (`/admin/orders`):** Order fulfillment tracker, status filters (Processing, Shipped, Delivered), and customer details.
  - **Analytics (`/admin/analytics`):** Visualized trends using **Recharts** (Monthly turnover gradient area chart, weekly volume bar chart, category distribution pie chart).

---

## 📡 Backend API Reference

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/api/products` | Get all products (supports `?filter=featured\|new\|bestseller`, `?category=...`, `?search=...`) |
| `GET` | `/api/products/[slug]` | Get details for a single piece by slug |
| `GET` | `/api/orders` | List orders (supports `?customerId=...`) |
| `POST` | `/api/orders` | Create a new customer order |
| `POST` | `/api/coupons/validate` | Validate coupon code (`WELCOME10`, `VIP20`, `LUMIERE15`) |
| `POST` | `/api/payment/create-order` | Create Razorpay order (returns `orderId`, `amount`, `currency`, `key`) |
| `POST` | `/api/payment/verify` | Verify HMAC-SHA256 Razorpay payment signature |

---

## 👗 Women's-Only Brand Focus

All references to Men's categories have been completely removed from:

- Header navigation menus and category dropdowns
- Homepage hero tiles and category showcase grid
- Footer links
- Shop page filter categories (`dresses`, `tops`, `trousers`, `outerwear`, `accessories`)
