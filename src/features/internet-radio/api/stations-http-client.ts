import type { HttpClient } from "../../../core/http-client";
import type { CurrentStationInfoDTO } from "../models/current-station-dto";
import type {
  CreateStationDTO,
  StationDTO,
  UpdateStationDTO,
} from "../models/station-dto";
import { config } from "../../../config/config";
import type { SseHttpClient } from "../../../global-api/sse-http-client";

export class StationsHttpClient {
  private readonly http: HttpClient;
  private readonly sse: SseHttpClient;
  private readonly basePath: string;

  constructor(http: HttpClient, sse: SseHttpClient) {
    this.http = http;
    this.sse = sse;
    this.basePath = config.useIRadioPrefix ? "/i-radio/stations" : "/stations";
  }

  public playStation(stationId: string) {
    return this.http.post(`${this.basePath}/play/${stationId}`);
  }

  public playNext(stationId: string) {
    return this.http.post(`${this.basePath}/play-next/${stationId}`);
  }

  public playPrev(stationId: string) {
    return this.http.post(`${this.basePath}/play-prev/${stationId}`);
  }

  public getStations(): Promise<StationDTO[]> {
    return this.http.get(this.basePath);
  }

  public postStation(station: CreateStationDTO): Promise<StationDTO> {
    return this.http.post(this.basePath, station);
  }

  public patchStation(
    id: string,
    station: UpdateStationDTO,
  ): Promise<StationDTO> {
    return this.http.patch(`${this.basePath}/${id}`, station);
  }

  public deleteStation(id: string): Promise<void> {
    return this.http.delete(`${this.basePath}/${id}`);
  }

  public getCurrentStation(): Promise<CurrentStationInfoDTO> {
    return this.http.get(`${this.basePath}/current`);
  }

  public listenForCurrentStationChange(
    listener: (current: CurrentStationInfoDTO) => void,
  ): () => void {
    return this.sse.listen("stations.current-update", listener);
  }

  public listenForStationsChange(listener: () => void): () => void {
    return this.sse.listen("stations.stations-update", listener);
  }
}
