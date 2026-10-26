import type { ComponentChildren } from "preact";
import { VolumeControl } from "../../volume";

import "./horizontal-player-layout.css";

export function HorizontalPlayerLayout({
  imageUrl,
  currentInfoChildren,
  playerControlsChildren,
}: {
  currentInfoChildren: ComponentChildren;
  playerControlsChildren: ComponentChildren;
  imageUrl: string;
}) {
  return (
    <div class="horizontal-player-content">
      {imageUrl && (
        <div class="player-img-wrapper">
          <img class="player-img" src={imageUrl} />
        </div>
      )}
      <div class="contener center">
        {currentInfoChildren}
        {playerControlsChildren}
      </div>

      <div class="contener side">
        <VolumeControl vertical />
      </div>
    </div>
  );
}
