export const HEIGHT_BREAKPOINTS = {
  xs: "(max-height: 299px)",
  sm: "(min-height: 300px) and (max-height: 499px)",
  md: "(min-height: 500px) and (max-height: 699px)",
  lg: "(min-height: 700px) and (max-height: 899px)",
  xl: "(min-height: 900px)",
} as const;

export type BreakpointHeight = keyof typeof HEIGHT_BREAKPOINTS;
