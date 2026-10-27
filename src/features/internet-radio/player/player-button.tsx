import { usePlayer } from "../contexts/player-context";
import clsx from "clsx";
import { useStations } from "../contexts/stations/stations-context";
import { errorMsgHelper } from "../../../core/error-msg-helper";
import { useNotifications } from "../../../contexts/notification/notification-context";
import { api } from "../api/api";

export function PlayerButton({ large }: { large?: boolean }) {
  const notifications = useNotifications();
  const { isPlaying } = usePlayer();
  const { playerButtonDisabled, playCurrentStation } = useStations();

  const onPlayStopClick = async () => {
    if (isPlaying) {
      try {
        await api.iRadio.stopPlayer();
      } catch (error) {
        notifications.danger(errorMsgHelper(error));
      }
    } else {
      await playCurrentStation();
    }
  };

  const classes = large ? ["is-large", "is-rounded", "aspect-ratio"] : [];

  return (
    <button
      class={clsx("button", classes, isPlaying ? "is-danger" : "is-primary")}
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
