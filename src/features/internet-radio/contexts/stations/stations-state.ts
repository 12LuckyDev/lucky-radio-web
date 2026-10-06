import type { StationDTO } from "../../models/station-dto";
import type { CurrentStationInfoDTO } from "../../models/current-station-dto";

export const NO_STATIONS = "No station selected";
export const UNKNOWN_STATION = "Unknown station";

export type StationsStore = {
  stations: StationDTO[];
  current: CurrentStationInfoDTO;
};

export const initialState: StationsStore = {
  stations: [],
  current: { station: null, hasNext: false, hasPrev: false },
};

export type StationsAction =
  | {
      type: "stationsLoaded";
      payload: StationDTO[];
    }
  | {
      type: "currentChanged";
      payload: CurrentStationInfoDTO;
    };
