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
import { api } from "../../api-client/api";
import { useRadio } from "../radio-context";
import { initialState, NO_STATIONS, UNKNOWN_STATION } from "./stations-state";
import { stationsReducer } from "./stations-reducer";
import {
  loadStations,
  loadCurrentStation,
  playStation as playStationApi,
} from "./stations-actions";
import { useNotifications } from "../notification/notification-context";
import { errorMsgHelper } from "../../core/error-msg-helper";
import { useProgress } from "../progress/progress-context";

type StationsContextValue = {
  playerButtonDisabled: boolean;
  getStations: (
    size: number,
    page: number,
  ) => { data: StationDTO[]; count: number };
  current: CurrentStationDTO;
  currentName: string;
  playStation(station: StationDTO): void;
  playSelectedStation(): void;
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
  playSelectedStation: () => {},
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
  const { stations, current, selected } = state;
  const { setActiveTab, setIsLoading } = useRadio();

  useEffect(() => {
    loadStations(dispatch, notifications, progress);
    loadCurrentStation(dispatch, setActiveTab, setIsLoading, notifications);
    const unsubscribeCurrentChange = api.sse.listenForCurrentStationChange(
      (current) => {
        dispatch({
          type: "currentChanged",
          payload: current,
        });
      },
    );

    const unsubscribeStationsChange = api.sse.listenForStationsChange(() =>
      loadStations(dispatch, notifications, progress),
    );

    return () => {
      unsubscribeCurrentChange();
      unsubscribeStationsChange();
    };
  }, []);

  const playStation = useCallback(
    async (station: StationDTO) => {
      if (current.station?.id === station.id) return;

      try {
        await playStationApi(station, notifications);

        dispatch({
          type: "stationSelected",
          payload: station,
        });
      } catch (error) {
        console.error("Failed to play station", error);
      }
    },
    [current],
  );

  const playSelectedStation = useCallback(async () => {
    if (!selected || current.station?.id === selected.id) return;

    try {
      await playStationApi(selected, notifications);
    } catch (error) {
      console.error("Failed to play selected station", error);
    }
  }, [selected, current]);

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
      playerButtonDisabled: current.station === null && selected === null,
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
          ? selected === null
            ? NO_STATIONS
            : selected.name
          : current.station.id
            ? current.station.name
            : UNKNOWN_STATION,
      playStation,
      playSelectedStation,
      canPlayNext: current.hasNext,
      playNext,
      canPlayPrev: current.hasPrev,
      playPrev,
    }),
    [
      current,
      selected,
      stations,
      playStation,
      playSelectedStation,
      playNext,
      playPrev,
    ],
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
