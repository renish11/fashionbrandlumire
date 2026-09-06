import Razorpay from "razorpay";
import crypto from "crypto";

const key_id = process.env.RAZORPAY_KEY_ID ?? "rzp_test_51AbCdEfGhIjKl";
const key_secret = process.env.RAZORPAY_KEY_SECRET ?? "rzp_test_secret_placeholder";

export const razorpay = new Razorpay({
  key_id,
  key_secret,
});

export function verifyRazorpaySignature(
  orderId: string,
  paymentId: string,
  signature: string,
  secret: string = key_secret
): boolean {
  if (!orderId || !paymentId || !signature) return false;

  const generatedSignature = crypto
    .createHmac("sha256", secret)
    .update(`${orderId}|${paymentId}`)
    .digest("hex");

  return generatedSignature === signature;
}
