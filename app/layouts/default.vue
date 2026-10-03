<script setup lang="ts">
const sidebarOpen = ref(true);
</script>

<template>
  <div class="flex min-h-screen bg-slate-950 text-white">
    <aside
      v-if="sidebarOpen"
      class="w-70 border-r border-slate-800"
    >
      <button
        class="m-4 rounded px-3 py-2 hover:bg-slate-800"
        @click="sidebarOpen = false"
      >
        🦜
      </button>
      <nav class="flex flex-col gap-2 p-4 text-[20px]">
          <NuxtLink to="/">🏠 Home</NuxtLink>
          <NuxtLink to="/todo">☑️ TO DO</NuxtLink>
          <NuxtLink to="/workout">🏋️ Workouts</NuxtLink>
          <NuxtLink to="/readings">📚 Readings</NuxtLink>
          <NuxtLink to="/notes">📝 Notes</NuxtLink>
      </nav>
    </aside>

    <main class="min-w-0 flex-1">
      <button
        v-if="!sidebarOpen"
        class="m-4 rounded px-3 py-2 hover:bg-slate-800"
        @click="sidebarOpen = true"
      >
        🦜
      </button>

      <slot />
    </main>
  </div>
</template>
