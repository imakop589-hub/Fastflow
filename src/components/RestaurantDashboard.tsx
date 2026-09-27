import React from 'react';
import {
  Store,
  Clock,
  Users,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  MapPin,
  Phone,
  DollarSign,
} from 'lucide-react';
import { backend } from '../services/mockBackend';

interface RestaurantDashboardProps {
  onNavigateSubtab: (subtab: string) => void;
}

export const RestaurantDashboard: React.FC<RestaurantDashboardProps> = ({ onNavigateSubtab }) => {
  const restaurant = backend.getOwnerRestaurant();
  const staff = restaurant ? backend.getStaffForRestaurant(restaurant.id) : [];

  if (!restaurant) {
    return (
      <div className="bg-white rounded-2xl p-8 border border-slate-200 text-center max-w-lg mx-auto space-y-4">
        <Store className="w-12 h-12 text-orange-600 mx-auto" />
        <h2 className="text-lg font-bold text-slate-800">No Restaurant Profile Associated</h2>
        <p className="text-xs text-slate-500">
          Your account is not linked to any active restaurant. Submit an onboarding application to register your restaurant.
        </p>
      </div>
    );
  }

  // Calculate profile completion score
  let score = 0;
  if (restaurant.name) score += 20;
  if (restaurant.description) score += 20;
  if (restaurant.phone && restaurant.email) score += 20;
  if (restaurant.address && restaurant.city) score += 20;
  if (restaurant.hours && restaurant.hours.length === 7) score += 20;

  const isApproved = restaurant.approval_status === 'approved';

  return (
    <div className="space-y-6">
      {/* Banner Card */}
      <div className="bg-gradient-to-r from-orange-600 to-amber-600 rounded-2xl p-6 text-white shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <img
            src={restaurant.logo}
            alt={restaurant.name}
            className="w-16 h-16 rounded-2xl object-cover border-2 border-white/40 shadow-sm"
          />
          <div>
            <div className="flex items-center space-x-2">
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                isApproved ? 'bg-white text-emerald-800' : 'bg-amber-100 text-amber-900'
              }`}>
                {restaurant.approval_status.replace('_', ' ')}
              </span>
              <span className="text-xs text-orange-100">Merchant Portal</span>
            </div>
            <h1 className="text-2xl font-black mt-1 text-white">{restaurant.name}</h1>
            <p className="text-xs text-orange-100 flex items-center space-x-1 mt-0.5">
              <MapPin className="w-3.5 h-3.5" />
              <span>{restaurant.city}, {restaurant.area} • {restaurant.address}</span>
            </p>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-xs rounded-xl p-3 border border-white/20 text-xs flex items-center space-x-4">
          <div>
            <span className="text-[10px] text-orange-200 uppercase font-semibold block">Profile Health</span>
            <span className="text-lg font-extrabold text-white">{score}% Complete</span>
          </div>
          <div className="w-16 bg-white/20 rounded-full h-2 overflow-hidden">
            <div className="bg-white h-full rounded-full" style={{ width: `${score}%` }} />
          </div>
        </div>
      </div>

      {/* Warning if Pending or Changes Requested */}
      {!isApproved && (
        <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-xl flex items-center justify-between text-xs">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />
            <div>
              <p className="font-bold text-amber-900">Application Status: {restaurant.approval_status.replace('_', ' ').toUpperCase()}</p>
              <p className="text-amber-700">
                {restaurant.rejection_reason || 'Your application is currently undergoing administrative verification. Your restaurant will appear on the marketplace once approved.'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Opening Schedule</span>
            <div className="w-8 h-8 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-extrabold text-slate-900">7 Days Configured</span>
            <p className="text-xs text-slate-500 mt-1">Split hours lunch/dinner supported</p>
          </div>
          <button
            onClick={() => onNavigateSubtab('hours')}
            className="mt-3 text-xs font-semibold text-orange-600 hover:text-orange-700 flex items-center space-x-1"
          >
            <span>Edit Weekly Schedule</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Restaurant Staff</span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-extrabold text-slate-900">{staff.length} Active Staff</span>
            <p className="text-xs text-slate-500 mt-1">Strict tenant isolation enforced</p>
          </div>
          <button
            onClick={() => onNavigateSubtab('staff')}
            className="mt-3 text-xs font-semibold text-orange-600 hover:text-orange-700 flex items-center space-x-1"
          >
            <span>Manage Staff Accounts</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Delivery Parameters</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-extrabold text-slate-900">${restaurant.delivery_fee.toFixed(2)} Fee</span>
            <p className="text-xs text-slate-500 mt-1">Min Order: ${restaurant.minimum_order_amount.toFixed(2)} • {restaurant.delivery_time_min}-{restaurant.delivery_time_max} mins</p>
          </div>
          <button
            onClick={() => onNavigateSubtab('profile')}
            className="mt-3 text-xs font-semibold text-orange-600 hover:text-orange-700 flex items-center space-x-1"
          >
            <span>Update Store Details</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
};
