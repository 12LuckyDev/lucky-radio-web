import type { CurrentStationInfoDTO } from "../features/internet-radio/models/current-station-dto";
import type { CurrentSongInfoDTO } from "../features/spotify/models";
import type { DeviceInfoDTO } from "../features/spotify/models/device-info.dto";
import type { PlayerStateWithTypeDTO } from "./player-state-dto";

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
      type: "player.state-update";
      data: PlayerStateWithTypeDTO;
    }
  | {
      type: "global-volume-change";
      data: number | { error: string };
    }
  | {
      type: "spotify.current-update";
      data: CurrentSongInfoDTO;
    }
  | {
      type: "spotify.device-update";
      data: DeviceInfoDTO;
    };
