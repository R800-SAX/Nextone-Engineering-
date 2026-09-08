'use client';

import React, { useState } from "react";
import { Search, MapPin, Phone, Mail, Clock, Star, Sparkles } from "lucide-react";

interface GymLocationProps {
  id: string;
  name: string;
  city: string;
  state: string;
  address: string;
  phone: string;
  email: string;
  timings: string;
  rating: number;
  imageUrl: string | null;
  amenities: string; // JSON string list
}

export default function LocationsList({ locations }: { locations: GymLocationProps[] }) {
  const [search, setSearch] = useState("");
  const [selectedCity, setSelectedCity] = useState("All");

  const cities = ["All", ...Array.from(new Set(locations.map((loc) => loc.city)))];

  const filteredLocations = locations.filter((loc) => {
    const matchesSearch = 
      loc.name.toLowerCase().includes(search.toLowerCase()) ||
      loc.address.toLowerCase().includes(search.toLowerCase()) ||
      loc.city.toLowerCase().includes(search.toLowerCase());

    const matchesCity = selectedCity === "All" || loc.city === selectedCity;

    return matchesSearch && matchesCity;
  });

  return (
    <div>
      {/* Search and Filters header */}
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
            placeholder="Search by branch name, address, or city..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: "100%",
              paddingLeft: "3rem",
              fontSize: "1.05rem"
            }}
          />
        </div>

        {/* City Filter Pills */}
        <div>
          <span style={{ fontSize: "0.875rem", color: "var(--fg-secondary)", display: "block", marginBottom: "0.75rem" }}>
            Filter by City
          </span>
          <div style={{
            display: "flex",
            gap: "0.5rem",
            flexWrap: "wrap"
          }}>
            {cities.map((city) => {
              const active = selectedCity === city;
              return (
                <button
                  key={city}
                  onClick={() => setSelectedCity(city)}
                  className={`badge ${active ? "badge-primary" : ""}`}
                  style={{
                    cursor: "pointer",
                    padding: "0.5rem 1rem",
                    fontSize: "0.825rem",
                    transition: "var(--transition)",
                    border: active ? "1px solid var(--primary)" : "1px solid var(--border)",
                    backgroundColor: active ? "rgba(225, 29, 72, 0.2)" : "rgba(255,255,255,0.03)"
                  }}
                >
                  {city}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div style={{ marginBottom: "2rem", color: "var(--fg-secondary)" }}>
        Showing <strong>{filteredLocations.length}</strong> fitness centers
      </div>

      {/* Locations Cards Grid */}
      {filteredLocations.length === 0 ? (
        <div className="glass-card" style={{ padding: "4rem 2rem", textAlign: "center", color: "var(--fg-secondary)" }}>
          <MapPin size={48} style={{ color: "var(--border)", marginBottom: "1rem" }} />
          <p>No locations match your search criteria. Try a different city or term.</p>
        </div>
      ) : (
        <div className="grid-responsive">
          {filteredLocations.map((loc) => {
            const parsedAmenities = JSON.parse(loc.amenities) as string[];
            return (
              <div key={loc.id} className="glass-card" style={{
                padding: 0,
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                border: "1px solid var(--border)"
              }}>
                {/* Gym image header */}
                <div style={{
                  height: "200px",
                  position: "relative",
                  backgroundImage: `url('${loc.imageUrl || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&auto=format&fit=crop&q=60"}')`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}>
                  {/* Rating Badge */}
                  <div style={{
                    position: "absolute",
                    top: "1rem",
                    right: "1rem",
                    backgroundColor: "rgba(9, 9, 14, 0.85)",
                    backdropFilter: "blur(4px)",
                    padding: "0.25rem 0.75rem",
                    borderRadius: "var(--radius-sm)",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.25rem",
                    fontSize: "0.825rem",
                    fontWeight: "700",
                    color: "#fbbf24"
                  }}>
                    <Star size={14} fill="#fbbf24" stroke="#fbbf24" />
                    {loc.rating.toFixed(1)}
                  </div>

                  {/* City Label */}
                  <div style={{
                    position: "absolute",
                    bottom: "1rem",
                    left: "1rem",
                    backgroundColor: "var(--primary)",
                    padding: "0.2rem 0.75rem",
                    borderRadius: "var(--radius-sm)",
                    fontSize: "0.75rem",
                    fontWeight: "700",
                    textTransform: "uppercase"
                  }}>
                    {loc.city}
                  </div>
                </div>

                {/* Details */}
                <div style={{ padding: "1.5rem 2rem", display: "flex", flexDirection: "column", gap: "1rem", flex: 1, justifyContent: "space-between" }}>
                  <div>
                    <h3 style={{ fontSize: "1.25rem", marginBottom: "0.5rem" }}>{loc.name}</h3>
                    <p style={{ fontSize: "0.875rem", color: "var(--fg-secondary)", display: "flex", gap: "0.5rem", alignItems: "flex-start", marginBottom: "1rem" }}>
                      <MapPin size={16} style={{ color: "var(--primary)", flexShrink: 0, marginTop: "0.1rem" }} />
                      <span>{loc.address}, {loc.city}, {loc.state}</span>
                    </p>

                    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", fontSize: "0.875rem", borderTop: "1px solid var(--border)", paddingTop: "1rem" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                        <Clock size={16} style={{ color: "var(--accent)" }} />
                        <span style={{ color: "var(--fg-secondary)" }}>{loc.timings.split(",")[0]}</span>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                        <Phone size={16} style={{ color: "var(--success)" }} />
                        <span>{loc.phone}</span>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                        <Mail size={16} style={{ color: "var(--primary)" }} />
                        <span>{loc.email}</span>
                      </div>
                    </div>
                  </div>

                  {/* Amenities List */}
                  <div style={{ borderTop: "1px solid var(--border)", paddingTop: "1rem", marginTop: "0.5rem" }}>
                    <span style={{ fontSize: "0.75rem", color: "var(--fg-secondary)", textTransform: "uppercase", display: "block", marginBottom: "0.5rem", fontWeight: "600" }}>
                      Branch Amenities
                    </span>
                    <div style={{ display: "flex", gap: "0.35rem", flexWrap: "wrap" }}>
                      {parsedAmenities.map((amenity) => (
                        <span key={amenity} style={{
                          fontSize: "0.7rem",
                          padding: "0.15rem 0.5rem",
                          background: "rgba(255, 255, 255, 0.03)",
                          border: "1px solid var(--border)",
                          borderRadius: "var(--radius-sm)",
                          color: "var(--fg-secondary)"
                        }}>
                          {amenity}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
