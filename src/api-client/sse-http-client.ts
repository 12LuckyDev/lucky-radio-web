import type { HttpClient } from "../core/http-client";
import type { ApiSseEventDTO } from "../models/api-sse-event-dto";
import type { CurrentStationInfoDTO } from "../models/current-station-dto";
import type { PlayerStatusUpdateDTO } from "../models/player-status-update-dto";

export class SseHttpClient {
  private readonly http: HttpClient;
  private readonly event: EventSource;

  constructor(http: HttpClient) {
    this.http = http;

    this.event = new EventSource(`${this.http.baseUrl}/sse`);
  }

  public listenForPlayerStatusChange(
    listener: (status: PlayerStatusUpdateDTO) => void,
  ): () => void {
    const eventListener = (event: { data: string }) => {
      const eventData: ApiSseEventDTO = JSON.parse(event.data);
      if (eventData.type === "player.status-update") listener(eventData.data);
    };
    this.event.addEventListener("message", eventListener);

    return () => this.event.removeEventListener("message", eventListener);
  }

  public listenForCurrentStationChange(
    listener: (current: CurrentStationInfoDTO) => void,
  ): () => void {
    const eventListener = (event: { data: string }) => {
      const eventData: ApiSseEventDTO = JSON.parse(event.data);
      if (eventData.type === "stations.current-update")
        listener(eventData.data);
    };
    this.event.addEventListener("message", eventListener);

    return () => this.event.removeEventListener("message", eventListener);
  }

  public listenForStationsChange(listener: () => void): () => void {
    const eventListener = (event: { data: string }) => {
      const eventData: ApiSseEventDTO = JSON.parse(event.data);
      if (eventData.type === "stations.stations-update") listener();
    };
    this.event.addEventListener("message", eventListener);

    return () => this.event.removeEventListener("message", eventListener);
  }
}
