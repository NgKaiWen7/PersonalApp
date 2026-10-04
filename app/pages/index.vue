<script setup lang="ts">
definePageMeta({
    middleware: "auth",
})
</script>
<template>
  <main class="flex min-h-screen items-center justify-center bg-slate-950 p-8">
    <section class="max-w-2xl text-center">
      <p class="mb-6 text-sm font-medium uppercase tracking-widest text-slate-400">
        Daily Quote
      </p>

      <blockquote class="text-3xl font-semibold leading-relaxed text-white">
        “The secret of getting ahead is getting started.”
      </blockquote>

      <p class="mt-6 text-slate-400">
        — Mark Twain
      </p>
    </section>
  </main>
</template>
