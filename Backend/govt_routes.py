from fastapi import APIRouter, Depends, HTTPException, Header
from pydantic import BaseModel, EmailStr, Field
from Backend.security import create_hash, check_hash
from Backend.token_create import create_token, decode_token
import os
from pymongo import MongoClient
from dotenv import load_dotenv
import uuid

load_dotenv()

from Backend.database import get_database

# Mongo collection for govt officials
def get_govt_collection():
    db = get_database()
    if db is None:
        raise HTTPException(status_code=500, detail="Database not configured")
    return db["govt_users"]

def get_db():
    return get_database()

class GovtRegister(BaseModel):
    email: EmailStr
    password: str = Field(min_length=6)
    full_name: str
    department: str = ""

class GovtLogin(BaseModel):
    email: EmailStr
    password: str

router = APIRouter(prefix="/api/govt", tags=["Government"])

@router.post("/signup")
def govt_signup(data: GovtRegister):
    collection = get_govt_collection()
    if collection.find_one({"email": data.email}):
        raise HTTPException(status_code=400, detail="Email already registered")
    hashed = create_hash(data.password)
    gov_id = "GOVT-" + uuid.uuid4().hex[:8].upper()
    user_doc = {
        "gov_id": gov_id,
        "email": data.email,
        "full_name": data.full_name,
        "department": data.department,
        "password": hashed,
    }
    collection.insert_one(user_doc)
    token = create_token({
        "email": data.email,
        "gov_id": gov_id,
        "full_name": data.full_name,
        "department": data.department,
        "role": "govt",
    })
    return {"success": True, "gov_id": gov_id, "token": token}

@router.post("/login")
def govt_login(data: GovtLogin):
    collection = get_govt_collection()
    user = collection.find_one({"email": data.email})
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    if not check_hash(data.password, user["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token = create_token({
        "email": user["email"],
        "gov_id": user["gov_id"],
        "full_name": user.get("full_name", ""),
        "department": user.get("department", ""),
        "role": "govt",
    })
    return {"success": True, "gov_id": user["gov_id"], "token": token}

# Dependency to verify govt token from Authorization header
def get_current_govt_user(authorization: str = Header(None)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing or invalid token")
    token_str = authorization.split(" ", 1)[1]
    payload = decode_token(token_str)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    if payload.get("role") != "govt":
        raise HTTPException(status_code=403, detail="Not a government official")
    return payload

@router.get("/profile")
def govt_profile(current_user: dict = Depends(get_current_govt_user)):
    collection = get_govt_collection()
    user = collection.find_one({"gov_id": current_user["gov_id"]}, {"_id": 0, "password": 0})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.get("/reports")
def get_reports(current_user: dict = Depends(get_current_govt_user)):
    database = get_db()
    if database is None:
        print("ERROR: Govt reports fetch failed - Database not available")
        raise HTTPException(status_code=500, detail="Database not available")

    reports_col = database["disaster_reports"]
    count = reports_col.count_documents({})
    print(f"DEBUG: Govt portal fetching reports from {database.name}. Found {count} reports.")

    reports = list(reports_col.find({}, {"_id": 0}).sort("timestamp", -1))
    return reports
