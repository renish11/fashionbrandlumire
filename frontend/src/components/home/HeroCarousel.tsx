"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";

const SLIDES = [
  {
    src: "https://images.unsplash.com/photo-1757620057669-fc23bc50cb05?w=1800&h=900&fit=crop&q=80",
    alt: "Fashion Dress Collection",
  },
  {
    src: "https://images.unsplash.com/photo-1777292296715-706dd0b73305?w=1800&h=900&fit=crop&q=80",
    alt: "Elegant Fashion Look",
  },
  {
    src: "https://images.unsplash.com/photo-1626259189871-6b2e1daac55e?w=1800&h=900&fit=crop&q=80",
    alt: "Summer Dress Editorial",
  },
  {
    src: "https://images.unsplash.com/photo-1637328598882-7623f21062ed?w=1800&h=900&fit=crop&q=80",
    alt: "Luxury Fashion Portrait",
  },
  {
    src: "https://images.unsplash.com/photo-1629737168222-baad8ecacebe?w=1800&h=900&fit=crop&q=80",
    alt: "Fashion Dress Style",
  },
];

const INTERVAL = 4500;

export default function HeroCarousel() {
  const [current, setCurrent] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const goTo = useCallback((index: number) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrent(index);
    setTimeout(() => setIsTransitioning(false), 800);
  }, [isTransitioning]);

  const next = useCallback(() => {
    goTo((current + 1) % SLIDES.length);
  }, [current, goTo]);

  // Auto-advance
  useEffect(() => {
    const timer = setInterval(next, INTERVAL);
    return () => clearInterval(timer);
  }, [next]);

  return (
    <>
      {/* Slides */}
      {SLIDES.map((slide, i) => (
        <div
          key={slide.src}
          style={{
            position: "absolute",
            inset: 0,
            opacity: i === current ? 1 : 0,
            transition: "opacity 1s ease-in-out",
            zIndex: i === current ? 1 : 0,
          }}
        >
          <Image
            src={slide.src}
            alt={slide.alt}
            fill
            style={{ objectFit: "cover", objectPosition: "center top" }}
            priority={i === 0}
            sizes="100vw"
          />
        </div>
      ))}

      {/* Dark overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.45) 60%, rgba(0,0,0,0.65) 100%)",
          zIndex: 2,
        }}
      />

      {/* Dot indicators */}
      <div
        style={{
          position: "absolute",
          bottom: "32px",
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          gap: "10px",
          zIndex: 10,
        }}
      >
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            aria-label={`Go to slide ${i + 1}`}
            style={{
              width: i === current ? "28px" : "8px",
              height: "8px",
              borderRadius: "9999px",
              background: i === current ? "#D4AF37" : "rgba(255,255,255,0.45)",
              border: "none",
              cursor: "pointer",
              padding: 0,
              transition: "all 0.4s ease",
            }}
          />
        ))}
      </div>

      {/* Prev / Next arrows */}
      <button
        onClick={() => goTo((current - 1 + SLIDES.length) % SLIDES.length)}
        aria-label="Previous slide"
        style={{
          position: "absolute",
          left: "24px",
          top: "50%",
          transform: "translateY(-50%)",
          zIndex: 10,
          width: "44px",
          height: "44px",
          borderRadius: "50%",
          background: "rgba(255,255,255,0.12)",
          border: "1px solid rgba(255,255,255,0.25)",
          color: "#fff",
          fontSize: "18px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          backdropFilter: "blur(4px)",
          transition: "background 0.2s",
        }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.background = "rgba(212,175,55,0.35)")
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.background = "rgba(255,255,255,0.12)")
        }
      >
        ‹
      </button>

      <button
        onClick={() => goTo((current + 1) % SLIDES.length)}
        aria-label="Next slide"
        style={{
          position: "absolute",
          right: "24px",
          top: "50%",
          transform: "translateY(-50%)",
          zIndex: 10,
          width: "44px",
          height: "44px",
          borderRadius: "50%",
          background: "rgba(255,255,255,0.12)",
          border: "1px solid rgba(255,255,255,0.25)",
          color: "#fff",
          fontSize: "18px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          backdropFilter: "blur(4px)",
          transition: "background 0.2s",
        }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.background = "rgba(212,175,55,0.35)")
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.background = "rgba(255,255,255,0.12)")
        }
      >
        ›
      </button>

      {/* Slide counter */}
      <div
        style={{
          position: "absolute",
          bottom: "32px",
          right: "32px",
          zIndex: 10,
          fontSize: "11px",
          letterSpacing: "0.15em",
          color: "rgba(255,255,255,0.5)",
        }}
      >
        {String(current + 1).padStart(2, "0")} / {String(SLIDES.length).padStart(2, "0")}
      </div>
    </>
  );
}
