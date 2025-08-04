import type { Config } from "tailwindcss";
import konstaConfig from "konsta/config";
import forms from "@tailwindcss/forms";
import typography from "@tailwindcss/typography";

const config = konstaConfig({
  content: ["./src/**/*.{js,ts,jsx,tsx}", "./app/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [forms, typography],
}) satisfies Config;

export default config;
