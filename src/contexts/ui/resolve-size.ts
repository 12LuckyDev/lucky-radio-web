import { BREAKPOINTS, type BreakpointSize } from "./breakpoints";

export function resolveSize(state: Record<string, boolean>): BreakpointSize {
  if (state[BREAKPOINTS.xs]) return "xs";
  if (state[BREAKPOINTS.sm]) return "sm";
  if (state[BREAKPOINTS.md]) return "md";
  if (state[BREAKPOINTS.lg]) return "lg";

  return "xl";
}
