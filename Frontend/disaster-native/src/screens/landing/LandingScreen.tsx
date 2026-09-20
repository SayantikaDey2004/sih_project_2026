import React from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, Linking,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../../theme/colors';
import { styles } from './LandingScreen.styles';

const steps = [
  ['01', 'Sense', 'Rain gauges, soil-moisture probes, and satellite feeds stream live terrain data every few minutes.'],
  ['02', 'Predict', 'An AI model trained on historical slope failures scores landslide and flash-flood risk in real time.'],
  ['03', 'Alert', 'When risk crosses a threshold, SMS and siren alerts reach households, schools, and local authorities.'],
  ['04', 'Respond', 'Response teams get live maps of the affected zone to coordinate evacuation and relief on the ground.'],
] as const;

const tips = [
  ['Know your evacuation route', 'Identify the nearest high ground and a second route in case the first is blocked by debris.', '⌁'],
  ['Watch for warning signs', 'New cracks in the ground, tilting trees, or sudden muddy water are early signs of slope movement.', '✧'],
  ['Keep an emergency kit ready', 'Torch, radio, first aid, and important documents packed and reachable at all times during monsoon season.', '📱'],
] as const;

const stats = [
  ['140+', 'villages under active monitoring'],
  ['28 min', 'average early-warning lead time'],
  ['24/7', 'satellite and sensor coverage'],
] as const;

export default function LandingScreen() {
  const router = useRouter();

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Hero Section */}
      <LinearGradient
        colors={['rgba(10,20,15,0.75)', 'rgba(10,20,15,0.88)', 'rgba(9,17,13,0.96)']}
        style={styles.hero}
      >
        <View style={styles.heroBadge}>
          <View style={styles.pulseDot} />
          <Text style={styles.heroBadgeText}>Live monitoring across the North Eastern Region</Text>
        </View>
        <Text style={styles.heroTitle}>Protecting Lives.{'\n'}Predicting Risks.</Text>
        <Text style={styles.heroSubtitle}>Any disaster? We are here to help!</Text>

        <View style={styles.heroButtons}>
          <TouchableOpacity style={styles.btnGold} onPress={() => router.push('/signup')}>
            <Text style={styles.btnGoldText}>Sign Up</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btnOutline} onPress={() => router.push('/login')}>
            <Text style={styles.btnOutlineText}>Log In</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.govtBadge}
          onPress={() => router.push('/govt/login')}
        >
          <View style={styles.govtDot} />
          <Text style={styles.govtBadgeText}>Government Official Portal</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => Linking.openURL('tel:1078')} style={styles.emergencyCall}>
          <Text style={styles.emergencyCallText}>📞  Call for immediate assistance: </Text>
          <Text style={styles.emergencyCallNumber}>1078</Text>
        </TouchableOpacity>
      </LinearGradient>

      {/* About Section */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Why this exists</Text>
        <Text style={styles.sectionTitle}>Fragile slopes, heavy monsoons, and villages caught in between.</Text>
        <Text style={styles.sectionBody}>
          Every monsoon, the steep terrain of the North Eastern Region absorbs weeks of rainfall in a matter of hours.
          Slopes give way without warning, rivers surge past their banks, and roads disappear overnight.
        </Text>
        <Text style={[styles.sectionBody, { marginTop: 10 }]}>
          Geo Rakshak combines satellite rainfall data, ground sensors, and machine learning to flag unstable slopes
          before they fail, giving communities minutes that used to not exist.
        </Text>

        {/* Stats */}
        <View style={styles.statsContainer}>
          {stats.map(([num, label], i) => (
            <View
              key={num}
              style={[
                styles.statRow,
                i === 0 && styles.statRowFirst,
                i === stats.length - 1 && styles.statRowLast,
              ]}
            >
              <Text style={styles.statNum}>{num}</Text>
              <Text style={styles.statLabel}>{label}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* How It Works */}
      <LinearGradient colors={['#0D2119', '#132A1C']} style={styles.section}>
        <Text style={[styles.sectionLabel, { color: Colors.gold }]}>How it works</Text>
        <Text style={[styles.sectionTitle, { color: Colors.textPrimary }]}>
          From rainfall to a warning your phone can act on.
        </Text>
        <View style={styles.stepsGrid}>
          {steps.map(([num, title, copy]) => (
            <View key={num} style={styles.stepCard}>
              <Text style={styles.stepNum}>{num}</Text>
              <Text style={styles.stepTitle}>{title}</Text>
              <Text style={styles.stepCopy}>{copy}</Text>
            </View>
          ))}
        </View>
      </LinearGradient>

      {/* Safety Tips */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Before disaster strikes</Text>
        <Text style={styles.sectionTitle}>Simple habits that save lives.</Text>
        {tips.map(([title, copy, icon]) => (
          <View key={title} style={styles.tipCard}>
            <View style={styles.tipIcon}>
              <Text style={styles.tipIconText}>{icon}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.tipTitle}>{title}</Text>
              <Text style={styles.tipCopy}>{copy}</Text>
            </View>
          </View>
        ))}
      </View>

      {/* Emergency Banner */}
      <LinearGradient colors={['#8A5A3B', '#1C3A2C']} style={styles.emergencyBanner}>
        <Text style={styles.emergencyBannerTitle}>
          Help us reach the villages that don't have a warning system yet.
        </Text>
        <View>
          <Text style={styles.emergencyBannerLabel}>24-hour emergency line</Text>
          <TouchableOpacity onPress={() => Linking.openURL('tel:1078')}>
            <Text style={styles.emergencyBannerNumber}>1078</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* Footer */}
      <View style={styles.footer}>
        <View style={styles.footerBrand}>
          <View style={styles.footerDot} />
          <Text style={styles.footerBrandText}>Geo Rakshak</Text>
        </View>
        <Text style={styles.footerDesc}>
          An AI-based early warning and landslide risk monitoring system built for the North Eastern Region of India.
        </Text>
        <Text style={styles.footerCopy}>© 2026 Geo Rakshak. Built to protect communities across the North Eastern Region.</Text>
      </View>
    </ScrollView>
  );
}
