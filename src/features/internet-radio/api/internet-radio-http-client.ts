import { config } from "../../../config/config";
import type { HttpClient } from "../../../core/http-client";
import type {
  PlayerStateDTO,
  PlayerStateWithTypeDTO,
} from "../../../dto/player-state-dto";
import type { SseHttpClient } from "../../../global-api/sse-http-client";

export class InternetRadioHttpClient {
  private readonly http: HttpClient;
  private readonly sse: SseHttpClient;
  private readonly basePath: string;

  constructor(http: HttpClient, sse: SseHttpClient) {
    this.http = http;
    this.sse = sse;
    this.basePath = config.useIRadioPrefix ? "/i-radio" : "";
  }

  public stopPlayer() {
    return this.http.post(`${this.basePath}/stop`);
  }

  public getState(): Promise<PlayerStateDTO> {
    return this.http.get(`${this.basePath}/state`);
  }

  public listenForPlayerStateChange = (
    listener: (state: PlayerStateDTO) => void,
  ): (() => void) => {
    return this.sse.listen(
      "player.state-update",
      ({ state, type }: PlayerStateWithTypeDTO) => {
        if (type === "i-radio") {
          listener({ state });
        }
      },
    );
  };
}
