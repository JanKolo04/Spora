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
}

export interface PollenReading {
  id?: number;
  concentration: number;
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
  register: (name: string, email: string, password: string, password_confirmation: string) =>
    api.post<{ user: User; token: string }>('/register', { name, email, password, password_confirmation }),

  login: (email: string, password: string) =>
    api.post<{ user: User; token: string }>('/login', { email, password }),

  logout: () => api.post('/logout'),

  getUser: () => api.get<User>('/user'),
};

export const pollenApi = {
  getAll: (region?: string) =>
    api.get<{ data: Pollen[] }>('/pollens', { params: region ? { region } : {} }),

  getById: (id: number) =>
    api.get<{ data: PollenDetail }>(`/pollens/${id}`),
};

export default api;
