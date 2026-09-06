"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  BarChart3,
  LogOut,
  ExternalLink,
  Sun,
  Moon,
} from "lucide-react";
import { ThemeProvider, useTheme } from "@/context/ThemeContext";

function AdminLayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    // Check local storage for admin auth token
    const token = localStorage.getItem("lumiere_admin_auth");
    if (pathname === "/admin/login") {
      setAuthenticated(true);
      return;
    }

    if (!token) {
      setAuthenticated(false);
      router.push("/admin/login");
    } else {
      setAuthenticated(true);
    }
  }, [pathname, router]);

  const handleLogout = () => {
    localStorage.removeItem("lumiere_admin_auth");
    router.push("/admin/login");
  };

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  if (authenticated === null) {
    return (
      <div className="min-h-screen bg-[#0c0c0c] flex items-center justify-center text-zinc-500 font-mono text-sm">
        Authenticating session...
      </div>
    );
  }

  if (!authenticated) {
    return null;
  }

  const navItems = [
    { label: "Overview", href: "/admin", icon: LayoutDashboard },
    { label: "Products", href: "/admin/products", icon: Package },
    { label: "Orders", href: "/admin/orders", icon: ShoppingBag },
    { label: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  ];

  return (
    <div
      className={`min-h-screen flex flex-col md:flex-row transition-colors duration-200 ${
        theme === "dark"
          ? "bg-[#0c0c0c] text-zinc-100"
          : "bg-[#f8f9fa] text-zinc-900"
      }`}
    >
      {/* ── Sidebar ── */}
      <aside
        className={`w-full md:w-64 border-b md:border-b-0 md:border-r flex flex-col shrink-0 transition-colors duration-200 ${
          theme === "dark"
            ? "bg-[#141414] border-[#262626]"
            : "bg-white border-zinc-200 shadow-sm"
        }`}
      >
        <div
          className={`p-6 border-b ${
            theme === "dark" ? "border-[#262626]" : "border-zinc-200"
          }`}
        >
          <Link href="/admin" className="block">
            <h2 className="text-xl font-serif tracking-[0.2em] text-[#D4AF37] font-semibold">
              LUMIÈRE
            </h2>
            <p className="text-[10px] tracking-[0.25em] text-zinc-400 uppercase mt-0.5">
              Admin Console
            </p>
          </Link>
        </div>

        <nav className="p-4 space-y-1.5 flex-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? theme === "dark"
                      ? "bg-[#D4AF37]/15 text-[#D4AF37] border border-[#D4AF37]/40 font-semibold"
                      : "bg-amber-100/80 text-amber-900 border border-amber-300 font-semibold shadow-xs"
                    : theme === "dark"
                    ? "text-zinc-400 hover:text-white hover:bg-white/5"
                    : "text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100"
                }`}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </Link>
            );
          })}

          <div
            className={`pt-4 mt-4 border-t ${
              theme === "dark" ? "border-[#262626]" : "border-zinc-200"
            }`}
          >
            <a
              href="http://localhost:3000"
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm transition-colors ${
                theme === "dark"
                  ? "text-zinc-400 hover:text-white hover:bg-white/5"
                  : "text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100"
              }`}
            >
              <span className="flex items-center gap-2">
                <ExternalLink size={16} />
                Customer Store
              </span>
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                  theme === "dark"
                    ? "bg-zinc-800 text-zinc-300"
                    : "bg-zinc-200 text-zinc-700 font-medium"
                }`}
              >
                :3000
              </span>
            </a>
          </div>
        </nav>

        {/* User Info & Theme Indicator in Sidebar Footer */}
        <div
          className={`p-4 border-t flex items-center justify-between ${
            theme === "dark"
              ? "border-[#262626]"
              : "border-zinc-200 bg-zinc-50"
          }`}
        >
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-8 h-8 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37] text-xs font-semibold shrink-0">
              AD
            </div>
            <div className="truncate">
              <p
                className={`text-xs font-medium truncate ${
                  theme === "dark" ? "text-white" : "text-zinc-900"
                }`}
              >
                Administrator
              </p>
              <p className="text-[10px] text-zinc-500 truncate">
                admin@lumiere.com
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            title="Sign out"
            className="p-1.5 rounded-md text-zinc-400 hover:text-rose-500 hover:bg-rose-500/10 transition-colors"
          >
            <LogOut size={16} />
          </button>
        </div>
      </aside>

      {/* ── Main content area ── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-auto">
        <header
          className={`h-16 px-6 border-b flex items-center justify-between backdrop-blur-sm sticky top-0 z-20 transition-colors duration-200 ${
            theme === "dark"
              ? "bg-[#111111]/80 border-[#262626]"
              : "bg-white/90 border-zinc-200 shadow-sm"
          }`}
        >
          <div className="flex items-center gap-2.5 text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span
              className={
                theme === "dark"
                  ? "text-zinc-300"
                  : "text-zinc-700 font-medium"
              }
            >
              API Engine Online
            </span>
            <span className="text-zinc-400">|</span>
            <span className="text-[#D4AF37] font-mono font-semibold">
              Port 4000
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* ── Light & Dark Theme Toggle Button ── */}
            <button
              onClick={toggleTheme}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all shadow-sm ${
                theme === "dark"
                  ? "bg-[#1a1a1a] text-amber-300 border-zinc-700 hover:bg-zinc-800"
                  : "bg-zinc-100 text-zinc-800 border-zinc-300 hover:bg-zinc-200"
              }`}
              title={
                theme === "dark"
                  ? "Switch to Light Theme"
                  : "Switch to Dark Theme"
              }
            >
              {theme === "dark" ? (
                <Sun size={14} className="text-amber-300" />
              ) : (
                <Moon size={14} className="text-zinc-700" />
              )}
              <span className="font-medium">
                {theme === "dark" ? "Light Mode" : "Dark Mode"}
              </span>
            </button>

            <span className="text-xs text-zinc-400 hidden sm:inline font-mono">
              Next.js 15
            </span>
          </div>
        </header>

        <main className="p-6 md:p-8 flex-1 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider>
      <AdminLayoutContent>{children}</AdminLayoutContent>
    </ThemeProvider>
  );
}
