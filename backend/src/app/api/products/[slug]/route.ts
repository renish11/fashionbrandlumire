import { NextResponse } from "next/server";
import { getProductBySlug } from "@/data/products";

interface RouteProps {
  params: Promise<{ slug: string }>;
}

export async function GET(request: Request, { params }: RouteProps) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  return NextResponse.json(product);
}
