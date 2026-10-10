"use client";

import { useState, useMemo } from "react";
import { Search, RefreshCcw, CheckCircle, XCircle } from "lucide-react";
import { orders } from "@/data/orders";
import type { Order } from "@/types";
import { useTheme } from "@/context/ThemeContext";

export default function AdminReturnsPage() {
  const [search, setSearch] = useState("");
  const { theme } = useTheme();
  const isLight = theme === "light";

  // In a real app, you would fetch these from the server and manage state
  const [localOrders, setLocalOrders] = useState<Order[]>(orders);

  const returnsAndCancellations = useMemo(() => {
    return localOrders.filter((o) =>
      ["cancelled", "return_requested", "returned", "refunded"].includes(o.status)
    );
  }, [localOrders]);

  const filteredRequests = useMemo(() => {
    return returnsAndCancellations.filter((o) => {
      const matchSearch =
        o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
        o.customerName.toLowerCase().includes(search.toLowerCase()) ||
        o.customerEmail.toLowerCase().includes(search.toLowerCase());
      return matchSearch;
    });
  }, [search, returnsAndCancellations]);

  const handleUpdateStatus = (orderId: string, newStatus: Order["status"]) => {
    setLocalOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
    // Real implementation would call the PATCH /api/orders/[id] API here
  };

  const getStatusBadgeStyle = (status: string) => {
    if (isLight) {
      switch (status) {
        case "returned":
        case "refunded":
          return "bg-purple-100 text-purple-800 border border-purple-300 font-semibold";
        case "return_requested":
          return "bg-amber-100 text-amber-900 border border-amber-300 font-semibold";
        case "cancelled":
          return "bg-rose-100 text-rose-800 border border-rose-300 font-semibold";
        default:
          return "bg-zinc-100 text-zinc-800 border border-zinc-300";
      }
    } else {
      switch (status) {
        case "returned":
        case "refunded":
          return "bg-purple-950/60 text-purple-400 border border-purple-800/40";
        case "return_requested":
          return "bg-amber-950/60 text-amber-400 border border-amber-800/40";
        case "cancelled":
          return "bg-rose-950/60 text-rose-400 border border-rose-800/40";
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
            Returns & Cancellations
          </h1>
          <p
            className={`text-xs mt-1 ${
              isLight ? "text-zinc-500" : "text-zinc-400"
            }`}
          >
            Manage order cancellations and return requests.
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
            Total Requests:{" "}
            <strong className={isLight ? "text-amber-800 font-bold" : "text-[#D4AF37]"}>
              {returnsAndCancellations.length}
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
      </div>

      {/* ── Requests Table ── */}
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
                <th className="py-3.5 px-3 font-medium">Status</th>
                <th className="py-3.5 px-3 font-medium">Total</th>
                <th className="py-3.5 px-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody
              className={`divide-y ${
                isLight ? "divide-zinc-200" : "divide-[#202020]"
              }`}
            >
              {filteredRequests.map((o) => (
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
                    className={`py-3.5 px-3 font-bold text-sm ${
                      isLight ? "text-zinc-950" : "text-white"
                    }`}
                  >
                    ${o.total.toFixed(2)}
                  </td>
                  <td className="py-3.5 px-3 text-right">
                    {o.status === "return_requested" && (
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleUpdateStatus(o.id, "returned")}
                          className="inline-flex items-center gap-1 px-2 py-1.5 rounded text-xs font-semibold bg-emerald-100 text-emerald-700 hover:bg-emerald-200 transition-colors"
                          title="Approve Return"
                        >
                          <CheckCircle size={14} /> Approve
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(o.id, "delivered")}
                          className="inline-flex items-center gap-1 px-2 py-1.5 rounded text-xs font-semibold bg-rose-100 text-rose-700 hover:bg-rose-200 transition-colors"
                          title="Reject Return"
                        >
                          <XCircle size={14} /> Reject
                        </button>
                      </div>
                    )}
                    {o.status === "returned" && (
                      <button
                        onClick={() => handleUpdateStatus(o.id, "refunded")}
                        className="inline-flex items-center gap-1 px-2 py-1.5 rounded text-xs font-semibold bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors"
                        title="Process Refund"
                      >
                        <RefreshCcw size={14} /> Refund
                      </button>
                    )}
                    {(o.status === "cancelled" || o.status === "refunded") && (
                      <span className="text-xs text-zinc-500">Processed</span>
                    )}
                  </td>
                </tr>
              ))}
              {filteredRequests.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="py-6 text-center text-zinc-500 text-sm"
                  >
                    No return or cancellation requests found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
