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
        background: "#FAFAF8",
        surface: "#FFFFFF",
        "text-primary": "#1A1A18",
        "text-secondary": "#6B6B65",
        border: "#E8E6E0",
        "accent-gold": "#C9A84C",
        "domain-metacognition": "#4A7C9E",
        "domain-reasoning": "#7B6CA8",
        "domain-emotion": "#B85C5C",
        "domain-memory": "#5A8C6A",
        "domain-executive": "#C4874A",
      },
      fontFamily: {
        display: ["'Playfair Display'", "Georgia", "serif"],
        body: ["'DM Sans'", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
