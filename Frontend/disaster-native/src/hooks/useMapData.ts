import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = (process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:8000').replace(/\/$/, '');

export interface MapZone {
  id: string; name: string; riskLevel?: string; type?: string;
  center: { lat: number; lng: number }; radius?: number; description?: string;
}
export interface MapVillage {
  id: string; name: string; population?: number; coordinate: { lat: number; lng: number };
}
export interface MapHospital {
  id: string; name: string; phone?: string; coordinate: { lat: number; lng: number };
}
export interface MapSensor {
  id: string; name: string; coordinate: { lat: number; lng: number };
}
export interface MapRoad {
  id: string; name: string; riskLevel?: string;
  geometry?: { coordinates: number[][] };
}
export interface MapData {
  zones: MapZone[]; villages: MapVillage[]; hospitals: MapHospital[];
  sensors: MapSensor[]; roads: MapRoad[]; receivedAt: string;
}

const FALLBACK_DATA: MapData = {
  zones: [
    { id: 'zone1', name: 'Sonapur Ridge', riskLevel: 'High', type: 'Landslide Zone', center: { lat: 26.1445, lng: 91.8900 }, radius: 2500 },
    { id: 'zone2', name: 'Kamrup Flood Zone', riskLevel: 'Moderate', type: 'Flood Zone', center: { lat: 26.0700, lng: 91.6500 }, radius: 3000 },
    { id: 'zone3', name: 'Dispur Seismic Zone', riskLevel: 'Low', type: 'Seismic Zone', center: { lat: 26.1444, lng: 91.7362 }, radius: 1500 },
  ],
  villages: [
    { id: 'v1', name: 'Hengrabari', population: 4200, coordinate: { lat: 26.1300, lng: 91.7800 } },
    { id: 'v2', name: 'Kahilipara', population: 7800, coordinate: { lat: 26.1100, lng: 91.7400 } },
  ],
  hospitals: [
    { id: 'h1', name: 'GMCH Guwahati', phone: '0361-2529457', coordinate: { lat: 26.1900, lng: 91.7500 } },
    { id: 'h2', name: 'Dispur Polyclinic', phone: '0361-2226899', coordinate: { lat: 26.1420, lng: 91.7810 } },
  ],
  sensors: [
    { id: 's1', name: 'Rainfall Gauge – NW Sector', coordinate: { lat: 26.1600, lng: 91.8200 } },
    { id: 's2', name: 'Slope Monitor – Sonapur', coordinate: { lat: 26.1300, lng: 91.9000 } },
  ],
  roads: [],
  receivedAt: new Date().toISOString(),
};

export function useMapData() {
  const [data, setData] = useState<MapData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    const load = async () => {
      setIsLoading(true);
      try {
        const token = await AsyncStorage.getItem('geo-rakshak:access-token');
        const headers: Record<string, string> = { Accept: 'application/json' };
        if (token) headers.Authorization = `Bearer ${token}`;
        const response = await fetch(`${API_BASE_URL}/api/map-data`, { headers });
        if (!response.ok) throw new Error(`Map data fetch failed (${response.status})`);
        const raw = await response.json() as MapData;
        if (active) setData({ ...raw, receivedAt: new Date().toISOString() });
      } catch {
        // Use fallback data if API not available
        if (active) setData(FALLBACK_DATA);
      } finally {
        if (active) { setIsLoading(false); }
      }
    };
    void load();
    return () => { active = false; };
  }, []);

  return { data, isLoading, error };
}
