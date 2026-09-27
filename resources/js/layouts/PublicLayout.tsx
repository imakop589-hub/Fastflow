import React from 'react';

interface PublicLayoutProps {
  appName?: string;
  children: React.ReactNode;
}

export const PublicLayout: React.FC<PublicLayoutProps> = ({
  appName = 'Fastflow',
  children,
}) => {
  return (
    <div className="min-h-screen bg-white flex flex-col text-slate-800 font-sans">
      <header className="border-b border-slate-200 sticky top-0 bg-white/90 backdrop-blur z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <a href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-orange-600 flex items-center justify-center font-bold text-white text-xs shadow-sm">
              FF
            </div>
            <span className="font-extrabold text-xl tracking-tight text-slate-900">{appName}</span>
          </a>

          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
            <a href="/restaurants" className="hover:text-orange-600 transition">Browse Restaurants</a>
            <a href="/register-restaurant" className="hover:text-orange-600 transition">Partner With Us</a>
          </nav>

          <div className="flex items-center space-x-3">
            <a href="/login" className="text-sm font-medium hover:text-orange-600 px-3 py-1.5 transition">
              Sign In
            </a>
            <a
              href="/register-restaurant"
              className="bg-orange-600 hover:bg-orange-700 text-white text-sm font-semibold px-4 py-2 rounded-xl transition shadow-xs"
            >
              Become a Partner
            </a>
          </div>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="bg-slate-950 text-slate-400 py-12 border-t border-slate-800 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 {appName} Multi-Vendor Marketplace. All rights reserved.</p>
          <p className="text-slate-500">Phase 1: Foundation, RBAC, Restaurant Onboarding & Administration.</p>
        </div>
      </footer>
    </div>
  );
};
