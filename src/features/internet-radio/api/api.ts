import { PlayerHttpClient } from "./player-http-client";
import { StationsHttpClient } from "./stations-http-client";
import { api as globalApi } from "../../../global-api/api";

const { http, sse } = globalApi;

export const api = {
  stations: new StationsHttpClient(http, sse),
  player: new PlayerHttpClient(http, sse),
} as const;
