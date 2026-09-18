import { config } from "../../../config/config";
import type { HttpClient } from "../../../core/http-client";
import type { SseHttpClient } from "../../../global-api/sse-http-client";
import type { PlayerStatusDTO } from "../models/player-status-dto";

export class PlayerHttpClient {
  private readonly http: HttpClient;
  private readonly sse: SseHttpClient;
  private readonly basePath: string;

  constructor(http: HttpClient, sse: SseHttpClient) {
    this.http = http;
    this.sse = sse;
    this.basePath = config.useIRadioPrefix ? "/i-radio/player" : "/player";
  }

  public stopPlayer() {
    return this.http.post(`${this.basePath}/stop`);
  }

  public getStatus(): Promise<PlayerStatusDTO> {
    return this.http.get(`${this.basePath}/status`);
  }

  public setVolume(volume: number): Promise<void> {
    return this.http.put(`${this.basePath}/volume/${volume}`);
  }

  public listenForPlayerStatusChange(
    listener: (status: PlayerStatusDTO) => void,
  ): () => void {
    return this.sse.listen(
      "player.status-update",
      (status: PlayerStatusDTO) => {
        if (status.type === "MPD") {
          listener(status);
        }
      },
    );
  }
}
