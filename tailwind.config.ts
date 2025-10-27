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
        border: "hsl(var(--fab-border))",
        input: "hsl(var(--fab-input))",
        ring: "hsl(var(--fab-ring))",
        background: "hsl(var(--fab-background))",
        foreground: "hsl(var(--fab-foreground))",
        primary: {
          DEFAULT: "hsl(var(--fab-primary))",
          foreground: "hsl(var(--fab-primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--fab-secondary))",
          foreground: "hsl(var(--fab-secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--fab-destructive))",
          foreground: "hsl(var(--fab-destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--fab-muted))",
          foreground: "hsl(var(--fab-muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--fab-accent))",
          foreground: "hsl(var(--fab-accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--fab-popover))",
          foreground: "hsl(var(--fab-popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--fab-card))",
          foreground: "hsl(var(--fab-card-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--fab-sidebar-background))",
          foreground: "hsl(var(--fab-sidebar-foreground))",
          primary: "hsl(var(--fab-sidebar-primary))",
          "primary-foreground": "hsl(var(--fab-sidebar-primary-foreground))",
          accent: "hsl(var(--fab-sidebar-accent))",
          "accent-foreground": "hsl(var(--fab-sidebar-accent-foreground))",
          border: "hsl(var(--fab-sidebar-border))",
          ring: "hsl(var(--fab-sidebar-ring))",
        },
      },
      borderRadius: {
        lg: "var(--fab-radius)",
        md: "calc(var(--fab-radius) - 2px)",
        sm: "calc(var(--fab-radius) - 4px)",
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