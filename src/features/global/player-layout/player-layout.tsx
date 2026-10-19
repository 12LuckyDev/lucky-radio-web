import type { ComponentChildren } from "preact";
import { VolumeControl } from "../../volume";

import "./player-layout.css";

export function PlayerLayout({
  currentInfoChildren,
  playerControlsChildren,
}: {
  currentInfoChildren: ComponentChildren;
  playerControlsChildren: ComponentChildren;
}) {
  return (
    <div class="player-col-wrapper">
      <div class="player-current">{currentInfoChildren}</div>
      <div class="player-content">
        <div class="contener side"></div>

        <div class="contener center">{playerControlsChildren}</div>

        <div class="contener side">
          <VolumeControl vertical />
        </div>
      </div>
    </div>
  );
}
