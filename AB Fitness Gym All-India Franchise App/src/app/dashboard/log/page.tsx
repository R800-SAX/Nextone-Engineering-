import React from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import WorkoutLogForm from "@/components/WorkoutLogForm";

export const metadata = {
  title: "Workout Logger | AB Fitness Gym",
  description: "Log your weight training sets and track historical stats.",
};

export default async function LogPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  // Fetch exercises list for selection
  const exercises = await db.exercise.findMany({
    select: { id: true, name: true, muscleGroup: true },
    orderBy: { name: "asc" }
  });

  return (
    <div>
      <div style={{ marginBottom: "2.5rem" }}>
        <h1 style={{ fontSize: "2.25rem", marginBottom: "0.5rem" }}>Workout Logger</h1>
        <p style={{ color: "var(--fg-secondary)" }}>Record your reps and sets to monitor progressive overload progression</p>
      </div>

      <WorkoutLogForm exercises={exercises} />
    </div>
  );
}
