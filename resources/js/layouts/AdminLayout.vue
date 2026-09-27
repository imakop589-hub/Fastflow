<script setup>
import { ref } from 'vue'

const props = defineProps({
  user: { type: Object, required: true },
  title: { type: String, default: 'Admin Portal' }
})

const sidebarOpen = ref(false)
</script>

<template>
  <div class="min-h-screen bg-slate-50 flex flex-col md:flex-row">
    <!-- Mobile Header -->
    <div class="md:hidden bg-slate-900 text-white p-4 flex items-center justify-between">
      <div class="flex items-center space-x-2">
        <div class="w-8 h-8 rounded-lg bg-orange-600 flex items-center justify-center font-bold text-white">FB</div>
        <span class="font-bold text-lg">FoodBrio Admin</span>
      </div>
      <button @click="sidebarOpen = !sidebarOpen" class="p-2 text-slate-300 hover:text-white">
        <span class="sr-only">Toggle Sidebar</span>
        <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7" />
        </svg>
      </button>
    </div>

    <!-- Sidebar Navigation -->
    <aside :class="['w-64 bg-slate-900 text-slate-300 flex-shrink-0 flex flex-col transition-all duration-200 z-30', sidebarOpen ? 'block' : 'hidden md:flex']">
      <div class="p-6 border-b border-slate-800 hidden md:flex items-center space-x-3">
        <div class="w-9 h-9 rounded-xl bg-orange-600 flex items-center justify-center font-bold text-white text-lg shadow-md shadow-orange-600/30">FB</div>
        <div>
          <h1 class="font-bold text-white tracking-wide">FoodBrio</h1>
          <p class="text-xs text-slate-400">Enterprise Administration</p>
        </div>
      </div>

      <nav class="flex-1 p-4 space-y-1.5 overflow-y-auto">
        <a href="/admin/dashboard" class="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-slate-800 hover:text-white transition">
          <span>Dashboard</span>
        </a>
        <a href="/admin/restaurants" class="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-slate-800 hover:text-white transition">
          <span>Restaurants & Approvals</span>
        </a>
        <a href="/admin/users" class="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-slate-800 hover:text-white transition">
          <span>User Directory</span>
        </a>
        <a href="/admin/roles" class="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-slate-800 hover:text-white transition">
          <span>Roles & Permissions</span>
        </a>
        <a href="/admin/settings" class="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-slate-800 hover:text-white transition">
          <span>System Settings</span>
        </a>
        <a href="/admin/audit-logs" class="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-slate-800 hover:text-white transition">
          <span>Security Audit Logs</span>
        </a>
      </nav>

      <div class="p-4 border-t border-slate-800 bg-slate-950/40">
        <div class="flex items-center space-x-3">
          <div class="w-9 h-9 rounded-full bg-slate-700 flex items-center justify-center font-medium text-white">
            {{ user?.name ? user.name.charAt(0) : 'A' }}
          </div>
          <div class="truncate">
            <p class="text-sm font-medium text-white truncate">{{ user?.name || 'Administrator' }}</p>
            <p class="text-xs text-slate-400 truncate">{{ user?.email || 'admin@foodbrio.local' }}</p>
          </div>
        </div>
      </div>
    </aside>

    <!-- Main Content Area -->
    <div class="flex-1 flex flex-col min-w-0 overflow-y-auto">
      <header class="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-20">
        <h2 class="text-xl font-bold text-slate-800">{{ title }}</h2>
        <div class="flex items-center space-x-4">
          <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
            System Active
          </span>
        </div>
      </header>

      <main class="p-6">
        <slot />
      </main>
    </div>
  </div>
</template>
