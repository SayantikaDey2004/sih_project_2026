from fastapi import FastAPI, APIRouter, Depends, Form, Request, HTTPException, Response,WebSocket
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer
from Backend.security import check_hash, create_hash
from Backend.token_create import create_token, craete_token, decode_token
from Backend.schemas import register, login
from pymongo import MongoClient
from dotenv import load_dotenv
from fastapi.responses import JSONResponse
from importlib import import_module
import requests
import uvicorn
import os
import time

from pathlib import Path
# Load environment from root, then explicitly from Backend directory with override
load_dotenv(override=True)
backend_env = Path(__file__).resolve().parent / ".env"
if backend_env.exists():
    load_dotenv(dotenv_path=backend_env, override=True)
print(f"DEBUG: main.py initialized. GROQ_API_KEY present: {bool(os.getenv('GROQ_API_KEY'))}")

from Backend.dashboardfile import dashboard_router
from Backend.Chat_Bot import router as chatbot_router
from Backend.Profile_page import router as profile_router
from Backend.risk_map import router as riskmap_router
from Backend.ai_prediction import router as prediction_router

emergency_router = import_module("Backend.emergency-response").router
from Backend.govt_routes import router as govt_router

app = FastAPI(title="Geo Rakshak API")

# Configure CORS for frontend access
# Using allow_origin_regex dynamically allows any origin/port while supporting allow_credentials=True
app.add_middleware(
    CORSMiddleware,
    allow_origin_regex="https?://.*",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from Backend.database import get_database

# Register routers
app.include_router(dashboard_router)
app.include_router(chatbot_router)
app.include_router(profile_router)
app.include_router(riskmap_router)
app.include_router(prediction_router)
app.include_router(emergency_router)
app.include_router(govt_router)

@app.middleware("http")
async def log_requests(request: Request, call_next):
    print(f"Incoming request: {request.method} {request.url}")
    response = await call_next(request)
    print(f"Response status: {response.status_code}")
    return response

# In-memory user fallback if MongoDB is not reachable
in_memory_users = {}

def get_collection():
    return get_database()

@app.get("/")
def home_page(request: Request):
    return {"request": "welcome", "status": "active"}

@app.post("/login")
def login_page(user: login):
    database = get_collection()
    found_user = None
    normalized_email = user.email.strip().lower()
    if database is not None:
        try:
            normalized_email = user.email.strip().lower()
            found_user = database["user"].find_one({"email": normalized_email})
        except Exception:
            found_user = in_memory_users.get(normalized_email)
    else:
        found_user = in_memory_users.get(normalized_email)

    if not found_user:
        raise HTTPException(status_code=401, detail="Invalid email or password")

    password_ok = check_hash(user.password, found_user["password"])
    if not password_ok:
        raise HTTPException(status_code=401, detail="Invalid email or password")

    token = create_token({
        "email": normalized_email,
        "full_name": found_user.get("full_name", ""),
        "contact": found_user.get("contact", ""),
        "location": found_user.get("location", "")
    })

    return {
        "login": True,
        "token": token,
        "email": normalized_email,
        "full_name": found_user.get("full_name", "")
    }

@app.post("/register")
def register_user(user: register):
    database = get_collection()
    collection=database["user"]
    
    # Check if user exists
    existing = None
    if collection is not None:
        try:
            normalized_email = user.email.strip().lower()
            existing = collection.find_one({"email": normalized_email})
        except Exception:
            existing = in_memory_users.get(normalized_email)
    else:
        existing = in_memory_users.get(normalized_email)

    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    if user.password != user.confirm_password:
        raise HTTPException(status_code=400, detail="Passwords do not match")
    else:
        hashed_pw = create_hash(user.password)
        # Ensure the hashed password is stored as bytes for consistency
        if isinstance(hashed_pw, bytes):
            hashed_pw_to_store = hashed_pw.decode('utf-8')
        else:
            hashed_pw_to_store = hashed_pw

    new_user = {
        "full_name": user.full_name,
        "email": normalized_email,
        "contact": user.contact_number,
        "location": user.location,
            "password": hashed_pw_to_store
    }

    if collection is not None:
        try:
            collection.insert_one(new_user)
        except Exception:
            in_memory_users[normalized_email] = new_user
    else:
        in_memory_users[normalized_email] = new_user

    token = create_token({
        "email": normalized_email,
        "full_name": user.full_name,
        "contact": user.contact_number,
        "location": user.location
    })

    return {
        "register": True,
        "token": token,
        "email": normalized_email,
        "full_name": user.full_name
    }

@app.post("/api/incidents")
def report_incident(data: dict):
    print(f"DEBUG: Received incident report data: {data}")
    database = get_collection()
    if database is None:
        print("ERROR: Database connection failed during incident report")
        return {"success": False, "detail": "Database connection failed"}

    collection = database["disaster_reports"]

    disaster_type = data.get("disasterType") or data.get("disaster_type") or "Disaster"
    location = data.get("location", "specified location")
    description = data.get("description", "")

    try:
        t = collection.count_documents({})
        incident_id = f"INC-{t+1001}"

        doc = {
            "disaster_type": str(disaster_type),
            "location": str(location),
            "description": str(description),
            "IncidentId": incident_id,
            "timestamp": data.get("timestamp") or time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
        }
        collection.insert_one(doc)
        print(f"DEBUG: Incident saved to {database.name} as {incident_id}")
        return {
            "success": True,
            "message": f"Success! {disaster_type} reported. Govt notified.",
            "incidentId": incident_id,
            "teamNotified": True
        }
    except Exception as e:
        print(f"ERROR saving incident: {e}")
        return {"success": False, "detail": str(e)}

@app.get("/api/health")
def health_check():
    return {"status": "ok", "db": "connected" if get_collection() is not None else "disconnected"}

connections = []

@app.websocket("/ws")
async def websocket_endpoint(ws: WebSocket):
    await ws.accept()
    connections.append(ws)
    try:
        while True:
            await ws.receive_text()  # keep alive
    except:
        connections.remove(ws)

@app.post("/api/sos")
async def trigger_sos(data: dict = None):
    response = requests.get("https://ipinfo.io")
    data = response.json()
    message = {
        "type": "sos",
        "message": f"🚨 SOS ALERT 🚨\nA user has triggered an emergency signal. They are in urgent need of help {data.get('city')}"
    }
    try:
        # Broadcast to all connected clients
        for conn in connections:
            await conn.send_json(message)
    except Exception as e:
        return {"success": False}
    else:
        return {"success": True, "message_sent": "Successfully notification sent"}

@app.post("/api/notify-disaster")
async def notify_disaster(data: dict):
    """Endpoint to send disaster alerts to all connected clients via WebSocket.
    Expected JSON payload: {"disasterType": "Flood", "location": "City Center"}
    """
    disaster_type = data.get("disasterType", "Disaster")
    location = data.get("location", "unknown")
    alert_message = {
        "type": "disaster",
        "disasterType": disaster_type,
        "location": location,
        "message": f"⚠️ {disaster_type} reported at {location}. Immediate attention required."
    }
    try:
        for conn in connections:
            await conn.send_json(alert_message)
    except Exception as e:
        return {"success": False, "error": str(e)}
    else:
        return {"success": True, "detail": "Disaster alert broadcasted"}


@app.get("/location")
def get_user_location():
    try:
        response = requests.get("https://ipinfo.io", timeout=5)
        data = response.json()
        location = data.get("loc", "")
        city = data.get("city", "")
        region = data.get("region", "")
        country = data.get("country", "")
        return {
            "location": location,
            "city": city,
            "region": region,
            "country": country,
            "name": city or "Current Location",
            "full_region": f"{region}, {country}" if region and country else (region or country or "")
        }
    except Exception:
        return {
            "location": "22.5626,88.3630",
            "city": "Current Location",
            "region": "Monitored Zone",
            "country": "IN",
            "name": "Current Location",
            "full_region": "Monitored Zone"
        }

@app.post("/logout")
def logout(response: Response):
    response.delete_cookie("access_token")
    return JSONResponse(content={"logout": True, "message": "Logged out successfully"})




if __name__ == "__main__":
    uvicorn.run("Backend.main:app", host="0.0.0.0", port=8000, reload=True)

