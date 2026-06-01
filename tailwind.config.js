/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "page-bg": "#FAFAFA",
        "section-dark": "#0A0A0A",
        "section-dark-alt": "#111111",
        "card-dark": "#1A1A1A",
        "card-dark-hover": "#222222",
        "card-border": "#2A2A2A",
        "text-primary-light": "#0A0A0A",
        "text-secondary-light": "#666666",
        "text-primary-dark": "#FFFFFF",
        "text-secondary-dark": "#A0A0A0",
        "accent-primary": "#B8001F",
        "accent-secondary": "#490207",
        "accent-hover": "#9A0019",
        // shadcn/ui CSS variable colors
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },
        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "var(--destructive-foreground)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
        },
        popover: {
          DEFAULT: "var(--popover)",
          foreground: "var(--popover-foreground)",
        },
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
      },
      borderColor: {
        DEFAULT: "var(--border)",
      },
      outlineColor: {
        ring: "var(--ring)",
      },
      ringColor: {
        ring: "var(--ring)",
      },
      fontFamily: {
        poppins: ["var(--font-poppins)", "system-ui", "sans-serif"],
        "space-grotesk": ["var(--font-space-grotesk)", "system-ui", "sans-serif"],
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--accordion-panel-height)" },
        },
        "accordion-up": {
          from: { height: "var(--accordion-panel-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [],
};
