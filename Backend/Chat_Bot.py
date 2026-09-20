import os
from pathlib import Path
from dotenv import load_dotenv
from fastapi import APIRouter, HTTPException, File, UploadFile
from Backend.schemas import ChatRequest
import shutil
import tempfile
import sys

# Ensure project root is in path for imports
root_path = str(Path(__file__).resolve().parent.parent)
if root_path not in sys.path:
    sys.path.append(root_path)

# Load environment variables with override enabled to prevent parent environment variables from blocking .env keys
backend_env = Path(__file__).resolve().parent / ".env"
if backend_env.exists():
    load_dotenv(dotenv_path=backend_env, override=True)

ml_env = Path(__file__).resolve().parent.parent / "Ml_models" / ".env"
if ml_env.exists():
    load_dotenv(dotenv_path=ml_env, override=True)

load_dotenv(override=True)

groq_key = os.getenv("GROQ_API_KEY") or os.getenv("groq_api")
if groq_key:
    groq_key = groq_key.strip().strip('"').strip("'")
    os.environ["GROQ_API_KEY"] = groq_key
print(f"DEBUG: Backend/Chat_Bot.py loaded GROQ_API_KEY. Length: {len(os.environ.get('GROQ_API_KEY', ''))}")

router = APIRouter(
    tags=["Chat_Bot"]
)

@router.get("/api/chat-health")
def chat_health():
    return {"status": "ok", "router": "chatbot"}



@router.post("/chatbot")
@router.post("/api/chatbot")
@router.post("/voice")
@router.post("/api/voice")
def chatbot(data: ChatRequest):
    if not data.question or not data.question.strip():
        raise HTTPException(status_code=400, detail="Question cannot be empty")

    user_query = data.question.strip()
    print(f"Chatbot Query: {user_query}")

    try:
        from Ml_models.rag_model import rag_pipeline_answer
        reply = rag_pipeline_answer(user_query)
        print(f"DEBUG: Chatbot reply generated: {reply[:50]}...")
        return {
            "success": True,
            "message": user_query,
            "response": str(reply)
        }
    except Exception as e:
        import traceback
        print(f"ERROR in RAG execution: {e}")
        traceback.print_exc()

    # Fallback response
    return {
        "success": True,
        "message": user_query,
        "response": (
            "Geo Rakshak AI Assistant: I am specialized strictly in landslide risk monitoring, "
            "disaster management, and geological early warnings. Please ask a question related to landslide safety, "
            "shelters, rainfall thresholds, or the Geo Rakshak platform."
        )
    }

@router.post("/voice-chat")
@router.post("/api/voice-chat")
async def voice_chatbot(file: UploadFile = File(...)):
    print(f"DEBUG: Voice chatbot request received. File: {file.filename}")
    if not file:
        raise HTTPException(status_code=400, detail="No audio file provided")

    # Save uploaded file temporarily
    suffix = Path(file.filename).suffix or ".m4a"
    with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
        shutil.copyfileobj(file.file, tmp)
        tmp_path = tmp.name

    try:
        from Ml_models.rag_model import transcribe_audio, rag_pipeline_answer

        # 1. Transcribe audio to text
        transcribed_text = transcribe_audio(tmp_path)
        print(f"Transcribed Text: {transcribed_text}")
        if not transcribed_text or not transcribed_text.strip():
            raise HTTPException(status_code=500, detail="Could not transcribe audio - no speech detected")

        # 2. Get AI response using RAG
        reply = rag_pipeline_answer(transcribed_text)

        return {
            "success": True,
            "transcription": transcribed_text,
            "response": reply
        }
    except Exception as e:
        print(f"Error in voice chat execution: {e}")
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        # Cleanup
        if os.path.exists(tmp_path):
            os.remove(tmp_path)
