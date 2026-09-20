import { Geolocation } from '@capacitor/geolocation';

export async function getCurrentCoordinates(): Promise<string | null> {
  try {
    const permissions = await Geolocation.checkPermissions();
    if (permissions.location !== 'granted') {
      const request = await Geolocation.requestPermissions();
      if (request.location !== 'granted') {
        console.warn("Location permission denied");
        return null;
      }
    }

    const position = await Geolocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 15000,
    });

    const { latitude, longitude } = position.coords;
    console.log(`Capacitor GPS Success: ${latitude}, ${longitude}`);
    return `${latitude},${longitude}`;
  } catch (error) {
    console.error("Capacitor Geolocation error:", error);
    return null;
  }
}
