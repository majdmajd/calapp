// tailwind.config.js
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        blue: {
          650: '#3b82f6', // Customize to your desired shade
          750: '#2563eb', // Customize hover version
        },
      },
    },
  },
  plugins: [],
}
