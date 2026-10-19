import type { HttpClient } from "../../../core/http-client";
import type {
  PlayerStateDTO,
  PlayerStateWithTypeDTO,
} from "../../../dto/player-state-dto";
import type { SseHttpClient } from "../../../global-api/sse-http-client";
import type { CurrentSongInfoDTO } from "../models";

export class SpotifyHttpClient {
  private readonly http: HttpClient;
  private readonly sse: SseHttpClient;
  private readonly basePath: string;

  constructor(http: HttpClient, sse: SseHttpClient) {
    this.http = http;
    this.sse = sse;
    this.basePath = "/spotify";
  }

  public getState(): Promise<PlayerStateDTO> {
    return this.http.get(`${this.basePath}/state`);
  }

  public getCurrent(): Promise<CurrentSongInfoDTO> {
    return this.http.get(`${this.basePath}/current`);
  }

  public listenForPlayerStateChange = (
    listener: (state: PlayerStateDTO) => void,
  ): (() => void) => {
    return this.sse.listen(
      "player.state-update",
      ({ state, type }: PlayerStateWithTypeDTO) => {
        if (type === "spotify") {
          listener({ state });
        }
      },
    );
  };

  public listenForCurrentChange = (
    listener: (state: CurrentSongInfoDTO) => void,
  ): (() => void) => {
    return this.sse.listen("spotify.current-update", listener);
  };
}
