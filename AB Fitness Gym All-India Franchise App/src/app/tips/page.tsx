'use client';

import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ChevronDown, ShieldCheck, HeartPulse, Sparkles, HelpCircle } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
}

interface Category {
  title: string;
  icon: React.ReactNode;
  color: string;
  items: FAQItem[];
}

export default function TipsPage() {
  const [openIndex, setOpenIndex] = useState<string | null>("safety-0");

  const categories: Category[] = [
    {
      title: "Exercise Form & Safety",
      icon: <ShieldCheck size={20} />,
      color: "var(--primary)",
      items: [
        {
          question: "How do I maintain lower back safety during Deadlifts and Squats?",
          answer: "Ensure your feet are positioned firmly at shoulder-width, engage your core muscles, and retract your scapula (shoulder blades) before lifting. Keep the bar close to your body and drive through your heels. Never allow your lower back to round under load. If you feel rounding, lower the weight."
        },
        {
          question: "What is the correct elbow positioning for Bench Presses?",
          answer: "Tuck your elbows at an angle of roughly 45 to 60 degrees relative to your torso. Avoid flaring them outward at a 90-degree angle, as this places severe stress on your rotator cuffs and can lead to shoulder impingement."
        },
        {
          question: "How can I avoid shoulder strain during Overhead Presses?",
          answer: "Keep your glutes squeezed and your core tightly braced to prevent arching your lower back. Press the bar straight up in a vertical path, moving your head slightly back to clear the bar, and lock out with control at the top, aligning the bar over your ears."
        }
      ]
    },
    {
      title: "Nutrition & Supplements",
      icon: <Sparkles size={20} />,
      color: "var(--accent)",
      items: [
        {
          question: "How much protein should I consume to build muscle?",
          answer: "For active individuals looking to build or preserve muscle tissue, target a daily intake of 1.6 to 2.2 grams of protein per kilogram of body weight. Distribute this across 3 to 5 meals throughout the day."
        },
        {
          question: "What is the best way to utilize Creatine Monohydrate?",
          answer: "Creatine is one of the most thoroughly researched supplements. Take 3 to 5 grams daily at any time of day, consistently. There is no strict requirement for a 'loading phase'; consistency is key to saturating muscle creatine stores."
        },
        {
          question: "What should my pre-workout and post-workout meals look like?",
          answer: "Pre-workout: Consume easily digestible complex carbohydrates and a moderate amount of protein 1 to 2 hours before training. Post-workout: Consume high-quality protein and fast-acting carbohydrates within 2 hours of finishing your session to initiate recovery."
        }
      ]
    },
    {
      title: "Recovery & Joint Care",
      icon: <HeartPulse size={20} />,
      color: "var(--success)",
      items: [
        {
          question: "How many hours of sleep are required for optimal muscle hypertrophy?",
          answer: "Aim for 7 to 9 hours of quality sleep per night. Sleep is the primary period during which your body releases growth hormone and repairs micro-tears in muscle fibers caused by heavy lifting."
        },
        {
          question: "How do I distinguish between normal muscle soreness and injury?",
          answer: "Delayed Onset Muscle Soreness (DOMS) is a dull, symmetric ache starting 12-48 hours post-workout. Injury is typically sharp, sudden, localized pain occurring during or immediately after an exercise, often accompanied by swelling or limited range of motion."
        },
        {
          question: "Should I perform static or dynamic stretches?",
          answer: "Always perform dynamic stretching (arm circles, leg swings, bodyweight squats) BEFORE a workout to warm up joints and muscles. Reserve static stretching (holding stretches for 30+ seconds) for AFTER your session to improve overall flexibility and promote relaxation."
        }
      ]
    }
  ];

  const toggleAccordion = (id: string) => {
    if (openIndex === id) {
      setOpenIndex(null);
    } else {
      setOpenIndex(id);
    }
  };

  return (
    <>
      <Navbar />

      <main style={{ padding: "4rem 0", minHeight: "80vh" }}>
        <div className="container" style={{ maxWidth: "800px" }}>
          <div style={{ textAlign: "center", marginBottom: "4rem" }}>
            <h1 style={{ fontSize: "3rem", marginBottom: "1rem" }}>Fitness & Safety Guide</h1>
            <p style={{ color: "var(--fg-secondary)", maxWidth: "600px", margin: "0 auto" }}>
              Get professional advice on lift execution, macro nutrition, and recovery splits compiled by our master coaches.
            </p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "2.5rem" }}>
            {categories.map((cat, catIdx) => (
              <div key={catIdx}>
                <h2 style={{
                  fontSize: "1.5rem",
                  marginBottom: "1.25rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  color: "var(--fg-primary)",
                  borderBottom: "1px solid var(--border)",
                  paddingBottom: "0.5rem"
                }}>
                  <div style={{
                    color: cat.color,
                    display: "flex",
                    alignItems: "center"
                  }}>
                    {cat.icon}
                  </div>
                  {cat.title}
                </h2>

                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  {cat.items.map((item, itemIdx) => {
                    const uniqueId = `${catIdx === 0 ? "safety" : catIdx === 1 ? "nutrition" : "recovery"}-${itemIdx}`;
                    const isOpen = openIndex === uniqueId;

                    return (
                      <div
                        key={itemIdx}
                        className="glass-card"
                        style={{
                          padding: 0,
                          overflow: "hidden",
                          border: isOpen ? `1px solid ${cat.color}` : "1px solid var(--border)",
                          boxShadow: isOpen ? `0 0 15px rgba(255, 255, 255, 0.02)` : "none"
                        }}
                      >
                        {/* Accordion Trigger */}
                        <button
                          onClick={() => toggleAccordion(uniqueId)}
                          style={{
                            width: "100%",
                            textAlign: "left",
                            padding: "1.25rem 1.5rem",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            cursor: "pointer",
                            fontWeight: "600",
                            fontSize: "1rem",
                            color: isOpen ? "white" : "var(--fg-primary)",
                            transition: "var(--transition)"
                          }}
                        >
                          {item.question}
                          <ChevronDown size={18} style={{
                            color: isOpen ? cat.color : "var(--fg-muted)",
                            transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                            transition: "var(--transition)"
                          }} />
                        </button>

                        {/* Accordion Content */}
                        {isOpen && (
                          <div style={{
                            padding: "0 1.5rem 1.5rem 1.5rem",
                            color: "var(--fg-secondary)",
                            fontSize: "0.95rem",
                            lineHeight: "1.6",
                            borderTop: "1px solid var(--border)",
                            paddingTop: "1rem",
                            backgroundColor: "rgba(255, 255, 255, 0.01)"
                          }}>
                            {item.answer}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
