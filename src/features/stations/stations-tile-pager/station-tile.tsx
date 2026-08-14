import clsx from "clsx";
import { useStations } from "../../../contexts/stations/stations-context";
import type { StationDTO } from "../../../models/station-dto";
import "./station-tile.css";
import { useRef } from "preact/hooks";

const smallTileBreakpoint = 150;
const mediumPlayButtonBreakpoint = 200;

export function StationTile({
  station,
  size,
  onEdit,
  onDelete,
  onAction,
}: {
  station: StationDTO;
  size: number;
  onEdit: (station: StationDTO) => void;
  onDelete: (station: StationDTO) => void;
  onAction: (station: StationDTO) => void;
}) {
  const { current, playStation } = useStations();

  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wasHeld = useRef(false);

  const handlePointerDown = (e: PointerEvent, onlyPointer: boolean = true) => {
    wasHeld.current = false;

    if (onlyPointer && e.pointerType !== "touch") return;

    timer.current = setTimeout(() => {
      wasHeld.current = true;
      onAction(station);
    }, 500);
  };

  const handlePointerUp = () => {
    if (timer.current !== null) {
      clearTimeout(timer.current);
      timer.current = null;
    }
  };

  const handlePointerCancel = () => {
    if (timer.current !== null) {
      clearTimeout(timer.current);
      timer.current = null;
    }
  };

  const handleSmallClick = () => {
    if (wasHeld.current) {
      wasHeld.current = false;
      return;
    }

    playStation(station);
  };

  const isSelected = station.id === current?.id;

  if (size < smallTileBreakpoint) {
    return (
      <button
        class={clsx("button small-tile-button", isSelected && "is-primary")}
        disabled={isSelected}
        onClick={handleSmallClick}
        onPointerDown={(e) => handlePointerDown(e, false)}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerCancel}
      >
        {station.name}
      </button>
    );
  }

  return (
    <div
      class="box station-box"
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerCancel}
    >
      <h1 class="title is-6">{station.name}</h1>

      <button
        class={clsx(
          "button",
          "is-rounded",
          "aspect-ratio",
          "is-primary",
          size > mediumPlayButtonBreakpoint && "is-medium",
        )}
        onClick={() => playStation(station)}
        disabled={isSelected}
      >
        <span class="icon">
          <i class="fas fa-lg fa-play"></i>
        </span>
      </button>

      <div class="buttons actions">
        <button class="button" onClick={() => onEdit(station)}>
          <span class="icon">
            <i class="fas fa-pen"></i>
          </span>
        </button>
        <button
          class="button is-danger is-outlined"
          onClick={() => onDelete(station)}
        >
          <span class="icon">
            <i class="fas fa-trash"></i>
          </span>
        </button>
      </div>
    </div>
  );
}
