<script setup lang="ts">
const props = defineProps<{
    chapterId: string;
}>();
const page = ref(1);
const pageSize = 10;

interface MemoryCardResponse {
    items: MemoryCard[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

const {
    data: result,
    status,
    error,
} = await useFetch<MemoryCardResponse>(
    () => `/api/readings/memorycard/${props.chapterId}`,
    {
        query: {
            page,
            limit: pageSize,
        },
        watch: [page],
    },
);

const cards = computed(() => result.value?.items ?? []);
const totalPages = computed(() => result.value?.totalPages ?? 0);
const totalCards = computed(() => result.value?.total ?? 0);

const flippedCards = ref<Set<string>>(new Set());

function toggleCard(cardId: string) {
    const next = new Set(flippedCards.value);

    if (next.has(cardId)) {
        next.delete(cardId);
    } else {
        next.add(cardId);
    }

    flippedCards.value = next;
}

function changePage(nextPage: number) {
    if (nextPage < 1 || nextPage > totalPages.value) return;

    flippedCards.value = new Set();
    page.value = nextPage;
}

watch(
    () => props.chapterId,
    () => {
        page.value = 1;
        flippedCards.value = new Set();
    },
);
</script>

<template>
    <div class="flex h-screen flex-col overflow-hidden bg-[#191A33] text-white">
        <!-- Header -->
        <header class="flex items-center gap-4 border-b border-white/10 p-6">
            <button
                class="text-sm text-gray-400 hover:text-white"
                @click="navigateTo('/readings')"
            >
                ← Readings
            </button>

            <div>
                <h1 class="text-xl font-semibold">Memory Cards</h1>
                <p class="text-sm text-gray-400">
                    {{ cards?.length ?? 0 }} cards
                </p>
            </div>
        </header>

        <!-- Content -->
        <main class="flex-1 overflow-y-auto p-6">
            <div v-if="status === 'pending'" class="text-gray-400">
                Loading memory cards...
            </div>

            <div v-else-if="error" class="text-red-400">
                Failed to load memory cards.
            </div>

            <div
                v-else-if="!cards?.length"
                class="py-16 text-center text-gray-400"
            >
                No memory cards found for this chapter.
            </div>

            <div v-else class="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                <div
                    v-for="card in cards"
                    :key="card.id"
                    class="flex min-h-72 cursor-pointer flex-col rounded-xl border border-white/10 bg-white/5 p-5 transition hover:border-white/20 hover:bg-white/[0.08]"
                    @click="toggleCard(card.id)"
                >
                    <!-- Card metadata -->
                    <div
                        class="mb-5 flex items-center justify-between gap-3 text-xs text-gray-400"
                    >
                        <span class="truncate">{{ card.chapter }}</span>
                        <span class="shrink-0"
                            >Chunk {{ card.chunk_number }}</span
                        >
                    </div>

                    <!-- Question -->
                    <div v-if="!flippedCards.has(card.id)" class="flex-1">
                        <p
                            class="mb-3 text-xs font-semibold uppercase tracking-wider text-amber-400"
                        >
                            Question
                        </p>

                        <h2 class="text-lg font-medium leading-relaxed">
                            {{ card.question }}
                        </h2>
                    </div>

                    <!-- Answer -->
                    <div v-else class="flex-1">
                        <p
                            class="mb-3 text-xs font-semibold uppercase tracking-wider text-amber-400"
                        >
                            Key Points
                        </p>

                        <ul
                            class="mb-5 list-inside list-disc space-y-2 text-sm leading-relaxed text-gray-200"
                        >
                            <li
                                v-for="(point, index) in card.keypoints"
                                :key="index"
                            >
                                {{ point }}
                            </li>
                        </ul>

                        <p
                            class="mb-2 text-xs font-semibold uppercase tracking-wider text-amber-400"
                        >
                            Answer
                        </p>

                        <p class="text-sm leading-relaxed text-gray-300">
                            {{ card.answer }}
                        </p>
                    </div>

                    <!-- Flip hint -->
                    <div
                        class="mt-5 border-t border-white/10 pt-3 text-center text-xs text-gray-500"
                    >
                        {{
                            flippedCards.has(card.id)
                                ? "Click to view question"
                                : "Click to reveal answer"
                        }}
                    </div>
                </div>
            </div>
            <!-- Pagination -->
            <div
                v-if="totalPages > 0"
                class="mt-8 flex items-center justify-between border-t border-white/10 pt-5"
            >
                <p class="text-sm text-gray-400">
                    Page {{ page }} of {{ totalPages }}
                </p>

                <div class="flex items-center gap-2">
                    <button
                        class="rounded-lg border border-white/10 px-4 py-2 text-sm transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
                        :disabled="page <= 1 || status === 'pending'"
                        @click="changePage(page - 1)"
                    >
                        Previous
                    </button>

                    <button
                        class="rounded-lg border border-white/10 px-4 py-2 text-sm transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
                        :disabled="page >= totalPages || status === 'pending'"
                        @click="changePage(page + 1)"
                    >
                        Next
                    </button>
                </div>
            </div>
        </main>
    </div>
</template>
