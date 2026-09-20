from fastapi import APIRouter, Depends, Query
from Backend.dashboardfile import get_current_user
from Backend.ai_prediction import predict
from Backend.schemas import InputData
import requests
import random

router = APIRouter(prefix="/api/emergency-response", tags=["Emergency Response"])

# Smart Geocoding Registry for Indian High-Risk Regions
GEO_REGISTRY = {
    "sikkim": (27.33, 88.61),
    "gangtok": (27.33, 88.61),
    "darjeeling": (27.04, 88.26),
    "guwahati": (26.14, 91.73),
    "assam": (26.20, 92.93),
    "uttarakhand": (30.06, 79.01),
    "himachal": (31.10, 77.17),
    "wayanad": (11.68, 76.13),
    "kerala": (10.85, 76.27)
}

def get_weather_for_loc(lat: float, lon: float):
    url = "https://api.open-meteo.com/v1/forecast"
    params = {
        "latitude": lat,
        "longitude": lon,
        "current": ["temperature_2m", "precipitation", "rain"],
        "forecast_days": 1
    }
    try:
        res = requests.get(url, params=params, timeout=2.0)
        if res.status_code == 200:
            return res.json().get("current", {})
    except Exception:
        pass
    return {}

@router.get("")
@router.get("/")
def emergency_response(
    location: str = Query(None),
    current_user: dict = Depends(get_current_user)
):
    try:
        # Determine target location from query param, user profile, or live IP geolocation
        raw_location = location or (current_user.get("location") if isinstance(current_user, dict) else None)
        user_city = "Local Sector"
        user_region = "Monitored Zone"
        user_lat, user_lon = 27.33, 88.61 # Default

        if raw_location and isinstance(raw_location, str) and raw_location.strip():
            parts = [p.strip() for p in raw_location.split(",") if p.strip()]

            # Check if these are raw coordinates (e.g. "27.33, 88.61")
            try:
                user_lat = float(parts[0])
                user_lon = float(parts[1])
                # Attempt to get a real city name via IP context even if coordinates are GPS
                try:
                    ip_data = requests.get("https://ipinfo.io", timeout=0.8).json()
                    user_city = ip_data.get("city") or "Current Sector"
                    user_region = ip_data.get("region") or "Verified Zone"
                except Exception:
                    user_city = "Monitored Sector"
                    user_region = "Active Zone"
            except (ValueError, IndexError):
                user_city = parts[0]
                user_region = parts[1] if len(parts) > 1 else "Regional Sector"
                # Use Registry to find coordinates
                clean_name = user_city.lower().strip()
                for key, coords in GEO_REGISTRY.items():
                    if key in clean_name:
                        user_lat, user_lon = coords
                        break
        else:
            try:
                res = requests.get("https://ipinfo.io", timeout=1.0)
                if res.status_code == 200:
                    loc_data = res.json()
                    user_city = loc_data.get("city") or "Local Sector"
                    user_region = loc_data.get("region") or "Regional Sector"
                    if "loc" in loc_data:
                        parts = loc_data["loc"].split(",")
                        user_lat, user_lon = float(parts[0]), float(parts[1])
            except Exception:
                pass

        # Fetch live weather for this specific location
        weather = get_weather_for_loc(user_lat, user_lon)
        live_rain = float(weather.get("rain") or weather.get("precipitation") or 0.0)

        # Generate dynamic sectors based on location and ML model
        incidents = []
        sector_names = ["Slope Stability Watch", "Saturation Alert Zone", "Erosion Risk Perimeter"]

        for i, s_name in enumerate(sector_names):
            # Dynamic telemetry with variance
            t_rain = max(live_rain * 1.5, 40.0 + (live_rain * random.uniform(1.0, 2.0)))
            t_slope = 35.0 + (i * 10.0) + random.uniform(0, 5)
            t_sat = min(98.0, 50.0 + (live_rain * 2.5) + (i * 5.0))

            telemetry = InputData(
                Rainfall_mm=t_rain,
                Slope_Angle=t_slope,
                Soil_Saturation=t_sat,
                Vegetation_Cover=20.0 + (i * 10.0),
                Earthquake_Activity=2.5 + (i * 0.5),
                Proximity_to_Water=150.0 - (i * 30.0),
                Soil_Type_Gravel=0,
                Soil_Type_Sand=1 if i % 2 == 0 else 0,
                Soil_Type_Silt=1 if i % 2 != 0 else 0
            )

            ml_res = predict(telemetry)
            ml_prob = ml_res.get("probability", 50.0)

            # Map ML risk level to strictly allowed frontend enum values: "Critical" | "High" | "Moderate"
            raw_risk = ml_res.get("riskLevel", "Moderate")
            risk_level = raw_risk if raw_risk in ["Critical", "High", "Moderate"] else "Moderate"

            incidents.append({
                "id": f"INC-00{i+1}",
                "title": f"{user_city}: {s_name}",
                "name": f"{user_city}: {s_name}",
                "type": "Landslide",
                "severity": int(ml_prob),
                "severityLabel": risk_level,
                "location": f"{user_city} Sector {chr(65+i)}",
                "status": "Active" if ml_prob > 60 else "Monitoring",
                "detail": f"Probability of hazard failure: {ml_prob}%. {ml_res.get('recommendation', '')}",
                "time": "Just now",
                "updatedAt": "Just now"
            })

        return {
            "user_location": f"{user_city}, {user_region}",
            "network_location": f"{user_city}, {user_region}",
            "incidents": incidents,
            "infrastructure": [
                {
                    "id": "INF-01",
                    "name": f"{user_city} Relief Shelter",
                    "location": f"{user_city} Central",
                    "status": "Operational",
                    "statusDetail": "Ready for deployment"
                },
                {
                    "id": "INF-02",
                    "name": f"{user_city} Transit Post",
                    "location": f"Main Highway, {user_city}",
                    "status": "Operational",
                    "statusDetail": "Clear for emergency vehicles"
                }
            ],
            "villages": [
                {
                    "id": "VIL-01",
                    "name": f"{user_city} Alpha Village",
                    "distance": "2.4 km",
                    "population": 450,
                    "affected": int(450 * (live_rain / 100.0)) if live_rain > 50 else 0,
                    "capacity": 800,
                    "needs": ["Rations", "Medical Kit"] if live_rain > 30 else [],
                    "progress": 100 if live_rain < 20 else 65,
                    "riskLevel": "High" if live_rain > 40 else "Low",
                    "evacuated": live_rain > 80
                }
            ],
            "helpEntries": [
                {
                    "id": "HELP-01",
                    "category": "Rescue",
                    "title": f"NDRF Team {user_city}",
                    "name": f"NDRF Team {user_city}",
                    "type": "Rescue",
                    "distance": "1.8 km",
                    "contact": "1078",
                    "availability": "On Standby",
                    "available": True,
                    "location": f"{user_city} Base"
                }
            ],
            "resources": [
                {
                    "id": "RES-01",
                    "name": "Emergency Kits",
                    "type": "Medical",
                    "quantity": 120,
                    "allocated": 45,
                    "total": 200,
                    "unit": "packs",
                    "location": user_city
                }
            ],
            "feed": [
                {
                    "id": "FEED-01",
                    "time": "Just now",
                    "message": f"Localized environmental stability monitoring active for {user_city}.",
                    "text": f"Localized environmental stability monitoring active for {user_city}.",
                    "type": "system"
                }
            ]
        }
    except Exception as e:
        import traceback
        traceback.print_exc()
        return {
            "user_location": "Local Sector, Monitored Zone",
            "network_location": "Local Sector, Monitored Zone",
            "incidents": [],
            "infrastructure": [],
            "villages": [],
            "helpEntries": [],
            "resources": [],
            "feed": []
        }
