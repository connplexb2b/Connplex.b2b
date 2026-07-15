import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await req.json();

    // Generate signature locally using Key Secret
    const key_secret = process.env.RAZORPAY_KEY_SECRET || "YOUR_KEY_SECRET";
    const hmac = crypto.createHmac("sha256", key_secret);
    hmac.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const generated_signature = hmac.digest("hex");

    if (generated_signature === razorpay_signature) {
      // Payment is authentic. Update order status to 'Paid' in database here if applicable.
      return NextResponse.json({ status: "success", message: "Payment verified successfully" });
    } else {
      // Tampered signature or invalid payment
      return NextResponse.json({ status: "failure", message: "Invalid signature verification" }, { status: 400 });
    }
  } catch (error) {
    console.error("Error verifying Razorpay payment:", error);
    return NextResponse.json({ error: "Failed to verify payment" }, { status: 500 });
  }
}
