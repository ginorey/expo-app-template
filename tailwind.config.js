import { Colors } from "./constants/Colors";

/** @type {import('tailwindcss').Config} */
module.exports = {
	// NOTE: Update this to include the paths to all of your component files.
	content: ["./app/**/*.{js,jsx,ts,tsx}"],
	presets: [require("nativewind/preset")],
	theme: {
		extend: {
			colors: {
				background: Colors.background,
				primary: Colors.primary,
				secondary: Colors.secondary,
				accent: Colors.accent,
				border: Colors.border,
				icon: Colors.icon,
				tabIconDefault: Colors.tabIconDefault,
				tabIconSelected: Colors.tabIconSelected,
			},
		},
	},
	plugins: [],
};
