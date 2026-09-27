<script setup>
defineProps({
  appName: { type: String, default: 'FoodBrio' }
})
</script>

<template>
  <div class="min-h-screen bg-white flex flex-col text-slate-800">
    <header class="border-b border-slate-200 sticky top-0 bg-white/90 backdrop-blur z-30">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <a href="/" class="flex items-center space-x-2">
          <div class="w-8 h-8 rounded-lg bg-orange-600 flex items-center justify-center font-bold text-white shadow-sm">FB</div>
          <span class="font-extrabold text-xl tracking-tight text-slate-900">FoodBrio</span>
        </a>

        <nav class="hidden md:flex items-center space-x-6 text-sm font-medium">
          <a href="/restaurants" class="hover:text-orange-600">Browse Restaurants</a>
          <a href="/register-restaurant" class="hover:text-orange-600">Partner With Us</a>
        </nav>

        <div class="flex items-center space-x-3">
          <a href="/login" class="text-sm font-medium hover:text-orange-600 px-3 py-1.5">Sign In</a>
          <a href="/register-restaurant" class="bg-orange-600 hover:bg-orange-700 text-white text-sm font-semibold px-4 py-2 rounded-xl transition">Become a Partner</a>
        </div>
      </div>
    </header>

    <main class="flex-1">
      <slot />
    </main>

    <footer class="bg-slate-950 text-slate-400 py-12 border-t border-slate-800">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p class="text-sm">© 2026 FoodBrio Multi-Vendor Marketplace. Commercial CodeCanyon Edition.</p>
        <p class="text-xs text-slate-500">Phase 1: Foundation, RBAC, Restaurant Onboarding & Administration.</p>
      </div>
    </footer>
  </div>
</template>
