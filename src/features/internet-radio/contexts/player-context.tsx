import { createContext } from "preact";
import type { ComponentChildren } from "preact";
import { useContext } from "preact/hooks";
import { api } from "../api/api";
import { useOnVisibilityChange } from "../../../hooks/use-on-visibility-change";
import type { PlayerStateDTO } from "../../../dto/player-state-dto";
import { useSyncedState } from "../../../hooks/use-synced-state";

type PlayerState = {
  isPlaying: boolean;
};

const initialState: PlayerState = {
  isPlaying: false,
};

const isPlayingConfig = {
  initialValue: initialState.isPlaying,
  fetchData: async () => {
    const { state }: PlayerStateDTO = await api.iRadio.getState();
    return state === "play";
  },
  subscribe: (callback: (value: boolean) => void) =>
    api.iRadio.listenForPlayerStateChange(({ state }) =>
      callback(state === "play"),
    ),
  errorMsg: "Failed to get player state",
};

export const PlayerContext = createContext<PlayerState>(initialState);

export function PlayerProvider({ children }: { children: ComponentChildren }) {
  const [isPlaying, refreshState] = useSyncedState(isPlayingConfig);

  useOnVisibilityChange(refreshState);

  return (
    <PlayerContext.Provider value={{ isPlaying }}>
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayer(): PlayerState {
  const context = useContext(PlayerContext);
  return context;
}
