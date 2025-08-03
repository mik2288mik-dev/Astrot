declare module "konsta/config" {
  import type { Config } from "tailwindcss";
  const konstaConfig: (config?: Config) => Config;
  export default konstaConfig;
}
