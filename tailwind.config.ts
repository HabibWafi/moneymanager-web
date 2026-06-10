import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      boxShadow: {
        card: "0 1px 3px rgba(0,0,0,0.04), 0 6px 24px rgba(0,0,0,0.06)",
        "glow-indigo": "0 4px 20px -4px rgba(79,70,229,0.25)",
        "glow-emerald": "0 4px 20px -4px rgba(16,185,129,0.25)",
        "glow-red": "0 4px 20px -4px rgba(239,68,68,0.2)",
        "glow-violet": "0 4px 20px -4px rgba(124,58,237,0.25)",
        "glow-amber": "0 4px 20px -4px rgba(217,119,6,0.25)",
      },
    },
  },
  plugins: [],
};
export default config;
