import type { HttpClient } from "../core/http-client";
import type { PlayerStatusDTO } from "../models/player-status-dto";

export class PlayerHttpClient {
  private readonly http: HttpClient;

  constructor(http: HttpClient) {
    this.http = http;
  }

  public stopPlayer() {
    return this.http.post("/player/stop");
  }

  public getStatus(): Promise<PlayerStatusDTO> {
    return this.http.get("/player/status");
  }

  public setVolume(volume: number): Promise<void> {
    return this.http.put(`/player/volume/${volume}`);
  }
}
