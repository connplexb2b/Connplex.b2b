import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";

// Initialize Razorpay Instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || "rzp_test_placeholder",
  key_secret: process.env.RAZORPAY_KEY_SECRET || "YOUR_KEY_SECRET",
});

export async function POST(req: NextRequest) {
  try {
    const { amount } = await req.json();

    const options = {
      amount: amount * 100, // convert INR to paise (subunit)
      currency: "INR",
      receipt: `receipt_order_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);
    return NextResponse.json(order);
  } catch (error: any) {
    console.error("Error creating Razorpay order:", error);
    return NextResponse.json({ 
      error: "Failed to create order",
      details: error.message || error.description || (error.error && error.error.description) || String(error)
    }, { status: 500 });
  }
}
