export type UserStatus = 'active' | 'inactive' | 'suspended';
export type RestaurantStatus = 'active' | 'inactive' | 'suspended';
export type ApprovalStatus = 'pending' | 'approved' | 'rejected' | 'changes_requested';

export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  status: UserStatus;
  roles: string[]; // e.g. ['super-admin'], ['restaurant-owner']
  primary_restaurant_id?: number;
  created_at: string;
  last_login_at?: string;
}

export interface Permission {
  id: number;
  name: string;
  slug: string;
  module: string;
  description?: string;
}

export interface Role {
  id: number;
  name: string;
  slug: string;
  description: string;
  is_system: boolean;
  permissions: string[]; // slugs
}

export interface LocationItem {
  id: number;
  name: string;
  slug: string;
}

export interface RestaurantHour {
  id: number;
  restaurant_id: number;
  day_of_week: number; // 1 (Mon) to 7 (Sun)
  day_name: string;
  is_open: boolean;
  open_time: string;
  close_time: string;
  first_open?: string;
  first_close?: string;
  second_open?: string;
  second_close?: string;
}

export interface RestaurantStaff {
  id: number;
  restaurant_id: number;
  user_id: number;
  name: string;
  email: string;
  phone?: string;
  role: 'manager' | 'staff';
  status: 'active' | 'inactive';
  created_at: string;
}

export interface Restaurant {
  id: number;
  owner_id: number;
  owner_name?: string;
  owner_email?: string;
  name: string;
  slug: string;
  logo: string;
  cover_image: string;
  description: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  area: string;
  postal_code?: string;
  latitude: number;
  longitude: number;
  status: RestaurantStatus;
  approval_status: ApprovalStatus;
  rejection_reason?: string;
  minimum_order_amount: number;
  delivery_time_min: number;
  delivery_time_max: number;
  delivery_fee: number;
  approved_at?: string;
  created_at: string;
  hours?: RestaurantHour[];
}

export interface Setting {
  id: number;
  key: string;
  value: string;
  type: 'string' | 'integer' | 'boolean' | 'json';
  group: 'general' | 'branding' | 'localization' | 'currency' | 'delivery' | 'tax' | 'seo';
  is_public: boolean;
}

export interface AuditLog {
  id: number;
  user_id?: number;
  user_name: string;
  user_email?: string;
  action: string;
  module: string;
  record_type?: string;
  record_id?: number;
  description: string;
  changes?: Record<string, any>;
  ip_address: string;
  user_agent: string;
  created_at: string;
}
