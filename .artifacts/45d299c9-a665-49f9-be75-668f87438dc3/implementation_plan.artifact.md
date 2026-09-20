# Replace "Current Sector" and Generic Names in Emergency Lists

The user is seeing "Current Sector" or generic names in the incident board and other lists on the Emergency Response page. I will update the frontend to resolve these generic placeholders into the actual city name that was resolved for the header.

## Proposed Changes

### [Frontend/disaster] (Web)

#### [MODIFY] [EmergencyResponse.tsx](file:///C:/Users/sayan/OneDrive/Desktop/sih_project_2026/Frontend/disaster/src/pages/EmergencyResponse.tsx)
- Enhance the `resolveLoc` helper function.
- In addition to resolving coordinates via Nominatim, it will now detect generic placeholders like "Current Sector", "Local Sector", "Current Location", etc.
- If a generic placeholder is detected, it will be replaced with the `resolvedName` (the city name resolved for the header).
- Apply this replacement to:
    - `incidents`: title, name, location
    - `infrastructure`: name, location
    - `helpEntries`: title, name, location
    - `villages`: name
- This ensures the entire page uses the same specific location name.

### [Frontend/disaster-native] (Native)

#### [MODIFY] [EmergencyResponseScreen.tsx](file:///C:/Users/sayan/OneDrive/Desktop/sih_project_2026/Frontend/disaster-native/src/screens/emergency/EmergencyResponseScreen.tsx)
- Implement similar placeholder replacement logic in the `resolveLoc` helper.
- Ensure "Current Sector" and other generic strings are replaced by the resolved city name.

## Verification Plan

### Manual Verification
- Open the Emergency Response page.
- Verify that the incident titles now say "Kolkata: Saturation Alert Zone" (or your city) instead of "Current Sector: ...".
- Verify that village names and infrastructure also reflect the real city name.
