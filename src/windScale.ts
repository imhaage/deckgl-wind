import chroma from "chroma-js";

export const N_COLORS = 32;
export const MAX_SPEED_KMH = 120;

export const windScale = chroma
  .scale([
    "#ffffff", // 0   km/h
    "#e0f0ff", // 1
    "#8dd5f0", // 5
    "#55c8e8", // 11
    "#43d6b4", // 19
    "#2ec95f", // 28
    "#e1dd37", // 38
    "#fab632", // 49
    "#f68511", // 61
    "#d93806", // 74
    "#7a0403", // 88
    "#30123b", // 120+
  ])
  .domain([0, 1, 5, 11, 19, 28, 38, 49, 61, 74, 88, 120])
  .mode("lab");

export function speedToIconIndex(speedKmh: number): number {
  return Math.min(
    Math.round((speedKmh / MAX_SPEED_KMH) * (N_COLORS - 1)),
    N_COLORS - 1,
  );
}

export function iconIndexToColor(i: number): string {
  return windScale((i / (N_COLORS - 1)) * MAX_SPEED_KMH).hex();
}