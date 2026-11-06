import { usePlayer } from "../contexts/player-context";
import clsx from "clsx";
import { useStations } from "../contexts/stations/stations-context";
import { errorMsgHelper } from "../../../core/error-msg-helper";
import { useNotifications } from "../../../contexts/notification/notification-context";
import { api } from "../api/api";
import { usePlayerSizes } from "../../global/contexts/player-sizes-context";

export function PlayerButton({ large }: { large?: boolean }) {
  const notifications = useNotifications();
  const { playerButtonsSize, playerButtonIconsSize } = usePlayerSizes();

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

  const classes = large
    ? [playerButtonsSize, "is-responsive", "is-rounded", "aspect-ratio"]
    : [];

  return (
    <button
      class={clsx("button", classes, isPlaying ? "is-danger" : "is-primary")}
      disabled={playerButtonDisabled}
      onClick={onPlayStopClick}
    >
      <span class="icon">
        <i
          class={clsx(
            "fas",
            isPlaying ? "fa-stop" : "fa-play",
            large && playerButtonIconsSize,
          )}
        ></i>
      </span>
    </button>
  );
}
