<script setup lang="ts">
const props = defineProps<{
    uuid: string;
    content: string;
}>();

const textarea = ref<HTMLTextAreaElement | null>(null);
const textValue = ref(props.content);
const saved = ref(false);

let saveTimer: ReturnType<typeof setTimeout> | undefined;

function resizeTextarea() {
    if (!textarea.value) return;

    textarea.value.style.height = "auto";
    textarea.value.style.height = `${textarea.value.scrollHeight}px`;
}

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
            console.error("Failed to save note:", error);
        }
    }, 1000);
}

onMounted(() => {
    resizeTextarea();
});
</script>

<template>
    <Saved :show="saved" />

    <textarea
        ref="textarea"
        v-model="textValue"
        class="min-h-4 w-full resize-none overflow-hidden rounded-md border border-[#E49C1B]/30 bg-slate-950 px-3 py-2 text-sm leading-relaxed text-white outline-none transition focus:border-[#E49C1B]"
        @input="handleChange"
    />
</template>
