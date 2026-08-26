import type { AnalyticsDataPoint, TopProduct, DashboardStat } from "@/types";

export const monthlyAnalytics: AnalyticsDataPoint[] = [
  { date: "2026-01", revenue: 48200, orders: 124, visitors: 8400, conversion: 1.48 },
  { date: "2026-02", revenue: 52400, orders: 138, visitors: 9200, conversion: 1.50 },
  { date: "2026-03", revenue: 61800, orders: 162, visitors: 10800, conversion: 1.50 },
  { date: "2026-04", revenue: 58900, orders: 154, visitors: 10100, conversion: 1.52 },
  { date: "2026-05", revenue: 67300, orders: 178, visitors: 11500, conversion: 1.55 },
  { date: "2026-06", revenue: 74200, orders: 196, visitors: 12800, conversion: 1.53 },
  { date: "2026-07", revenue: 82600, orders: 218, visitors: 14200, conversion: 1.54 },
  { date: "2026-08", revenue: 71400, orders: 189, visitors: 12200, conversion: 1.55 },
];

export const weeklyRevenue = [
  { date: "Mon", revenue: 12400 },
  { date: "Tue", revenue: 9800 },
  { date: "Wed", revenue: 14200 },
  { date: "Thu", revenue: 11600 },
  { date: "Fri", revenue: 18400 },
  { date: "Sat", revenue: 22100 },
  { date: "Sun", revenue: 16800 },
];

export const topProducts: TopProduct[] = [
  { id: "p1", name: "Silk Maxi Dress", image: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=100&h=100&fit=crop", revenue: 14550, unitsSold: 30, trend: 12.4 },
  { id: "p2", name: "Cashmere Blend Coat", image: "https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=100&h=100&fit=crop", revenue: 20000, unitsSold: 16, trend: 8.2 },
  { id: "p7", name: "Structured Leather Bag", image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=100&h=100&fit=crop", revenue: 12530, unitsSold: 14, trend: 22.1 },
  { id: "p4", name: "Merino Ribbed Turtleneck", image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=100&h=100&fit=crop", revenue: 9360, unitsSold: 48, trend: -3.1 },
  { id: "p5", name: "Tailored Blazer", image: "https://images.unsplash.com/photo-1594938298603-c8148c4b4d3e?w=100&h=100&fit=crop", revenue: 11160, unitsSold: 18, trend: 5.7 },
];

export const dashboardStats: DashboardStat[] = [
  { label: "Total Revenue", value: 516800, change: 18.4, trend: "up", prefix: "$" },
  { label: "Total Orders", value: 1359, change: 12.2, trend: "up" },
  { label: "Active Customers", value: 892, change: 9.8, trend: "up" },
  { label: "Avg Order Value", value: 380, change: -2.1, trend: "down", prefix: "$" },
];

export const categoryBreakdown = [
  { name: "Dresses", value: 32, color: "#000000" },
  { name: "Outerwear", value: 24, color: "#D4AF37" },
  { name: "Accessories", value: 18, color: "#5d5f5f" },
  { name: "Tops", value: 16, color: "#9DC183" },
  { name: "Trousers", value: 10, color: "#C19A6B" },
];
