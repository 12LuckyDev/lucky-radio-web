import { usePlayer } from "../../contexts/player-context";
import clsx from "clsx";
import { useStations } from "../../contexts/stations/stations-context";
import { api } from "../../api-client/api";
import { errorMsgHelper } from "../../core/error-msg-helper";
import { useNotifications } from "../../contexts/notification/notification-context";

export function PlayerButton({ large }: { large?: boolean }) {
  const notifications = useNotifications();
  const { isConnected, isPlaying } = usePlayer();
  const { playerButtonDisabled, playSelectedStation } = useStations();

  const onPlayStopClick = async () => {
    if (isPlaying) {
      try {
        await api.player.stopPlayer();
      } catch (error) {
        notifications.danger(errorMsgHelper(error));
      }
    } else {
      await playSelectedStation();
    }
  };

  const classes = large ? ["is-large", "is-rounded", "aspect-ratio"] : [];

  return (
    <button
      class={clsx("button", classes, {
        "is-loading": !isConnected,
        "is-primary": isConnected && !isPlaying,
        "is-danger": !isConnected || isPlaying,
      })}
      disabled={playerButtonDisabled}
      onClick={onPlayStopClick}
    >
      <span class="icon">
        <i
          class={clsx("fas", isPlaying ? "fa-stop" : "fa-play", {
            "fa-lg": large,
          })}
        ></i>
      </span>
    </button>
  );
}
