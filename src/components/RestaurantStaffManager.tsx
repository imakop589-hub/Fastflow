import React, { useState } from 'react';
import { Users, UserPlus, Trash2, Power, CheckCircle2, AlertCircle, Shield } from 'lucide-react';
import { backend } from '../services/mockBackend';

interface RestaurantStaffManagerProps {
  onRefresh: () => void;
}

export const RestaurantStaffManager: React.FC<RestaurantStaffManagerProps> = ({ onRefresh }) => {
  const restaurant = backend.getOwnerRestaurant();
  const staff = restaurant ? backend.getStaffForRestaurant(restaurant.id) : [];

  const [modalOpen, setModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<'manager' | 'staff'>('staff');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  if (!restaurant) {
    return <div className="p-6 bg-white rounded-xl">No restaurant owned.</div>;
  }

  const handleAddStaff = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      backend.addStaff(restaurant.id, { name, email, phone, role });
      setName('');
      setEmail('');
      setPhone('');
      setModalOpen(false);
      setToastMsg(`Staff member ${name} created successfully!`);
      setTimeout(() => setToastMsg(null), 3500);
      onRefresh();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleToggleStatus = (staffId: number) => {
    try {
      const updated = backend.toggleStaffStatus(staffId);
      setToastMsg(`Staff status changed to ${updated.status}`);
      setTimeout(() => setToastMsg(null), 3000);
      onRefresh();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleDeleteStaff = (staffId: number) => {
    if (!confirm('Are you sure you want to remove this staff account?')) return;
    try {
      backend.deleteStaff(staffId);
      setToastMsg('Staff member removed.');
      setTimeout(() => setToastMsg(null), 3000);
      onRefresh();
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {toastMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{toastMsg}</span>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900">Restaurant Staff & Tenant Accounts</h1>
          <p className="text-xs text-slate-500">
            Create manager and kitchen staff accounts locked exclusively to {restaurant.name}.
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center space-x-1.5 bg-orange-600 hover:bg-orange-700 text-white font-semibold text-xs px-4 py-2 rounded-xl transition shadow-xs"
        >
          <UserPlus className="w-3.5 h-3.5" />
          <span>Add Staff Member</span>
        </button>
      </div>

      {/* Staff Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {staff.length === 0 ? (
          <div className="p-8 text-center text-slate-500 space-y-2">
            <Users className="w-8 h-8 text-slate-400 mx-auto" />
            <p className="text-xs font-semibold">No staff accounts registered for this branch yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <tr>
                  <th className="px-5 py-3.5">Staff Name</th>
                  <th className="px-5 py-3.5">Email & Phone</th>
                  <th className="px-5 py-3.5">Branch Role</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {staff.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50/70 transition">
                    <td className="px-5 py-4 font-bold text-slate-900">{s.name}</td>
                    <td className="px-5 py-4">
                      <p className="text-slate-800">{s.email}</p>
                      <p className="text-[10px] text-slate-400">{s.phone || 'No phone'}</p>
                    </td>
                    <td className="px-5 py-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-purple-50 text-purple-700 border border-purple-200">
                        {s.role}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          s.status === 'active'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {s.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handleToggleStatus(s.id)}
                          title="Toggle Active Status"
                          className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 transition"
                        >
                          <Power className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteStaff(s.id)}
                          title="Delete Staff Account"
                          className="p-1.5 rounded-lg border border-rose-200 hover:bg-rose-50 text-rose-600 transition"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Staff Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleAddStaff}
            className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 text-xs"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900">Add Staff Account</h3>
              <span className="text-[10px] text-orange-600 font-semibold">{restaurant.name}</span>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border border-slate-300 rounded-xl px-3 py-2 focus:outline-none focus:border-orange-500"
                placeholder="e.g. Asad Rauf"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-slate-300 rounded-xl px-3 py-2 focus:outline-none focus:border-orange-500"
                placeholder="staff@restaurant.com"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Phone Number (Optional)</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full border border-slate-300 rounded-xl px-3 py-2 focus:outline-none focus:border-orange-500"
                placeholder="+92-300-0000000"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Branch Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as any)}
                className="w-full border border-slate-300 rounded-xl px-3 py-2 focus:outline-none focus:border-orange-500 cursor-pointer"
              >
                <option value="staff">Restaurant Staff (Kitchen / Shift)</option>
                <option value="manager">Restaurant Manager (Profile & Shift Manager)</option>
              </select>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-500 text-[11px]">
              Password will default to the standard demo secret and will require reset upon first login.
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 rounded-xl font-semibold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl font-semibold bg-orange-600 hover:bg-orange-700 text-white"
              >
                Create Staff Account
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
