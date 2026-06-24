export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          red: "#C62828",
          maroon: "#7B1E1E",
          gold: "#F9A825",
          cream: "#FFF8E1",
          charcoal: "#263238"
        }
      },
      boxShadow: {
        soft: "0 18px 45px rgba(38, 50, 56, 0.12)"
      },
      fontFamily: {
        display: ["Georgia", "Cambria", "Times New Roman", "serif"],
        body: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"]
      }
    }
  },
  plugins: []
};
