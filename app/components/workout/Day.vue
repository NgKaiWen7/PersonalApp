<script setup lang="ts">
const props = defineProps({
    day: String,
});
const exercises: Record<string, string[]> = {
    Push: ["Bench Press", "Shoulder Press", "Lateral Raise", "Tricep Pushdown"],
    Pull: ["Pull Up", "Barbell Row", "Lat Pulldown", "Bicep Curl"],
    Legs: ["Squat", "Leg Press", "Leg Curl", "Calf Raise"],
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
