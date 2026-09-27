/**
 * Fastflow Production Authentication Service
 * Communicates with Laravel Sanctum API v1 (/api/v1/auth/*, /api/v1/me)
 */

import { apiClient, ApiResponse } from './apiClient';
import { User } from '../types';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  phone?: string;
  role?: string;
}

export interface AuthSessionResponse {
  user: User;
  token: string;
  permissions?: string[];
  primary_restaurant_id?: number;
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthSessionResponse> {
    const res = await apiClient.post<AuthSessionResponse>('/auth/login', credentials);
    if (res.data?.token) {
      apiClient.setToken(res.data.token);
    }
    return res.data;
  },

  async register(payload: RegisterPayload): Promise<AuthSessionResponse> {
    const res = await apiClient.post<AuthSessionResponse>('/auth/register', payload);
    if (res.data?.token) {
      apiClient.setToken(res.data.token);
    }
    return res.data;
  },

  async logout(): Promise<void> {
    try {
      await apiClient.post('/auth/logout');
    } finally {
      apiClient.setToken(null);
    }
  },

  async getMe(): Promise<{ user: User; permissions: string[]; primary_restaurant_id?: number }> {
    const res = await apiClient.get<{ user: User; permissions: string[]; primary_restaurant_id?: number }>('/me');
    return res.data;
  },
};
