'use client';

import React, { useState, useEffect } from "react";
import { PlusCircle, ClipboardList, Trash2, Calendar, MessageSquare, Dumbbell, Loader2 } from "lucide-react";

interface ExerciseInfo {
  id: string;
  name: string;
  muscleGroup: string;
}

interface LogEntry {
  id: string;
  exerciseId: string;
  sets: number;
  reps: number;
  weight: number;
  notes: string | null;
  date: string;
}

export default function WorkoutLogForm({ exercises }: { exercises: ExerciseInfo[] }) {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);

  // Form Fields
  const [exerciseId, setExerciseId] = useState("");
  const [sets, setSets] = useState("");
  const [reps, setReps] = useState("");
  const [weight, setWeight] = useState("");
  const [notes, setNotes] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [formLoading, setFormLoading] = useState(false);

  const fetchLogs = async () => {
    try {
      const res = await fetch("/api/workout-log");
      if (res.ok) {
        const data = await res.json();
        setLogs(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const handleLogSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!exerciseId || !sets || !reps || !weight || !date) return;

    setFormLoading(true);
    try {
      const res = await fetch("/api/workout-log", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          exerciseId,
          sets,
          reps,
          weight,
          notes,
          date,
        }),
      });

      if (res.ok) {
        setSets("");
        setReps("");
        setWeight("");
        setNotes("");
        fetchLogs();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteLog = async (id: string) => {
    if (!confirm("Are you sure you want to delete this log entry?")) return;

    try {
      const res = await fetch(`/api/workout-log?id=${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        fetchLogs();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Map exercises in memory for fast lookup
  const exerciseMap = new Map(exercises.map((e) => [e.id, e]));

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1.8fr", gap: "3rem" }} className="db-layout-splits">
      {/* Left: Log Form */}
      <div>
        <h3 style={{ fontSize: "1.25rem", marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <PlusCircle size={20} style={{ color: "var(--primary)" }} />
          Log Exercise Set
        </h3>

        <div className="glass-card" style={{ padding: "2rem" }}>
          <form onSubmit={handleLogSubmit}>
            <div className="form-group">
              <label htmlFor="exerciseSelect">Select Exercise</label>
              <select
                id="exerciseSelect"
                className="form-control"
                value={exerciseId}
                onChange={(e) => setExerciseId(e.target.value)}
                style={{ backgroundColor: "var(--bg-secondary)", cursor: "pointer" }}
                required
              >
                <option value="" disabled>Choose from library...</option>
                {exercises.map((ex) => (
                  <option key={ex.id} value={ex.id}>
                    {ex.name} ({ex.muscleGroup})
                  </option>
                ))}
              </select>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem" }}>
              <div className="form-group">
                <label htmlFor="setsInput">Sets Count</label>
                <input
                  id="setsInput"
                  type="number"
                  min="1"
                  className="form-control"
                  placeholder="e.g. 4"
                  value={sets}
                  onChange={(e) => setSets(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="repsInput">Reps Count</label>
                <input
                  id="repsInput"
                  type="number"
                  min="1"
                  className="form-control"
                  placeholder="e.g. 10"
                  value={reps}
                  onChange={(e) => setReps(e.target.value)}
                  required
                />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem" }}>
              <div className="form-group">
                <label htmlFor="weightInput">Weight (kg)</label>
                <input
                  id="weightInput"
                  type="number"
                  step="0.5"
                  className="form-control"
                  placeholder="e.g. 60"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="dateInput">Date</label>
                <input
                  id="dateInput"
                  type="date"
                  className="form-control"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: "2rem" }}>
              <label htmlFor="notesInput">Notes / Form Cues</label>
              <textarea
                id="notesInput"
                className="form-control"
                placeholder="e.g. Felt heavy, slight lift assist on 4th set"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                style={{ resize: "none" }}
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={formLoading}
              style={{ width: "100%", justifyContent: "center" }}
            >
              {formLoading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                "Log Training Set"
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Right: History List */}
      <div>
        <h3 style={{ fontSize: "1.25rem", marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <ClipboardList size={20} style={{ color: "var(--accent)" }} />
          Training History Logs
        </h3>

        <div className="glass-card" style={{ padding: "2rem" }}>
          {loading ? (
            <div style={{ textAlign: "center", padding: "2rem 0" }}>
              <Loader2 size={24} className="animate-spin" style={{ color: "var(--fg-muted)" }} />
            </div>
          ) : logs.length === 0 ? (
            <div style={{ textAlign: "center", padding: "2rem 0", color: "var(--fg-secondary)" }}>
              <Dumbbell size={36} style={{ color: "var(--border)", marginBottom: "1rem" }} />
              <p>No sets logged yet. Complete the form to start logging.</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              {logs.map((log) => {
                const ex = exerciseMap.get(log.exerciseId);
                return (
                  <div key={log.id} style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    borderBottom: "1px solid var(--border)",
                    paddingBottom: "1rem"
                  }} className="log-row">
                    <div>
                      <h4 style={{ fontSize: "1.05rem" }}>{ex?.name || "Exercise"}</h4>
                      <div style={{ display: "flex", gap: "1rem", fontSize: "0.825rem", color: "var(--fg-secondary)", marginTop: "0.25rem" }}>
                        <span className="badge" style={{ fontSize: "0.6rem", padding: "0.1rem 0.4rem" }}>
                          {ex?.muscleGroup || "Body"}
                        </span>
                        <span>Sets: <strong>{log.sets}</strong></span>
                        <span>Reps: <strong>{log.reps}</strong></span>
                        <span>Weight: <strong>{log.weight} kg</strong></span>
                      </div>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.25rem", fontSize: "0.8rem", color: "var(--fg-muted)" }}>
                          <Calendar size={12} />
                          {new Date(log.date).toLocaleDateString()}
                        </div>
                        {log.notes && (
                          <div style={{ display: "flex", alignItems: "center", gap: "0.25rem", fontSize: "0.75rem", fontStyle: "italic", color: "var(--fg-secondary)", marginTop: "0.25rem" }}>
                            <MessageSquare size={10} />
                            {log.notes}
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => handleDeleteLog(log.id)}
                        style={{ cursor: "pointer", color: "var(--fg-muted)", padding: "0.25rem" }}
                        className="sidebar-link-hover-danger"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <style jsx global>{`
        .animate-spin {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
