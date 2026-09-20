import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = (process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:8000').replace(/\/$/, '');
const GOVT_TOKEN_KEY = 'geo-rakshak:govt-token';

function decodeJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64).split('').map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join('')
    );
    return JSON.parse(jsonPayload);
  } catch { return null; }
}

export async function getGovtToken(): Promise<string | null> {
  return AsyncStorage.getItem(GOVT_TOKEN_KEY);
}

export async function setGovtToken(token: string): Promise<void> {
  await AsyncStorage.setItem(GOVT_TOKEN_KEY, token);
}

export async function removeGovtToken(): Promise<void> {
  await AsyncStorage.removeItem(GOVT_TOKEN_KEY);
}

export interface GovtUser {
  email: string;
  gov_id: string;
  full_name: string;
  department: string;
  role: string;
}

export async function getGovtUser(): Promise<GovtUser | null> {
  const token = await getGovtToken();
  if (!token) return null;
  const payload = decodeJwtPayload(token);
  if (!payload || payload.role !== 'govt') return null;
  return {
    email: (payload.email as string) ?? '',
    gov_id: (payload.gov_id as string) ?? '',
    full_name: (payload.full_name as string) ?? '',
    department: (payload.department as string) ?? '',
    role: 'govt',
  };
}

export async function govtLogout(): Promise<void> {
  await removeGovtToken();
}

export async function govtLoginApi(email: string, password: string) {
  const resp = await fetch(`${API_BASE_URL}/api/govt/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const data = await resp.json().catch(() => null);
  if (!resp.ok) throw new Error(data?.detail || `Login failed (${resp.status})`);
  if (data?.token) await setGovtToken(data.token);
  return data;
}

export async function govtSignupApi(email: string, password: string, full_name: string, department: string) {
  const resp = await fetch(`${API_BASE_URL}/api/govt/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, full_name, department }),
  });
  const data = await resp.json().catch(() => null);
  if (!resp.ok) throw new Error(data?.detail || `Signup failed (${resp.status})`);
  if (data?.token) await setGovtToken(data.token);
  return data;
}

export async function fetchGovtReports() {
  const token = await getGovtToken();
  const resp = await fetch(`${API_BASE_URL}/api/govt/reports`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!resp.ok) throw new Error(`Failed to fetch reports (${resp.status})`);
  return resp.json();
}

export async function fetchGovtProfile() {
  const token = await getGovtToken();
  const resp = await fetch(`${API_BASE_URL}/api/govt/profile`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!resp.ok) throw new Error(`Failed to fetch profile (${resp.status})`);
  return resp.json();
}
