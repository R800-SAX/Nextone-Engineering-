'use client';

import React, { useState, useEffect } from "react";
import { Plus, Target, CheckCircle2, Archive, Trash2, Calendar, Edit2, Loader2, RefreshCw } from "lucide-react";

interface Goal {
  id: string;
  type: string;
  title: string;
  target: number;
  current: number;
  unit: string;
  deadline: string;
  status: string;
}

export default function GoalsPage() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Form State
  const [showAddForm, setShowAddForm] = useState(false);
  const [title, setTitle] = useState("");
  const [type, setType] = useState("Weight");
  const [target, setTarget] = useState("");
  const [current, setCurrent] = useState("");
  const [unit, setUnit] = useState("kg");
  const [deadline, setDeadline] = useState("");
  const [formLoading, setFormLoading] = useState(false);

  // Edit State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editCurrent, setEditCurrent] = useState("");

  const fetchGoals = async () => {
    try {
      const res = await fetch("/api/goals");
      if (res.ok) {
        const data = await res.json();
        setGoals(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  const handleAddGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !target || !current || !unit || !deadline) return;

    setFormLoading(true);
    try {
      const res = await fetch("/api/goals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          type,
          target: parseFloat(target),
          current: parseFloat(current),
          unit,
          deadline,
        }),
      });

      if (res.ok) {
        // Reset form
        setTitle("");
        setTarget("");
        setCurrent("");
        setDeadline("");
        setShowAddForm(false);
        fetchGoals();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setFormLoading(false);
    }
  };

  const handleUpdateProgress = async (id: string) => {
    if (!editCurrent) return;

    try {
      const res = await fetch("/api/goals", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          current: parseFloat(editCurrent),
        }),
      });

      if (res.ok) {
        setEditingId(null);
        setEditCurrent("");
        fetchGoals();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleStatusChange = async (id: string, status: string) => {
    try {
      const res = await fetch("/api/goals", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });

      if (res.ok) {
        fetchGoals();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteGoal = async (id: string) => {
    if (!confirm("Are you sure you want to delete this fitness milestone?")) return;

    try {
      const res = await fetch(`/api/goals?id=${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        fetchGoals();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const calculateProgress = (goal: Goal) => {
    if (goal.target === 0) return 0;
    // For weight loss, progress is different, but a standard fraction works for general targets
    const pct = Math.round((goal.current / goal.target) * 100);
    return Math.min(100, Math.max(0, pct));
  };

  const activeGoals = goals.filter(g => g.status === "ACTIVE");
  const completedGoals = goals.filter(g => g.status === "COMPLETED" || g.status === "ARCHIVED");

  return (
    <div>
      {/* Title block */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2.5rem", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h1 style={{ fontSize: "2.25rem", marginBottom: "0.5rem" }}>Fitness Goals</h1>
          <p style={{ color: "var(--fg-secondary)" }}>Set milestones, log checks, and track your fitness growth</p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="btn btn-primary"
        >
          <Plus size={18} />
          {showAddForm ? "View Milestones" : "New Target"}
        </button>
      </div>

      {showAddForm ? (
        /* Create Goal Form */
        <div className="glass-card" style={{ maxWidth: "600px", margin: "0 auto", padding: "2.5rem" }}>
          <h3 style={{ fontSize: "1.5rem", marginBottom: "1.5rem" }}>Create New Fitness Target</h3>
          
          <form onSubmit={handleAddGoal}>
            <div className="form-group">
              <label>Goal Title</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Squat 1 Rep Max, Target Body Weight"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
              <div className="form-group">
                <label>Category</label>
                <select
                  className="form-control"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  style={{ backgroundColor: "var(--bg-secondary)" }}
                >
                  <option value="Weight">Body Weight</option>
                  <option value="Workout">Strength / Reps</option>
                  <option value="Cardio">Cardio / Minutes</option>
                </select>
              </div>

              <div className="form-group">
                <label>Unit</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. kg, reps, mins"
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  required
                />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
              <div className="form-group">
                <label>Start / Current Value</label>
                <input
                  type="number"
                  step="0.1"
                  className="form-control"
                  placeholder="e.g. 78"
                  value={current}
                  onChange={(e) => setCurrent(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Target Value</label>
                <input
                  type="number"
                  step="0.1"
                  className="form-control"
                  placeholder="e.g. 70"
                  value={target}
                  onChange={(e) => setTarget(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: "2rem" }}>
              <label>Target Deadline</label>
              <input
                type="date"
                className="form-control"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={formLoading}
              style={{ width: "100%", justifyContent: "center" }}
            >
              {formLoading ? <Loader2 size={18} className="animate-spin" /> : "Save Milestone"}
            </button>
          </form>
        </div>
      ) : (
        /* Goals Index List */
        <div style={{ display: "flex", flexDirection: "column", gap: "3rem" }}>
          {/* Active Goals Section */}
          <div>
            <h3 style={{ fontSize: "1.25rem", marginBottom: "1.5rem" }}>Active Milestones</h3>
            
            {loading ? (
              <div style={{ textAlign: "center", padding: "3rem" }}>
                <RefreshCw size={30} className="animate-spin" style={{ color: "var(--fg-muted)" }} />
              </div>
            ) : activeGoals.length === 0 ? (
              <div className="glass-card" style={{ padding: "3rem", textAlign: "center", color: "var(--fg-secondary)" }}>
                <Target size={40} style={{ color: "var(--border)", marginBottom: "1rem" }} />
                <p>No active milestones defined. Click "New Target" to start tracking!</p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                {activeGoals.map((g) => {
                  const pct = calculateProgress(g);
                  const isEditing = editingId === g.id;

                  return (
                    <div key={g.id} className="glass-card" style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "1.25rem",
                      border: "1px solid var(--border)"
                    }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "0.5rem" }}>
                        <div>
                          <span className="badge" style={{ fontSize: "0.65rem", marginBottom: "0.5rem" }}>{g.type}</span>
                          <h4 style={{ fontSize: "1.2rem" }}>{g.title}</h4>
                        </div>
                        <div style={{ display: "flex", gap: "0.5rem" }}>
                          <button
                            onClick={() => handleStatusChange(g.id, "COMPLETED")}
                            className="btn btn-secondary"
                            style={{ padding: "0.4rem", borderRadius: "var(--radius-sm)" }}
                            title="Mark as Completed"
                          >
                            <CheckCircle2 size={16} style={{ color: "var(--success)" }} />
                          </button>
                          <button
                            onClick={() => handleDeleteGoal(g.id)}
                            className="btn btn-secondary"
                            style={{ padding: "0.4rem", borderRadius: "var(--radius-sm)" }}
                            title="Delete Milestone"
                          >
                            <Trash2 size={16} style={{ color: "var(--error)" }} />
                          </button>
                        </div>
                      </div>

                      {/* Progress Metrics & Bar */}
                      <div>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.875rem", color: "var(--fg-secondary)", marginBottom: "0.5rem" }}>
                          <span>
                            Progress: <strong>{g.current}</strong> / {g.target} {g.unit}
                          </span>
                          <span>{pct}%</span>
                        </div>
                        <div style={{ width: "100%", height: "8px", backgroundColor: "rgba(255,255,255,0.05)", borderRadius: "4px", overflow: "hidden" }}>
                          <div style={{ width: `${pct}%`, height: "100%", backgroundColor: "var(--primary)", transition: "width 0.5s ease" }}></div>
                        </div>
                      </div>

                      {/* Progress editor panel / actions footer */}
                      <div style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        borderTop: "1px solid var(--border)",
                        paddingTop: "1rem",
                        fontSize: "0.825rem",
                        color: "var(--fg-muted)",
                        flexWrap: "wrap",
                        gap: "1rem"
                      }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                          <Calendar size={14} />
                          Target Date: {new Date(g.deadline).toLocaleDateString()}
                        </div>

                        {isEditing ? (
                          <div style={{ display: "flex", gap: "0.5rem" }}>
                            <input
                              type="number"
                              step="0.1"
                              className="form-control"
                              placeholder="New Value"
                              value={editCurrent}
                              onChange={(e) => setEditCurrent(e.target.value)}
                              style={{ width: "100px", padding: "0.25rem 0.5rem", fontSize: "0.825rem" }}
                            />
                            <button
                              onClick={() => handleUpdateProgress(g.id)}
                              className="btn btn-primary"
                              style={{ padding: "0.25rem 0.75rem", fontSize: "0.825rem" }}
                            >
                              Save
                            </button>
                            <button
                              onClick={() => setEditingId(null)}
                              className="btn btn-secondary"
                              style={{ padding: "0.25rem 0.75rem", fontSize: "0.825rem" }}
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => {
                              setEditingId(g.id);
                              setEditCurrent(g.current.toString());
                            }}
                            className="btn btn-secondary"
                            style={{ padding: "0.35rem 0.75rem", fontSize: "0.75rem", display: "flex", alignItems: "center", gap: "0.35rem" }}
                          >
                            <Edit2 size={12} />
                            Log Progress
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Archived / Completed Section */}
          {completedGoals.length > 0 && (
            <div>
              <h3 style={{ fontSize: "1.25rem", marginBottom: "1.5rem", color: "var(--fg-secondary)" }}>
                Completed & Archived
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {completedGoals.map((g) => (
                  <div key={g.id} className="glass-card" style={{
                    padding: "1.25rem 1.5rem",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    border: "1px solid var(--border)",
                    opacity: 0.7
                  }}>
                    <div>
                      <span className="badge badge-success" style={{ fontSize: "0.6rem", padding: "0.1rem 0.4rem", marginRight: "0.5rem" }}>
                        {g.status}
                      </span>
                      <strong style={{ textDecoration: "line-through", color: "var(--fg-secondary)" }}>{g.title}</strong>
                      <span style={{ fontSize: "0.8rem", color: "var(--fg-muted)", marginLeft: "0.75rem" }}>
                        Final: {g.current} {g.unit} (Target: {g.target})
                      </span>
                    </div>
                    <button
                      onClick={() => handleDeleteGoal(g.id)}
                      className="btn btn-secondary"
                      style={{ padding: "0.35rem", borderRadius: "var(--radius-sm)" }}
                    >
                      <Trash2 size={14} style={{ color: "var(--error)" }} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

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
