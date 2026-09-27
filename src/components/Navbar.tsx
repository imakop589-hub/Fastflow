import React from 'react';
import {
  Shield,
  Store,
  Compass,
  UserCheck,
  Building2,
  CheckCircle2,
  ChevronDown,
  Sparkles,
  KeyRound,
} from 'lucide-react';
import { User } from '../types';
import { backend } from '../services/mockBackend';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  currentUser: User;
  onUserChange: () => void;
  onOpenSecurityModal: () => void;
  selectedCity: string;
  setSelectedCity: (city: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  currentUser,
  onUserChange,
  onOpenSecurityModal,
  selectedCity,
  setSelectedCity,
}) => {
  const users = backend.getUsers();
  const isAdmin = currentUser.roles.includes('super-admin') || currentUser.roles.includes('admin');
  const isOwner = currentUser.roles.includes('restaurant-owner');
  const isStaff = currentUser.roles.includes('restaurant-staff');

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
      {/* Top Banner: Environment & Active Identity */}
      <div className="bg-slate-900 text-slate-300 text-xs px-4 py-1.5 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center space-x-2">
          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-orange-500/20 text-orange-400 border border-orange-500/30">
            PHASE 1 CORE
          </span>
          <span className="hidden sm:inline text-slate-400">Laravel 11 + Vue 3 Architecture & RBAC System</span>
        </div>

        <div className="flex items-center space-x-3">
          {/* Quick Role Switcher */}
          <div className="flex items-center space-x-1.5">
            <UserCheck className="w-3.5 h-3.5 text-orange-400" />
            <span className="text-slate-400">Active Identity:</span>
            <select
              value={currentUser.id}
              onChange={(e) => {
                const selected = users.find(u => u.id === parseInt(e.target.value));
                if (selected) {
                  backend.setCurrentUser(selected);
                  onUserChange();
                }
              }}
              className="bg-slate-800 text-white font-medium rounded px-2 py-0.5 border border-slate-700 focus:outline-none focus:border-orange-500 text-xs cursor-pointer"
            >
              {users.map(u => (
                <option key={u.id} value={u.id}>
                  {u.name} — [{u.roles[0]}]
                </option>
              ))}
            </select>
          </div>

          {/* Security Suite Trigger */}
          <button
            onClick={onOpenSecurityModal}
            className="flex items-center space-x-1 bg-emerald-950/80 hover:bg-emerald-900 text-emerald-400 border border-emerald-700/50 rounded px-2 py-0.5 transition font-semibold"
          >
            <Shield className="w-3 h-3 text-emerald-400" />
            <span>Verify Security & IDOR</span>
          </button>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-16 flex items-center justify-between gap-4">
          {/* Brand Logo */}
          <div className="flex items-center space-x-6">
            <button
              onClick={() => setCurrentTab('marketplace')}
              className="flex items-center space-x-2.5 group text-left"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-orange-600 to-amber-500 flex items-center justify-center font-black text-white text-base shadow-sm group-hover:scale-105 transition-transform">
                FB
              </div>
              <div>
                <span className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-1">
                  FoodBrio
                  <span className="text-orange-600 font-black text-sm">Marketplace</span>
                </span>
                <span className="block text-[10px] text-slate-500 tracking-wider uppercase font-semibold">Multi-Vendor Platform</span>
              </div>
            </button>

            {/* City Location Filter */}
            <div className="hidden md:flex items-center space-x-1.5 bg-slate-100/80 hover:bg-slate-100 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 border border-slate-200">
              <span className="text-slate-400 font-medium">Delivering in:</span>
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="bg-transparent font-bold text-slate-800 focus:outline-none cursor-pointer"
              >
                <option value="All">All Cities</option>
                <option value="Lahore">Lahore, PK</option>
                <option value="Islamabad">Islamabad, PK</option>
                <option value="Karachi">Karachi, PK</option>
              </select>
            </div>
          </div>

          {/* Module Navigation Tabs */}
          <nav className="flex items-center space-x-1 sm:space-x-2">
            <button
              onClick={() => setCurrentTab('marketplace')}
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition ${
                currentTab === 'marketplace'
                  ? 'bg-orange-50 text-orange-600 border border-orange-200/60'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Compass className="w-4 h-4" />
              <span>Marketplace</span>
            </button>

            {/* Admin Portal Tab */}
            {isAdmin && (
              <button
                onClick={() => setCurrentTab('admin')}
                className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition ${
                  currentTab.startsWith('admin')
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Shield className="w-4 h-4 text-orange-400" />
                <span>Admin Portal</span>
              </button>
            )}

            {/* Merchant / Restaurant Portal Tab */}
            {(isOwner || isStaff) && (
              <button
                onClick={() => setCurrentTab('restaurant')}
                className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition ${
                  currentTab.startsWith('restaurant')
                    ? 'bg-orange-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Store className="w-4 h-4" />
                <span>Merchant Portal</span>
              </button>
            )}

            {/* Onboarding / Apply as Restaurant */}
            <button
              onClick={() => setCurrentTab('apply')}
              className={`hidden sm:flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition ${
                currentTab === 'apply'
                  ? 'bg-amber-100 text-amber-900 border border-amber-300'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
              }`}
            >
              <Building2 className="w-4 h-4 text-amber-600" />
              <span>Partner Onboarding</span>
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};
