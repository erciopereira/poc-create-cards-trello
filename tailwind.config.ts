import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    fontFamily: {
      sans: "var(--font-helixa)",
    },
    extend: {
      colors: {
        base: "#3182ce",
        hover: "#0059ad",
      },
      height: {
        "stepper-height": "calc(100vh - 3.25rem)",
        "content-height": "calc(100vh - 65px)",
        "errors-height": "calc(100vh - 60px)",
      },
      width: {
        "content-view": "calc(100vw - 368px)",
      },
    },
  },
  plugins: [],
};
export default config;
