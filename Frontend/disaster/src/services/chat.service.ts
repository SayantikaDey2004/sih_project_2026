export interface ChatResponse {
  success: boolean;
  message: string;
  response: string;
}

const API_BASE_URL = (import.meta.env.VITE_API_URL ?? "http://localhost:8000").replace(/\/$/, "");
console.log("Chat Service API URL:", API_BASE_URL);

async function postToApi(endpoints: string[], message: string): Promise<string> {
  const token = localStorage.getItem("geo-rakshak:access-token");
  const headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  let lastError: Error | null = null;

  for (const endpoint of endpoints) {
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers,
        body: JSON.stringify({ question: message }),
      });

      const payload = (await response.json().catch(() => null)) as ChatResponse | { detail?: string } | null;
      if (response.ok && payload && "response" in payload && payload.success) {
        return payload.response;
      }

      if (!response.ok) {
        const detail = payload && "detail" in payload ? payload.detail : undefined;
        lastError = new Error(detail || `Server responded with status ${response.status}`);
      }
    } catch (err) {
      console.error(`Fetch failed for ${endpoint}:`, err);
      // More descriptive error for the UI
      lastError = err instanceof Error ? err : new Error(`Network error: Check if backend is live at ${API_BASE_URL}`);
    }
  }

  throw lastError || new Error("The assistant returned an invalid response.");
}

export async function sendChatMessage(message: string): Promise<string> {
  const endpoints = [
    `${API_BASE_URL}/api/chatbot`,
    `${API_BASE_URL}/chatbot`,
    `${API_BASE_URL}/api/voice`,
  ];
  return postToApi(endpoints, message);
}

export async function sendVoiceMessage(message: string): Promise<string> {
  const endpoints = [
    `${API_BASE_URL}/api/voice`,
    `${API_BASE_URL}/voice`,
    `${API_BASE_URL}/api/chatbot`,
    `${API_BASE_URL}/chatbot`,
  ];
  return postToApi(endpoints, message);
}

export async function sendVoiceAudio(blob: Blob): Promise<{ transcription: string; response: string }> {
  const token = localStorage.getItem("geo-rakshak:access-token");
  const formData = new FormData();
  const ext = blob.type.includes("mp4") ? "mp4" : blob.type.includes("ogg") ? "ogg" : blob.type.includes("wav") ? "wav" : "webm";
  formData.append("file", blob, `recording.${ext}`);

  const response = await fetch(`${API_BASE_URL}/api/voice-chat`, {
    method: "POST",
    body: formData,
    headers: {
      Accept: "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || `Server error: ${response.status}`);
  }

  const result = await response.json();
  return {
    transcription: result.transcription,
    response: result.response,
  };
}
