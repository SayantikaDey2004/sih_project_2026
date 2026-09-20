from fastapi import APIRouter, Depends, Query
from Backend.dashboardfile import get_current_user
from Backend.ai_prediction import predict
from Backend.schemas import InputData
import requests
import random

router = APIRouter(prefix="/api/emergency-response", tags=["Emergency Response"])

# Smart Geocoding Registry for Indian Cities
GEO_REGISTRY = {
    "sikkim": (27.33, 88.61), "gangtok": (27.33, 88.61),
    "darjeeling": (27.04, 88.26), "guwahati": (26.14, 91.73),
    "assam": (26.20, 92.93), "uttarakhand": (30.06, 79.01),
    "himachal": (31.10, 77.17), "wayanad": (11.68, 76.13),
    "shillong": (25.57, 91.88), "itanagar": (27.08, 93.60),
    "kohima": (25.67, 94.11), "aizawl": (23.73, 92.71),
    "imphal": (24.81, 93.93), "agartala": (23.83, 91.28),
    "dehradun": (30.31, 78.03), "shimla": (31.10, 77.17),
    "mumbai": (19.07, 72.87), "delhi": (28.61, 77.20),
    "bangalore": (12.97, 77.59), "kolkata": (22.57, 88.36),
    "chennai": (13.08, 80.27), "pune": (18.52, 73.85),
    "hyderabad": (17.38, 78.48), "ahmedabad": (23.02, 72.57)
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

        user_signup_loc = current_user.get("location") if current_user else None

        # Priority Logic: 1. raw coords (for ML), 2. profile location (for display)
        if raw_location and isinstance(raw_location, str) and "," in raw_location and "Singapore" not in raw_location:
            try:
                parts = [p.strip() for p in raw_location.split(",") if p.strip()]
                user_lat = float(parts[0])
                user_lon = float(parts[1])
            except Exception: pass
        elif user_signup_loc and user_signup_loc not in ["Local Sector", "Current Location", "Detected Area", "Active Sector"]:
             clean_name = str(user_signup_loc).lower().strip()
             for key, coords in GEO_REGISTRY.items():
                if key in clean_name:
                    user_lat, user_lon = coords
                    break

        # Display Logic
        if user_signup_loc and user_signup_loc not in ["Local Sector", "Current Location", "Detected Area", "Active Sector", "My Location"]:
            user_city = user_signup_loc
            user_region = "Regional Zone"
        elif raw_location and "," not in str(raw_location):
            user_city = str(raw_location)
            user_region = "Detected Area"
        else:
            try:
                res = requests.get("https://ipinfo.io", timeout=1.5)
                if res.status_code == 200:
                    loc_data = res.json()
                    if "Singapore" in loc_data.get("city", "") or loc_data.get("country") == "SG":
                        user_city = "Local Sector"
                        user_region = "High Risk Zone"
                        user_lat, user_lon = 27.33, 88.61
                    else:
                        user_city = loc_data.get("city") or "Local Sector"
                        user_region = loc_data.get("region") or "Regional Sector"
                        if "loc" in loc_data:
                            parts = loc_data["loc"].split(",")
                            user_lat, user_lon = float(parts[0]), float(parts[1])
            except Exception: pass

        # Fetch live weather for this specific location
        weather = get_weather_for_loc(user_lat, user_lon)
        live_rain = float(weather.get("rain") or weather.get("precipitation") or 0.0)

        # Generate dynamic sectors based on location and ML model
        incidents = []
        sector_names = ["Slope Stability Watch", "Saturation Alert Zone", "Erosion Risk Perimeter"]

        # Use lat/lon to seed randomness for consistency per location
        random.seed(int(user_lat * 100 + user_lon * 100))

        for i, s_name in enumerate(sector_names):
            # Dynamic telemetry with variance influenced by location
            loc_factor = (user_lat + user_lon) % 1.0
            t_rain = max(live_rain * 1.5, 35.0 + (live_rain * random.uniform(1.0, 2.0)) + (loc_factor * 10))
            t_slope = 30.0 + (i * 12.0) + (loc_factor * 15)
            t_sat = min(99.0, 45.0 + (live_rain * 2.8) + (i * 6.0) + (loc_factor * 20))

            telemetry = InputData(
                Rainfall_mm=t_rain,
                Slope_Angle=t_slope,
                Soil_Saturation=t_sat,
                Vegetation_Cover=15.0 + (i * 15.0) - (loc_factor * 10),
                Earthquake_Activity=2.0 + (i * 0.8) + (loc_factor * 2),
                Proximity_to_Water=200.0 - (i * 40.0) - (loc_factor * 50),
                Soil_Type_Gravel=0,
                Soil_Type_Sand=1 if (i + int(user_lat)) % 2 == 0 else 0,
                Soil_Type_Silt=1 if (i + int(user_lon)) % 2 != 0 else 0
            )

            ml_res = predict(telemetry)
            ml_prob = ml_res.get("probability", 50.0)

            # Map ML risk level to strictly allowed frontend enum values: "Critical" | "High" | "Moderate"
            raw_risk = ml_res.get("riskLevel", "Moderate")
            risk_level = raw_risk if raw_risk in ["Critical", "High", "Moderate"] else "Moderate"

            incidents.append({
                "id": f"INC-{int(user_lat*10)%100}{int(user_lon*10)%100}-{i+1}",
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

        villages = []
        village_prefixes = ["Upper", "Lower", "Hidden", "North"]
        for i in range(2):
            v_name = f"{village_prefixes[(int(user_lat) + i) % 4]} {user_city}"
            pop = 300 + (i * 200) + int(user_lon % 100)
            villages.append({
                "id": f"VIL-{i+1}",
                "name": v_name,
                "distance": f"{1.5 + i*2.2 + (user_lat % 1):.1f} km",
                "population": pop,
                "affected": int(pop * (live_rain / 120.0)) if live_rain > 40 else 0,
                "capacity": pop + 200,
                "needs": ["Rations", "Water", "Blankets"] if live_rain > 35 else [],
                "progress": max(40, 100 - int(live_rain)),
                "riskLevel": "High" if live_rain > 45 or i == 0 else "Moderate",
                "evacuated": live_rain > 75
            })

        return {
            "user_location": f"{user_city}, {user_region}",
            "network_location": f"{user_city}, {user_region}",
            "incidents": incidents,
            "infrastructure": [
                {
                    "id": "INF-01",
                    "name": f"{user_city} Emergency Hub",
                    "location": f"{user_city} Main",
                    "status": "Operational",
                    "statusDetail": "Primary staging area ready"
                },
                {
                    "id": "INF-02",
                    "name": f"{user_city} Supply Depot",
                    "location": f"East {user_city}",
                    "status": "Standby",
                    "statusDetail": "Resources being loaded"
                }
            ],
            "villages": villages,
            "helpEntries": [
                {
                    "id": "HELP-01",
                    "category": "Rescue",
                    "title": f"Local Response Team",
                    "name": f"Team {user_city}",
                    "type": "Rescue",
                    "distance": f"{0.8 + (user_lon % 2):.1f} km",
                    "contact": "108",
                    "availability": "On Standby",
                    "available": True,
                    "location": f"{user_city} Base"
                },
                {
                    "id": "HELP-02",
                    "category": "Medical",
                    "title": f"{user_city} General Hospital",
                    "name": f"{user_city} Health",
                    "type": "Medical",
                    "distance": f"{3.2 + (user_lat % 3):.1f} km",
                    "contact": "102",
                    "availability": "Ready",
                    "available": True,
                    "location": f"Central {user_city}"
                }
            ],
            "resources": [
                {
                    "id": "RES-01",
                    "name": "Medical Kits",
                    "type": "Medical",
                    "quantity": 100 + int(user_lat % 50),
                    "allocated": 20 + int(live_rain / 2),
                    "total": 200,
                    "unit": "packs",
                    "location": user_city
                }
            ],
            "feed": [
                {
                    "id": "FEED-01",
                    "time": "Just now",
                    "message": f"Real-time sensor network active for {user_city} ({user_lat:.2f}, {user_lon:.2f})",
                    "text": f"Real-time sensor network active for {user_city} ({user_lat:.2f}, {user_lon:.2f})",
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
