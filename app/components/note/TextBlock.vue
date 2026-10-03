<script setup lang="ts">
const props = defineProps<{
    uuid: string;
    content: string;
}>();
const emit = defineEmits<{
    "drag-start": [];
    "drag-over": [];
    "drop": [];
    "drag-end": [];
}>();
const textarea = ref<HTMLTextAreaElement | null>(null);
function resizeTextarea() {
    if (!textarea.value) return;
    textarea.value.style.height = "auto";
    textarea.value.style.height = `${textarea.value.scrollHeight}px`;
}
const textValue = ref(props.content);
const saved = ref(false);
let saveTimer: ReturnType<typeof setTimeout> | undefined;
function handleChange() {
    resizeTextarea();
    clearTimeout(saveTimer);
    saveTimer = setTimeout(async () => {
        try {
            const response = await fetch(
                `/api/noteblock/content/${props.uuid}`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "text/plain",
                    },
                    body: textValue.value,
                },
            );

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            saved.value = true;
            setTimeout(() => {
                saved.value = false;
            }, 1000);
        } catch (error) {
            console.error("Failed to save note block:", error);
        }
    }, 1000);
}
function handleDragStart() {
    emit("drag-start");
}
function handleDragEnd() {
    emit("drag-end");
}
onMounted(() => {
    resizeTextarea();
});
</script>

<template>
    <Saved :show="saved" />
    <div
        class="flex items-stretch gap-2"
        @dragover.prevent="emit('drag-over')"
        @drop="emit('drop')"
    >
    <div
        class="flex w-6 shrink-0 cursor-grab items-start justify-center pt-2 text-slate-600 hover:text-slate-400 active:cursor-grabbing"
        draggable="true"
        @dragstart="handleDragStart"
        @dragend="handleDragEnd"
    >
        ⋮⋮
    </div>
    <textarea
        ref="textarea"
        v-model="textValue"
        class="min-h-4 w-full resize-none overflow-hidden rounded-md border border-[#E49C1B]/30 bg-slate-950 px-3 py-2 text-sm leading-relaxed text-white outline-none transition focus:border-[#E49C1B]"
        @input="handleChange"
    />
    </div>
</template>
