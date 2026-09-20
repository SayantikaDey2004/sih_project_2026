import os
import re
import json
import requests
from pathlib import Path
from dotenv import load_dotenv
from typing import Optional, List, Dict, Any, Union

# Load environment with override enabled to prevent existing empty variables from blocking .env values
env_path = Path(__file__).resolve().parent / ".env"
load_dotenv(dotenv_path=env_path, override=True)
backend_env = Path(__file__).resolve().parent.parent / "Backend" / ".env"
load_dotenv(dotenv_path=backend_env, override=True)
load_dotenv(override=True)

groq_key = os.getenv("GROQ_API_KEY") or os.getenv("groq_api")
if groq_key:
    groq_key = groq_key.strip().strip('"').strip("'")
    os.environ["GROQ_API_KEY"] = groq_key
print(f"DEBUG: Ml_models/rag_model.py loaded GROQ_API_KEY. Length: {len(os.environ.get('GROQ_API_KEY', ''))}")

GROQ_MODELS = [
    "openai/gpt-oss-20b",
    "openai/gpt-oss-120b",
    "qwen/qwen3-32b",
    "openai/gpt-oss-safeguard-20b"
]
WHISPER_MODEL = "whisper-large-v3"

CORPUS_CACHE_FILE = Path(__file__).resolve().parent / "rag_corpus.json"

# App logic domain knowledge base
APP_DOMAIN_KNOWLEDGE = [
    {
        "title": "Geo Rakshak Application Architecture",
        "content": (
            "Geo Rakshak is an AI-powered landslide early warning and disaster response system designed for high-risk "
            "Himalayan and Indian corridors (such as Sikkim, NH10, Teesta River Basin, Assam, Uttarakhand, and Himachal Pradesh). "
            "Key platform modules include: "
            "1. Live Risk Map (/risk-map): 9 interactive GIS layers (Heatmap, Rainfall, Soil Moisture, Slope Angle, Roads, Villages, Hospitals, Telemetry Sensors, Satellite) with pan-India search and GPS location proximity alerts. "
            "2. AI Landslide Risk Prediction (/landslide-risk): Real-time inference using a trained Random Forest pipeline evaluating 9 geotechnical and environmental parameters (Rainfall mm, Slope Angle degrees, Soil Saturation ratio, Vegetation Cover ratio, Earthquake Activity magnitude, Proximity to Water km, Soil Type Gravel, Sand, Silt). "
            "3. AI Analysis & Voice Assistant (/ai-analysis): RAG-grounded conversational intelligence for disaster advisories, shelter tracking, evacuation corridors, and road clearance status. "
            "4. SOS Emergency Alert (/api/sos): Real-time broadcast system for notifying rescue teams, district control centers, and nearby responders. "
            "5. Emergency Incident Reporting (/api/incidents): Citizen and sensor crowd-sourced hazard tracking."
        )
    },
    {
        "title": "Landslide Hazard Factors & Parameters",
        "content": (
            "The Geo Rakshak AI model calculates slope instability and failure probability based on: "
            "- Rainfall: Precipitation between 50mm and 300mm. Sustained intense rainfall increases pore water pressure. "
            "- Slope Angle: Critical angles between 50° and 60° exhibit steep shear stress. "
            "- Soil Saturation: Moisture saturation ratio from 0 to 1.0. Saturated soil reduces shear strength. "
            "- Vegetation Cover: Ratio 0 to 1.0. Deep root systems reinforce soil structure against sliding. "
            "- Earthquake Activity: Seismic magnitude 0 to 7.0 that can trigger sudden co-seismic landslides. "
            "- Proximity to Water: Distance 0 to 2.0 km from river channels like Teesta River prone to toe erosion. "
            "- Soil Type: Silt has highest vulnerability, followed by loose Sand and coarse Gravel."
        )
    },
    {
        "title": "Emergency Response & Shelters",
        "content": (
            "Designated Emergency Relief Shelters: "
            "- Rangpo Community Relief Center (East Sikkim): Medical triage, dry rations, and NDRF deployment hub. "
            "- Chungthang Rescue Center (North Sikkim): Mountain rescue and aerial supply drop zone. "
            "- Singtam & Melli Transit Shelters: Safe corridors along NH10. "
            "- Disaster Helplines: National Disaster Management Authority (1078), Emergency Police/Fire (112)."
        )
    }
]

