import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';

const API_BASE_URL = (process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:8000').replace(/\/$/, '');
const TOKEN_KEY = 'geo-rakshak:access-token';

export interface SOSResponse {
  success: boolean;
  message: string;
  teamAssigned?: boolean;
  eta?: string;
}

const getUserLocation = async (): Promise<{ lat: number; lng: number; accuracy?: number }> => {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') return { lat: 26.1445, lng: 91.7362, accuracy: 50 };
    const location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
    return { lat: location.coords.latitude, lng: location.coords.longitude, accuracy: location.coords.accuracy ?? 50 };
  } catch {
    return { lat: 26.1445, lng: 91.7362, accuracy: 50 };
  }
};

export const sendSOS = async (): Promise<SOSResponse> => {
  try {
    const location = await getUserLocation();
    const token = await AsyncStorage.getItem(TOKEN_KEY);
    const response = await fetch(`${API_BASE_URL}/api/sos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ location, timestamp: Date.now() }),
    });
    if (!response.ok) throw new Error(`SOS request failed with status ${response.status}`);
    return (await response.json()) as SOSResponse;
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to send SOS. Call 1078 directly.',
    };
  }
};
