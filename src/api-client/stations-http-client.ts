import type { HttpClient } from "../core/http-client";
import type { CurrentStationInfoDTO } from "../models/current-station-dto";
import type {
  CreateStationDTO,
  StationDTO,
  UpdateStationDTO,
} from "../models/station-dto";

export class StationsHttpClient {
  private readonly http: HttpClient;

  constructor(http: HttpClient) {
    this.http = http;
  }

  public playStation(stationId: string) {
    return this.http.post(`/stations/play/${stationId}`);
  }

  public playNext(stationId: string) {
    return this.http.post(`/stations/play-next/${stationId}`);
  }

  public playPrev(stationId: string) {
    return this.http.post(`/stations/play-prev/${stationId}`);
  }

  public getStations(): Promise<StationDTO[]> {
    return this.http.get("/stations");
  }

  public postStation(station: CreateStationDTO): Promise<StationDTO> {
    return this.http.post("/stations", station);
  }

  public patchStation(
    id: string,
    station: UpdateStationDTO,
  ): Promise<StationDTO> {
    return this.http.patch(`/stations/${id}`, station);
  }

  public deleteStation(id: string): Promise<void> {
    return this.http.delete(`/stations/${id}`);
  }

  public getCurrentStation(): Promise<CurrentStationInfoDTO> {
    return this.http.get("/stations/current");
  }
}
