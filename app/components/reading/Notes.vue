<script setup lang="ts">
defineProps<{
    bookId?: string;
}>();
</script>

<template>
    <NoteList :book-id="bookId" />
</template>
