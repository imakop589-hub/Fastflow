import React, { useState } from 'react';
import { Store, Save, CheckCircle2, AlertCircle } from 'lucide-react';
import { backend } from '../services/mockBackend';

interface RestaurantProfileEditorProps {
  onRefresh: () => void;
}

export const RestaurantProfileEditor: React.FC<RestaurantProfileEditorProps> = ({ onRefresh }) => {
  const restaurant = backend.getOwnerRestaurant();

  if (!restaurant) {
    return <div className="p-6 bg-white rounded-xl">No restaurant owned.</div>;
  }

  const [formData, setFormData] = useState({
    name: restaurant.name,
    description: restaurant.description,
    phone: restaurant.phone,
    email: restaurant.email,
    address: restaurant.address,
    city: restaurant.city,
    area: restaurant.area,
    postal_code: restaurant.postal_code || '',
    minimum_order_amount: restaurant.minimum_order_amount,
    delivery_time_min: restaurant.delivery_time_min,
    delivery_time_max: restaurant.delivery_time_max,
    delivery_fee: restaurant.delivery_fee,
    logo: restaurant.logo,
    cover_image: restaurant.cover_image,
  });

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // Validation
    if (!formData.name.trim()) {
      setErrorMsg('Restaurant name is required');
      return;
    }
    if (formData.delivery_time_min >= formData.delivery_time_max) {
      setErrorMsg('Minimum delivery time must be strictly less than maximum delivery time');
      return;
    }

    try {
      backend.updateOwnerRestaurant(formData);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
      onRefresh();
    } catch (err: any) {
      setErrorMsg(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900">Restaurant Profile & Storefront</h1>
          <p className="text-xs text-slate-500">
            Edit your brand information, dispatch times, minimum orders, and contact details.
          </p>
        </div>

        <button
          type="submit"
          className="flex items-center space-x-1.5 bg-orange-600 hover:bg-orange-700 text-white font-semibold text-xs px-4 py-2 rounded-xl transition shadow-xs"
        >
          <Save className="w-3.5 h-3.5" />
          <span>Save Profile</span>
        </button>
      </div>

      {savedSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Restaurant profile updated successfully!</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 text-rose-600" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Brand & Identity */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
        <h2 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2">Storefront Identity</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Restaurant Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full border border-slate-300 rounded-xl px-3 py-2 focus:outline-none focus:border-orange-500"
              required
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Contact Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full border border-slate-300 rounded-xl px-3 py-2 focus:outline-none focus:border-orange-500"
              required
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block font-semibold text-slate-700 mb-1">Description & Specialties</label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full border border-slate-300 rounded-xl p-3 focus:outline-none focus:border-orange-500"
              required
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Phone Number</label>
            <input
              type="text"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full border border-slate-300 rounded-xl px-3 py-2 focus:outline-none focus:border-orange-500"
              required
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Logo URL</label>
            <input
              type="url"
              value={formData.logo}
              onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
              className="w-full border border-slate-300 rounded-xl px-3 py-2 focus:outline-none focus:border-orange-500"
            />
          </div>
        </div>
      </div>

      {/* Location */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
        <h2 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2">Physical Location</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">City</label>
            <input
              type="text"
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              className="w-full border border-slate-300 rounded-xl px-3 py-2 focus:outline-none focus:border-orange-500"
              required
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Area / District</label>
            <input
              type="text"
              value={formData.area}
              onChange={(e) => setFormData({ ...formData, area: e.target.value })}
              className="w-full border border-slate-300 rounded-xl px-3 py-2 focus:outline-none focus:border-orange-500"
              required
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Postal Code</label>
            <input
              type="text"
              value={formData.postal_code}
              onChange={(e) => setFormData({ ...formData, postal_code: e.target.value })}
              className="w-full border border-slate-300 rounded-xl px-3 py-2 focus:outline-none focus:border-orange-500"
            />
          </div>

          <div className="sm:col-span-3">
            <label className="block font-semibold text-slate-700 mb-1">Complete Street Address</label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full border border-slate-300 rounded-xl px-3 py-2 focus:outline-none focus:border-orange-500"
              required
            />
          </div>
        </div>
      </div>

      {/* Financial & Delivery Parameters */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
        <h2 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2">Delivery & Order Requirements</h2>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Min Order ($)</label>
            <input
              type="number"
              step="0.5"
              value={formData.minimum_order_amount}
              onChange={(e) => setFormData({ ...formData, minimum_order_amount: parseFloat(e.target.value) || 0 })}
              className="w-full border border-slate-300 rounded-xl px-3 py-2 focus:outline-none focus:border-orange-500"
              required
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Delivery Fee ($)</label>
            <input
              type="number"
              step="0.25"
              value={formData.delivery_fee}
              onChange={(e) => setFormData({ ...formData, delivery_fee: parseFloat(e.target.value) || 0 })}
              className="w-full border border-slate-300 rounded-xl px-3 py-2 focus:outline-none focus:border-orange-500"
              required
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Min Delivery Time (min)</label>
            <input
              type="number"
              value={formData.delivery_time_min}
              onChange={(e) => setFormData({ ...formData, delivery_time_min: parseInt(e.target.value) || 0 })}
              className="w-full border border-slate-300 rounded-xl px-3 py-2 focus:outline-none focus:border-orange-500"
              required
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Max Delivery Time (min)</label>
            <input
              type="number"
              value={formData.delivery_time_max}
              onChange={(e) => setFormData({ ...formData, delivery_time_max: parseInt(e.target.value) || 0 })}
              className="w-full border border-slate-300 rounded-xl px-3 py-2 focus:outline-none focus:border-orange-500"
              required
            />
          </div>
        </div>
      </div>
    </form>
  );
};
