import { useEffect, useRef, useState } from "preact/hooks";
import clsx from "clsx";
import "./volume.css";
import { usePlayer } from "../../../contexts/player-context";
import { api } from "../../../api-client/api";
import { useNotifications } from "../../../contexts/notification/notification-context";
import { errorMsgHelper } from "../../../core/error-msg-helper";

function getVolumeIconClass(volume: number) {
  if (volume >= 90) return "fa-volume-high";
  if (volume >= 50) return "fa-volume";
  return "fa-volume-low";
}

export function Volume({ vertical = false }: { vertical?: boolean }) {
  const notifications = useNotifications();
  const { volume } = usePlayer();
  const [localVolume, setLocalVolume] = useState<number>(volume);
  const [mute, setMute] = useState<boolean>(volume === 0);
  const beforeMutedVolume = useRef<number | null>(null);
  const [hovered, setHovered] = useState<number | null>(null);

  useEffect(() => {
    setLocalVolume(volume);
    setMute(volume === 0);
  }, [volume]);

  const sendNewVolume = async (curr: number, prev: number) => {
    try {
      await api.player.setVolume(curr);
    } catch (error) {
      console.error("Error during changing volume", error);
      notifications.danger(errorMsgHelper(error));

      setLocalVolume(prev);
    }
  };

  const handleVolumeClick = (curr: number) => {
    const prev = localVolume;
    setLocalVolume(curr);
    sendNewVolume(curr, prev);
  };

  const handleMute = () => {
    const state = !mute;
    setMute(state);
    if (state) {
      const prev = localVolume;
      beforeMutedVolume.current = localVolume;
      setLocalVolume(0);
      sendNewVolume(0, prev);
    } else {
      const curr = beforeMutedVolume.current ?? 100;
      setLocalVolume(beforeMutedVolume.current ?? 100);
      beforeMutedVolume.current = null;
      sendNewVolume(curr, 0);
    }
  };

  return (
    <div
      class={clsx("volume-control", vertical && "vertical")}
      role="group"
      aria-label="Volume control"
    >
      <button class="button" onClick={handleMute}>
        <span class="icon is-small">
          <i
            class={clsx(
              "fas",
              mute ? "fa-volume-xmark" : getVolumeIconClass(localVolume),
            )}
          ></i>
        </span>
      </button>

      <div
        class={clsx("volume-bars-wrapper", vertical && "vertical")}
        onMouseLeave={() => setHovered(null)}
        onBlur={() => setHovered(null)}
      >
        {Array.from({ length: 10 }, (_, index) => {
          const level = (index + 1) * 10;
          const active = level <= (hovered !== null ? hovered : localVolume);
          return (
            <button
              key={level}
              class={clsx("button", "volume-step", {
                "is-primary is-active": active,
              })}
              aria-label={`Głośność ${level}%`}
              onMouseEnter={() => setHovered(level)}
              onTouchStart={() => setHovered(level)}
              onFocus={() => setHovered(level)}
              onClick={() => handleVolumeClick(level)}
            />
          );
        })}
      </div>
    </div>
  );
}
