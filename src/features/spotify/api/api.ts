import { SpotifyHttpClient } from "./spotify-http-client";
import { api as globalApi } from "../../../global-api/api";

const { http, sse } = globalApi;

export const api = {
  spotify: new SpotifyHttpClient(http, sse),
} as const;
