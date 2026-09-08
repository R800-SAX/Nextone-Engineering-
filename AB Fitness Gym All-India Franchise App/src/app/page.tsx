import React from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import FeaturesGrid from "@/components/FeaturesGrid";
import PricingCards from "@/components/PricingCards";
import Footer from "@/components/Footer";
import { db } from "@/lib/db";
import { MapPin, Star, Sparkles, MessageSquare } from "lucide-react";
import Link from "next/link";

// Server side data fetching in Next.js Server Component
async function getPlans() {
  try {
    const plans = await db.plan.findMany({
      where: { active: true },
      orderBy: { price: "asc" },
    });
    return plans;
  } catch (error) {
    console.error("Error fetching plans:", error);
    return [];
  }
}

export default async function HomePage() {
  const plans = await getPlans();

  const reviews = [
    {
      name: "Rohan Sharma",
      city: "Mumbai",
      comment: "The Gold membership is worth every rupee. I frequently travel between Mumbai and Bangalore for business, and having access to high-end gyms in both cities is a lifesaver.",
      rating: 5
    },
    {
      name: "Pooja Malhotra",
      city: "Delhi",
      comment: "Absolutely love the CrossFit zones and the Steam rooms! The trainers are super friendly and highly qualified. The workout logging app makes it easy to stick to my plans.",
      rating: 5
    },
    {
      name: "Vikram Reddy",
      city: "Bengaluru",
      comment: "Joining the Platinum plan was the best decision. The personal trainers and custom nutrition templates helped me lose 12kg of body fat in 3 months! Strongly recommended.",
      rating: 5
    }
  ];

  return (
    <>
      <Navbar />
      
      {/* 1. Hero Banner */}
      <HeroSection />

      {/* 2. Brand Value Features */}
      <FeaturesGrid />

      {/* 3. Pricing Tiers */}
      <section id="pricing" style={{ padding: "6rem 0", position: "relative" }}>
        <div style={{
          position: "absolute",
          width: "40vw",
          height: "40vw",
          borderRadius: "50%",
          background: "radial-gradient(circle, var(--primary-glow) 0%, transparent 70%)",
          top: "10%",
          left: "30%",
          pointerEvents: "none",
          zIndex: 0
        }}></div>

        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          <div style={{ textAlign: "center", marginBottom: "4rem" }}>
            <div style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.25rem",
              background: "rgba(249, 115, 22, 0.1)",
              border: "1px solid rgba(249, 115, 22, 0.2)",
              padding: "0.4rem 0.8rem",
              borderRadius: "var(--radius-xl)",
              marginBottom: "1rem",
              fontSize: "0.825rem",
              fontWeight: "600",
              color: "#fed7aa"
            }}>
              <Sparkles size={12} style={{ color: "var(--accent)" }} />
              Flexible Pricing
            </div>
            <h2 style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>Franchise Subscriptions</h2>
            <p style={{ color: "var(--fg-secondary)", maxWidth: "600px", margin: "0 auto" }}>
              Choose a subscription tier that matches your goals. Upgrade, downgrade, or cancel at any time.
            </p>
          </div>

          <PricingCards plans={plans} />
        </div>
      </section>

      {/* 4. Franchise Map City List Preview */}
      <section style={{ padding: "6rem 0", backgroundColor: "var(--bg-secondary)", borderTop: "1px solid var(--border)" }}>
        <div className="container">
          <div style={{
            display: "grid",
            gridTemplateColumns: "1.2fr 1fr",
            gap: "4rem",
            alignItems: "center"
          }} className="map-grid">
            <div>
              <div style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.25rem",
                background: "rgba(16, 185, 129, 0.1)",
                border: "1px solid rgba(16, 185, 129, 0.2)",
                padding: "0.4rem 0.8rem",
                borderRadius: "var(--radius-xl)",
                marginBottom: "1rem",
                fontSize: "0.825rem",
                fontWeight: "600",
                color: "#a7f3d0"
              }}>
                <MapPin size={12} style={{ color: "var(--success)" }} />
                Nationwide Coverage
              </div>
              <h2 style={{ fontSize: "2.5rem", marginBottom: "1.5rem" }}>Find Us In Your City</h2>
              <p style={{ color: "var(--fg-secondary)", marginBottom: "2rem", lineHeight: "1.6" }}>
                AB Fitness operates in 25+ flagship zones spanning the largest economic centers in India. Every single branch offers custom cardio layouts, high-intensity CrossFit platforms, and elite steam facilities.
              </p>
              
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: "1rem",
                marginBottom: "2.5rem"
              }} className="cities-list">
                {["Mumbai", "Delhi", "Bengaluru", "Pune", "Hyderabad", "Chennai", "Ahmedabad", "Kolkata", "Gurugram"].map((city) => (
                  <div key={city} style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    color: "var(--fg-primary)",
                    fontSize: "0.95rem"
                  }}>
                    <div style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "var(--primary)" }}></div>
                    {city}
                  </div>
                ))}
              </div>

              <Link href="/locations" className="btn btn-primary">
                View All 25+ Locations
              </Link>
            </div>

            {/* Simulated Map Graphic */}
            <div className="glass-card" style={{
              padding: "2rem",
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              minHeight: "350px",
              background: "linear-gradient(135deg, rgba(20,20,28,0.8) 0%, rgba(9,9,14,0.9) 100%)",
              border: "1px solid var(--border)",
              position: "relative"
            }}>
              {/* Abstract geographical shapes */}
              <div style={{
                width: "250px",
                height: "250px",
                borderRadius: "50%",
                border: "1px dashed rgba(255, 255, 255, 0.08)",
                position: "absolute",
                animation: "pulse-orbit 8s linear infinite"
              }}></div>
              
              <MapPin size={48} style={{ color: "var(--primary)", marginBottom: "1.5rem", filter: "drop-shadow(0 0 10px var(--primary))" }} />
              <h3 style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>All-India Network</h3>
              <p style={{ color: "var(--fg-secondary)", fontSize: "0.9rem", maxWidth: "280px" }}>
                Interactive location search maps showing equipment availability, crowd levels, and timings.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Testimonials Review Slider */}
      <section style={{ padding: "6rem 0" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: "4rem" }}>
            <div style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.25rem",
              background: "rgba(225, 29, 72, 0.1)",
              border: "1px solid rgba(225, 29, 72, 0.2)",
              padding: "0.4rem 0.8rem",
              borderRadius: "var(--radius-xl)",
              marginBottom: "1rem",
              fontSize: "0.825rem",
              fontWeight: "600",
              color: "#fda4af"
            }}>
              <MessageSquare size={12} style={{ color: "var(--primary)" }} />
              Member Reviews
            </div>
            <h2 style={{ fontSize: "2.5rem" }}>What Members Say</h2>
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "2.5rem"
          }}>
            {reviews.map((r, i) => (
              <div key={i} className="glass-card" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", gap: "1.5rem" }}>
                <p style={{ fontStyle: "italic", color: "var(--fg-secondary)", lineHeight: "1.6" }}>
                  "{r.comment}"
                </p>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <h4 style={{ fontSize: "1.05rem" }}>{r.name}</h4>
                    <span style={{ fontSize: "0.8rem", color: "var(--fg-muted)" }}>{r.city} Member</span>
                  </div>
                  <div style={{ display: "flex", gap: "0.1rem", color: "#f59e0b" }}>
                    {Array.from({ length: r.rating }).map((_, idx) => (
                      <Star key={idx} size={14} fill="#f59e0b" />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />

    </>
  );
}
