import React, { useState } from 'react';

interface AdminLayoutProps {
  user?: { name: string; email: string };
  title?: string;
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  user = { name: 'Administrator', email: 'admin@fastflow.local' },
  title = 'Admin Portal',
  children,
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-sans">
      {/* Mobile Header */}
      <div className="md:hidden bg-slate-900 text-white p-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-orange-600 flex items-center justify-center font-bold text-white text-xs">FF</div>
          <span className="font-bold text-base">Fastflow Admin</span>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 text-slate-300 hover:text-white"
        >
          <span className="sr-only">Toggle Sidebar</span>
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`w-64 bg-slate-900 text-slate-300 flex-shrink-0 flex flex-col transition-all duration-200 z-30 ${
          sidebarOpen ? 'block' : 'hidden md:flex'
        }`}
      >
        <div className="p-6 border-b border-slate-800 hidden md:flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-orange-600 flex items-center justify-center font-bold text-white text-base shadow-md shadow-orange-600/30">
            FF
          </div>
          <div>
            <h1 className="font-bold text-white tracking-wide text-sm">Fastflow</h1>
            <p className="text-[11px] text-slate-400">Enterprise Administration</p>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto text-xs">
          <a
            href="/admin/dashboard"
            className="flex items-center space-x-3 px-3 py-2 rounded-lg font-medium hover:bg-slate-800 hover:text-white transition"
          >
            <span>Dashboard</span>
          </a>
          <a
            href="/admin/restaurants"
            className="flex items-center space-x-3 px-3 py-2 rounded-lg font-medium hover:bg-slate-800 hover:text-white transition"
          >
            <span>Restaurants & Approvals</span>
          </a>
          <a
            href="/admin/users"
            className="flex items-center space-x-3 px-3 py-2 rounded-lg font-medium hover:bg-slate-800 hover:text-white transition"
          >
            <span>User Directory</span>
          </a>
          <a
            href="/admin/roles"
            className="flex items-center space-x-3 px-3 py-2 rounded-lg font-medium hover:bg-slate-800 hover:text-white transition"
          >
            <span>Roles & Permissions</span>
          </a>
          <a
            href="/admin/settings"
            className="flex items-center space-x-3 px-3 py-2 rounded-lg font-medium hover:bg-slate-800 hover:text-white transition"
          >
            <span>System Settings</span>
          </a>
          <a
            href="/admin/audit-logs"
            className="flex items-center space-x-3 px-3 py-2 rounded-lg font-medium hover:bg-slate-800 hover:text-white transition"
          >
            <span>Security Audit Logs</span>
          </a>
        </nav>

        <div className="p-4 border-t border-slate-800 bg-slate-950/40">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center font-bold text-white text-xs">
              {user.name.charAt(0)}
            </div>
            <div className="truncate text-xs">
              <p className="font-semibold text-white truncate">{user.name}</p>
              <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-20">
          <h2 className="text-lg font-bold text-slate-800">{title}</h2>
          <div className="flex items-center space-x-4">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
              System Active
            </span>
          </div>
        </header>

        <main className="p-6">{children}</main>
      </div>
    </div>
  );
};
