import type { ConfigOptions } from "./config-options";

type WindowConfig = {
  APP_CONFIG: {
    API_URL: string;
    USE_I_RADIO_PREFIX?: boolean;
    SUBPATH: string;
  };
};

const windowConfig: WindowConfig = window as unknown as WindowConfig;

const apiUrl = (
  import.meta.env.VITE_API_URL ?? windowConfig.APP_CONFIG.API_URL
).replace(/\/$/, "");

const useIRadioPrefix =
  import.meta.env.VITE_USE_I_RADIO_PREFIX ??
  windowConfig.APP_CONFIG.USE_I_RADIO_PREFIX;

const envSubpath = import.meta.env.VITE_SUBPATH;

console.log(envSubpath);

const subpath = (
  import.meta.env.VITE_SUBPATH ??
  windowConfig.APP_CONFIG.SUBPATH ??
  ""
).replace(/\/$/, "");

const config: ConfigOptions = {
  apiUrl,
  useIRadioPrefix: !!useIRadioPrefix,
  subpath,
};

export { config };
