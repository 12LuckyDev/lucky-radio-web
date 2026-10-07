import type { HttpClient } from "../../../core/http-client";
import type { SseHttpClient } from "../../../global-api/sse-http-client";

export class VolumeHttpClient {
  private readonly http: HttpClient;
  private readonly sse: SseHttpClient;
  private readonly basePath: string;

  constructor(http: HttpClient, sse: SseHttpClient) {
    this.http = http;
    this.sse = sse;
    this.basePath = "/volume";
  }

  public getVolume(): Promise<{ volume: number }> {
    return this.http.get(`${this.basePath}`);
  }

  public setVolume(volume: number): Promise<void> {
    return this.http.put(`${this.basePath}/${volume}`);
  }

  public listenForVolumeChange(
    listener: (current: number | { error: string }) => void,
  ): () => void {
    return this.sse.listen("global-volume-change", listener);
  }
}
