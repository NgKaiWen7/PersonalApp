<script setup lang="ts">
definePageMeta({ middleware: "auth" });
const today = new Date();
const selectedDate = ref(today);
const saved = ref(false);
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
async function handleTodoChange(title: string, description: string) {
    const todo = todos.value?.[0];
    if (!todo) {
        return;
    }
    await $fetch(`/api/todo/${todo.uuid}`, {
        method: "PATCH",
        body: {
            title,
            description,
        },
    });
    saved.value = true;
    setTimeout(() => {
        saved.value = false;
    }, 1000);
}
</script>
<template>
    <Saved :show="saved" />
    <div class="flex h-screen flex-col">
        <todoDateScroller @date-change="handleDateChange" />

        <div class="min-h-0 flex-1">
            <todoDayCard
                :title="todos?.[0]?.title ?? ''"
                :description="todos?.[0]?.description ?? ''"
                @change="handleTodoChange"
            />
        </div>
    </div>
</template>
