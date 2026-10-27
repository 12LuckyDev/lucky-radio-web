import clsx from "clsx";
import { useSpotify } from "./contexts/spotify-context";
import { api } from "./api/api";

export function SpotifyPlayerButton() {
  const {
    isPlaying,
    current: { song },
  } = useSpotify();

  const onPlayPauseClick = async () => {
    if (isPlaying) {
      await api.spotify.pause();
    } else {
      await api.spotify.resume();
    }
  };

  return (
    <button
      class={clsx(
        "button",
        "is-large",
        "is-rounded",
        "aspect-ratio",
        isPlaying ? "is-danger" : "is-primary",
      )}
      disabled={song === null}
      onClick={onPlayPauseClick}
    >
      <span class="icon">
        <i class={clsx("fas", "fa-lg", isPlaying ? "fa-pause" : "fa-play")}></i>
      </span>
    </button>
  );
}
