/**
 * Fastflow Production Administration Service
 * Communicates with Laravel RESTful API v1 for platform governance
 */

import { apiClient } from './apiClient';
import { AuditLog, Permission, Restaurant, Role, Setting, User } from '../types';

export const adminService = {
  async getDashboard(): Promise<any> {
    const res = await apiClient.get('/admin/dashboard');
    return res.data;
  },

  async getRestaurants(params?: { approval_status?: string; status?: string; search?: string; page?: number }): Promise<any> {
    const query = new URLSearchParams();
    if (params?.approval_status) query.append('approval_status', params.approval_status);
    if (params?.status) query.append('status', params.status);
    if (params?.search) query.append('search', params.search);
    if (params?.page) query.append('page', params.page.toString());

    const res = await apiClient.get(`/admin/restaurants${query.toString() ? `?${query.toString()}` : ''}`);
    return res.data;
  },

  async approveRestaurant(restaurantId: number): Promise<Restaurant> {
    const res = await apiClient.post<Restaurant>(`/admin/restaurants/${restaurantId}/approve`);
    return res.data;
  },

  async rejectRestaurant(restaurantId: number, reason: string): Promise<Restaurant> {
    const res = await apiClient.post<Restaurant>(`/admin/restaurants/${restaurantId}/reject`, { reason });
    return res.data;
  },

  async requestChanges(restaurantId: number, notes: string): Promise<Restaurant> {
    const res = await apiClient.post<Restaurant>(`/admin/restaurants/${restaurantId}/request-changes`, { reason: notes });
    return res.data;
  },

  async suspendRestaurant(restaurantId: number): Promise<Restaurant> {
    const res = await apiClient.post<Restaurant>(`/admin/restaurants/${restaurantId}/suspend`);
    return res.data;
  },

  async activateRestaurant(restaurantId: number): Promise<Restaurant> {
    const res = await apiClient.post<Restaurant>(`/admin/restaurants/${restaurantId}/activate`);
    return res.data;
  },

  async getUsers(params?: { search?: string; status?: string; role?: string }): Promise<User[]> {
    const query = new URLSearchParams();
    if (params?.search) query.append('search', params.search);
    if (params?.status) query.append('status', params.status);
    if (params?.role) query.append('role', params.role);

    const res = await apiClient.get<User[]>(`/admin/users${query.toString() ? `?${query.toString()}` : ''}`);
    return Array.isArray(res.data) ? res.data : [];
  },

  async toggleUserStatus(userId: number): Promise<User> {
    const res = await apiClient.put<User>(`/admin/users/${userId}`);
    return res.data;
  },

  async getRoles(): Promise<Role[]> {
    const res = await apiClient.get<Role[]>('/admin/roles');
    return Array.isArray(res.data) ? res.data : [];
  },

  async updateRolePermissions(roleId: number, permissions: string[]): Promise<Role> {
    const res = await apiClient.put<Role>(`/admin/roles/${roleId}/permissions`, { permissions });
    return res.data;
  },

  async getSettings(): Promise<Setting[]> {
    const res = await apiClient.get<Setting[]>('/admin/settings');
    return Array.isArray(res.data) ? res.data : [];
  },

  async updateSetting(key: string, value: string): Promise<Setting> {
    const res = await apiClient.put<Setting>('/admin/settings', { settings: [{ key, value }] });
    return res.data;
  },

  async getAuditLogs(): Promise<AuditLog[]> {
    const res = await apiClient.get<AuditLog[]>('/admin/audit-logs');
    return Array.isArray(res.data) ? res.data : [];
  },
};
