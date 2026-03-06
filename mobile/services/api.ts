import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const API_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

api.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface User {
  id: number;
  name: string;
  email: string;
  date_of_birth: string | null;
  weight: number | null;
  height: number | null;
  allergen_ids: number[];
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  date_of_birth?: string;
  weight?: number;
  height?: number;
  allergen_ids?: number[];
}

export interface ProfileUpdateData {
  name?: string;
  date_of_birth?: string | null;
  weight?: number | null;
  height?: number | null;
}

export interface SymptomReport {
  id: number;
  report_date: string;
  severity: string;
  symptoms: string[];
  notes: string | null;
  created_at: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

export interface MedicationReminder {
  id: number;
  medication_name: string;
  dosage: string | null;
  remind_at: string;
  days_of_week: number[];
  is_active: boolean;
  created_at: string;
}

export interface WellnessEntry {
  id: number;
  entry_date: string;
  rating: number;
  symptoms: string[] | null;
  notes: string | null;
  created_at: string;
}

export interface PollenReading {
  id?: number;
  concentration: number;
  quantity: number | null;
  multiplier: number | null;
  result: number | null;
  pollen_percentage: number | null;
  level: string;
  region: string;
  reading_date: string;
}

export interface Pollen {
  id: number;
  name: string;
  icon: string;
  description: string;
  latest_reading: PollenReading | null;
}

export interface PollenDetail extends Pollen {
  readings: PollenReading[];
}

export const authApi = {
  register: (data: RegisterData) =>
    api.post<{ user: User; token: string }>('/register', data),

  login: (email: string, password: string) =>
    api.post<{ user: User; token: string }>('/login', { email, password }),

  logout: () => api.post('/logout'),

  getUser: () => api.get<{ data: User }>('/user'),
};

export interface DashboardData {
  pollens_count: number;
  readings_count: number;
  today_readings_count: number;
  level_distribution: Record<string, number>;
  last_7_days: { date: string; count: number; avg_concentration: number }[];
  top_pollens: { id: number; name: string; icon: string; readings_count: number; latest_level: string | null; latest_concentration: number | null }[];
  high_alerts: { pollen_name: string; pollen_icon: string; concentration: number; level: string; region: string; reading_date: string }[];
}

export const dashboardApi = {
  get: () => api.get<{ data: DashboardData }>('/dashboard'),
};

export const pollenApi = {
  getAll: (region?: string) =>
    api.get<{ data: Pollen[] }>('/pollens', { params: region ? { region } : {} }),

  getById: (id: number) =>
    api.get<{ data: PollenDetail }>(`/pollens/${id}`),
};

export const profileApi = {
  update: (data: ProfileUpdateData) =>
    api.put<{ data: User }>('/profile', data),

  updateAllergens: (allergen_ids: number[]) =>
    api.put<{ data: User }>('/profile/allergens', { allergen_ids }),
};

export const symptomReportApi = {
  getAll: (page: number = 1) =>
    api.get<PaginatedResponse<SymptomReport>>('/symptom-reports', { params: { page } }),

  create: (data: { report_date: string; severity: string; symptoms: string[]; notes?: string }) =>
    api.post<{ data: SymptomReport }>('/symptom-reports', data),

  delete: (id: number) =>
    api.delete(`/symptom-reports/${id}`),
};

export const medicationApi = {
  getAll: () =>
    api.get<{ data: MedicationReminder[] }>('/medication-reminders'),

  create: (data: { medication_name: string; dosage?: string; remind_at: string; days_of_week: number[] }) =>
    api.post<{ data: MedicationReminder }>('/medication-reminders', data),

  update: (id: number, data: Partial<{ medication_name: string; dosage: string; remind_at: string; days_of_week: number[]; is_active: boolean }>) =>
    api.put<{ data: MedicationReminder }>(`/medication-reminders/${id}`, data),

  delete: (id: number) =>
    api.delete(`/medication-reminders/${id}`),
};

export const wellnessApi = {
  getAll: (page: number = 1) =>
    api.get<PaginatedResponse<WellnessEntry>>('/wellness-entries', { params: { page } }),

  create: (data: { entry_date: string; rating: number; symptoms?: string[]; notes?: string }) =>
    api.post<{ data: WellnessEntry }>('/wellness-entries', data),

  delete: (id: number) =>
    api.delete(`/wellness-entries/${id}`),
};

export default api;
