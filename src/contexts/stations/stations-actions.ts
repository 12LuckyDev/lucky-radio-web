import type { Dispatch } from "preact/hooks";
import type { StationDTO } from "../../models/station-dto";
import { api } from "../../api-client/api";
import { withMinimumDuration } from "../../utils/with-minimum-duration";

import type { StationsAction } from "./stations-state";
import { errorMsgHelper } from "../../core/error-msg-helper";
import type { NotificationsState } from "../notification/notification-context";
import type { ProgressState } from "../progress/progress-context";

export async function loadStations(
  dispatch: Dispatch<StationsAction>,
  notifications: NotificationsState,
  progress: ProgressState,
) {
  try {
    progress.show();
    const stations = await api.stations.getStations();

    dispatch({
      type: "stationsLoaded",
      payload: stations,
    });
  } catch (error) {
    console.error("Failed to load stations", error);
    notifications.danger(errorMsgHelper(error));
  } finally {
    progress.hide();
  }
}

export async function loadCurrentStation(
  dispatch: Dispatch<StationsAction>,
  setActiveTab: (tab: "stations" | "player") => void,
  setIsLoading: (loading: boolean) => void,
  notifications: NotificationsState,
) {
  try {
    await withMinimumDuration(async () => {
      const current = await api.stations.getCurrentStation();

      dispatch({
        type: "currentChanged",
        payload: current,
      });

      setActiveTab(current.station === null ? "stations" : "player");
    }, 1000);
  } catch (error) {
    console.error("Failed to load current station", error);
    notifications.danger(errorMsgHelper(error));
  } finally {
    setIsLoading(false);
  }
}

export async function playStation(
  station: StationDTO,
  notifications: NotificationsState,
) {
  try {
    await api.stations.playStation(station.id);
  } catch (error) {
    console.error("Error during playing station", error);
    notifications.danger(errorMsgHelper(error));
  }
}
