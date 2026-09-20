import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { Colors } from '../theme/colors';

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'info';
  title: string;
  body?: string;
}

interface ToastContainerProps {
  toasts: Toast[];
  onDismiss: (id: string) => void;
}

const TOAST_COLORS = {
  success: { bg: 'rgba(0,60,30,0.95)', border: 'rgba(52,211,153,0.5)', icon: '✓', iconColor: '#34d399' },
  error: { bg: 'rgba(80,0,0,0.95)', border: 'rgba(239,68,68,0.5)', icon: '!', iconColor: '#f87171' },
  info: { bg: 'rgba(0,20,50,0.95)', border: 'rgba(59,130,246,0.5)', icon: 'ℹ', iconColor: '#60a5fa' },
};

export default function ToastContainer({ toasts, onDismiss }: ToastContainerProps) {
  if (toasts.length === 0) return null;

  return (
    <View style={styles.container} pointerEvents="box-none">
      {toasts.map((toast) => {
        const style = TOAST_COLORS[toast.type];
        return (
          <TouchableOpacity
            key={toast.id}
            activeOpacity={0.85}
            onPress={() => onDismiss(toast.id)}
            style={[styles.toast, { backgroundColor: style.bg, borderColor: style.border }]}
          >
            <View style={[styles.iconCircle, { backgroundColor: `${style.iconColor}22` }]}>
              <Text style={[styles.iconText, { color: style.iconColor }]}>{style.icon}</Text>
            </View>
            <View style={styles.textArea}>
              <Text style={styles.title}>{toast.title}</Text>
              {toast.body && <Text style={styles.body}>{toast.body}</Text>}
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute', top: 60, left: 16, right: 16, zIndex: 9999, gap: 10,
  },
  toast: {
    flexDirection: 'row', alignItems: 'center', gap: 12, borderWidth: 1,
    borderRadius: 16, paddingHorizontal: 16, paddingVertical: 14,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.4, shadowRadius: 12, elevation: 8,
  },
  iconCircle: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  iconText: { fontSize: 16, fontWeight: '800' },
  textArea: { flex: 1 },
  title: { fontSize: 13, fontWeight: '700', color: Colors.textPrimary },
  body: { fontSize: 12, color: Colors.textMuted, marginTop: 2, lineHeight: 18 },
});
