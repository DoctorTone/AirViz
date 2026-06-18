#!/usr/bin/env python3

"""
Fetch Delhi building footprints from OpenStreetMap (Overpass API) and bake in
believable heights.
 
Height priority per building:
  1. Real `height` tag if present (rare in this area).
  2. Real `building:levels` tag x 3.2m if present (~10% of buildings here).
  3. Estimated from footprint area otherwise (with light randomisation).
 
Each building is flagged `height_estimated: true/false` so the visualisation
(and case study) can honestly disclose which heights are real vs derived.
 
Output: delhi_buildings.json  — list of buildings, each:
  {
    "id": <int>,
    "coords": [[lon, lat], ...],   # real footprint, closed ring
    "height": <float metres>,
    "height_estimated": <bool>,
    "type": <str>
  }
"""

import requests
import json
import math
import random
from pathlib import Path
 
# Reproducible skyline — same estimated heights every run.
random.seed(42)


# ---------------------------------------------------------------------------
# CONFIG  — set these to the area you want.
# bbox order is (south, west, north, east). This is the Connaught Place area.
# ---------------------------------------------------------------------------
SOUTH, WEST, NORTH, EAST = 28.62, 77.20, 28.65, 77.24
 
CENTER_LAT = (SOUTH + NORTH) / 2.0
CENTER_LON = (WEST + EAST) / 2.0
 
OVERPASS_URL = "https://overpass-api.de/api/interpreter"
# A meaningful User-Agent is what fixes the 406 — put a real contact in here.
HEADERS = {
    "User-Agent": "DelhiAirViz/1.0 (tony@drt-software.com)",
    "Accept": "application/json",
}
 
OUTPUT_FILE = "delhi_buildings.json"
 
LEVEL_HEIGHT_M = 3.2          # assumed metres per storey
MAX_HEIGHT_M = 70.0           # clamp — wide-but-low buildings shouldn't spike
MIN_HEIGHT_M = 3.0


# ---------------------------------------------------------------------------
# FETCH
# ---------------------------------------------------------------------------
def fetch_buildings():
    query = f"""
    [out:json][timeout:90];
    (
      way["building"]({SOUTH},{WEST},{NORTH},{EAST});
    );
    out geom;
    """
 
    print("Querying Overpass API...")
    resp = requests.post(
        OVERPASS_URL,
        data={"data": query},
        headers=HEADERS,
        timeout=120,
    )
    resp.raise_for_status()
    data = resp.json()
 
    elements = data.get("elements", [])
    print(f"Retrieved {len(elements)} raw elements")
    return elements
 

# ---------------------------------------------------------------------------
# GEOMETRY HELPERS
# ---------------------------------------------------------------------------
def footprint_area_m2(coords):
    """Shoelace area in square metres. coords are [lon, lat] pairs."""
    R = 6378137.0
    pts = []
    for lon, lat in coords:
        x = math.radians(lon) * R * math.cos(math.radians(CENTER_LAT))
        y = math.radians(lat) * R
        pts.append((x, y))
 
    area = 0.0
    n = len(pts)
    for i in range(n):
        x1, y1 = pts[i]
        x2, y2 = pts[(i + 1) % n]
        area += x1 * y2 - x2 * y1
    return abs(area) / 2.0
 
 
def parse_real_height(tags):
    """Return a real height in metres from tags, or None if not available."""
    # 1. explicit height tag
    h = tags.get("height")
    if h is not None:
        try:
            return float(str(h).lower().replace("m", "").strip())
        except ValueError:
            pass
    # 2. building:levels
    lv = tags.get("building:levels")
    if lv is not None:
        try:
            return max(MIN_HEIGHT_M, float(lv) * LEVEL_HEIGHT_M)
        except ValueError:
            pass
    return None
 
 
def estimate_height_from_area(area):
    """Map footprint area (m^2) to a plausible height, with light jitter."""
    if area < 60:
        base_levels = 1
    elif area < 150:
        base_levels = 2
    elif area < 400:
        base_levels = 4
    elif area < 1000:
        base_levels = 7
    else:
        base_levels = 12
 
    jitter = random.uniform(-0.2, 0.35)
    height = base_levels * LEVEL_HEIGHT_M * (1 + jitter)
    return min(MAX_HEIGHT_M, max(MIN_HEIGHT_M, round(height, 1)))
 
 
# ---------------------------------------------------------------------------
# PROCESS
# ---------------------------------------------------------------------------
def process(elements):
    buildings = []
    n_real, n_levels, n_estimated = 0, 0, 0
 
    for el in elements:
        if el.get("type") != "way":
            continue
        tags = el.get("tags", {})
        if "building" not in tags:
            continue
        geom = el.get("geometry")
        if not geom or len(geom) < 3:
            continue
 
        coords = [[node["lon"], node["lat"]] for node in geom]
 
        # diagnostics on raw coverage
        if "height" in tags:
            n_real += 1
        if "building:levels" in tags:
            n_levels += 1
 
        real_h = parse_real_height(tags)
        if real_h is not None:
            height = min(MAX_HEIGHT_M, real_h)
            estimated = False
        else:
            height = estimate_height_from_area(footprint_area_m2(coords))
            estimated = True
            n_estimated += 1
 
        buildings.append({
            "id": el["id"],
            "coords": coords,
            "height": height,
            "height_estimated": estimated,
            "type": tags.get("building", "yes"),
        })
 
    total = len(buildings)
    print(f"\nProcessed {total} buildings")
    if total:
        print(f"  with real height tag: {n_real} ({100*n_real/total:.0f}%)")
        print(f"  with levels tag:      {n_levels} ({100*n_levels/total:.0f}%)")
        print(f"  heights estimated:    {n_estimated} ({100*n_estimated/total:.0f}%)")
 
        hs = sorted(b["height"] for b in buildings)
        print(f"\nDerived height spread (m):")
        print(f"  min {hs[0]:.1f}  median {hs[len(hs)//2]:.1f} "
              f"p95 {hs[int(len(hs)*0.95)]:.1f}  max {hs[-1]:.1f}")
 
    return buildings


# ---------------------------------------------------------------------------
def main():
    elements = fetch_buildings()
    buildings = process(elements)
 
    with open(OUTPUT_FILE, "w") as f:
        json.dump(buildings, f)
    size_kb = Path(OUTPUT_FILE).stat().st_size / 1024
    print(f"\nSaved {len(buildings)} buildings to {OUTPUT_FILE} ({size_kb:.0f} KB)")
    print(f"Projection centre (set this in your R3F component): "
          f"lon {CENTER_LON:.5f}, lat {CENTER_LAT:.5f}")

if __name__ == "__main__":
    main()
