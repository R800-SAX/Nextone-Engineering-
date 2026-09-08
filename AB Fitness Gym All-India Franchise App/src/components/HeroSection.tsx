'use client';

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Trophy, Zap, ShieldCheck } from "lucide-react";

interface Particle {
  id: number;
  top: string;
  left: string;
  size: string;
  delay: string;
  duration: string;
}

export default function HeroSection() {
  const [mounted, setMounted] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    setMounted(true);
    // Generate random particle locations once mounted to prevent server/client hydration mismatch
    const generated: Particle[] = Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      top: `${Math.floor(Math.random() * 80) + 10}%`,
      left: `${Math.floor(Math.random() * 80) + 10}%`,
      size: `${Math.floor(Math.random() * 30) + 10}px`,
      delay: `${Math.random() * 5}s`,
      duration: `${Math.random() * 15 + 10}s`,
    }));
    setParticles(generated);
  }, []);

  return (
    <section style={{
      position: "relative",
      padding: "8rem 0 6rem 0",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      textAlign: "center",
      overflow: "hidden",
      borderBottom: "1px solid var(--border)"
    }}>
      {/* Background gradients */}
      <div style={{
        position: "absolute",
        width: "50vw",
        height: "50vw",
        borderRadius: "50%",
        background: "radial-gradient(circle, var(--primary-glow) 0%, transparent 70%)",
        top: "-20vw",
        left: "-10vw",
        pointerEvents: "none",
        zIndex: 0
      }}></div>
      <div style={{
        position: "absolute",
        width: "40vw",
        height: "40vw",
        borderRadius: "50%",
        background: "radial-gradient(circle, var(--accent-glow) 0%, transparent 70%)",
        bottom: "-10vw",
        right: "-5vw",
        pointerEvents: "none",
        zIndex: 0
      }}></div>

      {/* Decorative Particles (Only render on client after mount) */}
      {mounted && particles.map((p) => (
        <div
          key={p.id}
          className="floating-particle"
          style={{
            position: "absolute",
            top: p.top,
            left: p.left,
            width: p.size,
            height: p.size,
            borderRadius: "50%",
            background: p.id % 2 === 0 ? "var(--primary-glow)" : "var(--accent-glow)",
            border: "1px solid rgba(255, 255, 255, 0.03)",
            animation: `float ${p.duration} ease-in-out infinite alternate`,
            animationDelay: p.delay,
            pointerEvents: "none",
            zIndex: 1
          }}
        />
      ))}

      <div className="container" style={{ position: "relative", zIndex: 10, maxWidth: "900px" }}>
        {/* Banner Badge */}
        <div style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "0.5rem",
          background: "rgba(225, 29, 72, 0.1)",
          border: "1px solid rgba(225, 29, 72, 0.2)",
          padding: "0.5rem 1rem",
          borderRadius: "var(--radius-xl)",
          marginBottom: "2rem",
          fontSize: "0.875rem",
          fontWeight: "600",
          color: "#fda4af",
        }}>
          <Trophy size={16} style={{ color: "var(--accent)" }} />
          <span>India's Most Premium Gym Network</span>
        </div>

        {/* Main Heading */}
        <h1 style={{
          fontSize: "4.5rem",
          lineHeight: "1.1",
          fontWeight: "900",
          letterSpacing: "-0.04em",
          marginBottom: "1.5rem",
          textTransform: "uppercase"
        }} className="hero-title">
          Redefine Your Limits <br />
          <span className="text-gradient-accent">Unleash Power</span>
        </h1>

        {/* Tagline */}
        <p style={{
          fontSize: "1.25rem",
          color: "var(--fg-secondary)",
          marginBottom: "3rem",
          maxWidth: "650px",
          margin: "0 auto 3rem auto",
          lineHeight: "1.5"
        }}>
          Experience the ultimate fitness ecosystem. Join the AB Fitness franchise and get unlimited access to 25+ premium locations, elite training, and personalized digital tracking.
        </p>

        {/* CTAs */}
        <div style={{
          display: "flex",
          gap: "1.5rem",
          justifyContent: "center",
          flexWrap: "wrap",
          marginBottom: "4rem"
        }}>
          <Link href="#pricing" className="btn btn-primary btn-lg">
            Choose Your Plan
            <ArrowRight size={20} />
          </Link>
          <Link href="/locations" className="btn btn-secondary btn-lg">
            Find Near You
          </Link>
        </div>

        {/* Value Props */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "2rem",
          borderTop: "1px solid var(--border)",
          paddingTop: "3rem",
          textAlign: "left"
        }} className="hero-features">
          <div style={{ display: "flex", gap: "1rem" }}>
            <div style={{
              width: "48px",
              height: "48px",
              borderRadius: "var(--radius-md)",
              backgroundColor: "rgba(225, 29, 72, 0.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--primary)",
              flexShrink: 0
            }}>
              <Zap size={22} />
            </div>
            <div>
              <h4 style={{ fontSize: "1.1rem", marginBottom: "0.25rem" }}>All-India Access</h4>
              <p style={{ fontSize: "0.875rem", color: "var(--fg-secondary)" }}>Train in any of our 25+ prime franchise facilities across India.</p>
            </div>
          </div>

          <div style={{ display: "flex", gap: "1rem" }}>
            <div style={{
              width: "48px",
              height: "48px",
              borderRadius: "var(--radius-md)",
              backgroundColor: "rgba(249, 115, 22, 0.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--accent)",
              flexShrink: 0
            }}>
              <Trophy size={22} />
            </div>
            <div>
              <h4 style={{ fontSize: "1.1rem", marginBottom: "0.25rem" }}>Elite Coaches</h4>
              <p style={{ fontSize: "0.875rem", color: "var(--fg-secondary)" }}>Get coached by highly-certified personal trainers and nutritionists.</p>
            </div>
          </div>

          <div style={{ display: "flex", gap: "1rem" }}>
            <div style={{
              width: "48px",
              height: "48px",
              borderRadius: "var(--radius-md)",
              backgroundColor: "rgba(16, 185, 129, 0.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--success)",
              flexShrink: 0
            }}>
              <ShieldCheck size={22} />
            </div>
            <div>
              <h4 style={{ fontSize: "1.1rem", marginBottom: "0.25rem" }}>Advanced Tracking</h4>
              <p style={{ fontSize: "0.875rem", color: "var(--fg-secondary)" }}>Built-in dashboard logs your metrics, goals, and workout plans.</p>
            </div>
          </div>
        </div>
      </div>

    </section>
  );
}
