import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { Clock, Flame, Dumbbell, Award, ArrowLeft, HeartPulse, CheckCircle2 } from "lucide-react";
import Link from "next/link";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function WorkoutDetailPage({ params }: PageProps) {
  const { id } = await params;

  const workout = await db.workoutPlan.findUnique({
    where: { id },
    include: {
      exercises: {
        include: { exercise: true },
        orderBy: { order: "asc" }
      }
    }
  });

  if (!workout) {
    notFound();
  }

  return (
    <>
      <Navbar />

      <main style={{ padding: "3rem 0 6rem 0", minHeight: "80vh" }}>
        <div className="container" style={{ maxWidth: "900px" }}>
          {/* Back button */}
          <Link href="/workouts" style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            color: "var(--fg-secondary)",
            fontSize: "0.95rem",
            marginBottom: "2rem"
          }} className="footer-link">
            <ArrowLeft size={16} />
            Back to Routines
          </Link>

          {/* Banner Block */}
          <div className="glass-card" style={{
            padding: 0,
            overflow: "hidden",
            border: "1px solid var(--border)",
            marginBottom: "3rem"
          }}>
            <div style={{
              height: "300px",
              backgroundImage: `url('${workout.imageUrl || "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=1000&auto=format&fit=crop&q=80"}')`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              position: "relative"
            }}>
              <div style={{
                position: "absolute",
                top: 0, left: 0, right: 0, bottom: 0,
                background: "linear-gradient(to top, rgba(9, 9, 14, 0.95) 0%, rgba(9, 9, 14, 0.4) 100%)"
              }}></div>
            </div>

            <div style={{ padding: "2.5rem", marginTop: "-100px", position: "relative", zIndex: 2 }}>
              <div style={{ display: "flex", gap: "0.75rem", marginBottom: "0.75rem", flexWrap: "wrap" }}>
                <span className="badge badge-primary">{workout.category}</span>
                <span className="badge badge-accent" style={{
                  color: workout.difficulty === "Advanced" ? "#f43f5e" : workout.difficulty === "Intermediate" ? "#fbbf24" : "#10b981",
                  borderColor: "rgba(255,255,255,0.1)"
                }}>
                  {workout.difficulty}
                </span>
              </div>

              <h1 style={{ fontSize: "2.75rem", marginBottom: "1rem" }}>{workout.name}</h1>
              <p style={{ color: "var(--fg-secondary)", fontSize: "1.1rem", lineHeight: "1.6", marginBottom: "2rem" }}>
                {workout.description}
              </p>

              {/* Workout Stats Grid */}
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: "1.5rem",
                borderTop: "1px solid var(--border)",
                paddingTop: "1.5rem"
              }} className="stats-grid-row">
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <Clock size={20} style={{ color: "var(--accent)" }} />
                  <div>
                    <span style={{ fontSize: "0.75rem", color: "var(--fg-secondary)", display: "block" }}>Duration</span>
                    <strong>{workout.duration} Minutes</strong>
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <Flame size={20} style={{ color: "var(--primary)" }} />
                  <div>
                    <span style={{ fontSize: "0.75rem", color: "var(--fg-secondary)", display: "block" }}>Est. Burn</span>
                    <strong>{workout.calories} Calories</strong>
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <Dumbbell size={20} style={{ color: "var(--success)" }} />
                  <div>
                    <span style={{ fontSize: "0.75rem", color: "var(--fg-secondary)", display: "block" }}>Total Exercises</span>
                    <strong>{workout.exercises.length} Exercises</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Exercises list */}
          <h2 style={{ fontSize: "1.75rem", marginBottom: "1.5rem" }}>Exercise Timeline</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
            {workout.exercises.map((we, index) => {
              const ex = we.exercise;
              const parsedTips = JSON.parse(ex.tips) as string[];

              return (
                <div key={we.id} className="glass-card exercise-detail-card" style={{
                  display: "flex",
                  gap: "2rem",
                  padding: "2rem",
                  border: "1px solid var(--border)"
                }}>
                  {/* Left Number Index */}
                  <div style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "50%",
                    backgroundColor: "rgba(225, 29, 72, 0.15)",
                    border: "1px solid var(--primary)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "var(--fg-primary)",
                    fontWeight: "800",
                    fontSize: "1.25rem",
                    flexShrink: 0
                  }}>
                    {index + 1}
                  </div>

                  {/* Right Details */}
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap", gap: "0.5rem", marginBottom: "0.75rem" }}>
                      <h3 style={{ fontSize: "1.35rem", fontWeight: "700" }}>{ex.name}</h3>
                      <div style={{ display: "flex", gap: "0.5rem" }}>
                        <span className="badge" style={{ fontSize: "0.7rem" }}>{ex.equipment}</span>
                        <span className="badge badge-accent" style={{ fontSize: "0.7rem" }}>{ex.muscleGroup}</span>
                      </div>
                    </div>

                    {/* Prescriptions grid */}
                    <div style={{
                      display: "flex",
                      gap: "2rem",
                      fontSize: "0.875rem",
                      color: "var(--fg-secondary)",
                      padding: "0.5rem 1rem",
                      backgroundColor: "rgba(255,255,255,0.02)",
                      border: "1px solid var(--border)",
                      borderRadius: "var(--radius-md)",
                      marginBottom: "1.25rem",
                      width: "fit-content"
                    }} className="prescriptions-row">
                      <span>Sets: <strong style={{ color: "white" }}>{we.sets}</strong></span>
                      <span>Reps: <strong style={{ color: "white" }}>{we.reps}</strong></span>
                      <span>Rest: <strong style={{ color: "white" }}>{we.restSeconds}s</strong></span>
                    </div>

                    {/* Instructions */}
                    <div style={{ marginBottom: "1rem" }}>
                      <h4 style={{ fontSize: "0.95rem", color: "var(--fg-primary)", marginBottom: "0.35rem" }}>Instructions</h4>
                      <p style={{ fontSize: "0.9rem", color: "var(--fg-secondary)", lineHeight: "1.5", whiteSpace: "pre-line" }}>
                        {ex.instructions}
                      </p>
                    </div>

                    {/* Tips */}
                    {parsedTips.length > 0 && (
                      <div>
                        <h4 style={{ fontSize: "0.95rem", color: "var(--fg-primary)", marginBottom: "0.35rem" }}>Key Tips</h4>
                        <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                          {parsedTips.map((tip, idx) => (
                            <li key={idx} style={{ display: "flex", gap: "0.5rem", alignItems: "center", fontSize: "0.85rem", color: "var(--fg-secondary)" }}>
                              <CheckCircle2 size={12} style={{ color: "var(--success)" }} />
                              {tip}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>

      <Footer />

    </>
  );
}
