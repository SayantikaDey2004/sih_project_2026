import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Linking, ActivityIndicator } from 'react-native';
import { Colors } from '../../theme/colors';
import { getCurrentUser, logout, StoredUser } from '../../services/auth.service';
import { useRouter } from 'expo-router';
import { styles } from './ProfileScreen.styles';

export default function ProfileScreen() {
  const router = useRouter();
  const [user, setUser] = useState<StoredUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCurrentUser().then((u) => { setUser(u); setLoading(false); });
  }, []);

  const handleLogout = async () => {
    await logout();
    router.replace('/');
  };

  const getInitials = (name: string) => {
    const parts = name.trim().split(/\s+/).filter(Boolean);
    if (parts.length === 0) return '?';
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  if (loading) return <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}><ActivityIndicator color={Colors.gold} /></View>;
  if (!user) { router.replace('/login'); return null; }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        {/* Profile Hero */}
        <View style={styles.profileHero}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{getInitials(user.name || user.email)}</Text>
          </View>
          <Text style={styles.profileName}>{user.name || user.email}</Text>
          <Text style={styles.profileEmail}>{user.email}</Text>
          <View style={styles.citizenBadge}>
            <Text style={styles.citizenBadgeText}>🛡 Citizen</Text>
          </View>
        </View>

        {/* Info Cards */}
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Personal Information</Text>
          <InfoRow icon="✉" label="Email" value={user.email} />
          <InfoRow icon="📞" label="Phone" value={user.phone || 'Not set'} />
          <InfoRow icon="📍" label="Location" value={user.location || 'Not set'} />
        </View>

        <View style={styles.card}>
          <Text style={styles.cardLabel}>Alert Area</Text>
          <InfoRow icon="🌏" label="Monitoring Region" value={user.location || 'Guwahati, Assam'} />
          <InfoRow icon="📡" label="Alert Status" value="Active — Real-time monitoring" />
          <InfoRow icon="🔔" label="Notifications" value="SMS + App alerts enabled" />
        </View>

        <View style={styles.card}>
          <Text style={styles.cardLabel}>Emergency Contacts</Text>
          <TouchableOpacity style={styles.callRow} onPress={() => Linking.openURL('tel:1078')}>
            <Text style={styles.callIcon}>📞</Text>
            <View style={styles.callInfo}>
              <Text style={styles.callName}>National Emergency Hotline</Text>
              <Text style={styles.callNum}>1078</Text>
            </View>
            <Text style={styles.callArrow}>→</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.callRow} onPress={() => Linking.openURL('tel:112')}>
            <Text style={styles.callIcon}>🚨</Text>
            <View style={styles.callInfo}>
              <Text style={styles.callName}>Police / Ambulance / Fire</Text>
              <Text style={styles.callNum}>112</Text>
            </View>
            <Text style={styles.callArrow}>→</Text>
          </TouchableOpacity>
        </View>

        {/* Logout */}
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

function InfoRow({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoIcon}>{icon}</Text>
      <View style={styles.infoContent}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue}>{value}</Text>
      </View>
    </View>
  );
}
