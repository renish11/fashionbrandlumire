"use client";

import { Suspense, useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { SlidersHorizontal, X, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Breadcrumb from "@/components/ui/Breadcrumb";
import ProductCard from "@/components/product/ProductCard";
import EmptyState from "@/components/ui/EmptyState";
import Button from "@/components/ui/Button";
import { products } from "@/data/products";
import { SORT_OPTIONS, CURRENCY_SYMBOL } from "@/constants";
import styles from "./page.module.css";

const CATEGORIES = [
  { label: "All", value: "" },
  { label: "Dresses", value: "dresses" },
  { label: "Tops", value: "tops" },
  { label: "Trousers", value: "trousers" },
  { label: "Outerwear", value: "outerwear" },
  { label: "Accessories", value: "accessories" },
];

const COLORS = [
  { name: "Black", hex: "#000000" },
  { name: "White", hex: "#FFFFFF" },
  { name: "Ivory", hex: "#FFFFF0" },
  { name: "Camel", hex: "#C19A6B" },
  { name: "Ecru", hex: "#F5F5DC" },
  { name: "Blush", hex: "#FFB6C1" },
];

const SIZES = ["XS", "S", "M", "L", "XL", "XXL"];

export default function ShopPage() {
  return (
    <Suspense fallback={null}>
      <ShopContent />
    </Suspense>
  );
}

function ShopContent() {
  const searchParams = useSearchParams();
  const urlCategory = searchParams.get("category") ?? "";
  const urlFilter = searchParams.get("filter") ?? "";
  const urlCollection = searchParams.get("collection") ?? "";

  const [category, setCategory] = useState(urlCategory);
  const [sortBy, setSortBy] = useState("featured");
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [priceMax, setPriceMax] = useState(1500);
  const [filterOpen, setFilterOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);

  const toggleColor = (name: string) =>
    setSelectedColors((prev) =>
      prev.includes(name) ? prev.filter((c) => c !== name) : [...prev, name]
    );

  const toggleSize = (size: string) =>
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );

  const filtered = useMemo(() => {
    let result = [...products];

    // URL-based filters
    if (urlFilter === "new") result = result.filter((p) => p.isNew);
    if (urlFilter === "sale") result = result.filter((p) => p.compareAtPrice);
    if (urlCollection) result = result.filter((p) => p.collectionId === urlCollection);

    // Sidebar filters
    if (category) result = result.filter((p) => p.category === category);
    if (selectedColors.length)
      result = result.filter((p) =>
        p.colors.some((c) => selectedColors.includes(c.name))
      );
    if (selectedSizes.length)
      result = result.filter((p) =>
        p.sizes.some((s) => selectedSizes.includes(s))
      );
    result = result.filter((p) => p.price <= priceMax);

    // Sort
    switch (sortBy) {
      case "newest":
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case "price-asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "bestselling":
        result.sort((a, b) => (b.isBestseller ? 1 : 0) - (a.isBestseller ? 1 : 0));
        break;
      case "rating":
        result.sort((a, b) => b.rating - a.rating);
        break;
      default: // featured
        result.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
    }

    return result;
  }, [category, selectedColors, selectedSizes, priceMax, sortBy, urlFilter, urlCollection]);

  const activeFilterCount =
    (category ? 1 : 0) +
    selectedColors.length +
    selectedSizes.length +
    (priceMax < 1500 ? 1 : 0);

  const clearAll = () => {
    setCategory("");
    setSelectedColors([]);
    setSelectedSizes([]);
    setPriceMax(1500);
  };

  const pageTitle =
    urlFilter === "new"
      ? "New Arrivals"
      : urlFilter === "sale"
      ? "Sale"
      : urlCollection
      ? "Collection"
      : "All Collections";

  return (
    <>
      <Navbar />
      <main className={styles.main}>
        <div className={styles.container}>
          <Breadcrumb items={[{ label: "Home", href: "/" }, { label: pageTitle }]} />

          {/* Page header */}
          <div className={styles.header}>
            <h1 className={styles.title}>{pageTitle}</h1>
            <p className={styles.count}>{filtered.length} pieces</p>
          </div>

          {/* Toolbar */}
          <div className={styles.toolbar}>
            <button
              className={[styles.toolbarBtn, filterOpen ? styles["toolbarBtn--active"] : ""].join(" ")}
              onClick={() => setFilterOpen((v) => !v)}
              aria-expanded={filterOpen}
              aria-controls="filter-panel"
            >
              <SlidersHorizontal size={16} aria-hidden="true" />
              Filters
              {activeFilterCount > 0 && (
                <span className={styles.filterBadge}>{activeFilterCount}</span>
              )}
            </button>

            {/* Active filter chips */}
            <div className={styles.chips} aria-label="Active filters">
              {category && (
                <button className={styles.chip} onClick={() => setCategory("")}>
                  {CATEGORIES.find((c) => c.value === category)?.label}
                  <X size={12} aria-hidden="true" />
                </button>
              )}
              {selectedColors.map((c) => (
                <button key={c} className={styles.chip} onClick={() => toggleColor(c)}>
                  {c} <X size={12} aria-hidden="true" />
                </button>
              ))}
              {selectedSizes.map((s) => (
                <button key={s} className={styles.chip} onClick={() => toggleSize(s)}>
                  {s} <X size={12} aria-hidden="true" />
                </button>
              ))}
              {activeFilterCount > 0 && (
                <button className={styles.clearChip} onClick={clearAll}>
                  Clear all
                </button>
              )}
            </div>

            {/* Sort */}
            <div className={styles.sortWrapper}>
              <button
                className={styles.toolbarBtn}
                onClick={() => setSortOpen((v) => !v)}
                aria-haspopup="listbox"
                aria-expanded={sortOpen}
              >
                {SORT_OPTIONS.find((o) => o.value === sortBy)?.label ?? "Sort"}
                <ChevronDown size={14} aria-hidden="true" />
              </button>
              <AnimatePresence>
                {sortOpen && (
                  <motion.ul
                    className={styles.sortMenu}
                    role="listbox"
                    aria-label="Sort options"
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.15 }}
                  >
                    {SORT_OPTIONS.map((opt) => (
                      <li key={opt.value}>
                        <button
                          className={[
                            styles.sortOption,
                            sortBy === opt.value ? styles["sortOption--active"] : "",
                          ].join(" ")}
                          role="option"
                          aria-selected={sortBy === opt.value}
                          onClick={() => { setSortBy(opt.value); setSortOpen(false); }}
                        >
                          {opt.label}
                        </button>
                      </li>
                    ))}
                  </motion.ul>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className={styles.body}>
            {/* ── Filter sidebar ─────────────────────────── */}
            <AnimatePresence>
              {filterOpen && (
                <motion.aside
                  id="filter-panel"
                  className={styles.sidebar}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  aria-label="Filters"
                >
                  {/* Category */}
                  <div className={styles.filterGroup}>
                    <h3 className={styles.filterGroupTitle}>Category</h3>
                    <ul className={styles.filterList}>
                      {CATEGORIES.map((cat) => (
                        <li key={cat.value}>
                          <button
                            className={[
                              styles.filterOption,
                              category === cat.value ? styles["filterOption--active"] : "",
                            ].join(" ")}
                            onClick={() => setCategory(cat.value)}
                            aria-pressed={category === cat.value}
                          >
                            {cat.label}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Color */}
                  <div className={styles.filterGroup}>
                    <h3 className={styles.filterGroupTitle}>Colour</h3>
                    <div className={styles.colorGrid} role="group" aria-label="Filter by colour">
                      {COLORS.map((col) => (
                        <label
                          key={col.name}
                          className={[
                            styles.colorFilterOption,
                            selectedColors.includes(col.name) ? styles["colorFilterOption--selected"] : "",
                          ].join(" ")}
                          title={col.name}
                        >
                          <input
                            type="checkbox"
                            checked={selectedColors.includes(col.name)}
                            onChange={() => toggleColor(col.name)}
                            className={styles.srOnly}
                            aria-label={col.name}
                          />
                          <span
                            className={styles.colorFilterSwatch}
                            style={{ backgroundColor: col.hex, border: col.hex === "#FFFFFF" ? "1px solid #ddd" : "none" }}
                          />
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Size */}
                  <div className={styles.filterGroup}>
                    <h3 className={styles.filterGroupTitle}>Size</h3>
                    <div className={styles.sizeGrid} role="group" aria-label="Filter by size">
                      {SIZES.map((size) => (
                        <label
                          key={size}
                          className={[
                            styles.sizeFilterOption,
                            selectedSizes.includes(size) ? styles["sizeFilterOption--selected"] : "",
                          ].join(" ")}
                        >
                          <input
                            type="checkbox"
                            checked={selectedSizes.includes(size)}
                            onChange={() => toggleSize(size)}
                            className={styles.srOnly}
                            aria-label={size}
                          />
                          {size}
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Price */}
                  <div className={styles.filterGroup}>
                    <h3 className={styles.filterGroupTitle}>
                      Max Price: <strong>{CURRENCY_SYMBOL}{priceMax.toLocaleString()}</strong>
                    </h3>
                    <input
                      type="range"
                      min={50}
                      max={1500}
                      step={50}
                      value={priceMax}
                      onChange={(e) => setPriceMax(Number(e.target.value))}
                      className={styles.priceRange}
                      aria-label={`Maximum price: ${CURRENCY_SYMBOL}${priceMax}`}
                    />
                    <div className={styles.priceLabels}>
                      <span>{CURRENCY_SYMBOL}50</span>
                      <span>{CURRENCY_SYMBOL}1,500</span>
                    </div>
                  </div>

                  {activeFilterCount > 0 && (
                    <Button variant="ghost" size="sm" fullWidth onClick={clearAll}>
                      Clear All Filters
                    </Button>
                  )}
                </motion.aside>
              )}
            </AnimatePresence>

            {/* ── Product grid ───────────────────────────── */}
            <div className={[styles.grid, filterOpen ? styles["grid--narrow"] : ""].join(" ")}>
              {filtered.length === 0 ? (
                <div className={styles.emptyWrapper}>
                  <EmptyState
                    title="No products found"
                    description="Try adjusting your filters to see more results."
                    action={
                      <Button variant="outline" size="md" onClick={clearAll}>
                        Clear Filters
                      </Button>
                    }
                  />
                </div>
              ) : (
                <AnimatePresence mode="popLayout">
                  {filtered.map((product, i) => (
                    <motion.div
                      key={product.id}
                      layout
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.97 }}
                      transition={{ duration: 0.22, delay: i * 0.03 }}
                    >
                      <ProductCard product={product} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
