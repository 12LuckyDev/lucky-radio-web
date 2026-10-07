import { createContext } from "preact";
import type { ComponentChildren } from "preact";
import { useContext, useEffect, useState } from "preact/hooks";
import type { PlayerStatusDTO } from "../models/player-status-dto";
import { api } from "../api/api";
import { useNotifications } from "../../../contexts/notification/notification-context";
import { errorMsgHelper } from "../../../core/error-msg-helper";
import { useOnVisibilityChange } from "../../../hooks/use-on-visibility-change";

type PlayerState = {
  isConnected: boolean;
  isPlaying: boolean;
};

const initialState: PlayerState = {
  isConnected: false,
  isPlaying: false,
};

export const PlayerContext = createContext<PlayerState>(initialState);

export function PlayerProvider({ children }: { children: ComponentChildren }) {
  const notifications = useNotifications();

  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  async function fetchStatus(): Promise<void> {
    try {
      const { connected, status }: PlayerStatusDTO =
        await api.player.getStatus();
      setIsConnected(connected);
      setIsPlaying(status?.state === "play");
    } catch (error) {
      console.error("Failed to get player status", error);
      notifications.danger(errorMsgHelper(error));
    }
  }

  useEffect(() => {
    fetchStatus();
    api.player.listenForPlayerStatusChange(({ connected, status }) => {
      setIsConnected(connected);
      setIsPlaying(status?.state === "play");
    });
  }, []);

  useOnVisibilityChange(fetchStatus);

  return (
    <PlayerContext.Provider value={{ isConnected, isPlaying }}>
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayer(): PlayerState {
  const context = useContext(PlayerContext);
  return context;
}
