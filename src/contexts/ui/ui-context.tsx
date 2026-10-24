import { createContext, type ComponentChildren } from "preact";
import { useContext, useEffect, useState } from "preact/hooks";

import { BREAKPOINTS, type BreakpointSize } from "./breakpoints";
import { resolveSize } from "./resolve-size";

export type Orientation = "vertical" | "horizontal";

const BREAKPOINT_ORDER: BreakpointSize[] = ["xs", "sm", "md", "lg", "xl"];

type UiState = {
  size: BreakpointSize;
  orientation: Orientation;
  isBiggerThan: (breakpoint: BreakpointSize) => boolean;
  isSmallerThan: (breakpoint: BreakpointSize) => boolean;
};

const initialState: UiState = {
  size: "xl",
  orientation: "horizontal",
  isBiggerThan: () => false,
  isSmallerThan: () => false,
};

const UiContext = createContext<UiState>(initialState);

interface UiProviderProps {
  children: ComponentChildren;
}

export function UiProvider({ children }: UiProviderProps) {
  const [size, setSize] = useState<BreakpointSize>(initialState.size);
  const [orientation, setOrientation] = useState<Orientation>(
    initialState.orientation,
  );

  useEffect(() => {
    const mediaQueries = Object.values(BREAKPOINTS).map((query) =>
      window.matchMedia(query),
    );

    const orientationQuery = window.matchMedia("(orientation: portrait)");

    const update = () => {
      const state = Object.fromEntries(
        mediaQueries.map((query) => [query.media, query.matches]),
      );

      setSize(resolveSize(state));
      setOrientation(orientationQuery.matches ? "vertical" : "horizontal");
    };

    mediaQueries.forEach((query) => {
      query.addEventListener("change", update);
    });

    orientationQuery.addEventListener("change", update);

    update();

    return () => {
      mediaQueries.forEach((query) => {
        query.removeEventListener("change", update);
      });

      orientationQuery.removeEventListener("change", update);
    };
  }, []);

  const isBiggerThan = (breakpoint: BreakpointSize) =>
    BREAKPOINT_ORDER.indexOf(size) > BREAKPOINT_ORDER.indexOf(breakpoint);

  const isSmallerThan = (breakpoint: BreakpointSize) =>
    BREAKPOINT_ORDER.indexOf(size) < BREAKPOINT_ORDER.indexOf(breakpoint);

  return (
    <UiContext.Provider
      value={{
        size,
        orientation,
        isBiggerThan,
        isSmallerThan,
      }}
    >
      {children}
    </UiContext.Provider>
  );
}

export function useUi(): UiState {
  return useContext(UiContext);
}
