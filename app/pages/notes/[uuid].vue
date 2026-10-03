<script setup lang="ts">
const route = useRoute();
const title = ref(null);
const description = ref(null);
const category = ref(null);
const saved = ref(false);
const draggedIndex = ref<number | null>(null);
let saveTimer: ReturnType<typeof setTimeout> | undefined;
const uuid = route.params.uuid as string;
interface NoteBlock {
    id: string;
    note_id: string;
    position: number;
    content: string | null;
    type: string;
    link: string | null;
}
const blocks = ref<NoteBlock[]>([]);
const { getNoteBlocks, addBlock } = useNoteBlocks(uuid, blocks);
async function getNote() {
    const response = await fetch(`/api/notes/${uuid}`);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    const note = await response.json();
    title.value = note.title;
    description.value = note.description;
    category.value = note.category;
}
async function handleChange() {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(async () => {
        const response = await fetch(`/api/notes/${uuid}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                title: title.value,
                description: description.value,
            }),
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        saved.value = true;
        setTimeout(() => {
            saved.value = false;
        }, 1000);
    }, 1000);
}
function handleBack() {
    navigateTo(`/notes`);
}
async function handleDelete() {
    const response = await fetch(`/api/notes/${uuid}`, {
        method: "DELETE",
    });
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    await navigateTo("/notes");
}
async function saveBlockOrder() {
    const response = await fetch(`/api/notes/blocks/${uuid}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(blocks.value.map((block) => block.id)),
    });
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
}
function handleDragStart(index: number) {
    console.log("drag start", index);
    draggedIndex.value = index;
}
function handleDrop(index: number) {
    if (draggedIndex.value === null) return;
    if (draggedIndex.value === index) return;
    const [block] = blocks.value.splice(draggedIndex.value, 1);
    blocks.value.splice(index, 0, block);
    draggedIndex.value = null;
}
function handleDragEnd() {
    console.log("drag end");
    draggedIndex.value = null;
    saveBlockOrder();
}
function handleDragOver(index: number) {
    if (draggedIndex.value === null) return;
    if (draggedIndex.value === index) return;
    const [block] = blocks.value.splice(draggedIndex.value, 1);
    blocks.value.splice(index, 0, block);
    draggedIndex.value = index;
}
function handleAddText() {
  addBlock();
}
onMounted(() => {
    getNoteBlocks();
    getNote();
});
</script>
<template>
    <Saved :show="saved" />
    <div class="flex w-full justify-between px-4">
        <Button
            class="border border-slate-700 bg-slate-900 text-slate-300 hover:bg-slate-800"
            @click="handleBack"
        >
            ← Back
        </Button>

        <Button
            class="border border-red-500/30 bg-red-950/40 text-red-400 hover:bg-red-950/70"
            @click="handleDelete"
        >
            Delete
        </Button>
    </div>
    <div v-if="blocks" class="w-full p-4 sm:p-6">
        <!-- Header -->
        <div class="mb-6">
            <input
                v-model="title"
                type="text"
                class="w-full bg-transparent text-2xl font-bold text-white outline-none"
                placeholder="Note title"
                @blur="handleChange"
            />

            <textarea
                v-model="description"
                rows="2"
                class="mt-1 w-full resize-none bg-transparent text-sm text-slate-400 outline-none"
                placeholder="Description"
                @blur="handleChange"
            />
        </div>
        <!-- Blocks -->
        <div class="space-y-1">
            <template v-for="(block, index) in blocks" :key="block.id">
                <noteTextBlock
                    :uuid="block.id"
                    :content="block.content"
                    @drag-start="handleDragStart(index)"
                    @drag-over="handleDragOver(index)"
                    @drag-end="handleDragEnd"
                    @drop="handleDrop(index)"
                />
            </template>
            <Button
                class="mt-2 border border-slate-700 bg-slate-900 text-slate-300 hover:bg-slate-800"
                @click="handleAddText"
            >
                + Text
            </Button>
        </div>
    </div>
    <div v-else class="p-6 text-sm text-slate-500">Loading...</div>
</template>