DOMAIN_KEYWORDS = {
    "landslide", "landslides", "slope", "rockfall", "mudslide", "debris", "soil", "saturation",
    "rainfall", "rain", "precipitation", "earthquake", "seismic", "vegetation", "hazard",
    "disaster", "evacuate", "evacuation", "shelter", "rescue", "nh10", "teesta", "sikkim",
    "gangtok", "rangpo", "chungthang", "singtam", "melli", "assam", "himalaya", "himalayan",
    "georakshak", "rakshak", "geo", "gis", "sensor", "telemetry", "gravel", "sand", "silt",
    "moisture", "flood", "flooding", "river", "warning", "mitigation", "ndrf", "preparedness",
    "geotechnical", "stability", "instability", "shear", "culvert", "drainage", "pore", "creep",
    "hello", "hi", "hey", "help", "who", "are", "you", "what", "is", "tell", "me", "about"
}

def is_domain_relevant(query: str) -> bool:
    # Relaxing check to allow general greetings/questions for better UX
    return True

def extract_pdf_chunks(pdf_dir: Path) -> List[Dict[str, Any]]:
    chunks = []
    if not pdf_dir.exists():
        return chunks

    try:
        import pypdf
        for pdf_file in pdf_dir.glob("*.pdf"):
            try:
                reader = pypdf.PdfReader(str(pdf_file))
                for page_num, page in enumerate(reader.pages):
                    text = page.extract_text()
                    if not text or len(text.strip()) < 80:
                        continue
                    # Split page text into smaller paragraphs
                    paragraphs = [p.strip() for p in text.split("\n\n") if len(p.strip()) > 60]
                    for idx, para in enumerate(paragraphs):
                        chunks.append({
                            "source": pdf_file.name,
                            "page": page_num + 1,
                            "content": para[:1200]
                        })
            except Exception as e:
                print(f"Error reading PDF {pdf_file.name}: {e}")
    except ImportError:
        print("pypdf is not available for PDF text extraction.")

    return chunks

def build_or_load_corpus() -> List[Dict[str, Any]]:
    if CORPUS_CACHE_FILE.exists():
        try:
            with CORPUS_CACHE_FILE.open("r", encoding="utf-8") as f:
                data = json.load(f)
                if data and len(data) > 0:
                    return data
        except Exception:
            pass

    corpus = []
    # 1. Add app domain knowledge
    for item in APP_DOMAIN_KNOWLEDGE:
        corpus.append({
            "source": "Geo Rakshak App Architecture",
            "page": 1,
            "content": f"{item['title']}: {item['content']}"
        })

    # 2. Extract PDF chunks
    pdf_dir = Path(__file__).resolve().parent.parent / "pdfs"
    pdf_chunks = extract_pdf_chunks(pdf_dir)
    corpus.extend(pdf_chunks)

    # Cache for instant subsequent queries
    try:
        with CORPUS_CACHE_FILE.open("w", encoding="utf-8") as f:
            json.dump(corpus, f, ensure_ascii=False)
    except Exception as e:
        print(f"Failed to cache RAG corpus: {e}")

    return corpus

_cached_corpus = None

def get_corpus() -> List[Dict[str, Any]]:
    global _cached_corpus
    if _cached_corpus is None:
        _cached_corpus = build_or_load_corpus()
    return _cached_corpus

def retrieve_top_k(query: str, k: int = 4) -> List[Dict[str, Any]]:
    print(f"Retrieving top {k} chunks for: {query}")
    corpus = get_corpus()
    if not corpus:
        return []

    # Clean query tokens
    query_tokens = [w for w in re.sub(r"[^\w\s]", " ", query.lower()).split() if len(w) > 2]
    if not query_tokens:
        return corpus[:k]

    scored = []
    for item in corpus:
        text = item["content"].lower()
        score = 0
        for token in query_tokens:
            count = text.count(token)
            if count > 0:
                # Give higher weight to rare domain tokens
                weight = 3 if token in DOMAIN_KEYWORDS else 1
                score += count * weight
        if score > 0:
            scored.append((score, item))

    scored.sort(key=lambda x: x[0], reverse=True)
    if scored:
        return [item for _, item in scored[:k]]

    # Fallback to app domain baseline knowledge
    return corpus[:k]

