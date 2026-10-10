import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProductCard from "@/components/product/ProductCard";
import Button from "@/components/ui/Button";
import HeroCarousel from "@/components/home/HeroCarousel";
import type { Product } from "@/types";
import styles from "./page.module.css";
import NewsletterForm from "./NewsletterForm";
import ALL_PRODUCTS from "@/data/products";

export default async function HomePage() {
  const featured = ALL_PRODUCTS.filter((p) => p.isFeatured).slice(0, 4);
  const newArrivals = ALL_PRODUCTS.filter((p) => p.isNew).slice(0, 4);
  const bestsellers = ALL_PRODUCTS.filter((p) => p.isBestseller).slice(0, 4);

  return (
    <>
      <Navbar />
      <main>
        {/* ── Hero ──────────────────────────────────────── */}
        <section className={styles.hero} aria-label="Hero">
          <div className={styles.heroImageWrapper}>
            <HeroCarousel />
          </div>
          <div className={styles.heroContent}>
            <p className={styles.heroEyebrow}>Spring / Summer 2026</p>
            <h1 className={styles.heroTitle}>
              The Art of
              <br />
              <em>Effortless</em> Elegance
            </h1>
            <p className={styles.heroSubtitle}>
              Curated pieces for those who appreciate the quiet luxury of exceptional quality.
            </p>
            <div className={styles.heroActions}>
              <Link href="/shop">
                <Button variant="gold" size="lg">
                  Explore Collection
                </Button>
              </Link>
              <Link href="/shop?filter=new">
                <Button variant="ghost" size="lg" className={styles.heroGhostBtn}>
                  New Arrivals
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* ── Fashion Bento Grid ────────────────────────── */}
        <section className={styles.bentoGrid} aria-label="Fashion editorial grid">
          <div className={styles.bentoInner}>

            {/* ── Row 1 ── */}
            <div className={styles.bentoRow}>

              {/* Cell 1 — Tall left: Evening wear */}
              <Link href="/shop?category=evening" className={`${styles.bentoCell} ${styles.bentoCellTall}`}>
                <Image
                  src="https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=800&h=1200&fit=crop"
                  alt="Evening Wear"
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  style={{ objectFit: "cover", objectPosition: "center top" }}
                />
                <div className={styles.bentoOverlay} />
                <div className={styles.bentoCellLabel}>
                  <span className={styles.bentoCellEyebrow}>Atelier</span>
                  <span className={styles.bentoCellTitle}>Evening Wear</span>
                </div>
              </Link>

              {/* Center collage column */}
              <div className={styles.bentoCenterCol}>

                {/* Cell 2 — Wide top: Summer dresses */}
                <Link href="/shop?category=summer" className={`${styles.bentoCell} ${styles.bentoCellWide}`}>
                  <Image
                    src="https://images.unsplash.com/photo-1572804013427-4d7ca7268217?w=1000&h=600&fit=crop"
                    alt="Summer Dresses"
                    fill
                    sizes="(max-width: 768px) 100vw, 40vw"
                    style={{ objectFit: "cover", objectPosition: "center 30%" }}
                  />
                  <div className={styles.bentoOverlay} />
                  <div className={styles.bentoCellLabel}>
                    <span className={styles.bentoCellEyebrow}>Spring / Summer 2026</span>
                    <span className={styles.bentoCellTitle}>Summer Dresses</span>
                  </div>
                </Link>

                {/* Bottom 2 small cells */}
                <div className={styles.bentoBottomRow}>

                  {/* Cell 3 — Casual dresses */}
                  <Link href="/shop?category=casual" className={`${styles.bentoCell} ${styles.bentoCellSm}`}>
                    <Image
                      src="https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=600&h=700&fit=crop"
                      alt="Casual Dresses"
                      fill
                      sizes="(max-width: 768px) 50vw, 20vw"
                      style={{ objectFit: "cover", objectPosition: "center top" }}
                    />
                    <div className={styles.bentoOverlay} />
                    <div className={styles.bentoCellLabel}>
                      <span className={styles.bentoCellEyebrow}>Everyday</span>
                      <span className={styles.bentoCellTitle}>Casual Dresses</span>
                    </div>
                  </Link>

                  {/* Cell 4 — Maxi dresses */}
                  <Link href="/shop?category=maxi" className={`${styles.bentoCell} ${styles.bentoCellSm}`}>
                    <Image
                      src="https://images.unsplash.com/photo-1612722432474-b971cdcea546?w=600&h=700&fit=crop"
                      alt="Maxi Dresses"
                      fill
                      sizes="(max-width: 768px) 50vw, 20vw"
                      style={{ objectFit: "cover", objectPosition: "center top" }}
                    />
                    <div className={styles.bentoOverlay} />
                    <div className={styles.bentoCellLabel}>
                      <span className={styles.bentoCellEyebrow}>Resort</span>
                      <span className={styles.bentoCellTitle}>Maxi Dresses</span>
                    </div>
                  </Link>

                </div>
              </div>

              {/* ── Right Vertical Line Column: Women Fashion Dresses ── */}
              <div className={styles.bentoVerticalCol}>

                {/* Vertical Cell A — Cocktail & Party Dresses */}
                <Link href="/shop?category=party" className={`${styles.bentoCell} ${styles.bentoCellVert}`}>
                  <Image
                    src="https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&h=1000&fit=crop"
                    alt="Cocktail Dresses"
                    fill
                    sizes="(max-width: 768px) 100vw, 25vw"
                    style={{ objectFit: "cover", objectPosition: "center top" }}
                  />
                  <div className={styles.bentoOverlay} />
                  <div className={styles.bentoCellLabel}>
                    <span className={styles.bentoCellEyebrow}>Soirée</span>
                    <span className={styles.bentoCellTitle}>Cocktail Dresses</span>
                  </div>
                </Link>

                {/* Vertical Cell B — Silk & Satin Gowns */}
                <Link href="/shop?category=dresses" className={`${styles.bentoCell} ${styles.bentoCellVert}`}>
                  <Image
                    src="https://images.unsplash.com/photo-1502716119720-b23a93e5fe1b?w=800&h=1000&fit=crop"
                    alt="Silk Gowns"
                    fill
                    sizes="(max-width: 768px) 100vw, 25vw"
                    style={{ objectFit: "cover", objectPosition: "center top" }}
                  />
                  <div className={styles.bentoOverlay} />
                  <div className={styles.bentoCellLabel}>
                    <span className={styles.bentoCellEyebrow}>Couture</span>
                    <span className={styles.bentoCellTitle}>Silk & Satin Gowns</span>
                  </div>
                </Link>

              </div>
            </div>

            {/* ── Row 2 — 3 equal cells ── */}
            <div className={styles.bentoRow3}>

              {/* Cell 5 — Wrap dresses */}
              <Link href="/shop?category=wrap" className={`${styles.bentoCell} ${styles.bentoCellMd}`}>
                <Image
                  src="https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=700&h=700&fit=crop"
                  alt="Wrap Dresses"
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  style={{ objectFit: "cover", objectPosition: "center top" }}
                />
                <div className={styles.bentoOverlay} />
                <div className={styles.bentoCellLabel}>
                  <span className={styles.bentoCellEyebrow}>Chic</span>
                  <span className={styles.bentoCellTitle}>Wrap Dresses</span>
                </div>
              </Link>

              {/* Cell 6 — Bodycon dresses */}
              <Link href="/shop?category=bodycon" className={`${styles.bentoCell} ${styles.bentoCellMd}`}>
                <Image
                  src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=700&h=700&fit=crop"
                  alt="Bodycon Dresses"
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  style={{ objectFit: "cover", objectPosition: "center top" }}
                />
                <div className={styles.bentoOverlay} />
                <div className={styles.bentoCellLabel}>
                  <span className={styles.bentoCellEyebrow}>Bold</span>
                  <span className={styles.bentoCellTitle}>Bodycon Dresses</span>
                </div>
              </Link>

              {/* Cell 7 — Boho dresses */}
              <Link href="/shop?category=boho" className={`${styles.bentoCell} ${styles.bentoCellMd}`}>
                <Image
                  src="https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=700&h=700&fit=crop"
                  alt="Boho Dresses"
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  style={{ objectFit: "cover", objectPosition: "center top" }}
                />
                <div className={styles.bentoOverlay} />
                <div className={styles.bentoCellLabel}>
                  <span className={styles.bentoCellEyebrow}>Free Spirit</span>
                  <span className={styles.bentoCellTitle}>Boho Dresses</span>
                </div>
              </Link>

            </div>

          </div>
        </section>

        {/* ── Category tiles ────────────────────────────── */}
        <section className={styles.categories} aria-labelledby="categories-heading">
          <div className={styles.container}>
            <h2 className={styles.srOnly} id="categories-heading">Shop by category</h2>
            <div className={styles.categoryGrid}>
              {[
                { label: "Mini Dresses", href: "/shop?category=mini", img: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=600&h=750&fit=crop" },
                { label: "Floral Dresses", href: "/shop?category=floral", img: "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=600&h=750&fit=crop" },
                { label: "Party Dresses", href: "/shop?category=party", img: "https://images.unsplash.com/photo-1551803091-e20673f15770?w=600&h=750&fit=crop" },
              ].map((cat) => (
                <Link key={cat.label} href={cat.href} className={styles.categoryTile}>
                  <div className={styles.categoryImageWrapper}>
                    <Image
                      src={cat.img}
                      alt={cat.label}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      style={{ objectFit: "cover" }}
                    />
                    <div className={styles.categoryOverlay} aria-hidden="true" />
                  </div>
                  <div className={styles.categoryLabel}>
                    <span>{cat.label}</span>
                    <ArrowRight size={16} aria-hidden="true" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── Featured products ─────────────────────────── */}
        <section className={styles.productSection} aria-labelledby="featured-heading">
          <div className={styles.container}>
            <div className={styles.sectionHeader}>
              <div>
                <p className={styles.sectionEyebrow}>Curated Picks</p>
                <h2 className={styles.sectionTitle} id="featured-heading">Featured Pieces</h2>
              </div>
              <Link href="/shop" className={styles.sectionLink}>
                View all <ArrowRight size={14} aria-hidden="true" />
              </Link>
            </div>
            <div className={styles.productGrid}>
              {featured.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        </section>

        {/* ── Editorial banner ──────────────────────────── */}
        <section className={styles.editorial} aria-labelledby="editorial-heading">
          <div className={styles.editorialImageWrapper}>
            <Image
              src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1600&h=700&fit=crop"
              alt="Lumière — The Resort 2026 Collection"
              fill
              style={{ objectFit: "cover" }}
              sizes="100vw"
            />
            <div className={styles.editorialOverlay} aria-hidden="true" />
          </div>
          <div className={styles.editorialContent}>
            <p className={styles.heroEyebrow}>Resort 2026</p>
            <h2 className={styles.editorialTitle} id="editorial-heading">
              Escape to the Extraordinary
            </h2>
            <Link href="/shop?collection=resort26">
              <Button variant="outline" size="lg" className={styles.editorialBtn}>
                Discover Resort
              </Button>
            </Link>
          </div>
        </section>

        {/* ── New arrivals ──────────────────────────────── */}
        {newArrivals.length > 0 && (
          <section className={styles.productSection} aria-labelledby="new-heading">
            <div className={styles.container}>
              <div className={styles.sectionHeader}>
                <div>
                  <p className={styles.sectionEyebrow}>Just In</p>
                  <h2 className={styles.sectionTitle} id="new-heading">New Arrivals</h2>
                </div>
                <Link href="/shop?filter=new" className={styles.sectionLink}>
                  View all <ArrowRight size={14} aria-hidden="true" />
                </Link>
              </div>
              <div className={styles.productGrid}>
                {newArrivals.map((p) => <ProductCard key={p.id} product={p} />)}
              </div>
            </div>
          </section>
        )}

        {/* ── Bestsellers ───────────────────────────────── */}
        {bestsellers.length > 0 && (
          <section className={[styles.productSection, styles["productSection--tinted"]].join(" ")} aria-labelledby="bestsellers-heading">
            <div className={styles.container}>
              <div className={styles.sectionHeader}>
                <div>
                  <p className={styles.sectionEyebrow}>Most Loved</p>
                  <h2 className={styles.sectionTitle} id="bestsellers-heading">Bestsellers</h2>
                </div>
                <Link href="/shop?filter=bestselling" className={styles.sectionLink}>
                  View all <ArrowRight size={14} aria-hidden="true" />
                </Link>
              </div>
              <div className={styles.productGrid}>
                {bestsellers.map((p) => <ProductCard key={p.id} product={p} />)}
              </div>
            </div>
          </section>
        )}

        {/* ── Values strip ──────────────────────────────── */}
        <section className={styles.values} aria-label="Our values">
          <div className={styles.container}>
            <div className={styles.valuesGrid}>
              {[
                { title: "Exceptional Quality", desc: "Every piece crafted from the finest materials, built to last a lifetime." },
                { title: "Complimentary Shipping", desc: "Free shipping on all orders over $150. Free returns within 30 days." },
                { title: "Sustainable Luxury", desc: "Thoughtfully sourced. Responsibly made. Because quality and ethics coexist." },
                { title: "Personal Styling", desc: "Our team of stylists is available to help you find your perfect look." },
              ].map((v) => (
                <div key={v.title} className={styles.valueCard}>
                  <div className={styles.valueDivider} aria-hidden="true" />
                  <h3 className={styles.valueTitle}>{v.title}</h3>
                  <p className={styles.valueDesc}>{v.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Newsletter ────────────────────────────────── */}
        <section className={styles.newsletter} aria-labelledby="newsletter-heading">
          <div className={styles.container}>
            <div className={styles.newsletterInner}>
              <div>
                <h2 className={styles.newsletterTitle} id="newsletter-heading">
                  Stay in the Know
                </h2>
                <p className={styles.newsletterDesc}>
                  Be the first to discover new collections, exclusive offers, and styling inspiration.
                </p>
              </div>
              <NewsletterForm />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
