export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#F97316',
          hover: '#ea580c'
        },
        success: '#10B981',
        danger: '#EF4444',
        warning: '#FBBF24',
        info: '#3B82F6',
      }
    },
  },
  plugins: [],
}
