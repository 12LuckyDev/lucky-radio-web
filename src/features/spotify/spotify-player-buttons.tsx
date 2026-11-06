import clsx from "clsx";
import { useSpotify } from "./contexts/spotify-context";
import { api } from "./api/api";
import { errorMsgHelper } from "../../core/error-msg-helper";
import { useNotifications } from "../../contexts/notification/notification-context";

import "./spotify-player-buttons.css";
import { usePlayerSizes } from "../global/contexts/player-sizes-context";

export function SpotifyPlayerButtons() {
  const notifications = useNotifications();
  const { playerButtonsSize, playerButtonIconsSize } = usePlayerSizes();

  const {
    isPlaying,
    current: { song },
  } = useSpotify();

  const disabled = song === null;

  const onPlayPauseClick = async () => {
    try {
      if (isPlaying) {
        await api.spotify.pause();
      } else {
        await api.spotify.resume();
      }
    } catch (error) {
      console.error("Error during resume/pause song", error);
      notifications.danger(errorMsgHelper(error));
    }
  };

  const onNextClick = async () => {
    try {
      await api.spotify.next();
    } catch (error) {
      console.error("Error during playing next song", error);
      notifications.danger(errorMsgHelper(error));
    }
  };

  const onPrevClick = async () => {
    try {
      await api.spotify.next();
    } catch (error) {
      console.error("Error during playing prev song", error);
      notifications.danger(errorMsgHelper(error));
    }
  };

  const buttonClasses = [
    "button",
    playerButtonsSize,
    "is-responsive",
    "is-rounded",
    "aspect-ratio",
  ];
  const iconClasses = ["fas", playerButtonIconsSize];

  return (
    <div class="spotify-buttons-wrapper">
      <button
        class={clsx(buttonClasses)}
        disabled={disabled}
        onClick={onPrevClick}
      >
        <span class="icon">
          <i class={clsx(iconClasses, "fa-backward")}></i>
        </span>
      </button>

      <button
        class={clsx(buttonClasses, isPlaying ? "is-danger" : "is-primary")}
        disabled={disabled}
        onClick={onPlayPauseClick}
      >
        <span class="icon">
          <i class={clsx(iconClasses, isPlaying ? "fa-pause" : "fa-play")}></i>
        </span>
      </button>

      <button
        class={clsx(buttonClasses)}
        disabled={disabled}
        onClick={onNextClick}
      >
        <span class="icon">
          <i class={clsx(iconClasses, "fa-forward")}></i>
        </span>
      </button>
    </div>
  );
}
