/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#3D8F86",
          hover: "#2F6F68",
          light: "#E8F3F1",
        },
        cta: {
          DEFAULT: "#E8795A",
          hover: "#D3654A",
        },
        surface: {
          DEFAULT: "#F7F9F8",
          raised: "#FFFFFF",
          dark: "#132320",
          "dark-raised": "#1B302C",
        },
        border: {
          DEFAULT: "#DCE6E4",
          dark: "#294540",
        },
        ink: {
          DEFAULT: "#1E2A28",
          soft: "#5B6C69",
          dark: "#EAF2F0",
          "dark-soft": "#9FB5B1",
        },
        success: "#6FA77A",
        danger: "#C15C4C",
      },
      fontFamily: {
        sans: [
          "Poppins",
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
        ],
      },
      borderRadius: {
        card: "1rem",
        control: "0.625rem",
      },
      boxShadow: {
        subtle: "0 1px 2px rgba(30, 42, 40, 0.06)",
        card: "0 2px 10px rgba(30, 42, 40, 0.06)",
        raised: "0 8px 24px rgba(30, 42, 40, 0.10)",
      },
      transitionDuration: {
        DEFAULT: "180ms",
      },
      keyframes: {
        "panel-in": {
          "0%": { opacity: "0", transform: "translateY(8px) scale(0.98)" },
          "100%": { opacity: "1", transform: "translateY(0) scale(1)" },
        },
        "bounce-dot": {
          "0%, 80%, 100%": { transform: "scale(0.6)", opacity: "0.5" },
          "40%": { transform: "scale(1)", opacity: "1" },
        },
      },
      animation: {
        "panel-in": "panel-in 180ms ease-out",
        "bounce-dot": "bounce-dot 1.2s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
