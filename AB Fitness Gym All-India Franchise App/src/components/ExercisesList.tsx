'use client';

import React, { useState } from "react";
import { Search, Dumbbell, ShieldAlert, Award, FileText, X, Sparkles } from "lucide-react";

interface ExerciseProps {
  id: string;
  name: string;
  slug: string;
  muscleGroup: string;
  equipment: string;
  difficulty: string;
  instructions: string;
  tips: string; // JSON string list
  videoUrl: string | null;
  imageUrl: string | null;
}

export default function ExercisesList({ exercises }: { exercises: ExerciseProps[] }) {
  const [search, setSearch] = useState("");
  const [selectedMuscle, setSelectedMuscle] = useState("All");
  const [selectedEquipment, setSelectedEquipment] = useState("All");
  const [activeExercise, setActiveExercise] = useState<ExerciseProps | null>(null);

  const muscles = ["All", ...Array.from(new Set(exercises.map((ex) => ex.muscleGroup)))];
  const equipments = ["All", ...Array.from(new Set(exercises.map((ex) => ex.equipment)))];

  const filteredExercises = exercises.filter((ex) => {
    const matchesSearch = 
      ex.name.toLowerCase().includes(search.toLowerCase()) ||
      ex.instructions.toLowerCase().includes(search.toLowerCase());

    const matchesMuscle = selectedMuscle === "All" || ex.muscleGroup === selectedMuscle;
    const matchesEquipment = selectedEquipment === "All" || ex.equipment === selectedEquipment;

    return matchesSearch && matchesMuscle && matchesEquipment;
  });

  return (
    <div style={{ position: "relative" }}>
      {/* Exercise Detail Modal */}
      {activeExercise && (
        <div style={{
          position: "fixed",
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.85)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
          padding: "1.5rem",
          backdropFilter: "blur(6px)"
        }}>
          <div className="glass-card" style={{
            maxWidth: "600px",
            width: "100%",
            padding: "2.5rem",
            maxHeight: "90vh",
            overflowY: "auto",
            position: "relative",
            border: "1px solid var(--primary-glow)"
          }}>
            <button
              onClick={() => setActiveExercise(null)}
              style={{
                position: "absolute",
                top: "1.5rem",
                right: "1.5rem",
                cursor: "pointer",
                color: "var(--fg-secondary)",
                padding: "0.25rem"
              }}
            >
              <X size={24} />
            </button>

            <div style={{ marginBottom: "1.5rem" }}>
              <span className="badge badge-primary" style={{ marginBottom: "0.5rem" }}>
                {activeExercise.muscleGroup}
              </span>
              <h3 style={{ fontSize: "1.75rem", fontWeight: "800" }}>{activeExercise.name}</h3>
              <div style={{ display: "flex", gap: "1rem", fontSize: "0.875rem", color: "var(--fg-secondary)", marginTop: "0.5rem" }}>
                <span>Equipment: <strong>{activeExercise.equipment}</strong></span>
                <span>Difficulty: <strong>{activeExercise.difficulty}</strong></span>
              </div>
            </div>

            <div style={{ marginBottom: "1.5rem" }}>
              <h4 style={{ fontSize: "1.1rem", marginBottom: "0.5rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <FileText size={18} style={{ color: "var(--primary)" }} />
                Instructions
              </h4>
              <p style={{
                color: "var(--fg-secondary)",
                fontSize: "0.95rem",
                lineHeight: "1.6",
                whiteSpace: "pre-line",
                backgroundColor: "rgba(255,255,255,0.02)",
                padding: "1rem",
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--border)"
              }}>
                {activeExercise.instructions}
              </p>
            </div>

            <div>
              <h4 style={{ fontSize: "1.1rem", marginBottom: "0.5rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <Sparkles size={18} style={{ color: "var(--accent)" }} />
                Coach's Tips
              </h4>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                {(JSON.parse(activeExercise.tips) as string[]).map((tip, idx) => (
                  <li key={idx} style={{
                    display: "flex",
                    gap: "0.5rem",
                    fontSize: "0.9rem",
                    color: "var(--fg-secondary)"
                  }}>
                    <span style={{ color: "var(--accent)" }}>•</span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Filter Options */}
      <div className="glass-card" style={{
        padding: "2rem",
        marginBottom: "3rem",
        display: "flex",
        flexDirection: "column",
        gap: "1.5rem"
      }}>
        {/* Search */}
        <div style={{ position: "relative", width: "100%" }}>
          <Search size={20} style={{
            position: "absolute",
            left: "1rem",
            top: "50%",
            transform: "translateY(-50%)",
            color: "var(--fg-muted)"
          }} />
          <input
            type="text"
            className="form-control"
            placeholder="Search exercises by name or instructions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: "100%", paddingLeft: "3rem" }}
          />
        </div>

        {/* Double Dropdown Filters */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "1.5rem"
        }} className="grid-responsive">
          <div className="form-group">
            <label>Muscle Group</label>
            <select
              className="form-control"
              value={selectedMuscle}
              onChange={(e) => setSelectedMuscle(e.target.value)}
              style={{ backgroundColor: "var(--bg-secondary)", cursor: "pointer" }}
            >
              {muscles.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Equipment Type</label>
            <select
              className="form-control"
              value={selectedEquipment}
              onChange={(e) => setSelectedEquipment(e.target.value)}
              style={{ backgroundColor: "var(--bg-secondary)", cursor: "pointer" }}
            >
              {equipments.map((eq) => (
                <option key={eq} value={eq}>{eq}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div style={{ marginBottom: "2rem", color: "var(--fg-secondary)" }}>
        Found <strong>{filteredExercises.length}</strong> matching exercises
      </div>

      {/* Exercises Grid */}
      {filteredExercises.length === 0 ? (
        <div className="glass-card" style={{ padding: "4rem 2rem", textAlign: "center", color: "var(--fg-secondary)" }}>
          <Dumbbell size={48} style={{ color: "var(--border)", marginBottom: "1rem" }} />
          <p>No exercises match your filter settings. Try adjusting the search or category.</p>
        </div>
      ) : (
        <div className="grid-responsive" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))" }}>
          {filteredExercises.map((ex) => (
            <div
              key={ex.id}
              onClick={() => setActiveExercise(ex)}
              className="glass-card"
              style={{
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                padding: "2rem",
                border: "1px solid var(--border)",
                transition: "var(--transition)"
              }}
            >
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem" }}>
                  <span className="badge badge-primary" style={{ fontSize: "0.7rem" }}>
                    {ex.muscleGroup}
                  </span>
                  <span style={{ fontSize: "0.75rem", color: "var(--fg-muted)", fontWeight: "600" }}>
                    {ex.difficulty}
                  </span>
                </div>
                <h3 style={{ fontSize: "1.2rem", marginBottom: "0.5rem" }}>{ex.name}</h3>
                <p style={{
                  color: "var(--fg-secondary)",
                  fontSize: "0.85rem",
                  lineHeight: "1.4",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  marginBottom: "1.5rem"
                }}>
                  {ex.instructions}
                </p>
              </div>

              <div style={{
                borderTop: "1px solid var(--border)",
                paddingTop: "1rem",
                fontSize: "0.75rem",
                color: "var(--fg-muted)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
              }}>
                <span>Eq: <strong>{ex.equipment}</strong></span>
                <span style={{ color: "var(--primary)", fontWeight: "600" }}>View Details →</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
