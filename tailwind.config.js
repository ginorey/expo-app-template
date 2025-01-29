import { Colors } from "./constants/colors";

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        background: Colors.background,
        backgroundSecondary: Colors.backgroundSecondary,
        primary: Colors.primary,
        secondary: Colors.secondary,
        link: Colors.link,
        accent: Colors.accent,
        border: Colors.border,
        icon: Colors.icon,
        tabIconDefault: Colors.tabIconDefault,
        tabIconSelected: Colors.tabIconSelected,
      },
      spacing: {
        xs: 4,
        sm: 8,
        md: 16,
        lg: 24,
        xl: 36,
      },
    },
  },
  plugins: [],
};
