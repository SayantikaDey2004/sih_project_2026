import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { govtLoginApi, govtSignupApi } from '../../services/govtAuth.service';
import ToastContainer from '../../components/ToastContainer';
import { useToast } from '../../hooks/useToast';
import { styles } from './GovtLoginScreen.styles';

export default function GovtLoginScreen() {
  const router = useRouter();
  const { toasts, showToast, dismissToast } = useToast();
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [department, setDepartment] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email.trim() || !password.trim()) {
      showToast('error', 'Missing fields', 'Please fill in all required fields.');
      return;
    }
    try {
      setLoading(true);
      if (mode === 'login') {
        await govtLoginApi(email, password);
        showToast('success', 'Logged in', 'Welcome to the Government Portal');
        setTimeout(() => router.replace('/govt/dashboard'), 600);
      } else {
        if (!fullName || !department) {
          showToast('error', 'Missing fields', 'Full name and department are required.');
          return;
        }
        await govtSignupApi(email, password, fullName, department);
        showToast('success', 'Account created', 'Government account registered.');
        setTimeout(() => router.replace('/govt/dashboard'), 600);
      }
    } catch (err) {
      showToast('error', 'Authentication failed', err instanceof Error ? err.message : 'Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={['#050B08', '#07140E', '#0B2117']} style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.inner}>
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          {/* Back */}
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>

          <View style={styles.card}>
            {/* Badge */}
            <View style={styles.govtBadge}>
              <View style={styles.govtDot} />
              <Text style={styles.govtBadgeText}>Government Official Portal</Text>
            </View>

            <Text style={styles.cardTitle}>
              {mode === 'login' ? 'Official Login' : 'Register as Official'}
            </Text>
            <Text style={styles.cardSubtitle}>
              {mode === 'login'
                ? 'Access the government disaster monitoring dashboard.'
                : 'Create a verified government account.'}
            </Text>

            {mode === 'signup' && (
              <>
                <Text style={styles.label}>Full name *</Text>
                <TextInput style={styles.input} placeholder="Your full name" placeholderTextColor="rgba(169,185,168,0.5)" value={fullName} onChangeText={setFullName} />
                <Text style={styles.label}>Department *</Text>
                <TextInput style={styles.input} placeholder="e.g. NDRF, SDMA, Revenue Dept." placeholderTextColor="rgba(169,185,168,0.5)" value={department} onChangeText={setDepartment} />
              </>
            )}

            <Text style={styles.label}>Official email *</Text>
            <TextInput style={styles.input} placeholder="official@gov.in" placeholderTextColor="rgba(169,185,168,0.5)" keyboardType="email-address" autoCapitalize="none" value={email} onChangeText={setEmail} />

            <Text style={styles.label}>Password *</Text>
            <TextInput style={styles.input} placeholder="••••••••" placeholderTextColor="rgba(169,185,168,0.5)" secureTextEntry value={password} onChangeText={setPassword} />

            <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit} disabled={loading}>
              {loading ? <ActivityIndicator color="#102419" /> : (
                <Text style={styles.submitBtnText}>
                  {mode === 'login' ? 'Sign In' : 'Create Account'}
                </Text>
              )}
            </TouchableOpacity>

            <View style={styles.switchRow}>
              <Text style={styles.switchText}>
                {mode === 'login' ? "Don't have an account? " : "Already registered? "}
              </Text>
              <TouchableOpacity onPress={() => setMode(mode === 'login' ? 'signup' : 'login')}>
                <Text style={styles.switchLink}>{mode === 'login' ? 'Register' : 'Log in'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </LinearGradient>
  );
}
