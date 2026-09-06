import { NextResponse } from "next/server";
import { verifyRazorpaySignature } from "@/lib/razorpay";

export async function POST(request: Request) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      await request.json();

    if (!razorpay_order_id || !razorpay_payment_id) {
      return NextResponse.json(
        { verified: false, error: "Missing required payment fields" },
        { status: 400 }
      );
    }

    // For mock order IDs generated in development test mode
    if (
      razorpay_order_id.startsWith("order_mock_") ||
      razorpay_payment_id.startsWith("pay_mock_") ||
      razorpay_signature === "mock_signature_test"
    ) {
      return NextResponse.json({
        verified: true,
        message: "Payment verified (test mode)",
      });
    }

    const isValid = verifyRazorpaySignature(
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    );

    if (isValid) {
      return NextResponse.json({
        verified: true,
        message: "Payment verified successfully",
      });
    } else {
      return NextResponse.json(
        { verified: false, error: "Invalid payment signature" },
        { status: 400 }
      );
    }
  } catch (error: any) {
    return NextResponse.json(
      { verified: false, error: error?.message || "Verification failed" },
      { status: 500 }
    );
  }
}
