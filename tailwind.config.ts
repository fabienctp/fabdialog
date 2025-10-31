import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        input: "var(--fab-dialog-input)",
        ring: "var(--fab-dialog-ring)",
        background: "var(--fab-dialog-background)",
        foreground: "var(--fab-dialog-foreground)",
        primary: {
          DEFAULT: "var(--fab-dialog-primary)",
          foreground: "var(--fab-dialog-primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--fab-dialog-secondary)",
          foreground: "var(--fab-dialog-secondary-foreground)",
        },
        destructive: {
          DEFAULT: "var(--fab-dialog-destructive)",
          foreground: "var(--fab-dialog-destructive-foreground)",
        },
        muted: {
          DEFAULT: "var(--fab-dialog-muted)",
          foreground: "var(--fab-dialog-muted-foreground)",
        },
        accent: {
          DEFAULT: "var(--fab-dialog-accent)",
          foreground: "var(--fab-dialog-accent-foreground)",
        },
      },
      borderRadius: {
        lg: "var(--fab-dialog-radius)",
        md: "calc(var(--fab-dialog-radius) - 2px)",
        sm: "calc(var(--fab-dialog-radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;