import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LocationsList from "@/components/LocationsList";
import { db } from "@/lib/db";
import { MapPin } from "lucide-react";

export const metadata = {
  title: "Gym Locator | AB Fitness Gym",
  description: "Find an AB Fitness Gym franchise near you. Operating in major Indian cities with high-end amenities and certified training teams.",
};

async function getLocations() {
  try {
    const locations = await db.gymLocation.findMany({
      where: { active: true },
      orderBy: { city: "asc" }
    });
    return locations;
  } catch (error) {
    console.error("Error fetching locations:", error);
    return [];
  }
}

export default async function LocationsPage() {
  const locations = await getLocations();

  return (
    <>
      <Navbar />
      
      <main style={{ padding: "4rem 0", minHeight: "80vh" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: "4rem" }}>
            <h1 style={{ fontSize: "3rem", marginBottom: "1rem" }}>Flagship Centers</h1>
            <p style={{ color: "var(--fg-secondary)", maxWidth: "600px", margin: "0 auto" }}>
              Locate any of our 25+ premium gym branches across India and view ratings, phone lines, and amenities.
            </p>
          </div>

          <LocationsList locations={locations} />
        </div>
      </main>

      <Footer />
    </>
  );
}
