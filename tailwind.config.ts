import type { Config } from "tailwindcss";
import framework7 from "framework7/plugin";
import konsta from "konsta/plugin";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [framework7, konsta],
};

export default config;
