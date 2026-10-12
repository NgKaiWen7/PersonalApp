
<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  chapter: string
  chunkNumber: number
  question: string
  keypoints: string[]
  answer: string
}>()

const flipped = ref(false)
</script>

<template>
  <div
    class="w-full max-w-md cursor-pointer rounded-xl border bg-card p-6 shadow-sm transition-all hover:shadow-md"
    @click="flipped = !flipped"
  >
    <div class="mb-6 flex items-center justify-between text-sm text-muted-foreground">
      <span>{{ chapter }}</span>
      <span>Chunk {{ chunkNumber }}</span>
    </div>

    <div class="min-h-48">
      <template v-if="!flipped">
        <p class="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Question
        </p>
        <h3 class="text-lg font-semibold">
          {{ question }}
        </h3>
      </template>

      <template v-else>
        <p class="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Key Points
        </p>

        <ul class="mb-5 list-inside list-disc space-y-1 text-sm">
          <li v-for="(point, index) in keypoints" :key="index">
            {{ point }}
          </li>
        </ul>

        <p class="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Answer
        </p>
        <p class="text-sm leading-relaxed">
          {{ answer }}
        </p>
      </template>
    </div>

    <div class="mt-5 border-t pt-4 text-center text-xs text-muted-foreground">
      {{ flipped ? 'Click to view question' : 'Click to reveal answer' }}
    </div>
  </div>
</template>
