import React, { useState, useEffect } from 'react';
import {
  View, Text, TouchableOpacity,
  ScrollView, ActivityIndicator,
} from 'react-native';
import MapView, { Marker, Circle, Callout } from 'react-native-maps';
import * as Location from 'expo-location';
import { Colors } from '../../theme/colors';
import { useMapData } from '../../hooks/useMapData';
import { styles } from './RiskMapScreen.styles';

const RISK_COLORS: Record<string, string> = {
  critical: '#E14B3C',
  high: '#EF8A3D',
  moderate: '#F2C14E',
  low: '#4CAF6D',
};

export default function RiskMapScreen() {
  const { data, isLoading, error } = useMapData();
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [selectedLayer, setSelectedLayer] = useState<'zones' | 'villages' | 'hospitals' | 'sensors'>('zones');
  const [region, setRegion] = useState({
    latitude: 26.1445,
    longitude: 91.7362,
    latitudeDelta: 1.5,
    longitudeDelta: 1.5,
  });

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
        setUserLocation({ lat: loc.coords.latitude, lng: loc.coords.longitude });
        setRegion({
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
          latitudeDelta: 0.8,
          longitudeDelta: 0.8,
        });
      }
    })();
  }, []);

  const handleLocateMe = () => {
    if (userLocation) {
      setRegion({
        latitude: userLocation.lat,
        longitude: userLocation.lng,
        latitudeDelta: 0.3,
        longitudeDelta: 0.3,
      });
    }
  };

  const layers = [
    { key: 'zones', label: '🗺 Risk Zones' },
    { key: 'villages', label: '🏘 Villages' },
    { key: 'hospitals', label: '🏥 Hospitals' },
    { key: 'sensors', label: '📡 Sensors' },
  ];

  return (
    <View style={styles.container}>
      {isLoading && (
        <View style={styles.overlay}>
          <ActivityIndicator size="large" color={Colors.gold} />
          <Text style={styles.overlayText}>Loading live risk data...</Text>
        </View>
      )}

      {error && !isLoading && (
        <View style={[styles.overlay, styles.errorOverlay]}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      <MapView
        style={styles.map}
        region={region}
        onRegionChangeComplete={setRegion}
        showsUserLocation
        showsMyLocationButton={false}
        mapType="hybrid"
      >
        {/* Risk Zone Circles */}
        {selectedLayer === 'zones' && data?.zones.map((zone) => (
          <React.Fragment key={zone.id}>
            <Circle
              center={{ latitude: zone.center.lat, longitude: zone.center.lng }}
              radius={(zone.radius ?? 2000)}
              strokeColor={RISK_COLORS[(zone.riskLevel ?? 'moderate').toLowerCase()] ?? Colors.riskModerate}
              fillColor={`${RISK_COLORS[(zone.riskLevel ?? 'moderate').toLowerCase()] ?? Colors.riskModerate}30`}
              strokeWidth={2}
            />
            <Marker
              coordinate={{ latitude: zone.center.lat, longitude: zone.center.lng }}
              pinColor={RISK_COLORS[(zone.riskLevel ?? 'moderate').toLowerCase()] ?? Colors.riskModerate}
            >
              <Callout>
                <View style={styles.callout}>
                  <Text style={styles.calloutTitle}>{zone.name}</Text>
                  <Text style={styles.calloutSub}>{zone.riskLevel ?? 'Risk Zone'}</Text>
                  {zone.description && <Text style={styles.calloutDesc}>{zone.description}</Text>}
                </View>
              </Callout>
            </Marker>
          </React.Fragment>
        ))}

        {/* Villages */}
        {selectedLayer === 'villages' && data?.villages.map((v) => (
          <Marker
            key={v.id}
            coordinate={{ latitude: v.coordinate.lat, longitude: v.coordinate.lng }}
            title={v.name}
            description={`Population: ${v.population ?? 'Unknown'}`}
            pinColor="#3b82f6"
          />
        ))}

        {/* Hospitals */}
        {selectedLayer === 'hospitals' && data?.hospitals.map((h) => (
          <Marker
            key={h.id}
            coordinate={{ latitude: h.coordinate.lat, longitude: h.coordinate.lng }}
            title={h.name}
            description={h.phone ?? 'Emergency services'}
            pinColor="#4CAF6D"
          />
        ))}

        {/* Sensors */}
        {selectedLayer === 'sensors' && data?.sensors.map((s) => (
          <Marker
            key={s.id}
            coordinate={{ latitude: s.coordinate.lat, longitude: s.coordinate.lng }}
            title={s.name}
            pinColor={Colors.gold}
          />
        ))}
      </MapView>

      {/* Layer Selector */}
      <View style={styles.layerBar}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.layerScroll}>
          {layers.map((l) => (
            <TouchableOpacity
              key={l.key}
              style={[styles.layerChip, selectedLayer === l.key && styles.layerChipActive]}
              onPress={() => setSelectedLayer(l.key as any)}
            >
              <Text style={[styles.layerChipText, selectedLayer === l.key && styles.layerChipTextActive]}>
                {l.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Locate Me Button */}
      <TouchableOpacity style={styles.locateBtn} onPress={handleLocateMe}>
        <Text style={styles.locateBtnText}>📍 My Location</Text>
      </TouchableOpacity>

      {/* Legend */}
      <View style={styles.legend}>
        {Object.entries(RISK_COLORS).map(([level, color]) => (
          <View key={level} style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: color }]} />
            <Text style={styles.legendLabel}>{level.charAt(0).toUpperCase() + level.slice(1)}</Text>
          </View>
        ))}
      </View>

      {/* Data timestamp */}
      {data && (
        <View style={styles.timestampBadge}>
          <View style={styles.timestampDot} />
          <Text style={styles.timestampText}>Live · {data.zones.length} monitored zones</Text>
        </View>
      )}
    </View>
  );
}
