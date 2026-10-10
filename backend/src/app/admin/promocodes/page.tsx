"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Tag,
  Plus,
  Copy,
  Check,
  Trash2,
  Search,
  Sparkles,
  TrendingUp,
  Percent,
  DollarSign,
  Calendar,
  AlertCircle,
  ToggleLeft,
  ToggleRight,
  Filter,
} from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

export interface PromoCode {
  id: string;
  code: string;
  title: string;
  type: "percentage" | "fixed";
  value: number;
  minSpend: number;
  usageLimit: number;
  usageCount: number;
  expiresAt: string;
  status: "active" | "inactive";
  createdAt: string;
}

const DEFAULT_PROMO_CODES: PromoCode[] = [
  {
    id: "pc_1",
    code: "WELCOME10",
    title: "New Client Welcome Offer",
    type: "percentage",
    value: 10,
    minSpend: 0,
    usageLimit: 500,
    usageCount: 142,
    expiresAt: "2026-12-31",
    status: "active",
    createdAt: "2026-01-01",
  },
  {
    id: "pc_2",
    code: "VIP20",
    title: "Private Haute Couture Circle",
    type: "percentage",
    value: 20,
    minSpend: 500,
    usageLimit: 100,
    usageCount: 68,
    expiresAt: "2026-11-30",
    status: "active",
    createdAt: "2026-02-15",
  },
  {
    id: "pc_3",
    code: "LUMIERE15",
    title: "Seasonal Parisian Runway Event",
    type: "percentage",
    value: 15,
    minSpend: 250,
    usageLimit: 300,
    usageCount: 219,
    expiresAt: "2026-10-31",
    status: "active",
    createdAt: "2026-03-01",
  },
  {
    id: "pc_4",
    code: "SPRING50",
    title: "Spring Solstice Special",
    type: "fixed",
    value: 50,
    minSpend: 350,
    usageLimit: 50,
    usageCount: 50,
    expiresAt: "2026-05-01",
    status: "inactive",
    createdAt: "2026-03-10",
  },
];

