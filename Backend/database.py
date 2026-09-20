import os
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()

_client = None

def get_db_client():
    global _client
    if _client is None:
        mongodb_url = os.getenv("mongo_db") or os.getenv("mongodb_url")
        if not mongodb_url:
            print("WARNING: No MongoDB URL found in environment")
            return None
        try:
            _client = MongoClient(mongodb_url, serverSelectionTimeoutMS=5000)
            _client.admin.command("ping")
        except Exception as e:
            print(f"ERROR: Could not connect to MongoDB: {e}")
            return None
    return _client

def get_database():
    client = get_db_client()
    if client:
        # Check environment for database name override, default to 'user_db'
        db_name = os.getenv("MONGO_DB_NAME", "user_db")
        return client.get_database(db_name)
    return None
