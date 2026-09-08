import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ExercisesList from "@/components/ExercisesList";
import { db } from "@/lib/db";

export const metadata = {
  title: "Exercises Library | AB Fitness Gym",
  description: "Search our database of 20+ workout exercises with instructional steps, safety guidelines, and tips structured by muscle groups.",
};

async function getExercises() {
  try {
    const exercises = await db.exercise.findMany({
      orderBy: { name: "asc" }
    });
    return exercises;
  } catch (error) {
    console.error("Error fetching exercises:", error);
    return [];
  }
}

export default async function ExercisesPage() {
  const exercises = await getExercises();

  return (
    <>
      <Navbar />

      <main style={{ padding: "4rem 0", minHeight: "80vh" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: "4rem" }}>
            <h1 style={{ fontSize: "3rem", marginBottom: "1rem" }}>Exercises Library</h1>
            <p style={{ color: "var(--fg-secondary)", maxWidth: "600px", margin: "0 auto" }}>
              Explore step-by-step instructions and coaching tips for chest, back, shoulders, arms, legs, and core movements.
            </p>
          </div>

          <ExercisesList exercises={exercises} />
        </div>
      </main>

      <Footer />
    </>
  );
}
