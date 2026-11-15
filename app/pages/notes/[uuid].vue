<script setup lang="ts">
import Editor from '~/components/note/Editor.vue';
import { ArrowLeft } from "@lucide/vue";

function handleBack() {
    navigateTo("/notes");
}
const route = useRoute()
const noteId = computed(() => String(route.params.uuid ?? ''))

function handleDelete(){
    navigateTo("/notes");
}
</script>

<template>
    <Button variant="ghost" aria-label="Back to notes" title="Back to notes"
        class="flex size-10 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.04] !p-0 text-neutral-400 hover:border-white/[0.14] hover:bg-white/[0.08] hover:text-white"
        @click="handleBack">
        <ArrowLeft class="size-4" />
    </Button>
    <Editor :note-id="noteId"  @deleteNote="handleDelete" />
</template>
