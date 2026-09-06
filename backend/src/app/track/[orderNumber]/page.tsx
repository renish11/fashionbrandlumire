import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { orders } from "@/data/orders";
import { CheckCircle2, Truck, Package, Clock, ShieldCheck, MapPin } from "lucide-react";

interface TrackPageProps {
  params: Promise<{ orderNumber: string }>;
}

export default async function OrderTrackingPage({ params }: TrackPageProps) {
  const { orderNumber } = await params;
  const decodedOrderNo = decodeURIComponent(orderNumber);

  const order = orders.find(
    (o) =>
      o.orderNumber.toLowerCase() === decodedOrderNo.toLowerCase() ||
      o.id.toLowerCase() === decodedOrderNo.toLowerCase()
  );

  if (!order) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
        <div className="max-w-md w-full text-center space-y-4 p-8 rounded-2xl bg-[#141414] border border-[#262626]">
          <div className="w-12 h-12 rounded-full bg-rose-500/10 border border-rose-500/30 flex items-center justify-center mx-auto text-rose-400">
            ✕
          </div>
          <h1 className="text-xl font-serif text-white">Order Not Found</h1>
          <p className="text-xs text-zinc-400">
            No shipment record found for order reference:{" "}
            <span className="font-mono text-[#D4AF37]">{decodedOrderNo}</span>
          </p>
          <Link
            href="/admin/orders"
            className="inline-block px-4 py-2 rounded-lg bg-[#D4AF37] text-black text-xs font-medium hover:bg-[#e0bc46] transition-colors"
          >
            Back to Orders
          </Link>
        </div>
      </div>
    );
  }

  const awbNumber = order.trackingNumber
    ? order.trackingNumber.replace(/[^0-9]/g, "") || "149085798249773"
    : `1490${order.orderNumber.replace(/[^0-9]/g, "").padStart(11, "8249773")}`;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white py-10 px-4 sm:px-6">
      <div className="max-w-xl mx-auto space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-1">
          <div className="font-serif text-2xl tracking-widest text-[#D4AF37]">
            L U M I È R E
          </div>
          <p className="text-[11px] uppercase tracking-widest text-zinc-400">
            Verified Shipment & Dispatch Portal
          </p>
        </div>

        {/* Status Card */}
        <div className="p-6 rounded-2xl bg-[#141414] border border-[#262626] space-y-6 shadow-xl">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
            <div>
              <span className="text-[11px] text-zinc-500 uppercase tracking-wider block">
                Order Reference
              </span>
              <span className="font-mono font-bold text-lg text-white">
                {order.orderNumber}
              </span>
            </div>
            <div className="text-right">
              <span className="text-[11px] text-zinc-500 uppercase tracking-wider block">
                Fulfillment Status
              </span>
              <span
                className={`inline-block px-2.5 py-1 rounded text-xs font-semibold uppercase tracking-wider ${
                  order.status === "delivered"
                    ? "bg-emerald-950/70 text-emerald-400 border border-emerald-800/40"
                    : order.status === "shipped"
                    ? "bg-blue-950/70 text-blue-400 border border-blue-800/40"
                    : "bg-amber-950/70 text-amber-400 border border-amber-800/40"
                }`}
              >
                {order.status}
              </span>
            </div>
          </div>

          {/* Courier & AWB */}
          <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-[#0f0f0f] border border-zinc-800/80">
            <div>
              <span className="text-[10px] text-zinc-500 uppercase tracking-wider">
                Logistics Partner
              </span>
              <div className="font-bold text-sm text-white mt-0.5">Delhivery Express</div>
              <span className="inline-block bg-white text-black font-bold text-[9px] px-1.5 py-0.5 mt-1">
                Air Priority
              </span>
            </div>
            <div>
              <span className="text-[10px] text-zinc-500 uppercase tracking-wider">
                Waybill (AWB) #
              </span>
              <div className="font-mono font-bold text-sm text-[#D4AF37] mt-0.5">
                {awbNumber}
              </div>
              <span className="text-[10px] text-zinc-400 mt-1 block">
                Origin: Surat, Gujarat
              </span>
            </div>
          </div>

          {/* Customer & Address */}
          <div className="space-y-3 border-b border-zinc-800 pb-4 text-xs">
            <div className="flex items-start gap-2">
              <MapPin size={16} className="text-[#D4AF37] shrink-0 mt-0.5" />
              <div>
                <span className="text-zinc-500 block text-[10px] uppercase">
                  Shipping Address
                </span>
                <strong className="text-white text-sm block">
                  {order.customerName}
                </strong>
                <p className="text-zinc-400 leading-relaxed mt-0.5">
                  {order.shippingAddress.address1}
                  {order.shippingAddress.address2 && `, ${order.shippingAddress.address2}`}
                  <br />
                  {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.zip}
                </p>
                <p className="text-zinc-500 text-[11px] mt-1 font-mono">
                  Phone: {order.shippingAddress.phone}
                </p>
              </div>
            </div>
          </div>

          {/* Items Summary */}
          <div className="space-y-3">
            <span className="text-[10px] text-zinc-500 uppercase tracking-wider block">
              Package Contents ({order.items.reduce((sum, i) => sum + i.quantity, 0)} pieces)
            </span>
            <div className="divide-y divide-zinc-800/80">
              {order.items.map((it, idx) => (
                <div key={idx} className="py-2.5 flex items-center justify-between text-xs">
                  <div>
                    <strong className="text-white block font-medium">{it.name}</strong>
                    <span className="text-[11px] text-zinc-400">
                      Size: {it.size} • Color: {it.color} • Qty: {it.quantity}
                    </span>
                  </div>
                  <div className="text-right font-mono font-semibold text-[#D4AF37]">
                    ${(it.price * it.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pricing & Verification Summary */}
          <div className="pt-4 border-t border-zinc-800 space-y-1.5 text-xs">
            <div className="flex justify-between text-zinc-400">
              <span>Subtotal:</span>
              <span className="font-mono">${order.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-zinc-400">
              <span>Tax (GST):</span>
              <span className="font-mono">${order.tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-zinc-400">
              <span>Shipping Fee:</span>
              <span className="font-mono">
                {order.shipping === 0 ? "Free" : `$${order.shipping.toFixed(2)}`}
              </span>
            </div>
            <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-zinc-800">
              <span>Total Amount:</span>
              <span className="font-mono text-[#D4AF37]">${order.total.toFixed(2)}</span>
            </div>
          </div>

          {/* Security Badge */}
          <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-800/30 flex items-center gap-2.5 text-emerald-400 text-xs">
            <ShieldCheck size={18} className="shrink-0" />
            <span>
              Official verified parcel dispatched by Lumière Atelier Pvt Ltd, Surat, Gujarat (GSTIN: 24PDGPS3370F1ZW).
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
