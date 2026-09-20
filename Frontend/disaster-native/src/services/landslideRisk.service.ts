import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = (process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:8000').replace(/\/$/, '');
const TOKEN_KEY = 'geo-rakshak:access-token';

export interface LandslideRiskFormData {
  rainfall: number;
  slopeAngle: number;
  soilSaturation: number;
  vegetationCover: number;
  earthquakeActivity: number;
  proximityToWater: number;
  soilGravel: number;
  soilSand: number;
  soilSilt: number;
}

export interface LandslideRiskAssessment {
  riskLevel: 'Critical' | 'High' | 'Moderate' | 'Low';
  isHazard: boolean;
  probability: number;
  prediction: number;
  recommendation: string;
  evaluatedAt: string;
}

function mapFormToPayload(data: LandslideRiskFormData) {
  return {
    Rainfall_mm: data.rainfall,
    Slope_Angle: data.slopeAngle,
    Soil_Saturation: data.soilSaturation,
    Vegetation_Cover: data.vegetationCover,
    Earthquake_Activity: data.earthquakeActivity,
    Proximity_to_Water: data.proximityToWater,
    Soil_Type_Gravel: data.soilGravel,
    Soil_Type_Sand: data.soilSand,
    Soil_Type_Silt: data.soilSilt,
  };
}

function calculateFallbackPrediction(data: ReturnType<typeof mapFormToPayload>) {
  const rainWeight = (Math.min(300, data.Rainfall_mm) / 250.0) * 35.0;
  const slopeWeight = (Math.min(65, data.Slope_Angle) / 60.0) * 30.0;
  const satWeight = data.Soil_Saturation * 25.0;
  const eqWeight = (Math.min(7, data.Earthquake_Activity) / 7.0) * 15.0;
  const vegOffset = data.Vegetation_Cover * 15.0;
  const soilBonus = data.Soil_Type_Silt === 1 ? 10.0 : data.Soil_Type_Sand === 1 ? 5.0 : 0;
  const score = rainWeight + slopeWeight + satWeight + eqWeight - vegOffset + soilBonus;
  const probability = Math.min(99.0, Math.max(5.0, Math.round(score * 10) / 10));
  return { success: true, prediction: probability >= 50.0 ? 1 : 0, probability };
}

function deriveAssessment(prediction: number, probability: number) {
  const isHazard = prediction === 1 || probability >= 50;
  let riskLevel: 'Critical' | 'High' | 'Moderate' | 'Low' = 'Low';
  let recommendation = 'Terrain conditions are stable. Standard routine surveillance advised.';
  if (probability >= 75) {
    riskLevel = 'High';
    recommendation = 'CRITICAL: High probability of slope failure detected. Issue slope warning, alert disaster management teams, and prepare evacuation corridors.';
  } else if (probability >= 45 || isHazard) {
    riskLevel = 'Moderate';
    recommendation = 'WARNING: Elevated slope instability detected. Deploy drone surveillance, inspect drainage channels, and monitor precipitation closely.';
  }
  return { riskLevel, isHazard, recommendation };
}

export async function predictLandslideRisk(formData: LandslideRiskFormData): Promise<LandslideRiskAssessment> {
  const payload = mapFormToPayload(formData);
  const token = await AsyncStorage.getItem(TOKEN_KEY);
  let rawData: any;
  try {
    const response = await fetch(`${API_BASE_URL}/api/ai-prediction`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      const fallbackResponse = await fetch(`${API_BASE_URL}/ai-prediction`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });
      rawData = fallbackResponse.ok ? await fallbackResponse.json() : calculateFallbackPrediction(payload);
    } else {
      rawData = await response.json();
    }
  } catch {
    rawData = calculateFallbackPrediction(payload);
  }
  const { riskLevel, isHazard, recommendation } = deriveAssessment(rawData.prediction, rawData.probability);
  return {
    riskLevel,
    isHazard,
    probability: rawData.probability,
    prediction: rawData.prediction,
    recommendation,
    evaluatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
  };
}
