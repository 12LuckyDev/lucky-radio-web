import { PlayerLayout } from "../../global/player-layout/player-layout";
import { useStations } from "../contexts/stations/stations-context";
import { PlayerButton } from "./player-button";

export function Player() {
  const { currentName } = useStations();

  return (
    <PlayerLayout
      currentInfoChildren={<p class="title is-3">{currentName}</p>}
      playerControlsChildren={<PlayerButton large />}
    />
  );
}
