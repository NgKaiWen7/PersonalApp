<script setup lang="ts">
const props = defineProps<{
    show: boolean;
}>();
const animals = [
    "🐶",
    "🐱",
    "🐭",
    "🐹",
    "🐰",
    "🦊",
    "🐻",
    "🐼",
    "🐨",
    "🐯",
    "🦁",
    "🐸",
    "🐵",
    "🐙",
    "🦄",
];

const animal = ref("");

onMounted(() => {
    animal.value = animals[Math.floor(Math.random() * animals.length)];
});
watch(
    () => props.show,
    (show) => {
        if (show) {
            animal.value = animals[Math.floor(Math.random() * animals.length)];
        }
    },
);
</script>

<template>
    <div
        v-if="show"
        class="fixed left-1/2 top-6 z-50 -translate-x-1/2 rounded-lg bg-slate-800 px-4 py-2 text-sm text-white shadow-lg"
    >
        {{ animal }} Saved
    </div>
</template>