export default function AdminPromoCodesPage() {
  const { theme } = useTheme();
  const isLight = theme === "light";

  const [promos, setPromos] = useState<PromoCode[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [notification, setNotification] = useState<{ message: string; type: "success" | "info" } | null>(null);

  // Form State
  const [code, setCode] = useState("");
  const [title, setTitle] = useState("");
  const [type, setType] = useState<"percentage" | "fixed">("percentage");
  const [value, setValue] = useState<number>(15);
  const [minSpend, setMinSpend] = useState<number>(0);
  const [usageLimit, setUsageLimit] = useState<number>(100);
  const [expiresAt, setExpiresAt] = useState<string>("2026-12-31");
  const [isActive, setIsActive] = useState(true);

  // Load from localStorage or defaults
  useEffect(() => {
    try {
      const stored = localStorage.getItem("lumiere_promos");
      if (stored) {
        setPromos(JSON.parse(stored));
      } else {
        setPromos(DEFAULT_PROMO_CODES);
        localStorage.setItem("lumiere_promos", JSON.stringify(DEFAULT_PROMO_CODES));
      }
    } catch {
      setPromos(DEFAULT_PROMO_CODES);
    }
  }, []);

  // Save changes to localStorage and notify
  const updatePromos = (newPromos: PromoCode[]) => {
    setPromos(newPromos);
    try {
      localStorage.setItem("lumiere_promos", JSON.stringify(newPromos));
      // Also update frontend coupon lookup bridge
      const lookup: Record<string, number> = {};
      newPromos.forEach((p) => {
        if (p.status === "active") {
          lookup[p.code.toUpperCase()] = p.value;
        }
      });
      localStorage.setItem("lumiere_custom_coupons", JSON.stringify(lookup));
    } catch {}
  };

  const showToast = (message: string, toastType: "success" | "info" = "success") => {
    setNotification({ message, type: toastType });
    setTimeout(() => setNotification(null), 3000);
  };

  const generateRandomCode = () => {
    const prefixes = ["LUM", "LUXE", "VIP", "CHIC", "PARIS", "GOLD"];
    const randomPrefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const randomNum = Math.floor(10 + Math.random() * 90);
    setCode(`${randomPrefix}${randomNum}`);
  };

  const handleCreatePromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;

    const formattedCode = code.trim().toUpperCase().replace(/[^A-Z0-9_-]/g, "");

    // Check duplicate
    if (promos.some((p) => p.code === formattedCode)) {
      alert(`Promo code "${formattedCode}" already exists!`);
      return;
    }

    const newPromo: PromoCode = {
      id: `pc_${Date.now()}`,
      code: formattedCode,
      title: title.trim() || `${formattedCode} Luxury Discount`,
      type,
      value: Number(value) || 10,
      minSpend: Number(minSpend) || 0,
      usageLimit: Number(usageLimit) || 100,
      usageCount: 0,
      expiresAt: expiresAt || "2026-12-31",
      status: isActive ? "active" : "inactive",
      createdAt: new Date().toISOString().split("T")[0],
    };

    const updated = [newPromo, ...promos];
    updatePromos(updated);
    showToast(`Promo code "${formattedCode}" created successfully!`);

    // Reset Form
    setCode("");
    setTitle("");
    setValue(15);
    setMinSpend(0);
    setUsageLimit(100);
    setShowCreateModal(false);
  };

  const toggleStatus = (id: string) => {
    const updated = promos.map((p) => {
      if (p.id === id) {
        const nextStatus = p.status === "active" ? "inactive" : "active";
        return { ...p, status: nextStatus as "active" | "inactive" };
      }
      return p;
    });
    updatePromos(updated);
    showToast("Promo code status updated");
  };

  const deletePromo = (id: string, codeName: string) => {
    if (confirm(`Are you sure you want to remove promo code "${codeName}"?`)) {
      const updated = promos.filter((p) => p.id !== id);
      updatePromos(updated);
      showToast(`Promo code "${codeName}" deleted`, "info");
    }
  };

  const copyCode = (id: string, codeText: string) => {
    navigator.clipboard.writeText(codeText);
    setCopiedId(id);
    showToast(`Copied "${codeText}" to clipboard`);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Filtered List
  const filteredPromos = useMemo(() => {
    return promos.filter((p) => {
      const matchesSearch =
        p.code.toLowerCase().includes(search.toLowerCase()) ||
        p.title.toLowerCase().includes(search.toLowerCase());
      const matchesStatus =
        statusFilter === "all" ? true : p.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [promos, search, statusFilter]);

  // Overall Statistics
  const activeCount = promos.filter((p) => p.status === "active").length;
  const totalRedemptions = promos.reduce((sum, p) => sum + p.usageCount, 0);

  return (
    <div className="space-y-6">
      {/* ── Toast Notification ── */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-[#111] text-white px-5 py-3 rounded-lg border border-[#333] shadow-2xl animate-fade-in text-sm font-sans">
          <Sparkles size={16} className="text-[#D4AF37]" />
          <span>{notification.message}</span>
        </div>
      )}

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1
            className={`text-2xl font-serif tracking-wide ${
              isLight ? "text-zinc-900" : "text-white"
            }`}
          >
            Promo Codes & Discounts
          </h1>
          <p
            className={`text-xs mt-1 ${
              isLight ? "text-zinc-500" : "text-zinc-400"
            }`}
          >
            Create, configure, and monitor promotional vouchers and checkout discount codes.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center justify-center gap-2 bg-[#D4AF37] hover:bg-[#c49f27] text-black font-semibold text-xs px-4 py-2.5 rounded-lg shadow-sm transition-all"
        >
          <Plus size={16} />
          <span>Create Promo Code</span>
        </button>
      </div>

      {/* ── Quick Stats ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div
          className={`p-4 rounded-xl border transition-colors ${
            isLight
              ? "bg-white border-zinc-200 shadow-sm"
              : "bg-[#141414] border-[#262626]"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-zinc-400 font-medium">Active Coupons</span>
            <Tag size={16} className="text-[#D4AF37]" />
          </div>
          <p
            className={`text-2xl font-serif mt-2 font-semibold ${
              isLight ? "text-zinc-900" : "text-white"
            }`}
          >
            {activeCount}{" "}
            <span className="text-xs font-sans text-zinc-400 font-normal">
              / {promos.length} total
            </span>
          </p>
        </div>

        <div
          className={`p-4 rounded-xl border transition-colors ${
            isLight
              ? "bg-white border-zinc-200 shadow-sm"
              : "bg-[#141414] border-[#262626]"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-zinc-400 font-medium">Total Redemptions</span>
            <TrendingUp size={16} className="text-emerald-500" />
          </div>
          <p
            className={`text-2xl font-serif mt-2 font-semibold ${
              isLight ? "text-zinc-900" : "text-white"
            }`}
          >
            {totalRedemptions}
          </p>
        </div>

        <div
          className={`p-4 rounded-xl border transition-colors ${
            isLight
              ? "bg-white border-zinc-200 shadow-sm"
              : "bg-[#141414] border-[#262626]"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-zinc-400 font-medium">Boutique Lift</span>
            <Percent size={16} className="text-blue-400" />
          </div>
          <p
            className={`text-2xl font-serif mt-2 font-semibold ${
              isLight ? "text-zinc-900" : "text-white"
            }`}
          >
            +24.8%
          </p>
        </div>
      </div>

      {/* ── Filter Bar ── */}
      <div
        className={`p-3 rounded-xl border flex flex-col sm:flex-row items-center justify-between gap-3 ${
          isLight
            ? "bg-white border-zinc-200 shadow-sm"
            : "bg-[#141414] border-[#262626]"
        }`}
      >
        <div className="relative w-full sm:w-80">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
          />
          <input
            type="text"
            placeholder="Search promo codes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={`w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border outline-none transition-colors ${
              isLight
                ? "bg-zinc-50 border-zinc-200 text-zinc-900 focus:border-zinc-400"
                : "bg-[#1c1c1c] border-[#2a2a2a] text-zinc-100 focus:border-[#D4AF37]"
            }`}
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <span className="text-xs text-zinc-400 flex items-center gap-1">
            <Filter size={12} /> Status:
          </span>
          {(["all", "active", "inactive"] as const).map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setStatusFilter(st)}
              className={`text-xs px-2.5 py-1 rounded-md capitalize font-medium transition-all ${
                statusFilter === st
                  ? "bg-[#D4AF37] text-black font-semibold"
                  : isLight
                  ? "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
                  : "bg-[#222] text-zinc-400 hover:bg-[#2a2a2a]"
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* ── Table of Promo Codes ── */}
      <div
        className={`rounded-xl border overflow-hidden transition-colors ${
          isLight
            ? "bg-white border-zinc-200 shadow-sm"
            : "bg-[#141414] border-[#262626]"
        }`}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead
              className={`border-b font-medium uppercase tracking-wider text-[10px] ${
                isLight
                  ? "bg-zinc-50 border-zinc-200 text-zinc-500"
                  : "bg-[#181818] border-[#262626] text-zinc-400"
              }`}
            >
              <tr>
                <th className="py-3 px-4">Coupon Code</th>
                <th className="py-3 px-4">Campaign</th>
                <th className="py-3 px-4">Discount</th>
                <th className="py-3 px-4">Min Spend</th>
                <th className="py-3 px-4">Redemptions</th>
                <th className="py-3 px-4">Expires</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody
              className={`divide-y ${
                isLight ? "divide-zinc-200" : "divide-[#262626]"
              }`}
            >
              {filteredPromos.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-zinc-400">
                    <Tag size={28} className="mx-auto mb-2 opacity-30" />
                    No promo codes found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredPromos.map((promo) => {
                  const percentUsed = Math.min(
                    100,
                    Math.round((promo.usageCount / promo.usageLimit) * 100)
                  );
                  return (
                    <tr
                      key={promo.id}
                      className={`transition-colors ${
                        isLight ? "hover:bg-zinc-50" : "hover:bg-[#1a1a1a]"
                      }`}
                    >
                      {/* Code */}
                      <td className="py-3.5 px-4 font-mono font-bold">
                        <div className="inline-flex items-center gap-1.5 bg-zinc-800/10 dark:bg-zinc-800 px-2 py-1 rounded border border-zinc-700/20 text-[#D4AF37]">
                          <span>{promo.code}</span>
                          <button
                            type="button"
                            onClick={() => copyCode(promo.id, promo.code)}
                            title="Copy Code"
                            className="hover:text-white transition-colors"
                          >
                            {copiedId === promo.id ? (
                              <Check size={12} className="text-emerald-400" />
                            ) : (
                              <Copy size={12} />
                            )}
                          </button>
                        </div>
                      </td>

                      {/* Title */}
                      <td
                        className={`py-3.5 px-4 font-medium ${
                          isLight ? "text-zinc-800" : "text-zinc-200"
                        }`}
                      >
                        {promo.title}
                      </td>

                      {/* Discount */}
                      <td className="py-3.5 px-4 font-semibold text-emerald-500">
                        {promo.type === "percentage"
                          ? `${promo.value}% OFF`
                          : `$${promo.value} OFF`}
                      </td>

                      {/* Min Spend */}
                      <td className="py-3.5 px-4 text-zinc-400">
                        {promo.minSpend > 0 ? `$${promo.minSpend}` : "None"}
                      </td>

                      {/* Redemptions */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <span className="text-zinc-400">
                            {promo.usageCount} / {promo.usageLimit}
                          </span>
                          <div className="w-16 h-1.5 rounded-full bg-zinc-700/30 overflow-hidden">
                            <div
                              className="h-full bg-[#D4AF37] rounded-full"
                              style={{ width: `${percentUsed}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      {/* Expiry */}
                      <td className="py-3.5 px-4 text-zinc-400">
                        {promo.expiresAt}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                            promo.status === "active"
                              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                              : "bg-zinc-500/10 text-zinc-400 border border-zinc-500/20"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              promo.status === "active"
                                ? "bg-emerald-400 animate-pulse"
                                : "bg-zinc-500"
                            }`}
                          />
                          {promo.status === "active" ? "Active" : "Inactive"}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="inline-flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => toggleStatus(promo.id)}
                            title={
                              promo.status === "active"
                                ? "Deactivate"
                                : "Activate"
                            }
                            className={`p-1.5 rounded transition-colors ${
                              promo.status === "active"
                                ? "text-emerald-400 hover:bg-emerald-500/10"
                                : "text-zinc-500 hover:bg-zinc-800"
                            }`}
                          >
                            {promo.status === "active" ? (
                              <ToggleRight size={18} />
                            ) : (
                              <ToggleLeft size={18} />
                            )}
                          </button>
                          <button
                            type="button"
                            onClick={() => deletePromo(promo.id, promo.code)}
                            title="Delete"
                            className="p-1.5 text-zinc-400 hover:text-red-400 hover:bg-red-500/10 rounded transition-colors"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Create Promo Code Modal ── */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div
            className={`w-full max-w-lg rounded-2xl border p-6 shadow-2xl transition-colors ${
              isLight
                ? "bg-white border-zinc-200 text-zinc-900"
                : "bg-[#141414] border-[#2c2c2c] text-zinc-100"
            }`}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-zinc-700/30">
              <div className="flex items-center gap-2">
                <Tag size={20} className="text-[#D4AF37]" />
                <h2 className="text-lg font-serif font-semibold">
                  Create New Promo Code
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="text-zinc-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleCreatePromo} className="mt-5 space-y-4">
              {/* Code Name & Generator */}
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1.5">
                  Coupon Code *
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    placeholder="e.g. SUMMER25"
                    value={code}
                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                    className={`flex-1 px-3 py-2 text-xs rounded-lg border font-mono font-bold tracking-wider outline-none uppercase transition-colors ${
                      isLight
                        ? "bg-zinc-50 border-zinc-300 text-zinc-900 focus:border-zinc-900"
                        : "bg-[#1c1c1c] border-[#2c2c2c] text-[#D4AF37] focus:border-[#D4AF37]"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={generateRandomCode}
                    className={`px-3 py-2 text-xs rounded-lg border flex items-center gap-1 font-medium transition-colors ${
                      isLight
                        ? "bg-zinc-100 hover:bg-zinc-200 border-zinc-300 text-zinc-700"
                        : "bg-[#222] hover:bg-[#2c2c2c] border-[#333] text-zinc-300"
                    }`}
                  >
                    <Sparkles size={12} className="text-[#D4AF37]" />
                    <span>Generate</span>
                  </button>
                </div>
              </div>

              {/* Title / Description */}
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1.5">
                  Campaign Title / Description
                </label>
                <input
                  type="text"
                  placeholder="e.g. Autumn Exclusive Runway Collection"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className={`w-full px-3 py-2 text-xs rounded-lg border outline-none transition-colors ${
                    isLight
                      ? "bg-zinc-50 border-zinc-300 text-zinc-900 focus:border-zinc-900"
                      : "bg-[#1c1c1c] border-[#2c2c2c] text-zinc-100 focus:border-[#D4AF37]"
                  }`}
                />
              </div>

              {/* Type and Value */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1.5">
                    Discount Type
                  </label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as "percentage" | "fixed")}
                    className={`w-full px-3 py-2 text-xs rounded-lg border outline-none transition-colors ${
                      isLight
                        ? "bg-zinc-50 border-zinc-300 text-zinc-900 focus:border-zinc-900"
                        : "bg-[#1c1c1c] border-[#2c2c2c] text-zinc-100 focus:border-[#D4AF37]"
                    }`}
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount ($)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1.5">
                    Discount Amount *
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      required
                      min={1}
                      max={type === "percentage" ? 100 : 10000}
                      value={value}
                      onChange={(e) => setValue(Number(e.target.value))}
                      className={`w-full px-3 py-2 text-xs rounded-lg border font-semibold outline-none transition-colors ${
                        isLight
                          ? "bg-zinc-50 border-zinc-300 text-zinc-900 focus:border-zinc-900"
                          : "bg-[#1c1c1c] border-[#2c2c2c] text-zinc-100 focus:border-[#D4AF37]"
                      }`}
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-zinc-400 font-bold">
                      {type === "percentage" ? "%" : "$"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Min Spend & Usage Limit */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1.5">
                    Min Spend ($)
                  </label>
                  <input
                    type="number"
                    min={0}
                    placeholder="0 = No minimum"
                    value={minSpend}
                    onChange={(e) => setMinSpend(Number(e.target.value))}
                    className={`w-full px-3 py-2 text-xs rounded-lg border outline-none transition-colors ${
                      isLight
                        ? "bg-zinc-50 border-zinc-300 text-zinc-900 focus:border-zinc-900"
                        : "bg-[#1c1c1c] border-[#2c2c2c] text-zinc-100 focus:border-[#D4AF37]"
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1.5">
                    Total Usage Limit
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={usageLimit}
                    onChange={(e) => setUsageLimit(Number(e.target.value))}
                    className={`w-full px-3 py-2 text-xs rounded-lg border outline-none transition-colors ${
                      isLight
                        ? "bg-zinc-50 border-zinc-300 text-zinc-900 focus:border-zinc-900"
                        : "bg-[#1c1c1c] border-[#2c2c2c] text-zinc-100 focus:border-[#D4AF37]"
                    }`}
                  />
                </div>
              </div>

              {/* Expiry Date */}
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1.5">
                  Expiration Date
                </label>
                <input
                  type="date"
                  value={expiresAt}
                  onChange={(e) => setExpiresAt(e.target.value)}
                  className={`w-full px-3 py-2 text-xs rounded-lg border outline-none transition-colors ${
                    isLight
                      ? "bg-zinc-50 border-zinc-300 text-zinc-900 focus:border-zinc-900"
                      : "bg-[#1c1c1c] border-[#2c2c2c] text-zinc-100 focus:border-[#D4AF37]"
                  }`}
                />
              </div>

              {/* Status Toggle */}
              <div className="flex items-center justify-between p-3 rounded-lg border border-zinc-700/30">
                <span className="text-xs font-medium">Activate Code Immediately</span>
                <button
                  type="button"
                  onClick={() => setIsActive(!isActive)}
                  className="text-[#D4AF37]"
                >
                  {isActive ? <ToggleRight size={24} /> : <ToggleLeft size={24} className="text-zinc-500" />}
                </button>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className={`px-4 py-2 text-xs rounded-lg border font-medium ${
                    isLight
                      ? "border-zinc-300 text-zinc-700 hover:bg-zinc-100"
                      : "border-[#333] text-zinc-400 hover:bg-[#222]"
                  }`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs bg-[#D4AF37] hover:bg-[#c49f27] text-black font-semibold rounded-lg shadow-sm transition-all"
                >
                  Save & Publish Code
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
