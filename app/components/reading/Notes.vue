<script setup lang="ts">
defineProps<{
    bookId?: string;
}>();
</script>

<template>
  <div class="mx-[2.5%] flex min-h-0 flex-1 flex-col">
    <NoteList :book-id="bookId" />
  </div>
</template>
