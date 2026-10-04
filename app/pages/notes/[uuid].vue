<script setup lang="ts">
definePageMeta({
    middleware: "auth",
});
const route = useRoute();
const title = ref("");
const description = ref("");
const category = ref("");
const content = ref("");
const note = ref(null);
const saved = ref(false);
const isPreview = ref(false);
const pendingImage = ref<File | null>(null);
let saveTimer: ReturnType<typeof setTimeout> | undefined;
const uuid = route.params.uuid as string;
async function getNote() {
    const response = await fetch(`/api/notes/${uuid}`);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    note.value = await response.json();
    title.value = note.value.title;
    description.value = note.value.description;
    category.value = note.value.category;
    content.value = note.value.content;
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
async function handlePaste(event: ClipboardEvent) {
    const items = event.clipboardData?.items;
    if (!items) return;
    for (const item of items) {
        if (!item.type.startsWith("image/")) {
            continue;
        }
        event.preventDefault();
        const file = item.getAsFile();
        if (!file) return;
        pendingImage.value = file;
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
    formData.append("note_id", uuid);
    try {
        const image = await $fetch("/api/image", {
            method: "POST",
            body: formData,
        });
        const markdown = `![${data.alt}](image:${image.id})`;
        content.value += markdown;
        pendingImage.value = null;
        handleChange();
    } catch (error) {
        console.error("Failed to upload image:", error);
    }
}
onMounted(() => {
    getNote();
});
</script>
<template>
    <div v-if="note" class="w-full p-4 sm:p-6">
        <Saved :show="saved" />
        <!-- Actions -->
        <div class="mb-6 flex w-full justify-between">
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
        <ImageImportCard
            v-if="pendingImage"
            :file="pendingImage"
            @cancel="pendingImage = null"
            @insert="handleImageInsert"
        />
        <!-- Markdown editor goes here -->
        <textarea
            v-model="content"
            class="min-h-[60vh] w-full resize-none rounded-md bg-slate-950 p-4 text-sm leading-relaxed text-white outline-none"
            placeholder="Start writing..."
            @paste="handlePaste"
            @blur="handleChange"
        />
    </div>
    <div v-else class="p-6 text-sm text-slate-500">Loading...</div>
</template>
