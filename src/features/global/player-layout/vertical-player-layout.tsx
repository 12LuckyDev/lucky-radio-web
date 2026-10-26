import type { ComponentChildren } from "preact";
import { VolumeControl } from "../../volume";

import "./vertical-player-layout.css";

export function VerticalPlayerLayout({
  imageUrl,
  currentInfoChildren,
  playerControlsChildren,
}: {
  currentInfoChildren: ComponentChildren;
  playerControlsChildren: ComponentChildren;
  imageUrl: string | null;
}) {
  return (
    <div class="vertical-player-content">
      <div class="contener side"></div>

      <div class="contener center">
        {imageUrl && (
          <div class="player-img-wrapper">
            <img class="player-img" src={imageUrl} />
          </div>
        )}
        {currentInfoChildren}
        {playerControlsChildren}
      </div>

      <div class="contener side">
        <VolumeControl vertical />
      </div>
    </div>
  );
}
