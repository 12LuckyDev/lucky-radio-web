import { GlobalHttpClient } from "./global-http-client";
import { api as globalApi } from "../../../global-api/api";

const { http } = globalApi;

export const api = {
  global: new GlobalHttpClient(http),
} as const;
