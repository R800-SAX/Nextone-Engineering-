import React from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Dumbbell, Calendar, QrCode, AlertCircle, CheckCircle, HelpCircle } from "lucide-react";
import "./membership.css";

export default async function MembershipPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    include: {
      memberships: {
        include: { plan: true },
        orderBy: { createdAt: "desc" }
      },
      payments: {
        orderBy: { createdAt: "desc" }
      }
    }
  });

  if (!user) {
    redirect("/login");
  }

  const activeMembership = user.memberships.find(m => m.status === "ACTIVE");

  return (
    <div className="membership-container">
      {/* Page Title */}
      <div>
        <h1 style={{ fontSize: "2.25rem", marginBottom: "0.5rem" }}>My Membership</h1>
        <p style={{ color: "var(--fg-secondary)" }}>Manage your subscription and view franchise entry credentials</p>
      </div>

      {activeMembership ? (
        <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1.8fr", gap: "3rem" }} className="db-layout-splits">
          {/* Left Panel: Virtual Card */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "2rem" }}>
            <h3 style={{ fontSize: "1.25rem", alignSelf: "flex-start" }}>Digital Franchise Card</h3>
            
            <div className="gym-card-wrapper">
              <div className={`gym-card ${activeMembership.plan.tier.toLowerCase()}`}>
                <div className="gym-card-header">
                  <div className="gym-card-logo">
                    <Dumbbell size={20} style={{ color: "var(--primary)" }} />
                    <span>AB FITNESS</span>
                  </div>
                  <div className="gym-card-chip"></div>
                </div>

                <div className="gym-card-body">
                  <div style={{ fontSize: "0.7rem", color: "var(--fg-secondary)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.25rem" }}>
                    Access Card ID
                  </div>
                  <div className="gym-card-number">
                    {activeMembership.cardNumber}
                  </div>
                  <span className="badge badge-success" style={{ fontSize: "0.7rem" }}>
                    Active Membership
                  </span>
                </div>

                <div className="gym-card-footer">
                  <div>
                    <div style={{ fontSize: "0.65rem", color: "var(--fg-secondary)", textTransform: "uppercase" }}>Cardholder</div>
                    <div className="gym-card-member-name">{user.name}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div className="gym-card-date">
                      Valid Until<br />
                      <strong style={{ color: "white" }}>
                        {new Date(activeMembership.endDate).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })}
                      </strong>
                    </div>
                  </div>
                </div>
                <div className="hologram-seal"></div>
              </div>
            </div>

            {/* QR Scanner Info Block */}
            <div className="glass-card" style={{
              display: "flex",
              alignItems: "center",
              gap: "1.5rem",
              padding: "1.5rem",
              width: "100%",
              maxWidth: "460px"
            }}>
              <QrCode size={48} style={{ color: "var(--primary)", flexShrink: 0 }} />
              <div>
                <h4 style={{ fontSize: "1rem", marginBottom: "0.25rem" }}>Swipe At Entrance</h4>
                <p style={{ fontSize: "0.825rem", color: "var(--fg-secondary)", lineHeight: "1.4" }}>
                  Show this digital card at the desk or scan at the turnstile in any of our 25+ All-India centers to log entrance.
                </p>
              </div>
            </div>
          </div>

          {/* Right Panel: Subscription status and logs */}
          <div>
            <h3 style={{ fontSize: "1.25rem", marginBottom: "1.5rem" }}>Plan Details & History</h3>

            <div className="glass-card" style={{ padding: "2rem", marginBottom: "2.5rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
                <div>
                  <h4 style={{ fontSize: "1.25rem" }}>{activeMembership.plan.name}</h4>
                  <span style={{ fontSize: "0.825rem", color: "var(--fg-secondary)" }}>
                    All-India Access Enabled
                  </span>
                </div>
                <span className="badge badge-primary" style={{ padding: "0.4rem 0.8rem" }}>
                  ₹{activeMembership.plan.price.toLocaleString("en-IN")} / Month
                </span>
              </div>

              <div style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "1.5rem",
                paddingTop: "1.5rem",
                borderTop: "1px solid var(--border)",
                fontSize: "0.9rem"
              }}>
                <div>
                  <span style={{ color: "var(--fg-secondary)", display: "block", marginBottom: "0.25rem" }}>Activated On</span>
                  <strong>{new Date(activeMembership.startDate).toLocaleDateString()}</strong>
                </div>
                <div>
                  <span style={{ color: "var(--fg-secondary)", display: "block", marginBottom: "0.25rem" }}>Next Renewal Date</span>
                  <strong>{new Date(activeMembership.endDate).toLocaleDateString()}</strong>
                </div>
                <div>
                  <span style={{ color: "var(--fg-secondary)", display: "block", marginBottom: "0.25rem" }}>Home Location</span>
                  <strong>{user.city} Branch</strong>
                </div>
                <div>
                  <span style={{ color: "var(--fg-secondary)", display: "block", marginBottom: "0.25rem" }}>Auto Renew</span>
                  <strong style={{ color: "var(--success)" }}>Enabled</strong>
                </div>
              </div>
            </div>

            {/* Payment History logs */}
            <h4 style={{ fontSize: "1.1rem", marginBottom: "1rem" }}>Billing Ledger</h4>
            <div className="glass-card" style={{ padding: 0, overflow: "hidden" }}>
              {user.payments.length === 0 ? (
                <div style={{ padding: "2rem", textAlign: "center", color: "var(--fg-secondary)" }}>
                  No payment records found.
                </div>
              ) : (
                <div className="payments-table-container">
                  <table className="payments-table">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Description</th>
                        <th>Amount</th>
                        <th>Status</th>
                        <th>Reference ID</th>
                      </tr>
                    </thead>
                    <tbody>
                      {user.payments.map((p) => (
                        <tr key={p.id}>
                          <td>{new Date(p.createdAt).toLocaleDateString()}</td>
                          <td>{p.description || "Franchise Subscription"}</td>
                          <td style={{ fontWeight: "700" }}>₹{p.amount.toLocaleString("en-IN")}</td>
                          <td>
                            <span className={`badge ${
                              p.status === "SUCCESS" ? "badge-success" : p.status === "FAILED" ? "badge-primary" : ""
                            }`} style={{ fontSize: "0.7rem", padding: "0.15rem 0.5rem" }}>
                              {p.status}
                            </span>
                          </td>
                          <td style={{ fontFamily: "monospace", fontSize: "0.8rem", color: "var(--fg-muted)" }}>
                            {p.razorpayPaymentId || p.razorpayOrderId || p.id}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* No Active Membership UI */
        <div className="glass-card no-membership-card">
          <AlertCircle size={48} style={{ color: "var(--primary)" }} />
          <div>
            <h3 style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>No Active Membership Found</h3>
            <p style={{ color: "var(--fg-secondary)", maxWidth: "420px", margin: "0 auto", lineHeight: "1.5" }}>
              To train at any of our flagship centers and unlock your personalized training dashboard, please subscribe to one of our club plans.
            </p>
          </div>
          <Link href="/#pricing" className="btn btn-primary btn-lg">
            Browse Club Plans
          </Link>
        </div>
      )}

    </div>
  );
}
