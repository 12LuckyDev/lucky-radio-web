import type { CurrentStationInfoDTO } from "./current-station-dto";
import type { PlayerStatusUpdateDTO } from "./player-status-update-dto";

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
      data: PlayerStatusUpdateDTO;
    };
