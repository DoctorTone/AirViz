#!/usr/bin/env python3
"""
Process OpenAQ Delhi PM2.5 data into JSON format for 3D visualization.
Aggregates hourly measurements to daily averages and calculates AQI.
"""

import pandas as pd
import json
from datetime import datetime
from pathlib import Path

# ============================================================================
# AQI CALCULATION (US EPA standard for PM2.5)
# ============================================================================

def pm25_to_aqi(pm25_value):
    """
    Convert PM2.5 concentration (µg/m³) to AQI value.
    Uses US EPA breakpoints.
    """
    breakpoints = [
        (0, 12, 0, 50),           # Good
        (12.1, 35.4, 51, 100),    # Moderate
        (35.5, 55.4, 101, 150),   # Unhealthy for Sensitive Groups
        (55.5, 150.4, 151, 200),  # Unhealthy
        (150.5, 250.4, 201, 300), # Very Unhealthy
        (250.5, 500, 301, 500),   # Hazardous
    ]
    
    for (bp_lo, bp_hi, aqi_lo, aqi_hi) in breakpoints:
        if bp_lo <= pm25_value <= bp_hi:
            aqi = aqi_lo + (pm25_value - bp_lo) * (aqi_hi - aqi_lo) / (bp_hi - bp_lo)
            return round(aqi)
    
    return 500  # Max AQI


def aqi_to_category(aqi):
    """
    Convert AQI value to category and health advice.
    """
    if aqi <= 50:
        return {"category": "good", "color": "#00E400", "advice": "Air quality is satisfactory"}
    elif aqi <= 100:
        return {"category": "moderate", "color": "#FFFF00", "advice": "Acceptable; some may be sensitive"}
    elif aqi <= 150:
        return {"category": "unhealthy_sensitive", "color": "#FF7E00", "advice": "Sensitive groups should limit exposure"}
    elif aqi <= 200:
        return {"category": "unhealthy", "color": "#FF0000", "advice": "Everyone may begin to experience effects"}
    elif aqi <= 300:
        return {"category": "very_unhealthy", "color": "#8F3F97", "advice": "Health alert; everyone at risk"}
    else:
        return {"category": "hazardous", "color": "#7E0023", "advice": "Health warning; avoid outdoor activity"}


# ============================================================================
# MAIN PROCESSING
# ============================================================================

def process_delhi_air_quality(csv_path, output_path="delhi_air_quality.json"):
    """
    Process CSV data and generate visualization JSON.
    """
    
    print(f"📖 Reading CSV: {csv_path}")
    df = pd.read_csv(csv_path)
    
    # Parse datetime
    df['datetimeUtc'] = pd.to_datetime(df['datetimeUtc'])
    df['date'] = df['datetimeUtc'].dt.date
    
    print(f"✅ Loaded {len(df)} records")
    print(f"📅 Date range: {df['date'].min()} to {df['date'].max()}")
    
    # Get unique location
    location = df.iloc[0]
    sensor_id = location['location_id']
    location_name = location['location_name']
    lat = location['latitude']
    lon = location['longitude']
    
    print(f"📍 Location: {location_name} ({lat}, {lon})")
    
    # Aggregate to daily
    daily = df.groupby('date').agg({
        'value': ['mean', 'min', 'max', 'std'],
        'latitude': 'first',
        'longitude': 'first',
    }).reset_index()
    
    daily.columns = ['date', 'pm25_avg', 'pm25_min', 'pm25_max', 'pm25_std', 'lat', 'lon']
    daily['pm25_avg'] = daily['pm25_avg'].round(1)
    daily['pm25_min'] = daily['pm25_min'].round(1)
    daily['pm25_max'] = daily['pm25_max'].round(1)
    daily['pm25_std'] = daily['pm25_std'].fillna(0).round(1)
    
    print(f"📊 Aggregated to {len(daily)} daily records")
    print(f"\nPM2.5 Statistics:")
    print(f"  Min: {daily['pm25_min'].min()} µg/m³")
    print(f"  Max: {daily['pm25_max'].max()} µg/m³")
    print(f"  Avg: {daily['pm25_avg'].mean():.1f} µg/m³")
    
    # Build timeseries with AQI
    timeseries = []
    for idx, row in daily.iterrows():
        pm25 = float(row['pm25_avg'])
        aqi = pm25_to_aqi(pm25)
        aqi_info = aqi_to_category(aqi)
        
        timeseries.append({
            "date": str(row['date']),
            "pm25": pm25,
            "pm25_min": float(row['pm25_min']),
            "pm25_max": float(row['pm25_max']),
            "pm25_std": float(row['pm25_std']),
            "aqi": int(aqi),
            "category": aqi_info['category'],
            "color": aqi_info['color'],
            "advice": aqi_info['advice']
        })
    
    # Build output JSON
    output_data = {
        "metadata": {
            "city": "Delhi",
            "country": "India",
            "data_source": "OpenAQ (AirNow)",
            "generated": datetime.now().isoformat(),
            "update_frequency": "hourly",
            "timezone": "Asia/Kolkata"
        },
        "sensors": [
            {
                "id": int(sensor_id),
                "name": location_name,
                "latitude": float(lat),
                "longitude": float(lon),
                "elevation_m": None,
                "parameter": "pm25",
                "unit": "µg/m³",
                "measurements_count": int(len(df)),
                "days_covered": int(len(daily)),
                "timeseries": timeseries
            }
        ],
        "aqi_scale": {
            "good": {"range": "0-50", "color": "#00E400"},
            "moderate": {"range": "51-100", "color": "#FFFF00"},
            "unhealthy_sensitive": {"range": "101-150", "color": "#FF7E00"},
            "unhealthy": {"range": "151-200", "color": "#FF0000"},
            "very_unhealthy": {"range": "201-300", "color": "#8F3F97"},
            "hazardous": {"range": "301-500", "color": "#7E0023"}
        }
    }
    
    # Write JSON
    with open(output_path, 'w') as f:
        json.dump(output_data, f, indent=2)
    
    print(f"\n✅ Output saved: {output_path}")
    print(f"📦 File size: {Path(output_path).stat().st_size / 1024:.1f} KB")
    
    return output_data


if __name__ == "__main__":
    # Update this path to your CSV file
    csv_file = "/mnt/user-data/uploads/openaq_location_8118_measurments.csv"
    output_file = "/home/claude/delhi_air_quality.json"
    
    data = process_delhi_air_quality(csv_file, output_file)
    
    # Show sample output
    print("\n📋 Sample data (first 3 days):")
    for day in data['sensors'][0]['timeseries'][:3]:
        print(f"  {day['date']}: PM2.5={day['pm25']} → AQI={day['aqi']} ({day['category']})")
