import { api as globalApi } from "../../../global-api/api";
import { VolumeHttpClient } from "./volume-http-client";

const { http, sse } = globalApi;

export const api = {
  volume: new VolumeHttpClient(http, sse),
} as const;
