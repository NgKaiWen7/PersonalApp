<script setup lang="ts">

const route = useRoute();

const id = computed(() => String(route.params.id));

const {
    data: chapters,
    status,
    error,
} = await useFetch(() => `/api/readings/chapter/${id.value}`);

const selectedChapterId = ref<string | null>(null);

function openChapter(chapterId: string) {
    selectedChapterId.value = chapterId;
}

function backToChapters() {
    selectedChapterId.value = null;
}
</script>

<template>
    <div class="flex h-screen flex-col overflow-hidden bg-[#191A33] text-white">
        <template v-if="!selectedChapterId">
            <!-- Chapter list -->
            <div
                v-for="chapter in chapters"
                :key="chapter.id"
                class="cursor-pointer rounded-lg border border-white/10 bg-white/5 p-4 transition hover:bg-white/10"
                @click="openChapter(chapter.id)"
            >
                <h2 class="font-medium">{{ chapter.title }}</h2>
                <p class="mt-1 text-sm text-gray-400">
                    Chapter {{ chapter.chapter_number }}
                </p>
            </div>
        </template>

        <ReadingMemoryCardPage
            v-else
            :chapter-id="selectedChapterId"
            @back="backToChapters"
        />
    </div>
</template>
