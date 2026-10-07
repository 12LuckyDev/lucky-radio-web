import { createContext } from "preact";
import type { ComponentChildren } from "preact";
import { useContext, useEffect, useState } from "preact/hooks";
import { api } from "../api/api";
import { useNotifications } from "../../../contexts/notification/notification-context";
import { errorMsgHelper } from "../../../core/error-msg-helper";
import { useOnVisibilityChange } from "../../../hooks/use-on-visibility-change";

type VolumeState = {
  volume: number;
};

const initialState: VolumeState = {
  volume: 0,
};

export const VolumeContext = createContext<VolumeState>(initialState);

export function VolumeProvider({ children }: { children: ComponentChildren }) {
  const notifications = useNotifications();

  const [volume, setVolume] = useState<number>(0);

  async function fetchVolume(): Promise<void> {
    try {
      const { volume } = await api.volume.getVolume();
      setVolume(volume);
    } catch (error) {
      console.error("Failed to get player status", error);
      notifications.danger(errorMsgHelper(error));
    }
  }

  useEffect(() => {
    fetchVolume();
    return api.volume.listenForVolumeChange((volume) => {
      if (typeof volume === "number") {
        setVolume(volume);
      } else {
        notifications.danger(errorMsgHelper("Error during volume change"));
      }
    });
  }, []);

  useOnVisibilityChange(fetchVolume);

  return (
    <VolumeContext.Provider value={{ volume }}>
      {children}
    </VolumeContext.Provider>
  );
}

export function useVolume(): VolumeState {
  const context = useContext(VolumeContext);
  return context;
}
