import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProductCard from "@/components/product/ProductCard";
import Button from "@/components/ui/Button";
import { getFeaturedProducts, getNewProducts, getBestsellerProducts } from "@/data/products";
import styles from "./page.module.css";
import NewsletterForm from "./NewsletterForm";

export default function HomePage() {
  const featured = getFeaturedProducts().slice(0, 4);
  const newArrivals = getNewProducts().slice(0, 4);
  const bestsellers = getBestsellerProducts().slice(0, 4);

  return (
    <>
      <Navbar />
      <main>
        {/* ── Hero ──────────────────────────────────────── */}
        <section className={styles.hero} aria-label="Hero">
          <div className={styles.heroImageWrapper}>
            <Image
              src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1800&h=900&fit=crop"
              alt="Lumière Spring Summer 2026 Collection"
              fill
              style={{ objectFit: "cover" }}
              priority
              sizes="100vw"
            />
            <div className={styles.heroOverlay} aria-hidden="true" />
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

        {/* ── Category tiles ────────────────────────────── */}
        <section className={styles.categories} aria-labelledby="categories-heading">
          <div className={styles.container}>
            <h2 className={styles.srOnly} id="categories-heading">Shop by category</h2>
            <div className={styles.categoryGrid}>
              {[
                { label: "Women", href: "/shop?category=women", img: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=600&h=750&fit=crop" },
                { label: "Men", href: "/shop?category=men", img: "https://images.unsplash.com/photo-1594938298603-c8148c4b4d3e?w=600&h=750&fit=crop" },
                { label: "Accessories", href: "/shop?category=accessories", img: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&h=750&fit=crop" },
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
