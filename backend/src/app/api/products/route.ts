import { NextResponse } from "next/server";
import {
  products,
  getFeaturedProducts,
  getNewProducts,
  getBestsellerProducts,
  addProduct,
} from "@/data/products";
import type { Product } from "@/types";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const filter = searchParams.get("filter");
  const category = searchParams.get("category");
  const search = searchParams.get("search")?.toLowerCase();

  let result = [...products];

  if (filter === "featured") {
    result = getFeaturedProducts();
  } else if (filter === "new") {
    result = getNewProducts();
  } else if (filter === "bestseller") {
    result = getBestsellerProducts();
  }

  if (category) {
    result = result.filter(
      (p) => p.category.toLowerCase() === category.toLowerCase()
    );
  }

  if (search) {
    result = result.filter(
      (p) =>
        p.name.toLowerCase().includes(search) ||
        p.description.toLowerCase().includes(search) ||
        p.brand.toLowerCase().includes(search)
    );
  }

  return NextResponse.json(result);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate required fields
    const requiredFields = ["name", "slug", "brand", "price", "category", "sku"];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    const newProduct: Product = {
      id: `p${Date.now()}`,
      slug: body.slug,
      name: body.name,
      brand: body.brand,
      description: body.description || "",
      longDescription: body.longDescription || "",
      price: Number(body.price),
      compareAtPrice: body.compareAtPrice ? Number(body.compareAtPrice) : undefined,
      images: body.images || [],
      category: body.category,
      collectionId: body.collectionId || undefined,
      tags: body.tags || [],
      colors: body.colors || [],
      sizes: body.sizes || [],
      variants: body.variants || [],
      reviews: [],
      rating: 0,
      reviewCount: 0,
      isFeatured: body.isFeatured || false,
      isNew: body.isNew ?? true,
      isBestseller: body.isBestseller || false,
      stock: Number(body.stock) || 0,
      materials: body.materials || [],
      care: body.care || [],
      sku: body.sku,
      createdAt: new Date().toISOString().split("T")[0],
    };

    const created = addProduct(newProduct);
    return NextResponse.json(created, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }
}
