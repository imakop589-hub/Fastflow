import React, { useState } from 'react';
import {
  Shield,
  Store,
  Compass,
  Building2,
  Users,
  Settings as SettingsIcon,
  Activity,
  Key,
  Clock,
  Menu,
  X,
} from 'lucide-react';
import { backend } from './services/mockBackend';
import { Restaurant, User } from './types';
import { Navbar } from './components/Navbar';
import { PublicMarketplace } from './components/PublicMarketplace';
import { AdminDashboard } from './components/AdminDashboard';
import { AdminRestaurants } from './components/AdminRestaurants';
import { AdminUsers } from './components/AdminUsers';
import { AdminRoles } from './components/AdminRoles';
import { AdminSettings } from './components/AdminSettings';
import { AdminAuditLogs } from './components/AdminAuditLogs';
import { RestaurantDashboard } from './components/RestaurantDashboard';
import { RestaurantProfileEditor } from './components/RestaurantProfileEditor';
import { RestaurantHoursEditor } from './components/RestaurantHoursEditor';
import { RestaurantStaffManager } from './components/RestaurantStaffManager';
import { RestaurantOnboarding } from './components/RestaurantOnboarding';
import { RestaurantDetailModal } from './components/RestaurantDetailModal';
import { SecurityTestModal } from './components/SecurityTestModal';
import { AuthModal } from './components/AuthModal';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User>(backend.currentUser);
  const [currentTab, setCurrentTab] = useState<string>('marketplace');
  const [adminSubtab, setAdminSubtab] = useState<string>('dashboard');
  const [merchantSubtab, setMerchantSubtab] = useState<string>('dashboard');
  const [selectedCity, setSelectedCity] = useState<string>('All');
  const [inspectRestaurant, setInspectRestaurant] = useState<Restaurant | null>(null);
  const [securityModalOpen, setSecurityModalOpen] = useState<boolean>(false);
  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);
  const [, setRefreshKey] = useState(0);

  const refreshState = () => {
    const user = { ...backend.currentUser };
    setCurrentUser(user);
    setRefreshKey((prev) => prev + 1);

    // If new role cannot access current tab, navigate gracefully to marketplace
    const userIsAdmin = user.roles.includes('super-admin') || user.roles.includes('admin');
    const userIsMerchant = user.roles.includes('restaurant-owner') || user.roles.includes('restaurant-staff');

    if (currentTab === 'admin' && !userIsAdmin) {
      setCurrentTab('marketplace');
    } else if (currentTab === 'restaurant' && !userIsMerchant) {
      setCurrentTab('marketplace');
    }
  };

  const isAdmin = currentUser.roles.includes('super-admin') || currentUser.roles.includes('admin');
  const isOwner = currentUser.roles.includes('restaurant-owner');
  const isStaff = currentUser.roles.includes('restaurant-staff');

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-800 flex flex-col font-sans antialiased">
      {/* Top Navbar */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        currentUser={currentUser}
        onUserChange={refreshState}
        onOpenSecurityModal={() => setSecurityModalOpen(true)}
        onOpenAuthModal={() => setAuthModalOpen(true)}
        selectedCity={selectedCity}
        setSelectedCity={setSelectedCity}
      />

      {/* Main Container */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* PUBLIC MARKETPLACE VIEW */}
        {currentTab === 'marketplace' && (
          <PublicMarketplace
            selectedCity={selectedCity}
            onSelectRestaurant={(rest) => setInspectRestaurant(rest)}
            onApplyClick={() => setCurrentTab('apply')}
          />
        )}

        {/* PARTNER ONBOARDING VIEW */}
        {currentTab === 'apply' && (
          <RestaurantOnboarding
            onSuccess={() => {
              refreshState();
              setCurrentTab('admin');
              setAdminSubtab('restaurants');
            }}
          />
        )}

        {/* ADMIN PORTAL VIEW */}
        {currentTab === 'admin' && (
          <div className="space-y-6">
            {/* Admin Subnav */}
            <div className="bg-white rounded-2xl p-2 border border-slate-200 shadow-xs flex items-center space-x-1 overflow-x-auto scrollbar-none">
              <button
                onClick={() => setAdminSubtab('dashboard')}
                className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                  adminSubtab === 'dashboard'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Shield className="w-3.5 h-3.5 text-orange-400" />
                <span>Dashboard</span>
              </button>

              <button
                onClick={() => setAdminSubtab('restaurants')}
                className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                  adminSubtab === 'restaurants'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Store className="w-3.5 h-3.5 text-orange-400" />
                <span>Restaurants & Approvals</span>
              </button>

              <button
                onClick={() => setAdminSubtab('users')}
                className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                  adminSubtab === 'users'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Users className="w-3.5 h-3.5 text-orange-400" />
                <span>User Directory</span>
              </button>

              <button
                onClick={() => setAdminSubtab('roles')}
                className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                  adminSubtab === 'roles'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Key className="w-3.5 h-3.5 text-orange-400" />
                <span>Roles & Permissions</span>
              </button>

              <button
                onClick={() => setAdminSubtab('settings')}
                className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                  adminSubtab === 'settings'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <SettingsIcon className="w-3.5 h-3.5 text-orange-400" />
                <span>Settings</span>
              </button>

              <button
                onClick={() => setAdminSubtab('audit-logs')}
                className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                  adminSubtab === 'audit-logs'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Activity className="w-3.5 h-3.5 text-orange-400" />
                <span>Audit Logs</span>
              </button>
            </div>

            {/* Subtab Contents */}
            {adminSubtab === 'dashboard' && (
              <AdminDashboard
                onNavigateTab={(tab) => {
                  if (tab === 'admin-restaurants') setAdminSubtab('restaurants');
                  if (tab === 'admin-audit-logs') setAdminSubtab('audit-logs');
                }}
              />
            )}
            {adminSubtab === 'restaurants' && <AdminRestaurants onRefresh={refreshState} />}
            {adminSubtab === 'users' && <AdminUsers onRefresh={refreshState} />}
            {adminSubtab === 'roles' && <AdminRoles onRefresh={refreshState} />}
            {adminSubtab === 'settings' && <AdminSettings onRefresh={refreshState} />}
            {adminSubtab === 'audit-logs' && <AdminAuditLogs />}
          </div>
        )}

        {/* MERCHANT / RESTAURANT PORTAL VIEW */}
        {currentTab === 'restaurant' && (
          <div className="space-y-6">
            {/* Merchant Subnav */}
            <div className="bg-white rounded-2xl p-2 border border-slate-200 shadow-xs flex items-center space-x-1 overflow-x-auto scrollbar-none">
              <button
                onClick={() => setMerchantSubtab('dashboard')}
                className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                  merchantSubtab === 'dashboard'
                    ? 'bg-orange-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Store className="w-3.5 h-3.5" />
                <span>Overview</span>
              </button>

              <button
                onClick={() => setMerchantSubtab('profile')}
                className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                  merchantSubtab === 'profile'
                    ? 'bg-orange-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Store className="w-3.5 h-3.5" />
                <span>Profile & Brand</span>
              </button>

              <button
                onClick={() => setMerchantSubtab('hours')}
                className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                  merchantSubtab === 'hours'
                    ? 'bg-orange-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                <span>Operating Hours</span>
              </button>

              <button
                onClick={() => setMerchantSubtab('staff')}
                className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                  merchantSubtab === 'staff'
                    ? 'bg-orange-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>Staff Management</span>
              </button>
            </div>

            {/* Merchant Subtab Contents */}
            {merchantSubtab === 'dashboard' && (
              <RestaurantDashboard
                onNavigateSubtab={(sub) => setMerchantSubtab(sub)}
                onRefresh={refreshState}
              />
            )}
            {merchantSubtab === 'profile' && <RestaurantProfileEditor onRefresh={refreshState} />}
            {merchantSubtab === 'hours' && <RestaurantHoursEditor onRefresh={refreshState} />}
            {merchantSubtab === 'staff' && <RestaurantStaffManager onRefresh={refreshState} />}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-8 border-t border-slate-800 mt-auto text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded-lg bg-orange-600 flex items-center justify-center font-bold text-white text-xs">
              FF
            </div>
            <span className="font-bold text-slate-200">Fastflow Multi-Vendor Marketplace</span>
          </div>

          <p className="text-slate-500">
            Phase 1 Foundation: Laravel 11.x Backend + RBAC + Restaurant Workflows + Public Directory
          </p>
        </div>
      </footer>

      {/* Inspect Restaurant Modal */}
      <RestaurantDetailModal
        restaurant={inspectRestaurant}
        onClose={() => setInspectRestaurant(null)}
      />

      {/* Security Suite Modal */}
      <SecurityTestModal
        isOpen={securityModalOpen}
        onClose={() => setSecurityModalOpen(false)}
      />

      {/* Account Login / Registration Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        currentUser={currentUser}
        onLoginSuccess={(user) => {
          setCurrentUser(user);
          refreshState();
        }}
        onLogout={() => {
          refreshState();
        }}
      />
    </div>
  );
}
