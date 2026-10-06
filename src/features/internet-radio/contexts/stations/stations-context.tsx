import { createContext } from "preact";
import type { ComponentChildren } from "preact";
import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from "preact/hooks";
import type { StationDTO } from "../../models/station-dto";
import type { CurrentStationDTO } from "../../models/current-station-dto";
import { useRadio } from "../radio-context";
import { initialState, NO_STATIONS, UNKNOWN_STATION } from "./stations-state";
import { stationsReducer } from "./stations-reducer";
import {
  loadStations,
  loadCurrentStation,
  playStation as playStationApi,
} from "./stations-actions";
import { useNotifications } from "../../../../contexts/notification/notification-context";
import { errorMsgHelper } from "../../../../core/error-msg-helper";
import { useProgress } from "../../../../contexts/progress/progress-context";
import { api } from "../../api/api";

type StationsContextValue = {
  playerButtonDisabled: boolean;
  getStations: (
    size: number,
    page: number,
  ) => { data: StationDTO[]; count: number };
  current: CurrentStationDTO;
  currentName: string;
  playStation(station: StationDTO): void;
  playCurrentStation(): void;
  playNext(): void;
  canPlayNext: boolean;
  playPrev(): void;
  canPlayPrev: boolean;
};

const defaultValue: StationsContextValue = {
  playerButtonDisabled: true,
  getStations: () => ({ data: [], count: 0 }),
  current: null,
  currentName: NO_STATIONS,
  playStation: () => {},
  playCurrentStation: () => {},
  playNext: () => {},
  canPlayNext: false,
  playPrev: () => {},
  canPlayPrev: false,
};

export const StationsContext =
  createContext<StationsContextValue>(defaultValue);

export function StationsProvider({
  children,
}: {
  children: ComponentChildren;
}) {
  const notifications = useNotifications();
  const progress = useProgress();

  const [state, dispatch] = useReducer(stationsReducer, initialState);
  const { stations, current } = state;
  const { setActiveTab, setAsReady } = useRadio();

  useEffect(() => {
    loadStations(dispatch, notifications, progress);
    loadCurrentStation(dispatch, setActiveTab, setAsReady, notifications);
    const unsubscribeCurrentChange = api.stations.listenForCurrentStationChange(
      (current) => {
        dispatch({
          type: "currentChanged",
          payload: current,
        });
      },
    );

    const unsubscribeStationsChange = api.stations.listenForStationsChange(() =>
      loadStations(dispatch, notifications, progress),
    );

    return () => {
      unsubscribeCurrentChange();
      unsubscribeStationsChange();
    };
  }, []);

  const playStation = useCallback(async (station: StationDTO) => {
    try {
      await playStationApi(station, notifications);
    } catch (error) {
      console.error("Failed to play station", error);
    }
  }, []);

  const playCurrentStation = useCallback(async () => {
    try {
      const { station } = current;
      if (station !== null && station.id !== null) {
        await playStationApi(station, notifications);
      }
    } catch (error) {
      console.error("Failed to play current station", error);
    }
  }, [current]);

  const playNext = useCallback(async () => {
    if (!current.hasNext || !current.station?.id) return;

    try {
      await api.stations.playNext(current.station.id);
    } catch (error) {
      console.error("Failed to play next station", error);
      notifications.danger(errorMsgHelper(error));
    }
  }, [current]);

  const playPrev = useCallback(async () => {
    if (!current.hasPrev || !current.station?.id) return;

    try {
      await api.stations.playPrev(current.station.id);
    } catch (error) {
      console.error("Failed to play previous station", error);
      notifications.danger(errorMsgHelper(error));
    }
  }, [current]);

  const value = useMemo<StationsContextValue>(
    () => ({
      playerButtonDisabled: current.station === null,
      getStations: (size: number, page: number) => {
        const start = page * size;
        return {
          data: stations.slice(start, start + size),
          count: stations.length,
        };
      },
      current: current.station,
      currentName:
        current.station === null
          ? NO_STATIONS
          : current.station.id
            ? current.station.name
            : UNKNOWN_STATION,
      playStation,
      playCurrentStation,
      canPlayNext: current.hasNext,
      playNext,
      canPlayPrev: current.hasPrev,
      playPrev,
    }),
    [current, stations, playStation, playCurrentStation, playNext, playPrev],
  );

  return (
    <StationsContext.Provider value={value}>
      {children}
    </StationsContext.Provider>
  );
}

export function useStations() {
  return useContext(StationsContext);
}
