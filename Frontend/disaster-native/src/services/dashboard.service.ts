import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = (process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:8000').replace(/\/$/, '');
const TOKEN_KEY = 'geo-rakshak:access-token';

export interface LiveWeatherResponse {
  Current_weather?: {
    time?: string;
    interval?: number;
    temperature_2m?: number;
    precipitation?: number;
    rain?: number;
    showers?: number;
    wind_speed_10m?: number;
    wind_gusts_10m?: number;
  };
}

export interface LiveEarthquakesResponse {
  reports?: Record<string, number> | string;
}

export interface LiveLocationResponse {
  location?: string;
  city?: string;
  region?: string;
  country?: string;
  name?: string;
  full_region?: string;
}

export interface Dashboard {
  user: { id: string; name: string; role: string; avatar: string };
  location: { name: string; region: string; coordinates?: { lat: number; lng: number } };
  risk: {
    currentLevel: string;
    message: string;
    zoneCount: number;
    counts: { level: string; label: string; count: number }[];
    zones: { id: string; level: string; label: string; name: string; description: string; distance: string }[];
  };
  weather: {
    location: string;
    currentDay: string;
    temperature: number;
    condition: string;
    conditionIcon: string;
    stats: { rainfall: string; humidity: string; windGust: string };
    stormAlert: string | null;
    forecast: { day: string; icon: string; temps: string }[];
  };
  diseases?: any;
  disasterTypes: { type: string; icon: string }[];
  lastSyncTime: string;
  lastSyncMinutesAgo: number;
}

async function getHeaders(): Promise<Record<string, string>> {
  const token = await AsyncStorage.getItem(TOKEN_KEY);
  return {
    Accept: 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export const fetchDashboard = async (): Promise<Dashboard> => {
  const headers = await getHeaders();
  const response = await fetch(`${API_BASE_URL}/api/dashboard`, { headers });
  if (!response.ok) throw new Error(`Failed to load dashboard (${response.status})`);
  return (await response.json()) as Dashboard;
};

export const fetchLiveWeather = async (): Promise<LiveWeatherResponse> => {
  try {
    const headers = await getHeaders();
    const response = await fetch(`${API_BASE_URL}/api/dashboard/weather`, { headers });
    if (!response.ok) return {};
    return (await response.json()) as LiveWeatherResponse;
  } catch { return {}; }
};

export const fetchLiveEarthquakes = async (): Promise<LiveEarthquakesResponse> => {
  try {
    const headers = await getHeaders();
    const response = await fetch(`${API_BASE_URL}/api/dashboard/earth_quakes`, { headers });
    if (!response.ok) return {};
    return (await response.json()) as LiveEarthquakesResponse;
  } catch { return {}; }
};

export const fetchLiveLocation = async (): Promise<LiveLocationResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/location`, { headers: { Accept: 'application/json' } });
    if (!response.ok) return {};
    return (await response.json()) as LiveLocationResponse;
  } catch { return {}; }
};

export const fetchLiveDiseases = async (): Promise<any> => {
  try {
    const headers = await getHeaders();
    const response = await fetch(`${API_BASE_URL}/api/dashboard/diseases`, { headers });
    if (!response.ok) return {};
    return await response.json();
  } catch { return {}; }
};
