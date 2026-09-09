import clsx from "clsx";

import "./station-tile.css";
import { useState } from "preact/hooks";

export function AddStationTile({ onClick }: { onClick: () => void }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      class="box station-box add"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
    >
      <span class={clsx("icon is-large", hovered && "has-text-primary")}>
        <i class="fas fa-2x fa-add"></i>
      </span>
    </div>
  );
}
