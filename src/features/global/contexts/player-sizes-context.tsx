import { createContext } from "preact";
import type { ComponentChildren } from "preact";
import { useContext, useEffect, useState } from "preact/hooks";
import { useUi } from "../../../contexts/ui/ui-context";

type PlayerSizesState = {
  playerButtonsSize: "is-small" | "is-normal" | "is-medium" | "is-large";
  playerButtonIconsSize: "fa-1x" | "fa-lg";
};

const initialState: PlayerSizesState = {
  playerButtonsSize: "is-large",
  playerButtonIconsSize: "fa-lg",
};

export const PlayerSizesContext = createContext<PlayerSizesState>(initialState);

export function PlayerSizesProvider({
  children,
}: {
  children: ComponentChildren;
}) {
  const { height } = useUi();
  const [playerButtonsSize, setPlayerButtonsSize] = useState(
    initialState.playerButtonsSize,
  );
  const [playerButtonIconsSize, setPlayerButtonIconsSize] = useState(
    initialState.playerButtonIconsSize,
  );

  useEffect(() => {
    switch (height) {
      case "xs":
        setPlayerButtonsSize("is-small");
        setPlayerButtonIconsSize("fa-1x");
        break;
      case "sm":
        setPlayerButtonsSize("is-normal");
        setPlayerButtonIconsSize("fa-1x");
        break;
      default:
        setPlayerButtonsSize("is-large");
        setPlayerButtonIconsSize("fa-lg");
        break;
    }
  }, [height]);

  return (
    <PlayerSizesContext.Provider
      value={{ playerButtonsSize, playerButtonIconsSize }}
    >
      {children}
    </PlayerSizesContext.Provider>
  );
}

export function usePlayerSizes(): PlayerSizesState {
  const context = useContext(PlayerSizesContext);
  return context;
}
