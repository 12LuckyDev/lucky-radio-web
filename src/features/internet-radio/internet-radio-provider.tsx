import type { ComponentChildren } from "preact";
import { PlayerProvider } from "./contexts/player-context";
import { RadioProvider } from "./contexts/radio-context";
import { StationsProvider } from "./contexts/stations/stations-context";

export function InternetRadioProvider({
  children,
}: {
  children: ComponentChildren;
}) {
  return (
    <RadioProvider>
      <StationsProvider>
        <PlayerProvider>{children}</PlayerProvider>
      </StationsProvider>
    </RadioProvider>
  );
}
