<script setup lang="ts">
definePageMeta({
    middleware: "auth",
})
const notes = ref([]);
const search = ref("");
async function getNotes() {
    notes.value = await $fetch("/api/notes");
}
const filteredNotes = computed(() => {
    const query = search.value.toLowerCase().trim();
    if (!query) {
        return notes;
    }
    return notes.filter(
        (note) =>
            note.title.toLowerCase().includes(query) ||
            note.description.toLowerCase().includes(query),
    );
});
async function handleNewDraft() {
    try {
        const note = await $fetch("/api/notes", {
            method: "POST",
            body: {
                title: "New Draft",
                description: "",
                category: "",
                content: "",
            },
        });

        await navigateTo(`/notes/${note.id}`);
    } catch (error) {
        console.error("Failed to create note:", error);
    }
}
onMounted(() => {
    getNotes();
});
function openNote(uuid: string) {
  navigateTo(`/notes/${uuid}`)
}
</script>
<template>
    <div class="w-full p-4 sm:p-6">
        <!-- Header -->
        <div class="mb-6">
            <div class="mb-1 text-2xl font-bold text-white">Notes</div>
            <div class="text-sm italic text-slate-500">
                "I never wrote things down to remember; I always wrote things
                down so I could forget."
            </div>
        </div>
        <!-- Actions -->
        <div class="mb-6 flex flex-col gap-3 sm:flex-row">
            <input
                v-model="search"
                type="text"
                placeholder="Search notes..."
                class="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white placeholder:text-slate-600 outline-none transition focus:border-[#E49C1B] focus:ring-1 focus:ring-[#E49C1B] sm:flex-1"
            />
            <Button
                class="px-3 bg-[#E49C1B] font-medium text-slate-950 hover:bg-[#f0aa24]"
                @click="handleNewDraft"
            >
                + New Draft
            </Button>
        </div>
        <!-- Notes -->
        <div class="space-y-3">
            <noteCard
                v-for="note in notes"
                :key="note.uuid"
                :title="note.title"
                :description="note.description"
                @click="openNote(note.id)"
            />
        </div>
    </div>
</template>
