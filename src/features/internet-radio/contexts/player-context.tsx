import { createContext } from "preact";
import type { ComponentChildren } from "preact";
import { useContext, useEffect, useState } from "preact/hooks";
import { api } from "../api/api";
import { useNotifications } from "../../../contexts/notification/notification-context";
import { errorMsgHelper } from "../../../core/error-msg-helper";
import { useOnVisibilityChange } from "../../../hooks/use-on-visibility-change";
import type { PlayerStateDTO } from "../../../dto/player-state-dto";

type PlayerState = {
  isPlaying: boolean;
};

const initialState: PlayerState = {
  isPlaying: false,
};

export const PlayerContext = createContext<PlayerState>(initialState);

export function PlayerProvider({ children }: { children: ComponentChildren }) {
  const notifications = useNotifications();

  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  async function fetchState(): Promise<void> {
    try {
      const { state }: PlayerStateDTO = await api.iRadio.getState();
      setIsPlaying(state === "play");
    } catch (error) {
      console.error("Failed to get player state", error);
      notifications.danger(errorMsgHelper(error));
    }
  }

  useEffect(() => {
    fetchState();
    api.iRadio.listenForPlayerStateChange(({ state }) => {
      setIsPlaying(state === "play");
    });
  }, []);

  useOnVisibilityChange(fetchState);

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
