import React, { useState } from 'react';
import { Clock, Save, CheckCircle2, Split } from 'lucide-react';
import { RestaurantHour } from '../types';
import { backend } from '../services/mockBackend';

interface RestaurantHoursEditorProps {
  onRefresh: () => void;
}

export const RestaurantHoursEditor: React.FC<RestaurantHoursEditorProps> = ({ onRefresh }) => {
  const restaurant = backend.getOwnerRestaurant();
  const [hours, setHours] = useState<RestaurantHour[]>(restaurant?.hours || []);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [showSplitHours, setShowSplitHours] = useState(false);

  if (!restaurant) {
    return <div className="p-6 bg-white rounded-xl">No restaurant owned.</div>;
  }

  const handleToggleOpen = (index: number) => {
    const updated = [...hours];
    updated[index].is_open = !updated[index].is_open;
    setHours(updated);
  };

  const handleTimeChange = (index: number, field: keyof RestaurantHour, value: string) => {
    const updated = [...hours];
    (updated[index] as any)[field] = value;
    setHours(updated);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      backend.updateRestaurantHours(restaurant.id, hours);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
      onRefresh();
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-6 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900">7-Day Operating Hours</h1>
          <p className="text-xs text-slate-500">
            Define daily service windows and optional split shift hours (e.g., lunch & dinner).
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={() => setShowSplitHours(!showSplitHours)}
            className={`px-3 py-2 rounded-xl text-xs font-semibold border transition flex items-center space-x-1.5 ${
              showSplitHours
                ? 'bg-orange-50 border-orange-200 text-orange-700'
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Split className="w-3.5 h-3.5" />
            <span>{showSplitHours ? 'Standard Single Shift' : 'Enable Split Shifts'}</span>
          </button>

          <button
            type="submit"
            className="flex items-center space-x-1.5 bg-orange-600 hover:bg-orange-700 text-white font-semibold text-xs px-4 py-2 rounded-xl transition shadow-xs"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Hours</span>
          </button>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Opening hours schedule updated successfully!</span>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs divide-y divide-slate-100 overflow-hidden">
        {hours.map((day, idx) => (
          <div key={day.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
            <div className="flex items-center space-x-3 w-36">
              <input
                type="checkbox"
                id={`day-${day.id}`}
                checked={day.is_open}
                onChange={() => handleToggleOpen(idx)}
                className="w-4 h-4 text-orange-600 rounded border-slate-300 focus:ring-orange-500 cursor-pointer"
              />
              <label htmlFor={`day-${day.id}`} className="font-bold text-slate-800 cursor-pointer select-none">
                {day.day_name}
              </label>
            </div>

            {day.is_open ? (
              <div className="flex-1 flex flex-wrap items-center gap-3">
                {!showSplitHours ? (
                  // Single standard shift
                  <div className="flex items-center space-x-2">
                    <span className="text-slate-400 font-medium">Open:</span>
                    <input
                      type="time"
                      value={day.open_time}
                      onChange={(e) => handleTimeChange(idx, 'open_time', e.target.value)}
                      className="border border-slate-300 rounded-lg px-2.5 py-1 text-slate-800 focus:outline-none focus:border-orange-500 font-mono"
                    />
                    <span className="text-slate-400">to</span>
                    <input
                      type="time"
                      value={day.close_time}
                      onChange={(e) => handleTimeChange(idx, 'close_time', e.target.value)}
                      className="border border-slate-300 rounded-lg px-2.5 py-1 text-slate-800 focus:outline-none focus:border-orange-500 font-mono"
                    />
                  </div>
                ) : (
                  // Split hours architecture
                  <div className="flex flex-wrap items-center gap-4">
                    <div className="flex items-center space-x-1.5 bg-slate-50 p-1.5 rounded-lg border border-slate-200">
                      <span className="font-semibold text-slate-500 text-[10px]">Shift 1:</span>
                      <input
                        type="time"
                        value={day.first_open || '11:00'}
                        onChange={(e) => handleTimeChange(idx, 'first_open', e.target.value)}
                        className="bg-white border border-slate-200 rounded px-1.5 py-0.5 font-mono text-[11px]"
                      />
                      <span>-</span>
                      <input
                        type="time"
                        value={day.first_close || '15:00'}
                        onChange={(e) => handleTimeChange(idx, 'first_close', e.target.value)}
                        className="bg-white border border-slate-200 rounded px-1.5 py-0.5 font-mono text-[11px]"
                      />
                    </div>

                    <div className="flex items-center space-x-1.5 bg-slate-50 p-1.5 rounded-lg border border-slate-200">
                      <span className="font-semibold text-slate-500 text-[10px]">Shift 2:</span>
                      <input
                        type="time"
                        value={day.second_open || '18:00'}
                        onChange={(e) => handleTimeChange(idx, 'second_open', e.target.value)}
                        className="bg-white border border-slate-200 rounded px-1.5 py-0.5 font-mono text-[11px]"
                      />
                      <span>-</span>
                      <input
                        type="time"
                        value={day.second_close || '23:00'}
                        onChange={(e) => handleTimeChange(idx, 'second_close', e.target.value)}
                        className="bg-white border border-slate-200 rounded px-1.5 py-0.5 font-mono text-[11px]"
                      />
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <span className="text-slate-400 italic">Store Closed for Orders</span>
            )}

            <div className="w-20 text-right">
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                  day.is_open ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-400'
                }`}
              >
                {day.is_open ? 'Open' : 'Closed'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </form>
  );
};
