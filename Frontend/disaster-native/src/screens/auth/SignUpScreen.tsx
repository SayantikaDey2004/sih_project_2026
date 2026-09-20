import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { registerUserApi } from '../../services/auth.service';
import { useToast } from '../../hooks/useToast';
import ToastContainer from '../../components/ToastContainer';
import * as Location from 'expo-location';
import { styles } from './SignUpScreen.styles';

export default function SignUpScreen() {
  const router = useRouter();
  const { toasts, showToast, dismissToast } = useToast();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [detectingLocation, setDetectingLocation] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleDetectLocation = async () => {
    try {
      setDetectingLocation(true);
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        showToast('error', 'Permission Denied', 'GPS permission is required to sign up.');
        return;
      }
      const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      const lat = loc.coords.latitude;
      const lng = loc.coords.longitude;
      setCoords({ lat, lng });

      let locName = `${lat.toFixed(4)}, ${lng.toFixed(4)}`;

      try {
        // Reverse geocode to show a readable name to the user
        const addresses = await Location.reverseGeocodeAsync({ latitude: lat, longitude: lng });
        if (addresses && addresses.length > 0) {
          const address = addresses[0];
          locName = `${address.city || address.district || address.region || 'Current Area'}, ${address.region || address.country || ''}`;
        }
      } catch (geoErr) {
        console.warn('Reverse geocoding failed, using raw coordinates:', geoErr);
      }

      setLocation(locName);
      showToast('success', 'Location Detected', locName);
    } catch (err) {
      console.error('GPS Error:', err);
      showToast('error', 'Location Error', 'Please ensure GPS is on and try again.');
    } finally {
      setDetectingLocation(false);
    }
  };

  const handleSignup = async () => {
    if (!name.trim() || !email.trim() || !password.trim() || !confirmPassword.trim() || !location) {
      showToast('error', 'Missing fields', 'Please detect your GPS location first.');
      return;
    }
    if (password !== confirmPassword) {
      showToast('error', 'Password mismatch', 'Passwords do not match.');
      return;
    }
    try {
      setLoading(true);
      // We pass the coordinates as the location string so the backend can parse them
      const finalLoc = coords ? `${coords.lat}, ${coords.lng}` : location;
      await registerUserApi({ name, email, phone, location: finalLoc, password, confirmPassword });
      showToast('success', 'Account created', 'Welcome to Geo Rakshak.');
      setTimeout(() => router.replace('/(app)/dashboard'), 1000);
    } catch (err) {
      showToast('error', 'Registration failed', err instanceof Error ? err.message : 'Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={['#050B08', '#07140E', '#0B2117']} style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.inner}>
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          <View style={styles.headerRow}>
            <View style={styles.brandDot} />
            <Text style={styles.brandText}>Geo Rakshak</Text>
          </View>

          <View style={styles.card}>
            <View style={styles.cardBrand}>
              <View style={styles.brandDot} />
              <Text style={styles.cardBrandText}>Geo Rakshak</Text>
            </View>
            <Text style={styles.cardTitle}>Create your account</Text>
            <Text style={styles.cardSubtitle}>
              Join the early warning network for landslide and flood alerts.
            </Text>

            <Text style={styles.label}>Full name *</Text>
            <TextInput style={styles.input} placeholder="Your full name" placeholderTextColor="rgba(169,185,168,0.5)" value={name} onChangeText={setName} />

            <Text style={styles.label}>Email address *</Text>
            <TextInput style={styles.input} placeholder="your@email.com" placeholderTextColor="rgba(169,185,168,0.5)" keyboardType="email-address" autoCapitalize="none" value={email} onChangeText={setEmail} />

            <Text style={styles.label}>Phone number</Text>
            <TextInput style={styles.input} placeholder="+91 98765 43210" placeholderTextColor="rgba(169,185,168,0.5)" keyboardType="phone-pad" value={phone} onChangeText={setPhone} />

            <Text style={styles.label}>Your GPS Location *</Text>
            <View style={{ marginBottom: 16 }}>
              <TouchableOpacity
                style={[styles.input, { justifyContent: 'center', borderColor: location ? '#34D399' : 'rgba(169,185,168,0.2)' }]}
                onPress={handleDetectLocation}
                disabled={detectingLocation}
              >
                {detectingLocation ? (
                  <ActivityIndicator size="small" color="#34D399" />
                ) : (
                  <Text style={{ color: location ? '#fff' : 'rgba(169,185,168,0.5)' }}>
                    {location || 'Tap to detect current GPS'}
                  </Text>
                )}
              </TouchableOpacity>
              {location ? <Text style={{ color: '#34D399', fontSize: 11, marginTop: -12, marginLeft: 4 }}>📍 Device Verified</Text> : null}
            </View>

            <Text style={styles.label}>Password *</Text>
            <TextInput style={styles.input} placeholder="Min. 8 characters" placeholderTextColor="rgba(169,185,168,0.5)" secureTextEntry value={password} onChangeText={setPassword} />

            <Text style={styles.label}>Confirm password *</Text>
            <TextInput style={styles.input} placeholder="Repeat your password" placeholderTextColor="rgba(169,185,168,0.5)" secureTextEntry value={confirmPassword} onChangeText={setConfirmPassword} />

            <TouchableOpacity style={styles.btnPrimary} onPress={handleSignup} disabled={loading}>
              {loading ? <ActivityIndicator color="#102419" /> : <Text style={styles.btnPrimaryText}>Create Account</Text>}
            </TouchableOpacity>

            <View style={styles.switchRow}>
              <Text style={styles.switchText}>Already have an account? </Text>
              <TouchableOpacity onPress={() => router.push('/login')}>
                <Text style={styles.switchLink}>Log in</Text>
              </TouchableOpacity>
            </View>
          </View>
          <Text style={styles.footerNote}>Your location and account information are protected.</Text>
        </ScrollView>
      </KeyboardAvoidingView>
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </LinearGradient>
  );
}
