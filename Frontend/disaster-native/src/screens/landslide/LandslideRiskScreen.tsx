import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  TextInput, ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '../../theme/colors';
import { predictLandslideRisk, LandslideRiskFormData, LandslideRiskAssessment } from '../../services/landslideRisk.service';
import { styles } from './LandslideRiskScreen.styles';

type FieldKey = keyof LandslideRiskFormData;
interface FieldConfig {
  key: FieldKey; label: string; unit: string; validRangeText: string;
  icon: string; min: number; max: number; step: number; isBinary?: boolean;
}

const FIELDS: FieldConfig[] = [
  { key: 'rainfall', label: 'Rainfall', unit: 'mm', validRangeText: '50 – 300 mm', icon: '🌧', min: 50, max: 300, step: 1 },
  { key: 'slopeAngle', label: 'Slope Angle', unit: '°', validRangeText: '50 – 60°', icon: '⛰', min: 50, max: 60, step: 0.5 },
  { key: 'soilSaturation', label: 'Soil Saturation', unit: 'ratio', validRangeText: '0 – 1', icon: '💧', min: 0, max: 1, step: 0.05 },
  { key: 'vegetationCover', label: 'Vegetation Cover', unit: 'ratio', validRangeText: '0 – 1', icon: '🌿', min: 0, max: 1, step: 0.05 },
  { key: 'earthquakeActivity', label: 'Earthquake Activity', unit: 'magnitude', validRangeText: '0 – 7', icon: '📈', min: 0, max: 7, step: 0.1 },
  { key: 'proximityToWater', label: 'Proximity to Water', unit: 'km', validRangeText: '0 – 2 km', icon: '🌊', min: 0, max: 2, step: 0.1 },
  { key: 'soilGravel', label: 'Soil Type: Gravel', unit: 'binary', validRangeText: '0 or 1', icon: '🪨', min: 0, max: 1, step: 1, isBinary: true },
  { key: 'soilSand', label: 'Soil Type: Sand', unit: 'binary', validRangeText: '0 or 1', icon: '🏜', min: 0, max: 1, step: 1, isBinary: true },
  { key: 'soilSilt', label: 'Soil Type: Silt', unit: 'binary', validRangeText: '0 or 1', icon: '🌰', min: 0, max: 1, step: 1, isBinary: true },
];

type FormValues = Record<FieldKey, string>;
const DEFAULT: FormValues = { rainfall: '', slopeAngle: '', soilSaturation: '', vegetationCover: '', earthquakeActivity: '', proximityToWater: '', soilGravel: '0', soilSand: '0', soilSilt: '0' };

const PRESETS = [
  { name: '🌧️ High Hazard', values: { rainfall: '260', slopeAngle: '58', soilSaturation: '0.95', vegetationCover: '0.12', earthquakeActivity: '5.4', proximityToWater: '0.3', soilGravel: '0', soilSand: '0', soilSilt: '1' } },
  { name: '⚠️ Moderate Slope', values: { rainfall: '160', slopeAngle: '54', soilSaturation: '0.65', vegetationCover: '0.45', earthquakeActivity: '2.8', proximityToWater: '0.9', soilGravel: '0', soilSand: '1', soilSilt: '0' } },
  { name: '🛡️ Stable Terrain', values: { rainfall: '60', slopeAngle: '51', soilSaturation: '0.15', vegetationCover: '0.90', earthquakeActivity: '0.4', proximityToWater: '1.8', soilGravel: '1', soilSand: '0', soilSilt: '0' } },
];

const RISK_STYLES: Record<string, { bg: string; border: string; text: string; badge: string }> = {
  Critical: { bg: 'rgba(127,0,0,0.25)', border: 'rgba(239,68,68,0.5)', text: '#fca5a5', badge: '#ef4444' },
  High: { bg: 'rgba(127,60,0,0.25)', border: 'rgba(249,115,22,0.5)', text: '#fdba74', badge: '#f97316' },
  Moderate: { bg: 'rgba(127,100,0,0.25)', border: 'rgba(245,158,11,0.5)', text: '#fcd34d', badge: '#d97706' },
  Low: { bg: 'rgba(0,80,40,0.25)', border: 'rgba(52,211,153,0.5)', text: '#6ee7b7', badge: '#10b981' },
};

