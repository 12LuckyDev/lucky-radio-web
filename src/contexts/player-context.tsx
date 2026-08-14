import { createContext } from "preact";
import type { ComponentChildren } from "preact";
import { useContext, useEffect, useState } from "preact/hooks";
import type { PlayerStatusDTO } from "../models/player-status-dto";
import { api } from "../api-client/api";
import { useNotifications } from "./notification/notification-context";
import { errorMsgHelper } from "../core/error-msg-helper";

type PlayerState = {
  isConnected: boolean;
  isPlaying: boolean;
  volume: number;
};

const initialState: PlayerState = {
  isConnected: false,
  isPlaying: false,
  volume: 0,
};

export const PlayerContext = createContext<PlayerState>(initialState);

export function PlayerProvider({ children }: { children: ComponentChildren }) {
  const notifications = useNotifications();

  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(0);

  async function getStatus(): Promise<void> {
    try {
      const { connected, status }: PlayerStatusDTO =
        await api.player.getStatus();
      setIsConnected(connected);
      setIsPlaying(status?.state === "play");
      setVolume(status?.volume ?? 0);
    } catch (error) {
      console.error("Failed to get player status", error);
      notifications.danger(errorMsgHelper(error));
    }
  }

  useEffect(() => {
    getStatus();
    api.sse.listenForPlayerStatusChange(({ connected, state, volume }) => {
      setIsConnected(connected);
      setIsPlaying(state === "play");
      setVolume(volume);
    });
  }, []);

  return (
    <PlayerContext.Provider value={{ isConnected, isPlaying, volume }}>
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayer(): PlayerState {
  const context = useContext(PlayerContext);
  return context;
}
