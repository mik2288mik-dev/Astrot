import type { Config } from "tailwindcss";
import konsta from "konsta/config";

export default konsta({
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
}) satisfies Config;
