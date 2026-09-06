"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, User, ArrowRight, ShieldCheck, Eye, EyeOff } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    if (username === "admin" && password === "lumiere2026") {
      setTimeout(() => {
        localStorage.setItem("lumiere_admin_auth", "true");
        router.push("/admin");
      }, 600);
    } else {
      setTimeout(() => {
        setError("Invalid username or password.");
        setLoading(false);
      }, 400);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #0a0a0a 0%, #111 50%, #0d0d0d 100%)",
        fontFamily: "'Inter', system-ui, sans-serif",
        padding: "24px",
      }}
    >
      {/* Background texture dots */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          backgroundImage:
            "radial-gradient(circle, rgba(212,175,55,0.04) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          width: "100%",
          maxWidth: "420px",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Card */}
        <div
          style={{
            background: "#141414",
            border: "1px solid #242424",
            borderRadius: "20px",
            padding: "40px 36px",
            boxShadow:
              "0 25px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(212,175,55,0.08)",
          }}
        >
          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: "36px" }}>
            {/* Icon */}
            <div
              style={{
                width: "52px",
                height: "52px",
                borderRadius: "14px",
                background: "rgba(212,175,55,0.1)",
                border: "1px solid rgba(212,175,55,0.25)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 16px",
                color: "#D4AF37",
              }}
            >
              <Lock size={22} />
            </div>

            {/* Brand */}
            <h1
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: "26px",
                fontWeight: 600,
                letterSpacing: "0.25em",
                color: "#D4AF37",
                margin: "0 0 6px",
              }}
            >
              LUMIÈRE
            </h1>
            <p
              style={{
                fontSize: "10px",
                letterSpacing: "0.28em",
                textTransform: "uppercase",
                color: "#555",
                margin: 0,
              }}
            >
              Admin Console
            </p>

            {/* Gold divider */}
            <div
              style={{
                width: "40px",
                height: "1px",
                background: "linear-gradient(to right, transparent, #D4AF37, transparent)",
                margin: "16px auto 0",
              }}
            />
          </div>

          {/* Error */}
          {error && (
            <div
              style={{
                marginBottom: "20px",
                padding: "12px 16px",
                borderRadius: "10px",
                background: "rgba(220,38,38,0.1)",
                border: "1px solid rgba(220,38,38,0.3)",
                color: "#fca5a5",
                fontSize: "13px",
                textAlign: "center",
              }}
            >
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit}>
            {/* Username */}
            <div style={{ marginBottom: "18px" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "10px",
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: "#666",
                  fontWeight: 600,
                  marginBottom: "8px",
                }}
              >
                Username
              </label>
              <div style={{ position: "relative" }}>
                <span
                  style={{
                    position: "absolute",
                    left: "14px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "#444",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <User size={15} />
                </span>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin"
                  style={{
                    width: "100%",
                    boxSizing: "border-box",
                    paddingLeft: "40px",
                    paddingRight: "16px",
                    paddingTop: "12px",
                    paddingBottom: "12px",
                    borderRadius: "10px",
                    background: "#0d0d0d",
                    border: "1px solid #2a2a2a",
                    color: "#fff",
                    fontSize: "14px",
                    fontFamily: "inherit",
                    outline: "none",
                    transition: "border-color 0.2s",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#D4AF37")}
                  onBlur={(e) => (e.target.style.borderColor = "#2a2a2a")}
                />
              </div>
            </div>

            {/* Password */}
            <div style={{ marginBottom: "28px" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "10px",
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: "#666",
                  fontWeight: 600,
                  marginBottom: "8px",
                }}
              >
                Password
              </label>
              <div style={{ position: "relative" }}>
                <span
                  style={{
                    position: "absolute",
                    left: "14px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "#444",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <Lock size={15} />
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  style={{
                    width: "100%",
                    boxSizing: "border-box",
                    paddingLeft: "40px",
                    paddingRight: "44px",
                    paddingTop: "12px",
                    paddingBottom: "12px",
                    borderRadius: "10px",
                    background: "#0d0d0d",
                    border: "1px solid #2a2a2a",
                    color: "#fff",
                    fontSize: "14px",
                    fontFamily: "inherit",
                    outline: "none",
                    transition: "border-color 0.2s",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#D4AF37")}
                  onBlur={(e) => (e.target.style.borderColor = "#2a2a2a")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  style={{
                    position: "absolute",
                    right: "14px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "#444",
                    display: "flex",
                    alignItems: "center",
                    padding: 0,
                  }}
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                padding: "14px 24px",
                borderRadius: "10px",
                background: loading
                  ? "rgba(212,175,55,0.5)"
                  : "linear-gradient(135deg, #D4AF37, #c5a030)",
                color: "#000",
                fontWeight: 700,
                fontSize: "13px",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                border: "none",
                cursor: loading ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                transition: "opacity 0.2s, transform 0.1s",
                boxShadow: loading ? "none" : "0 4px 20px rgba(212,175,55,0.25)",
              }}
              onMouseEnter={(e) => {
                if (!loading) e.currentTarget.style.opacity = "0.9";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = "1";
              }}
            >
              {loading ? (
                <>
                  <span
                    style={{
                      width: "14px",
                      height: "14px",
                      border: "2px solid rgba(0,0,0,0.3)",
                      borderTopColor: "#000",
                      borderRadius: "50%",
                      animation: "spin 0.7s linear infinite",
                      display: "inline-block",
                    }}
                  />
                  Authenticating...
                </>
              ) : (
                <>
                  Sign In to Console
                  <ArrowRight size={15} />
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div
            style={{
              marginTop: "28px",
              paddingTop: "20px",
              borderTop: "1px solid #1e1e1e",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
            }}
          >
            <ShieldCheck size={13} style={{ color: "#D4AF37" }} />
            <span style={{ fontSize: "11px", color: "#3a3a3a", letterSpacing: "0.05em" }}>
              Secured · Lumière Admin Console
            </span>
          </div>
        </div>

        {/* Bottom hint */}
        <p
          style={{
            textAlign: "center",
            marginTop: "16px",
            fontSize: "11px",
            color: "#2e2e2e",
            letterSpacing: "0.05em",
          }}
        >
          Default credentials: admin / lumiere2026
        </p>
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        input::placeholder {
          color: #333;
        }
      `}</style>
    </div>
  );
}
