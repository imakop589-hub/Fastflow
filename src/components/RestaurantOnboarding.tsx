import React, { useState } from 'react';
import { Building2, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';
import { backend } from '../services/mockBackend';

interface RestaurantOnboardingProps {
  onSuccess: () => void;
}

export const RestaurantOnboarding: React.FC<RestaurantOnboardingProps> = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    owner_name: '',
    owner_email: '',
    owner_phone: '',
    restaurant_name: '',
    description: '',
    phone: '',
    email: '',
    address: '',
    city: 'Lahore',
    area: 'Gulberg',
    minimum_order_amount: 15,
    delivery_fee: 2.5,
    delivery_time_min: 25,
    delivery_time_max: 45,
    logo: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=300&q=80',
    cover_image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80',
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      backend.submitRestaurantApplication(formData);
      setSubmitted(true);
    } catch (err: any) {
      alert(err.message);
    }
  };

  if (submitted) {
    return (
      <div className="max-w-lg mx-auto bg-white rounded-2xl p-8 border border-slate-200 text-center space-y-4 shadow-sm my-8">
        <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Application Submitted Successfully!</h2>
        <p className="text-xs text-slate-500 leading-relaxed">
          Your restaurant application for <strong>{formData.restaurant_name}</strong> is now in the <strong>PENDING REVIEW</strong> queue.
          An administrator will verify your operating details and approve your listing for the marketplace.
        </p>
        <button
          onClick={onSuccess}
          className="bg-orange-600 hover:bg-orange-700 text-white font-semibold text-xs px-5 py-2.5 rounded-xl transition"
        >
          View in Admin / Merchant Directory
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 my-6">
      <div className="text-center space-y-2">
        <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-orange-100 text-orange-800">
          Partner With FoodBrio
        </span>
        <h1 className="text-2xl font-black text-slate-900">Restaurant Onboarding Application</h1>
        <p className="text-xs text-slate-500 max-w-md mx-auto">
          Join our curated multi-vendor platform. Submissions are strictly verified before appearing on the public marketplace.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6 text-xs">
        {/* Owner Information */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">1. Owner Information</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Owner Full Name</label>
              <input
                type="text"
                value={formData.owner_name}
                onChange={(e) => setFormData({ ...formData, owner_name: e.target.value })}
                placeholder="e.g. Asim Raza"
                required
                className="w-full border border-slate-300 rounded-xl px-3 py-2 focus:outline-none focus:border-orange-500"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Owner Email</label>
              <input
                type="email"
                value={formData.owner_email}
                onChange={(e) => setFormData({ ...formData, owner_email: e.target.value })}
                placeholder="asim@kitchen.pk"
                required
                className="w-full border border-slate-300 rounded-xl px-3 py-2 focus:outline-none focus:border-orange-500"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Owner Phone</label>
              <input
                type="text"
                value={formData.owner_phone}
                onChange={(e) => setFormData({ ...formData, owner_phone: e.target.value })}
                placeholder="+92-300-1234567"
                required
                className="w-full border border-slate-300 rounded-xl px-3 py-2 focus:outline-none focus:border-orange-500"
              />
            </div>
          </div>
        </div>

        {/* Restaurant Details */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">2. Restaurant Brand & Contact</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Restaurant Trading Name</label>
              <input
                type="text"
                value={formData.restaurant_name}
                onChange={(e) => setFormData({ ...formData, restaurant_name: e.target.value })}
                placeholder="e.g. Saffron Grill & Kebabs"
                required
                className="w-full border border-slate-300 rounded-xl px-3 py-2 focus:outline-none focus:border-orange-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Store Official Phone</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+92-42-35001122"
                required
                className="w-full border border-slate-300 rounded-xl px-3 py-2 focus:outline-none focus:border-orange-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">Cuisine & Description</label>
              <textarea
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Authentic charcoal cooked tandoori, hand-ground spices, and signature lamb biryani."
                required
                className="w-full border border-slate-300 rounded-xl p-3 focus:outline-none focus:border-orange-500"
              />
            </div>
          </div>
        </div>

        {/* Physical Address */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">3. Location</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">City</label>
              <select
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full border border-slate-300 rounded-xl px-3 py-2 focus:outline-none focus:border-orange-500 cursor-pointer"
              >
                <option value="Lahore">Lahore</option>
                <option value="Karachi">Karachi</option>
                <option value="Islamabad">Islamabad</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Area / Sector</label>
              <input
                type="text"
                value={formData.area}
                onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                placeholder="e.g. DHA Phase 5"
                required
                className="w-full border border-slate-300 rounded-xl px-3 py-2 focus:outline-none focus:border-orange-500"
              />
            </div>

            <div className="sm:col-span-3">
              <label className="block font-semibold text-slate-700 mb-1">Complete Street Address</label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Plot 88-B, Commercial Avenue, DHA Phase 5"
                required
                className="w-full border border-slate-300 rounded-xl px-3 py-2 focus:outline-none focus:border-orange-500"
              />
            </div>
          </div>
        </div>

        {/* Delivery Terms */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">4. Initial Delivery Parameters</h2>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Min Order ($)</label>
              <input
                type="number"
                value={formData.minimum_order_amount}
                onChange={(e) => setFormData({ ...formData, minimum_order_amount: parseFloat(e.target.value) || 0 })}
                className="w-full border border-slate-300 rounded-xl px-3 py-2 focus:outline-none focus:border-orange-500"
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
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Min Est. Time (min)</label>
              <input
                type="number"
                value={formData.delivery_time_min}
                onChange={(e) => setFormData({ ...formData, delivery_time_min: parseInt(e.target.value) || 0 })}
                className="w-full border border-slate-300 rounded-xl px-3 py-2 focus:outline-none focus:border-orange-500"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Max Est. Time (min)</label>
              <input
                type="number"
                value={formData.delivery_time_max}
                onChange={(e) => setFormData({ ...formData, delivery_time_max: parseInt(e.target.value) || 0 })}
                className="w-full border border-slate-300 rounded-xl px-3 py-2 focus:outline-none focus:border-orange-500"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-slate-100">
          <button
            type="submit"
            className="flex items-center space-x-2 bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs px-6 py-3 rounded-xl transition shadow-md shadow-orange-600/20"
          >
            <span>Submit Vendor Application</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
};
