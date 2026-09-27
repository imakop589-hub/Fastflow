import React from 'react';
import {
  X,
  MapPin,
  Clock,
  Phone,
  Mail,
  ShieldCheck,
  Calendar,
  Utensils,
  DollarSign,
} from 'lucide-react';
import { Restaurant } from '../types';

interface RestaurantDetailModalProps {
  restaurant: Restaurant | null;
  onClose: () => void;
}

export const RestaurantDetailModal: React.FC<RestaurantDetailModalProps> = ({ restaurant, onClose }) => {
  if (!restaurant) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
        {/* Header Cover */}
        <div className="relative h-52 bg-slate-900 flex-shrink-0">
          <img
            src={restaurant.cover_image}
            alt={restaurant.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/30" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full backdrop-blur-xs transition"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Title & Badge */}
          <div className="absolute bottom-4 left-6 right-6 flex items-end justify-between">
            <div className="flex items-center space-x-3">
              <img
                src={restaurant.logo}
                alt={restaurant.name}
                className="w-14 h-14 rounded-2xl object-cover border-2 border-white shadow-md bg-white"
              />
              <div className="text-white">
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/90 text-white flex items-center space-x-1">
                    <ShieldCheck className="w-3 h-3" />
                    <span>Verified Partner</span>
                  </span>
                  <span className="text-xs text-slate-300 font-mono">/{restaurant.slug}</span>
                </div>
                <h2 className="text-2xl font-black text-white">{restaurant.name}</h2>
              </div>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 flex-1 overflow-y-auto text-xs">
          {/* Summary Badges */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-center">
              <span className="text-[10px] text-slate-400 font-semibold uppercase block">Est. Delivery</span>
              <span className="text-sm font-black text-slate-900">
                {restaurant.delivery_time_min} - {restaurant.delivery_time_max} mins
              </span>
            </div>
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-center">
              <span className="text-[10px] text-slate-400 font-semibold uppercase block">Delivery Fee</span>
              <span className="text-sm font-black text-slate-900">${restaurant.delivery_fee.toFixed(2)}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-center">
              <span className="text-[10px] text-slate-400 font-semibold uppercase block">Minimum Order</span>
              <span className="text-sm font-black text-slate-900">${restaurant.minimum_order_amount.toFixed(2)}</span>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <h3 className="font-bold text-slate-800 text-sm">About the Restaurant</h3>
            <p className="text-slate-600 leading-relaxed bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
              {restaurant.description}
            </p>
          </div>

          {/* Address & Contact */}
          <div className="p-4 bg-orange-50/60 rounded-2xl border border-orange-100 space-y-2 text-slate-700">
            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-orange-600 flex-shrink-0" />
              <span>{restaurant.address}, {restaurant.area}, {restaurant.city}</span>
            </div>
            <div className="flex items-center space-x-2 text-[11px] text-slate-600">
              <Phone className="w-3.5 h-3.5 text-orange-600" />
              <span>{restaurant.phone}</span>
              <span className="text-slate-300">•</span>
              <Mail className="w-3.5 h-3.5 text-orange-600" />
              <span>{restaurant.email}</span>
            </div>
          </div>

          {/* 7-Day Operating Hours */}
          <div className="space-y-2">
            <h3 className="font-bold text-slate-800 text-sm flex items-center space-x-1.5">
              <Calendar className="w-4 h-4 text-slate-500" />
              <span>Weekly Service Schedule</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {restaurant.hours?.map((h) => (
                <div
                  key={h.id}
                  className="p-2.5 rounded-xl border border-slate-100 bg-slate-50 flex items-center justify-between"
                >
                  <span className="font-bold text-slate-800">{h.day_name}</span>
                  <span className={h.is_open ? 'font-semibold text-emerald-700' : 'text-slate-400 italic'}>
                    {h.is_open ? `${h.open_time} - ${h.close_time}` : 'Closed'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Phase 2 Placeholder Banner */}
          <div className="p-4 rounded-2xl bg-slate-900 text-slate-300 flex items-center justify-between">
            <div className="space-y-0.5">
              <p className="font-bold text-white text-xs">Food Menu & Cart (Phase 2)</p>
              <p className="text-[11px] text-slate-400">
                Menu items, modifiers, cart, and payment gateway are scheduled for Phase 2.
              </p>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-orange-600 text-white font-bold text-[10px] uppercase whitespace-nowrap">
              Phase 2 Ready
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
