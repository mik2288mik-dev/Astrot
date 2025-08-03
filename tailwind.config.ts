import type { Config } from "tailwindcss";
import konstaConfig from "konsta/config";

const config = konstaConfig({
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
}) satisfies Config;

export default config;
