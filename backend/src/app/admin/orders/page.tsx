"use client";

import { useState, useMemo } from "react";
import { Search, CreditCard, FileText } from "lucide-react";
import { orders } from "@/data/orders";
import type { Order } from "@/types";
import OrderReceiptModal from "@/components/admin/OrderReceiptModal";
import { useTheme } from "@/context/ThemeContext";

export default function AdminOrdersPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedOrderForReceipt, setSelectedOrderForReceipt] = useState<Order | null>(null);
  const { theme } = useTheme();
  const isLight = theme === "light";

  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const matchSearch =
        o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
        o.customerName.toLowerCase().includes(search.toLowerCase()) ||
        o.customerEmail.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter ? o.status === statusFilter : true;
      return matchSearch && matchStatus;
    });
  }, [search, statusFilter]);

  const statuses = ["processing", "shipped", "delivered", "return_requested", "returned", "cancelled"];

  const getStatusBadgeStyle = (status: string) => {
    if (isLight) {
      switch (status) {
        case "delivered":
          return "bg-emerald-100 text-emerald-800 border border-emerald-300 font-semibold";
        case "shipped":
          return "bg-blue-100 text-blue-800 border border-blue-300 font-semibold";
        case "processing":
          return "bg-amber-100 text-amber-900 border border-amber-300 font-semibold";
        case "confirmed":
          return "bg-purple-100 text-purple-800 border border-purple-300 font-semibold";
        case "cancelled":
          return "bg-rose-100 text-rose-800 border border-rose-300 font-semibold";
        case "return_requested":
          return "bg-orange-100 text-orange-800 border border-orange-300 font-semibold";
        case "returned":
          return "bg-zinc-200 text-zinc-800 border border-zinc-400 font-semibold";
        default:
          return "bg-zinc-100 text-zinc-800 border border-zinc-300";
      }
    } else {
      switch (status) {
        case "delivered":
          return "bg-emerald-950/60 text-emerald-400 border border-emerald-800/40";
        case "shipped":
          return "bg-blue-950/60 text-blue-400 border border-blue-800/40";
        case "processing":
          return "bg-amber-950/60 text-amber-400 border border-amber-800/40";
        case "confirmed":
          return "bg-purple-950/60 text-purple-400 border border-purple-800/40";
        case "cancelled":
          return "bg-rose-950/60 text-rose-400 border border-rose-800/40";
        case "return_requested":
          return "bg-orange-950/60 text-orange-400 border border-orange-800/40";
        case "returned":
          return "bg-zinc-800/80 text-zinc-300 border border-zinc-600";
        default:
          return "bg-zinc-800 text-zinc-400 border border-zinc-700";
      }
    }
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
            Orders Management
          </h1>
          <p
            className={`text-xs mt-1 ${
              isLight ? "text-zinc-500" : "text-zinc-400"
            }`}
          >
            Track customer orders, fulfillment status, and transaction totals.
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
            Total Orders:{" "}
            <strong className={isLight ? "text-amber-800 font-bold" : "text-[#D4AF37]"}>
              {orders.length}
            </strong>
          </span>
        </div>
      </div>

      {/* ── Toolbar ── */}
      <div
        className={`flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-xl border transition-colors ${
          isLight
            ? "bg-white border-zinc-200 shadow-sm"
            : "bg-[#141414] border-[#262626]"
        }`}
      >
        <div className="relative w-full sm:w-80">
          <Search
            size={16}
            className={`absolute left-3.5 top-1/2 -translate-y-1/2 ${
              isLight ? "text-zinc-400" : "text-zinc-500"
            }`}
          />
          <input
            type="text"
            placeholder="Search order #, customer, or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={`w-full pl-10 pr-4 py-2 rounded-lg text-xs transition-colors focus:outline-none ${
              isLight
                ? "bg-zinc-50 border border-zinc-200 text-zinc-900 placeholder:text-zinc-400 focus:bg-white focus:border-[#D4AF37]"
                : "bg-[#0d0d0d] border border-[#2b2b2b] text-white placeholder:text-zinc-500 focus:border-[#D4AF37]"
            }`}
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
          <button
            onClick={() => setStatusFilter("")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all shrink-0 ${
              statusFilter === ""
                ? "bg-[#D4AF37] text-black font-semibold shadow-sm"
                : isLight
                ? "bg-zinc-100 text-zinc-700 hover:text-zinc-950 hover:bg-zinc-200 border border-zinc-200"
                : "bg-zinc-800/80 text-zinc-400 hover:text-white border border-zinc-700/60"
            }`}
          >
            All Statuses
          </button>
          {statuses.map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all shrink-0 ${
                statusFilter === st
                  ? "bg-[#D4AF37] text-black font-semibold shadow-sm"
                  : isLight
                  ? "bg-zinc-100 text-zinc-700 hover:text-zinc-950 hover:bg-zinc-200 border border-zinc-200"
                  : "bg-zinc-800/80 text-zinc-400 hover:text-white border border-zinc-700/60"
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* ── Orders Table ── */}
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
              className={`uppercase font-mono text-[10px] tracking-wider border-b ${
                isLight
                  ? "bg-zinc-50 text-zinc-600 border-zinc-200"
                  : "bg-[#181818] text-zinc-400 border-[#262626]"
              }`}
            >
              <tr>
                <th className="py-3.5 px-3 font-medium">Order Number</th>
                <th className="py-3.5 px-3 font-medium">Customer</th>
                <th className="py-3.5 px-2.5 font-medium">Items Ordered</th>
                <th className="py-3.5 px-3 font-medium">Payment</th>
                <th className="py-3.5 px-3 font-medium">Status</th>
                <th className="py-3.5 px-3 font-medium text-right">Total</th>
                <th className="py-3.5 px-3 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody
              className={`divide-y ${
                isLight ? "divide-zinc-200" : "divide-[#202020]"
              }`}
            >
              {filteredOrders.map((o) => (
                <tr
                  key={o.id}
                  className={`transition-colors ${
                    isLight ? "hover:bg-zinc-50/80" : "hover:bg-white/[0.02]"
                  }`}
                >
                  <td
                    className={`py-3.5 px-3 font-mono font-medium ${
                      isLight ? "text-amber-800 font-semibold" : "text-[#D4AF37]"
                    }`}
                  >
                    {o.orderNumber}
                    <div
                      className={`text-[10px] font-sans mt-0.5 ${
                        isLight ? "text-zinc-500" : "text-zinc-500"
                      }`}
                    >
                      {new Date(o.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </div>
                  </td>

                  <td className="py-3.5 px-3">
                    <div
                      className={`font-semibold ${
                        isLight ? "text-zinc-950" : "text-white"
                      }`}
                    >
                      {o.customerName}
                    </div>
                    <div
                      className={`text-[11px] ${
                        isLight ? "text-zinc-500" : "text-zinc-500"
                      }`}
                    >
                      {o.customerEmail}
                    </div>
                  </td>

                  <td className="py-3.5 px-2.5">
                    <div className="space-y-1">
                      {o.items.map((it, idx) => (
                        <div
                          key={idx}
                          className={`truncate max-w-[190px] ${
                            isLight ? "text-zinc-700" : "text-zinc-300"
                          }`}
                        >
                          <span
                            className={`font-mono font-bold mr-1 ${
                              isLight ? "text-amber-800" : "text-[#D4AF37]"
                            }`}
                          >
                            {it.quantity}x
                          </span>
                          {it.name} ({it.size}/{it.color})
                        </div>
                      ))}
                    </div>
                  </td>

                  <td
                    className={`py-3.5 px-3 capitalize font-mono ${
                      isLight ? "text-zinc-700" : "text-zinc-400"
                    }`}
                  >
                    <span className="inline-flex items-center gap-1.5">
                      <CreditCard
                        size={13}
                        className={isLight ? "text-amber-700" : "text-[#D4AF37]"}
                      />
                      {o.paymentMethod.replace("_", " ")}
                    </span>
                  </td>

                  <td className="py-3.5 px-3">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded text-[10px] uppercase tracking-wider ${getStatusBadgeStyle(
                        o.status
                      )}`}
                    >
                      {o.status.replace("_", " ")}
                    </span>
                  </td>

                  <td
                    className={`py-3.5 px-3 text-right font-bold text-sm ${
                      isLight ? "text-zinc-950" : "text-white"
                    }`}
                  >
                    ${o.total.toFixed(2)}
                  </td>

                  <td className="py-3.5 px-3 text-right">
                    <div className="flex flex-col items-end gap-2">
                      <button
                        onClick={() => setSelectedOrderForReceipt(o)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shadow-xs group whitespace-nowrap ${
                          isLight
                            ? "bg-amber-100/90 text-amber-900 border border-amber-300 hover:bg-[#D4AF37] hover:text-black hover:border-[#D4AF37]"
                            : "bg-[#D4AF37]/15 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black border border-[#D4AF37]/35"
                        }`}
                        title="View Meesho/Amazon style Shipping Label & Tax Invoice"
                      >
                        <FileText
                          size={13}
                          className="transition-transform group-hover:scale-110 shrink-0"
                        />
                        <span>Order Preview</span>
                      </button>
                      
                      {o.status === "return_requested" && (
                        <button
                          onClick={async () => {
                            try {
                              await fetch(`/api/orders/${o.id}`, {
                                method: 'PATCH',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ status: 'returned' })
                              });
                              window.location.reload();
                            } catch (e) {
                              console.error(e);
                            }
                          }}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border border-emerald-300"
                        >
                          Approve Return
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Meesho / Amazon Style Shipping Label & Tax Invoice Modal ── */}
      <OrderReceiptModal
        order={selectedOrderForReceipt}
        onClose={() => setSelectedOrderForReceipt(null)}
      />
    </div>
  );
}
