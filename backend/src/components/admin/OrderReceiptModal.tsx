"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import QRCode from "qrcode";
import {
  X,
  Printer,
  QrCode as QrIcon,
  Maximize2,
  ExternalLink,
  Smartphone,
  Check,
  Scissors,
  Download,
} from "lucide-react";
import type { Order } from "@/types";
import { useTheme } from "@/context/ThemeContext";

interface OrderReceiptModalProps {
  order: Order | null;
  onClose: () => void;
}

// Generate realistic deterministic barcode bars based on an AWB string
function renderBarcodeSvg(awb: string) {
  const bars: { x: number; width: number }[] = [];
  let currentX = 14;

  for (let i = 0; i < awb.length; i++) {
    const charCode = awb.charCodeAt(i);
    const pattern = [
      (charCode % 2) + 1,
      1,
      ((charCode >> 1) % 3) + 1,
      1,
      ((charCode >> 2) % 2) + 1,
      2,
    ];

    pattern.forEach((w, idx) => {
      if (idx % 2 === 0) {
        bars.push({ x: currentX, width: w });
      }
      currentX += w + 1;
    });
  }

  return (
    <svg
      viewBox={`0 0 ${currentX + 14} 48`}
      className="w-full h-11"
      preserveAspectRatio="none"
    >
      <rect width="100%" height="100%" fill="#ffffff" />
      {bars.map((bar, idx) => (
        <rect
          key={idx}
          x={bar.x}
          y="2"
          width={bar.width}
          height="44"
          fill="#000000"
        />
      ))}
    </svg>
  );
}

