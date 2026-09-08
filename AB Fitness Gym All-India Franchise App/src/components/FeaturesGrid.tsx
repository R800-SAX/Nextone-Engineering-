'use client';

import React from "react";
import { CreditCard, Award, Clipboard, HeartPulse, Activity, Zap } from "lucide-react";

export default function FeaturesGrid() {
  const features = [
    {
      icon: <CreditCard size={28} />,
      title: "All-India Franchise Card",
      description: "One membership card grants you swipe-access to 25+ location branches across all major metropolitan Indian cities.",
      color: "var(--primary)"
    },
    {
      icon: <Award size={28} />,
      title: "Certified Professional Coaches",
      description: "Work with certified trainers who map out custom training regimens and conduct routine checks on form and safety.",
      color: "var(--accent)"
    },
    {
      icon: <HeartPulse size={28} />,
      title: "Personalized Nutrition Plans",
      description: "Get individualized macro-breakdowns and nutrition suggestions tailored specifically to your metabolic profile and goals.",
      color: "var(--success)"
    },
    {
      icon: <Clipboard size={28} />,
      title: "Interactive Goal Tracking",
      description: "Define weight, muscle mass, and session targets, monitoring completion rings and logging historical benchmarks.",
      color: "var(--primary)"
    },
    {
      icon: <Activity size={28} />,
      title: "Workout Split Library",
      description: "Explore 8+ pre-designed workout splits mapping exact exercises, set ranges, rep targets, and rest timers.",
      color: "var(--accent)"
    },
    {
      icon: <Zap size={28} />,
      title: "Modern Premium Equipment",
      description: "Train on top-tier international strength and cardio platforms including Hammer Strength, Life Fitness, and CrossFit rigs.",
      color: "var(--success)"
    }
  ];

  return (
    <section style={{ padding: "6rem 0", backgroundColor: "var(--bg-secondary)" }}>
      <div className="container">
        <div style={{ textAlign: "center", marginBottom: "4rem" }}>
          <h2 style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>Why Choose AB Fitness?</h2>
          <p style={{ color: "var(--fg-secondary)", maxWidth: "600px", margin: "0 auto" }}>
            We provide a world-class training environment paired with state-of-the-art software systems to accelerate your growth.
          </p>
        </div>

        <div className="grid-responsive">
          {features.map((f, i) => (
            <div key={i} className="glass-card" style={{
              display: "flex",
              flexDirection: "column",
              gap: "1.25rem",
              position: "relative",
              overflow: "hidden"
            }}>
              {/* Top colored accent indicator */}
              <div style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "4px",
                height: "100%",
                backgroundColor: f.color
              }}></div>

              <div style={{
                width: "56px",
                height: "56px",
                borderRadius: "var(--radius-md)",
                backgroundColor: "rgba(255, 255, 255, 0.03)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: f.color,
                border: "1px solid var(--border)"
              }}>
                {f.icon}
              </div>

              <div>
                <h3 style={{ fontSize: "1.25rem", marginBottom: "0.5rem" }}>{f.title}</h3>
                <p style={{ color: "var(--fg-secondary)", fontSize: "0.95rem", lineHeight: "1.5" }}>{f.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
