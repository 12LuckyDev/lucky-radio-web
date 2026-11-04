import { useCallback, useEffect, useRef, useState } from "preact/hooks";
import type { CSSProperties } from "preact";
import "./slider.css";

type SliderProps = {
  currentTime: number;
  duration: number;
  onSeek: (time: number) => void;
  disabled?: boolean;
};

export function Slider({
  currentTime,
  duration,
  onSeek,
  disabled = false,
}: SliderProps) {
  const max = Math.max(0, duration);

  const clamp = useCallback(
    (value: number) => Math.round(Math.min(max, Math.max(0, value))),
    [max],
  );

  const [draftTime, setDraftTime] = useState(() => clamp(currentTime));

  const [isInteracting, setIsInteracting] = useState(false);
  const [pendingSeek, setPendingSeek] = useState<number | null>(null);

  const draftRef = useRef(clamp(currentTime));
  const interactingRef = useRef(false);

  useEffect(() => {
    if (interactingRef.current) return;

    const next = clamp(currentTime);

    if (pendingSeek !== null && Math.abs(next - pendingSeek) < 1.5) {
      setPendingSeek(null);
    }

    if (pendingSeek === null) {
      draftRef.current = next;
      setDraftTime(next);
    }
  }, [currentTime, duration, clamp, pendingSeek]);

  const startInteraction = useCallback(() => {
    if (disabled || max <= 0 || interactingRef.current) return;

    interactingRef.current = true;
    setIsInteracting(true);

    const initial = clamp(currentTime);

    draftRef.current = initial;
    setDraftTime(initial);
  }, [disabled, max, currentTime, clamp]);

  const updateDraft = useCallback(
    (value: number) => {
      const next = clamp(value);

      draftRef.current = next;
      setDraftTime(next);
    },
    [clamp],
  );

  const finishInteraction = useCallback(() => {
    if (!interactingRef.current) return;

    interactingRef.current = false;
    setIsInteracting(false);

    const target = draftRef.current;

    setPendingSeek(target);
    onSeek(target);
  }, [onSeek]);

  const cancelInteraction = useCallback(() => {
    if (!interactingRef.current) return;

    interactingRef.current = false;
    setIsInteracting(false);

    const next = clamp(currentTime);

    draftRef.current = next;
    setDraftTime(next);
  }, [currentTime, clamp]);

  const value = clamp(isInteracting ? draftTime : (pendingSeek ?? currentTime));

  const progress = max > 0 ? (value / max) * 100 : 0;

  const seekKeys = [
    "ArrowLeft",
    "ArrowRight",
    "ArrowUp",
    "ArrowDown",
    "PageUp",
    "PageDown",
    "Home",
    "End",
  ];

  return (
    <div className="bulma-slider">
      <input
        type="range"
        min={0}
        max={max || 1}
        step={1}
        value={value}
        disabled={disabled || max <= 0}
        aria-label="position"
        style={
          {
            "--bulma-progress": `${progress}%`,
          } as CSSProperties
        }
        onPointerDown={startInteraction}
        onPointerUp={finishInteraction}
        onPointerCancel={cancelInteraction}
        onChange={(event) => {
          updateDraft(Number(event.currentTarget.value));
        }}
        onKeyDown={(event) => {
          if (seekKeys.includes(event.key)) {
            startInteraction();
          }
        }}
        onKeyUp={(event) => {
          if (seekKeys.includes(event.key)) {
            finishInteraction();
          }
        }}
        onBlur={finishInteraction}
      />
    </div>
  );
}
