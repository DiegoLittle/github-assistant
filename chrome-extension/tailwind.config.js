/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: "jit",
  darkMode: "class",
  content: ["./**/*.tsx","./popup.tsx","./*.tsx"],
  plugins: [],
  theme:{
    extend:{
      colors: {
        primary6: "#0067F1",
      primary: "#2A85FF",
      neutral: {
        '0': "#ffffff",
        '100': "#FCFCFC",
        '200': "#F4F4F4",
        '300': "#EFEFEF",
        '400': "#6F767E",
        '500': "#33383F",
        '600': "#272B30",
        '700': "#1A1D1F",
        '800': "#111315",
      }
      }
    }
  }
}