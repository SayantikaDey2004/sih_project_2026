import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Colors } from '../theme/colors';

interface WeatherData {
  location: string;
  currentDay: string;
  temperature: number;
  condition: string;
  conditionIcon: string;
  stats: { rainfall: string; humidity: string; windGust: string };
  stormAlert: string | null;
  forecast: { day: string; icon: string; temps: string }[];
}

export default function WeatherSnapshot({ data }: { data: WeatherData }) {
  return (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerLabel}>Weather Conditions</Text>
          <Text style={styles.locationText}>{data.location} · {data.currentDay}</Text>
        </View>
        <Text style={styles.conditionIcon}>{data.conditionIcon}</Text>
      </View>

      {/* Temperature */}
      <Text style={styles.temperature}>{data.temperature}°</Text>
      <View style={styles.conditionRow}>
        <Text style={styles.conditionEmoji}>{data.conditionIcon}</Text>
        <Text style={styles.condition}>{data.condition}</Text>
      </View>

      {/* Stats */}
      <View style={styles.statsRow}>
        <StatCard label="Rainfall" value={data.stats.rainfall} />
        <StatCard label="Humidity" value={data.stats.humidity} />
        <StatCard label="Wind gust" value={data.stats.windGust} />
      </View>

      {/* Storm Alert */}
      {data.stormAlert && (
        <View style={styles.alertBanner}>
          <Text style={styles.alertIcon}>⚠</Text>
          <Text style={styles.alertText} numberOfLines={2}>{data.stormAlert}</Text>
        </View>
      )}

      {/* Forecast */}
      <View style={styles.forecastDivider} />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.forecastScroll}>
        {data.forecast.map((day) => (
          <View key={day.day} style={styles.forecastDay}>
            <Text style={styles.forecastDayLabel}>{day.day}</Text>
            <Text style={styles.forecastDayIcon}>{day.icon}</Text>
            <Text style={styles.forecastTemps}>{day.temps}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.statCard}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: 'rgba(16,36,25,0.87)', borderRadius: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', padding: 18 },
  header: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 12 },
  headerLabel: { fontSize: 11, fontWeight: '700', color: Colors.goldLight, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 3 },
  locationText: { fontSize: 12, color: Colors.textSecondary },
  conditionIcon: { fontSize: 30 },
  temperature: { fontSize: 52, fontWeight: '800', color: Colors.textPrimary, letterSpacing: -2, marginBottom: 2 },
  conditionRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 16 },
  conditionEmoji: { fontSize: 16 },
  condition: { fontSize: 13, fontWeight: '500', color: Colors.textSecondary },
  statsRow: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  statCard: { flex: 1, backgroundColor: 'rgba(23,49,35,0.8)', borderRadius: 14, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', padding: 12, alignItems: 'center' },
  statValue: { fontSize: 15, fontWeight: '800', color: Colors.textPrimary, fontFamily: 'monospace' },
  statLabel: { fontSize: 10, color: Colors.textMuted, marginTop: 3 },
  alertBanner: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, backgroundColor: 'rgba(217,164,65,0.1)', borderWidth: 1, borderColor: 'rgba(217,164,65,0.4)', borderRadius: 14, paddingHorizontal: 12, paddingVertical: 10, marginBottom: 14 },
  alertIcon: { fontSize: 16 },
  alertText: { flex: 1, fontSize: 12, color: Colors.goldLight, lineHeight: 18 },
  forecastDivider: { height: 1, backgroundColor: 'rgba(255,255,255,0.1)', marginBottom: 14 },
  forecastScroll: { gap: 6 },
  forecastDay: { backgroundColor: 'rgba(23,49,35,0.4)', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, alignItems: 'center', minWidth: 56 },
  forecastDayLabel: { fontSize: 10, color: Colors.textMuted, marginBottom: 4, fontWeight: '500' },
  forecastDayIcon: { fontSize: 18, marginBottom: 4 },
  forecastTemps: { fontSize: 10, fontWeight: '700', color: Colors.textPrimary, fontFamily: 'monospace' },
});
