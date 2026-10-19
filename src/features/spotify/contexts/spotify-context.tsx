import { createContext } from "preact";
import type { ComponentChildren } from "preact";
import { useContext } from "preact/hooks";
import { api } from "../api/api";
import { useOnVisibilityChange } from "../../../hooks/use-on-visibility-change";
import type { PlayerStateDTO } from "../../../dto/player-state-dto";
import type { CurrentSongInfoDTO } from "../models";
import { useSyncedState } from "../../../hooks/use-synced-state";

type SpotifyState = {
  isPlaying: boolean;
  current: CurrentSongInfoDTO;
};

const initialState: SpotifyState = {
  isPlaying: false,
  current: { song: null },
};

const isPlayingConfig = {
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

export const SpotifyContext = createContext<SpotifyState>(initialState);

export function SpotifyProvider({ children }: { children: ComponentChildren }) {
  const [isPlaying, refreshState] = useSyncedState(isPlayingConfig);
  const [current, refreshCurrent] = useSyncedState(currentConfig);

  useOnVisibilityChange(async () => {
    await refreshState();
    await refreshCurrent();
  });

  return (
    <SpotifyContext.Provider value={{ isPlaying, current }}>
      {children}
    </SpotifyContext.Provider>
  );
}

export function useSpotify(): SpotifyState {
  return useContext(SpotifyContext);
}
