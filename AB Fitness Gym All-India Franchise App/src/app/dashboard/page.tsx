import React from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  Sparkles,
  Flame,
  Target,
  History,
  TrendingUp,
  PlusCircle,
  Calendar,
  Search,
  BookOpen
} from "lucide-react";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  // Fetch all user information in one query
  const user = await db.user.findUnique({
    where: { id: session.user.id },
    include: {
      memberships: {
        include: { plan: true },
        orderBy: { createdAt: "desc" },
        take: 1
      },
      fitnessGoals: {
        where: { status: "ACTIVE" },
      },
      workoutLogs: {
        orderBy: { date: "desc" },
        take: 5
      }
    }
  });

  if (!user) {
    redirect("/login");
  }

  // Count total workouts completed
  const totalWorkouts = await db.workoutLog.count({
    where: { userId: user.id }
  });

  // Query exercise names to map in memory
  const exercises = await db.exercise.findMany({
    select: { id: true, name: true }
  });
  const exerciseMap = new Map(exercises.map(e => [e.id, e.name]));

  const activeMembership = user.memberships[0]?.status === "ACTIVE" ? user.memberships[0] : null;

  return (
    <div>
      {/* Welcome Banner */}
      <div className="glass-card" style={{
        background: "linear-gradient(135deg, rgba(225, 29, 72, 0.15) 0%, rgba(249, 115, 22, 0.05) 100%)",
        border: "1px solid rgba(225, 29, 72, 0.25)",
        padding: "2.5rem",
        marginBottom: "2.5rem",
        position: "relative"
      }}>
        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.25rem",
            color: "var(--primary)",
            fontSize: "0.825rem",
            fontWeight: "700",
            textTransform: "uppercase",
            marginBottom: "0.75rem",
            letterSpacing: "0.05em"
          }}>
            <Sparkles size={14} />
            Member Portal Active
          </div>
          <h1 style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>Hello, {user.name}</h1>
          <p style={{ color: "var(--fg-secondary)", maxWidth: "550px", fontSize: "1.05rem" }}>
            {activeMembership 
              ? `Your ${activeMembership.plan.name} is active. Welcome to AB Fitness Gym ${user.city}!`
              : "You do not have an active membership. Subscribe to a plan to start training!"
            }
          </p>
        </div>
      </div>

      {/* Summary Grid */}
      <div className="grid-responsive" style={{ marginBottom: "3rem" }}>
        {/* Membership Info */}
        <div className="glass-card" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div>
            <h3 style={{ fontSize: "0.875rem", color: "var(--fg-secondary)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.5rem" }}>
              Franchise Card
            </h3>
            {activeMembership ? (
              <div>
                <span className="badge badge-primary" style={{ marginBottom: "1rem" }}>
                  {activeMembership.plan.tier} Tier
                </span>
                <h4 style={{ fontSize: "1.5rem", fontWeight: "800", fontFamily: "monospace", letterSpacing: "0.05em" }}>
                  {activeMembership.cardNumber}
                </h4>
                <p style={{ fontSize: "0.825rem", color: "var(--fg-muted)", marginTop: "0.5rem" }}>
                  Expires on {new Date(activeMembership.endDate).toLocaleDateString()}
                </p>
              </div>
            ) : (
              <div>
                <span className="badge" style={{ marginBottom: "1rem" }}>No Membership</span>
                <p style={{ fontSize: "0.95rem", color: "var(--fg-secondary)", marginBottom: "1.5rem" }}>
                  Gain access to all our 25+ centers.
                </p>
                <Link href="/#pricing" className="btn btn-primary" style={{ padding: "0.5rem 1rem", fontSize: "0.825rem" }}>
                  Subscribe
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Active Goals */}
        <div className="glass-card">
          <h3 style={{ fontSize: "0.875rem", color: "var(--fg-secondary)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "1rem" }}>
            Active Milestones
          </h3>
          <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
            <div style={{
              width: "56px",
              height: "56px",
              borderRadius: "50%",
              backgroundColor: "rgba(249, 115, 22, 0.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--accent)"
            }}>
              <Target size={28} />
            </div>
            <div>
              <h4 style={{ fontSize: "2rem", fontWeight: "800" }}>{user.fitnessGoals.length}</h4>
              <p style={{ fontSize: "0.875rem", color: "var(--fg-secondary)" }}>Active Fitness Targets</p>
            </div>
          </div>
          <Link href="/dashboard/goals" style={{ display: "inline-block", fontSize: "0.825rem", color: "var(--primary)", marginTop: "1.5rem", fontWeight: "600" }}>
            Manage Goals →
          </Link>
        </div>

        {/* Workouts Completed */}
        <div className="glass-card">
          <h3 style={{ fontSize: "0.875rem", color: "var(--fg-secondary)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "1rem" }}>
            Logs Logged
          </h3>
          <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
            <div style={{
              width: "56px",
              height: "56px",
              borderRadius: "50%",
              backgroundColor: "rgba(16, 185, 129, 0.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--success)"
            }}>
              <Flame size={28} />
            </div>
            <div>
              <h4 style={{ fontSize: "2rem", fontWeight: "800" }}>{totalWorkouts}</h4>
              <p style={{ fontSize: "0.875rem", color: "var(--fg-secondary)" }}>Workout Sets Completed</p>
            </div>
          </div>
          <Link href="/dashboard/log" style={{ display: "inline-block", fontSize: "0.825rem", color: "var(--primary)", marginTop: "1.5rem", fontWeight: "600" }}>
            Log A Set →
          </Link>
        </div>
      </div>

      {/* Quick Action & Recent Timeline splits */}
      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1.8fr", gap: "2.5rem" }} className="db-layout-splits">
        {/* Left: Quick Actions */}
        <div>
          <h3 style={{ fontSize: "1.25rem", marginBottom: "1.5rem" }}>Quick Actions</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <Link href="/dashboard/log" className="glass-card" style={{
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              padding: "1.25rem"
            }}>
              <PlusCircle style={{ color: "var(--primary)" }} />
              <div>
                <h4 style={{ fontSize: "0.95rem" }}>Log a Set</h4>
                <p style={{ fontSize: "0.75rem", color: "var(--fg-secondary)" }}>Record weight and reps for your exercises</p>
              </div>
            </Link>

            <Link href="/dashboard/goals" className="glass-card" style={{
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              padding: "1.25rem"
            }}>
              <Target style={{ color: "var(--accent)" }} />
              <div>
                <h4 style={{ fontSize: "0.95rem" }}>Update Goals</h4>
                <p style={{ fontSize: "0.75rem", color: "var(--fg-secondary)" }}>Set new targets or update active goals progress</p>
              </div>
            </Link>

            <Link href="/dashboard/progress" className="glass-card" style={{
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              padding: "1.25rem"
            }}>
              <TrendingUp style={{ color: "var(--success)" }} />
              <div>
                <h4 style={{ fontSize: "0.95rem" }}>Track Body Stats</h4>
                <p style={{ fontSize: "0.75rem", color: "var(--fg-secondary)" }}>Log body weight, fat percentage, and measurements</p>
              </div>
            </Link>

            <Link href="/workouts" className="glass-card" style={{
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              padding: "1.25rem"
            }}>
              <BookOpen style={{ color: "var(--primary)" }} />
              <div>
                <h4 style={{ fontSize: "0.95rem" }}>Browse Splits</h4>
                <p style={{ fontSize: "0.75rem", color: "var(--fg-secondary)" }}>Find predefined workout plans and exercises</p>
              </div>
            </Link>
          </div>
        </div>

        {/* Right: Recent Exercise Logs */}
        <div>
          <h3 style={{ fontSize: "1.25rem", marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <History size={20} />
            Recent Exercise Logs
          </h3>

          <div className="glass-card" style={{ padding: "2rem" }}>
            {user.workoutLogs.length === 0 ? (
              <div style={{ textAlign: "center", padding: "2rem 0", color: "var(--fg-secondary)" }}>
                <Calendar size={40} style={{ color: "var(--border)", marginBottom: "1rem" }} />
                <p>No workouts logged yet. Start recording your sessions!</p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                {user.workoutLogs.map((log) => (
                  <div key={log.id} style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    borderBottom: "1px solid var(--border)",
                    paddingBottom: "1rem"
                  }} className="log-row">
                    <div>
                      <h4 style={{ fontSize: "1.05rem" }}>
                        {exerciseMap.get(log.exerciseId) || "Exercise"}
                      </h4>
                      <div style={{ display: "flex", gap: "1rem", fontSize: "0.825rem", color: "var(--fg-secondary)", marginTop: "0.25rem" }}>
                        <span>Sets: <strong>{log.sets}</strong></span>
                        <span>Reps: <strong>{log.reps}</strong></span>
                        <span>Weight: <strong>{log.weight} kg</strong></span>
                      </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <span style={{ fontSize: "0.8rem", color: "var(--fg-muted)" }}>
                        {new Date(log.date).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                      </span>
                      {log.notes && (
                        <p style={{ fontSize: "0.75rem", fontStyle: "italic", color: "var(--fg-secondary)", marginTop: "0.25rem" }}>
                          {log.notes}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
                <Link href="/dashboard/log" style={{ alignSelf: "center", fontSize: "0.875rem", color: "var(--primary)", fontWeight: "600" }}>
                  View All Logged Sets →
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

    </div>
  );
}
