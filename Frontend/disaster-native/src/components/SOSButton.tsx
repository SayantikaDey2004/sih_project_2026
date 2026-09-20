import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Colors, Shadows } from '../theme/colors';

type SOSState = 'idle' | 'loading' | 'success' | 'error';

interface SOSButtonProps {
  state?: SOSState;
  onTap?: () => void;
  disabled?: boolean;
}

export default function SOSButton({ state = 'idle', onTap, disabled = false }: SOSButtonProps) {
  const isLoading = state === 'loading';
  const isSuccess = state === 'success';
  const isError = state === 'error';

  const buttonBg = isSuccess
    ? ['#4CAF6D', '#2E7D32']
    : isError
    ? ['#E74C3C', '#922B21']
    : ['#EB5757', '#E14B3C', '#C0392B'];

  const shadowStyle = isSuccess
    ? { shadowColor: '#4CAF6D', shadowOpacity: 0.6, shadowRadius: 20, elevation: 10 }
    : isError
    ? { shadowColor: '#E74C3C', shadowOpacity: 0.6, shadowRadius: 20, elevation: 10 }
    : { shadowColor: '#E14B3C', shadowOpacity: 0.55, shadowRadius: 24, elevation: 14 };

  const getText = () => {
    if (isSuccess) return '✓';
    if (isError) return '!';
    return 'SOS';
  };

  const getCaption = () => {
    if (isSuccess) return 'Emergency Dispatched (1078)';
    if (isError) return 'Alert Failed — Call 1078';
    return 'Tap for Emergency';
  };

  const getSubCaption = () => {
    if (isSuccess) return 'Your live coordinates have been transmitted to the nearest response team.';
    if (isError) return 'Direct transmission failed. Please call 1078 emergency services immediately.';
    return 'Shares your live location with the nearest rescue team the moment you tap';
  };

  return (
    <View style={styles.container}>
      {/* Glow ring */}
      <View style={[styles.glowRing, shadowStyle]}>
        <TouchableOpacity
          onPress={onTap}
          disabled={disabled || isLoading}
          activeOpacity={0.8}
          style={[
            styles.button,
            { backgroundColor: isSuccess ? '#4CAF6D' : isError ? '#E74C3C' : '#E14B3C' },
            shadowStyle,
            (disabled || isLoading) && { opacity: 0.7 },
          ]}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" size="large" />
          ) : (
            <Text style={styles.buttonText}>{getText()}</Text>
          )}
        </TouchableOpacity>
      </View>

      <Text style={[
        styles.caption,
        isSuccess ? { color: '#4CAF6D' } : isError ? { color: '#E74C3C' } : { color: Colors.textPrimary }
      ]}>
        {getCaption()}
      </Text>
      <Text style={styles.subCaption}>{getSubCaption()}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', paddingVertical: 24 },
  glowRing: {
    borderRadius: 80, padding: 6,
    shadowOffset: { width: 0, height: 0 },
    marginBottom: 18,
  },
  button: {
    width: 140, height: 140, borderRadius: 70,
    alignItems: 'center', justifyContent: 'center',
  },
  buttonText: { color: '#fff', fontSize: 32, fontWeight: '900', letterSpacing: 2 },
  caption: { fontSize: 18, fontWeight: '700', letterSpacing: -0.3, marginBottom: 6, textAlign: 'center' },
  subCaption: { fontSize: 13, color: Colors.textMuted, textAlign: 'center', maxWidth: 300, lineHeight: 20 },
});
