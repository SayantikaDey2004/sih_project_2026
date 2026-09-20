import React, { useEffect, useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '../../theme/colors';
import { getGovtUser, govtLogout, fetchGovtReports, GovtUser } from '../../services/govtAuth.service';
import { styles } from './GovtDashboardScreen.styles';

interface Report {
  id?: string;
  location?: string;
  disaster_type?: string;
  description?: string;
  timestamp?: string;
  created_at?: string;
}

export default function GovtDashboardScreen() {
  const router = useRouter();
  const [user, setUser] = useState<GovtUser | null>(null);
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [reportsLoading, setReportsLoading] = useState(false);

  useEffect(() => {
    getGovtUser().then((u: GovtUser | null) => {
      setUser(u);
      setLoading(false);
      if (!u) router.replace('/govt/login');
    });
  }, []);

  useEffect(() => {
    if (!user) return;
    setReportsLoading(true);
    fetchGovtReports()
      .then((data: any) => setReports(Array.isArray(data) ? data : []))
      .catch(() => setReports([]))
      .finally(() => setReportsLoading(false));
  }, [user]);

  const handleLogout = async () => {
    await govtLogout();
    router.replace('/govt/login');
  };

  if (loading) return (
    <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
      <ActivityIndicator color={Colors.gold} />
    </View>
  );
  if (!user) return null;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.headerDot} />
          <Text style={styles.headerBrand}>Geo Rakshak</Text>
          <View style={styles.headerBadge}>
            <Text style={styles.headerBadgeText}>Govt Dashboard</Text>
          </View>
        </View>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutBtn}>
          <Text style={styles.logoutText}>⬡ Logout</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {/* Welcome */}
        <Text style={styles.welcomeTitle}>Welcome, {user.full_name || 'Official'}</Text>
        <Text style={styles.welcomeSub}>Government disaster monitoring and response dashboard</Text>

        {/* Info Cards */}
        <View style={styles.infoCards}>
          <InfoCard icon="🛡" label="Gov ID" value={user.gov_id || '—'} accent={Colors.gold} />
          <InfoCard icon="📊" label="Department" value={user.department || 'Not specified'} accent={Colors.blue} />
          <InfoCard icon="⚡" label="Status" value="Active" accent={Colors.govtAccent} />
        </View>

        {/* Quick Actions */}
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionCards}>
          <TouchableOpacity style={styles.actionCard} onPress={() => {}}>
            <View style={[styles.actionIconBox, { backgroundColor: 'rgba(239,68,68,0.15)' }]}>
              <Text style={styles.actionIcon}>📄</Text>
            </View>
            <Text style={styles.actionTitle}>Reported Incidents</Text>
            <Text style={styles.actionDesc}>View disaster reports filed by citizens</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionCard} onPress={() => {}}>
            <View style={[styles.actionIconBox, { backgroundColor: 'rgba(59,130,246,0.15)' }]}>
              <Text style={styles.actionIcon}>👤</Text>
            </View>
            <Text style={styles.actionTitle}>Official Profile</Text>
            <Text style={styles.actionDesc}>View and manage your government profile</Text>
          </TouchableOpacity>
        </View>

        {/* Reports List */}
        <Text style={styles.sectionTitle}>Recent Reports</Text>
        {reportsLoading ? (
          <View style={styles.loadingBox}>
            <ActivityIndicator color={Colors.gold} />
          </View>
        ) : reports.length === 0 ? (
          <View style={styles.emptyBox}>
            <Text style={styles.emptyText}>No incident reports found.</Text>
          </View>
        ) : (
          reports.slice(0, 20).map((report, idx) => (
            <View key={report.id ?? idx} style={styles.reportCard}>
              <View style={styles.reportHeader}>
                <Text style={styles.reportType}>{report.disaster_type ?? 'Unknown Type'}</Text>
                <Text style={styles.reportDate}>
                  {report.timestamp
                    ? new Date(report.timestamp).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })
                    : report.created_at
                    ? new Date(report.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })
                    : '—'}
                </Text>
              </View>
              <Text style={styles.reportLocation}>📍 {report.location ?? 'Unknown location'}</Text>
              {report.description && (
                <Text style={styles.reportDesc} numberOfLines={2}>{report.description}</Text>
              )}
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
}

function InfoCard({ icon, label, value, accent }: { icon: string; label: string; value: string; accent: string }) {
  return (
    <View style={styles.infoCard}>
      <View style={styles.infoCardHeader}>
        <Text style={styles.infoCardIcon}>{icon}</Text>
        <Text style={[styles.infoCardLabel, { color: accent }]}>{label}</Text>
      </View>
      <Text style={styles.infoCardValue}>{value}</Text>
    </View>
  );
}
