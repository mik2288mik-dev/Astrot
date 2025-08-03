import type { Config } from "tailwindcss";
import konsta from "konsta/plugin";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [konsta],
};

export default config;