def query_groq_rag(query: str, context_text: str) -> Optional[str]:
    api_key = os.getenv("GROQ_API_KEY") or os.getenv("groq_api")
    if not api_key:
        return None

    api_key = api_key.strip().strip('"').strip("'")
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }

    system_prompt = (
        "You are Geo Rakshak AI, an expert landslide risk prediction, disaster management, and early warning assistant for the Geo Rakshak system.\n"
        "STRICT DOMAIN POLICY:\n"
        "1. You MUST ONLY answer questions strictly related to landslide detection, geological/geotechnical parameters, disaster management, weather hazards, emergency response, evacuation routes, and the Geo Rakshak application logic.\n"
        "2. If the user's query is unrelated, out-of-domain, or general trivia (e.g., cooking, movies, coding other software, sports, general chat), you MUST politely refuse and state: "
        "'I am the Geo Rakshak AI Assistant. I can only assist with landslide risk monitoring, disaster management, geological safety, and the Geo Rakshak platform.'\n"
        "3. Use the provided context documents to provide accurate, concise, and structured safety advisories."
        "Answer clearly in plain text, using simple sentences and paragraphs only.\n"
        "Do not use markdown, tables, bullet points, or special formatting."
    )

    user_prompt = f"Context from Landslide Documents & Geo Rakshak System:\n{context_text}\n\nUser Question: {query}\nAnswer:"

    messages = [
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": user_prompt}
    ]

    for model_name in GROQ_MODELS:
        try:
            payload = {
                "model": model_name,
                "messages": messages,
                "temperature": 0.3,
                "max_tokens": 800
            }
            res = requests.post(
                "https://api.groq.com/openai/v1/chat/completions",
                headers=headers,
                json=payload,
                timeout=15
            )
            if res.status_code == 200:
                data = res.json()
                reply = data.get("choices", [{}])[0].get("message", {}).get("content", "")
                print(f"Groq API Reply: {reply[:100]}...")
                if reply and reply.strip():
                    return reply.strip()
            else:
                print(f"ERROR: Groq API returned status {res.status_code} for model {model_name}: {res.text}")
        except Exception as e:
            print(f"RAG Groq error with {model_name}: {e}")

    return None

def rag_pipeline_answer(query: str) -> str:
    # 1. Clean query for empty or too short input
    if not query or len(query.strip()) < 2:
        return "I couldn't quite hear you. Could you please repeat your question about landslide safety?"

    # 2. Retrieve relevant context chunks
    retrieved_chunks = retrieve_top_k(query, k=4)
    context_text = "\n\n---\n\n".join([c["content"] for c in retrieved_chunks])

    # 3. Query Groq LLM with context
    groq_answer = query_groq_rag(query, context_text)
    if groq_answer:
        return groq_answer

    # 4. Fallback from domain context if LLM offline
    return (
        f"Geo Rakshak Advisory on '{query}':\n"
        "• Monitor slope angles (50°–60°) and soil moisture saturation in vulnerable sectors.\n"
        "• High risk detected along NH10 corridor and Teesta River basin during heavy precipitation.\n"
        "• Contact National Disaster Response Helpline 1078 or local emergency control centers for evacuation."
    )

def transcribe_audio(audio_file_path: str) -> Optional[str]:
    api_key = os.getenv("GROQ_API_KEY") or os.getenv("groq_api")
    if not api_key:
        return None

    api_key = api_key.strip().strip('"').strip("'")
    url = "https://api.groq.com/openai/v1/audio/transcriptions"
    headers = {
        "Authorization": f"Bearer {api_key}"
    }

    try:
        with open(audio_file_path, "rb") as f:
            files = {
                "file": (os.path.basename(audio_file_path), f)
            }
            data = {
                "model": WHISPER_MODEL,
                "language": "en",
                "response_format": "json"
            }
            res = requests.post(url, headers=headers, files=files, data=data, timeout=30)
            if res.status_code == 200:
                return res.json().get("text")
            else:
                print(f"Transcription error: {res.status_code} - {res.text}")
    except Exception as e:
        print(f"Error during audio transcription: {e}")

    return None
