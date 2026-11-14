<script setup lang="ts">
import { ArrowLeft, Save, Trash2 } from "@lucide/vue";

const props = defineProps<{
    noteId: string;
}>();

interface Note {
    id: string;
    title: string;
    description: string;
    content: string;
}

const title = ref("");
const description = ref("");
const content = ref("");
const note = ref<Note | null>(null);
const saved = ref(false);
const pendingImage = ref<File | null>(null);
let saveTimer: ReturnType<typeof setTimeout> | undefined;

async function getNote() {
    const response = await fetch(`/api/notes/${props.noteId}`);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    note.value = await response.json();
    title.value = note.value.title;
    description.value = note.value.description;
    content.value = note.value.content;
}

function handleChange() {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(saveNote, 1000);
}

async function saveNote() {
    clearTimeout(saveTimer);
    const response = await fetch(`/api/notes/${props.noteId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            title: title.value,
            description: description.value,
            content: content.value,
        }),
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    saved.value = true;
    setTimeout(() => {
        saved.value = false;
    }, 1000);
}

function handleBack() {
    navigateTo("/notes");
}

async function handleDelete() {
    const response = await fetch(`/api/notes/${props.noteId}`, {
        method: "DELETE",
    });
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    await navigateTo("/notes");
}

function handlePaste(event: ClipboardEvent) {
    const items = event.clipboardData?.items;
    if (!items) return;

    for (const item of items) {
        if (!item.type.startsWith("image/")) continue;

        event.preventDefault();
        const file = item.getAsFile();
        if (file) pendingImage.value = file;
        return;
    }
}

async function handleImageInsert(data: {
    file: File;
    filename: string;
    alt: string;
    description: string;
}) {
    const formData = new FormData();
    formData.append("image", data.file, data.filename);
    formData.append("note_id", props.noteId);

    try {
        const image = await $fetch<{ id: string }>("/api/image", {
            method: "POST",
            body: formData,
        });
        content.value += `![${data.alt}](image:${image.id})`;
        pendingImage.value = null;
        handleChange();
    } catch (error) {
        console.error("Failed to upload image:", error);
    }
}

onMounted(getNote);
onUnmounted(() => clearTimeout(saveTimer));
</script>

<template>
    <div v-if="note" class="w-full p-4 sm:p-6">
        <Saved :show="saved" />
        <div class="mb-8 flex w-full items-center justify-between border-b border-white/[0.06] pb-5">
            <Button variant="ghost" aria-label="Back to notes" title="Back to notes" class="flex size-10 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.04] !p-0 text-neutral-400 hover:border-white/[0.14] hover:bg-white/[0.08] hover:text-white" @click="handleBack">
                <ArrowLeft class="size-4" />
            </Button>
            <div class="flex items-center gap-2">
                <Button aria-label="Save note" title="Save note" class="flex size-10 items-center justify-center rounded-lg bg-[radial-gradient(circle_at_center,#f3d77d_0%,#d8b65a_46%,#b78e32_100%)] !p-0 text-[#17140b] shadow-[0_4px_16px_rgba(197,162,74,0.18)] hover:brightness-110" @click="saveNote">
                    <Save class="size-4" />
                </Button>
                <Button variant="ghost" aria-label="Delete note" title="Delete note" class="flex size-10 items-center justify-center rounded-lg border border-red-400/20 bg-red-400/[0.06] !p-0 text-red-300 hover:border-red-400/35 hover:bg-red-400/[0.12] hover:text-red-200" @click="handleDelete">
                    <Trash2 class="size-4" />
                </Button>
            </div>
        </div>

        <div class="mb-6">
            <input v-model="title" type="text" class="w-full bg-transparent text-2xl font-bold text-white outline-none" placeholder="Note title" @blur="handleChange" />
            <textarea v-model="description" rows="2" class="mt-1 w-full resize-none bg-transparent text-sm text-slate-400 outline-none" placeholder="Description" @blur="handleChange" />
        </div>

        <ImageImportCard v-if="pendingImage" :file="pendingImage" @cancel="pendingImage = null" @insert="handleImageInsert" />
        <textarea v-model="content" class="min-h-[60vh] w-full resize-none rounded-md bg-slate-950 p-4 text-sm leading-relaxed text-white outline-none" placeholder="Start writing..." @paste="handlePaste" @blur="handleChange" />
    </div>
    <div v-else class="p-6 text-sm text-slate-500">Loading...</div>
</template>
