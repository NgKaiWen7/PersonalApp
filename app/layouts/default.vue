<script setup lang="ts">
const sidebarOpen = ref(true);
const { data: quote } = await useFetch("/api/quote");
</script>

<template>
  <div class="min-h-screen bg-black text-white">
    <!-- Sidebar -->
    <aside
      v-if="sidebarOpen"
      class="fixed inset-y-0 left-0 z-40 w-70 border-r border-white/[0.08] bg-black"
    >
      <button
        class="m-4 rounded-lg px-3 py-2 text-xl hover:bg-white/[0.06]"
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

    <!-- Main -->
    <main
      class="min-h-screen"
      :class="sidebarOpen ? 'ml-70' : ''"
    >
        <div class="flex h-16 items-center gap-3 px-6">
          <button
            v-if="!sidebarOpen"
            class="shrink-0 rounded-lg px-2 py-1 text-xl hover:bg-white/[0.06]"
            @click="sidebarOpen = true"
          >
            🦜
          </button>

          <Transition
            appear
            enter-active-class="transition-all duration-[1200ms] ease-out"
            enter-from-class="translate-x-[-16px] opacity-0"
            enter-to-class="translate-x-0 opacity-100"
          >
            <div
              v-if="quote"
              class="min-w-0 flex-1 overflow-x-auto scrollbar-none"
            >
              <p
                class="w-max whitespace-nowrap text-sm font-semibold tracking-wide text-[#C5A24A]"
              >
                {{ quote.q }}
                <span class="text-neutral-600">
                  — {{ quote.a }}
                </span>
              </p>
            </div>
          </Transition>
        </div>

      <slot />
    </main>
  </div>
</template>
