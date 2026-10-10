"use client";

import { useState } from "react";
import { Mail, Clock, ShoppingCart, Send } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

// Mock data for abandoned carts
const mockAbandonedCarts = [
  {
    id: "ac_1",
    customer: "Elena Silva",
    email: "elena.s@example.com",
    product: "Silk Midnight Gown",
    value: 450,
    time: "2 hours ago",
    status: "pending",
  },
  {
    id: "ac_2",
    customer: "Chloe Zhang",
    email: "chloe.z@example.com",
    product: "Cashmere Turtleneck",
    value: 295,
    time: "24 hours ago",
    status: "pending",
  },
  {
    id: "ac_3",
    customer: "Sophia Laurent",
    email: "sophia.l@example.com",
    product: "Pleated Trousers",
    value: 180,
    time: "2 days ago",
    status: "sent",
  },
];

export default function AdminMarketingPage() {
  const { theme } = useTheme();
  const isLight = theme === "light";
  const [carts, setCarts] = useState(mockAbandonedCarts);
  const [sending, setSending] = useState<string | null>(null);

  const handleSendEmail = (id: string) => {
    setSending(id);
    setTimeout(() => {
      setCarts((prev) =>
        prev.map((c) => (c.id === id ? { ...c, status: "sent" } : c))
      );
      setSending(null);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1
            className={`text-2xl font-serif tracking-wide ${
              isLight ? "text-zinc-900" : "text-white"
            }`}
          >
            Marketing Campaigns
          </h1>
          <p
            className={`text-xs mt-1 ${
              isLight ? "text-zinc-500" : "text-zinc-400"
            }`}
          >
            Manage abandoned carts, send automated emails, and increase recovery.
          </p>
        </div>
        <div>
          <span
            className={`text-xs px-3 py-2 rounded-lg border font-medium ${
              isLight
                ? "bg-white text-zinc-700 border-zinc-200 shadow-sm"
                : "bg-[#161616] text-zinc-400 border-[#262626]"
            }`}
          >
            Potential Revenue:{" "}
            <strong className={isLight ? "text-emerald-700 font-bold" : "text-emerald-400"}>
              $925.00
            </strong>
          </span>
        </div>
      </div>

      {/* ── Abandoned Carts Table ── */}
      <div
        className={`rounded-xl border overflow-hidden transition-colors ${
          isLight
            ? "bg-white border-zinc-200 shadow-sm"
            : "bg-[#141414] border-[#262626]"
        }`}
      >
        <div className={`p-4 border-b flex items-center gap-2 ${isLight ? "border-zinc-200" : "border-[#262626]"}`}>
          <ShoppingCart size={18} className={isLight ? "text-amber-700" : "text-[#D4AF37]"} />
          <h2 className={`font-semibold ${isLight ? "text-zinc-900" : "text-white"}`}>Abandoned Carts Tracker</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead
              className={`uppercase font-mono text-[10px] tracking-wider border-b ${
                isLight
                  ? "bg-zinc-50 text-zinc-600 border-zinc-200"
                  : "bg-[#181818] text-zinc-400 border-[#262626]"
              }`}
            >
              <tr>
                <th className="py-3.5 px-4 font-medium">Customer</th>
                <th className="py-3.5 px-4 font-medium">Cart Contents</th>
                <th className="py-3.5 px-4 font-medium">Abandoned Time</th>
                <th className="py-3.5 px-4 font-medium">Value</th>
                <th className="py-3.5 px-4 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody
              className={`divide-y ${
                isLight ? "divide-zinc-200" : "divide-[#202020]"
              }`}
            >
              {carts.map((cart) => (
                <tr
                  key={cart.id}
                  className={`transition-colors ${
                    isLight ? "hover:bg-zinc-50/80" : "hover:bg-white/[0.02]"
                  }`}
                >
                  <td className="py-3.5 px-4">
                    <div
                      className={`font-semibold ${
                        isLight ? "text-zinc-950" : "text-white"
                      }`}
                    >
                      {cart.customer}
                    </div>
                    <div
                      className={`text-[11px] ${
                        isLight ? "text-zinc-500" : "text-zinc-500"
                      }`}
                    >
                      {cart.email}
                    </div>
                  </td>

                  <td className={`py-3.5 px-4 ${isLight ? "text-zinc-700" : "text-zinc-300"}`}>
                    {cart.product}
                  </td>

                  <td className={`py-3.5 px-4 font-mono ${isLight ? "text-zinc-600" : "text-zinc-400"}`}>
                    <span className="flex items-center gap-1.5">
                      <Clock size={12} />
                      {cart.time}
                    </span>
                  </td>

                  <td
                    className={`py-3.5 px-4 font-bold text-sm ${
                      isLight ? "text-emerald-700" : "text-emerald-400"
                    }`}
                  >
                    ${cart.value.toFixed(2)}
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    {cart.status === "sent" ? (
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold ${isLight ? "bg-zinc-100 text-zinc-500" : "bg-zinc-800 text-zinc-400"}`}>
                        <Mail size={13} />
                        Email Sent
                      </span>
                    ) : (
                      <button
                        onClick={() => handleSendEmail(cart.id)}
                        disabled={sending === cart.id}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shadow-xs group whitespace-nowrap ${
                          isLight
                            ? "bg-amber-100/90 text-amber-900 border border-amber-300 hover:bg-[#D4AF37] hover:text-black hover:border-[#D4AF37]"
                            : "bg-[#D4AF37]/15 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black border border-[#D4AF37]/35"
                        } ${sending === cart.id ? "opacity-50 cursor-not-allowed" : ""}`}
                      >
                        <Send size={13} className={sending === cart.id ? "animate-pulse" : "transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"} />
                        <span>{sending === cart.id ? "Sending..." : "Send Reminder"}</span>
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
