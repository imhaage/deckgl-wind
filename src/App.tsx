import { useState, useEffect } from "react";
import { DeckGL } from "@deck.gl/react";
import type { Layer, MapViewState, PickingInfo } from "@deck.gl/core";
import { IconLayer } from "@deck.gl/layers";
import { Map } from "@vis.gl/react-maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import { buildArrowAtlas, DRAW_MODES } from "./arrowAtlas";
import type { DrawMode } from "./arrowAtlas";
import { buildWindPoints } from "./windPoints";
import type { WindData, WindPoint } from "./windPoints";

const INITIAL_VIEW_STATE: MapViewState = {
  longitude: 10,
  latitude: 50,
  zoom: 4,
};

export const App = () => {
  const [windPoints, setWindPoints] = useState<WindPoint[]>([]);
  const [mode, setMode] = useState<DrawMode>("arrow");
  const [tooltip, setTooltip] = useState<{ x: number; y: number; text: string } | null>(null);

  useEffect(() => {
    fetch("/wind.json")
      .then((res) => res.json())
      .then((data: WindData) => setWindPoints(buildWindPoints(data)));
  }, []);

  const { iconAtlas, iconMapping } = buildArrowAtlas(mode);

  const layers = [
    new IconLayer({
      id: "wind-arrows",
      data: windPoints,
      iconAtlas,
      iconMapping,
      getIcon: (d) => `arrow_${d.iconIndex}`,
      getPosition: (d) => [d.lon, d.lat],
      getAngle: (d) => -d.direction,
      getSize: 15000,
      sizeUnits: "meters",
      sizeMinPixels: 6,
      sizeMaxPixels: 40,
      pickable: true,
      onHover: (info: PickingInfo<WindPoint>) => {
        if (info.object) {
          setTooltip({ x: info.x, y: info.y, text: `${info.object.speedKmh} km/h` });
        } else {
          setTooltip(null);
        }
      },
    }),
  ] as Layer[];

  return (
    <div style={{ position: "relative", width: "100%", height: "100vh" }}>
      <DeckGL initialViewState={INITIAL_VIEW_STATE} controller layers={layers}>
        <Map
          initialViewState={{ longitude: -100, latitude: 40, zoom: 3.5 }}
          style={{ width: 600, height: 400 }}
          mapStyle="https://tiles.openfreemap.org/styles/positron"
        />
      </DeckGL>

      <div style={{ position: "fixed", top: 12, left: 12, display: "flex", gap: 6, zIndex: 1 }}>
        {Object.entries(DRAW_MODES).map(([key, { label }]) => (
          <button
            key={key}
            onClick={() => setMode(key as DrawMode)}
            style={{
              padding: "4px 12px",
              borderRadius: 4,
              border: "1px solid #ccc",
              background: mode === key ? "#1a73e8" : "#fff",
              color: mode === key ? "#fff" : "#333",
              cursor: "pointer",
              fontSize: 13,
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {tooltip && (
        <div style={{
          position: "absolute",
          left: tooltip.x + 8,
          top: tooltip.y + 8,
          background: "rgba(0,0,0,0.75)",
          color: "#fff",
          padding: "4px 8px",
          borderRadius: 4,
          fontSize: 13,
          pointerEvents: "none",
        }}>
          {tooltip.text}
        </div>
      )}
    </div>
  );
};
