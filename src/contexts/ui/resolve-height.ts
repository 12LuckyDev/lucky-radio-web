import {
  HEIGHT_BREAKPOINTS,
  type BreakpointHeight,
} from "./height-breakpoints";

export function resolveHeight(
  state: Record<string, boolean>,
): BreakpointHeight {
  if (state[HEIGHT_BREAKPOINTS.xs]) return "xs";
  if (state[HEIGHT_BREAKPOINTS.sm]) return "sm";
  if (state[HEIGHT_BREAKPOINTS.md]) return "md";
  if (state[HEIGHT_BREAKPOINTS.lg]) return "lg";

  return "xl";
}
