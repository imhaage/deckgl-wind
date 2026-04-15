# deckgl-wind

## Stack

- [deck.gl](https://deck.gl/)
- basemap : [react-maplibre](https://visgl.github.io/react-maplibre/) + [OpenFreeMap](https://openfreemap.org/)

## Wind data from Meteo France AROME

⚠️ You need to create a free account to generate an API key.

### Example with cURL

Parameters:
- grid: 0.01
- package: SP1 (contains U and V parameters)
- reference time: 2026-04-14T15:00:00Z (AROME model run time)
- time: 01H (forecast from 00H to 51H => 00H = 15h)

```sh
curl -X 'GET' \
  'https://public-api.meteofrance.fr/previnum/DPPaquetAROME/v1/models/AROME/grids/0.01/packages/SP1/productARO?referencetime=2026-04-14T15:00:00Z&time=01H&format=grib2' \
  -H 'apikey: <YOUR_API_KEY>' \
  > output.grib2
```

### grib2 to JSON

Once the output.grib2 file is downloaded, data is extracted as JSON with the script `/data/gribToJSON.py`.

Finally, the output file `wind.json` must be placed into the `/public`.

💡 The `wind.json` file from the `/public` matches the example: AROME model run time = 2026-04-14T15:00:00Z, time = 01H.

## Running locally

```sh
npm i
npm run dev
```