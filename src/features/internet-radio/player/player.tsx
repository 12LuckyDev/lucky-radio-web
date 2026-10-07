import { VolumeControl } from "../../volume";
import { useStations } from "../contexts/stations/stations-context";
import { PlayerButton } from "./player-button";

import "./player.css";

export function Player() {
  const { currentName } = useStations();

  return (
    <div class="player-wrapper">
      <div class="contener side"></div>

      <div class="contener center">
        <h1 class="title is-3">{currentName}</h1>
        <PlayerButton large />
      </div>

      <div class="contener side">
        <VolumeControl vertical />
      </div>
    </div>
  );
}
