import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  RefreshControl, ActivityIndicator, Linking, Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import * as Location from 'expo-location';
import { Colors } from '../../theme/colors';
import {
  fetchDashboard, fetchLiveWeather, fetchLiveEarthquakes,
  fetchLiveLocation, fetchLiveDiseases, Dashboard,
} from '../../services/dashboard.service';
import { submitIncidentReport } from '../../services/incident.service';
import { sendSOS } from '../../services/sos.service';
import { getCurrentUser } from '../../services/auth.service';
import useAlertWebSocket from '../../hooks/useDisasterWebSocket';
import DisasterAlertBanner from '../../components/DisasterAlertBanner';
import SOSButton from '../../components/SOSButton';
import RiskSummary from '../../components/RiskSummary';
import WeatherSnapshot from '../../components/WeatherSnapshot';
import IncidentReportForm from '../../components/IncidentReportForm';
import { styles } from './DashboardScreen.styles';

type SOSState = 'idle' | 'loading' | 'success' | 'error';

export default function DashboardScreen() {
  const router = useRouter();
  const { disasterMessage, clearMessage } = useAlertWebSocket();
  const [dashboard, setDashboard] = useState<Dashboard | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sosState, setSOSState] = useState<SOSState>('idle');
  const [userName, setUserName] = useState('');

  const getDynamicGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    if (hour < 21) return 'Good evening';
    return 'Good night';
  };

  useEffect(() => {
    getCurrentUser().then((u) => {
      if (u && u.name) {
        setUserName(u.name.split(' ')[0]);
      }
    });
  }, []);

  const loadDashboard = useCallback(async (isRefresh = false) => {
    try {
      if (!isRefresh) { setIsLoading(true); setError(null); }

      // Added individual catch handlers to prevent any sub-endpoint structure anomalies from throwing a global page failure
      const [baseData, weatherData, earthquakesData, locationData, diseaseData] = await Promise.all([
        fetchDashboard().catch(err => { console.error("baseData failed:", err); throw err; }),
        fetchLiveWeather().catch(() => null),
        fetchLiveEarthquakes().catch(() => null),
        fetchLiveLocation().catch(() => null),
        fetchLiveDiseases().catch(() => null),
      ]);

      const merged: Dashboard = {
        ...baseData,
        diseases: diseaseData?.activeCases !== undefined ? diseaseData : (baseData.diseases || { activeCases: 0, alerts: [] }),
        weather: {
          ...baseData.weather,
          stats: { rainfall: "0.0 mm", humidity: "60%", windGust: "12 km/h", ...(baseData.weather?.stats || {}) },
          forecast: [...(baseData.weather?.forecast || [])]
        },
        risk: {
          ...baseData.risk,
          counts: [...(baseData.risk?.counts || [])],
          zones: [...(baseData.risk?.zones || [])]
        },
      };

      // Set user name from dashboard if not already set
      const dashUser = baseData.user?.name || '';
      if (dashUser && !userName) {
        setUserName(dashUser.split(' ')[0]);
      }


      if (weatherData?.Current_weather) {
        const cw = weatherData.Current_weather;
        if (typeof cw.temperature_2m === 'number') merged.weather.temperature = Math.round(cw.temperature_2m);
        const rainAmount = cw.rain ?? cw.precipitation ?? cw.showers ?? 0;
        merged.weather.stats.rainfall = `${rainAmount.toFixed(1)} mm`;
        const windAmount = cw.wind_gusts_10m ?? cw.wind_speed_10m ?? 0;
        merged.weather.stats.windGust = `${Math.round(windAmount)} km/h`;
        merged.weather.currentDay = `Today · Live Sensor Feed`;
        if (rainAmount > 10) { merged.weather.condition = 'Heavy Rainfall'; merged.weather.conditionIcon = '🌧'; }
        else if (rainAmount > 2) { merged.weather.condition = 'Moderate Rainfall'; merged.weather.conditionIcon = '🌧'; }
        else if (rainAmount > 0) { merged.weather.condition = 'Light Rain / Showers'; merged.weather.conditionIcon = '🌦'; }
        else if (merged.weather.temperature >= 30) { merged.weather.condition = 'Warm & Clear'; merged.weather.conditionIcon = '☀️'; }
        else { merged.weather.condition = 'Clear & Mild'; merged.weather.conditionIcon = '🌤'; }
      }

      if (earthquakesData?.reports) {
        const reports = earthquakesData.reports;
        if (typeof reports === 'object' && reports !== null && Object.keys(reports).length > 0) {
          const topEvent = Object.entries(reports)[0];
          merged.weather.stormAlert = `🚨 Live USGS Alert: M${topEvent[1]} earthquake near ${topEvent[0]}`;
        } else {
          merged.weather.stormAlert = `USGS Seismic Monitor: No recent earthquakes in 500km radius`;
        }
      }

      // Priority Logic: Use signup location from baseData/backend.
      // If the location is raw coordinates (from GPS signup), reverse geocode it for display name.
      const signupLocName = (merged.location?.name || "").trim();
      const signupLocRegion = (merged.location?.region || "").trim();
      const weatherLoc = (merged.weather?.location || "").trim();

      // Detection flags
      const coordRegex = /^-?\d+(\.\d+)?,\s*-?\d+(\.\d+)?$/;
      const isCoordinate = coordRegex.test(signupLocName);
      const genericPlaceholders = ["Current Location", "Registered Home Sector", "Local Sector", "Live Location", "Monitored Zone"];
      const isGeneric = (name: string) => !name || genericPlaceholders.some(p => name.includes(p));

      if (isCoordinate) {
        try {
          await Location.requestForegroundPermissionsAsync();
          const [lat, lng] = signupLocName.split(',').map(s => parseFloat(s.trim()));

          if (!isNaN(lat) && !isNaN(lng)) {
            const addresses = await Location.reverseGeocodeAsync({ latitude: lat, longitude: lng });
            if (addresses && addresses.length > 0) {
              const addr = addresses[0];
              const readableCity = addr.city || addr.district || addr.region || addr.subregion || addr.name || "My Location";
              const readableRegion = addr.region || addr.country || "Monitored Zone";
              if (merged.location) {
                merged.location.name = readableCity;
                merged.location.region = readableRegion;
              }
              if (merged.weather) {
                merged.weather.location = `${readableCity}, ${readableRegion}`;
              }
            }
          }
        } catch (geoErr) {
          console.warn("Dashboard reverse geocoding failed:", geoErr);
        }
      }

      // Final check: if we still have generic or coordinate-based names, try IP-based location fallback
      const currentName = merged.location.name;
      const currentRegion = merged.location.region;
      const currentWeatherLoc = merged.weather.location;

      if ((isCoordinate || isGeneric(currentName) || isGeneric(currentRegion) || isGeneric(currentWeatherLoc)) &&
          (locationData?.city || locationData?.name)) {
        const locCity = locationData.city || locationData.name || "Local Sector";
        const locRegion = locationData.full_region || locationData.region || "Monitored Zone";

        if (isCoordinate || isGeneric(currentName)) merged.location.name = locCity;
        if (isGeneric(currentRegion)) merged.location.region = locRegion;
        if (isGeneric(currentWeatherLoc)) merged.weather.location = `${locCity}, ${locRegion}`;
      }
      setDashboard(merged);
    } catch (err) {
      console.error("Dashboard global payload error:", err);
      if (!isRefresh) setError(err instanceof Error ? err.message : 'Failed to load dashboard');
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    void loadDashboard();
    const interval = setInterval(() => void loadDashboard(true), 30000);
    return () => clearInterval(interval);
  }, [loadDashboard]);

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    void loadDashboard(true);
  }, [loadDashboard]);

  const handleSOS = async () => {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);

    // Emergency number for Landslide Disaster Helpline
    const phoneNumber = '1078';
    const phoneUrl = Platform.OS === 'android' ? `tel:${phoneNumber}` : `telprompt:${phoneNumber}`;

    try {
      setSOSState('loading');
      // Direct call to openURL is more reliable for 'tel:' intents on Android 11+
      await Linking.openURL(phoneUrl);
      setSOSState('success');
      setTimeout(() => setSOSState('idle'), 3000);
    } catch (err) {
      console.error('Error opening emergency dialer:', err);
      setSOSState('error');
      setTimeout(() => setSOSState('idle'), 3000);
    }
  };

  const handleIncidentSubmit = async (data: { location: string; disasterType: string; description?: string }) => {
    try {
      const response = await submitIncidentReport({
        location: data.location, disasterType: data.disasterType,
        description: data.description, timestamp: new Date().toISOString(),
      });
      return { success: response.success, message: response.message };
    } catch (error) {
      return { success: false, message: error instanceof Error ? error.message : 'Failed to submit' };
    }
  };

  if (isLoading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={Colors.gold} />
        <Text style={styles.loadingText}>Loading dashboard...</Text>
      </View>
    );
  }

  if (error || !dashboard) {
    return (
      <View style={[styles.container, styles.centered]}>
        <View style={styles.errorCard}>
          <Text style={styles.errorTitle}>Unable to Load Dashboard</Text>
          <Text style={styles.errorBody}>{error || 'An unknown error occurred.'}</Text>
          <TouchableOpacity style={styles.retryBtn} onPress={() => loadDashboard()}>
            <Text style={styles.retryText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <>
      {disasterMessage && (
        <DisasterAlertBanner message={disasterMessage} onDismiss={clearMessage} />
      )}
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor={Colors.gold} />}
      >
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.headerRow}>
            <View>
              <Text style={styles.greeting}>{getDynamicGreeting()}, {userName || 'Explorer'}</Text>
              <View style={styles.locationRow}>
                <Text style={styles.locationText}>📍 {dashboard.location.name} — {dashboard.location.region}</Text>
                <View style={styles.syncBadge}>
                  <View style={styles.syncDot} />
                  <Text style={styles.syncText}>Live synced {dashboard.lastSyncMinutesAgo}m ago</Text>
                </View>
              </View>
            </View>
            <TouchableOpacity style={styles.aiBtn} onPress={() => router.push('/(app)/landslide-risk')}>
              <Text style={styles.aiBtnText}>⚡ AI Risk</Text>
            </TouchableOpacity>
          </View>

          {/* SOS Button */}
          <SOSButton state={sosState} onTap={handleSOS} disabled={isLoading} />

          {/* Risk & Weather */}
          <RiskSummary data={dashboard.risk} />
          <View style={styles.spacer} />
          <WeatherSnapshot data={dashboard.weather} />
          <View style={styles.spacer} />

          {/* Incident Form */}
          <IncidentReportForm
            disasterTypes={dashboard.disasterTypes}
            onSubmit={handleIncidentSubmit}
            isLoading={isLoading}
          />
        </View>
      </ScrollView>
    </>
  );
}
