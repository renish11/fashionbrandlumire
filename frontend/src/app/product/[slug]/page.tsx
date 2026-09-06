import { notFound } from "next/navigation";
import { fetchProductBySlug, fetchProducts } from "@/lib/api";
import ProductDetailClient from "./ProductDetailClient";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;
  const product = await fetchProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const allProducts = await fetchProducts().catch(() => []);
  const related = allProducts
    .filter((p) => p.category === product.category && p.slug !== product.slug)
    .slice(0, 4);

  return <ProductDetailClient product={product} related={related} />;
}
