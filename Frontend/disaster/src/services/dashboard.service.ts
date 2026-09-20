/**
 * Dashboard Service - Data Fetching
 * 
 * Directly connects to backend dashboard endpoints:
 * - GET /api/dashboard (Base payload)
 * - GET /api/dashboard/weather (Live severe weather from Open-Meteo)
 * - GET /api/dashboard/earth_quakes (Live earthquakes from USGS)
 * - GET /location (Live IP geolocation)
 * - GET /api/dashboard/profile (User profile)
 */

import type { Dashboard, DashboardLoadingState } from "../@types/interface/dashboard";

const API_BASE_URL = (import.meta.env.VITE_API_URL ?? "http://localhost:8000").replace(/\/$/, "");

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

/**
 * Fetch base dashboard: @dashboard_router.get("") -> /api/dashboard
 */
export const fetchDashboard = async (location?: string): Promise<Dashboard> => {
  const token = localStorage.getItem("geo-rakshak:access-token");
  const url = new URL(`${API_BASE_URL}/api/dashboard`);
  if (location) {
    url.searchParams.append("location", location);
  }

  const response = await fetch(url.toString(), {
    headers: {
      Accept: "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error(`Failed to load dashboard (${response.status})`);
  }

  return (await response.json()) as Dashboard;
};

/**
 * Fetch live weather: @dashboard_router.get("/weather") -> /api/dashboard/weather
 */
export const fetchLiveWeather = async (): Promise<LiveWeatherResponse> => {
  const token = localStorage.getItem("geo-rakshak:access-token");
  try {
    const response = await fetch(`${API_BASE_URL}/api/dashboard/weather`, {
      headers: {
        Accept: "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      credentials: "include",
    });
    if (!response.ok) return {};
    return (await response.json()) as LiveWeatherResponse;
  } catch {
    return {};
  }
};

/**
 * Fetch live earthquakes: @dashboard_router.get("/earth_quakes") -> /api/dashboard/earth_quakes
 */
export const fetchLiveEarthquakes = async (): Promise<LiveEarthquakesResponse> => {
  const token = localStorage.getItem("geo-rakshak:access-token");
  try {
    const response = await fetch(`${API_BASE_URL}/api/dashboard/earth_quakes`, {
      headers: {
        Accept: "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      credentials: "include",
    });
    if (!response.ok) return {};
    return (await response.json()) as LiveEarthquakesResponse;
  } catch {
    return {};
  }
};

export interface LiveLocationResponse {
  location?: string;
  city?: string;
  region?: string;
  country?: string;
  name?: string;
  full_region?: string;
}

/**
 * Fetch live user location coordinates: @app.get("/location") -> /location
 */
export const fetchLiveLocation = async (location?: string): Promise<LiveLocationResponse> => {
  try {
    const url = new URL(`${API_BASE_URL}/location`);
    if (location) {
      url.searchParams.append("location", location);
    }
    const response = await fetch(url.toString(), {
      headers: { Accept: "application/json" },
    });
    if (!response.ok) return {};
    return (await response.json()) as LiveLocationResponse;
  } catch {
    return {};
  }
};

/**
 * Fetch live nearby diseases & health metrics: @dashboard_router.get("/diseases") -> /api/dashboard/diseases
 */
export const fetchLiveDiseases = async (): Promise<any> => {
  const token = localStorage.getItem("geo-rakshak:access-token");
  try {
    const response = await fetch(`${API_BASE_URL}/api/dashboard/diseases`, {
      headers: {
        Accept: "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      credentials: "include",
    });
    if (!response.ok) return {};
    return await response.json();
  } catch {
    return {};
  }
};

/**
 * Create initial loading state
 */
export const createLoadingState = (): DashboardLoadingState => ({
  isLoading: true,
  error: null,
  isEmpty: false,
});

/**
 * Create error state
 */
export const createErrorState = (message: string): DashboardLoadingState => ({
  isLoading: false,
  error: message,
  isEmpty: false,
});

/**
 * Create success state
 */
export const createSuccessState = (): DashboardLoadingState => ({
  isLoading: false,
  error: null,
  isEmpty: false,
});
