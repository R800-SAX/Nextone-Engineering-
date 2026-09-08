'use client';

import React, { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Check, ShieldAlert, Loader2, Sparkles, HelpCircle } from "lucide-react";

interface PlanProps {
  id: string;
  name: string;
  price: number;
  duration: number;
  tier: string;
  description: string;
  features: string; // JSON string array
  popular: boolean;
}

export default function PricingCards({ plans }: { plans: PlanProps[] }) {
  const { data: session } = useSession();
  const router = useRouter();

  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [showSandbox, setShowSandbox] = useState(false);
  const [sandboxData, setSandboxData] = useState<{
    orderId: string;
    amount: number;
    planName: string;
    planId: string;
  } | null>(null);

  // Dynamic script loader for Razorpay
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleSubscribe = async (planId: string) => {
    if (!session) {
      router.push(`/login?callbackUrl=/#pricing`);
      return;
    }

    setLoadingId(planId);

    try {
      const res = await fetch("/api/payments/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Failed to initiate payment");
        setLoadingId(null);
        return;
      }

      if (data.isMock) {
        // Trigger mock checkout overlay modal
        setSandboxData({
          orderId: data.orderId,
          amount: data.amount,
          planName: data.planName,
          planId: planId,
        });
        setShowSandbox(true);
      } else {
        // Trigger native Razorpay checkout
        const isLoaded = await loadRazorpayScript();
        if (!isLoaded) {
          alert("Razorpay SDK failed to load. Are you offline?");
          setLoadingId(null);
          return;
        }

        const options = {
          key: data.key,
          amount: data.amount,
          currency: data.currency,
          name: "AB Fitness Gym",
          description: `Subscription: ${data.planName}`,
          order_id: data.orderId,
          handler: async function (response: any) {
            setLoadingId(planId);
            const verifyRes = await fetch("/api/payments/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
                planId: planId,
              }),
            });

            const verifyData = await verifyRes.json();
            if (verifyRes.ok) {
              router.push("/dashboard/membership?success=true");
            } else {
              alert(verifyData.message || "Payment verification failed");
            }
            setLoadingId(null);
          },
          prefill: {
            name: session.user?.name || "",
            email: session.user?.email || "",
          },
          theme: {
            color: "#e11d48",
          },
        };

        const rzp = new (window as any).Razorpay(options);
        rzp.open();
        setLoadingId(null);
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong initiating payment");
      setLoadingId(null);
    }
  };

  const handleSimulatePayment = async (success: boolean) => {
    if (!sandboxData) return;
    setShowSandbox(false);

    if (!success) {
      alert("Payment cancelled by user");
      setLoadingId(null);
      return;
    }

    try {
      const verifyRes = await fetch("/api/payments/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          razorpayOrderId: sandboxData.orderId,
          razorpayPaymentId: `pay_mock_${Math.random().toString(36).substring(2, 11)}`,
          razorpaySignature: "mock_signature",
          planId: sandboxData.planId,
        }),
      });

      const verifyData = await verifyRes.json();

      if (verifyRes.ok) {
        router.push("/dashboard/membership?success=true");
      } else {
        alert(verifyData.message || "Payment verification failed");
      }
    } catch (err) {
      console.error(err);
      alert("Mock payment verification failed");
    } finally {
      setLoadingId(null);
      setSandboxData(null);
    }
  };

  return (
    <div style={{ position: "relative" }}>
      {/* Sandbox Simulator Modal */}
      {showSandbox && sandboxData && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0,0,0,0.85)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
          padding: "1.5rem",
          backdropFilter: "blur(8px)"
        }}>
          <div className="glass-card" style={{
            maxWidth: "480px",
            width: "100%",
            padding: "2.5rem",
            border: "2px solid var(--accent)",
            boxShadow: "0 0 30px var(--accent-glow)"
          }}>
            <div style={{ textAlign: "center", marginBottom: "2rem" }}>
              <div style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                color: "var(--accent)",
                fontWeight: "700",
                fontSize: "0.875rem",
                textTransform: "uppercase",
                background: "rgba(249, 115, 22, 0.15)",
                padding: "0.5rem 1rem",
                borderRadius: "var(--radius-xl)",
                marginBottom: "1rem"
              }}>
                <ShieldAlert size={16} />
                Sandbox Payment Simulator
              </div>
              <h3 style={{ fontSize: "1.75rem", marginBottom: "0.5rem" }}>Checkout: {sandboxData.planName}</h3>
              <p style={{ color: "var(--fg-secondary)", fontSize: "0.95rem" }}>
                Developer mode is active (default/placeholder Razorpay API keys detected). No real money is charged.
              </p>
            </div>

            <div style={{
              background: "rgba(255, 255, 255, 0.03)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-md)",
              padding: "1.25rem",
              marginBottom: "2rem"
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.75rem" }}>
                <span style={{ color: "var(--fg-secondary)" }}>Mock Order ID:</span>
                <code style={{ color: "var(--fg-primary)" }}>{sandboxData.orderId}</code>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.75rem" }}>
                <span style={{ color: "var(--fg-secondary)" }}>Plan Cost:</span>
                <span style={{ fontWeight: "700", color: "var(--fg-primary)" }}>
                  ₹{(sandboxData.amount / 100).toLocaleString("en-IN")}
                </span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "var(--fg-secondary)" }}>Billing Term:</span>
                <span style={{ color: "var(--fg-primary)" }}>1 Month</span>
              </div>
            </div>

            <div style={{ display: "flex", gap: "1rem" }}>
              <button
                onClick={() => handleSimulatePayment(true)}
                className="btn btn-accent"
                style={{ flex: 1, justifyContent: "center" }}
              >
                Simulate Success
              </button>
              <button
                onClick={() => handleSimulatePayment(false)}
                className="btn btn-secondary"
                style={{ flex: 1, justifyContent: "center" }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Pricing Cards Grid */}
      <div className="grid-responsive" style={{ maxWidth: "1000px", margin: "0 auto" }}>
        {plans.map((p) => {
          const parsedFeatures = JSON.parse(p.features) as string[];
          return (
            <div
              key={p.id}
              className="glass-card"
              style={{
                position: "relative",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                padding: "3rem 2rem",
                border: p.popular ? "2px solid var(--primary)" : "1px solid var(--border)",
                boxShadow: p.popular ? "0 10px 40px rgba(0,0,0,0.8), var(--shadow-glow)" : "var(--shadow-md)"
              }}
            >
              {p.popular && (
                <div style={{
                  position: "absolute",
                  top: "-15px",
                  left: "50%",
                  transform: "translateX(-50%)",
                  backgroundColor: "var(--primary)",
                  color: "white",
                  padding: "0.25rem 1rem",
                  borderRadius: "var(--radius-xl)",
                  fontSize: "0.75rem",
                  fontWeight: "700",
                  textTransform: "uppercase",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.25rem",
                  boxShadow: "0 4px 10px var(--primary-glow)"
                }}>
                  <Sparkles size={12} />
                  Most Popular
                </div>
              )}

              <div>
                <div style={{ marginBottom: "1.5rem" }}>
                  <span style={{
                    fontSize: "0.875rem",
                    fontWeight: "600",
                    textTransform: "uppercase",
                    color: p.tier === "PLATINUM" ? "#c084fc" : p.tier === "GOLD" ? "#fbbf24" : "#9ca3af",
                    letterSpacing: "0.05em"
                  }}>
                    {p.name}
                  </span>
                  <div style={{ display: "flex", alignItems: "baseline", marginTop: "0.5rem" }}>
                    <span style={{ fontSize: "2.5rem", fontWeight: "800", color: "var(--fg-primary)" }}>
                      ₹{p.price.toLocaleString("en-IN")}
                    </span>
                    <span style={{ color: "var(--fg-secondary)", marginLeft: "0.25rem" }}>/month</span>
                  </div>
                  <p style={{ color: "var(--fg-secondary)", fontSize: "0.9rem", marginTop: "1rem", minHeight: "60px" }}>
                    {p.description}
                  </p>
                </div>

                <hr style={{ border: 0, borderTop: "1px solid var(--border)", margin: "1.5rem 0" }} />

                <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "2rem" }}>
                  {parsedFeatures.map((f, idx) => (
                    <li key={idx} style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start", fontSize: "0.925rem" }}>
                      <Check size={16} style={{ color: "var(--primary)", flexShrink: 0, marginTop: "0.2rem" }} />
                      <span style={{ color: "var(--fg-secondary)" }}>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={() => handleSubscribe(p.id)}
                disabled={loadingId !== null}
                className={p.popular ? "btn btn-primary" : "btn btn-secondary"}
                style={{ width: "100%", justifyContent: "center" }}
              >
                {loadingId === p.id ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Processing...
                  </>
                ) : session ? (
                  "Subscribe Now"
                ) : (
                  "Login to Subscribe"
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
