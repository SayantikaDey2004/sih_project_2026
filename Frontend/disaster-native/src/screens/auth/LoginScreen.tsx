import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { authenticateUserApi } from '../../services/auth.service';
import { useToast } from '../../hooks/useToast';
import ToastContainer from '../../components/ToastContainer';
import { styles } from './LoginScreen.styles';

export default function LoginScreen() {
  const router = useRouter();
  const { toasts, showToast, dismissToast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [view, setView] = useState<'login' | 'reset'>('login');
  const [resetEmail, setResetEmail] = useState('');

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      showToast('error', 'Missing fields', 'Please enter your email and password.');
      return;
    }
    try {
      setLoading(true);
      await authenticateUserApi(email.trim(), password.trim());
      showToast('success', 'Logged in successfully', 'Welcome back to Geo Rakshak.');
      setTimeout(() => router.replace('/(app)/dashboard'), 600);
    } catch (err) {
      showToast('error', "Couldn't log in", err instanceof Error ? err.message : 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={['#050B08', '#07140E', '#0B2117']} style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.inner}>
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.headerRow}>
            <View style={styles.brandDot} />
            <Text style={styles.brandText}>Geo Rakshak</Text>
          </View>

          {view === 'login' ? (
            <View style={styles.card}>
              <View style={styles.cardBrand}>
                <View style={styles.brandDot} />
                <Text style={styles.cardBrandText}>Geo Rakshak</Text>
              </View>

              <Text style={styles.cardTitle}>Welcome back</Text>
              <Text style={styles.cardSubtitle}>
                Sign in to continue monitoring disaster risks across Northeast India.
              </Text>

              {/* Email */}
              <Text style={styles.label}>Email address</Text>
              <TextInput
                style={styles.input}
                placeholder="your@email.com"
                placeholderTextColor="rgba(169,185,168,0.5)"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />

              {/* Password */}
              <Text style={styles.label}>Password</Text>
              <View style={styles.passwordRow}>
                <TextInput
                  style={[styles.input, { flex: 1, marginBottom: 0 }]}
                  placeholder="••••••••"
                  placeholderTextColor="rgba(169,185,168,0.5)"
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={setPassword}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeBtn}>
                  <Text style={styles.eyeIcon}>{showPassword ? '🙈' : '👁'}</Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity onPress={() => setView('reset')} style={styles.forgotLink}>
                <Text style={styles.forgotText}>Forgot password?</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.btnPrimary} onPress={handleLogin} disabled={loading}>
                {loading ? (
                  <ActivityIndicator color="#102419" />
                ) : (
                  <Text style={styles.btnPrimaryText}>Sign In</Text>
                )}
              </TouchableOpacity>

              <View style={styles.switchRow}>
                <Text style={styles.switchText}>Don't have an account? </Text>
                <TouchableOpacity onPress={() => router.push('/signup')}>
                  <Text style={styles.switchLink}>Sign up</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Reset Password</Text>
              <Text style={styles.cardSubtitle}>Enter your email to receive a reset link.</Text>
              <Text style={styles.label}>Email address</Text>
              <TextInput
                style={styles.input}
                placeholder="your@email.com"
                placeholderTextColor="rgba(169,185,168,0.5)"
                keyboardType="email-address"
                autoCapitalize="none"
                value={resetEmail}
                onChangeText={setResetEmail}
              />
              <TouchableOpacity
                style={styles.btnPrimary}
                onPress={() => {
                  showToast('success', 'Reset link sent', 'Check your email inbox.');
                  setView('login');
                }}
              >
                <Text style={styles.btnPrimaryText}>Send Reset Link</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setView('login')} style={styles.forgotLink}>
                <Text style={styles.switchLink}>← Back to login</Text>
              </TouchableOpacity>
            </View>
          )}

          <Text style={styles.footerNote}>Your location and account information are protected.</Text>
        </ScrollView>
      </KeyboardAvoidingView>
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </LinearGradient>
  );
}
