import React, { useState } from 'react';
import {
  Store,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Power,
  Search,
  Filter,
  Eye,
  Clock,
  Phone,
  Mail,
  MapPin,
  ExternalLink,
} from 'lucide-react';
import { Restaurant } from '../types';
import { backend } from '../services/mockBackend';

interface AdminRestaurantsProps {
  onRefresh: () => void;
}

export const AdminRestaurants: React.FC<AdminRestaurantsProps> = ({ onRefresh }) => {
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [rejectModalOpen, setRejectModalOpen] = useState<boolean>(false);
  const [actionType, setActionType] = useState<'reject' | 'changes_requested'>('reject');
  const [actionReason, setActionReason] = useState<string>('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const restaurants = backend.getAllRestaurants();

  const filtered = restaurants.filter((r) => {
    const matchesFilter =
      filterStatus === 'all'
        ? true
        : filterStatus === 'pending'
        ? r.approval_status === 'pending'
        : filterStatus === 'approved'
        ? r.approval_status === 'approved'
        : filterStatus === 'suspended'
        ? r.status === 'suspended'
        : true;

    const matchesSearch =
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.phone.includes(searchQuery);

    return matchesFilter && matchesSearch;
  });

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleApprove = (id: number) => {
    try {
      backend.approveRestaurant(id);
      triggerToast('Restaurant successfully approved and published to marketplace!');
      onRefresh();
    } catch (e: any) {
      alert(e.message);
    }
  };

  const handleOpenActionModal = (rest: Restaurant, type: 'reject' | 'changes_requested') => {
    setSelectedRestaurant(rest);
    setActionType(type);
    setActionReason(type === 'reject' ? 'Failed verification requirements.' : 'Please update your address and food safety permit details.');
    setRejectModalOpen(true);
  };

  const submitAction = () => {
    if (!selectedRestaurant) return;
    try {
      if (actionType === 'reject') {
        backend.rejectRestaurant(selectedRestaurant.id, actionReason);
        triggerToast(`Restaurant #${selectedRestaurant.id} rejected.`);
      } else {
        backend.requestChanges(selectedRestaurant.id, actionReason);
        triggerToast(`Changes requested for Restaurant #${selectedRestaurant.id}.`);
      }
      setRejectModalOpen(false);
      onRefresh();
    } catch (e: any) {
      alert(e.message);
    }
  };

  const handleToggleStatus = (id: number) => {
    try {
      const updated = backend.toggleRestaurantStatus(id);
      triggerToast(`Restaurant #${id} status changed to ${updated.status}.`);
      onRefresh();
    } catch (e: any) {
      alert(e.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl flex items-center space-x-2 border border-slate-700 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span className="text-sm font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900">Restaurant Listings & Approvals</h1>
          <p className="text-xs text-slate-500">
            Verify onboarding applications, control publication status, and manage merchant compliance.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {['all', 'pending', 'approved', 'suspended'].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition ${
                filterStatus === status
                  ? 'bg-orange-600 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by restaurant name, city, or phone number..."
          className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
        />
      </div>

      {/* Table of Restaurants */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              <tr>
                <th className="px-5 py-3.5">Restaurant</th>
                <th className="px-5 py-3.5">Location</th>
                <th className="px-5 py-3.5">Owner Contact</th>
                <th className="px-5 py-3.5">Approval State</th>
                <th className="px-5 py-3.5">Operational Status</th>
                <th className="px-5 py-3.5 text-right">Workflow Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filtered.map((rest) => (
                <tr key={rest.id} className="hover:bg-slate-50/70 transition">
                  <td className="px-5 py-4">
                    <div className="flex items-center space-x-3">
                      <img
                        src={rest.logo}
                        alt={rest.name}
                        className="w-10 h-10 rounded-xl object-cover border border-slate-200"
                      />
                      <div>
                        <span className="font-bold text-slate-900 text-sm block">{rest.name}</span>
                        <span className="text-[11px] text-slate-400 font-mono">/{rest.slug}</span>
                      </div>
                    </div>
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex items-center space-x-1.5 text-slate-700">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                      <span>{rest.city}, {rest.area}</span>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-0.5 truncate max-w-xs">{rest.address}</p>
                  </td>

                  <td className="px-5 py-4">
                    <p className="font-semibold text-slate-800">{rest.owner_name}</p>
                    <p className="text-[11px] text-slate-500">{rest.phone}</p>
                    <p className="text-[11px] text-slate-400">{rest.email}</p>
                  </td>

                  <td className="px-5 py-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold ${
                      rest.approval_status === 'approved'
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                        : rest.approval_status === 'pending'
                        ? 'bg-amber-100 text-amber-800 border border-amber-200'
                        : rest.approval_status === 'changes_requested'
                        ? 'bg-blue-100 text-blue-800 border border-blue-200'
                        : 'bg-rose-100 text-rose-800 border border-rose-200'
                    }`}>
                      {rest.approval_status.replace('_', ' ')}
                    </span>
                    {rest.rejection_reason && (
                      <p className="text-[10px] text-rose-600 mt-1 italic max-w-xs">
                        Note: {rest.rejection_reason}
                      </p>
                    )}
                  </td>

                  <td className="px-5 py-4">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                      rest.status === 'active'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-slate-100 text-slate-600 border border-slate-300'
                    }`}>
                      {rest.status}
                    </span>
                  </td>

                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end space-x-1.5">
                      {/* Approve Button */}
                      {rest.approval_status !== 'approved' && (
                        <button
                          onClick={() => handleApprove(rest.id)}
                          title="Approve for Marketplace"
                          className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold text-[11px] flex items-center space-x-1 transition"
                        >
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Approve</span>
                        </button>
                      )}

                      {/* Request Changes Button */}
                      {rest.approval_status === 'pending' && (
                        <button
                          onClick={() => handleOpenActionModal(rest, 'changes_requested')}
                          title="Request Information Revisions"
                          className="px-2 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-lg font-semibold text-[11px] transition"
                        >
                          Revise
                        </button>
                      )}

                      {/* Reject Button */}
                      {rest.approval_status === 'pending' && (
                        <button
                          onClick={() => handleOpenActionModal(rest, 'reject')}
                          title="Reject Application"
                          className="px-2 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg font-semibold text-[11px] transition"
                        >
                          Reject
                        </button>
                      )}

                      {/* Suspend / Reactivate Toggle */}
                      {rest.approval_status === 'approved' && (
                        <button
                          onClick={() => handleToggleStatus(rest.id)}
                          className={`px-2 py-1 rounded-lg font-semibold text-[11px] flex items-center space-x-1 border transition ${
                            rest.status === 'active'
                              ? 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-300'
                              : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border-emerald-200'
                          }`}
                        >
                          <Power className="w-3 h-3" />
                          <span>{rest.status === 'active' ? 'Suspend' : 'Reactivate'}</span>
                        </button>
                      )}

                      {/* View Inspection Details */}
                      <button
                        onClick={() => setSelectedRestaurant(rest)}
                        className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition"
                        title="View Full Profile"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Rejection / Request Changes Modal */}
      {rejectModalOpen && selectedRestaurant && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <h3 className="text-base font-bold text-slate-900">
              {actionType === 'reject' ? 'Reject Restaurant Application' : 'Request Application Changes'}
            </h3>
            <p className="text-xs text-slate-500">
              Provide an explanation for {selectedRestaurant.name}. This is saved to the audit log and returned to the merchant.
            </p>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Audit Explanation Reason</label>
              <textarea
                value={actionReason}
                onChange={(e) => setActionReason(e.target.value)}
                rows={3}
                className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:outline-none focus:border-orange-500"
                placeholder="Enter specific regulatory or verification feedback..."
              />
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button
                onClick={() => setRejectModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                onClick={submitAction}
                className={`px-4 py-2 rounded-xl text-xs font-semibold text-white ${
                  actionType === 'reject' ? 'bg-rose-600 hover:bg-rose-700' : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {actionType === 'reject' ? 'Confirm Rejection' : 'Send Revision Request'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Detailed Restaurant Inspection Modal */}
      {selectedRestaurant && !rejectModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl border border-slate-200 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-lg font-bold text-slate-900">{selectedRestaurant.name}</h3>
                <p className="text-xs text-slate-500">Slug: /{selectedRestaurant.slug} • ID: #{selectedRestaurant.id}</p>
              </div>
              <button
                onClick={() => setSelectedRestaurant(null)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="font-semibold text-slate-500 uppercase tracking-wider text-[10px] block mb-1">
                  Owner Credentials
                </span>
                <p className="font-bold text-slate-800">{selectedRestaurant.owner_name}</p>
                <p className="text-slate-600">{selectedRestaurant.owner_email}</p>
                <p className="text-slate-600">{selectedRestaurant.phone}</p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="font-semibold text-slate-500 uppercase tracking-wider text-[10px] block mb-1">
                  Delivery Constraints
                </span>
                <p className="text-slate-700">Min Order: <strong>${selectedRestaurant.minimum_order_amount.toFixed(2)}</strong></p>
                <p className="text-slate-700">Delivery Fee: <strong>${selectedRestaurant.delivery_fee.toFixed(2)}</strong></p>
                <p className="text-slate-700">Est. Time: <strong>{selectedRestaurant.delivery_time_min} - {selectedRestaurant.delivery_time_max} mins</strong></p>
              </div>
            </div>

            <div>
              <span className="font-semibold text-slate-700 text-xs block mb-1">Description</span>
              <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
                {selectedRestaurant.description}
              </p>
            </div>

            <div>
              <span className="font-semibold text-slate-700 text-xs block mb-2">7-Day Operating Hours</span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                {selectedRestaurant.hours?.map((h) => (
                  <div key={h.id} className="p-2 rounded-lg bg-slate-50 border border-slate-100">
                    <p className="font-bold text-slate-800">{h.day_name}</p>
                    <p className={h.is_open ? 'text-emerald-700 font-semibold' : 'text-slate-400'}>
                      {h.is_open ? `${h.open_time} - ${h.close_time}` : 'Closed'}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-100">
              <button
                onClick={() => setSelectedRestaurant(null)}
                className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
