import React, { useState } from 'react';
import {
  Search,
  MapPin,
  Clock,
  DollarSign,
  ShieldCheck,
  Star,
  ChevronRight,
  Filter,
  CheckCircle,
} from 'lucide-react';
import { Restaurant } from '../types';
import { backend } from '../services/mockBackend';

interface PublicMarketplaceProps {
  selectedCity: string;
  onSelectRestaurant: (restaurant: Restaurant) => void;
  onApplyClick: () => void;
}

export const PublicMarketplace: React.FC<PublicMarketplaceProps> = ({
  selectedCity,
  onSelectRestaurant,
  onApplyClick,
}) => {
  const [search, setSearch] = useState('');
  const [cuisineTag, setCuisineTag] = useState('All');

  // Real database query: ONLY approved & active restaurants are shown
  const publicRestaurants = backend.getPublicRestaurants();

  const filtered = publicRestaurants.filter((r) => {
    const matchesCity = selectedCity === 'All' || r.city.toLowerCase() === selectedCity.toLowerCase();
    const matchesSearch =
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.description.toLowerCase().includes(search.toLowerCase()) ||
      r.area.toLowerCase().includes(search.toLowerCase());
    return matchesCity && matchesSearch;
  });

  const categories = [
    { name: 'All', icon: '🍽️' },
    { name: 'Artisanal Burgers', icon: '🍔' },
    { name: 'Organic & Salads', icon: '🥗' },
    { name: 'BBQ & Grills', icon: '🥩' },
    { name: 'Wood-fired Pizza', icon: '🍕' },
    { name: 'Asian Fusion', icon: '🍜' },
  ];

  return (
    <div className="space-y-10 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-orange-950 text-white p-8 sm:p-12 shadow-md">
        <div className="max-w-2xl space-y-4">
          <div className="inline-flex items-center space-x-2 bg-orange-500/20 border border-orange-500/30 px-3 py-1 rounded-full text-xs font-semibold text-orange-300">
            <span className="w-2 h-2 rounded-full bg-orange-400 animate-ping" />
            <span>Curated Multi-Vendor Marketplace</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            Exceptional food from top-tier kitchens.
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Order directly from verified artisanal bistros, certified kitchens, and farm-to-table specialists with instant delivery estimates.
          </p>

          {/* Search Bar */}
          <div className="pt-2">
            <div className="relative max-w-lg">
              <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search food, restaurants, or neighborhoods..."
                className="w-full bg-white text-slate-900 rounded-2xl pl-12 pr-4 py-3.5 text-sm placeholder-slate-400 shadow-lg focus:outline-none focus:ring-4 focus:ring-orange-500/30 font-medium"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Cuisine Categories Selector */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-extrabold text-slate-900">Explore Cuisines</h2>
          <span className="text-xs text-slate-500">
            Showing approved partners in <strong>{selectedCity}</strong>
          </span>
        </div>

        <div className="flex items-center space-x-3 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((c) => (
            <button
              key={c.name}
              onClick={() => setCuisineTag(c.name)}
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition border ${
                cuisineTag === c.name
                  ? 'bg-orange-600 text-white border-orange-600 shadow-sm'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <span>{c.icon}</span>
              <span>{c.name}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Featured Verified Restaurants Grid */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-black text-slate-900">Verified Marketplace Partners</h2>
            <p className="text-xs text-slate-500">
              Only restaurants with approved status and verified health inspections are listed.
            </p>
          </div>
          <span className="text-xs font-bold text-orange-600 bg-orange-50 px-2.5 py-1 rounded-full border border-orange-200">
            {filtered.length} Live Restaurants
          </span>
        </div>

        {filtered.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-3">
            <p className="text-slate-500 text-sm font-medium">No approved restaurants match your filter.</p>
            <p className="text-xs text-slate-400">
              Unapproved or suspended restaurants are hidden in accordance with Phase 1 approval rules.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((rest) => (
              <div
                key={rest.id}
                onClick={() => onSelectRestaurant(rest)}
                className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-xs hover:shadow-md hover:border-orange-300 transition group cursor-pointer flex flex-col"
              >
                {/* Cover Image & Badges */}
                <div className="relative h-44 overflow-hidden bg-slate-100">
                  <img
                    src={rest.cover_image}
                    alt={rest.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 to-transparent" />

                  {/* Verified Badge */}
                  <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-full text-[11px] font-bold text-slate-900 flex items-center space-x-1 shadow-xs">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Verified Partner</span>
                  </div>

                  {/* Delivery Time Badge */}
                  <div className="absolute bottom-3 left-3 bg-slate-900/80 backdrop-blur-xs text-white px-2.5 py-1 rounded-full text-[11px] font-medium flex items-center space-x-1">
                    <Clock className="w-3 h-3 text-orange-400" />
                    <span>{rest.delivery_time_min} - {rest.delivery_time_max} mins</span>
                  </div>
                </div>

                {/* Restaurant Content */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-center justify-between">
                      <h3 className="font-extrabold text-slate-900 text-base group-hover:text-orange-600 transition">
                        {rest.name}
                      </h3>
                      <span className="text-xs font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded-lg">
                        ${rest.delivery_fee.toFixed(2)} delivery
                      </span>
                    </div>

                    <p className="text-xs text-slate-500 flex items-center space-x-1 mt-1 font-medium">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                      <span>{rest.city}, {rest.area}</span>
                    </p>

                    <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed">
                      {rest.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-semibold">
                    <span>Min Order: ${rest.minimum_order_amount.toFixed(2)}</span>
                    <span className="text-orange-600 group-hover:translate-x-1 transition-transform flex items-center">
                      View Storefront <ChevronRight className="w-4 h-4 ml-0.5" />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Partner Callout Banner */}
      <section className="bg-orange-50 rounded-3xl p-8 border border-orange-200/80 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center sm:text-left">
          <h3 className="text-lg font-black text-slate-900">Are you a restaurant or kitchen owner?</h3>
          <p className="text-xs text-slate-600 max-w-lg leading-relaxed">
            Expand your culinary reach. Submit your restaurant application to join FoodBrio and access our operational merchant portal.
          </p>
        </div>
        <button
          onClick={onApplyClick}
          className="bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs px-5 py-3 rounded-2xl transition shadow-md shadow-orange-600/20 whitespace-nowrap"
        >
          Register Your Restaurant
        </button>
      </section>
    </div>
  );
};
