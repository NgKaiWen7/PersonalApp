
<script setup lang="ts">
const route = useRoute();

const id = computed(() => String(route.params.id));
const fileUrl = computed(() => `/api/readings/file/${id.value}`);
</script>

<template>
  <div class="flex h-screen flex-col overflow-hidden bg-[#191A33] text-white">
    <header
      class="flex h-12 shrink-0 items-center justify-between border-b border-white/10 px-4"
    >
      <NuxtLink
        to="/readings"
        class="flex items-center gap-2 text-sm text-white/60 transition hover:text-white"
      >
        <Icon name="lucide:arrow-left" class="size-4" />
        Readings
      </NuxtLink>

      <span class="text-xs text-white/40">PDF Reader</span>

      <a
        :href="fileUrl"
        target="_blank"
        rel="noopener noreferrer"
        class="text-sm text-white/60 transition hover:text-[#E49C1B]"
      >
        Open in new tab
      </a>
    </header>


    <main class="min-h-0 flex-1 overflow-hidden">
      <div class="h-full w-full overflow-auto overscroll-contain">
        <iframe
          :src="fileUrl"
          class="h-full w-full border-0"
          title="PDF Reader"
          style="touch-action: pan-y"
        />
      </div>
    </main>

  </div>
</template>
