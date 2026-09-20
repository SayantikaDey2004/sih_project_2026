import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = (process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:8000').replace(/\/$/, '');
const TOKEN_KEY = 'geo-rakshak:access-token';

export interface IncidentReport {
  location: string;
  disasterType: string | null;
  description?: string;
  timestamp?: string;
}

export interface IncidentReportResponse {
  success: boolean;
  message: string;
  incidentId?: string;
  teamNotified?: boolean;
}

export const submitIncidentReport = async (data: IncidentReport): Promise<IncidentReportResponse> => {
  const token = await AsyncStorage.getItem(TOKEN_KEY);
  const response = await fetch(`${API_BASE_URL}/api/incidents`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(data),
  });
  const payload = (await response.json().catch(() => null)) as (IncidentReportResponse & { detail?: string }) | null;
  if (!response.ok) {
    const detail = payload && 'detail' in payload ? payload.detail : undefined;
    throw new Error(detail || `Failed to submit incident report (${response.status})`);
  }
  if (!payload || typeof payload !== 'object') throw new Error('Invalid response received.');
  return payload;
};
