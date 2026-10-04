<script setup lang="ts">
const props = defineProps({
    day: String,
});
const exercises: Record<string, string[]> = {
    Push: [
        "Bench Press",
        "Fly",
        "Lateral Raise",
        "Front Raise",
        "Tricep Pushdown",
        "Tricep Overhead Extension",
        "Incline Dumbbell Press",
    ],
    Pull: [
        "Lat Pulldown (Wide)",
        "Lat Pulldown (Narrow)",
        "Rear Dealts",
        "Face Pull",
        "Pull Over",
        "Row",
        "Bicep Curl",
    ],
    Legs: [
        "Squat",
        "Leg Extension",
        "Calf Raise",
        "Leg Curl",
        "Hip Adduction",
        "Hip Abduction",
    ],
};

const dayExercises = computed(() => {
    return exercises[props.day ?? ""] ?? [];
});
</script>

<template>
    <div class="space-y-4">
        <div class="space-y-2">
            <WorkoutCard
                v-for="exercise in dayExercises"
                :key="exercise"
                :exercise="exercise"
            />
        </div>
    </div>
</template>
