/**
 * Fastflow Production Restaurant Service
 * Communicates with Laravel RESTful API v1 for public marketplace and merchant operations
 */

import { apiClient } from './apiClient';
import { Restaurant, RestaurantHour } from '../types';

export const restaurantService = {
  // Public Marketplace
  async getPublicRestaurants(params?: { search?: string; city?: string; page?: number }): Promise<Restaurant[]> {
    const query = new URLSearchParams();
    if (params?.search) query.append('search', params.search);
    if (params?.city && params.city !== 'All') query.append('city', params.city);
    if (params?.page) query.append('page', params.page.toString());

    const endpoint = `/restaurants${query.toString() ? `?${query.toString()}` : ''}`;
    const res = await apiClient.get<{ restaurants: Restaurant[] } | Restaurant[]>(endpoint);
    if (Array.isArray(res.data)) return res.data;
    if (res.data && 'restaurants' in res.data) return res.data.restaurants;
    return [];
  },

  async getRestaurantBySlug(slug: string): Promise<Restaurant> {
    const res = await apiClient.get<Restaurant>(`/restaurants/${slug}`);
    return res.data;
  },

  // Owner Operations
  async getOwnerRestaurants(): Promise<Restaurant[]> {
    const res = await apiClient.get<Restaurant[]>('/owner/restaurants');
    return Array.isArray(res.data) ? res.data : [];
  },

  async getOwnerRestaurant(restaurantId?: number): Promise<Restaurant> {
    const endpoint = restaurantId ? `/owner/restaurants/${restaurantId}` : '/owner/restaurant';
    const res = await apiClient.get<Restaurant>(endpoint);
    return res.data;
  },

  async updateOwnerRestaurant(data: Partial<Restaurant>, restaurantId?: number): Promise<Restaurant> {
    const endpoint = restaurantId ? `/owner/restaurants/${restaurantId}` : '/owner/restaurant';
    const res = await apiClient.put<Restaurant>(endpoint, data);
    return res.data;
  },

  async getRestaurantHours(restaurantId?: number): Promise<RestaurantHour[]> {
    const endpoint = restaurantId ? `/owner/restaurants/${restaurantId}/hours` : '/owner/hours';
    const res = await apiClient.get<RestaurantHour[]>(endpoint);
    return Array.isArray(res.data) ? res.data : [];
  },

  async updateRestaurantHours(hours: RestaurantHour[], restaurantId?: number): Promise<RestaurantHour[]> {
    const endpoint = restaurantId ? `/owner/restaurants/${restaurantId}/hours` : '/owner/hours';
    const res = await apiClient.put<RestaurantHour[]>(endpoint, { hours });
    return Array.isArray(res.data) ? res.data : [];
  },

  async submitApplication(data: any): Promise<Restaurant> {
    const res = await apiClient.post<Restaurant>('/owner/restaurant', data);
    return res.data;
  },
};
