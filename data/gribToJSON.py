import xarray as xr
import numpy as np
import json

# Read GRIB file
ds = xr.open_dataset(
    "output.grib2",
    engine="cfgrib",
    filter_by_keys={
        "typeOfLevel": "heightAboveGround",
        "level": 10,  # 10m above the ground
        "stepRange": "1",  # point-in-time measure
    },
)

U = ds["u10"].values
V = ds["v10"].values


DD = (np.degrees(np.arctan2(U, V))) % 360  # compute wind direction from U and V
FF = np.sqrt(U**2 + V**2)  # compute wind speed from U and V

# Subsampling: AROME 0.01° grids are huge, we keep 1 point every STEP.
STEP = 20
DD_sub = DD[::STEP, ::STEP]
FF_sub = FF[::STEP, ::STEP]

# Coordinates
lats = ds["latitude"].values[::STEP]
lons = ds["longitude"].values[::STEP]

# Export to JSON
output = {
    "lat_min": float(lats.min()),
    "lat_max": float(lats.max()),
    "lon_min": float(lons.min()),
    "lon_max": float(lons.max()),
    "rows": DD_sub.shape[0],
    "cols": DD_sub.shape[1],
    "directions": [
        [None if np.isnan(v) else int(round(v)) for v in row] for row in DD_sub.tolist()
    ],
    "speeds": [
        [None if np.isnan(v) else v for v in row]
        for row in np.round(FF_sub, 1).tolist()
    ],
}

with open("wind.json", "w") as f:
    json.dump(output, f)

print(f"Matrice {DD_sub.shape[0]}×{DD_sub.shape[1]} exportée")