export default function OrderReceiptModal({ order, onClose }: OrderReceiptModalProps) {
  const { theme } = useTheme();
  const isLight = theme === "light";
  const [qrMode, setQrMode] = useState<"tracking_link" | "delhivery" | "text">("tracking_link");
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");
  const [currentPayload, setCurrentPayload] = useState<string>("");
  const [isQrZoomed, setIsQrZoomed] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const receiptRef = useRef<HTMLDivElement>(null);

  // Close on Escape key
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (isQrZoomed) {
          setIsQrZoomed(false);
        } else {
          onClose();
        }
      }
    },
    [isQrZoomed, onClose]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    if (!order) return;

    const awbNumber = order.trackingNumber
      ? order.trackingNumber.replace(/[^0-9]/g, "") || "149085798249773"
      : `1490${order.orderNumber.replace(/[^0-9]/g, "").padStart(11, "8249773")}`;

    const origin =
      typeof window !== "undefined" && window.location.origin
        ? window.location.origin
        : "http://localhost:4000";

    let payload = "";

    if (qrMode === "tracking_link") {
      // 1. Direct Web Verification Link
      payload = `${origin}/track/${encodeURIComponent(order.orderNumber)}`;
    } else if (qrMode === "delhivery") {
      // 2. Official Delhivery Live Package Tracking URL
      payload = `https://www.delhivery.com/track/package/${awbNumber}`;
    } else {
      // 3. Clean compact plain-text format
      payload = [
        `LUMIÈRE ORDER: ${order.orderNumber}`,
        `AWB: ${awbNumber}`,
        `NAME: ${order.customerName}`,
        `TOTAL: $${order.total.toFixed(2)}`,
        `STATUS: ${order.status.toUpperCase()}`,
        `ITEMS: ${order.items.map((it) => `${it.quantity}x ${it.name}`).join(", ")}`,
        `PIN: ${order.shippingAddress.zip}`,
      ].join("\n");
    }

    setCurrentPayload(payload);

    QRCode.toDataURL(payload, {
      width: 360,
      margin: 2,
      errorCorrectionLevel: "M",
      color: {
        dark: "#000000",
        light: "#ffffff",
      },
    })
      .then((url) => setQrCodeUrl(url))
      .catch((err) => console.error("Failed to generate QR code", err));
  }, [order, qrMode]);

  if (!order) return null;

  const isCod = order.paymentMethod.toLowerCase() === "cod";
  const awbNumber = order.trackingNumber
    ? order.trackingNumber.replace(/[^0-9]/g, "") || "149085798249773"
    : `1490${order.orderNumber.replace(/[^0-9]/g, "").padStart(11, "8249773")}`;

  const destCode = `ST/DEL/${order.shippingAddress.zip.replace(/[^0-9]/g, "").slice(0, 3) || "395"}`;
  const invoiceNo = `gem${order.orderNumber.replace(/[^0-9]/g, "").padStart(8, "00242842")}`;
  const formattedOrderDate = new Date(order.createdAt).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  const handlePrint = () => {
    const receiptElem = document.getElementById("printable-receipt");
    if (!receiptElem) {
      window.print();
      return;
    }

    // Create an isolated hidden iframe
    const iframe = document.createElement("iframe");
    iframe.style.position = "fixed";
    iframe.style.right = "0";
    iframe.style.bottom = "0";
    iframe.style.width = "0";
    iframe.style.height = "0";
    iframe.style.border = "none";
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow?.document;
    if (!doc) {
      window.print();
      return;
    }

    // Collect all loaded CSS links and style blocks from parent
    let stylesHtml = "";
    document.querySelectorAll('link[rel="stylesheet"], style').forEach((node) => {
      stylesHtml += node.outerHTML;
    });

    doc.open();
    doc.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Lumiere_Receipt_${order.orderNumber}</title>
          ${stylesHtml}
          <style>
            @page {
              size: A4 portrait;
              margin: 10mm;
            }
            body {
              background: #ffffff !important;
              color: #000000 !important;
              margin: 0 !important;
              padding: 0 !important;
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            #printable-receipt {
              margin: 0 auto !important;
              width: 100% !important;
              max-width: 580px !important;
              border: 2px solid #000000 !important;
              page-break-inside: avoid !important;
              break-inside: avoid !important;
              box-shadow: none !important;
            }
          </style>
        </head>
        <body>
          <div style="display: flex; justify-content: center; padding: 15px 0;">
            ${receiptElem.outerHTML}
          </div>
        </body>
      </html>
    `);
    doc.close();

    setTimeout(() => {
      iframe.contentWindow?.focus();
      iframe.contentWindow?.print();
      setTimeout(() => {
        if (document.body.contains(iframe)) {
          document.body.removeChild(iframe);
        }
      }, 1500);
    }, 400);
  };

  const handleCopyPayload = () => {
    if (currentPayload) {
      navigator.clipboard.writeText(currentPayload);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md overflow-hidden print:p-0 print:bg-white print:static print:overflow-visible"
      onClick={onClose}
    >
      <style>{`
        @media print {
          body * {
            visibility: hidden !important;
          }
          #printable-receipt, #printable-receipt * {
            visibility: visible !important;
          }
          #printable-receipt {
            position: fixed !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            max-width: 600px !important;
            margin: 0 auto !important;
            border: 2px solid #000 !important;
          }
        }
      `}</style>

      {/* ── Fixed Floating Close Button (Top-Right of Screen) ── */}
      <button
        onClick={onClose}
        className={`fixed top-3 right-3 sm:top-5 sm:right-5 z-50 p-2.5 rounded-full shadow-2xl transition-all print:hidden ${
          isLight
            ? "bg-white text-zinc-700 hover:bg-rose-50 hover:text-rose-600 border border-zinc-300"
            : "bg-zinc-800/90 text-white hover:bg-rose-600 hover:text-white border border-zinc-600"
        }`}
        title="Close Receipt (Esc)"
      >
        <X size={20} />
      </button>

      {/* ── Modal Dialog (Constrained Height with Internal Scroll) ── */}
      <div
        className={`relative w-full max-w-2xl max-h-[92vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden transition-colors print:border-0 print:shadow-none print:m-0 print:w-full print:max-w-none print:bg-white print:max-h-none ${
          isLight
            ? "bg-white border border-zinc-200"
            : "bg-[#141414] border border-zinc-700"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Sticky Top Bar: Header + Actions (Always Visible) ── */}
        <div className={`sticky top-0 z-30 shrink-0 flex items-center justify-between px-5 py-3 border-b shadow-xs transition-colors print:hidden ${
          isLight
            ? "bg-zinc-50 border-zinc-200"
            : "bg-[#181818] border-zinc-800"
        }`}>
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
              isLight
                ? "bg-amber-100 border border-amber-300 text-amber-800"
                : "bg-[#D4AF37]/15 border border-[#D4AF37]/40 text-[#D4AF37]"
            }`}>
              <QrIcon size={18} />
            </div>
            <div>
              <h3 className={`font-serif text-sm sm:text-base font-semibold ${
                isLight ? "text-zinc-900" : "text-white"
              }`}>
                Order Receipt & Tax Invoice
              </h3>
              <p className={`text-[11px] font-mono ${
                isLight ? "text-zinc-500" : "text-zinc-400"
              }`}>
                Order #{order.orderNumber} • AWB: {awbNumber}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#D4AF37] hover:bg-[#c5a030] text-black font-semibold text-xs transition-colors shadow-sm"
              title="Print Receipt / Save PDF"
            >
              <Printer size={14} />
              <span className="hidden sm:inline">Print Receipt</span>
            </button>
            <button
              onClick={onClose}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border ${
                isLight
                  ? "bg-white hover:bg-zinc-100 text-zinc-700 border-zinc-300"
                  : "bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border-zinc-700"
              }`}
              title="Close (Esc)"
            >
              <X size={14} />
              <span>Close</span>
            </button>
          </div>
        </div>

        {/* ── Sticky Sub-bar: QR Mode Selector & Zoom (Always Visible) ── */}
        <div className={`shrink-0 px-5 py-2.5 border-b flex flex-wrap items-center justify-between gap-2 text-xs transition-colors print:hidden ${
          isLight
            ? "bg-zinc-100/90 border-zinc-200 text-zinc-700"
            : "bg-[#111111] border-zinc-800 text-zinc-300"
        }`}>
          <div className="flex items-center gap-1.5">
            <Smartphone size={13} className={isLight ? "text-amber-700" : "text-[#D4AF37]"} />
            <span className={`font-medium text-[11px] ${isLight ? "text-zinc-700" : "text-zinc-300"}`}>
              QR Scan Mode:
            </span>
          </div>

          <div className={`flex items-center gap-1 p-0.5 rounded-lg border ${
            isLight
              ? "bg-zinc-200/80 border-zinc-300"
              : "bg-[#1a1a1a] border-zinc-800"
          }`}>
            <button
              onClick={() => setQrMode("tracking_link")}
              className={`px-2.5 py-1 rounded text-[11px] transition-all ${
                qrMode === "tracking_link"
                  ? "bg-[#D4AF37] text-black font-bold shadow-xs"
                  : isLight
                  ? "text-zinc-600 hover:text-zinc-950"
                  : "text-zinc-400 hover:text-white"
              }`}
              title="Opens verified live order details on mobile phone"
            >
              🔗 Order Track Link
            </button>
            <button
              onClick={() => setQrMode("delhivery")}
              className={`px-2.5 py-1 rounded text-[11px] transition-all ${
                qrMode === "delhivery"
                  ? "bg-[#D4AF37] text-black font-bold shadow-xs"
                  : isLight
                  ? "text-zinc-600 hover:text-zinc-950"
                  : "text-zinc-400 hover:text-white"
              }`}
              title="Official Delhivery tracking link"
            >
              🚚 Delhivery
            </button>
            <button
              onClick={() => setQrMode("text")}
              className={`px-2.5 py-1 rounded text-[11px] transition-all ${
                qrMode === "text"
                  ? "bg-[#D4AF37] text-black font-bold shadow-xs"
                  : isLight
                  ? "text-zinc-600 hover:text-zinc-950"
                  : "text-zinc-400 hover:text-white"
              }`}
              title="Compact plain-text summary"
            >
              📄 Summary Text
            </button>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setIsQrZoomed(true)}
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded border text-[11px] font-medium transition-colors ${
                isLight
                  ? "bg-white hover:bg-zinc-50 text-zinc-700 border-zinc-300 shadow-2xs"
                  : "bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border-zinc-700"
              }`}
              title="Click to view full-size high-contrast QR code for easy scanning"
            >
              <Maximize2 size={11} />
              <span>Enlarge QR</span>
            </button>

            {qrMode !== "text" && (
              <a
                href={currentPayload}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded border text-[11px] font-medium transition-colors ${
                  isLight
                    ? "bg-amber-100 hover:bg-amber-200 text-amber-900 border-amber-300"
                    : "bg-[#D4AF37]/10 hover:bg-[#D4AF37]/20 text-[#D4AF37] border-[#D4AF37]/30"
                }`}
                title="Test scan destination in new tab"
              >
                <span>Test Link</span>
                <ExternalLink size={10} />
              </a>
            )}
          </div>
        </div>

        {/* ── Scrollable Body with Generous Padding ── */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#0c0c0c] flex justify-center print:p-0 print:overflow-visible print:bg-white">
          {/* ════════════════════════════════════════════════════════════════════
              AUTHENTIC MEESHO / AMAZON / DELHIVERY STYLE SHIPPING LABEL
              Carefully formatted with clean spacing, no cramping!
          ════════════════════════════════════════════════════════════════════ */}
          <div
            ref={receiptRef}
            id="printable-receipt"
            className="w-full max-w-[560px] bg-white text-black font-sans text-[11px] border-2 border-black shadow-lg"
          >
            {/* ── TOP SECTION: SHIPPING LABEL ── */}
            <div className="grid grid-cols-12 border-b-2 border-black">
              {/* Left Column: Customer & Return Address (6 of 12 cols) */}
              <div className="col-span-6 border-r-2 border-black flex flex-col justify-between">
                {/* Customer Address */}
                <div className="p-3 border-b-2 border-black">
                  <div className="font-bold text-[11px] uppercase tracking-wider text-zinc-700 mb-1">
                    Customer Address
                  </div>
                  <div className="font-bold text-[13px] text-black mb-1">
                    {order.customerName}
                  </div>
                  <div className="text-[11px] text-black leading-snug">
                    {order.shippingAddress.address1}
                  </div>
                  {order.shippingAddress.address2 && (
                    <div className="text-[11px] text-black leading-snug">
                      {order.shippingAddress.address2}
                    </div>
                  )}
                  <div className="text-[11px] text-black leading-snug mt-0.5">
                    {order.shippingAddress.city}, {order.shippingAddress.state}
                  </div>
                  <div className="text-[11px] text-black font-bold mt-0.5">
                    PIN: {order.shippingAddress.zip}, {order.shippingAddress.country}
                  </div>
                  <div className="text-[10px] text-zinc-700 mt-1 font-mono">
                    Phone: {order.shippingAddress.phone}
                  </div>
                </div>

                {/* Return Address */}
                <div className="p-3">
                  <div className="font-bold text-[10px] uppercase tracking-wider text-zinc-700 mb-1">
                    If undelivered, return to:
                  </div>
                  <div className="font-bold text-[11px] text-black uppercase">
                    LUMIÈRE ATELIER FASHION
                  </div>
                  <div className="text-[10px] text-zinc-900 leading-relaxed mt-1">
                    j 3/4 ground floor ambika nagar near by
                    <br />
                    paramhansh society lambe hanuman road
                    <br />
                    Surat Gujrat pin code 395006
                    <br />
                    near by paramhansh society lambe hanuman
                    <br />
                    surat, Gujarat, 395006
                  </div>
                </div>
              </div>

              {/* Right Column: Courier, Destination, QR Code, Barcode (6 of 12 cols) */}
              <div className="col-span-6 flex flex-col justify-between">
                {/* Top COD / PREPAID Banner */}
                <div
                  className="px-3 py-1.5 font-bold text-[11px] tracking-wide text-left"
                  style={{ backgroundColor: "#000000", color: "#ffffff" }}
                >
                  {isCod
                    ? "COD: Check the payable amount on the app"
                    : "PREPAID: Do Not Collect Cash from Customer"}
                </div>

                {/* Courier Logistics & QR Code */}
                <div className="p-3 flex items-start justify-between gap-3 border-b-2 border-black">
                  <div className="space-y-1">
                    <div className="text-xl font-black tracking-tight text-black">
                      Delhivery
                    </div>
                    <div
                      className="inline-block text-[9px] font-bold px-2 py-0.5 uppercase tracking-wider"
                      style={{ backgroundColor: "#000000", color: "#ffffff" }}
                    >
                      Pickup
                    </div>

                    <div className="pt-1.5">
                      <div className="text-[9px] text-zinc-600 uppercase">
                        Destination Code
                      </div>
                      <div className="font-bold text-[11px] text-black font-mono">
                        {destCode}
                      </div>
                    </div>

                    <div>
                      <div className="text-[9px] text-zinc-600 uppercase">
                        Return Code
                      </div>
                      <div className="font-bold text-[11px] text-black font-mono">
                        395006,800099
                      </div>
                    </div>
                  </div>

                  {/* High-Contrast Crisp QR Code */}
                  <div
                    onClick={() => setIsQrZoomed(true)}
                    className="shrink-0 flex flex-col items-center cursor-pointer group"
                    title="Click to enlarge QR code"
                  >
                    {qrCodeUrl ? (
                      <div className="relative p-1 bg-white border border-black shadow-sm group-hover:border-[#D4AF37] transition-colors">
                        <img
                          src={qrCodeUrl}
                          alt={`QR Code for order ${order.orderNumber}`}
                          className="w-24 h-24 transition-transform group-hover:scale-105"
                          style={{ imageRendering: "pixelated" }}
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white rounded">
                          <Maximize2 size={16} />
                        </div>
                      </div>
                    ) : (
                      <div className="w-24 h-24 border border-black bg-zinc-100 flex items-center justify-center text-[9px] text-zinc-500">
                        Generating QR...
                      </div>
                    )}
                    <span className="text-[8px] font-mono font-bold text-zinc-800 mt-1 uppercase tracking-wider">
                      Scan to Verify
                    </span>
                  </div>
                </div>

                {/* Numeric AWB + Linear Barcode */}
                <div className="p-2.5 text-center bg-white">
                  <div className="font-mono font-bold text-[13px] tracking-widest text-black mb-1">
                    {awbNumber}
                  </div>
                  <div className="flex justify-center">
                    {renderBarcodeSvg(awbNumber)}
                  </div>
                </div>
              </div>
            </div>

            {/* ── MIDDLE SECTION: PRODUCT DETAILS ── */}
            <div className="border-b-2 border-black">
              <div className="px-3 py-1.5 font-bold text-[11px] text-black bg-zinc-100 border-b border-black">
                Product Details
              </div>
              <table className="w-full text-left text-[10px]">
                <thead>
                  <tr className="border-b border-black text-zinc-800 font-semibold uppercase bg-zinc-50">
                    <th className="py-1.5 px-3">SKU</th>
                    <th className="py-1.5 px-2">Size</th>
                    <th className="py-1.5 px-2 text-center">Qty</th>
                    <th className="py-1.5 px-2">Color</th>
                    <th className="py-1.5 px-3 text-right">Order No.</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200">
                  {order.items.map((it, idx) => {
                    const cleanSku = `LUM_${it.name.toLowerCase().replace(/\s+/g, "_").slice(0, 10)}`;
                    return (
                      <tr key={idx} className="text-black">
                        <td className="py-1.5 px-3 font-mono font-medium">
                          {cleanSku}
                        </td>
                        <td className="py-1.5 px-2 font-medium">{it.size}</td>
                        <td className="py-1.5 px-2 text-center font-bold">
                          {it.quantity}
                        </td>
                        <td className="py-1.5 px-2">{it.color}</td>
                        <td className="py-1.5 px-3 text-right font-mono text-[9px]">
                          {order.orderNumber.replace(/[^0-9]/g, "")}_{idx + 1}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* ── FOLD HERE SEPARATOR ── */}
            <div className="py-1.5 px-4 flex items-center justify-center gap-2 font-mono text-[9px] text-zinc-600 tracking-widest border-b-2 border-dashed border-zinc-400 bg-zinc-50 uppercase select-none">
              <Scissors size={11} className="text-zinc-500" />
              <span>- - - - - - - - - - Fold Here - - - - - - - - - -</span>
            </div>

            {/* ── BOTTOM SECTION: TAX INVOICE ── */}
            <div>
              {/* Invoice Title Bar */}
              <div className="px-3 py-1.5 flex items-center justify-between border-b-2 border-black bg-zinc-100">
                <span className="font-bold text-[12px] tracking-wider text-black">
                  TAX INVOICE
                </span>
                <span className="text-[9px] text-zinc-700 font-semibold uppercase">
                  Original For Recipient
                </span>
              </div>

              {/* 3-Column Info: BILL TO | SHIP TO | SOLD BY */}
              <div className="grid grid-cols-12 border-b-2 border-black text-[10px]">
                {/* BILL TO */}
                <div className="col-span-4 p-3 border-r-2 border-black leading-relaxed">
                  <div className="font-bold uppercase text-black mb-1">BILL TO</div>
                  <div className="font-semibold text-black">{order.customerName}</div>
                  <div className="text-zinc-800">{order.billingAddress.address1}</div>
                  <div className="text-zinc-800">
                    {order.billingAddress.city}, {order.billingAddress.state} - {order.billingAddress.zip}
                  </div>
                  <div className="font-semibold text-black mt-1 text-[9px]">
                    Place of Supply: 24 Gujarat / {order.billingAddress.state}
                  </div>
                </div>

                {/* SHIP TO */}
                <div className="col-span-4 p-3 border-r-2 border-black leading-relaxed">
                  <div className="font-bold uppercase text-black mb-1">SHIP TO</div>
                  <div className="font-semibold text-black">{order.customerName}</div>
                  <div className="text-zinc-800">{order.shippingAddress.address1}</div>
                  <div className="text-zinc-800">
                    {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.zip}
                  </div>
                </div>

                {/* SOLD BY & INVOICE META */}
                <div className="col-span-4 p-3 leading-relaxed text-[9px]">
                  <div>
                    <span className="text-zinc-600">Sold by: </span>
                    <strong className="text-black">LUMIÈRE ATELIER, surat, Gujarat, 395006</strong>
                  </div>
                  <div className="mt-0.5">
                    <span className="text-zinc-600">GSTIN: </span>
                    <strong className="font-mono text-black">24PDGPS3370F1ZW</strong>
                  </div>
                  <div className="mt-0.5">
                    <span className="text-zinc-600">Purchase Order No: </span>
                    <strong className="font-mono text-black">
                      {order.orderNumber.replace(/[^0-9]/g, "")}
                    </strong>
                  </div>
                  <div className="mt-0.5">
                    <span className="text-zinc-600">Invoice No: </span>
                    <strong className="font-mono text-black">{invoiceNo}</strong>
                  </div>
                  <div className="flex justify-between mt-1 pt-1 border-t border-zinc-200">
                    <span>Order Date: <strong>{formattedOrderDate}</strong></span>
                    <span>Invoice Date: <strong>{formattedOrderDate}</strong></span>
                  </div>
                </div>
              </div>

              {/* Tax Line Items Table with Generous Padding */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-[9px]">
                  <thead>
                    <tr className="border-b-2 border-black text-black font-bold bg-zinc-100 uppercase">
                      <th className="py-1.5 px-2.5">Description</th>
                      <th className="py-1.5 px-1.5">HSN</th>
                      <th className="py-1.5 px-1.5 text-center">Qty</th>
                      <th className="py-1.5 px-2 text-right">Gross Amount</th>
                      <th className="py-1.5 px-1.5 text-right">Discount</th>
                      <th className="py-1.5 px-2 text-right">Taxable Value</th>
                      <th className="py-1.5 px-2 text-right">Taxes</th>
                      <th className="py-1.5 px-2.5 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-200">
                    {order.items.map((it, idx) => {
                      const itemTotal = it.price * it.quantity;
                      const taxable = itemTotal / 1.05;
                      const taxAmt = itemTotal - taxable;
                      const cleanSku = `LUM_${it.name.toLowerCase().replace(/\s+/g, "_").slice(0, 10)} - ${it.size}`;

                      return (
                        <tr key={idx} className="text-black">
                          <td className="py-1.5 px-2.5 font-medium">{cleanSku}</td>
                          <td className="py-1.5 px-1.5 font-mono">6211</td>
                          <td className="py-1.5 px-1.5 text-center font-bold">{it.quantity}</td>
                          <td className="py-1.5 px-2 text-right font-mono">
                            Rs.{itemTotal.toFixed(2)}
                          </td>
                          <td className="py-1.5 px-1.5 text-right font-mono text-zinc-500">
                            Rs.0.00
                          </td>
                          <td className="py-1.5 px-2 text-right font-mono">
                            Rs.{taxable.toFixed(2)}
                          </td>
                          <td className="py-1.5 px-2 text-right font-mono text-[8px] leading-tight">
                            IGST @5.0%
                            <br />
                            Rs.{taxAmt.toFixed(2)}
                          </td>
                          <td className="py-1.5 px-2.5 text-right font-mono font-bold">
                            Rs.{itemTotal.toFixed(2)}
                          </td>
                        </tr>
                      );
                    })}

                    {/* Other Charges / Logistics Fee */}
                    <tr className="text-black bg-zinc-50">
                      <td className="py-1.5 px-2.5 font-medium">Other Charges</td>
                      <td className="py-1.5 px-1.5 font-mono">6211</td>
                      <td className="py-1.5 px-1.5 text-center">NA</td>
                      <td className="py-1.5 px-2 text-right font-mono">Rs.18.00</td>
                      <td className="py-1.5 px-1.5 text-right font-mono text-zinc-500">Rs.0</td>
                      <td className="py-1.5 px-2 text-right font-mono">Rs.17.14</td>
                      <td className="py-1.5 px-2 text-right font-mono text-[8px] leading-tight">
                        IGST @5.0%
                        <br />
                        Rs.0.86
                      </td>
                      <td className="py-1.5 px-2.5 text-right font-mono font-bold">
                        Rs.18.00
                      </td>
                    </tr>

                    {/* Grand Total Row */}
                    {(() => {
                      const totalTaxes =
                        order.items.reduce(
                          (acc, it) => acc + (it.price * it.quantity - (it.price * it.quantity) / 1.05),
                          0
                        ) + 0.86;
                      const grandTotal = order.total + 18.0;

                      return (
                        <tr className="font-bold border-t-2 border-black bg-zinc-100 text-black">
                          <td colSpan={6} className="py-2 px-3 text-left uppercase text-[10px]">
                            Total
                          </td>
                          <td className="py-2 px-2 text-right font-mono">
                            Rs.{totalTaxes.toFixed(2)}
                          </td>
                          <td className="py-2 px-3 text-right font-mono text-[11px] font-black">
                            Rs.{grandTotal.toFixed(2)}
                          </td>
                        </tr>
                      );
                    })()}
                  </tbody>
                </table>
              </div>

              {/* Disclaimer / Legal Footer with Proper Spacing */}
              <div className="p-3 border-t-2 border-black text-[8.5px] text-zinc-700 leading-relaxed">
                Tax is not payable on reverse charge basis. This is a computer generated invoice and does not require signature. Other charges are charges that are applicable to your order and include charges for logistics fee (where applicable). Includes discounts for your city and/or for online payments (as applicable).
              </div>
            </div>
          </div>
        </div>

        {/* ── Fixed Bottom Bar: Close & Info (Always Visible) ── */}
        <div className={`sticky bottom-0 z-30 shrink-0 px-5 py-3 border-t flex flex-wrap items-center justify-between gap-3 text-xs transition-colors print:hidden ${
          isLight
            ? "bg-zinc-50 border-zinc-200 text-zinc-600"
            : "bg-[#161616] border-zinc-800 text-zinc-400"
        }`}>
          <div className="flex items-center gap-2">
            <span className={`font-mono text-xs ${isLight ? "text-zinc-600" : "text-zinc-400"}`}>
              Payload: <span className={isLight ? "text-amber-800 font-semibold" : "text-[#D4AF37]"}>{currentPayload.slice(0, 36)}...</span>
            </span>
            <button
              onClick={handleCopyPayload}
              className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors border ${
                isLight
                  ? "bg-white hover:bg-zinc-100 text-zinc-700 border-zinc-300"
                  : "bg-zinc-800 hover:text-white text-zinc-400 border-zinc-700"
              }`}
            >
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className={`px-3.5 py-1.5 rounded-lg font-medium text-xs transition-colors inline-flex items-center gap-1.5 border ${
                isLight
                  ? "bg-white hover:bg-zinc-100 text-zinc-800 border-zinc-300"
                  : "bg-zinc-800 hover:bg-zinc-700 text-white border-zinc-700"
              }`}
            >
              <Printer size={13} />
              <span>Print</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg bg-[#D4AF37] hover:bg-[#c5a030] text-black font-semibold text-xs transition-colors shadow-sm"
            >
              Close
            </button>
          </div>
        </div>
      </div>

      {/* ── HIGH-CONTRAST FULLSCREEN QR CODE ZOOM MODAL ── */}
      {isQrZoomed && (
        <div
          onClick={() => setIsQrZoomed(false)}
          className="fixed inset-0 z-60 bg-black/95 backdrop-blur-md flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl p-6 text-center max-w-sm w-full space-y-4 shadow-2xl border-4 border-[#D4AF37]"
          >
            <div className="flex items-center justify-between pb-2 border-b border-zinc-200">
              <span className="font-bold text-sm text-black uppercase tracking-wider">
                Scan With Phone Camera
              </span>
              <button
                onClick={() => setIsQrZoomed(false)}
                className="p-1 rounded-lg text-zinc-600 hover:text-black hover:bg-zinc-100 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-3 bg-white border-2 border-black rounded-xl inline-block shadow-inner">
              <img
                src={qrCodeUrl}
                alt="Enlarged QR Code"
                className="w-64 h-64 mx-auto"
                style={{ imageRendering: "pixelated" }}
              />
            </div>

            <div className="space-y-1 text-xs text-zinc-700">
              <div className="font-bold text-black font-mono">
                Order #{order.orderNumber}
              </div>
              <p className="text-[11px] text-zinc-600">
                Point your camera at this QR code.
              </p>
              {qrMode !== "text" && (
                <a
                  href={currentPayload}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[#b58c1c] font-semibold hover:underline text-xs mt-1"
                >
                  <span>Open link in new tab</span>
                  <ExternalLink size={12} />
                </a>
              )}
            </div>

            <button
              onClick={() => setIsQrZoomed(false)}
              className="w-full py-2 rounded-xl bg-black text-white font-medium text-xs hover:bg-zinc-800 transition-colors"
            >
              Done Scanning
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
