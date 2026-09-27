/**
 * Fastflow Production Restaurant Staff Service
 * Communicates with Laravel RESTful API v1 for staff management
 */

import { apiClient } from './apiClient';
import { RestaurantStaff } from '../types';

export const staffService = {
  async getStaff(restaurantId?: number): Promise<RestaurantStaff[]> {
    const endpoint = restaurantId ? `/owner/restaurants/${restaurantId}/staff` : '/owner/staff';
    const res = await apiClient.get<RestaurantStaff[]>(endpoint);
    return Array.isArray(res.data) ? res.data : [];
  },

  async addStaff(
    data: { name: string; email: string; phone?: string; role: 'manager' | 'staff'; password?: string; restaurant_id?: number },
    restaurantId?: number
  ): Promise<RestaurantStaff> {
    const endpoint = restaurantId ? `/owner/restaurants/${restaurantId}/staff` : '/owner/staff';
    const res = await apiClient.post<RestaurantStaff>(endpoint, data);
    return res.data;
  },

  async toggleStaffStatus(staffId: number): Promise<RestaurantStaff> {
    const res = await apiClient.put<RestaurantStaff>(`/owner/staff/${staffId}/toggle-status`);
    return res.data;
  },

  async deleteStaff(staffId: number): Promise<void> {
    await apiClient.delete(`/owner/staff/${staffId}`);
  },
};
