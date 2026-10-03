<script setup lang="ts">
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

const selectedOffset = ref(0);
const dateButtons = ref<Record<number, HTMLElement>>({})
const dates = Array.from({ length: 29 }, (_, i) => i - 14);
onMounted(() => {
  selectDate(0)
})
function goToday() {
  selectedOffset.value = 0
  selectDate(0)
}
function formatDate(offset: number) {
  const date = new Date();
  date.setDate(date.getDate() + offset);

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}
const emit = defineEmits<{
  "date-change": [date: Date]
}>()

function selectDate(offset: number) {
  selectedOffset.value = offset

  const date = new Date()
  date.setDate(date.getDate() + offset)

  emit("date-change", date)

  nextTick(() => {
    dateButtons.value[offset]?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    })
  })
}
</script>

<template>
  <div class="border-b bg-background text-foreground">
    <ScrollArea   class="w-full min-w-0 whitespace-nowrap bg-[#191A33] text-white">
        <div class="flex h-16 w-max items-center gap-2 px-4">
        <Button
          v-for="offset in dates"
          :key="offset"
          :ref="(el) => {
            if (el) dateButtons[offset] = el.$el
          }"
          :variant="offset === selectedOffset ? 'default' : 'ghost'"
          class="shrink-0"
          @click="selectDate(offset)"
        >
          <div class="flex flex-col items-center">
            <span class="text-xs">
              {{ offset === 0 ? "Today" : formatDate(offset) }}
            </span>
            <span class="text-[10px] opacity-60">
              {{ offset > 0 ? `+${offset}` : offset }}
            </span>
          </div>
        </Button>
        <Button
          v-if="selectedOffset !== 0"
          variant="outline"
          class="ml-2 shrink-0"
          @click="goToday"
        >
          Today
        </Button>
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  </div>
</template>
