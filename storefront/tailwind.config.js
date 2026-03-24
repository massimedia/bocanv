const path = require("path")

module.exports = {
  darkMode: "class",
  presets: [require("@medusajs/ui-preset")],
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
    "./src/modules/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@medusajs/ui/dist/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      transitionProperty: {
        width: "width margin",
        height: "height",
        bg: "background-color",
        display: "display opacity",
        visibility: "visibility",
        padding: "padding-top padding-right padding-bottom padding-left",
      },
      colors: {
        grey: {
          0: "#FFFFFF",
          5: "#F9FAFB",
          10: "#F3F4F6",
          20: "#E5E7EB",
          30: "#D1D5DB",
          40: "#9CA3AF",
          50: "#6B7280",
          60: "#4B5563",
          70: "#374151",
          80: "#1F2937",
          90: "#111827",
        },
        "brand-red": {
          50: "#FEF1F1",
          100: "#FDD8D7",
          200: "#F9A8A5",
          300: "#F27872",
          400: "#EC5650",
          500: "#E6392F",
          600: "#CC2E25",
          700: "#A8241D",
          800: "#851C17",
          900: "#641512",
          DEFAULT: "#E6392F",
        },
        "brand-yellow": {
          50: "#FFFBEB",
          100: "#FEF3C7",
          200: "#FDE68A",
          300: "#F9D654",
          400: "#F5CC3A",
          500: "#F2C230",
          600: "#D9A71C",
          700: "#B58A15",
          800: "#926E10",
          900: "#78590D",
          DEFAULT: "#F2C230",
        },
        "brand-orange": {
          50: "#FFF5ED",
          100: "#FFE6D0",
          200: "#FFC99A",
          300: "#FFA962",
          400: "#F29545",
          500: "#E68A3C",
          600: "#CC7430",
          700: "#A85D25",
          800: "#87491D",
          900: "#6E3B17",
          DEFAULT: "#E68A3C",
        },
        "brand-blue": {
          50: "#EFF7FC",
          100: "#D6ECF7",
          200: "#ADD9F0",
          300: "#84C5E6",
          400: "#6FB5DC",
          500: "#5FA8D3",
          600: "#4A8FBA",
          700: "#3A7399",
          800: "#2E5B7A",
          900: "#244964",
          DEFAULT: "#5FA8D3",
        },
        "brand-green": {
          50: "#F0F9F2",
          100: "#D5EEDA",
          200: "#AFDDB8",
          300: "#88CC96",
          400: "#77C488",
          500: "#66B77A",
          600: "#529E64",
          700: "#418150",
          800: "#34673F",
          900: "#2A5434",
          DEFAULT: "#66B77A",
        },
        "brand-cream": {
          50: "#FFFEF9",
          100: "#FFFAEC",
          200: "#FFF7DF",
          300: "#FFF4D6",
          DEFAULT: "#FFF4D6",
        },
        "brand-dark": {
          50: "#F5F5F5",
          100: "#D4D4D4",
          200: "#A3A3A3",
          300: "#737373",
          400: "#525252",
          500: "#1A1A1A",
          600: "#161616",
          700: "#121212",
          800: "#0D0D0D",
          900: "#090909",
          DEFAULT: "#1A1A1A",
        },
      },
      borderRadius: {
        none: "0px",
        soft: "2px",
        base: "4px",
        rounded: "8px",
        large: "16px",
        circle: "9999px",
      },
      maxWidth: {
        "8xl": "100rem",
        content: "1440px",
        "content-wide": "1600px",
      },
      screens: {
        "2xsmall": "320px",
        xsmall: "512px",
        small: "1024px",
        medium: "1280px",
        large: "1440px",
        xlarge: "1680px",
        "2xlarge": "1920px",
      },
      fontSize: {
        "3xl": "2rem",
      },
      fontFamily: {
        sans: [
          "var(--font-body)",
          "Rubik",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "sans-serif",
        ],
        display: [
          "var(--font-display)",
          "Anton",
          "Impact",
          "sans-serif",
        ],
      },
      keyframes: {
        ring: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        "fade-in-right": {
          "0%": {
            opacity: "0",
            transform: "translateX(10px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateX(0)",
          },
        },
        "fade-in-top": {
          "0%": {
            opacity: "0",
            transform: "translateY(-10px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
        "fade-out-top": {
          "0%": {
            height: "100%",
          },
          "99%": {
            height: "0",
          },
          "100%": {
            visibility: "hidden",
          },
        },
        "accordion-slide-up": {
          "0%": {
            height: "var(--radix-accordion-content-height)",
            opacity: "1",
          },
          "100%": {
            height: "0",
            opacity: "0",
          },
        },
        "accordion-slide-down": {
          "0%": {
            "min-height": "0",
            "max-height": "0",
            opacity: "0",
          },
          "100%": {
            "min-height": "var(--radix-accordion-content-height)",
            "max-height": "none",
            opacity: "1",
          },
        },
        enter: {
          "0%": { transform: "scale(0.9)", opacity: 0 },
          "100%": { transform: "scale(1)", opacity: 1 },
        },
        leave: {
          "0%": { transform: "scale(1)", opacity: 1 },
          "100%": { transform: "scale(0.9)", opacity: 0 },
        },
        "slide-in": {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(0)" },
        },
        "drawer-up": {
          "0%": { transform: "translateY(100%)" },
          "100%": { transform: "translateY(0)" },
        },
      },
      animation: {
        ring: "ring 2.2s cubic-bezier(0.5, 0, 0.5, 1) infinite",
        "fade-in-right":
          "fade-in-right 0.3s cubic-bezier(0.5, 0, 0.5, 1) forwards",
        "fade-in-top": "fade-in-top 0.2s cubic-bezier(0.5, 0, 0.5, 1) forwards",
        "fade-out-top":
          "fade-out-top 0.2s cubic-bezier(0.5, 0, 0.5, 1) forwards",
        "accordion-open":
          "accordion-slide-down 300ms cubic-bezier(0.87, 0, 0.13, 1) forwards",
        "accordion-close":
          "accordion-slide-up 300ms cubic-bezier(0.87, 0, 0.13, 1) forwards",
        enter: "enter 200ms ease-out",
        "slide-in": "slide-in 1.2s cubic-bezier(.41,.73,.51,1.02)",
        leave: "leave 150ms ease-in forwards",
        "drawer-up": "drawer-up 300ms ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-radix")()],
}
