import clsx from "clsx";
import { useSpotify } from "./contexts/spotify-context";
import { api } from "./api/api";
import { errorMsgHelper } from "../../core/error-msg-helper";
import { useNotifications } from "../../contexts/notification/notification-context";

import "./spotify-player-buttons.css";

export function SpotifyPlayerButtons() {
  const notifications = useNotifications();

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

  return (
    <div class="spotify-buttons-wrapper">
      <button
        class="button is-large is-rounded aspect-ratio"
        disabled={disabled}
        onClick={onPrevClick}
      >
        <span class="icon">
          <i class="fas fa-lg fa-backward"></i>
        </span>
      </button>

      <button
        class={clsx(
          "button",
          "is-large",
          "is-rounded",
          "aspect-ratio",
          isPlaying ? "is-danger" : "is-primary",
        )}
        disabled={disabled}
        onClick={onPlayPauseClick}
      >
        <span class="icon">
          <i
            class={clsx("fas", "fa-lg", isPlaying ? "fa-pause" : "fa-play")}
          ></i>
        </span>
      </button>

      <button
        class="button is-large is-rounded aspect-ratio"
        disabled={disabled}
        onClick={onNextClick}
      >
        <span class="icon">
          <i class="fas fa-lg fa-forward"></i>
        </span>
      </button>
    </div>
  );
}
