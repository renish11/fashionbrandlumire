import type { Collection, Category } from "@/types";

export const collections: Collection[] = [
  {
    id: "ss26",
    slug: "spring-summer-2026",
    name: "Spring / Summer 2026",
    description:
      "A celebration of effortless elegance. Fluid silhouettes, natural fabrics, and a palette inspired by the golden Mediterranean coast.",
    image: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1200&h=800&fit=crop",
    productCount: 42,
    season: "Spring/Summer",
    year: 2026,
  },
  {
    id: "aw25",
    slug: "autumn-winter-2025",
    name: "Autumn / Winter 2025",
    description:
      "The art of staying warm in luxury. Rich textures, architectural silhouettes, and a palette drawn from the Parisian autumn.",
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=800&fit=crop",
    productCount: 38,
    season: "Autumn/Winter",
    year: 2025,
  },
  {
    id: "resort26",
    slug: "resort-2026",
    name: "Resort 2026",
    description:
      "Designed for the modern nomad — lightweight, versatile pieces that move between destinations with effortless grace.",
    image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1200&h=800&fit=crop",
    productCount: 28,
    season: "Resort",
    year: 2026,
  },
];

export const categories: Category[] = [
  {
    id: "cat-dresses",
    slug: "dresses",
    name: "Dresses",
    image: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=600&h=800&fit=crop",
    productCount: 24,
  },
  {
    id: "cat-tops",
    slug: "tops",
    name: "Tops & Blouses",
    image: "https://images.unsplash.com/photo-1485462537746-965f33f7f6a7?w=600&h=800&fit=crop",
    productCount: 18,
  },
  {
    id: "cat-trousers",
    slug: "trousers",
    name: "Trousers",
    image: "https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=600&h=800&fit=crop",
    productCount: 16,
  },
  {
    id: "cat-outerwear",
    slug: "outerwear",
    name: "Outerwear",
    image: "https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=600&h=800&fit=crop",
    productCount: 14,
  },
  {
    id: "cat-accessories",
    slug: "accessories",
    name: "Accessories",
    image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&h=800&fit=crop",
    productCount: 20,
  },
];
