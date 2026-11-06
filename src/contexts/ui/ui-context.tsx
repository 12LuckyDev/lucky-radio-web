import { createContext, type ComponentChildren } from "preact";
import { useContext, useEffect, useState } from "preact/hooks";

import { BREAKPOINTS, type BreakpointSize } from "./breakpoints";
import { resolveSize } from "./resolve-size";
import {
  HEIGHT_BREAKPOINTS,
  type BreakpointHeight,
} from "./height-breakpoints";
import { resolveHeight } from "./resolve-height";

export type Orientation = "vertical" | "horizontal";

const BREAKPOINT_ORDER: BreakpointSize[] = ["xs", "sm", "md", "lg", "xl"];

type UiState = {
  size: BreakpointSize;
  height: BreakpointHeight;
  orientation: Orientation;
  isBiggerThan: (breakpoint: BreakpointSize) => boolean;
  isSmallerThan: (breakpoint: BreakpointSize) => boolean;
  isTallerThan: (breakpoint: BreakpointSize) => boolean;
  isLowerThan: (breakpoint: BreakpointSize) => boolean;
};

const initialState: UiState = {
  size: "xl",
  height: "lg",
  orientation: "horizontal",
  isBiggerThan: () => false,
  isSmallerThan: () => false,
  isTallerThan: () => false,
  isLowerThan: () => false,
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
  const [height, setHeight] = useState<BreakpointSize>(initialState.size);

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

  useEffect(() => {
    const mediaQueries = Object.values(HEIGHT_BREAKPOINTS).map((query) =>
      window.matchMedia(query),
    );

    const updateHeight = () => {
      const state = Object.fromEntries(
        mediaQueries.map((query) => [query.media, query.matches]),
      );
      setHeight(resolveHeight(state));
    };

    mediaQueries.forEach((query) => {
      query.addEventListener("change", updateHeight);
    });

    updateHeight();

    return () => {
      mediaQueries.forEach((query) => {
        query.removeEventListener("change", updateHeight);
      });
    };
  }, []);

  const isBiggerThan = (breakpoint: BreakpointSize) =>
    BREAKPOINT_ORDER.indexOf(size) > BREAKPOINT_ORDER.indexOf(breakpoint);

  const isSmallerThan = (breakpoint: BreakpointSize) =>
    BREAKPOINT_ORDER.indexOf(size) < BREAKPOINT_ORDER.indexOf(breakpoint);

  const isTallerThan = (breakpoint: BreakpointSize) =>
    BREAKPOINT_ORDER.indexOf(height) > BREAKPOINT_ORDER.indexOf(breakpoint);

  const isLowerThan = (breakpoint: BreakpointSize) =>
    BREAKPOINT_ORDER.indexOf(height) < BREAKPOINT_ORDER.indexOf(breakpoint);

  return (
    <UiContext.Provider
      value={{
        size,
        height,
        orientation,
        isBiggerThan,
        isSmallerThan,
        isTallerThan,
        isLowerThan,
      }}
    >
      {children}
    </UiContext.Provider>
  );
}

export function useUi(): UiState {
  return useContext(UiContext);
}
