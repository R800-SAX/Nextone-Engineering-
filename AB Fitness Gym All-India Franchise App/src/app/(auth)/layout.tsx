import React from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div style={{
      display: "flex",
      minHeight: "100vh",
      backgroundColor: "var(--bg-primary)",
      overflow: "hidden"
    }}>
      {/* Left Pane - Branding & Stats (Hidden on mobile) */}
      <div style={{
        flex: "1",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "3rem",
        background: "linear-gradient(135deg, rgba(17, 17, 24, 0.9) 0%, rgba(9, 9, 14, 0.95) 100%), url('https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=1000&auto=format&fit=crop&q=80')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        borderRight: "1px solid var(--border)",
      }} className="auth-left-pane">
        <div>
          <h1 style={{
            fontSize: "2.5rem",
            fontWeight: "800",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem"
          }}>
            <span style={{ color: "var(--primary)" }}>AB</span> FITNESS GYM
          </h1>
          <p style={{ color: "var(--fg-secondary)", marginTop: "0.5rem", maxWidth: "400px" }}>
            The premier All-India fitness network. Train anywhere, achieve everything.
          </p>
        </div>

        <div style={{ margin: "4rem 0" }}>
          <blockquote style={{
            fontSize: "1.5rem",
            fontWeight: "500",
            fontStyle: "italic",
            borderLeft: "4px solid var(--primary)",
            paddingLeft: "1.5rem",
            color: "var(--fg-primary)",
            lineHeight: "1.4"
          }}>
            "The only bad workout is the one that didn't happen. Push your limits, redefine your goals, and transform your life."
          </blockquote>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "1.5rem",
          borderTop: "1px solid var(--border)",
          paddingTop: "2rem"
        }}>
          <div>
            <h3 style={{ fontSize: "1.75rem", color: "var(--primary)" }}>25+</h3>
            <p style={{ fontSize: "0.875rem", color: "var(--fg-secondary)" }}>Locations Across India</p>
          </div>
          <div>
            <h3 style={{ fontSize: "1.75rem", color: "var(--accent)" }}>50k+</h3>
            <p style={{ fontSize: "0.875rem", color: "var(--fg-secondary)" }}>Active Members</p>
          </div>
          <div>
            <h3 style={{ fontSize: "1.75rem", color: "var(--success)" }}>5★</h3>
            <p style={{ fontSize: "0.875rem", color: "var(--fg-secondary)" }}>Franchise Rating</p>
          </div>
        </div>

      </div>

      {/* Right Pane - Children Form */}
      <div style={{
        flex: "1",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
        position: "relative"
      }}>
        {/* Ambient background glow behind form */}
        <div style={{
          position: "absolute",
          width: "300px",
          height: "300px",
          borderRadius: "50%",
          background: "var(--primary-glow)",
          filter: "blur(100px)",
          top: "20%",
          right: "10%",
          pointerEvents: "none",
          zIndex: "0"
        }}></div>

        <div style={{
          width: "100%",
          maxWidth: "450px",
          zIndex: "1"
        }}>
          {children}
        </div>
      </div>
    </div>
  );
}
