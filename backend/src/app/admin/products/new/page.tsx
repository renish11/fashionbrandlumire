"use client";

import { useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Save,
  X,
  Plus,
  Trash2,
  ImageIcon,
  Tag,
  Sparkles,
  Eye,
  Loader2,
  Check,
  AlertCircle,
} from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

/* ── Color Presets ── */
const COLOR_PRESETS = [
  { name: "Ivory", hex: "#FFFFF0" },
  { name: "Black", hex: "#1a1a1a" },
  { name: "Camel", hex: "#C19A6B" },
  { name: "Blush", hex: "#FFB6C1" },
  { name: "Gold", hex: "#D4AF37" },
  { name: "Emerald", hex: "#50C878" },
  { name: "Navy", hex: "#1B2A4A" },
  { name: "Champagne", hex: "#F7E7CE" },
  { name: "Burgundy", hex: "#800020" },
  { name: "Lavender", hex: "#E6E6FA" },
];

const SIZE_OPTIONS = ["XS", "S", "M", "L", "XL", "XXL"];
const CATEGORIES = ["dresses", "tops", "trousers", "outerwear"];

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function NewProductPage() {
  const router = useRouter();
  const { theme } = useTheme();
  const isLight = theme === "light";

  /* ── Form State ── */
  const [name, setName] = useState("");
  const [slugManual, setSlugManual] = useState(false);
  const [slug, setSlug] = useState("");
  const [brand, setBrand] = useState("Lumière");
  const [sku, setSku] = useState("");
  const [description, setDescription] = useState("");
  const [longDescription, setLongDescription] = useState("");
  const [price, setPrice] = useState("");
  const [compareAtPrice, setCompareAtPrice] = useState("");
  const [stock, setStock] = useState("");
  const [category, setCategory] = useState("");
  const [imageUrls, setImageUrls] = useState<string[]>([""]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<{ name: string; hex: string }[]>([]);
  const [isFeatured, setIsFeatured] = useState(false);
  const [isNew, setIsNew] = useState(true);
  const [isBestseller, setIsBestseller] = useState(false);
  const [materials, setMaterials] = useState("");
  const [care, setCare] = useState("");

  /* ── Submission State ── */
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  /* ── Derived slug ── */
  const computedSlug = useMemo(() => {
    if (slugManual) return slug;
    return slugify(name);
  }, [name, slug, slugManual]);

  /* ── Handlers ── */
  const toggleSize = (size: string) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  const toggleColor = (color: { name: string; hex: string }) => {
    setSelectedColors((prev) =>
      prev.some((c) => c.name === color.name)
        ? prev.filter((c) => c.name !== color.name)
        : [...prev, color]
    );
  };

  const addImageSlot = () => setImageUrls((prev) => [...prev, ""]);
  const removeImageSlot = (idx: number) =>
    setImageUrls((prev) => prev.filter((_, i) => i !== idx));
  const updateImageUrl = (idx: number, val: string) =>
    setImageUrls((prev) => prev.map((u, i) => (i === idx ? val : u)));

  const validImages = imageUrls.filter((u) => u.trim() !== "");

  const handleSubmit = useCallback(async () => {
    setError("");

    if (!name.trim()) return setError("Product name is required.");
    if (!category) return setError("Please select a category.");
    if (!price || Number(price) <= 0) return setError("Please enter a valid price.");
    if (!sku.trim()) return setError("SKU is required.");

    setSubmitting(true);

    const payload = {
      name: name.trim(),
      slug: computedSlug,
      brand: brand.trim() || "Lumière",
      description: description.trim(),
      longDescription: longDescription.trim(),
      price: Number(price),
      compareAtPrice: compareAtPrice ? Number(compareAtPrice) : undefined,
      category,
      sku: sku.trim(),
      stock: Number(stock) || 0,
      sizes: selectedSizes,
      colors: selectedColors,
      images: validImages.map((src, i) => ({
        id: `img_new_${i}`,
        src,
        alt: `${name} image ${i + 1}`,
        width: 800,
        height: 1000,
      })),
      isFeatured,
      isNew,
      isBestseller,
      materials: materials
        .split(",")
        .map((m) => m.trim())
        .filter(Boolean),
      care: care
        .split(",")
        .map((c) => c.trim())
        .filter(Boolean),
    };

    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to create product");
      }

      setSuccess(true);
      setTimeout(() => router.push("/admin/products"), 1200);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
    } finally {
      setSubmitting(false);
    }
  }, [
    name,
    computedSlug,
    brand,
    description,
    longDescription,
    price,
    compareAtPrice,
    category,
    sku,
    stock,
    selectedSizes,
    selectedColors,
    validImages,
    isFeatured,
    isNew,
    isBestseller,
    materials,
    care,
    router,
  ]);

  /* ── Common styled classes ── */
  const inputClass = `w-full px-3.5 py-2.5 rounded-lg text-sm transition-colors focus:outline-none ${
    isLight
      ? "bg-zinc-50 border border-zinc-200 text-zinc-900 placeholder:text-zinc-400 focus:bg-white focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/20"
      : "bg-[#0d0d0d] border border-[#2b2b2b] text-white placeholder:text-zinc-500 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/20"
  }`;

  const labelClass = `block text-xs font-semibold mb-1.5 tracking-wide uppercase ${
    isLight ? "text-zinc-600" : "text-zinc-400"
  }`;

  const cardClass = `rounded-xl border p-5 transition-colors ${
    isLight
      ? "bg-white border-zinc-200 shadow-sm"
      : "bg-[#141414] border-[#262626]"
  }`;

  return (
    <div className="space-y-6 pb-12">
      {/* ── Header Bar ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/products"
            className={`p-2 rounded-lg transition-colors border ${
              isLight
                ? "bg-zinc-100 hover:bg-zinc-200 text-zinc-700 border-zinc-200"
                : "bg-[#181818] hover:bg-zinc-800 text-zinc-400 border-zinc-700"
            }`}
          >
            <ArrowLeft size={16} />
          </Link>
          <div>
            <h1
              className={`text-xl font-serif tracking-wide ${
                isLight ? "text-zinc-900" : "text-white"
              }`}
            >
              Add New Product
            </h1>
            <p className={`text-[11px] mt-0.5 ${isLight ? "text-zinc-500" : "text-zinc-500"}`}>
              Fill in the details to add a new piece to the collection.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/admin/products"
            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium transition-colors border ${
              isLight
                ? "bg-zinc-100 hover:bg-zinc-200 text-zinc-700 border-zinc-200"
                : "bg-[#181818] hover:bg-zinc-800 text-zinc-400 border-zinc-700"
            }`}
          >
            <X size={14} />
            Discard
          </Link>
          <button
            onClick={handleSubmit}
            disabled={submitting || success}
            className={`inline-flex items-center gap-2 px-5 py-2 rounded-lg text-xs font-semibold transition-all shadow-md hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed ${
              success
                ? "bg-emerald-500 text-white"
                : "bg-[#D4AF37] text-black hover:bg-[#c5a030]"
            }`}
          >
            {submitting ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                Creating…
              </>
            ) : success ? (
              <>
                <Check size={14} />
                Created!
              </>
            ) : (
              <>
                <Save size={14} />
                Save Product
              </>
            )}
          </button>
        </div>
      </div>

      {/* ── Error Banner ── */}
      {error && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-500 text-xs font-medium">
          <AlertCircle size={14} />
          {error}
        </div>
      )}

      {/* ── Form Grid: Left Form + Right Preview ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ── LEFT COLUMN: Form Fields ── */}
        <div className="lg:col-span-2 space-y-6">
          {/* General Information */}
          <div className={cardClass}>
            <h3
              className={`text-sm font-semibold mb-4 flex items-center gap-2 ${
                isLight ? "text-zinc-800" : "text-white"
              }`}
            >
              <Tag size={16} className="text-[#D4AF37]" />
              General Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className={labelClass}>Product Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Silk Midi Dress"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className={`text-xs font-semibold tracking-wide uppercase ${isLight ? "text-zinc-600" : "text-zinc-400"}`}>
                    Slug
                  </label>
                  <button
                    onClick={() => setSlugManual(!slugManual)}
                    className="text-[10px] text-[#D4AF37] hover:underline"
                  >
                    {slugManual ? "Auto-generate" : "Edit manually"}
                  </button>
                </div>
                <input
                  type="text"
                  value={slugManual ? slug : computedSlug}
                  onChange={(e) => {
                    setSlugManual(true);
                    setSlug(e.target.value);
                  }}
                  readOnly={!slugManual}
                  className={`${inputClass} ${!slugManual ? "opacity-60" : ""} font-mono text-xs`}
                />
              </div>
              <div>
                <label className={labelClass}>Brand</label>
                <input
                  type="text"
                  placeholder="Lumière"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>SKU *</label>
                <input
                  type="text"
                  placeholder="e.g. LUM-SMD-002"
                  value={sku}
                  onChange={(e) => setSku(e.target.value)}
                  className={`${inputClass} font-mono`}
                />
              </div>
              <div>
                <label className={labelClass}>Category *</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className={inputClass}
                >
                  <option value="">Select category…</option>
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat} className="capitalize">
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className={labelClass}>Short Description</label>
                <textarea
                  rows={2}
                  placeholder="A brief overview of the piece…"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className={`${inputClass} resize-none`}
                />
              </div>
              <div className="sm:col-span-2">
                <label className={labelClass}>Long Description</label>
                <textarea
                  rows={4}
                  placeholder="Detailed product description including fabric, craftsmanship, and styling notes…"
                  value={longDescription}
                  onChange={(e) => setLongDescription(e.target.value)}
                  className={`${inputClass} resize-none`}
                />
              </div>
            </div>
          </div>

          {/* Pricing & Inventory */}
          <div className={cardClass}>
            <h3
              className={`text-sm font-semibold mb-4 flex items-center gap-2 ${
                isLight ? "text-zinc-800" : "text-white"
              }`}
            >
              <span className="text-[#D4AF37] text-base font-bold">$</span>
              Pricing & Inventory
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className={labelClass}>Retail Price ($) *</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="485.00"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className={`${inputClass} font-mono`}
                />
              </div>
              <div>
                <label className={labelClass}>Compare-at Price ($)</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="620.00"
                  value={compareAtPrice}
                  onChange={(e) => setCompareAtPrice(e.target.value)}
                  className={`${inputClass} font-mono`}
                />
              </div>
              <div>
                <label className={labelClass}>Stock Quantity</label>
                <input
                  type="number"
                  min="0"
                  placeholder="0"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  className={`${inputClass} font-mono`}
                />
              </div>
            </div>
          </div>

          {/* Product Images */}
          <div className={cardClass}>
            <h3
              className={`text-sm font-semibold mb-4 flex items-center gap-2 ${
                isLight ? "text-zinc-800" : "text-white"
              }`}
            >
              <ImageIcon size={16} className="text-[#D4AF37]" />
              Product Images
            </h3>
            <div className="space-y-3">
              {imageUrls.map((url, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className="flex-1 relative">
                    <input
                      type="url"
                      placeholder="https://images.unsplash.com/…"
                      value={url}
                      onChange={(e) => updateImageUrl(idx, e.target.value)}
                      className={`${inputClass} pr-10`}
                    />
                    {url.trim() && (
                      <div
                        className={`absolute right-2 top-1/2 -translate-y-1/2 w-6 h-6 rounded overflow-hidden border ${
                          isLight ? "border-zinc-200" : "border-zinc-700"
                        }`}
                      >
                        <Image
                          src={url}
                          alt="preview"
                          width={24}
                          height={24}
                          className="object-cover w-full h-full"
                          unoptimized
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = "none";
                          }}
                        />
                      </div>
                    )}
                  </div>
                  {imageUrls.length > 1 && (
                    <button
                      onClick={() => removeImageSlot(idx)}
                      className="p-2 rounded-lg text-zinc-400 hover:text-rose-500 hover:bg-rose-500/10 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              ))}
              <button
                onClick={addImageSlot}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border ${
                  isLight
                    ? "bg-zinc-50 hover:bg-zinc-100 text-zinc-600 border-zinc-200"
                    : "bg-[#1a1a1a] hover:bg-zinc-800 text-zinc-400 border-zinc-700"
                }`}
              >
                <Plus size={12} />
                Add another image
              </button>
            </div>

            {/* Image Previews */}
            {validImages.length > 0 && (
              <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
                {validImages.map((src, i) => (
                  <div
                    key={i}
                    className={`relative w-20 h-24 rounded-lg overflow-hidden border shrink-0 ${
                      isLight ? "border-zinc-200 bg-zinc-100" : "border-zinc-700 bg-zinc-800"
                    }`}
                  >
                    <Image
                      src={src}
                      alt={`Preview ${i + 1}`}
                      fill
                      className="object-cover"
                      sizes="80px"
                      unoptimized
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Variants: Sizes & Colors */}
          <div className={cardClass}>
            <h3
              className={`text-sm font-semibold mb-4 flex items-center gap-2 ${
                isLight ? "text-zinc-800" : "text-white"
              }`}
            >
              <Sparkles size={16} className="text-[#D4AF37]" />
              Variants
            </h3>

            {/* Sizes */}
            <div className="mb-5">
              <label className={labelClass}>Sizes</label>
              <div className="flex flex-wrap gap-2 mt-1">
                {SIZE_OPTIONS.map((size) => {
                  const active = selectedSizes.includes(size);
                  return (
                    <button
                      key={size}
                      onClick={() => toggleSize(size)}
                      className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                        active
                          ? "bg-[#D4AF37] text-black border-[#D4AF37] shadow-sm"
                          : isLight
                          ? "bg-zinc-50 text-zinc-600 border-zinc-200 hover:bg-zinc-100 hover:border-zinc-300"
                          : "bg-[#1a1a1a] text-zinc-400 border-zinc-700 hover:bg-zinc-800 hover:text-white"
                      }`}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Colors */}
            <div>
              <label className={labelClass}>Colors</label>
              <div className="flex flex-wrap gap-2 mt-1">
                {COLOR_PRESETS.map((color) => {
                  const active = selectedColors.some((c) => c.name === color.name);
                  return (
                    <button
                      key={color.name}
                      onClick={() => toggleColor(color)}
                      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${
                        active
                          ? "bg-[#D4AF37]/15 text-[#D4AF37] border-[#D4AF37]/50 shadow-sm"
                          : isLight
                          ? "bg-zinc-50 text-zinc-600 border-zinc-200 hover:bg-zinc-100"
                          : "bg-[#1a1a1a] text-zinc-400 border-zinc-700 hover:bg-zinc-800"
                      }`}
                    >
                      <span
                        className="w-3.5 h-3.5 rounded-full border border-zinc-300 shrink-0"
                        style={{ backgroundColor: color.hex }}
                      />
                      {color.name}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Merchandising & Badges */}
          <div className={cardClass}>
            <h3
              className={`text-sm font-semibold mb-4 flex items-center gap-2 ${
                isLight ? "text-zinc-800" : "text-white"
              }`}
            >
              <Tag size={16} className="text-[#D4AF37]" />
              Merchandising & Badges
            </h3>
            <div className="space-y-3">
              {[
                { label: "Featured Piece", value: isFeatured, setter: setIsFeatured, desc: "Highlighted in the featured collection" },
                { label: "New Arrival", value: isNew, setter: setIsNew, desc: "Shown with the 'New' badge" },
                { label: "Bestseller", value: isBestseller, setter: setIsBestseller, desc: "Marked as a bestselling item" },
              ].map((toggle) => (
                <div
                  key={toggle.label}
                  className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
                    isLight
                      ? "bg-zinc-50 border-zinc-200"
                      : "bg-[#0d0d0d] border-[#2b2b2b]"
                  }`}
                >
                  <div>
                    <p
                      className={`text-xs font-semibold ${
                        isLight ? "text-zinc-800" : "text-zinc-200"
                      }`}
                    >
                      {toggle.label}
                    </p>
                    <p className="text-[10px] text-zinc-500 mt-0.5">{toggle.desc}</p>
                  </div>
                  <button
                    onClick={() => toggle.setter(!toggle.value)}
                    className={`relative w-10 h-5 rounded-full transition-all duration-200 ${
                      toggle.value
                        ? "bg-[#D4AF37]"
                        : isLight
                        ? "bg-zinc-300"
                        : "bg-zinc-700"
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-200 ${
                        toggle.value ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Materials & Care */}
          <div className={cardClass}>
            <h3
              className={`text-sm font-semibold mb-4 ${
                isLight ? "text-zinc-800" : "text-white"
              }`}
            >
              Materials & Care
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Materials</label>
                <input
                  type="text"
                  placeholder="100% Mulberry Silk, Italian Wool"
                  value={materials}
                  onChange={(e) => setMaterials(e.target.value)}
                  className={inputClass}
                />
                <p className="text-[10px] text-zinc-500 mt-1">Comma-separated</p>
              </div>
              <div>
                <label className={labelClass}>Care Instructions</label>
                <input
                  type="text"
                  placeholder="Dry clean only, Store in cool place"
                  value={care}
                  onChange={(e) => setCare(e.target.value)}
                  className={inputClass}
                />
                <p className="text-[10px] text-zinc-500 mt-1">Comma-separated</p>
              </div>
            </div>
          </div>
        </div>

        {/* ── RIGHT COLUMN: Live Preview ── */}
        <div className="lg:col-span-1">
          <div className="sticky top-24">
            <div className={cardClass}>
              <h3
                className={`text-xs font-semibold mb-3 flex items-center gap-1.5 uppercase tracking-wider ${
                  isLight ? "text-zinc-500" : "text-zinc-400"
                }`}
              >
                <Eye size={12} />
                Live Preview
              </h3>

              {/* Product Card Preview */}
              <div
                className={`rounded-xl overflow-hidden border ${
                  isLight ? "border-zinc-200 bg-zinc-50" : "border-[#262626] bg-[#0d0d0d]"
                }`}
              >
                {/* Image */}
                <div
                  className={`relative aspect-[4/5] ${
                    isLight ? "bg-zinc-200" : "bg-zinc-800"
                  }`}
                >
                  {validImages.length > 0 ? (
                    <Image
                      src={validImages[0]}
                      alt="Product Preview"
                      fill
                      className="object-cover"
                      sizes="300px"
                      unoptimized
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                    />
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-zinc-400 gap-2">
                      <ImageIcon size={32} strokeWidth={1} />
                      <span className="text-[10px]">No image added yet</span>
                    </div>
                  )}

                  {/* Badges overlay */}
                  <div className="absolute top-2 left-2 flex flex-col gap-1">
                    {isNew && (
                      <span className="px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider bg-black/70 text-white backdrop-blur-sm rounded">
                        New
                      </span>
                    )}
                    {isBestseller && (
                      <span className="px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider bg-[#D4AF37]/90 text-black backdrop-blur-sm rounded">
                        Bestseller
                      </span>
                    )}
                    {isFeatured && (
                      <span className="px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider bg-purple-600/80 text-white backdrop-blur-sm rounded">
                        Featured
                      </span>
                    )}
                  </div>

                  {/* Discount badge */}
                  {compareAtPrice && Number(compareAtPrice) > Number(price) && (
                    <div className="absolute top-2 right-2">
                      <span className="px-2 py-0.5 text-[9px] font-bold bg-rose-500/90 text-white backdrop-blur-sm rounded">
                        -{Math.round(((Number(compareAtPrice) - Number(price)) / Number(compareAtPrice)) * 100)}%
                      </span>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="p-4 space-y-2">
                  <p className="text-[10px] uppercase tracking-[0.15em] text-[#D4AF37] font-semibold">
                    {brand || "LUMIÈRE"}
                  </p>
                  <h4
                    className={`text-sm font-serif ${
                      isLight ? "text-zinc-900" : "text-white"
                    }`}
                  >
                    {name || "Product Name"}
                  </h4>

                  {/* Price */}
                  <div className="flex items-baseline gap-2">
                    <span
                      className={`text-base font-bold ${
                        isLight ? "text-zinc-900" : "text-white"
                      }`}
                    >
                      ${price ? Number(price).toLocaleString() : "0"}
                    </span>
                    {compareAtPrice && Number(compareAtPrice) > 0 && (
                      <span className="text-xs text-zinc-500 line-through">
                        ${Number(compareAtPrice).toLocaleString()}
                      </span>
                    )}
                  </div>

                  {/* Colors */}
                  {selectedColors.length > 0 && (
                    <div className="flex items-center gap-1.5 pt-1">
                      {selectedColors.map((c) => (
                        <span
                          key={c.name}
                          className="w-4 h-4 rounded-full border border-zinc-300"
                          style={{ backgroundColor: c.hex }}
                          title={c.name}
                        />
                      ))}
                    </div>
                  )}

                  {/* Sizes */}
                  {selectedSizes.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {selectedSizes.map((s) => (
                        <span
                          key={s}
                          className={`px-2 py-0.5 rounded text-[10px] font-medium ${
                            isLight
                              ? "bg-zinc-100 text-zinc-700 border border-zinc-200"
                              : "bg-zinc-800 text-zinc-300 border border-zinc-700"
                          }`}
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Category */}
                  {category && (
                    <p className="text-[10px] text-zinc-500 capitalize pt-1">
                      {category}
                    </p>
                  )}
                </div>
              </div>

              {/* Summary Stats */}
              <div
                className={`mt-4 grid grid-cols-2 gap-2 text-[10px] ${
                  isLight ? "text-zinc-500" : "text-zinc-500"
                }`}
              >
                <div
                  className={`p-2 rounded-lg text-center ${
                    isLight ? "bg-zinc-50 border border-zinc-200" : "bg-[#0d0d0d] border border-[#2b2b2b]"
                  }`}
                >
                  <span className="block text-lg font-bold text-[#D4AF37]">
                    {selectedSizes.length}
                  </span>
                  Sizes
                </div>
                <div
                  className={`p-2 rounded-lg text-center ${
                    isLight ? "bg-zinc-50 border border-zinc-200" : "bg-[#0d0d0d] border border-[#2b2b2b]"
                  }`}
                >
                  <span className="block text-lg font-bold text-[#D4AF37]">
                    {selectedColors.length}
                  </span>
                  Colors
                </div>
                <div
                  className={`p-2 rounded-lg text-center ${
                    isLight ? "bg-zinc-50 border border-zinc-200" : "bg-[#0d0d0d] border border-[#2b2b2b]"
                  }`}
                >
                  <span className="block text-lg font-bold text-[#D4AF37]">
                    {validImages.length}
                  </span>
                  Images
                </div>
                <div
                  className={`p-2 rounded-lg text-center ${
                    isLight ? "bg-zinc-50 border border-zinc-200" : "bg-[#0d0d0d] border border-[#2b2b2b]"
                  }`}
                >
                  <span className="block text-lg font-bold text-[#D4AF37]">
                    {stock || "0"}
                  </span>
                  Stock
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
