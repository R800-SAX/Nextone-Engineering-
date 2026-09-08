import { NextResponse, NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import crypto from "crypto";
import { db } from "@/lib/db";
import { generateCardNumber } from "@/lib/razorpay";

export async function POST(req: NextRequest) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET || "nextauthsecret321" });
    if (!token) {
      return NextResponse.json({ message: "Unauthenticated" }, { status: 401 });
    }

    const body = await req.json();
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature, planId } = body;

    if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature || !planId) {
      return NextResponse.json({ message: "Missing verification parameters" }, { status: 400 });
    }

    const plan = await db.plan.findUnique({ where: { id: planId } });
    if (!plan) {
      return NextResponse.json({ message: "Plan not found" }, { status: 404 });
    }

    // Verify signature
    let isValid = false;
    const isMock = razorpayOrderId.startsWith("order_mock_");

    if (isMock) {
      isValid = razorpaySignature === "mock_signature";
    } else {
      const keySecret = process.env.RAZORPAY_KEY_SECRET || "";
      const hmac = crypto.createHmac("sha256", keySecret);
      hmac.update(`${razorpayOrderId}|${razorpayPaymentId}`);
      const generatedSignature = hmac.digest("hex");
      isValid = generatedSignature === razorpaySignature;
    }

    if (!isValid) {
      // Mark matching payment logs as failed
      await db.payment.updateMany({
        where: { razorpayOrderId },
        data: { status: "FAILED" },
      });
      return NextResponse.json({ message: "Signature verification failed" }, { status: 400 });
    }

    // Find the pending payment log
    const payment = await db.payment.findFirst({
      where: { razorpayOrderId },
    });

    if (!payment) {
      return NextResponse.json({ message: "Payment log not found" }, { status: 404 });
    }

    // Setup active Membership duration
    const startDate = new Date();
    const endDate = new Date();
    endDate.setMonth(startDate.getMonth() + plan.duration);

    const cardNumber = generateCardNumber();

    // Create active membership
    const membership = await db.membership.create({
      data: {
        userId: token.id,
        planId: plan.id,
        status: "ACTIVE",
        cardNumber: cardNumber,
        startDate,
        endDate,
        autoRenew: true,
      },
    });

    // Update payment record linked to the membership
    await db.payment.update({
      where: { id: payment.id },
      data: {
        status: "SUCCESS",
        membershipId: membership.id,
        razorpayPaymentId,
        razorpaySignature,
      },
    });

    return NextResponse.json({
      message: "Payment verified successfully",
      membershipId: membership.id,
      cardNumber: cardNumber,
    });
  } catch (error) {
    console.error("Payment verification error:", error);
    return NextResponse.json(
      { message: "Failed to verify transaction" },
      { status: 500 }
    );
  }
}
