import { NextResponse, NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { db } from "@/lib/db";
import { razorpay } from "@/lib/razorpay";

export async function POST(req: NextRequest) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET || "nextauthsecret321" });
    if (!token) {
      return NextResponse.json({ message: "Unauthenticated" }, { status: 401 });
    }

    const body = await req.json();
    const { planId } = body;

    if (!planId) {
      return NextResponse.json({ message: "Plan ID is required" }, { status: 400 });
    }

    const plan = await db.plan.findUnique({
      where: { id: planId },
    });

    if (!plan) {
      return NextResponse.json({ message: "Plan not found" }, { status: 404 });
    }

    const amountInPaise = Math.round(plan.price * 100);
    const keyId = process.env.RAZORPAY_KEY_ID || "rzp_test_yourkeyhere";
    const keySecret = process.env.RAZORPAY_KEY_SECRET || "rzp_secret_yourkeyhere";

    const isMock = keyId === "rzp_test_yourkeyhere" || keySecret === "rzp_secret_yourkeyhere";

    let orderId = "";

    if (isMock) {
      // Mock Order creation
      orderId = `order_mock_${Math.random().toString(36).substring(2, 15)}`;
    } else {
      // Real Razorpay Order creation
      const order = await razorpay.orders.create({
        amount: amountInPaise,
        currency: "INR",
        receipt: `receipt_${Date.now()}`,
      });
      orderId = order.id;
    }

    // Insert pending payment log
    await db.payment.create({
      data: {
        userId: token.id,
        amount: plan.price,
        currency: "INR",
        status: "PENDING",
        razorpayOrderId: orderId,
        description: `Subscription: ${plan.name} (${plan.tier} Tier)`,
      },
    });

    return NextResponse.json({
      orderId,
      amount: amountInPaise,
      currency: "INR",
      key: keyId,
      isMock,
      planName: plan.name,
    });
  } catch (error) {
    console.error("Create order error:", error);
    return NextResponse.json(
      { message: "Failed to create checkout order" },
      { status: 500 }
    );
  }
}
