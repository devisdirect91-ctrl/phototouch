import type { Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Canvas + élévations
        canvas: "#0A0A0B",
        surface: {
          DEFAULT: "#131316",
          soft: "#0F0F12",
          raised: "#1C1C20",
          overlay: "#25252B",
        },
        hairline: "rgba(255,255,255,0.08)",
        // Texte (encre sur canvas)
        ink: {
          DEFAULT: "#F5F5F7",
          muted: "#A1A1AA",
          faint: "#71717A",
        },
        // Accents — spectre électrique
        brand: {
          DEFAULT: "#7C3AED",
          bright: "#8B5CF6",
          deep: "#6D28D9",
        },
        electric: "#3B82F6",
        scan: {
          DEFAULT: "#22D3EE",
          deep: "#06B6D4",
        },
        success: "#10B981",
        danger: "#EF4444",
      },
      fontFamily: {
        sans: ["var(--font-sans)", ...fontFamily.sans],
        display: ["var(--font-display)", ...fontFamily.sans],
        mono: ["var(--font-mono)", ...fontFamily.mono],
      },
      borderRadius: {
        "4xl": "2rem",
      },
      boxShadow: {
        "glow-brand": "0 8px 40px -8px rgba(124,58,237,0.55)",
        "glow-brand-lg":
          "0 0 0 1px rgba(124,58,237,0.30), 0 12px 60px -10px rgba(124,58,237,0.65)",
        "glow-scan": "0 0 36px -10px rgba(34,211,238,0.55)",
        "glow-soft": "0 10px 40px -12px rgba(0,0,0,0.7)",
      },
      backgroundImage: {
        spectrum:
          "linear-gradient(135deg, #7C3AED 0%, #3B82F6 50%, #22D3EE 100%)",
        "spectrum-soft":
          "linear-gradient(135deg, rgba(124,58,237,0.20), rgba(59,130,246,0.12) 50%, rgba(34,211,238,0.18))",
        "radial-brand":
          "radial-gradient(60% 60% at 50% 0%, rgba(124,58,237,0.25), transparent 70%)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(14px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "scan-y": {
          "0%": { transform: "translateY(-110%)" },
          "100%": { transform: "translateY(110%)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
        "pulse-glow": {
          "0%, 100%": { opacity: "0.55" },
          "50%": { opacity: "1" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.7s cubic-bezier(0.16,1,0.3,1) both",
        "scan-y": "scan-y 2.6s cubic-bezier(0.4,0,0.2,1) infinite",
        shimmer: "shimmer 2.6s linear infinite",
        float: "float 6s ease-in-out infinite",
        "pulse-glow": "pulse-glow 3.2s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
export default config;
