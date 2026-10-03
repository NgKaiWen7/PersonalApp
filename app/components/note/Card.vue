<script setup lang="ts">
const emit = defineEmits(['click'])

defineProps<{
    title?: string;
    description?: string;
}>();
</script>

<template>
    <button
        type="button"
        class="w-full rounded-md px-3 py-1 text-left transition hover:bg-slate-900 border border-[#E49C1B]/30"
        @click="emit('click')"
    >
        <div class="text-base font-semibold text-white">
            {{ title }}
        </div>

        <div class="text-sm leading-relaxed text-slate-400">
            {{ description }}
        </div>
    </button>
</template>
