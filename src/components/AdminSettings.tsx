import React, { useState } from 'react';
import { Sliders, Save, CheckCircle2 } from 'lucide-react';
import { backend } from '../services/mockBackend';

interface AdminSettingsProps {
  onRefresh: () => void;
}

export const AdminSettings: React.FC<AdminSettingsProps> = ({ onRefresh }) => {
  const settings = backend.getSettings();
  const [formData, setFormData] = useState<Record<string, string>>(
    settings.reduce((acc, s) => {
      acc[s.key] = s.value;
      return acc;
    }, {} as Record<string, string>)
  );
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleChange = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      for (const [k, v] of Object.entries(formData)) {
        backend.updateSetting(k, v);
      }
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
      onRefresh();
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900">System Platform Settings</h1>
          <p className="text-xs text-slate-500">
            Configure marketplace core identifiers, currencies, localization, and operating constraints.
          </p>
        </div>

        <button
          type="submit"
          className="flex items-center space-x-1.5 bg-orange-600 hover:bg-orange-700 text-white font-semibold text-xs px-4 py-2 rounded-xl transition shadow-xs"
        >
          <Save className="w-3.5 h-3.5" />
          <span>Save Changes</span>
        </button>
      </div>

      {savedSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Platform settings updated successfully and cached for high performance.</span>
        </div>
      )}

      {/* General & Identity */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
        <h2 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2">General & Brand Configuration</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Application Name</label>
            <input
              type="text"
              value={formData['app_name'] || ''}
              onChange={(e) => handleChange('app_name', e.target.value)}
              className="w-full border border-slate-300 rounded-xl px-3 py-2 focus:outline-none focus:border-orange-500"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Brand Tagline</label>
            <input
              type="text"
              value={formData['brand_tagline'] || ''}
              onChange={(e) => handleChange('brand_tagline', e.target.value)}
              className="w-full border border-slate-300 rounded-xl px-3 py-2 focus:outline-none focus:border-orange-500"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Support Contact Email</label>
            <input
              type="email"
              value={formData['support_email'] || ''}
              onChange={(e) => handleChange('support_email', e.target.value)}
              className="w-full border border-slate-300 rounded-xl px-3 py-2 focus:outline-none focus:border-orange-500"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Support Phone Helpline</label>
            <input
              type="text"
              value={formData['support_phone'] || ''}
              onChange={(e) => handleChange('support_phone', e.target.value)}
              className="w-full border border-slate-300 rounded-xl px-3 py-2 focus:outline-none focus:border-orange-500"
            />
          </div>
        </div>
      </div>

      {/* Localization & Currency */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
        <h2 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2">Localization & Delivery</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Default Market Country</label>
            <input
              type="text"
              value={formData['default_country'] || ''}
              onChange={(e) => handleChange('default_country', e.target.value)}
              className="w-full border border-slate-300 rounded-xl px-3 py-2 focus:outline-none focus:border-orange-500"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Base Currency Format</label>
            <input
              type="text"
              value={formData['default_currency'] || ''}
              onChange={(e) => handleChange('default_currency', e.target.value)}
              className="w-full border border-slate-300 rounded-xl px-3 py-2 focus:outline-none focus:border-orange-500"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Default Delivery Radius (km)</label>
            <input
              type="number"
              value={formData['default_delivery_radius_km'] || '10'}
              onChange={(e) => handleChange('default_delivery_radius_km', e.target.value)}
              className="w-full border border-slate-300 rounded-xl px-3 py-2 focus:outline-none focus:border-orange-500"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Timezone</label>
            <input
              type="text"
              value={formData['timezone'] || ''}
              onChange={(e) => handleChange('timezone', e.target.value)}
              className="w-full border border-slate-300 rounded-xl px-3 py-2 focus:outline-none focus:border-orange-500"
            />
          </div>
        </div>
      </div>
    </form>
  );
};
