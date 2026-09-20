# Replace Coordinates and Generic Location Names in Dashboard

The user wants to replace raw coordinates (e.g., "22.6106, 88.3331") and generic sector names (e.g., "Registered Home Sector", "Current Location") with readable location names (like city and region) in the Dashboard and Weather Snapshot.

## Proposed Changes

### [Frontend/disaster-native]

#### [MODIFY] [DashboardScreen.tsx](file:///C:/Users/sayan/OneDrive/Desktop/sih_project_2026/Frontend/disaster-native/src/screens/dashboard/DashboardScreen.tsx)
- Improve the location resolution logic in `loadDashboard`.
- Add "Registered Home Sector" to the list of generic names that trigger a fallback or update.
- Use `merged.location.coordinates` if available for reverse geocoding.
- Ensure both the header location and the `WeatherSnapshot` location are updated with readable names.
- Enhance the coordinate detection regex to be more robust.
- Add a fallback to IP-based location (from `locationData`) if reverse geocoding of coordinates fails or permissions are missing, but the current name is still a coordinate or generic.

## Verification Plan

### Manual Verification
- Verify that the Dashboard header shows a readable location (e.g., "Kolkata, West Bengal") instead of coordinates.
- Verify that the Weather Snapshot shows the same readable location instead of "Current Location, Registered Home Sector".
- Test with mock coordinates to ensure reverse geocoding is triggered.
