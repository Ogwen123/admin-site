/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "bg": "#22272e",
        "bgdark": "#1c2128",
        "main": "#2563eb",
        "maindark": "#1b46a6",
        "secondary": "#f57c00",
        "secondarydark": "#d66d02",
        "success": "#27ea60",
        "error": "#c0392b",
        "errordark": "#9c2e22",
        "warning": "#e67e22",
        "warningdark": "#ab5e1a",
        "hr": "#444c56",
        "hrdark": "#292e36",
        "textlight": "#9ca3af",
      },
    },
  },
  plugins: [],
}

