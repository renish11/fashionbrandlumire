"use client";

import { SignUp } from "@clerk/nextjs";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function SignUpPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        fontFamily: "var(--font-inter, 'Inter', system-ui, sans-serif)",
        background: "#faf9f7",
      }}
    >
      {/* ── LEFT: Luxury Visual Panel ── */}
      <div
        style={{
          width: "45%",
          minHeight: "100vh",
          position: "relative",
          overflow: "hidden",
          background: "#0a0a0a",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "48px",
          flexShrink: 0,
        }}
        className="sign-up-left-panel"
      >
        {/* Background image */}
        <Image
          src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1200&h=1600&fit=crop"
          alt="Luxury fashion"
          fill
          priority
          style={{ objectFit: "cover", objectPosition: "center" }}
        />
        {/* Gradient overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.45) 50%, rgba(0,0,0,0.25) 100%)",
            zIndex: 1,
          }}
        />
        {/* Gold accent line on right edge */}
        <div
          style={{
            position: "absolute",
            right: 0,
            top: 0,
            bottom: 0,
            width: "1px",
            background:
              "linear-gradient(to bottom, transparent, rgba(212,175,55,0.5), transparent)",
            zIndex: 2,
          }}
        />

        {/* Logo */}
        <Link
          href="/"
          style={{ position: "relative", zIndex: 10, textDecoration: "none" }}
        >
          <div
            style={{
              fontFamily:
                "var(--font-playfair, 'Playfair Display', Georgia, serif)",
              fontSize: "24px",
              fontWeight: 600,
              letterSpacing: "0.25em",
              color: "#D4AF37",
            }}
          >
            LUMIÈRE
          </div>
          <div
            style={{
              fontSize: "10px",
              letterSpacing: "0.3em",
              color: "rgba(255,255,255,0.45)",
              textTransform: "uppercase",
              marginTop: "4px",
            }}
          >
            Maison de Mode
          </div>
        </Link>

        {/* Quote */}
        <div style={{ position: "relative", zIndex: 10 }}>
          <div
            style={{
              width: "48px",
              height: "1px",
              background: "rgba(212,175,55,0.6)",
              marginBottom: "24px",
            }}
          />
          <blockquote
            style={{
              fontFamily:
                "var(--font-playfair, 'Playfair Display', Georgia, serif)",
              fontSize: "20px",
              fontStyle: "italic",
              color: "rgba(255,255,255,0.9)",
              lineHeight: 1.6,
              maxWidth: "320px",
              marginBottom: "16px",
            }}
          >
            &ldquo;Elegance is not standing out, but being remembered.&rdquo;
          </blockquote>
          <p
            style={{
              fontSize: "11px",
              letterSpacing: "0.15em",
              color: "rgba(255,255,255,0.4)",
              textTransform: "uppercase",
            }}
          >
            — Giorgio Armani
          </p>
        </div>

        {/* Bottom badges */}
        <div
          style={{
            position: "relative",
            zIndex: 10,
            display: "flex",
            alignItems: "center",
            gap: "20px",
          }}
        >
          {["Early Access", "Members-Only Drops", "Styling Concierge"].map(
            (label, i) => (
              <div
                key={label}
                style={{ display: "flex", alignItems: "center", gap: "20px" }}
              >
                <span
                  style={{
                    fontSize: "10px",
                    letterSpacing: "0.15em",
                    color: "rgba(255,255,255,0.4)",
                    textTransform: "uppercase",
                  }}
                >
                  {label}
                </span>
                {i < 2 && (
                  <div
                    style={{
                      width: "3px",
                      height: "3px",
                      borderRadius: "50%",
                      background: "rgba(212,175,55,0.4)",
                    }}
                  />
                )}
              </div>
            )
          )}
        </div>
      </div>

      {/* ── RIGHT: Auth Form Panel ── */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          background: "#faf9f7",
          minHeight: "100vh",
        }}
      >
        {/* Top bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "20px 40px",
            borderBottom: "1px solid rgba(0,0,0,0.06)",
          }}
        >
          <Link
            href="/"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              textDecoration: "none",
              color: "#71717a",
              fontSize: "12px",
              letterSpacing: "0.05em",
              transition: "color 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#18181b")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#71717a")}
          >
            <span style={{ fontSize: "14px" }}>←</span>
            <span>Back to Store</span>
          </Link>

          <div
            style={{
              fontSize: "11px",
              color: "#a1a1aa",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}
          >
            New Member
          </div>
        </div>

        {/* Main content */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "48px 40px",
          }}
        >
          {/* Heading */}
          <div
            style={{
              width: "100%",
              maxWidth: "420px",
              marginBottom: "32px",
              textAlign: "center",
            }}
          >
            {/* Gold ornamental line */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "12px",
                marginBottom: "16px",
              }}
            >
              <div
                style={{ width: "32px", height: "1px", background: "#D4AF37" }}
              />
              <span
                style={{
                  fontSize: "10px",
                  letterSpacing: "0.3em",
                  color: "#D4AF37",
                  textTransform: "uppercase",
                  fontWeight: 600,
                }}
              >
                Join The Maison
              </span>
              <div
                style={{ width: "32px", height: "1px", background: "#D4AF37" }}
              />
            </div>

            <h1
              style={{
                fontFamily:
                  "var(--font-playfair, 'Playfair Display', Georgia, serif)",
                fontSize: "36px",
                fontWeight: 500,
                letterSpacing: "0.04em",
                color: "#0a0a0a",
                marginBottom: "10px",
                lineHeight: 1.2,
              }}
            >
              Create an Account
            </h1>
            <p
              style={{
                fontSize: "13px",
                color: "#71717a",
                lineHeight: 1.6,
                maxWidth: "340px",
                margin: "0 auto",
              }}
            >
              Register for exclusive drops, private showroom previews, and
              tailored styling.
            </p>
          </div>

          {/* Clerk Component */}
          <div style={{ width: "100%", maxWidth: "420px" }}>
            {mounted && (
              <SignUp
                routing="path"
                path="/sign-up"
                signInUrl="/sign-in"
                forceRedirectUrl="/account"
                appearance={{
                  variables: {
                    colorPrimary: "#D4AF37",
                    colorText: "#18181b",
                    colorTextSecondary: "#71717a",
                    colorBackground: "#ffffff",
                    colorInputBackground: "#fafaf9",
                    colorInputText: "#18181b",
                    borderRadius: "0.75rem",
                    fontFamily: "'Inter', system-ui, sans-serif",
                  } as any,
                  elements: {
                    rootBox: "w-full",
                    card: "shadow-none border-0 p-0 bg-transparent w-full",
                    cardBox:
                      "bg-white border border-zinc-200 shadow-xl shadow-zinc-100/80 rounded-2xl w-full overflow-hidden",
                    headerTitle:
                      "font-serif text-xl tracking-wide text-zinc-900",
                    headerSubtitle: "text-zinc-500 text-xs",
                    socialButtonsBlockButton:
                      "bg-white border border-zinc-200 text-zinc-700 hover:bg-zinc-50 hover:border-[#D4AF37]/50 hover:shadow-sm transition-all rounded-xl font-medium",
                    socialButtonsBlockButtonText:
                      "text-zinc-700 font-medium text-sm",
                    dividerLine: "bg-zinc-200",
                    dividerText: "text-zinc-400 text-xs bg-white",
                    formFieldLabel:
                      "text-zinc-700 text-xs font-semibold tracking-wide uppercase",
                    formFieldInput:
                      "bg-[#fafaf9] border border-zinc-200 text-zinc-900 text-sm rounded-xl focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 transition-all placeholder:text-zinc-400",
                    formButtonPrimary:
                      "bg-[#D4AF37] hover:bg-[#c5a030] text-black font-bold text-xs tracking-[0.12em] uppercase py-3 rounded-xl transition-all shadow-md hover:shadow-lg",
                    footerAction: "justify-center bg-zinc-50/80",
                    footerActionLink:
                      "text-[#b58c1c] hover:text-[#D4AF37] font-semibold text-xs transition-colors",
                    footerActionText: "text-zinc-500 text-xs",
                    identityPreviewText: "text-zinc-700 text-xs",
                    identityPreviewEditButton:
                      "text-[#D4AF37] hover:text-[#b58c1c] text-xs font-semibold",
                    formFieldAction:
                      "text-[#D4AF37] hover:text-[#b58c1c] text-xs font-medium transition-colors",
                    otpCodeFieldInput:
                      "border-zinc-200 text-zinc-900 focus:border-[#D4AF37] focus:ring-[#D4AF37]/20 rounded-xl",
                    footer: "bg-transparent",
                    main: "p-6",
                  },
                }}
              />
            )}
          </div>

          {/* Return link */}
          <div style={{ marginTop: "28px", textAlign: "center" }}>
            <Link
              href="/"
              style={{
                fontSize: "11px",
                color: "#a1a1aa",
                letterSpacing: "0.05em",
                textDecoration: "none",
                transition: "color 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#52525b")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#a1a1aa")}
            >
              ← Return to Lumière Store
            </Link>
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            padding: "16px 40px",
            borderTop: "1px solid rgba(0,0,0,0.06)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "16px",
          }}
        >
          {["© 2026 LUMIÈRE", "Privacy", "Terms"].map((item, i) => (
            <span
              key={item}
              style={{ display: "flex", alignItems: "center", gap: "16px" }}
            >
              <span
                style={{
                  fontSize: "10px",
                  color: "#a1a1aa",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                }}
              >
                {item}
              </span>
              {i < 2 && (
                <span
                  style={{
                    width: "2px",
                    height: "2px",
                    borderRadius: "50%",
                    background: "#d4d4d8",
                    display: "inline-block",
                  }}
                />
              )}
            </span>
          ))}
        </div>
      </div>

      {/* ── Mobile responsive styles ── */}
      <style>{`
        @media (max-width: 768px) {
          .sign-up-left-panel {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
