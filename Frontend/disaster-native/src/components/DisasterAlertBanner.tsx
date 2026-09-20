import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { Colors } from '../theme/colors';

interface DisasterMessage {
  disasterType: string;
  location: string;
  message: string;
}

interface DisasterAlertBannerProps {
  message: DisasterMessage;
  onDismiss: () => void;
}

export default function DisasterAlertBanner({ message, onDismiss }: DisasterAlertBannerProps) {
  return (
    <Modal transparent animationType="slide" visible statusBarTranslucent>
      <View style={styles.overlay}>
        <View style={styles.card}>
          {/* Animated pulse ring */}
          <View style={styles.pulseOuter}>
            <View style={styles.pulseInner}>
              <Text style={styles.warningIcon}>⚠</Text>
            </View>
          </View>
          <View style={styles.badge}>
            <View style={styles.badgeDot} />
            <Text style={styles.badgeText}>Disaster Alert — Live</Text>
          </View>
          <Text style={styles.type}>{message.disasterType}</Text>
          <Text style={styles.location}>📍 {message.location}</Text>
          {message.message && <Text style={styles.body}>{message.message}</Text>}
          <TouchableOpacity style={styles.dismissBtn} onPress={onDismiss}>
            <Text style={styles.dismissText}>Acknowledge & Dismiss</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'flex-end', padding: 16, paddingBottom: 40 },
  card: { backgroundColor: 'rgba(20,5,5,0.97)', borderRadius: 24, borderWidth: 2, borderColor: 'rgba(225,75,60,0.5)', padding: 24, alignItems: 'center' },
  pulseOuter: { width: 80, height: 80, borderRadius: 40, borderWidth: 2, borderColor: 'rgba(225,75,60,0.3)', alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  pulseInner: { width: 60, height: 60, borderRadius: 30, backgroundColor: 'rgba(225,75,60,0.2)', alignItems: 'center', justifyContent: 'center' },
  warningIcon: { fontSize: 32 },
  badge: { flexDirection: 'row', alignItems: 'center', gap: 8, borderWidth: 1, borderColor: 'rgba(225,75,60,0.5)', borderRadius: 20, paddingHorizontal: 14, paddingVertical: 6, marginBottom: 16 },
  badgeDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: Colors.redBright },
  badgeText: { color: Colors.redBright, fontSize: 12, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 },
  type: { fontSize: 28, fontWeight: '800', color: '#fff', textAlign: 'center', marginBottom: 6 },
  location: { fontSize: 14, color: Colors.textSecondary, textAlign: 'center', marginBottom: 12 },
  body: { fontSize: 13, color: Colors.textMuted, textAlign: 'center', lineHeight: 20, marginBottom: 20 },
  dismissBtn: { width: '100%', backgroundColor: 'rgba(225,75,60,0.15)', borderWidth: 1, borderColor: 'rgba(225,75,60,0.4)', borderRadius: 14, paddingVertical: 14, alignItems: 'center' },
  dismissText: { color: Colors.redBright, fontSize: 14, fontWeight: '700' },
});
