'use client';

import React, { useState } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Menu, X, Dumbbell, User, LogOut } from "lucide-react";

export default function Navbar() {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav style={{
      position: "sticky",
      top: 0,
      zIndex: 100,
      background: "rgba(9, 9, 14, 0.8)",
      backdropFilter: "blur(12px)",
      WebkitBackdropFilter: "blur(12px)",
      borderBottom: "1px solid var(--border)",
      height: "70px",
      display: "flex",
      alignItems: "center"
    }}>
      <div className="container" style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%"
      }}>
        {/* Logo */}
        <Link href="/" style={{
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          fontSize: "1.5rem",
          fontWeight: "800",
          fontFamily: "var(--font-display)",
          letterSpacing: "-0.03em"
        }}>
          <Dumbbell size={24} style={{ color: "var(--primary)" }} />
          <span>AB <span style={{ color: "var(--primary)" }}>FITNESS</span></span>
        </Link>

        {/* Desktop Links */}
        <div className="nav-links-desktop" style={{
          display: "flex",
          alignItems: "center",
          gap: "2rem"
        }}>
          <Link href="/locations" className="nav-link">Locations</Link>
          <Link href="/workouts" className="nav-link">Workouts</Link>
          <Link href="/exercises" className="nav-link">Exercises</Link>
          <Link href="/tips" className="nav-link">Tips</Link>
          {session ? (
            <>
              <Link href="/dashboard" className="nav-link" style={{
                color: "var(--primary)",
                fontWeight: "600"
              }}>Dashboard</Link>
              <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                <span style={{ fontSize: "0.875rem", color: "var(--fg-secondary)" }}>
                  Hi, {session.user?.name?.split(" ")[0]}
                </span>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="btn btn-secondary"
                  style={{ padding: "0.5rem 1rem", fontSize: "0.875rem" }}
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            </>
          ) : (
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <Link href="/login" className="nav-link">Login</Link>
              <Link href="/register" className="btn btn-primary" style={{ padding: "0.5rem 1.25rem", fontSize: "0.875rem" }}>
                Get Started
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="nav-toggle-mobile"
          onClick={() => setIsOpen(!isOpen)}
          style={{ display: "none" }}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Links Overlay */}
      {isOpen && (
        <div style={{
          position: "absolute",
          top: "70px",
          left: 0,
          right: 0,
          background: "var(--bg-secondary)",
          borderBottom: "1px solid var(--border)",
          padding: "1.5rem 2rem",
          display: "flex",
          flexDirection: "column",
          gap: "1.25rem",
          zIndex: 99
        }}>
          <Link href="/locations" className="nav-link" onClick={() => setIsOpen(false)}>Locations</Link>
          <Link href="/workouts" className="nav-link" onClick={() => setIsOpen(false)}>Workouts</Link>
          <Link href="/exercises" className="nav-link" onClick={() => setIsOpen(false)}>Exercises</Link>
          <Link href="/tips" className="nav-link" onClick={() => setIsOpen(false)}>Tips</Link>
          {session ? (
            <>
              <Link href="/dashboard" className="nav-link" style={{ color: "var(--primary)" }} onClick={() => setIsOpen(false)}>Dashboard</Link>
              <div style={{
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
                borderTop: "1px solid var(--border)",
                paddingTop: "1rem"
              }}>
                <span style={{ fontSize: "0.9rem", color: "var(--fg-secondary)" }}>
                  Logged in as {session.user?.email}
                </span>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    signOut({ callbackUrl: "/" });
                  }}
                  className="btn btn-secondary"
                  style={{ width: "100%", justifyContent: "center" }}
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            </>
          ) : (
            <div style={{
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
              borderTop: "1px solid var(--border)",
              paddingTop: "1rem"
            }}>
              <Link href="/login" className="btn btn-secondary" style={{ width: "100%", justifyContent: "center" }} onClick={() => setIsOpen(false)}>
                Login
              </Link>
              <Link href="/register" className="btn btn-primary" style={{ width: "100%", justifyContent: "center" }} onClick={() => setIsOpen(false)}>
                Get Started
              </Link>
            </div>
          )}
        </div>
      )}

    </nav>
  );
}
