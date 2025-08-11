import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // C3 Brand Colors (from UX.md analysis)
        c3: {
          "primary-blue": "#006acc",
          "selection-blue": "#0073e6",
          "button-hover": "#0084ff",
          "text-primary": "#292929",
          "text-secondary": "#404040",
          border: "#e5e5e5",
          background: "#ffffff",
          "warning-orange": "#ffbc86",
        },
      },
      fontFamily: {
        sans: [
          '"Helvetica Neue"',
          "Helvetica",
          "Arial",
          '"Lucida Grande"',
          "sans-serif",
        ],
        display: [
          '"Helvetica Neue"',
          "Helvetica",
          "Arial",
          '"Lucida Grande"',
          "sans-serif",
        ],
      },
      borderRadius: {
        c3: "3px", // C3 brand radius
      },
      spacing: {
        "c3-xs": "8px",
        "c3-s": "12px",
        "c3-m": "16px",
        "c3-l": "20px",
        "c3-xl": "24px",
        "c3-xxl": "32px",
        "c3-xxxl": "48px",
      },
    },
  },
  plugins: [],
};

export default config;
