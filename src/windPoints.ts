import { speedToIconIndex } from "./windScale";

export type WindData = {
  lat_min: number;
  lat_max: number;
  lon_min: number;
  lon_max: number;
  rows: number;
  cols: number;
  directions: (number | null)[][];
  speeds: (number | null)[][];
};

export type WindPoint = {
  lon: number;
  lat: number;
  direction: number;
  speedKmh: number;
  iconIndex: number;
};

export function buildWindPoints(data: WindData): WindPoint[] {
  return data.directions.flatMap((row, rowIdx) => {
    const lat =
      data.lat_max - (rowIdx / (data.rows - 1)) * (data.lat_max - data.lat_min);
    return row.flatMap((direction, colIdx) => {
      const speed = data.speeds[rowIdx][colIdx];
      if (speed === null || direction === null) return [];
      const lon =
        data.lon_min +
        (colIdx / (data.cols - 1)) * (data.lon_max - data.lon_min);
      const speedKmh = Math.round(speed * 3.6 * 10) / 10;
      const iconIndex = speedToIconIndex(speedKmh);
      return [{ lon, lat, direction, speedKmh, iconIndex }];
    });
  });
}
