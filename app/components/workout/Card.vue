<script setup lang="ts">
const props = defineProps({
    exercise: String,
});
const weight = ref<number | null>(null);
const reps = ref<number | null>(null);
const { loadTotal } = useWorkout();
const saved = ref(false);

async function saveWorkout() {
    saved.value = false;
    const response = await fetch("/api/workout", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            exercise: props.exercise,
            weight: weight.value,
            reps: reps.value,
        }),
    });
    if (!response.ok) {
        return;
    }
    saved.value = true;
    setTimeout(() => {
        saved.value = false;
    }, 2000);
    await loadTotal();
}
</script>
<template>
    <Saved :show="saved" />
    <div
        class="grid grid-cols-1 gap-2 rounded-lg border border-slate-800 bg-slate-900/70 p-3 text-left sm:grid-cols-[1fr_1fr_1fr_auto] sm:items-center"
    >
        <label class="block text-sm font-medium text-slate-300">
            {{ exercise }}
        </label>
        <input
            v-model.number="weight"
            type="number"
            inputmode="decimal"
            step="0.1"
            min="0"
            placeholder="kg"
            class="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-xl text-white placeholder:text-slate-600 outline-none transition focus:border-[#E49C1B] focus:ring-1 focus:ring-[#E49C1B]"
        />
        <input
            v-model.number="reps"
            type="number"
            inputmode="numeric"
            step="1"
            min="0"
            placeholder="reps"
            class="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-xl text-white placeholder:text-slate-600 outline-none transition focus:border-[#E49C1B] focus:ring-1 focus:ring-[#E49C1B]"
        />
        <button
            type="button"
            @click="saveWorkout"
            class="rounded-md bg-[#E49C1B] px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-[#f0aa24] active:scale-[0.98]"
        >
            Save
        </button>
    </div>
</template>
