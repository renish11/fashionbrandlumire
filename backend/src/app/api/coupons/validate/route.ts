import { NextResponse } from "next/server";

const VALID_COUPONS: Record<string, number> = {
  WELCOME10: 10,
  VIP20: 20,
  LUMIERE15: 15,
};

export async function POST(request: Request) {
  try {
    const { code } = await request.json();

    if (!code || typeof code !== "string") {
      return NextResponse.json(
        { valid: false, discount: 0, error: "Coupon code is required" },
        { status: 400 }
      );
    }

    const normalized = code.trim().toUpperCase();
    const discount = VALID_COUPONS[normalized];

    if (discount) {
      return NextResponse.json({ valid: true, discount, code: normalized });
    }

    return NextResponse.json(
      { valid: false, discount: 0, error: "Invalid coupon code" },
      { status: 404 }
    );
  } catch (err) {
    return NextResponse.json(
      { valid: false, discount: 0, error: "Failed to validate coupon" },
      { status: 500 }
    );
  }
}
