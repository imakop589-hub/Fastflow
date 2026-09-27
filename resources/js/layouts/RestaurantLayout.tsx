import React from 'react';

interface RestaurantLayoutProps {
  restaurant?: { name: string; slug?: string };
  title?: string;
  children: React.ReactNode;
}

export const RestaurantLayout: React.FC<RestaurantLayoutProps> = ({
  restaurant = { name: 'My Restaurant' },
  title = 'Merchant Portal',
  children,
}) => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-sans">
      {/* Restaurant Portal Sidebar */}
      <aside className="w-full md:w-64 bg-slate-900 text-slate-300 flex-shrink-0 flex flex-col">
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-orange-600 flex items-center justify-center font-bold text-white text-base shadow-md shadow-orange-600/30">
              FB
            </div>
            <div className="truncate">
              <h1 className="font-bold text-white text-xs truncate">{restaurant.name}</h1>
              <p className="text-[11px] text-orange-400 font-semibold">{title}</p>
            </div>
          </div>
        </div>

        <nav className="p-4 space-y-1 text-xs">
          <a
            href="/restaurant/dashboard"
            className="block px-3 py-2 rounded-lg font-medium hover:bg-slate-800 hover:text-white transition"
          >
            Dashboard
          </a>
          <a
            href="/restaurant/profile"
            className="block px-3 py-2 rounded-lg font-medium hover:bg-slate-800 hover:text-white transition"
          >
            Profile & Brand
          </a>
          <a
            href="/restaurant/hours"
            className="block px-3 py-2 rounded-lg font-medium hover:bg-slate-800 hover:text-white transition"
          >
            Opening Hours
          </a>
          <a
            href="/restaurant/staff"
            className="block px-3 py-2 rounded-lg font-medium hover:bg-slate-800 hover:text-white transition"
          >
            Staff Management
          </a>
        </nav>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
};
