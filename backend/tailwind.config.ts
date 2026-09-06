import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "surface": "#faf9f9",
        "surface-bright": "#faf9f9",
        "surface-dim": "#dbdad9",
        "surface-variant": "#e3e2e2",
        "surface-container": "#efeded",
        "surface-container-low": "#f4f3f3",
        "surface-container-high": "#e9e8e8",
        "surface-container-highest": "#e3e2e2",
        "surface-container-lowest": "#ffffff",
        "surface-tint": "#5f5e5e",
        "background": "#faf9f9",
        "primary": "#000000",
        "on-primary": "#ffffff",
        "secondary": "#5d5f5f",
        "on-secondary": "#ffffff",
        "accent-gold": "#D4AF37",
        "data-gold": "#D4AF37",
        "dashboard-bg": "#FAFAFA",
        "border-subtle": "#E5E5E5",
        "status-success": "#10B981",
        "status-error": "#EF4444",
        "status-warning": "#F59E0B",
        "status-info": "#3B82F6",
      },
    },
  },
  plugins: [],
};

export default config;
