import { config } from "../config/config";
import { HttpClient } from "../core/http-client";
import { PlayerHttpClient } from "./player-http-client";
import { SseHttpClient } from "./sse-http-client";
import { StationsHttpClient } from "./stations-http-client";

const http = new HttpClient(`${config.apiUrl}/v1`);

export const api = {
  stations: new StationsHttpClient(http),
  player: new PlayerHttpClient(http),
  sse: new SseHttpClient(http),
};
