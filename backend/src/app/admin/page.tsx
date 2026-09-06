"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import {
  TrendingUp, TrendingDown, ShoppingBag, Users,
  DollarSign, Package, ChevronRight, ArrowUpRight,
  BarChart3, RefreshCw,
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from "recharts";
import { dashboardStats, topProducts, weeklyRevenue } from "@/data/analytics";
import { orders } from "@/data/orders";
import { products } from "@/data/products";
import { useTheme } from "@/context/ThemeContext";

const STAT_ICONS = [DollarSign, ShoppingBag, Users, BarChart3];

export default function AdminOverviewPage() {
  const { theme } = useTheme();
  const D = theme === "dark";
  const [mounted, setMounted] = useState(false);
  const [now, setNow] = useState("");

  useEffect(() => {
    setMounted(true);
    setNow(new Date().toLocaleString("en-US", {
      weekday: "short", month: "short", day: "numeric",
      hour: "2-digit", minute: "2-digit",
    }));
  }, []);

  const recentOrders = orders.slice(0, 5);
  const lowStockProducts = products.filter((p) => p.stock <= 10);

  const statusStyle = (status: string) => {
    const map: Record<string, { bg: string; text: string; border: string }> = {
      delivered: { bg: D ? "rgba(16,185,129,0.1)" : "#d1fae5", text: D ? "#34d399" : "#065f46", border: D ? "rgba(52,211,153,0.3)" : "#6ee7b7" },
      shipped:   { bg: D ? "rgba(59,130,246,0.1)" : "#dbeafe", text: D ? "#60a5fa" : "#1e40af", border: D ? "rgba(96,165,250,0.3)" : "#93c5fd" },
      processing:{ bg: D ? "rgba(245,158,11,0.1)" : "#fef3c7", text: D ? "#fbbf24" : "#92400e", border: D ? "rgba(251,191,36,0.3)" : "#fcd34d" },
      confirmed: { bg: D ? "rgba(167,139,250,0.1)" : "#ede9fe", text: D ? "#a78bfa" : "#4c1d95", border: D ? "rgba(167,139,250,0.3)" : "#c4b5fd" },
      cancelled: { bg: D ? "rgba(239,68,68,0.1)" : "#fee2e2", text: D ? "#f87171" : "#991b1b", border: D ? "rgba(248,113,113,0.3)" : "#fca5a5" },
    };
    return map[status] ?? { bg: D ? "#27272a" : "#f4f4f5", text: D ? "#a1a1aa" : "#3f3f46", border: D ? "#3f3f46" : "#d4d4d8" };
  };

  const card = D
    ? { bg: "#141414", border: "#262626", shadow: "0 1px 3px rgba(0,0,0,0.4)" }
    : { bg: "#ffffff", border: "#e4e4e7", shadow: "0 1px 3px rgba(0,0,0,0.06)" };

  const text = {
    primary: D ? "#ffffff" : "#09090b",
    secondary: D ? "#a1a1aa" : "#71717a",
    muted: D ? "#71717a" : "#a1a1aa",
    gold: "#D4AF37",
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "28px", fontFamily: "var(--font-body, 'Inter', system-ui, sans-serif)" }}>

      {/* ── Header ── */}
      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-start", justifyContent: "space-between", gap: "16px" }}>
        <div>
          <h1 style={{ fontFamily: "var(--font-display, 'Playfair Display', serif)", fontSize: "26px", fontWeight: 500, color: text.primary, letterSpacing: "0.02em", margin: 0 }}>
            Dashboard Overview
          </h1>
          <p style={{ fontSize: "12px", color: text.secondary, marginTop: "4px" }}>
            {now || "Lumière Admin Console"} · Store performance at a glance
          </p>
        </div>
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <Link href="/admin/products/new" style={{
            display: "inline-flex", alignItems: "center", gap: "6px",
            padding: "8px 16px", borderRadius: "8px", fontSize: "12px",
            fontWeight: 600, background: "#D4AF37", color: "#000",
            textDecoration: "none", border: "none",
          }}>
            <Package size={13} /> Add Product
          </Link>
          <Link href="/admin/orders" style={{
            display: "inline-flex", alignItems: "center", gap: "6px",
            padding: "8px 16px", borderRadius: "8px", fontSize: "12px",
            fontWeight: 600, background: D ? "#1a1a1a" : "#f4f4f5",
            color: text.primary, textDecoration: "none",
            border: `1px solid ${card.border}`,
          }}>
            <ShoppingBag size={13} /> All Orders
          </Link>
        </div>
      </div>

      {/* ── KPI Cards ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", gap: "16px" }}>
        {dashboardStats.map((stat, i) => {
          const Icon = STAT_ICONS[i];
          const isUp = stat.trend === "up";
          return (
            <div key={stat.label} style={{
              background: card.bg, border: `1px solid ${card.border}`,
              borderRadius: "14px", padding: "20px 22px",
              boxShadow: card.shadow, position: "relative", overflow: "hidden",
            }}>
              {/* Gold accent top bar */}
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "2px", background: i === 0 ? "#D4AF37" : "transparent", borderRadius: "14px 14px 0 0" }} />

              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "14px" }}>
                <div style={{
                  width: "36px", height: "36px", borderRadius: "10px",
                  background: D ? "rgba(212,175,55,0.1)" : "rgba(212,175,55,0.12)",
                  border: "1px solid rgba(212,175,55,0.25)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "#D4AF37",
                }}>
                  <Icon size={17} />
                </div>
                <div style={{
                  display: "flex", alignItems: "center", gap: "3px",
                  fontSize: "11px", fontWeight: 600, fontFamily: "monospace",
                  padding: "3px 8px", borderRadius: "20px",
                  background: isUp ? (D ? "rgba(16,185,129,0.1)" : "#d1fae5") : (D ? "rgba(239,68,68,0.1)" : "#fee2e2"),
                  color: isUp ? (D ? "#34d399" : "#065f46") : (D ? "#f87171" : "#991b1b"),
                  border: `1px solid ${isUp ? (D ? "rgba(52,211,153,0.25)" : "#6ee7b7") : (D ? "rgba(248,113,113,0.25)" : "#fca5a5")}`,
                }}>
                  {isUp ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                  {isUp ? "+" : ""}{stat.change}%
                </div>
              </div>

              <div style={{ fontSize: "26px", fontWeight: 700, color: text.primary, letterSpacing: "-0.5px", lineHeight: 1 }}>
                {stat.prefix}{typeof stat.value === "number" ? stat.value.toLocaleString() : stat.value}
              </div>
              <div style={{ fontSize: "12px", color: text.secondary, marginTop: "6px" }}>{stat.label}</div>
            </div>
          );
        })}
      </div>

      {/* ── Revenue Chart + Quick Stats ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr min(280px, 100%)", gap: "16px" }} className="admin-chart-grid">
        {/* Area Chart */}
        <div style={{ background: card.bg, border: `1px solid ${card.border}`, borderRadius: "14px", padding: "22px", boxShadow: card.shadow, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
            <div>
              <h2 style={{ fontSize: "14px", fontWeight: 600, color: text.primary, margin: 0 }}>Weekly Revenue</h2>
              <p style={{ fontSize: "11px", color: text.secondary, marginTop: "3px" }}>Daily sales this week</p>
            </div>
            <div style={{ fontSize: "11px", fontFamily: "monospace", color: "#D4AF37", background: "rgba(212,175,55,0.1)", border: "1px solid rgba(212,175,55,0.2)", padding: "4px 10px", borderRadius: "6px" }}>
              USD ($)
            </div>
          </div>
          <div style={{ height: "220px", width: "100%" }}>
            {mounted && (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={weeklyRevenue} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#D4AF37" stopOpacity={0.35} />
                      <stop offset="100%" stopColor="#D4AF37" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={D ? "#262626" : "#f0f0f0"} />
                  <XAxis dataKey="date" tick={{ fill: D ? "#666" : "#a1a1aa", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: D ? "#666" : "#a1a1aa", fontSize: 10 }} tickFormatter={(v) => `$${v / 1000}k`} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{ background: D ? "#1a1a1a" : "#fff", border: `1px solid ${D ? "#333" : "#e4e4e7"}`, borderRadius: "8px", fontSize: "12px", color: D ? "#fff" : "#09090b" }}
                    formatter={(v: unknown) => [`$${Number(v).toLocaleString()}`, "Revenue"]}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="#D4AF37" strokeWidth={2} fill="url(#revGrad)" dot={{ fill: "#D4AF37", r: 3 }} activeDot={{ r: 5 }} />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Quick Stats Panel */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {[
            { label: "Total Products", value: products.length, sub: "In catalog", color: "#D4AF37" },
            { label: "Pending Orders", value: orders.filter(o => o.status === "processing" || o.status === "confirmed").length, sub: "Need action", color: "#f59e0b" },
            { label: "Low Stock Items", value: lowStockProducts.length, sub: "≤ 10 units", color: lowStockProducts.length > 5 ? "#ef4444" : "#10b981" },
            { label: "Delivered", value: orders.filter(o => o.status === "delivered").length, sub: "Completed", color: "#10b981" },
          ].map((item) => (
            <div key={item.label} style={{ background: card.bg, border: `1px solid ${card.border}`, borderRadius: "12px", padding: "16px 18px", boxShadow: card.shadow, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <p style={{ fontSize: "11px", color: text.secondary, margin: 0 }}>{item.label}</p>
                <p style={{ fontSize: "11px", color: text.muted, margin: "2px 0 0" }}>{item.sub}</p>
              </div>
              <div style={{ fontSize: "28px", fontWeight: 700, color: item.color, fontFamily: "monospace" }}>
                {item.value}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Recent Orders + Top Products ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr min(320px, 100%)", gap: "16px" }} className="admin-orders-grid">

        {/* Recent Orders Table */}
        <div style={{ background: card.bg, border: `1px solid ${card.border}`, borderRadius: "14px", boxShadow: card.shadow, overflow: "hidden" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 22px", borderBottom: `1px solid ${card.border}` }}>
            <h2 style={{ fontSize: "14px", fontWeight: 600, color: text.primary, margin: 0 }}>Recent Orders</h2>
            <Link href="/admin/orders" style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "12px", color: "#D4AF37", textDecoration: "none" }}>
              View all <ChevronRight size={13} />
            </Link>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px" }}>
              <thead>
                <tr style={{ background: D ? "#181818" : "#fafafa", borderBottom: `1px solid ${card.border}` }}>
                  {["Order #", "Customer", "Status", "Items", "Total"].map((h) => (
                    <th key={h} style={{ padding: "10px 14px", textAlign: h === "Total" ? "right" : "left", fontSize: "10px", letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: "monospace", color: text.secondary, fontWeight: 600 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order, i) => {
                  const ss = statusStyle(order.status);
                  return (
                    <tr key={order.id} style={{ borderBottom: i < recentOrders.length - 1 ? `1px solid ${D ? "#1e1e1e" : "#f4f4f5"}` : "none" }}>
                      <td style={{ padding: "13px 14px" }}>
                        <div style={{ fontFamily: "monospace", fontWeight: 700, color: "#D4AF37", fontSize: "11px" }}>{order.orderNumber}</div>
                        <div style={{ fontSize: "10px", color: text.muted, marginTop: "2px" }}>
                          {new Date(order.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                        </div>
                      </td>
                      <td style={{ padding: "13px 14px" }}>
                        <div style={{ fontWeight: 600, color: text.primary, fontSize: "12px" }}>{order.customerName}</div>
                        <div style={{ fontSize: "10px", color: text.muted }}>{order.customerEmail}</div>
                      </td>
                      <td style={{ padding: "13px 14px" }}>
                        <span style={{
                          display: "inline-block", padding: "2px 8px", borderRadius: "4px",
                          fontSize: "10px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em",
                          background: ss.bg, color: ss.text, border: `1px solid ${ss.border}`,
                        }}>
                          {order.status}
                        </span>
                      </td>
                      <td style={{ padding: "13px 14px", color: text.secondary }}>
                        {order.items.length} {order.items.length === 1 ? "piece" : "pieces"}
                      </td>
                      <td style={{ padding: "13px 14px", textAlign: "right", fontWeight: 700, color: text.primary }}>
                        ${order.total.toFixed(2)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Products */}
        <div style={{ background: card.bg, border: `1px solid ${card.border}`, borderRadius: "14px", boxShadow: card.shadow, overflow: "hidden", display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 18px", borderBottom: `1px solid ${card.border}` }}>
            <h2 style={{ fontSize: "14px", fontWeight: 600, color: text.primary, margin: 0 }}>Top Pieces</h2>
            <Link href="/admin/products" style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "12px", color: "#D4AF37", textDecoration: "none" }}>
              Catalog <ChevronRight size={13} />
            </Link>
          </div>
          <div style={{ padding: "12px", flex: 1, display: "flex", flexDirection: "column", gap: "6px" }}>
            {topProducts.map((p) => (
              <div key={p.id} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "8px 10px", borderRadius: "10px", background: D ? "rgba(255,255,255,0.02)" : "#fafafa" }}>
                <div style={{ position: "relative", width: "42px", height: "48px", borderRadius: "8px", overflow: "hidden", flexShrink: 0, background: D ? "#262626" : "#f0f0f0", border: `1px solid ${card.border}` }}>
                  <Image src={p.image} alt={p.name} fill style={{ objectFit: "cover" }} sizes="42px" />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: "12px", fontWeight: 600, color: text.primary, margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.name}</p>
                  <p style={{ fontSize: "11px", color: text.secondary, margin: "2px 0 0" }}>{p.unitsSold} sold</p>
                </div>
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <p style={{ fontSize: "12px", fontWeight: 700, color: text.primary, margin: 0 }}>${p.revenue.toLocaleString()}</p>
                  <p style={{ fontSize: "10px", fontFamily: "monospace", margin: "2px 0 0", color: p.trend >= 0 ? "#10b981" : "#ef4444", display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "2px" }}>
                    {p.trend >= 0 ? <ArrowUpRight size={10} /> : <TrendingDown size={10} />}
                    {p.trend >= 0 ? "+" : ""}{p.trend}%
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div style={{ padding: "14px 18px", borderTop: `1px solid ${card.border}`, display: "flex", justifyContent: "space-between", fontSize: "11px", color: text.secondary }}>
            <span>Total Products</span>
            <span style={{ fontWeight: 700, color: "#D4AF37" }}>{products.length}</span>
          </div>
        </div>
      </div>

      {/* ── Low Stock Alert ── */}
      {lowStockProducts.length > 0 && (
        <div style={{ background: D ? "rgba(245,158,11,0.05)" : "#fffbeb", border: `1px solid ${D ? "rgba(245,158,11,0.2)" : "#fcd34d"}`, borderRadius: "14px", padding: "18px 22px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "14px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <RefreshCw size={15} style={{ color: "#f59e0b" }} />
              <h3 style={{ fontSize: "13px", fontWeight: 600, color: D ? "#fbbf24" : "#92400e", margin: 0 }}>
                Low Stock Alert — {lowStockProducts.length} items
              </h3>
            </div>
            <Link href="/admin/products" style={{ fontSize: "11px", color: "#D4AF37", textDecoration: "none" }}>
              Manage →
            </Link>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {lowStockProducts.slice(0, 8).map((p) => (
              <div key={p.id} style={{
                display: "flex", alignItems: "center", gap: "8px",
                padding: "6px 12px", borderRadius: "8px",
                background: D ? "rgba(245,158,11,0.08)" : "#fef3c7",
                border: `1px solid ${D ? "rgba(245,158,11,0.2)" : "#fcd34d"}`,
                fontSize: "11px",
              }}>
                <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: p.stock <= 3 ? "#ef4444" : "#f59e0b", flexShrink: 0 }} />
                <span style={{ color: D ? "#fbbf24" : "#92400e", fontWeight: 500 }}>{p.name}</span>
                <span style={{ fontFamily: "monospace", fontWeight: 700, color: p.stock <= 3 ? "#ef4444" : "#f59e0b" }}>{p.stock}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Responsive grid overrides */}
      <style>{`
        @media (max-width: 900px) {
          .admin-chart-grid, .admin-orders-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
