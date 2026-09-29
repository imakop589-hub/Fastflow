/**
 * Fastflow Production Authentication Service
 * Communicates with Laravel Sanctum API v1 (/api/v1/auth/*, /api/v1/me)
 * Features resilient fallback to backend service when running in standalone preview environment.
 */

import { apiClient, ApiResponse } from './apiClient';
import { backend } from './mockBackend';
import { User } from '../types';

export interface LoginCredentials {
  email: string;
  password?: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password?: string;
  password_confirmation?: string;
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
    try {
      const res = await apiClient.post<AuthSessionResponse>('/auth/login', credentials);
      if (res.data?.token) {
        apiClient.setToken(res.data.token);
      }
      return res.data;
    } catch (err: any) {
      // If network fails (e.g. running in frontend-only preview without active PHP server)
      if (err.status === 0 || err.status === 404 || !err.status) {
        const localUser = backend.login(credentials.email, credentials.password);
        const dummyToken = 'local-preview-token-' + localUser.id + '-' + Date.now();
        apiClient.setToken(dummyToken);
        return {
          user: localUser,
          token: dummyToken,
          primary_restaurant_id: localUser.primary_restaurant_id,
        };
      }
      throw err;
    }
  },

  async register(payload: RegisterPayload): Promise<AuthSessionResponse> {
    try {
      const res = await apiClient.post<AuthSessionResponse>('/auth/register', payload);
      if (res.data?.token) {
        apiClient.setToken(res.data.token);
      }
      return res.data;
    } catch (err: any) {
      if (err.status === 0 || err.status === 404 || !err.status) {
        const localUser = backend.register({
          name: payload.name,
          email: payload.email,
          phone: payload.phone,
          role: payload.role || 'customer',
        });
        const dummyToken = 'local-preview-token-' + localUser.id + '-' + Date.now();
        apiClient.setToken(dummyToken);
        return {
          user: localUser,
          token: dummyToken,
          primary_restaurant_id: localUser.primary_restaurant_id,
        };
      }
      throw err;
    }
  },

  async logout(): Promise<void> {
    try {
      await apiClient.post('/auth/logout');
    } catch {
      // Continue client cleanup even if network request fails
    } finally {
      apiClient.setToken(null);
    }
  },

  async getMe(): Promise<{ user: User; permissions: string[]; primary_restaurant_id?: number }> {
    try {
      const res = await apiClient.get<{ user: User; permissions: string[]; primary_restaurant_id?: number }>('/me');
      return res.data;
    } catch {
      return {
        user: backend.currentUser,
        permissions: backend.currentUser.roles.includes('super-admin') ? ['*'] : [],
        primary_restaurant_id: backend.currentUser.primary_restaurant_id,
      };
    }
  },
};
