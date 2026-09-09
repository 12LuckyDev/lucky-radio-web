import { config } from "../config/config";
import { HttpClient } from "../core/http-client";
import { SseHttpClient } from "./sse-http-client";

const http = new HttpClient(`${config.apiUrl}/v1`);

export const api = {
  http,
  sse: new SseHttpClient(http),
} as const;
