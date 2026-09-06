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

// Inline products — no backend needed
const ALL_PRODUCTS: Product[] = [
  { id:"p1", slug:"silk-maxi-dress-ivory", name:"Silk Maxi Dress", brand:"Lumière", description:"Flowing silk maxi dress with a delicate ivory finish.", longDescription:"", price:485, compareAtPrice:620, images:[{id:"i1",src:"https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=800&h=1000&fit=crop",alt:"Silk Maxi Dress",width:800,height:1000}], category:"dresses", collectionId:"ss26", tags:["silk","maxi"], colors:[{name:"Ivory",hex:"#FFFFF0"}], sizes:["XS","S","M","L","XL"], variants:[], reviews:[], rating:4.7, reviewCount:24, isFeatured:true, isNew:false, isBestseller:true, stock:14, materials:[], care:[], sku:"LUM-SMD-001", createdAt:"2026-01-15" },
  { id:"p2", slug:"floral-wrap-dress-red", name:"Floral Wrap Dress", brand:"Lumière", description:"Vibrant floral-print wrap dress in lightweight crepe.", longDescription:"", price:320, compareAtPrice:395, images:[{id:"i1",src:"https://images.unsplash.com/photo-1572804013427-4d7ca7268217?w=800&h=1000&fit=crop",alt:"Floral Wrap Dress",width:800,height:1000}], category:"dresses", collectionId:"ss26", tags:["floral","wrap"], colors:[{name:"Red Floral",hex:"#C0392B"}], sizes:["XS","S","M","L","XL"], variants:[], reviews:[], rating:4.8, reviewCount:19, isFeatured:true, isNew:true, isBestseller:false, stock:18, materials:[], care:[], sku:"LUM-FWD-001", createdAt:"2026-03-20" },
  { id:"p3", slug:"bodycon-midi-dress-black", name:"Bodycon Midi Dress", brand:"Lumière", description:"Sleek bodycon midi dress in stretch jersey.", longDescription:"", price:285, compareAtPrice:undefined, images:[{id:"i1",src:"https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&h=1000&fit=crop",alt:"Bodycon Midi Dress",width:800,height:1000}], category:"dresses", collectionId:"ss26", tags:["bodycon"], colors:[{name:"Black",hex:"#000000"}], sizes:["XS","S","M","L","XL"], variants:[], reviews:[], rating:4.6, reviewCount:32, isFeatured:false, isNew:false, isBestseller:true, stock:21, materials:[], care:[], sku:"LUM-BMD-001", createdAt:"2025-11-10" },
  { id:"p4", slug:"boho-maxi-dress-sage", name:"Boho Maxi Dress", brand:"Lumière", description:"Free-spirited boho maxi dress in sage green.", longDescription:"", price:275, compareAtPrice:340, images:[{id:"i1",src:"https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=800&h=1000&fit=crop",alt:"Boho Maxi Dress",width:800,height:1000}], category:"dresses", collectionId:"resort26", tags:["boho","maxi"], colors:[{name:"Sage",hex:"#9DC183"}], sizes:["XS","S","M","L","XL"], variants:[], reviews:[], rating:4.9, reviewCount:28, isFeatured:true, isNew:true, isBestseller:true, stock:17, materials:[], care:[], sku:"LUM-BHM-001", createdAt:"2026-04-15" },
  { id:"p5", slug:"velvet-slip-dress-emerald", name:"Velvet Slip Dress", brand:"Lumière", description:"Luxurious velvet slip dress in deep emerald.", longDescription:"", price:420, compareAtPrice:520, images:[{id:"i1",src:"https://images.unsplash.com/photo-1551803091-e20673f15770?w=800&h=1000&fit=crop",alt:"Velvet Slip Dress",width:800,height:1000}], category:"dresses", collectionId:"aw25", tags:["velvet","evening"], colors:[{name:"Emerald",hex:"#50C878"}], sizes:["XS","S","M","L"], variants:[], reviews:[], rating:4.9, reviewCount:22, isFeatured:true, isNew:false, isBestseller:true, stock:12, materials:[], care:[], sku:"LUM-VSD-001", createdAt:"2025-10-05" },
  { id:"p6", slug:"merino-ribbed-turtleneck", name:"Merino Ribbed Turtleneck", brand:"Lumière", description:"Finest merino wool ribbed turtleneck.", longDescription:"", price:195, compareAtPrice:undefined, images:[{id:"i1",src:"https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&h=1000&fit=crop",alt:"Merino Turtleneck",width:800,height:1000}], category:"tops", collectionId:"aw25", tags:["merino","knitwear"], colors:[{name:"Camel",hex:"#C19A6B"}], sizes:["XS","S","M","L","XL"], variants:[], reviews:[], rating:4.8, reviewCount:31, isFeatured:true, isNew:false, isBestseller:true, stock:25, materials:[], care:[], sku:"LUM-MRT-001", createdAt:"2025-09-15" },
  { id:"p7", slug:"cashmere-coat-camel", name:"Cashmere Blend Coat", brand:"Lumière", description:"Double-faced cashmere coat in warm camel.", longDescription:"", price:1250, compareAtPrice:undefined, images:[{id:"i1",src:"https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=800&h=1000&fit=crop",alt:"Cashmere Coat",width:800,height:1000}], category:"outerwear", collectionId:"aw25", tags:["cashmere","coat"], colors:[{name:"Camel",hex:"#C19A6B"}], sizes:["XS","S","M","L","XL"], variants:[], reviews:[], rating:4.9, reviewCount:18, isFeatured:true, isNew:false, isBestseller:true, stock:7, materials:[], care:[], sku:"LUM-CCT-001", createdAt:"2025-10-01" },
  { id:"p8", slug:"classic-trench-coat-beige", name:"Classic Trench Coat", brand:"Lumière", description:"The iconic trench coat in cotton gabardine.", longDescription:"", price:785, compareAtPrice:940, images:[{id:"i1",src:"https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=800&h=1000&fit=crop",alt:"Classic Trench Coat",width:800,height:1000}], category:"outerwear", collectionId:"ss26", tags:["trench","coat"], colors:[{name:"Beige",hex:"#F5F5DC"}], sizes:["XS","S","M","L","XL"], variants:[], reviews:[], rating:4.8, reviewCount:24, isFeatured:true, isNew:false, isBestseller:true, stock:12, materials:[], care:[], sku:"LUM-CTC-001", createdAt:"2026-01-05" },
  { id:"p9", slug:"satin-party-dress-rose", name:"Satin Party Dress", brand:"Lumière", description:"Sleek satin midi dress with a plunge neckline.", longDescription:"", price:365, compareAtPrice:440, images:[{id:"i1",src:"https://images.unsplash.com/photo-1612722432474-b971cdcea546?w=800&h=1000&fit=crop",alt:"Satin Party Dress",width:800,height:1000}], category:"dresses", collectionId:"ss26", tags:["satin","party"], colors:[{name:"Rose",hex:"#FF007F"}], sizes:["XS","S","M","L","XL"], variants:[], reviews:[], rating:4.6, reviewCount:17, isFeatured:false, isNew:true, isBestseller:false, stock:14, materials:[], care:[], sku:"LUM-SPD-001", createdAt:"2026-02-28" },
  { id:"p10", slug:"maxi-evening-gown-black", name:"Maxi Evening Gown", brand:"Lumière", description:"Floor-sweeping column gown in stretch crepe.", longDescription:"", price:895, compareAtPrice:undefined, images:[{id:"i1",src:"https://images.unsplash.com/photo-1583744946564-b52ac1c389c8?w=800&h=1000&fit=crop",alt:"Maxi Evening Gown",width:800,height:1000}], category:"dresses", collectionId:"ss26", tags:["gown","evening"], colors:[{name:"Black",hex:"#000000"}], sizes:["XS","S","M","L"], variants:[], reviews:[], rating:5.0, reviewCount:8, isFeatured:true, isNew:false, isBestseller:false, stock:9, materials:[], care:[], sku:"LUM-MEG-001", createdAt:"2026-02-20" },
  { id:"p11", slug:"casual-sundress-yellow", name:"Casual Sundress", brand:"Lumière", description:"Bright and breezy sundress in butter yellow cotton.", longDescription:"", price:165, compareAtPrice:210, images:[{id:"i1",src:"https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=800&h=1000&fit=crop",alt:"Casual Sundress",width:800,height:1000}], category:"dresses", collectionId:"ss26", tags:["casual","sundress"], colors:[{name:"Butter Yellow",hex:"#FFFD82"}], sizes:["XS","S","M","L","XL"], variants:[], reviews:[], rating:4.7, reviewCount:36, isFeatured:false, isNew:false, isBestseller:true, stock:30, materials:[], care:[], sku:"LUM-CSD-001", createdAt:"2026-01-20" },
  { id:"p12", slug:"ribbed-knit-midi-dress-chocolate", name:"Ribbed Knit Midi Dress", brand:"Lumière", description:"A sculpted ribbed knit midi dress in chocolate brown.", longDescription:"", price:355, compareAtPrice:425, images:[{id:"i1",src:"https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=800&h=1000&fit=crop",alt:"Ribbed Knit Midi Dress",width:800,height:1000}], category:"dresses", collectionId:"aw25", tags:["knit","midi"], colors:[{name:"Chocolate",hex:"#7B3F00"}], sizes:["XS","S","M","L","XL"], variants:[], reviews:[], rating:4.7, reviewCount:29, isFeatured:true, isNew:false, isBestseller:true, stock:16, materials:[], care:[], sku:"LUM-RKD-001", createdAt:"2025-10-30" },
];

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

              {/* Right column */}
              <div className={styles.bentoRightCol}>

                {/* Cell 2 — Wide top: Summer dresses */}
                <Link href="/shop?category=summer" className={`${styles.bentoCell} ${styles.bentoCellWide}`}>
                  <Image
                    src="https://images.unsplash.com/photo-1572804013427-4d7ca7268217?w=1000&h=600&fit=crop"
                    alt="Summer Dresses"
                    fill
                    sizes="(max-width: 768px) 100vw, 55vw"
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
                      sizes="(max-width: 768px) 50vw, 25vw"
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
                      sizes="(max-width: 768px) 50vw, 25vw"
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
