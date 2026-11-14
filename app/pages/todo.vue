<script setup lang="ts">

definePageMeta({ middleware: "auth" });
const today = new Date();
const selectedDate = ref(today);
function handleDateChange(date: Date) {
    selectedDate.value = date;
}
function formatLocalDate(date: Date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}
const { data: todos } = await useFetch("/api/todo", {
    query: {
        date: computed(() => {
            return formatLocalDate(selectedDate.value);
        }),
    },
});
</script>
<template>
    <div class="flex h-screen flex-col">
        <todoDateScroller @date-change="handleDateChange" />

        <div class="min-h-0 flex-1">
            <todoDayCard
                :uuid="todos?.[0]?.uuid ?? ''"
                :title="todos?.[0]?.title ?? ''"
                :description="todos?.[0]?.description ?? ''"
            />
        </div>
    </div>
</template>
