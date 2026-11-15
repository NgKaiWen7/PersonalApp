<script setup lang="ts">
definePageMeta({ middleware: "auth" });

</script>

<template>
    <div class="mb-6">
        <div class="mb-1 text-2xl font-bold text-white">Notes</div>
        <div class="text-sm italic text-slate-500">
            "I never wrote things down to remember; I always wrote things
            down so I could forget."
        </div>
    </div>
    <NoteList />
</template>
