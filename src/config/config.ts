import type { ConfigOptions } from "./config-options";

type WindowConfig = {
  APP_CONFIG: {
    API_URL: string;
    USE_I_RADIO_PREFIX: boolean;
  };
};

const windowConfig: WindowConfig = window as unknown as WindowConfig;

const apiUrl = (
  import.meta.env.VITE_API_URL ?? windowConfig.APP_CONFIG.API_URL
).replace(/\/$/, "");

const useIRadioPrefix = (
  import.meta.env.VITE_USE_I_RADIO_PREFIX ??
  windowConfig.APP_CONFIG.USE_I_RADIO_PREFIX
).replace(/\/$/, "");

const config: ConfigOptions = {
  apiUrl,
  useIRadioPrefix,
};

export { config };
