import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  ActivityIndicator, ScrollView,
} from 'react-native';
import { Colors } from '../theme/colors';

interface DisasterTypeOption { type: string; icon: string }

interface IncidentReportFormProps {
  disasterTypes: DisasterTypeOption[];
  onSubmit?: (data: { location: string; disasterType: string; description?: string }) => Promise<{ success: boolean; message: string }>;
  isLoading?: boolean;
}

export default function IncidentReportForm({ disasterTypes, onSubmit, isLoading = false }: IncidentReportFormProps) {
  const [location, setLocation] = useState('');
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async () => {
    if (!location.trim() || !selectedType) {
      setErrorMessage('Please enter a location and select a disaster type.');
      return;
    }
    setErrorMessage('');
    if (!onSubmit) {
      setSuccess(true);
      setSuccessMessage(`${selectedType} reported at ${location}. Nearest response team notified.`);
      resetForm();
      return;
    }
    try {
      setSubmitting(true);
      const result = await onSubmit({ location, disasterType: selectedType, description });
      if (result.success) {
        setSuccess(true);
        setSuccessMessage(result.message);
        resetForm();
      } else {
        setErrorMessage(result.message);
      }
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Failed to submit report. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setLocation('');
    setSelectedType(null);
    setDescription('');
    setTimeout(() => setSuccess(false), 4000);
  };

  return (
    <View style={styles.card}>
      {/* Header */}
      <Text style={styles.categoryLabel}>Community Report</Text>
      <Text style={styles.cardTitle}>Report an incident</Text>
      <Text style={styles.cardSubtitle}>
        Enter your location and hazard type to alert the nearest response team.
      </Text>

      {/* Location */}
      <Text style={styles.fieldLabel}>Your location</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g. Sonapur Ridge, Guwahati"
        placeholderTextColor="rgba(138,166,143,0.5)"
        value={location}
        onChangeText={setLocation}
        editable={!isLoading && !submitting}
      />

      {/* Disaster Type */}
      <Text style={styles.fieldLabel}>Disaster type</Text>
      <View style={styles.typeGrid}>
        {disasterTypes.map((dtype) => {
          const selected = selectedType === dtype.type;
          return (
            <TouchableOpacity
              key={dtype.type}
              style={[styles.typeBtn, selected && styles.typeBtnSelected]}
              onPress={() => setSelectedType(dtype.type)}
              disabled={isLoading || submitting}
            >
              <Text style={styles.typeIcon}>{dtype.icon}</Text>
              <Text style={[styles.typeLabel, selected && styles.typeLabelSelected]}>{dtype.type}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Description */}
      <Text style={styles.fieldLabel}>Additional details (optional)</Text>
      <TextInput
        style={[styles.input, styles.textarea]}
        placeholder="Describe the hazard conditions..."
        placeholderTextColor="rgba(138,166,143,0.5)"
        multiline
        numberOfLines={3}
        maxLength={500}
        value={description}
        onChangeText={setDescription}
        editable={!isLoading && !submitting}
      />
      <Text style={styles.charCount}>{description.length}/500</Text>

      {/* Feedback */}
      {errorMessage !== '' && (
        <View style={styles.errorBanner}>
          <Text style={styles.errorText}>{errorMessage}</Text>
        </View>
      )}
      {success && (
        <View style={styles.successBanner}>
          <Text style={styles.successText}>✓ {successMessage}</Text>
        </View>
      )}

      {/* Buttons */}
      <View style={styles.actionRow}>
        <TouchableOpacity
          style={[styles.submitBtn, (!location || !selectedType || submitting || isLoading) && styles.submitBtnDisabled]}
          onPress={handleSubmit}
          disabled={!location || !selectedType || submitting || isLoading}
        >
          {submitting ? (
            <ActivityIndicator color="#102419" />
          ) : (
            <Text style={styles.submitBtnText}>Submit report</Text>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.clearBtn}
          onPress={() => { resetForm(); setErrorMessage(''); }}
          disabled={submitting}
        >
          <Text style={styles.clearBtnText}>Clear</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: 'rgba(16,36,25,0.87)', borderRadius: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', padding: 18 },
  categoryLabel: { fontSize: 11, fontWeight: '700', color: Colors.gold, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 4 },
  cardTitle: { fontSize: 20, fontWeight: '700', color: Colors.textPrimary, marginBottom: 4 },
  cardSubtitle: { fontSize: 13, color: Colors.textMuted, lineHeight: 19, marginBottom: 20 },
  fieldLabel: { fontSize: 11, fontWeight: '700', color: Colors.textSecondary, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 8 },
  input: {
    backgroundColor: 'rgba(23,49,35,0.9)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.12)',
    borderRadius: 14, paddingHorizontal: 14, paddingVertical: 12, fontSize: 13, color: Colors.textPrimary, marginBottom: 16,
  },
  textarea: { textAlignVertical: 'top', height: 80 },
  charCount: { textAlign: 'right', fontSize: 10, color: Colors.textMuted, marginTop: -12, marginBottom: 14 },
  typeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  typeBtn: {
    flex: 1, minWidth: '22%', borderWidth: 1, borderColor: 'rgba(255,255,255,0.12)',
    backgroundColor: 'rgba(23,49,35,0.8)', borderRadius: 14, padding: 12, alignItems: 'center',
  },
  typeBtnSelected: { borderColor: Colors.orange, backgroundColor: 'rgba(224,138,62,0.2)' },
  typeIcon: { fontSize: 22, marginBottom: 4 },
  typeLabel: { fontSize: 11, fontWeight: '600', color: Colors.textSecondary, textAlign: 'center' },
  typeLabelSelected: { color: Colors.textPrimary },
  errorBanner: { borderRadius: 12, borderWidth: 1, borderColor: 'rgba(239,68,68,0.4)', backgroundColor: 'rgba(127,0,0,0.3)', padding: 12, marginBottom: 12 },
  errorText: { color: '#fca5a5', fontSize: 12 },
  successBanner: { borderRadius: 12, borderWidth: 1, borderColor: 'rgba(52,211,153,0.4)', backgroundColor: 'rgba(0,60,30,0.4)', padding: 12, marginBottom: 12 },
  successText: { color: '#6ee7b7', fontSize: 12 },
  actionRow: { flexDirection: 'row', gap: 10, marginTop: 4 },
  submitBtn: { flex: 1, backgroundColor: Colors.gold, borderRadius: 14, paddingVertical: 14, alignItems: 'center' },
  submitBtnDisabled: { opacity: 0.45 },
  submitBtnText: { color: '#102419', fontSize: 13, fontWeight: '700' },
  clearBtn: { backgroundColor: 'rgba(23,49,35,0.8)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.12)', borderRadius: 14, paddingHorizontal: 18, paddingVertical: 14, alignItems: 'center', justifyContent: 'center' },
  clearBtnText: { color: Colors.textSecondary, fontSize: 13, fontWeight: '600' },
});
