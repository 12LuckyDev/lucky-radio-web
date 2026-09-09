import type { HttpClient } from "../core/http-client";
import type { ApiSseEventDTO } from "../models/api-sse-event-dto";

type SseEventMap = {
  [E in ApiSseEventDTO as E["type"]]: E["data"];
};

export class SseHttpClient {
  private readonly http: HttpClient;
  private readonly event: EventSource;

  constructor(http: HttpClient) {
    this.http = http;

    this.event = new EventSource(`${this.http.baseUrl}/sse`);
  }

  public listen<K extends keyof SseEventMap>(
    type: K,
    listener: (data: SseEventMap[K]) => void,
  ): () => void {
    const eventListener = (event: MessageEvent<string>) => {
      const eventData: ApiSseEventDTO = JSON.parse(event.data);

      if (eventData.type !== type) {
        return;
      }

      listener(eventData.data as SseEventMap[K]);
    };

    this.event.addEventListener("message", eventListener);

    return () => {
      this.event.removeEventListener("message", eventListener);
    };
  }
}
