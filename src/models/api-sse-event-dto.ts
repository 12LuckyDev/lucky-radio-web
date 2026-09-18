import type { CurrentStationInfoDTO } from "../features/internet-radio/models/current-station-dto";
import type { PlayerStatusDTO } from "../features/internet-radio/models/player-status-dto";

export type ApiSseEventDTO =
  | {
      type: "stations.current-update";
      data: CurrentStationInfoDTO;
    }
  | {
      type: "stations.stations-update";
      data: "stations-update";
    }
  | {
      type: "player.status-update";
      data: PlayerStatusDTO;
    };
