import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Colors } from '../theme/colors';

const RISK_COLORS: Record<string, string> = {
  low: '#4CAF6D', moderate: '#F2C14E', medium: '#F2C14E', high: '#EF8A3D', critical: '#E14B3C',
};

interface RiskSummaryData {
  currentLevel: string;
  message: string;
  zoneCount: number;
  counts: { level: string; label: string; count: number }[];
  zones: { id: string; level: string; label: string; name: string; description: string; distance: string }[];
}

export default function RiskSummary({ data }: { data: RiskSummaryData }) {
  const rawLevel = (data?.currentLevel || '').toLowerCase();
  const safeLevel = rawLevel && RISK_COLORS[rawLevel] ? rawLevel : 'moderate';
  const currentColor = RISK_COLORS[safeLevel];
  const safeCounts = Array.isArray(data?.counts) ? data.counts : [];
  const safeZones = Array.isArray(data?.zones) ? data.zones : [];

  return (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerLabel}>Live Risk Summary</Text>
        <View style={styles.zoneBadge}>
          <Text style={styles.zoneBadgeText}>{data?.zoneCount ?? safeZones.length} monitored zones</Text>
        </View>
      </View>

      {/* Current Risk */}
      <View style={styles.riskRow}>
        <View>
          <Text style={styles.riskSubLabel}>Current area status</Text>
          <Text style={[styles.riskLevel, { color: currentColor }]}>
            {safeLevel.charAt(0).toUpperCase() + safeLevel.slice(1)}
          </Text>
        </View>
        <View style={[styles.statusPill, { backgroundColor: `${currentColor}22`, borderColor: `${currentColor}55` }]}>
          <View style={[styles.statusDot, { backgroundColor: currentColor }]} />
          <Text style={[styles.statusText, { color: currentColor }]}>{data?.message || 'Monitoring live'}</Text>
        </View>
      </View>

      {/* Count Cards */}
      <View style={styles.countsGrid}>
        {safeCounts.map((count) => {
          const levelKey = (count?.level || '').toLowerCase();
          const color = RISK_COLORS[levelKey] ?? Colors.riskModerate;
          return (
            <View key={count.level} style={styles.countCard}>
              <View style={styles.countCardHeader}>
                <View style={[styles.countDot, { backgroundColor: color }]} />
                <Text style={styles.countLabel}>{count.label}</Text>
              </View>
              <Text style={[styles.countNum, { color }]}>{count.count}</Text>
            </View>
          );
        })}
      </View>

      {/* Zone List */}
      {safeZones.length > 0 && (
        <View style={styles.zonesSection}>
          <Text style={styles.sectorLabel}>Sector breakdown</Text>
          {safeZones.map((zone) => {
            const zk = (zone?.level || '').toLowerCase();
            const zc = RISK_COLORS[zk] ?? Colors.riskModerate;
            return (
              <View key={zone.id} style={styles.zoneRow}>
                <View style={[styles.zoneLabelBadge, { backgroundColor: `${zc}22`, borderColor: `${zc}44` }]}>
                  <Text style={[styles.zoneLabelText, { color: zc }]}>{zone.label}</Text>
                </View>
                <Text style={styles.zoneName} numberOfLines={1}>{zone.name}</Text>
                <Text style={styles.zoneDistance}>{zone.distance}</Text>
              </View>
            );
          })}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: 'rgba(16,36,25,0.87)', borderRadius: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', padding: 18 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 },
  headerLabel: { fontSize: 11, fontWeight: '700', color: Colors.goldLight, textTransform: 'uppercase', letterSpacing: 1.5 },
  zoneBadge: { backgroundColor: 'rgba(23,49,35,0.8)', borderRadius: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', paddingHorizontal: 10, paddingVertical: 4 },
  zoneBadgeText: { fontSize: 11, color: Colors.textSecondary },
  riskRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 18, flexWrap: 'wrap', gap: 10 },
  riskSubLabel: { fontSize: 11, color: Colors.textMuted, marginBottom: 4 },
  riskLevel: { fontSize: 36, fontWeight: '800', letterSpacing: -0.5 },
  statusPill: { flexDirection: 'row', alignItems: 'center', gap: 6, borderWidth: 1, borderRadius: 20, paddingHorizontal: 10, paddingVertical: 6 },
  statusDot: { width: 7, height: 7, borderRadius: 4 },
  statusText: { fontSize: 11, fontWeight: '600', maxWidth: 150 },
  countsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 18 },
  countCard: { flex: 1, minWidth: '22%', backgroundColor: 'rgba(23,49,35,0.8)', borderRadius: 14, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', padding: 12 },
  countCardHeader: { flexDirection: 'row', alignItems: 'center', gap: 5, marginBottom: 8 },
  countDot: { width: 7, height: 7, borderRadius: 4 },
  countLabel: { fontSize: 11, color: Colors.textSecondary, fontWeight: '500' },
  countNum: { fontSize: 26, fontWeight: '800', letterSpacing: -0.5 },
  zonesSection: { borderTopWidth: 1, borderColor: 'rgba(255,255,255,0.07)', paddingTop: 14, gap: 8 },
  sectorLabel: { fontSize: 10, fontWeight: '700', color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 },
  zoneRow: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: 'rgba(23,49,35,0.7)', borderRadius: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', paddingHorizontal: 12, paddingVertical: 10 },
  zoneLabelBadge: { borderWidth: 1, borderRadius: 20, paddingHorizontal: 8, paddingVertical: 3 },
  zoneLabelText: { fontSize: 10, fontWeight: '800', textTransform: 'uppercase' },
  zoneName: { flex: 1, fontSize: 13, fontWeight: '600', color: Colors.textPrimary },
  zoneDistance: { fontSize: 11, color: Colors.textMuted, fontFamily: 'monospace' },
});
