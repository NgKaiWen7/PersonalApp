<script setup lang="ts">
const props = defineProps<{
    file: File;
}>();

const emit = defineEmits<{
    cancel: [];
    insert: [data: {
        file: File;
        filename: string;
        alt: string;
        description: string;
    }];
}>();

const filename = ref(props.file.name || "screenshot.png");
const alt = ref("");
const description = ref("");

const previewUrl = URL.createObjectURL(props.file);

function handleInsert() {
    emit("insert", {
        file: props.file,
        filename: filename.value,
        alt: alt.value,
        description: description.value,
    });
}

function handleCancel() {
    URL.revokeObjectURL(previewUrl);
    emit("cancel");
}
</script>

<template>
    <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
        <div class="w-full max-w-lg rounded-lg bg-slate-900 p-6 shadow-xl">
            <div class="mb-5 flex items-center justify-between">
                <h2 class="text-lg font-semibold text-white">
                    Insert Image
                </h2>

                <button
                    class="text-slate-400 hover:text-white"
                    @click="handleCancel"
                >
                    ×
                </button>
            </div>

            <!-- Preview -->
            <div class="mb-5 overflow-hidden rounded-md bg-slate-950">
                <img
                    :src="previewUrl"
                    class="max-h-64 w-full object-contain"
                    alt="Image preview"
                />
            </div>

            <!-- Filename -->
            <div class="mb-4">
                <label class="mb-1 block text-sm text-slate-300">
                    Filename
                </label>

                <input
                    v-model="filename"
                    type="text"
                    class="w-full rounded-md border border-slate-700 bg-slate-800 px-3 py-2 text-white outline-none focus:border-[#E49C1B]"
                />
            </div>

            <!-- Alt text -->
            <div class="mb-4">
                <label class="mb-1 block text-sm text-slate-300">
                    Alt text
                </label>

                <input
                    v-model="alt"
                    type="text"
                    placeholder="Describe the image"
                    class="w-full rounded-md border border-slate-700 bg-slate-800 px-3 py-2 text-white outline-none focus:border-[#E49C1B]"
                />
            </div>

            <!-- Description -->
            <div class="mb-6">
                <label class="mb-1 block text-sm text-slate-300">
                    Description
                </label>

                <textarea
                    v-model="description"
                    rows="3"
                    placeholder="Optional description"
                    class="w-full resize-none rounded-md border border-slate-700 bg-slate-800 px-3 py-2 text-white outline-none focus:border-[#E49C1B]"
                />
            </div>

            <!-- Actions -->
            <div class="flex justify-end gap-2">
                <button
                    class="rounded-md px-4 py-2 text-slate-300 hover:bg-slate-800"
                    @click="handleCancel"
                >
                    Cancel
                </button>

                <button
                    class="rounded-md bg-[#E49C1B] px-4 py-2 font-medium text-slate-950 hover:bg-[#f0aa24]"
                    @click="handleInsert"
                >
                    Insert
                </button>
            </div>
        </div>
    </div>
</template>
