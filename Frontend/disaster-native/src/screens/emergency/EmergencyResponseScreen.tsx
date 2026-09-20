import React, { useEffect, useState, useCallback, useMemo } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  RefreshControl, ActivityIndicator,
} from 'react-native';
import { Colors } from '../../theme/colors';
import { getCurrentUser } from '../../services/auth.service';
import { fetchLiveLocation } from '../../services/dashboard.service';
import * as Location from 'expo-location';
import { styles } from './EmergencyResponseScreen.styles';

import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = (process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:8000').replace(/\/$/, '');
const TOKEN_KEY = 'geo-rakshak:access-token';

interface Incident { id: string; title: string; type: string; severity: number; location: string; status: string; time: string }
interface HelpEntry { id: string; name: string; type: string; distance: string; contact: string; available: boolean }
interface Resource { id: string; name: string; type: string; quantity: number; unit: string; location: string }
interface Village { id: string; name: string; population: number; riskLevel: string; evacuated: boolean }
interface InfraItem { id: string; name: string; location: string; status: string; statusDetail: string }
interface FeedItem { id: string; time: string; message: string; type: string }

interface EmergencyData {
  incidents: Incident[];
  helpEntries: HelpEntry[];
  resources: Resource[];
  villages: Village[];
  infrastructure: InfraItem[];
  feed: FeedItem[];
}

async function fetchEmergencyResponse(location?: string): Promise<EmergencyData> {
  const token = await AsyncStorage.getItem(TOKEN_KEY).catch(() => null);
  const url = location
    ? `${API_BASE_URL}/api/emergency-response?location=${encodeURIComponent(location)}`
    : `${API_BASE_URL}/api/emergency-response`;

  const res = await fetch(url, {
    headers: {
      Accept: 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    }
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    throw new Error(errorBody.detail || `Emergency data unavailable (${res.status})`);
  }
  return res.json();
}

const SEV_COLORS = ['#4CAF6D', '#F2C14E', '#EF8A3D', '#E14B3C'];

export default function EmergencyResponseScreen() {
  const [data, setData] = useState<EmergencyData | null>(null);
  const [location, setLocation] = useState('Guwahati');
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sortDesc, setSortDesc] = useState(true);

  useEffect(() => {
    getCurrentUser().then((u) => { if (u?.location) setLocation(u.location); });
  }, []);

  const load = useCallback(async (isRefresh = false) => {
    try {
      if (!isRefresh) { setIsLoading(true); setError(null); }

      // 1. Resolve Location Name
      let resolvedLoc = location;
      const coordRegex = /^-?\d+(\.\d+)?,\s*-?\d+(\.\d+)?$/;
      const genericPlaceholders = ["Current Location", "Registered Home Sector", "Local Sector", "Live Location", "Monitored Zone"];
      const isGeneric = (name: string) => !name || genericPlaceholders.some(p => name.includes(p));

      // Try reverse geocoding if it's a coordinate or generic
      if (coordRegex.test(resolvedLoc) || isGeneric(resolvedLoc)) {
        try {
          const { status } = await Location.requestForegroundPermissionsAsync();
          let lat: number | null = null;
          let lng: number | null = null;

          if (coordRegex.test(resolvedLoc)) {
            const parts = resolvedLoc.split(',').map(s => parseFloat(s.trim()));
            lat = parts[0]; lng = parts[1];
          }

          if (lat !== null && lng !== null) {
            const addresses = await Location.reverseGeocodeAsync({ latitude: lat, longitude: lng });
            if (addresses && addresses.length > 0) {
              const addr = addresses[0];
              resolvedLoc = addr.city || addr.district || addr.region || addr.subregion || addr.name || resolvedLoc;
            }
          }
        } catch (geoErr) {
          console.warn("Emergency Native geocoding failed:", geoErr);
        }
      }

      // IP-based fallback if still generic/coordinate
      if (coordRegex.test(resolvedLoc) || isGeneric(resolvedLoc)) {
        const liveLoc = await fetchLiveLocation().catch(() => null);
        if (liveLoc?.city || liveLoc?.name) {
          resolvedLoc = liveLoc.city || liveLoc.name || resolvedLoc;
        }
      }

      if (resolvedLoc !== location) setLocation(resolvedLoc);

      const d = await fetchEmergencyResponse(location);

      // Resolve coordinates in lists
      if (d) {
        const resolveLoc = async (loc: string) => {
          const trimmed = (loc || "").trim();
          if (!trimmed || !coordRegex.test(trimmed)) return loc;
          try {
            const [lat, lng] = trimmed.split(',').map(s => parseFloat(s.trim()));
            if (!isNaN(lat) && !isNaN(lng)) {
              const addresses = await Location.reverseGeocodeAsync({ latitude: lat, longitude: lng });
              if (addresses && addresses.length > 0) {
                const addr = addresses[0];
                return addr.city || addr.district || addr.region || addr.subregion || addr.name || loc;
              }
            }
          } catch {}
          return loc;
        };

        const [resolvedIncidents, resolvedInfra, resolvedVillages] = await Promise.all([
          Promise.all(d.incidents.map(async inc => ({ ...inc, location: await resolveLoc(inc.location) }))),
          Promise.all(d.infrastructure.map(async inf => ({ ...inf, location: await resolveLoc(inf.location) }))),
          Promise.all(d.villages.map(async v => ({ ...v, name: await resolveLoc(v.name) })))
        ]);

        d.incidents = resolvedIncidents;
        d.infrastructure = resolvedInfra;
        d.villages = resolvedVillages;
      }

      setData(d);
    } catch (err) {
      if (!isRefresh) setError(err instanceof Error ? err.message : 'Failed to load emergency data');
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  }, [location]);

  useEffect(() => { void load(); }, [load]);

  const sortedIncidents = useMemo(() => {
    if (!data) return [];
    return [...data.incidents].sort((a, b) => sortDesc ? b.severity - a.severity : a.severity - b.severity);
  }, [data, sortDesc]);

  if (isLoading) return (
    <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
      <ActivityIndicator size="large" color={Colors.gold} />
      <Text style={styles.loadingText}>Loading emergency response data...</Text>
    </View>
  );

  if (error) return (
    <View style={[styles.container, { padding: 24 }]}>
      <View style={styles.errorCard}>
        <Text style={styles.errorTitle}>Response Data Unavailable</Text>
        <Text style={styles.errorBody}>{error}</Text>
        <TouchableOpacity style={styles.retryBtn} onPress={() => load()}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); void load(true); }} tintColor={Colors.gold} />}
    >
      <View style={styles.content}>
        {/* Page Header */}
        <View style={styles.pageHeader}>
          <Text style={styles.pageLabel}>📍 {location} response network</Text>
          <Text style={styles.pageTitle}>Emergency Response Center</Text>
          <Text style={styles.pageSubtitle}>Coordinate verified emergency information and monitor the response network.</Text>
        </View>

        {/* Incidents */}
        {data && data.incidents.length > 0 && (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Active Incidents</Text>
              <TouchableOpacity style={styles.sortBtn} onPress={() => setSortDesc(!sortDesc)}>
                <Text style={styles.sortBtnText}>{sortDesc ? '↓ Severity' : '↑ Severity'}</Text>
              </TouchableOpacity>
            </View>
            {sortedIncidents.map((inc) => {
              const color = SEV_COLORS[Math.min(inc.severity - 1, SEV_COLORS.length - 1)] ?? Colors.riskModerate;
              return (
                <View key={inc.id} style={styles.incidentRow}>
                  <View style={[styles.incidentSev, { backgroundColor: `${color}22`, borderColor: `${color}55` }]}>
                    <Text style={[styles.incidentSevText, { color }]}>S{inc.severity}</Text>
                  </View>
                  <View style={styles.incidentInfo}>
                    <Text style={styles.incidentTitle}>{inc.title}</Text>
                    <Text style={styles.incidentLocation}>📍 {inc.location}</Text>
                  </View>
                  <View style={styles.incidentStatus}>
                    <Text style={styles.incidentStatusText}>{inc.status}</Text>
                  </View>
                </View>
              );
            })}
          </View>
        )}

        {/* Nearest Help */}
        {data && data.helpEntries.length > 0 && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Nearest Help Units</Text>
            {data.helpEntries.map((h) => (
              <View key={h.id} style={styles.helpRow}>
                <View style={[styles.helpAvail, { backgroundColor: h.available ? 'rgba(76,175,109,0.15)' : 'rgba(239,68,68,0.1)' }]}>
                  <Text style={styles.helpAvailText}>{h.available ? '🟢' : '🔴'}</Text>
                </View>
                <View style={styles.helpInfo}>
                  <Text style={styles.helpName}>{h.name}</Text>
                  <Text style={styles.helpMeta}>{h.type} · {h.distance}</Text>
                </View>
                <Text style={styles.helpContact}>{h.contact}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Resources */}
        {data && data.resources.length > 0 && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Resource Allocation</Text>
            {data.resources.map((r) => (
              <View key={r.id} style={styles.resourceRow}>
                <Text style={styles.resourceName}>{r.name}</Text>
                <Text style={styles.resourceQty}>{r.quantity} {r.unit}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Villages */}
        {data && data.villages.length > 0 && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Village Status</Text>
            {data.villages.map((v) => (
              <View key={v.id} style={styles.villageRow}>
                <Text style={styles.villageName}>{v.name}</Text>
                <Text style={styles.villagePop}>Pop: {v.population}</Text>
                <View style={[styles.villageRiskBadge, { backgroundColor: v.riskLevel === 'High' || v.riskLevel === 'Critical' ? 'rgba(225,75,60,0.15)' : 'rgba(76,175,109,0.12)' }]}>
                  <Text style={[styles.villageRiskText, { color: v.riskLevel === 'High' || v.riskLevel === 'Critical' ? Colors.red : Colors.green }]}>{v.riskLevel}</Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Activity Feed */}
        {data && data.feed.length > 0 && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Activity Feed</Text>
            {data.feed.slice(0, 10).map((item) => (
              <View key={item.id} style={styles.feedRow}>
                <View style={styles.feedDot} />
                <View style={styles.feedInfo}>
                  <Text style={styles.feedMessage}>{item.message}</Text>
                  <Text style={styles.feedTime}>{item.time}</Text>
                </View>
              </View>
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
}
