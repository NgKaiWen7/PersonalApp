<script setup lang="ts">
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
const selectedOffset = ref(0);
const dateButtons = ref<Record<number, HTMLElement>>({});
const dates = Array.from({ length: 29 }, (_, i) => i - 14);
onMounted(() => {
    selectDate(0);
});
function goToday() {
    selectedOffset.value = 0;
    selectDate(0);
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
    "date-change": [date: Date];
}>();
function selectDate(offset: number) {
    selectedOffset.value = offset;
    const date = new Date();
    date.setDate(date.getDate() + offset);
    emit("date-change", date);
    nextTick(() => {
        dateButtons.value[offset]?.scrollIntoView({
            behavior: "smooth",
            block: "nearest",
            inline: "center",
        });
    });
}
</script>
<template>
  <div class="relative border-b border-white/[0.08] bg-black text-white">
    <ScrollArea class="w-full min-w-0 whitespace-nowrap">
      <div class="flex h-[76px] w-max items-center gap-1.5 px-4 pr-28">
        <Button
          v-for="offset in dates"
          :key="offset"
          :ref="(el) => {
            if (el) dateButtons[offset] = el.$el
          }"
          :variant="offset === selectedOffset ? 'default' : 'ghost'"
          :class="[
            'h-16 min-w-[86px] shrink-0 rounded-xl border transition-all duration-200',
            offset === selectedOffset
              ? 'border-[#C5A24A] bg-[#C5A24A] text-black shadow-[0_4px_20px_rgba(197,162,74,0.12)] hover:bg-[#D8B65A]'
              : 'border-transparent bg-transparent text-neutral-500 hover:border-[#C5A24A]/20 hover:bg-white/[0.04] hover:text-[#C5A24A]'
          ]"
          @click="selectDate(offset)"
        >
          <div class="flex flex-col items-center gap-0.5">
            <span class="text-sm font-bold">
              {{ offset === 0 ? "Today" : formatDate(offset) }}
            </span>

            <span class="text-xs font-bold opacity-60">
              {{ offset > 0 ? `+${offset}` : offset }}
            </span>
          </div>
        </Button>
      </div>

      <ScrollBar orientation="horizontal" />
    </ScrollArea>

    <!-- Always visible -->
    <Button
      v-if="selectedOffset !== 0"
      variant="outline"
      class="absolute right-4 top-1/2 h-10 -translate-y-1/2 rounded-lg border-[#C5A24A]/40 bg-black px-4 text-[#C5A24A] shadow-lg hover:border-[#C5A24A]/60 hover:bg-[#C5A24A]/10 hover:text-[#D8B65A]"
      @click="goToday"
    >
      Today
    </Button>
  </div>
</template>
