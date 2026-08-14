import type { ConfigOptions } from "./config-options";

const windowConfig: { APP_CONFIG: { API_URL: string } } = window as unknown as {
  APP_CONFIG: { API_URL: string };
};

const apiUrl = (
  import.meta.env.VITE_API_URL ?? windowConfig.APP_CONFIG.API_URL
).replace(/\/$/, "");

const config: ConfigOptions = {
  apiUrl,
};

export { config };