export default function LandslideRiskScreen() {
  const router = useRouter();
  const [values, setValues] = useState<FormValues>(DEFAULT);
  const [isPredicting, setIsPredicting] = useState(false);
  const [assessment, setAssessment] = useState<LandslideRiskAssessment | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);

  const updateField = (key: FieldKey, val: string) => setValues((prev) => ({ ...prev, [key]: val }));
  const applyPreset = (preset: typeof PRESETS[0]) => { setValues({ ...preset.values }); setAssessment(null); setServerError(null); };
  const handleReset = () => { setValues({ ...DEFAULT }); setAssessment(null); setServerError(null); };

  const handlePredict = async () => {
    setServerError(null);
    const parsedData: LandslideRiskFormData = {
      rainfall: values.rainfall === '' ? NaN : Number(values.rainfall),
      slopeAngle: values.slopeAngle === '' ? NaN : Number(values.slopeAngle),
      soilSaturation: values.soilSaturation === '' ? NaN : Number(values.soilSaturation),
      vegetationCover: values.vegetationCover === '' ? NaN : Number(values.vegetationCover),
      earthquakeActivity: values.earthquakeActivity === '' ? NaN : Number(values.earthquakeActivity),
      proximityToWater: values.proximityToWater === '' ? NaN : Number(values.proximityToWater),
      soilGravel: Number(values.soilGravel),
      soilSand: Number(values.soilSand),
      soilSilt: Number(values.soilSilt),
    };
    const hasNaN = Object.values(parsedData).some((v) => typeof v === 'number' && isNaN(v));
    if (hasNaN) { setServerError('Please fill all numeric fields before running the assessment.'); return; }
    setIsPredicting(true);
    try {
      const result = await predictLandslideRisk(parsedData);
      setAssessment(result);
    } catch (err) {
      setServerError(err instanceof Error ? err.message : 'Failed to run AI prediction. Please try again.');
    } finally {
      setIsPredicting(false);
    }
  };

  const riskStyle = assessment ? (RISK_STYLES[assessment.riskLevel] ?? RISK_STYLES.Low) : null;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backBtnText}>← Back</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {/* Hero Banner */}
        <View style={styles.heroBanner}>
          <View style={styles.heroBadge}>
            <Text style={styles.heroBadgeText}>⚡ AI-Based Landslide Risk Assessment</Text>
          </View>
          <Text style={styles.heroTitle}>Predict Landslide Vulnerability</Text>
          <Text style={styles.heroSubtitle}>Submit geological, seismic, and hydrological telemetry to run real-time inference.</Text>
        </View>

        {/* Presets */}
        <Text style={styles.sectionLabel}>Quick Load Preset Scenarios</Text>
        <View style={styles.presetsRow}>
          {PRESETS.map((preset) => (
            <TouchableOpacity key={preset.name} style={styles.presetBtn} onPress={() => applyPreset(preset)}>
              <Text style={styles.presetBtnText}>{preset.name}</Text>
              <Text style={styles.presetLoad}>LOAD</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Input Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Geotechnical & Climate Parameters</Text>
            <TouchableOpacity style={styles.resetBtn} onPress={handleReset}>
              <Text style={styles.resetBtnText}>↺ Reset</Text>
            </TouchableOpacity>
          </View>

          {serverError && (
            <View style={styles.errorBanner}>
              <Text style={styles.errorBannerText}>⚠ {serverError}</Text>
            </View>
          )}

          {FIELDS.map((field) => (
            <View key={field.key} style={styles.fieldBlock}>
              <View style={styles.fieldHeader}>
                <Text style={styles.fieldLabel}>{field.icon} {field.label}</Text>
                <Text style={styles.fieldRange}>{field.validRangeText}</Text>
              </View>
              {field.isBinary ? (
                <View style={styles.binaryRow}>
                  {[0, 1].map((opt) => (
                    <TouchableOpacity
                      key={opt}
                      style={[styles.binaryBtn, Number(values[field.key]) === opt && styles.binaryBtnActive]}
                      onPress={() => updateField(field.key, String(opt))}
                    >
                      <Text style={[styles.binaryBtnText, Number(values[field.key]) === opt && styles.binaryBtnTextActive]}>
                        {opt === 0 ? '0 — No' : '1 — Yes'}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              ) : (
                <View style={styles.numInputRow}>
                  <TextInput
                    style={styles.numInput}
                    keyboardType="numeric"
                    placeholder={`e.g. ${field.min}`}
                    placeholderTextColor={Colors.textMuted}
                    value={values[field.key]}
                    onChangeText={(val) => updateField(field.key, val)}
                  />
                  <Text style={styles.unitLabel}>{field.unit}</Text>
                </View>
              )}
            </View>
          ))}

          <TouchableOpacity
            style={[styles.predictBtn, isPredicting && styles.predictBtnDisabled]}
            onPress={handlePredict}
            disabled={isPredicting}
          >
            {isPredicting ? (
              <ActivityIndicator color="#09170E" />
            ) : (
              <Text style={styles.predictBtnText}>🧠 Run AI Risk Assessment</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Results Card */}
        {assessment && riskStyle && (
          <View style={[styles.card, styles.resultCard, { backgroundColor: riskStyle.bg, borderColor: riskStyle.border }]}>
            <View style={styles.resultHeader}>
              <Text style={styles.resultHeaderLabel}>Assessed Risk Level</Text>
              <View style={[styles.riskBadge, { backgroundColor: riskStyle.badge }]}>
                <Text style={styles.riskBadgeText}>{assessment.riskLevel}</Text>
              </View>
            </View>
            <Text style={[styles.riskLevelText, { color: riskStyle.text }]}>
              {assessment.riskLevel === 'Critical' ? 'Hazard Alert' :
                assessment.riskLevel === 'High' ? 'Elevated Risk' :
                  assessment.riskLevel === 'Moderate' ? 'Moderate Alert' : 'Stable Terrain'}
            </Text>

            <View style={styles.recommendationCard}>
              <Text style={styles.recommendationLabel}>✅ Operational Action Directive</Text>
              <Text style={styles.recommendationText}>{assessment.recommendation}</Text>
            </View>

            <View style={styles.metaRow}>
              <Text style={styles.metaLabel}>Probability Score</Text>
              <Text style={styles.metaValue}>{assessment.probability.toFixed(1)}%</Text>
            </View>
            <View style={styles.metaRow}>
              <Text style={styles.metaLabel}>Evaluated At</Text>
              <Text style={styles.metaValue}>{assessment.evaluatedAt}</Text>
            </View>
          </View>
        )}

        {/* Protocol Note */}
        <View style={styles.protocolNote}>
          <Text style={styles.protocolTitle}>✅ Verified Geotechnical Envelope</Text>
          <Text style={styles.protocolText}>
            In accordance with disaster monitoring protocol, calculations adhere to valid parameter envelopes
            (Rainfall: 50–300 mm, Slope: 50–60°, Soil Saturation: 0–1, Earthquakes: 0–7 magnitude).
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}
