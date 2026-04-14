import { DeckGL } from "@deck.gl/react";
import type { MapViewState } from "@deck.gl/core";
import { LineLayer } from "@deck.gl/layers";
import { Map } from "@vis.gl/react-maplibre";
import "maplibre-gl/dist/maplibre-gl.css"; // See notes below

const INITIAL_VIEW_STATE: MapViewState = {
  longitude: -122.41669,
  latitude: 37.7853,
  zoom: 13,
};

type DataType = {
  from: [longitude: number, latitude: number];
  to: [longitude: number, latitude: number];
};

export const App = () => {
  const layers = [
    new LineLayer<DataType>({
      id: "line-layer",
      data: "/path/to/data.json",
      getSourcePosition: (d: DataType) => d.from,
      getTargetPosition: (d: DataType) => d.to,
    }),
  ];

  return (
    <DeckGL initialViewState={INITIAL_VIEW_STATE} controller layers={layers}>
      <Map
        initialViewState={{
          longitude: -100,
          latitude: 40,
          zoom: 3.5,
        }}
        style={{ width: 600, height: 400 }}
        mapStyle="https://tiles.openfreemap.org/styles/positron"
      />
    </DeckGL>
  );
};
