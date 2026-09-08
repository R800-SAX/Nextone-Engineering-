'use client';

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { User, Mail, Lock, Phone, MapPin, Loader2 } from "lucide-react";
import { signIn } from "next-auth/react";

const CITIES = [
  "Mumbai",
  "Delhi",
  "Bengaluru",
  "Pune",
  "Hyderabad",
  "Chennai",
  "Ahmedabad",
  "Kolkata",
  "Gurugram",
];

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name || !email || !password || !phone || !city) {
      setError("Please fill in all fields");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
          phone,
          city,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Something went wrong");
        setLoading(false);
      } else {
        // Auto signin after registration
        const loginRes = await signIn("credentials", {
          email,
          password,
          redirect: false,
        });

        if (loginRes?.error) {
          router.push("/login?registered=true");
        } else {
          router.push("/dashboard");
          router.refresh();
        }
      }
    } catch (err) {
      setError("Failed to register. Please check your connection and try again.");
      setLoading(false);
    }
  };

  return (
    <div className="glass-card" style={{ padding: "2rem" }}>
      <div style={{ marginBottom: "1.5rem", textAlign: "center" }}>
        <h2 style={{ fontSize: "1.75rem", marginBottom: "0.25rem" }}>Create Account</h2>
        <p style={{ color: "var(--fg-secondary)", fontSize: "0.9rem" }}>Start your fitness transformation today</p>
      </div>

      {error && (
        <div style={{
          backgroundColor: "rgba(239, 68, 68, 0.15)",
          border: "1px solid var(--error)",
          color: "#f87171",
          padding: "0.75rem 1rem",
          borderRadius: "var(--radius-md)",
          fontSize: "0.875rem",
          marginBottom: "1.25rem"
        }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Full Name</label>
          <div style={{ position: "relative" }}>
            <User size={18} style={{
              position: "absolute",
              left: "1rem",
              top: "50%",
              transform: "translateY(-50%)",
              color: "var(--fg-muted)"
            }} />
            <input
              id="name"
              type="text"
              className="form-control"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={loading}
              style={{ paddingLeft: "2.75rem", width: "100%" }}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="email">Email Address</label>
          <div style={{ position: "relative" }}>
            <Mail size={18} style={{
              position: "absolute",
              left: "1rem",
              top: "50%",
              transform: "translateY(-50%)",
              color: "var(--fg-muted)"
            }} />
            <input
              id="email"
              type="email"
              className="form-control"
              placeholder="john@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              style={{ paddingLeft: "2.75rem", width: "100%" }}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="phone">Phone Number</label>
          <div style={{ position: "relative" }}>
            <Phone size={18} style={{
              position: "absolute",
              left: "1rem",
              top: "50%",
              transform: "translateY(-50%)",
              color: "var(--fg-muted)"
            }} />
            <input
              id="phone"
              type="tel"
              className="form-control"
              placeholder="9876543210"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              disabled={loading}
              style={{ paddingLeft: "2.75rem", width: "100%" }}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="city">City / Branch Location</label>
          <div style={{ position: "relative" }}>
            <MapPin size={18} style={{
              position: "absolute",
              left: "1rem",
              top: "50%",
              transform: "translateY(-50%)",
              color: "var(--fg-muted)",
              pointerEvents: "none"
            }} />
            <select
              id="city"
              className="form-control"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              disabled={loading}
              style={{
                paddingLeft: "2.75rem",
                width: "100%",
                appearance: "none",
                cursor: "pointer",
                backgroundColor: "var(--bg-secondary)"
              }}
              required
            >
              <option value="" disabled>Select your nearest city</option>
              {CITIES.map((c) => (
                <option key={c} value={c} style={{ backgroundColor: "var(--bg-secondary)" }}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-group" style={{ marginBottom: "1.5rem" }}>
          <label htmlFor="password">Password</label>
          <div style={{ position: "relative" }}>
            <Lock size={18} style={{
              position: "absolute",
              left: "1rem",
              top: "50%",
              transform: "translateY(-50%)",
              color: "var(--fg-muted)"
            }} />
            <input
              id="password"
              type="password"
              className="form-control"
              placeholder="•••••••• (Min 6 chars)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              style={{ paddingLeft: "2.75rem", width: "100%" }}
              required
            />
          </div>
        </div>

        <button
          type="submit"
          className="btn btn-primary"
          disabled={loading}
          style={{ width: "100%", justifyContent: "center" }}
        >
          {loading ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              Registering...
            </>
          ) : (
            "Create Account"
          )}
        </button>
      </form>

      <div style={{ marginTop: "1.5rem", textAlign: "center", fontSize: "0.875rem" }}>
        <p style={{ color: "var(--fg-secondary)" }}>
          Already have an account?{" "}
          <Link href="/login" style={{ color: "var(--primary)", fontWeight: "600" }}>
            Sign In
          </Link>
        </p>
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
