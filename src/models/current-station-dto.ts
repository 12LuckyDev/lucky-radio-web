import type { StationDTO } from "./station-dto";

export type CurrentStationDTO =
  | StationDTO
  | {
      id: null;
    }
  | null;

export type CurrentStationInfoDTO = {
  station: CurrentStationDTO;
  hasPrev: boolean;
  hasNext: boolean;
};
