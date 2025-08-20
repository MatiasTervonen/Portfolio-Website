module.exports = {
  content: [
    "./*.html",
    "./**/*.html",
    "./javascript/**/*.js",
    "./css/**/*.css",
  ],
  theme: {
    extend: {
      gridTemplateRows: { 15: "repeat(15, minmax(0, 1fr))" },
      gridTemplateColumns: { 15: "repeat(15, minmax(0, 1fr))" },
    },
  },
};
