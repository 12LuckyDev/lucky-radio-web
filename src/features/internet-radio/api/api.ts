import { InternetRadioHttpClient } from "./internet-radio-http-client";
import { StationsHttpClient } from "./stations-http-client";
import { api as globalApi } from "../../../global-api/api";

const { http, sse } = globalApi;

export const api = {
  stations: new StationsHttpClient(http, sse),
  iRadio: new InternetRadioHttpClient(http, sse),
} as const;
