"use client";

import { useState, useEffect } from "react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  monthlyAnalytics,
  weeklyRevenue,
  categoryBreakdown,
  dashboardStats,
} from "@/data/analytics";
import { useTheme } from "@/context/ThemeContext";

export default function AdminAnalyticsPage() {
  const [mounted, setMounted] = useState(false);
  const { theme } = useTheme();
  const isLight = theme === "light";

  useEffect(() => {
    setMounted(true);
  }, []);
  return (
    <div className="space-y-8">
      {/* ── Page Header ── */}
      <div>
        <h1 className={`text-2xl font-serif tracking-wide ${isLight ? "text-zinc-900" : "text-white"}`}>
          Sales & Revenue Analytics
        </h1>
        <p className={`text-xs mt-1 ${isLight ? "text-zinc-500" : "text-zinc-400"}`}>
          Historical turnover, conversion performance, and category distribution.
        </p>
      </div>

      {/* ── Metric Snapshot ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {dashboardStats.map((st) => (
          <div
            key={st.label}
            className={`p-5 rounded-xl border transition-colors ${
              isLight ? "bg-white border-zinc-200 shadow-sm" : "bg-[#141414] border-[#262626]"
            }`}
          >
            <p className={`text-xs font-medium mb-1 ${isLight ? "text-zinc-500" : "text-zinc-400"}`}>{st.label}</p>
            <p className={`text-2xl font-semibold ${isLight ? "text-zinc-950" : "text-white"}`}>
              {st.prefix}
              {st.value.toLocaleString()}
            </p>
          </div>
        ))}
      </div>

      {/* ── Monthly Revenue Chart ── */}
      <div className={`p-6 rounded-xl border transition-colors ${
        isLight ? "bg-white border-zinc-200 shadow-sm" : "bg-[#141414] border-[#262626]"
      }`}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className={`text-base font-medium ${isLight ? "text-zinc-900" : "text-white"}`}>Monthly Revenue</h2>
            <p className={`text-xs mt-0.5 ${isLight ? "text-zinc-500" : "text-zinc-500"}`}>2026 Fiscal Performance</p>
          </div>
          <span className="text-xs font-mono text-[#D4AF37] bg-[#D4AF37]/10 px-2.5 py-1 rounded border border-[#D4AF37]/20">
            USD ($)
          </span>
        </div>

        <div className="h-72 w-full">
          {mounted && (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={monthlyAnalytics}
                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="goldGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#D4AF37" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={isLight ? "#e4e4e7" : "#262626"} />
                <XAxis
                  dataKey="date"
                  stroke={isLight ? "#a1a1aa" : "#666"}
                  tick={{ fill: isLight ? "#71717a" : "#888", fontSize: 11 }}
                />
                <YAxis
                  stroke={isLight ? "#a1a1aa" : "#666"}
                  tick={{ fill: isLight ? "#71717a" : "#888", fontSize: 11 }}
                  tickFormatter={(val) => `$${val / 1000}k`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: isLight ? "#ffffff" : "#181818",
                    borderColor: isLight ? "#e4e4e7" : "#333",
                    borderRadius: "8px",
                    color: isLight ? "#09090b" : "#fff",
                    fontSize: "12px",
                  }}
                  formatter={(value: unknown) => [`$${Number(value).toLocaleString()}`, "Revenue"]}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#D4AF37"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#goldGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* ── Two Columns: Weekly Breakdown + Category Share ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Weekly Bar Chart */}
        <div className={`p-6 rounded-xl border transition-colors ${
          isLight ? "bg-white border-zinc-200 shadow-sm" : "bg-[#141414] border-[#262626]"
        }`}>
          <div className="mb-6">
            <h2 className={`text-base font-medium ${isLight ? "text-zinc-900" : "text-white"}`}>Weekly Turnover</h2>
            <p className={`text-xs mt-0.5 ${isLight ? "text-zinc-500" : "text-zinc-500"}`}>Current week daily sales volume</p>
          </div>

          <div className="h-64 w-full">
            {mounted && (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={weeklyRevenue}
                  margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke={isLight ? "#e4e4e7" : "#262626"} />
                  <XAxis
                    dataKey="date"
                    stroke={isLight ? "#a1a1aa" : "#666"}
                    tick={{ fill: isLight ? "#71717a" : "#888", fontSize: 11 }}
                  />
                  <YAxis
                    stroke={isLight ? "#a1a1aa" : "#666"}
                    tick={{ fill: isLight ? "#71717a" : "#888", fontSize: 11 }}
                    tickFormatter={(val) => `$${val / 1000}k`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: isLight ? "#ffffff" : "#181818",
                      borderColor: isLight ? "#e4e4e7" : "#333",
                      borderRadius: "8px",
                      color: isLight ? "#09090b" : "#fff",
                      fontSize: "12px",
                    }}
                    formatter={(value: unknown) => [`$${Number(value).toLocaleString()}`, "Revenue"]}
                  />
                  <Bar dataKey="revenue" fill="#D4AF37" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Category Breakdown Pie */}
        <div className={`p-6 rounded-xl border transition-colors ${
          isLight ? "bg-white border-zinc-200 shadow-sm" : "bg-[#141414] border-[#262626]"
        }`}>
          <div className="mb-6">
            <h2 className={`text-base font-medium ${isLight ? "text-zinc-900" : "text-white"}`}>Category Distribution</h2>
            <p className={`text-xs mt-0.5 ${isLight ? "text-zinc-500" : "text-zinc-500"}`}>Share of sales by collection department</p>
          </div>

          <div className="h-64 w-full">
            {mounted && (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryBreakdown}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {categoryBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: isLight ? "#ffffff" : "#181818",
                      borderColor: isLight ? "#e4e4e7" : "#333",
                      borderRadius: "8px",
                      color: isLight ? "#09090b" : "#fff",
                      fontSize: "12px",
                    }}
                    formatter={(value: unknown) => [`${value}%`, "Share"]}
                  />
                  <Legend
                    formatter={(val) => (
                      <span className={`text-xs font-medium mr-2 ${isLight ? "text-zinc-700" : "text-zinc-300"}`}>
                        {val}
                      </span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
