import React from 'react';
import {
  Users,
  Store,
  Clock,
  UserCheck,
  Server,
  Activity,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  ShieldAlert,
} from 'lucide-react';
import { backend } from '../services/mockBackend';

interface AdminDashboardProps {
  onNavigateTab: (tab: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigateTab }) => {
  const users = backend.getUsers();
  const restaurants = backend.getAllRestaurants();
  const pendingCount = restaurants.filter(r => r.approval_status === 'pending').length;
  const activeCount = restaurants.filter(r => r.approval_status === 'approved' && r.status === 'active').length;
  const suspendedCount = restaurants.filter(r => r.status === 'suspended').length;
  const auditLogs = backend.getAuditLogs().slice(0, 5);

  const kpis = [
    {
      title: 'Total Users',
      value: users.length,
      subtitle: `${users.filter(u => u.roles.includes('customer')).length} customers, ${users.filter(u => u.roles.includes('restaurant-owner')).length} vendors`,
      icon: Users,
      color: 'text-blue-600 bg-blue-50 border-blue-200',
    },
    {
      title: 'Active Restaurants',
      value: activeCount,
      subtitle: `${suspendedCount} suspended / inactive`,
      icon: Store,
      color: 'text-emerald-600 bg-emerald-50 border-emerald-200',
    },
    {
      title: 'Pending Applications',
      value: pendingCount,
      subtitle: pendingCount > 0 ? 'Requires administrative review' : 'All applications processed',
      icon: Clock,
      color: pendingCount > 0 ? 'text-amber-600 bg-amber-50 border-amber-300' : 'text-slate-600 bg-slate-50 border-slate-200',
      badge: pendingCount > 0 ? 'Action Needed' : undefined,
    },
    {
      title: 'Active Restaurant Staff',
      value: users.filter(u => u.roles.includes('restaurant-staff')).length,
      subtitle: 'Tenant-isolated accounts',
      icon: UserCheck,
      color: 'text-purple-600 bg-purple-50 border-purple-200',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Welcome & System Status Bar */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-2xl p-6 shadow-sm border border-slate-700 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-orange-500 text-white">
              Enterprise Dashboard
            </span>
            <span className="text-xs text-slate-400">Phase 1 Infrastructure</span>
          </div>
          <h1 className="text-2xl font-bold mt-1 text-white">Marketplace Administration</h1>
          <p className="text-sm text-slate-300 mt-0.5">
            Operational governance, vendor application review, RBAC roles, and security audit logs.
          </p>
        </div>

        {/* System Telemetry Badge */}
        <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-3 flex items-center space-x-4 text-xs">
          <div className="flex items-center space-x-2">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-slate-300 font-medium">PHP 8.2 / Laravel 11.x</span>
          </div>
          <div className="h-4 w-px bg-slate-700" />
          <div className="flex items-center space-x-1.5 text-slate-300">
            <Server className="w-3.5 h-3.5 text-orange-400" />
            <span>MySQL 8.0</span>
          </div>
          <div className="h-4 w-px bg-slate-700" />
          <div className="text-emerald-400 font-medium">Sanctum RBAC Active</div>
        </div>
      </div>

      {/* Pending Application Alert Banner */}
      {pendingCount > 0 && (
        <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-xl flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />
            <div>
              <p className="text-sm font-bold text-amber-900">
                {pendingCount} Restaurant {pendingCount === 1 ? 'Application is' : 'Applications are'} Awaiting Approval
              </p>
              <p className="text-xs text-amber-700">
                Unapproved vendors remain strictly hidden from the public marketplace until verified.
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigateTab('admin-restaurants')}
            className="flex items-center space-x-1 bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs px-3 py-1.5 rounded-lg transition"
          >
            <span>Review Now</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div key={idx} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{kpi.title}</span>
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center border ${kpi.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3 flex items-baseline space-x-2">
                <span className="text-3xl font-extrabold text-slate-900 tracking-tight">{kpi.value}</span>
                {kpi.badge && (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-200">
                    {kpi.badge}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 mt-1">{kpi.subtitle}</p>
            </div>
          );
        })}
      </div>

      {/* 2-Column Split: Recent Vendor Applications & Security Audit Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Vendor Review Queue */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
              <Store className="w-4 h-4 text-orange-600" />
              <span>Restaurant Directory Overview</span>
            </h2>
            <button
              onClick={() => onNavigateTab('admin-restaurants')}
              className="text-xs font-semibold text-orange-600 hover:text-orange-700"
            >
              View All ({restaurants.length})
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {restaurants.map((rest) => (
              <div key={rest.id} className="py-3 flex items-center justify-between gap-3">
                <div className="flex items-center space-x-3 truncate">
                  <img
                    src={rest.logo}
                    alt={rest.name}
                    className="w-10 h-10 rounded-xl object-cover border border-slate-200 flex-shrink-0"
                  />
                  <div className="truncate">
                    <p className="text-sm font-bold text-slate-800 truncate">{rest.name}</p>
                    <p className="text-xs text-slate-500 truncate">{rest.city}, {rest.area} • Owner: {rest.owner_name}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-2 flex-shrink-0">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                    rest.approval_status === 'approved'
                      ? 'bg-emerald-100 text-emerald-800'
                      : rest.approval_status === 'pending'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-rose-100 text-rose-800'
                  }`}>
                    {rest.approval_status.replace('_', ' ')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Live Security Audit Log Snippet */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
              <Activity className="w-4 h-4 text-emerald-600" />
              <span>Recent Security & Audit Events</span>
            </h2>
            <button
              onClick={() => onNavigateTab('admin-audit-logs')}
              className="text-xs font-semibold text-orange-600 hover:text-orange-700"
            >
              Audit Trail ({backend.getAuditLogs().length})
            </button>
          </div>

          <div className="space-y-3">
            {auditLogs.map((log) => (
              <div key={log.id} className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs">
                <div className="flex items-center justify-between text-slate-500 mb-1">
                  <span className="font-bold text-slate-700">{log.user_name}</span>
                  <span>{new Date(log.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <p className="text-slate-800 font-medium">{log.description}</p>
                <div className="flex items-center space-x-2 mt-1.5 text-[10px] text-slate-400">
                  <span className="px-1.5 py-0.5 rounded bg-slate-200 text-slate-700 uppercase font-bold">{log.module}</span>
                  <span>IP: {log.ip_address}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Analytics Placeholder (As required by Phase 1 prompt - no advanced reports yet) */}
      <div className="bg-slate-50 rounded-2xl p-6 border border-dashed border-slate-300 text-center">
        <TrendingUp className="w-8 h-8 text-slate-400 mx-auto mb-2" />
        <h3 className="text-sm font-bold text-slate-700">Financial, Order & Commission Analytics (Phase 2 & 3 Placeholder)</h3>
        <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
          Detailed revenue breakdowns, delivery route telemetry, and platform commissions will become active in Phase 2 & 3 after ordering and payment gateways are provisioned.
        </p>
      </div>
    </div>
  );
};
