<script setup lang="ts">
definePageMeta({ middleware: "auth" });

const route = useRoute();
const noteId = computed(() => String(route.params.uuid));
</script>

<template>
    <NoteEditor :note-id="noteId" />
</template>
