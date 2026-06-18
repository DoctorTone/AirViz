#!/usr/bin/env python3
"""
Fetch Delhi building data from OpenStreetMap Overpass API.
Outputs GeoJSON file with building footprints and heights.
"""

import requests
import json
from pathlib import Path

def fetch_delhi_buildings():
    """
    Query Overpass API for buildings in Delhi.
    Returns GeoJSON with building footprints.
    """
    
    # Tight area around Connaught Place (south, west, north, east)
    south, west, north, east = 28.62, 77.20, 28.65, 77.24
    
    print("🏗️  Fetching Delhi buildings from OpenStreetMap...")
    
    # Overpass API query
    # Get buildings with their heights/levels
    overpass_url = "https://overpass-api.de/api/interpreter"
    overpass_query = f"""
    [out:json][timeout:60];
    (
      way["building"]({south},{west},{north},{east});
    );
    out geom;
    """
    
    try:
        print("📡 Querying Overpass API...")
        headers = {
    "User-Agent": "DelhiAirViz/1.0 (tony@drt-software.com)",
    "Accept": "application/json",
}
        response = requests.post(overpass_url, data={"data": overpass_query}, headers=headers, timeout=90)
        response.raise_for_status()
        
        data = response.json()
        print(f"✅ Retrieved {len(data.get('elements', []))} building elements")
        
        # Convert to GeoJSON
        buildings = []
        
        for element in data.get('elements', []):
            if element['type'] == 'way' or element['type'] == 'relation':
                tags = element.get('tags', {})
                
                # Skip if no building tag
                if 'building' not in tags:
                    continue
                
                # Extract building properties
                building_data = {
                    "id": element['id'],
                    "type": tags.get('building', 'yes'),
                    "height": parse_height(tags.get('height', tags.get('building:levels', '3'))),
                    "levels": int(tags.get('building:levels', '3')),
                    "name": tags.get('name', ''),
                }
                
                # Get coordinates
                if 'geometry' in element:
                    coords = []
                    for node in element['geometry']:
                        coords.append([node['lon'], node['lat']])
                    
                    if len(coords) >= 3:  # Valid polygon
                        building_data['coords'] = coords
                        buildings.append(building_data)
        
        print(f"🏢 Processed {len(buildings)} buildings with coordinates")
        
        # Save as JSON
        output_file = './delhi_buildings.json'
        with open(output_file, 'w') as f:
            json.dump(buildings, f, indent=2)
        
        print(f"💾 Saved to {output_file}")
        print(f"📦 File size: {Path(output_file).stat().st_size / 1024:.1f} KB")
        
        return buildings
        
    except requests.exceptions.Timeout:
        print("❌ Timeout: Overpass API took too long. Try a smaller area.")
        return []
    except requests.exceptions.RequestException as e:
        print(f"❌ Error: {e}")
        return []


def parse_height(height_str):
    """
    Parse height string from OSM to meters.
    Handles: "20", "20m", "6 levels", etc.
    """
    if not height_str:
        return 15  # Default 15m
    
    height_str = str(height_str).strip().lower()
    
    # Already in meters
    if 'm' in height_str:
        try:
            return float(height_str.replace('m', '').strip())
        except:
            return 15
    
    # Levels (assume 3m per level)
    if 'level' in height_str or 'story' in height_str:
        try:
            levels = int(''.join(filter(str.isdigit, height_str.split()[0])))
            return max(5, levels * 3)
        except:
            return 15
    
    # Just a number (assume meters)
    try:
        return float(''.join(c for c in height_str if c.isdigit() or c == '.'))
    except:
        return 15


if __name__ == "__main__":
    buildings = fetch_delhi_buildings()
    
    if buildings:
        print(f"\n✨ Sample buildings (first 3):")
        for building in buildings[:3]:
            print(f"  ID: {building['id']}, Height: {building['height']}m, Type: {building['type']}")
    else:
        print("\n❌ No buildings fetched. Try again or check internet connection.")
