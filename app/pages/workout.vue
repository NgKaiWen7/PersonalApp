<script setup lang="ts">
definePageMeta({
    middleware: "auth",
})
const selectedDay = ref("Push");
const days = ["Push", "Pull", "Legs"];
const { total, loadTotal } = useWorkout();
onMounted(() => {
    loadTotal();
});
</script>
<template>
    <div class="h-full w-full p-4 sm:p-6">
        <!-- Total Load -->
        <div class="mb-6">
            <div class="text-sm text-slate-400">
                Total Volume Today
            </div>

            <div class="text-2xl font-bold text-[#E49C1B] sm:text-3xl">
                {{ total }} kg
            </div>
        </div>

        <!-- Tabs -->
        <div class="mb-6 flex w-full gap-2">
            <button
                v-for="day in days"
                :key="day"
                type="button"
                class="rounded-md px-4 py-2 text-sm font-medium transition"
                :class="
                    selectedDay === day
                        ? 'bg-[#E49C1B] text-slate-950'
                        : 'bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                "
                @click="selectedDay = day"
            >
                {{ day }}
            </button>
        </div>

        <!-- Selected workout -->
        <WorkoutDay :day="selectedDay" />
    </div>
</template>
