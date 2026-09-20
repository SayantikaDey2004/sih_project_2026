import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const getBaseUrl = () => {
  if (process.env.EXPO_PUBLIC_API_URL) return process.env.EXPO_PUBLIC_API_URL.replace(/\/$/, '');

  // Fallback based on platform
  if (Platform.OS === 'android') return 'http://10.0.2.2:8000';
  return 'http://localhost:8000';
};

const API_BASE_URL = getBaseUrl();
const TOKEN_KEY = 'geo-rakshak:access-token';

export interface ChatResponse {
  success: boolean;
  message: string;
  response: string;
}

async function postToApi(endpoints: string[], message: string): Promise<string> {
  const token = await AsyncStorage.getItem(TOKEN_KEY);
  console.log(`Attempting chat with endpoints: ${endpoints.join(', ')}`);

  const headers: Record<string, string> = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
  let lastError: Error | null = null;
  for (const endpoint of endpoints) {
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers,
        body: JSON.stringify({ question: message }),
      });
      const payload = (await response.json().catch(() => null)) as ChatResponse | { detail?: string } | null;
      if (response.ok && payload && 'response' in payload && payload.success) return payload.response;
      if (!response.ok) {
        const detail = payload && 'detail' in payload ? payload.detail : undefined;
        lastError = new Error(detail || `Server responded with status ${response.status}`);
      }
    } catch (err) {
      console.error(`Fetch failed for ${endpoint}:`, err);
      lastError = new Error(`Connection failed to ${endpoint}. Ensure backend is running at ${API_BASE_URL}`);
    }
  }
  throw lastError || new Error('The assistant returned an invalid response.');
}

export async function sendChatMessage(message: string): Promise<string> {
  const endpoints = [`${API_BASE_URL}/api/chatbot`, `${API_BASE_URL}/chatbot`, `${API_BASE_URL}/api/voice`];
  return postToApi(endpoints, message);
}

export async function sendVoiceMessage(message: string): Promise<string> {
  const endpoints = [`${API_BASE_URL}/api/voice`, `${API_BASE_URL}/voice`, `${API_BASE_URL}/api/chatbot`, `${API_BASE_URL}/chatbot`];
  return postToApi(endpoints, message);
}

export async function sendVoiceAudio(uri: string): Promise<{ transcription: string; response: string }> {
  const token = await AsyncStorage.getItem(TOKEN_KEY);
  const formData = new FormData();

  // Prepare the file object for FormData
  const filename = uri.split('/').pop() || 'recording.m4a';
  const match = /\.(\w+)$/.exec(filename);
  const type = match ? `audio/${match[1]}` : `audio/m4a`;

  // @ts-ignore - React Native FormData expects this structure
  formData.append('file', {
    uri: uri,
    name: filename,
    type: type,
  });

  const response = await fetch(`${API_BASE_URL}/api/voice-chat`, {
    method: 'POST',
    body: formData,
    headers: {
      Accept: 'application/json',
      // Content-Type must NOT be set manually for FormData to work in React Native
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
