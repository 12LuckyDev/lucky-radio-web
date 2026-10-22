import { createContext } from "preact";
import type { ComponentChildren } from "preact";
import { useContext } from "preact/hooks";
import { api } from "../api/api";
import { useOnVisibilityChange } from "../../../hooks/use-on-visibility-change";
import type { PlayerStateDTO } from "../../../dto/player-state-dto";
import type { CurrentSongInfoDTO } from "../models";
import {
  useSyncedState,
  type SyncedStateConfig,
} from "../../../hooks/use-synced-state";
import type { DeviceInfoDTO } from "../models/device-info.dto";

type SpotifyState = {
  isPlaying: boolean;
  current: CurrentSongInfoDTO;
  device: DeviceInfoDTO;
};

const initialState: SpotifyState = {
  isPlaying: false,
  current: { song: null },
  device: {
    name: null,
    type: null,
    username: null,
  },
};

const isPlayingConfig: SyncedStateConfig<boolean> = {
  initialValue: initialState.isPlaying,
  fetchData: async () => {
    const { state }: PlayerStateDTO = await api.spotify.getState();
    return state === "play";
  },
  subscribe: (callback: (value: boolean) => void) =>
    api.spotify.listenForPlayerStateChange(({ state }) =>
      callback(state === "play"),
    ),
  errorMsg: "Failed to get spotify state",
};

const currentConfig = {
  initialValue: initialState.current,
  fetchData: () => api.spotify.getCurrent(),
  subscribe: api.spotify.listenForCurrentChange,
  errorMsg: "Failed to get spotify current song",
};

const deviceInfoConfig = {
  initialValue: initialState.device,
  fetchData: () => api.spotify.getDeviceInfo(),
  subscribe: api.spotify.listenForDeviceInfoChange,
  errorMsg: "Failed to get spotify device info",
};

export const SpotifyContext = createContext<SpotifyState>(initialState);

export function SpotifyProvider({ children }: { children: ComponentChildren }) {
  const [isPlaying, refreshState] = useSyncedState(isPlayingConfig);
  const [current, refreshCurrent] = useSyncedState(currentConfig);
  const [device, refreshDevice] = useSyncedState(deviceInfoConfig);

  useOnVisibilityChange(async () => {
    await refreshState();
    await refreshCurrent();
    await refreshDevice();
  });

  return (
    <SpotifyContext.Provider value={{ isPlaying, current, device }}>
      {children}
    </SpotifyContext.Provider>
  );
}

export function useSpotify(): SpotifyState {
  return useContext(SpotifyContext);
}
