<script setup>
import { ref } from 'vue'

const props = defineProps({
  restaurant: { type: Object, required: true },
  title: { type: String, default: 'Merchant Portal' }
})

const mobileMenu = ref(false)
</script>

<template>
  <div class="min-h-screen bg-slate-50 flex flex-col md:flex-row">
    <!-- Restaurant Portal Sidebar -->
    <aside class="w-full md:w-64 bg-slate-900 text-slate-300 flex-shrink-0 flex flex-col">
      <div class="p-6 border-b border-slate-800 flex items-center justify-between">
        <div class="flex items-center space-x-3">
          <div class="w-9 h-9 rounded-xl bg-orange-600 flex items-center justify-center font-bold text-white text-lg shadow-md shadow-orange-600/30">FB</div>
          <div class="truncate">
            <h1 class="font-bold text-white text-sm truncate">{{ restaurant?.name || 'My Restaurant' }}</h1>
            <p class="text-xs text-orange-400 font-medium">Merchant Portal</p>
          </div>
        </div>
      </div>

      <nav class="p-4 space-y-1">
        <a href="/restaurant/dashboard" class="block px-3 py-2 rounded-lg text-sm font-medium hover:bg-slate-800 hover:text-white">Dashboard</a>
        <a href="/restaurant/profile" class="block px-3 py-2 rounded-lg text-sm font-medium hover:bg-slate-800 hover:text-white">Profile & Brand</a>
        <a href="/restaurant/hours" class="block px-3 py-2 rounded-lg text-sm font-medium hover:bg-slate-800 hover:text-white">Opening Hours</a>
        <a href="/restaurant/staff" class="block px-3 py-2 rounded-lg text-sm font-medium hover:bg-slate-800 hover:text-white">Staff Management</a>
      </nav>
    </aside>

    <div class="flex-1 flex flex-col min-w-0">
      <main class="p-6">
        <slot />
      </main>
    </div>
  </div>
</template>
