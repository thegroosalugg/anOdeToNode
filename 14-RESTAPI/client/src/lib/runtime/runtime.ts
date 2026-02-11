export const isLandscapeMobile = () => window.matchMedia(
  "(pointer: coarse) and (orientation: landscape)",
).matches;
