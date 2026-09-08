'use client';

import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";
import { PlusCircle, LineChart as ChartIcon, Trash2, Calendar, Scale, Activity, Loader2 } from "lucide-react";

interface ProgressEntry {
  id: string;
  weight: number | null;
  bodyFat: number | null;
  chest: number | null;
  waist: number | null;
  hips: number | null;
  biceps: number | null;
  thighs: number | null;
  notes: string | null;
  date: string;
}

export default function ProgressPage() {
  const [entries, setEntries] = useState<ProgressEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  // Form Fields
  const [showAddForm, setShowAddForm] = useState(false);
  const [weight, setWeight] = useState("");
  const [bodyFat, setBodyFat] = useState("");
  const [chest, setChest] = useState("");
  const [waist, setWaist] = useState("");
  const [hips, setHips] = useState("");
  const [biceps, setBiceps] = useState("");
  const [thighs, setThighs] = useState("");
  const [notes, setNotes] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [formLoading, setFormLoading] = useState(false);

  const fetchProgress = async () => {
    try {
      const res = await fetch("/api/progress");
      if (res.ok) {
        const data = await res.json();
        setEntries(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setMounted(true);
    fetchProgress();
  }, []);

  const handleAddEntry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!weight && !bodyFat && !chest && !waist && !hips && !biceps && !thighs) {
      alert("Please log at least one measurement");
      return;
    }

    setFormLoading(true);
    try {
      const res = await fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          weight,
          bodyFat,
          chest,
          waist,
          hips,
          biceps,
          thighs,
          notes,
          date,
        }),
      });

      if (res.ok) {
        // Reset form
        setWeight("");
        setBodyFat("");
        setChest("");
        setWaist("");
        setHips("");
        setBiceps("");
        setThighs("");
        setNotes("");
        setShowAddForm(false);
        fetchProgress();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteEntry = async (id: string) => {
    if (!confirm("Are you sure you want to delete this body log entry?")) return;

    try {
      const res = await fetch(`/api/progress?id=${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        fetchProgress();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Format data for chart plotting
  const chartData = entries.map((entry) => ({
    date: new Date(entry.date).toLocaleDateString(undefined, { month: "short", day: "numeric" }),
    Weight: entry.weight || undefined,
    "Body Fat %": entry.bodyFat || undefined,
  }));

  const latestEntry = entries[entries.length - 1];

  return (
    <div>
      {/* Title */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2.5rem", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h1 style={{ fontSize: "2.25rem", marginBottom: "0.5rem" }}>Progress Tracking</h1>
          <p style={{ color: "var(--fg-secondary)" }}>Log body composition variables and monitor trends over time</p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="btn btn-primary"
        >
          <PlusCircle size={18} />
          {showAddForm ? "View Charts" : "Log Stats"}
        </button>
      </div>

      {showAddForm ? (
        /* Log Progress Form */
        <div className="glass-card" style={{ maxWidth: "600px", margin: "0 auto", padding: "2.5rem" }}>
          <h3 style={{ fontSize: "1.5rem", marginBottom: "1.5rem" }}>Log Body Stats</h3>

          <form onSubmit={handleAddEntry}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem" }}>
              <div className="form-group">
                <label>Weight (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  className="form-control"
                  placeholder="e.g. 74.5"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Body Fat %</label>
                <input
                  type="number"
                  step="0.1"
                  className="form-control"
                  placeholder="e.g. 14.2"
                  value={bodyFat}
                  onChange={(e) => setBodyFat(e.target.value)}
                />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1.25rem" }}>
              <div className="form-group">
                <label>Chest (cm)</label>
                <input
                  type="number"
                  step="0.1"
                  className="form-control"
                  placeholder="e.g. 102"
                  value={chest}
                  onChange={(e) => setChest(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Waist (cm)</label>
                <input
                  type="number"
                  step="0.1"
                  className="form-control"
                  placeholder="e.g. 84"
                  value={waist}
                  onChange={(e) => setWaist(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Hips (cm)</label>
                <input
                  type="number"
                  step="0.1"
                  className="form-control"
                  placeholder="e.g. 96"
                  value={hips}
                  onChange={(e) => setHips(e.target.value)}
                />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem" }}>
              <div className="form-group">
                <label>Biceps (cm)</label>
                <input
                  type="number"
                  step="0.1"
                  className="form-control"
                  placeholder="e.g. 38"
                  value={biceps}
                  onChange={(e) => setBiceps(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Thighs (cm)</label>
                <input
                  type="number"
                  step="0.1"
                  className="form-control"
                  placeholder="e.g. 56"
                  value={thighs}
                  onChange={(e) => setThighs(e.target.value)}
                />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "1.25rem" }}>
              <div className="form-group">
                <label>Date</label>
                <input
                  type="date"
                  className="form-control"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: "2rem" }}>
              <label>Notes</label>
              <textarea
                className="form-control"
                placeholder="e.g. Morning weight, fasted state"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                style={{ resize: "none" }}
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={formLoading}
              style={{ width: "100%", justifyContent: "center" }}
            >
              {formLoading ? <Loader2 size={18} className="animate-spin" /> : "Save Body Log"}
            </button>
          </form>
        </div>
      ) : (
        /* Progress Dashboard Charts & List */
        <div style={{ display: "flex", flexDirection: "column", gap: "3rem" }}>
          {/* Latest Stats Cards */}
          {latestEntry && (
            <div>
              <h3 style={{ fontSize: "1.25rem", marginBottom: "1.5rem" }}>Current Status</h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: "1.5rem" }}>
                {latestEntry.weight && (
                  <div className="glass-card" style={{ padding: "1.25rem", textAlign: "center" }}>
                    <span style={{ fontSize: "0.75rem", color: "var(--fg-secondary)", textTransform: "uppercase" }}>Weight</span>
                    <h4 style={{ fontSize: "1.5rem", fontWeight: "800", marginTop: "0.25rem" }}>{latestEntry.weight} kg</h4>
                  </div>
                )}
                {latestEntry.bodyFat && (
                  <div className="glass-card" style={{ padding: "1.25rem", textAlign: "center" }}>
                    <span style={{ fontSize: "0.75rem", color: "var(--fg-secondary)", textTransform: "uppercase" }}>Body Fat</span>
                    <h4 style={{ fontSize: "1.5rem", fontWeight: "800", marginTop: "0.25rem" }}>{latestEntry.bodyFat}%</h4>
                  </div>
                )}
                {latestEntry.chest && (
                  <div className="glass-card" style={{ padding: "1.25rem", textAlign: "center" }}>
                    <span style={{ fontSize: "0.75rem", color: "var(--fg-secondary)", textTransform: "uppercase" }}>Chest</span>
                    <h4 style={{ fontSize: "1.5rem", fontWeight: "800", marginTop: "0.25rem" }}>{latestEntry.chest} cm</h4>
                  </div>
                )}
                {latestEntry.waist && (
                  <div className="glass-card" style={{ padding: "1.25rem", textAlign: "center" }}>
                    <span style={{ fontSize: "0.75rem", color: "var(--fg-secondary)", textTransform: "uppercase" }}>Waist</span>
                    <h4 style={{ fontSize: "1.5rem", fontWeight: "800", marginTop: "0.25rem" }}>{latestEntry.waist} cm</h4>
                  </div>
                )}
                {latestEntry.biceps && (
                  <div className="glass-card" style={{ padding: "1.25rem", textAlign: "center" }}>
                    <span style={{ fontSize: "0.75rem", color: "var(--fg-secondary)", textTransform: "uppercase" }}>Biceps</span>
                    <h4 style={{ fontSize: "1.5rem", fontWeight: "800", marginTop: "0.25rem" }}>{latestEntry.biceps} cm</h4>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Charts Row */}
          <div>
            <h3 style={{ fontSize: "1.25rem", marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <ChartIcon size={20} style={{ color: "var(--primary)" }} />
              Performance Trends
            </h3>

            {loading ? (
              <div className="glass-card" style={{ padding: "3rem", textAlign: "center" }}>
                <Loader2 size={24} className="animate-spin" style={{ color: "var(--fg-muted)" }} />
              </div>
            ) : entries.length < 2 ? (
              <div className="glass-card" style={{ padding: "3rem", textAlign: "center", color: "var(--fg-secondary)" }}>
                <Activity size={40} style={{ color: "var(--border)", marginBottom: "1rem" }} />
                <p>Please log at least 2 progress entries to generate metric trend lines.</p>
              </div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2.5rem" }} className="grid-responsive">
                {/* Weight Chart */}
                <div className="glass-card" style={{ height: "350px", display: "flex", flexDirection: "column", padding: "1.5rem 1rem" }}>
                  <h4 style={{ fontSize: "1.1rem", marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem", paddingLeft: "1rem" }}>
                    <Scale size={16} style={{ color: "var(--primary)" }} />
                    Weight Over Time (kg)
                  </h4>
                  {mounted && (
                    <ResponsiveContainer width="100%" height="85%">
                      <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                        <XAxis dataKey="date" stroke="var(--fg-muted)" style={{ fontSize: "0.75rem" }} />
                        <YAxis stroke="var(--fg-muted)" domain={['dataMin - 3', 'dataMax + 3']} style={{ fontSize: "0.75rem" }} />
                        <Tooltip contentStyle={{ backgroundColor: "var(--bg-secondary)", borderColor: "var(--border)", color: "white" }} />
                        <Line type="monotone" dataKey="Weight" stroke="var(--primary)" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  )}
                </div>

                {/* Body Fat Chart */}
                <div className="glass-card" style={{ height: "350px", display: "flex", flexDirection: "column", padding: "1.5rem 1rem" }}>
                  <h4 style={{ fontSize: "1.1rem", marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem", paddingLeft: "1rem" }}>
                    <Activity size={16} style={{ color: "var(--accent)" }} />
                    Body Fat Percentage (%)
                  </h4>
                  {mounted && (
                    <ResponsiveContainer width="100%" height="85%">
                      <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                        <XAxis dataKey="date" stroke="var(--fg-muted)" style={{ fontSize: "0.75rem" }} />
                        <YAxis stroke="var(--fg-muted)" domain={['dataMin - 2', 'dataMax + 2']} style={{ fontSize: "0.75rem" }} />
                        <Tooltip contentStyle={{ backgroundColor: "var(--bg-secondary)", borderColor: "var(--border)", color: "white" }} />
                        <Line type="monotone" dataKey="Body Fat %" stroke="var(--accent)" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Historical Logs List */}
          {entries.length > 0 && (
            <div>
              <h3 style={{ fontSize: "1.25rem", marginBottom: "1.5rem" }}>Historical Stats Logs</h3>
              <div className="glass-card" style={{ padding: 0, overflow: "hidden" }}>
                <div style={{ overflowX: "auto" }}>
                  <table className="payments-table">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Weight</th>
                        <th>Body Fat</th>
                        <th>Biceps</th>
                        <th>Waist</th>
                        <th>Notes</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[...entries].reverse().map((entry) => (
                        <tr key={entry.id}>
                          <td>{new Date(entry.date).toLocaleDateString()}</td>
                          <td style={{ fontWeight: "700" }}>{entry.weight ? `${entry.weight} kg` : "-"}</td>
                          <td>{entry.bodyFat ? `${entry.bodyFat}%` : "-"}</td>
                          <td>{entry.biceps ? `${entry.biceps} cm` : "-"}</td>
                          <td>{entry.waist ? `${entry.waist} cm` : "-"}</td>
                          <td style={{ fontSize: "0.825rem", fontStyle: "italic", color: "var(--fg-secondary)" }}>
                            {entry.notes || "-"}
                          </td>
                          <td>
                            <button
                              onClick={() => handleDeleteEntry(entry.id)}
                              style={{ cursor: "pointer", color: "var(--fg-muted)", padding: "0.25rem" }}
                              className="sidebar-link-hover-danger"
                            >
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
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
