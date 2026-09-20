import { Tabs } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../../src/theme/colors';

function TabIcon({ emoji, focused }: { emoji: string; focused: boolean }) {
  return (
    <View style={[styles.iconContainer, focused && styles.iconContainerActive]}>
      <Text style={styles.iconEmoji}>{emoji}</Text>
    </View>
  );
}

export default function AppLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          backgroundColor: '#0B1A12',
          borderTopWidth: 1,
          borderTopColor: 'rgba(255,255,255,0.08)',
          height: 80,
          paddingBottom: 16,
          paddingTop: 8,
        },
        tabBarActiveTintColor: Colors.gold,
        tabBarInactiveTintColor: 'rgba(169,185,168,0.55)',
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '700',
          letterSpacing: 0.3,
        },
        headerStyle: {
          backgroundColor: '#0B1A12',
          borderBottomWidth: 1,
          borderBottomColor: 'rgba(255,255,255,0.08)',
        } as any,
        headerTintColor: Colors.textPrimary,
        headerTitleStyle: {
          fontWeight: '700',
          fontSize: 17,
          color: Colors.textPrimary,
        },
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          title: 'Home',
          headerTitle: 'Geo Rakshak',
          tabBarIcon: ({ focused }) => <TabIcon emoji="🏠" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="map"
        options={{
          title: 'Risk Map',
          headerTitle: 'Live Risk Map',
          tabBarIcon: ({ focused }) => <TabIcon emoji="🗺" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="ai-assistant"
        options={{
          title: 'AI Chat',
          headerTitle: 'AI Assistant',
          headerShown: false,
          tabBarIcon: ({ focused }) => <TabIcon emoji="✦" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="emergency"
        options={{
          title: 'Emergency',
          headerTitle: 'Emergency Response',
          tabBarIcon: ({ focused }) => <TabIcon emoji="🚨" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="landslide-risk"
        options={{
          title: 'AI Risk',
          headerTitle: 'Landslide Risk',
          headerShown: false,
          tabBarIcon: ({ focused }) => <TabIcon emoji="⚡" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          headerTitle: 'My Profile',
          tabBarIcon: ({ focused }) => <TabIcon emoji="👤" focused={focused} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  iconContainer: { width: 36, height: 26, alignItems: 'center', justifyContent: 'center', borderRadius: 8 },
  iconContainerActive: { backgroundColor: 'rgba(227,166,63,0.15)' },
  iconEmoji: { fontSize: 20 },
});
