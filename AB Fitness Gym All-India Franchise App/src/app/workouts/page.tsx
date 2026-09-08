import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { db } from "@/lib/db";
import { Clock, Flame, Dumbbell, Award, HelpCircle } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Workout Plans | AB Fitness Gym",
  description: "Browse pre-designed workout splits and conditioning routines built by our expert coaching panel.",
};

async function getWorkoutPlans() {
  try {
    const plans = await db.workoutPlan.findMany({
      orderBy: { name: "asc" }
    });
    return plans;
  } catch (error) {
    console.error("Error fetching workout plans:", error);
    return [];
  }
}

export default async function WorkoutsPage() {
  const plans = await getWorkoutPlans();

  return (
    <>
      <Navbar />

      <main style={{ padding: "4rem 0", minHeight: "80vh" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: "4rem" }}>
            <h1 style={{ fontSize: "3rem", marginBottom: "1rem" }}>Training Routines</h1>
            <p style={{ color: "var(--fg-secondary)", maxWidth: "600px", margin: "0 auto" }}>
              Unlock high-performance training regimens. Choose a split below to view exercise order, set guidelines, and form cues.
            </p>
          </div>

          {plans.length === 0 ? (
            <div className="glass-card" style={{ padding: "4rem 2rem", textAlign: "center", color: "var(--fg-secondary)" }}>
              <Dumbbell size={48} style={{ color: "var(--border)", marginBottom: "1rem" }} />
              <p>No workout plans found in database.</p>
            </div>
          ) : (
            <div className="grid-responsive">
              {plans.map((p) => (
                <div key={p.id} className="glass-card" style={{
                  padding: 0,
                  overflow: "hidden",
                  display: "flex",
                  flexDirection: "column",
                  border: "1px solid var(--border)",
                  justifyContent: "space-between"
                }}>
                  {/* Header image */}
                  <div style={{
                    height: "180px",
                    backgroundImage: `url('${p.imageUrl || "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&auto=format&fit=crop&q=60"}')`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    position: "relative"
                  }}>
                    {/* Difficulty Pill */}
                    <div style={{
                      position: "absolute",
                      top: "1rem",
                      right: "1rem",
                      backgroundColor: "rgba(9, 9, 14, 0.85)",
                      backdropFilter: "blur(4px)",
                      padding: "0.25rem 0.75rem",
                      borderRadius: "var(--radius-sm)",
                      fontSize: "0.75rem",
                      fontWeight: "700",
                      color: p.difficulty === "Advanced" ? "var(--primary)" : p.difficulty === "Intermediate" ? "var(--accent)" : "var(--success)"
                    }}>
                      {p.difficulty}
                    </div>

                    {/* Category Label */}
                    <div style={{
                      position: "absolute",
                      bottom: "1rem",
                      left: "1rem",
                      backgroundColor: "rgba(255, 255, 255, 0.08)",
                      backdropFilter: "blur(4px)",
                      padding: "0.2rem 0.75rem",
                      borderRadius: "var(--radius-sm)",
                      fontSize: "0.75rem",
                      fontWeight: "600",
                      border: "1px solid rgba(255,255,255,0.1)"
                    }}>
                      {p.category}
                    </div>
                  </div>

                  {/* Body Content */}
                  <div style={{ padding: "1.5rem 2rem", display: "flex", flexDirection: "column", justifyContent: "space-between", flex: 1 }}>
                    <div style={{ marginBottom: "1.5rem" }}>
                      <h3 style={{ fontSize: "1.35rem", marginBottom: "0.5rem" }}>{p.name}</h3>
                      <p style={{ color: "var(--fg-secondary)", fontSize: "0.9rem", lineHeight: "1.4" }}>
                        {p.description}
                      </p>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                      {/* Stats */}
                      <div style={{
                        display: "flex",
                        justifyContent: "space-between",
                        padding: "0.75rem 1rem",
                        backgroundColor: "rgba(255,255,255,0.02)",
                        border: "1px solid var(--border)",
                        borderRadius: "var(--radius-md)",
                        fontSize: "0.825rem",
                        color: "var(--fg-secondary)"
                      }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
                          <Clock size={16} style={{ color: "var(--accent)" }} />
                          <span>{p.duration} mins</span>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
                          <Flame size={16} style={{ color: "var(--primary)" }} />
                          <span>{p.calories} kcal</span>
                        </div>
                      </div>

                      {/* CTA */}
                      <Link href={`/workouts/${p.id}`} className="btn btn-primary" style={{ width: "100%", justifyContent: "center" }}>
                        View Full Routine
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}
