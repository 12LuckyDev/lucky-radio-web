import type { ComponentChildren } from "preact";

import { VerticalPlayerLayout } from "./vertical-player-layout";
import { HorizontalPlayerLayout } from "./horizontal-player-layout";
import { useUi } from "../../../contexts/ui/ui-context";

const FALLBACK_IMG = "/no-cover.png";

export function PlayerLayout({
  imageUrl = null,
  currentInfoChildren,
  playerControlsChildren,
  orientation,
  useFallbackImage = false,
}: {
  currentInfoChildren: ComponentChildren;
  playerControlsChildren: ComponentChildren;
  imageUrl?: string | null;
  orientation?: "vertical" | "horizontal";
  useFallbackImage?: boolean;
}) {
  const { orientation: uiOrientation } = useUi();
  const layoutOrientation = orientation ?? uiOrientation;

  if (
    layoutOrientation === "vertical" ||
    (!useFallbackImage && imageUrl === null)
  ) {
    return (
      <VerticalPlayerLayout
        currentInfoChildren={currentInfoChildren}
        playerControlsChildren={playerControlsChildren}
        imageUrl={imageUrl ?? (useFallbackImage ? FALLBACK_IMG : null)}
      />
    );
  }
  return (
    <HorizontalPlayerLayout
      currentInfoChildren={currentInfoChildren}
      playerControlsChildren={playerControlsChildren}
      imageUrl={imageUrl ?? FALLBACK_IMG}
    />
  );
}
