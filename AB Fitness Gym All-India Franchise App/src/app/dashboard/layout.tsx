'use client';

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import {
  LayoutDashboard,
  CreditCard,
  Target,
  ClipboardList,
  LineChart,
  LogOut,
  Menu,
  X,
  Dumbbell,
  Home
} from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const menuItems = [
    { name: "Overview", path: "/dashboard", icon: <LayoutDashboard size={20} /> },
    { name: "Membership", path: "/dashboard/membership", icon: <CreditCard size={20} /> },
    { name: "Fitness Goals", path: "/dashboard/goals", icon: <Target size={20} /> },
    { name: "Workout Logger", path: "/dashboard/log", icon: <ClipboardList size={20} /> },
    { name: "Progress Tracking", path: "/dashboard/progress", icon: <LineChart size={20} /> },
  ];

  return (
    <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "var(--bg-primary)" }}>
      {/* Mobile Header */}
      <header style={{
        display: "none",
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: "60px",
        background: "var(--bg-secondary)",
        borderBottom: "1px solid var(--border)",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 1.5rem",
        zIndex: 50
      }} className="db-mobile-header">
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontWeight: "800" }}>
          <Dumbbell size={20} style={{ color: "var(--primary)" }} />
          <span>AB <span style={{ color: "var(--primary)" }}>FITNESS</span></span>
        </Link>
        <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ cursor: "pointer" }}>
          {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </header>

      {/* Sidebar Navigation */}
      <aside style={{
        width: "260px",
        backgroundColor: "var(--bg-secondary)",
        borderRight: "1px solid var(--border)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "2rem 1.5rem",
        position: "sticky",
        top: 0,
        height: "100vh",
        zIndex: 40,
        transition: "transform 0.3s ease"
      }} className={`db-sidebar ${sidebarOpen ? "open" : ""}`}>
        <div>
          {/* Logo */}
          <Link href="/" style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            fontSize: "1.25rem",
            fontWeight: "800",
            fontFamily: "var(--font-display)",
            marginBottom: "3rem"
          }}>
            <Dumbbell size={24} style={{ color: "var(--primary)" }} />
            <span>AB FITNESS</span>
          </Link>

          {/* User Info */}
          {session?.user && (
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              padding: "1rem",
              background: "rgba(255, 255, 255, 0.02)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-md)",
              marginBottom: "2rem"
            }}>
              <div style={{
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                backgroundColor: "var(--primary)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "700",
                fontSize: "1.1rem"
              }}>
                {session.user.name?.[0].toUpperCase()}
              </div>
              <div style={{ overflow: "hidden" }}>
                <h4 style={{ fontSize: "0.95rem", whiteSpace: "nowrap", textOverflow: "ellipsis", overflow: "hidden" }}>
                  {session.user.name}
                </h4>
                <span style={{ fontSize: "0.75rem", color: "var(--fg-muted)", textTransform: "uppercase", fontWeight: "600" }}>
                  {session.user.role}
                </span>
              </div>
            </div>
          )}

          {/* Menu Options */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {menuItems.map((item) => {
              const active = pathname === item.path;
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  onClick={() => setSidebarOpen(false)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "1rem",
                    padding: "0.75rem 1rem",
                    borderRadius: "var(--radius-md)",
                    fontWeight: active ? "600" : "500",
                    color: active ? "white" : "var(--fg-secondary)",
                    backgroundColor: active ? "var(--primary)" : "transparent",
                    transition: "var(--transition)"
                  }}
                  className={active ? "" : "sidebar-link-hover"}
                >
                  {item.icon}
                  {item.name}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Bottom Options */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          <Link href="/" style={{
            display: "flex",
            alignItems: "center",
            gap: "1rem",
            padding: "0.75rem 1rem",
            borderRadius: "var(--radius-md)",
            color: "var(--fg-secondary)",
          }} className="sidebar-link-hover">
            <Home size={20} />
            Back to Website
          </Link>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              padding: "0.75rem 1rem",
              borderRadius: "var(--radius-md)",
              color: "#f87171",
              cursor: "pointer",
              textAlign: "left",
              width: "100%"
            }}
            className="sidebar-link-hover-danger"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Panel Content */}
      <main style={{
        flex: 1,
        padding: "3rem",
        overflowY: "auto",
        height: "100vh"
      }} className="db-main-content">
        {children}
      </main>

      <style jsx global>{`
        .sidebar-link-hover:hover {
          background: rgba(255, 255, 255, 0.03);
          color: white;
        }
        
        .sidebar-link-hover-danger:hover {
          background: rgba(239, 68, 68, 0.08);
          color: #ef4444;
        }

        @media (max-width: 960px) {
          .db-mobile-header {
            display: flex !important;
          }
          .db-sidebar {
            position: fixed !important;
            left: 0;
            top: 60px;
            bottom: 0;
            transform: translateX(-100%);
            height: calc(100vh - 60px) !important;
          }
          .db-sidebar.open {
            transform: translateX(0);
          }
          .db-main-content {
            padding: 5rem 1.5rem 2rem 1.5rem !important;
            height: auto !important;
          }
        }
      `}</style>
    </div>
  );
}
