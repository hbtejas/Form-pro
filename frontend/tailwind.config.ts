export default {
	content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
	theme: {
		fontFamily: {
			instrument: ["Instrument Serif", "serif"],
			mono: ["JetBrains Mono", "monospace"],
		},
		extend: {
			colors: {
				"surface-white": "#ffffff",
				"surface-gray-1": "#f9fafb",
				"ink-gray-2": "#6b7280",
				"ink-gray-4": "#374151",
				"ink-gray-7": "#111827",
				"ink-gray-8": "#111827",
			},
		},
	},

	plugins: [],
}
