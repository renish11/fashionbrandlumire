"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, Eye, Sparkles, Plus } from "lucide-react";
import { products } from "@/data/products";
import type { Product } from "@/types";
import { useTheme } from "@/context/ThemeContext";

export default function AdminProductsPage() {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const { theme } = useTheme();
  const isLight = theme === "light";

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchSearch =
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.sku.toLowerCase().includes(search.toLowerCase()) ||
        p.category.toLowerCase().includes(search.toLowerCase());
      const matchCategory = categoryFilter ? p.category === categoryFilter : true;
      return matchSearch && matchCategory;
    });
  }, [search, categoryFilter]);

  const categories = ["dresses", "tops", "trousers", "outerwear"];

  return (
    <div className="space-y-6">
      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1
            className={`text-2xl font-serif tracking-wide ${
              isLight ? "text-zinc-900" : "text-white"
            }`}
          >
            Product Catalog
          </h1>
          <p
            className={`text-xs mt-1 ${
              isLight ? "text-zinc-500" : "text-zinc-400"
            }`}
          >
            Manage women&apos;s luxury apparel, pricing, variants, and stock.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span
            className={`text-xs px-3 py-2 rounded-lg border font-medium ${
              isLight
                ? "bg-white text-zinc-700 border-zinc-200 shadow-sm"
                : "bg-[#161616] text-zinc-400 border-[#262626]"
            }`}
          >
            Total:{" "}
            <strong className={isLight ? "text-amber-800 font-bold" : "text-[#D4AF37]"}>
              {products.length}
            </strong>{" "}
            items
          </span>
          <Link
            href="/admin/products/new"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all bg-[#D4AF37] text-black hover:bg-[#c5a030] shadow-md hover:shadow-lg"
          >
            <Plus size={14} strokeWidth={2.5} />
            Add New Product
          </Link>
        </div>
      </div>

      {/* ── Filter & Search Toolbar ── */}
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
            placeholder="Search piece name or SKU..."
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
            onClick={() => setCategoryFilter("")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all shrink-0 ${
              categoryFilter === ""
                ? "bg-[#D4AF37] text-black font-semibold shadow-sm"
                : isLight
                ? "bg-zinc-100 text-zinc-700 hover:text-zinc-950 hover:bg-zinc-200 border border-zinc-200"
                : "bg-zinc-800/80 text-zinc-400 hover:text-white border border-zinc-700/60"
            }`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all shrink-0 ${
                categoryFilter === cat
                  ? "bg-[#D4AF37] text-black font-semibold shadow-sm"
                  : isLight
                  ? "bg-zinc-100 text-zinc-700 hover:text-zinc-950 hover:bg-zinc-200 border border-zinc-200"
                  : "bg-zinc-800/80 text-zinc-400 hover:text-white border border-zinc-700/60"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* ── Products Table ── */}
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
                <th className="py-3 px-4 font-medium">Piece</th>
                <th className="py-3 px-4 font-medium">Category</th>
                <th className="py-3 px-4 font-medium">Price</th>
                <th className="py-3 px-4 font-medium">Stock</th>
                <th className="py-3 px-4 font-medium">Badges</th>
                <th className="py-3 px-4 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody
              className={`divide-y ${
                isLight ? "divide-zinc-200" : "divide-[#202020]"
              }`}
            >
              {filteredProducts.map((p) => (
                <tr
                  key={p.id}
                  className={`transition-colors ${
                    isLight ? "hover:bg-zinc-50/80" : "hover:bg-white/[0.02]"
                  }`}
                >
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`relative w-12 h-14 rounded-md overflow-hidden shrink-0 border ${
                          isLight
                            ? "bg-zinc-100 border-zinc-200"
                            : "bg-zinc-800 border-zinc-700"
                        }`}
                      >
                        <Image
                          src={p.images[0]?.src || ""}
                          alt={p.name}
                          fill
                          className="object-cover"
                          sizes="48px"
                        />
                      </div>
                      <div>
                        <div
                          className={`font-semibold text-sm ${
                            isLight ? "text-zinc-950" : "text-white"
                          }`}
                        >
                          {p.name}
                        </div>
                        <div
                          className={`font-mono text-[11px] ${
                            isLight ? "text-zinc-500" : "text-zinc-500"
                          }`}
                        >
                          {p.sku}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td
                    className={`py-3 px-4 capitalize ${
                      isLight ? "text-zinc-700" : "text-zinc-300"
                    }`}
                  >
                    {p.category}
                  </td>

                  <td className="py-3 px-4">
                    <span
                      className={`font-bold ${
                        isLight ? "text-zinc-950" : "text-white"
                      }`}
                    >
                      ${p.price.toLocaleString()}
                    </span>
                    {p.compareAtPrice && (
                      <span className="ml-2 text-zinc-500 line-through text-[11px]">
                        ${p.compareAtPrice.toLocaleString()}
                      </span>
                    )}
                  </td>

                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex items-center gap-1.5 font-mono text-xs font-medium ${
                        p.stock > 10
                          ? isLight
                            ? "text-emerald-700"
                            : "text-emerald-400"
                          : p.stock > 0
                          ? isLight
                            ? "text-amber-700"
                            : "text-amber-400"
                          : "text-rose-600"
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          p.stock > 10
                            ? "bg-emerald-500"
                            : p.stock > 0
                            ? "bg-amber-500"
                            : "bg-rose-500"
                        }`}
                      ></span>
                      {p.stock} units
                    </span>
                  </td>

                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1.5">
                      {p.isFeatured && (
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-medium tracking-wide ${
                            isLight
                              ? "bg-amber-100 text-amber-900 border border-amber-300 font-semibold"
                              : "bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/30"
                          }`}
                        >
                          Featured
                        </span>
                      )}
                      {p.isBestseller && (
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-medium tracking-wide ${
                            isLight
                              ? "bg-purple-100 text-purple-900 border border-purple-300 font-semibold"
                              : "bg-purple-950/40 text-purple-400 border border-purple-800/40"
                          }`}
                        >
                          Bestseller
                        </span>
                      )}
                      {p.isNew && (
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-medium tracking-wide ${
                            isLight
                              ? "bg-blue-100 text-blue-900 border border-blue-300 font-semibold"
                              : "bg-blue-950/40 text-blue-400 border border-blue-800/40"
                          }`}
                        >
                          New
                        </span>
                      )}
                    </div>
                  </td>

                  <td className="py-3 px-4 text-right">
                    <a
                      href={`http://localhost:3000/product/${p.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-colors border ${
                        isLight
                          ? "bg-zinc-100 hover:bg-zinc-200 text-zinc-800 border-zinc-200"
                          : "bg-[#181818] hover:bg-zinc-800 text-zinc-300 hover:text-white border-zinc-700"
                      }`}
                    >
                      <Eye size={12} />
                      <span>Preview</span>
                    </a>
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
