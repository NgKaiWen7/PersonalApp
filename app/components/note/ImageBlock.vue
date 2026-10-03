<script setup lang="ts">
const props = defineProps<{
    uuid: string;
    content: string;
}>();

const textValue = ref(props.content);
const saved = ref(false);
let saveTimer: ReturnType<typeof setTimeout> | undefined;
function handleChange() {
    clearTimeout(saveTimer);

    saveTimer = setTimeout(async () => {
        try {
            const response = await fetch(`/api/notes/${props.uuid}/content`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "text/plain",
                },
                body: textValue.value,
            });

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
</script>

<template>
    <Saved :show="saved" />
    <textarea
        v-model="textValue"
        rows="6"
        class="w-full resize-none rounded-md border border-[#E49C1B]/30 bg-slate-950 px-3 py-2 text-sm leading-relaxed text-white outline-none transition focus:border-[#E49C1B]"
        @input="handleChange"
    />
</template>
