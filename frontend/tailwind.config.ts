import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: "#B91C1C", // Deep Red (Automotive passion)
                    foreground: "#FFFFFF",
                },
                secondary: {
                    DEFAULT: "#1E293B", // Slate 800 (Premium dark)
                    foreground: "#F8FAFC",
                },
                accent: "#F59E0B", // Amber (Call to action/Alerts)
            },
            fontFamily: {
                sans: ['var(--font-inter)', 'sans-serif'],
            },
        },
    },
    plugins: [],
};
export default config;
