'use client';

import React from "react";
import Link from "next/link";
import { Dumbbell, Instagram, Twitter, Youtube, Facebook, MapPin, Mail, Phone } from "lucide-react";

export default function Footer() {
  return (
    <footer style={{
      backgroundColor: "var(--bg-primary)",
      borderTop: "1px solid var(--border)",
      padding: "5rem 0 3rem 0",
      color: "var(--fg-secondary)",
      fontSize: "0.95rem"
    }}>
      <div className="container">
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "3rem",
          marginBottom: "4rem"
        }} className="footer-grid">
          {/* Logo & Description */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            <Link href="/" style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              fontSize: "1.5rem",
              fontWeight: "800",
              color: "var(--fg-primary)",
              fontFamily: "var(--font-display)"
            }}>
              <Dumbbell size={24} style={{ color: "var(--primary)" }} />
              <span>AB <span style={{ color: "var(--primary)" }}>FITNESS</span></span>
            </Link>
            <p style={{ lineHeight: "1.6" }}>
              India's premier gym network delivering bespoke fitness experiences, professional athletic guidance, and comprehensive digital tracking.
            </p>
            {/* Social Icons */}
            <div style={{ display: "flex", gap: "1rem", color: "var(--fg-primary)" }}>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="Instagram">
                <Instagram size={20} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="Twitter">
                <Twitter size={20} />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="YouTube">
                <Youtube size={20} />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="Facebook">
                <Facebook size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ color: "var(--fg-primary)", marginBottom: "1.5rem", fontFamily: "var(--font-display)" }}>Navigation</h4>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              <li><Link href="/locations" className="footer-link">Franchise Locations</Link></li>
              <li><Link href="/workouts" className="footer-link">Workout Library</Link></li>
              <li><Link href="/exercises" className="footer-link">Exercises Catalog</Link></li>
              <li><Link href="/tips" className="footer-link">Safety & FAQ Tips</Link></li>
            </ul>
          </div>

          {/* Corporate info */}
          <div>
            <h4 style={{ color: "var(--fg-primary)", marginBottom: "1.5rem", fontFamily: "var(--font-display)" }}>Corporate</h4>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              <li><Link href="/about" className="footer-link">About Our Brand</Link></li>
              <li><Link href="/careers" className="footer-link">Careers at AB</Link></li>
              <li><Link href="/franchise" className="footer-link">Franchise Inquiry</Link></li>
              <li><Link href="/contact" className="footer-link">Press Kit</Link></li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 style={{ color: "var(--fg-primary)", marginBottom: "1.5rem", fontFamily: "var(--font-display)" }}>Contact Support</h4>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "1rem" }}>
              <li style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
                <MapPin size={18} style={{ color: "var(--primary)", flexShrink: 0, marginTop: "0.2rem" }} />
                <span>AB Corporate Towers, Bandra Kurla Complex, Mumbai, MH - 400051</span>
              </li>
              <li style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
                <Mail size={18} style={{ color: "var(--primary)", flexShrink: 0 }} />
                <span>support@abfitness.com</span>
              </li>
              <li style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
                <Phone size={18} style={{ color: "var(--primary)", flexShrink: 0 }} />
                <span>+91 22 4919 2200</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright block */}
        <div style={{
          borderTop: "1px solid var(--border)",
          paddingTop: "2rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "1rem",
          fontSize: "0.875rem"
        }}>
          <span>© {new Date().getFullYear()} AB Fitness Gym All-India Franchise. All rights reserved.</span>
          <div style={{ display: "flex", gap: "1.5rem" }}>
            <Link href="/privacy" className="footer-link">Privacy Policy</Link>
            <Link href="/terms" className="footer-link">Terms of Service</Link>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .footer-link {
          transition: var(--transition);
        }
        .footer-link:hover {
          color: var(--fg-primary);
          padding-left: 4px;
        }
        .social-link {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid var(--border);
          transition: var(--transition);
        }
        .social-link:hover {
          background: var(--primary);
          color: white;
          transform: translateY(-2px);
          box-shadow: 0 4px 10px var(--primary-glow);
        }
      `}</style>
    </footer>
  );
}
